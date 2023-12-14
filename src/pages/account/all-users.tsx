import type { GetServerSideProps } from "next";
import { User } from "next-auth";
import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";

export default function AllUsers({ users }: { users: User[] }) {
  console.log(users);
  return (
    <div>
      ADMIN: View All Users
      {users.map((user) => user.username)}
    </div>
  );
}

export const getServerSideProps = (async (context) => {
  const client = await pool.connect();
  const { rows } = await client.query("SELECT * FROM users");
  return {
    props: {
      users: rows.map((row) => ({
        id: row.id,
        username: row.username,
        email: row.username,
        role: row.role,
        img_url: row.img_url,
      })),
    },
  };
}) satisfies GetServerSideProps;

AllUsers.PageLayout = ProfileLayout;
