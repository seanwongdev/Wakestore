import { GetStaticPaths, GetStaticProps } from "next";
import { User } from "next-auth";

import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";
import { Button } from "@/components/ui/button";

export default function EditUser({ user }: { user: User }) {
  const handleSubmit = () => {};
  return (
    <form className="flex flex-col space-y-4" onSubmit={() => {}}>
      <div className="flex justify-between w-[450px] items-center">
        <label htmlFor="username" className="font-semibold">
          Username
        </label>
        <input
          type="text"
          id="username"
          className="border rounded border-gray-500 p-1.5 w-[350px]"
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
        />
      </div>
      <div className="flex justify-between w-[450px] items-center">
        <label className="font-semibold" htmlFor="file_input">
          Upload file
        </label>
        <input
          className="block w-[78%] text-sm  text-gray-900 border border-gray-600 rounded file:bg-gray-600 file:rounded file:py-2 file:text-white"
          id="file_input"
          type="file"
          multiple={true}
          onChange={(e) => setImages(e.target.files)}
        />
      </div>
      <div className="flex justify-between w-[450px] items-center">
        <label htmlFor="password" className="font-semibold">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="border rounded border-gray-500 p-1.5 w-[350px] "
        />
      </div>
      <div className="flex justify-end w-[450px] items-center">
        <Button className="w-[100px]">Update</Button>
      </div>
    </form>
  );
}

export const getStaticProps = (async (context) => {
  try {
    const { user } = context.params;
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
    };
  } catch (err) {
    console.error("Error in getStaticProps:", err);
    return {
      notFound: true,
    };
  }
}) satisfies GetStaticProps;

export const getStaticPaths = (async () => {
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
}) satisfies GetStaticPaths;

EditUser.PageLayout = ProfileLayout;
