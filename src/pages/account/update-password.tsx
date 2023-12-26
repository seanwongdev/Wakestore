import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";

import ProfileLayout from "@/components/layout/ProfileLayout";
import bcrypt from "bcryptjs";
import { Button } from "@/components/ui/button";

interface FormDataType {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UpdatePassword() {
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormDataType>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (!session) return;

      if (!formData.oldPassword) {
        throw new Error("Please input old password to verify changes");
      }

      if (formData.newPassword !== formData.confirmPassword)
        throw new Error("New passwords do not match!");

      if (!formData.newPassword)
        throw new Error("New password cannot be an empty field");

      if (formData.newPassword === formData.oldPassword)
        throw new Error(
          "New password cannot be the same as your current password"
        );

      const response = await fetch(`/api/account/pw/${session?.user?.id}`);
      if (!response.ok) throw new Error("Failed to fetch user data");
      const { userData } = await response.json();

      const isPasswordMatched = await bcrypt.compare(
        formData.oldPassword,
        userData.password
      );

      if (!isPasswordMatched) throw new Error("Invalid Password");

      const updatedPassword = await bcrypt.hash(formData.newPassword, 12);

      const res = await fetch(`/api/account/pw/${session?.user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedPassword }),
      });

      if (!res.ok) throw new Error("Failed to update user data");

      toast.success("Successfully updated password");
    } catch (err: any) {
      console.error("Error in updating user data:", err);
      setError(err.message);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col w-[300px] gap-1">
          <label htmlFor="oldPassword" className="font-semibold">
            Old Password
          </label>
          <input
            id="oldPassword"
            type="password"
            className="rounded border border-gray-500 py-1 px-3.5"
            value={formData.oldPassword}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col w-[300px] gap-1">
          <label htmlFor="newPassword" className="font-semibold">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="rounded border border-gray-500 py-1 px-3.5"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col w-[300px] gap-1">
          <label htmlFor="confirmPassword" className="font-semibold">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="rounded border border-gray-500 py-1 px-3.5"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <div className="text-red-500 font-semibold">{error ? error : ""}</div>
        <div className="w-[300px] text-end pt-4">
          <Button>Update</Button>
        </div>
      </form>
    </div>
  );
}
UpdatePassword.PageLayout = ProfileLayout;
