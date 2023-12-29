import type { GetServerSideProps } from "next";

import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";
import { UserTable } from "@/components/table/userTable";
import { columns as userColumn } from "@/components/table/userColumns";

export interface AllUsersProps {
  id: number;
  username: string;
  email: string;
  role: string;
  img_url: string;
}

export default function AllUsers({ users }: { users: AllUsersProps[] }) {
  return <UserTable users={users} columns={userColumn} />;
}

export const getServerSideProps = (async (context) => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(
      "SELECT * FROM users WHERE role = 'user'"
    );
    client.release();
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
  } catch (err) {
    console.error("Error in getServerSideProps:", err);
    return { notFound: true };
  }
}) satisfies GetServerSideProps;

AllUsers.PageLayout = ProfileLayout;
