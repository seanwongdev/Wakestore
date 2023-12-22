import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSadCry } from "@fortawesome/free-regular-svg-icons/faFaceSadCry";
import { useEffect, useState } from "react";

import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";
import OrderItem from "@/components/OrderItem";
import { toast } from "react-toastify";

interface Orders {
  user_id: number;
  guid: string;
  address: string;
  phone: string;
  total: string;
  date: string;
  name: string;
  quantity: number;
  price: string;
}

interface OrderProps {
  orders: Orders[];
}

export default function ViewOrders({ orders }: OrderProps) {
  const dateOptions = { day: "numeric", month: "short", year: "numeric" };
  const [order, setOrder] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        if (!order) {
          setData([]);
          return;
        }
        const res = await fetch(`/api/order/${order}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch order details for ${order} `);
        }
        const orderItems = await res.json();
        setData(orderItems);
      } catch (err: any) {
        toast.error(err.message);
      }
    };
    fetchOrderData();
  }, [order]);

  return (
    <>
      {orders.length > 0 ? (
        <div className="space-x-4">
          <span className="font-semibold">Which order?</span>
          <select
            className="border border-gray-700 rounded p-2.5 "
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            {" "}
            <option value="">Select an order below...</option>
            {orders?.map((order) => (
              <option key={order.guid} value={order.guid}>
                {new Intl.DateTimeFormat("en-GB", dateOptions).format(
                  new Date(order.date)
                )}{" "}
                : {order.guid.toUpperCase()} -{" "}
                {formatCurrency(parseFloat(order.total))}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="font-semibold text-center">
          You do not have any orders{" "}
          <FontAwesomeIcon className="text-2xl" icon={faFaceSadCry} />
        </div>
      )}
      <OrderItem data={data} />
    </>
  );
}

export const getServerSideProps = (async (context) => {
  try {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );

    const client = await pool.connect();
    const { rows } = await client.query(
      "SELECT user_id, guid, total, order_modified_at FROM orders o WHERE o.user_id = $1 AND payment=true",
      [session?.user.id]
    );

    client.release();
    return {
      props: {
        orders: rows.map((row) => ({
          user_id: row.user_id,
          guid: row.guid,
          total: row.total,
          date: new Date(row.order_modified_at).toISOString(),
        })),
      },
    };
  } catch (err) {
    console.error("Error in getServerSideProps:", err);
    return {
      notFound: true,
    };
  }
}) satisfies GetServerSideProps;

ViewOrders.PageLayout = ProfileLayout;
