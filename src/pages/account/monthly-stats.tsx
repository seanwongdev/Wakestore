import type { GetServerSideProps } from "next";
import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";

export default function MonthlyStats() {
  return <div>ADMIN: View Orders states amongst other things</div>;
}

export const getServerSideProps = (async (context) => {
  const client = await pool.connect();
  const { rows } = await client.query("SELECT * FROM orders");
  return {
    props: {
      orders: [...rows],
    },
  };
}) satisfies GetServerSideProps;

MonthlyStats.PageLayout = ProfileLayout;
