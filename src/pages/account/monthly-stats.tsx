import type { GetServerSideProps } from "next";
import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";
import { OrderTable } from "@/components/table/OrderTable";
import {
  columns as OrderColumns,
  Order,
} from "@/components/table/OrderColumns";

export default function MonthlyStats({ orders }: { orders: Order[] }) {
  return <OrderTable data={orders} columns={OrderColumns} />;
}

export const getServerSideProps = (async (context) => {
  const client = await pool.connect();
  const { rows } = await client.query("SELECT * FROM orders");
  client.release();
  return {
    props: {
      orders: rows.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        total: item.total,
        payment: item.payment,
        address: item.address,
        phone: item.phone,
      })),
    },
  };
}) satisfies GetServerSideProps;

MonthlyStats.PageLayout = ProfileLayout;
