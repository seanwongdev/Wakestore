import { GetStaticPaths, GetStaticProps } from "next";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import { uploadCloudinary } from "@/lib/utils/upload";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";
import bcrypt from "bcryptjs";
import { useRouter } from "next/router";

interface UserForm {
  username: string | undefined;
  email: string | undefined | null;
  files: FileList | null;
  password: string;
}

export default function EditUser({ user }: { user: User }) {
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<UserForm>({
    username: session?.user?.username,
    email: session?.user?.email,
    files: null,
    password: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [target.id]: target.value }));
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [target.id]: target.files }));
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.password) {
        throw new Error("Please input password to confirm changes");
      }

      const response = await fetch(`/api/account/pw/${session?.user?.id}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const { userData } = await response.json();

      const isPasswordMatched = await bcrypt.compare(
        formData.password,
        userData.password
      );

      if (!isPasswordMatched) throw new Error("Invalid Password");

      if (!formData.files) return;
      const data = await uploadCloudinary(formData.files[0]);

      const updatedUser = {
        username: formData.username,
        email: formData.email,
        image_url: data,
      };

      const res = await fetch(`/api/account/${session?.user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Failed to update user data");

      toast.success("Successfully updated personal info");
    } catch (err: any) {
      console.error("Error in updating user data:", err);
      setError(err.message);
    }
  };
  return (
    <>
      <button className="mt-2 text-xl" onClick={() => router.back()}>
        <FontAwesomeIcon icon={faCircleChevronLeft} />
      </button>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <div className="flex justify-between w-[450px] items-center">
          <label htmlFor="username" className="font-semibold">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="border rounded border-gray-500 p-1.5 w-[350px]"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between w-[450px] items-center">
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="border rounded border-gray-500 p-1.5 w-[350px] "
            value={formData.email ?? ""}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between w-[450px] items-center">
          <label className="font-semibold" htmlFor="files">
            Upload file
          </label>
          <input
            className="block w-[78%] text-sm  text-gray-900 border border-gray-600 rounded file:bg-gray-600 file:rounded file:py-2 file:text-white"
            id="files"
            type="file"
            multiple={false}
            onChange={handleFileChange}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between w-[450px] items-center">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border rounded border-gray-500 p-1.5 w-[350px] "
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <span className="px-24 text-red-500 font-semibold">{error}</span>
        </div>

        <div className="flex justify-end w-[450px] items-center">
          <Button className="w-[100px]">Update</Button>
        </div>
      </form>
    </>
  );
}

export const getStaticProps = (async (context) => {
  try {
    const { user } = context.params as { user: string };
    const client = await pool.connect();
    const { rows } = await client.query("SELECT * FROM users WHERE id = $1", [
      user,
    ]);
    client.release();
    return {
      props: {
        user: {
          username: rows[0].username,
          email: rows[0].email,
          img_url: rows[0].img_url,
        },
      },
      revalidate: 120,
    };
  } catch (err) {
    console.error("Error in getStaticProps:", err);
    return {
      notFound: true,
    };
  }
}) satisfies GetStaticProps;

export const getStaticPaths = async () => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query("SELECT id FROM users");
    client.release();
    return {
      paths: rows.map((item) => ({
        params: {
          user: item.id.toString(),
        },
      })),
      fallback: false,
    };
  } catch (err) {
    console.error("Error in getStaticPaths:", err);
    return { notFound: true };
  }
};

EditUser.PageLayout = ProfileLayout;
