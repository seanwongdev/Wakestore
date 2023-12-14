import type { GetStaticPaths, GetStaticProps } from "next";
import pool from "@/database/db";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "next-auth";
import ProfileLayout from "@/components/layout/ProfileLayout";
import Button from "@/components/Button";

export default function EditPage({ user }: { user: User }) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userId = user.id;
    const newUser = {
      username,
      email,
      role,
    };
    const res = await fetch(`/api/admin/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({ newUser }),
    });
    const data = await res.json();
    router.push("/account/all-users");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="product">Username</label>
            <input
              className="rounded-md py-2 border border-gray-600 bg-white px-6"
              type="text"
              id="product"
              placeholder="Hyperlite Wakeboard 2023"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="description">Email</label>
            <input
              className="rounded-md py-2 border border-gray-600 bg-white px-6"
              id="description"
              placeholder="Write your product description here..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="category">Role</label>
            <select
              className="rounded-md py-2 border border-gray-600 bg-white px-6"
              id="category"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end">
            <Button type="primary">Submit</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export const getStaticProps = (async (context) => {
  const { id } = context.params;
  const client = await pool.connect();
  const { rows } = await client.query(
    "SELECT * from users WHERE role = 'user' AND  id = $1",
    [id]
  );
  console.log(rows);
  client.release();
  return {
    props: {
      user: {
        id: rows[0].id,
        username: rows[0].username,
        email: rows[0].email,
        role: rows[0].role,
      },
    },
  };
}) satisfies GetStaticProps;

export const getStaticPaths = (async () => {
  const client = await pool.connect();
  const { rows } = await client.query(
    "SELECT id from users WHERE role = 'user'"
  );
  client.release();
  return {
    paths: rows.map((user) => ({
      params: {
        id: user.id.toString(),
      },
    })),
    fallback: false,
  };
}) satisfies GetStaticPaths;

EditPage.PageLayout = ProfileLayout;
