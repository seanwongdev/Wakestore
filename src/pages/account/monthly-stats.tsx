import type { GetServerSideProps } from "next";
import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";
import { OrderTable } from "@/components/table/OrderTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  columns as OrderColumns,
  Order,
} from "@/components/table/OrderColumns";

export default function MonthlyStats({ orders }: { orders: Order[] }) {
  const revenue = orders
    .filter((items) => items.payment === true)
    .reduce((acc: any, cur: any) => {
      return acc + +cur.total;
    }, 0);

  const sales = orders.filter((item) => item.payment === true).length;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Overview of your store</CardDescription>
        </CardHeader>
      </Card>
      <div className="mt-6 grid grid-cols-3 gap-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <p>{`$${revenue}`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <p>+{sales}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Best Seller</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <p>Card Content</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <OrderTable data={orders} columns={OrderColumns} />;
      </div>
    </>
  );
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
