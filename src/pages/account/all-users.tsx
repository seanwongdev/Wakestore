import type { GetServerSideProps } from "next";
import { User } from "next-auth";
import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";
import { UserTable } from "@/components/table/userTable";
import { columns as userColumn } from "@/components/table/userColumns";

export default function AllUsers({ users }: { users: User[] }) {
  console.log(users);
  return <UserTable data={users} columns={userColumn} />;
}

export const getServerSideProps = (async (context) => {
  const client = await pool.connect();
  const { rows } = await client.query(
    "SELECT * FROM users WHERE role = 'user'"
  );
  return {
    props: {
      users: rows.map((row) => ({
        id: row.id,
        username: row.username,
        email: row.email,
        role: row.role,
        img_url: row.img_url,
      })),
    },
  };
}) satisfies GetServerSideProps;

AllUsers.PageLayout = ProfileLayout;
