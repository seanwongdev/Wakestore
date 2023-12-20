import type { GetServerSideProps } from "next";
import { OrderTable } from "@/components/table/OrderTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons/faDollarSign";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons/faCreditCard";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons/faThumbsUp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  columns as OrderColumns,
  Order,
} from "@/components/table/OrderColumns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils/formatCurrency";

import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";
import DashboardChart from "@/components/table/DashboardChart";

interface OrderItems {
  order_id: number;
  payment: boolean;
  product_item_id: number;
  product_name: string;
  quantity_ordered: number;
  price: string;
  date: string;
}

interface salesByCollectionByMonth {
  name: string;
  collection_name: string;
  total_sales: string;
}

export default function MonthlyStats({
  orders,
  orderItems,
  salesByCollectionByMonth,
}: {
  orders: Order[];
  orderItems: OrderItems[];
  salesByCollectionByMonth: salesByCollectionByMonth[];
}) {
  const [showCharts, setShowCharts] = useState(false);
  const revenue = orders
    .filter((items) => items.payment === true)
    .reduce((acc: any, cur: any) => {
      return acc + +cur.total;
    }, 0);

  const sales = orders.filter((item) => item.payment === true).length;

  const totalSalesPerProduct = orderItems
    .filter((item) => item.payment === true)
    ?.reduce((acc: any, cur: any) => {
      const { product_item_id, quantity_ordered } = cur;
      if (acc[product_item_id] === undefined) {
        acc[product_item_id] = quantity_ordered;
      } else {
        acc[product_item_id] += quantity_ordered;
      }
      return acc;
    }, {});

  let maxQuantity = 0;
  let correspondingId;
  Object.entries(totalSalesPerProduct).map((row) => {
    if (row[1] > maxQuantity) {
      maxQuantity = row[1];
      correspondingId = parseInt(row[0], 10);
    }
  });
  const bestSeller = orderItems.find(
    (item) => item.product_item_id === correspondingId
  )?.product_name;

  // manipulating to get desired format for reChart
  const getMonthName = (monthNumber) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthNumber - 1];
  };

  const resultObject = {};

  salesByCollectionByMonth.forEach((item) => {
    const monthName = getMonthName(parseInt(item.name, 10));
    const collectionName = item.collection_name;
    const key = monthName;
    if (!resultObject[key]) {
      resultObject[key] = { name: key };
    }

    resultObject[key][collectionName] = parseFloat(item.total_sales);
  });

  const finalOutput = Object.values(resultObject);

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle>Dashboard</CardTitle>
            <Button onClick={() => setShowCharts((state) => !state)}>
              {showCharts ? "View Orders" : "View Charts"}
            </Button>
          </div>
          <CardDescription>Overview of your store</CardDescription>
        </CardHeader>
      </Card>
      <div className="mt-6 grid grid-cols-3 gap-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <FontAwesomeIcon className="text-gray-400" icon={faDollarSign} />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <p>{formatCurrency(parseFloat(revenue))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <FontAwesomeIcon className="text-gray-400" icon={faCreditCard} />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <p>+{sales}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Best Seller</CardTitle>
            <FontAwesomeIcon className="text-gray-400" icon={faThumbsUp} />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <p>
              {bestSeller} (+{maxQuantity} sales)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        {showCharts ? (
          <DashboardChart data={finalOutput} />
        ) : (
          <OrderTable data={orders} columns={OrderColumns} />
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = (async (context) => {
  const client = await pool.connect();
  const { rows } = await client.query("SELECT * FROM orders ");
  const results = await client.query(
    "SELECT * FROM orders JOIN order_items ON orders.id = order_items.order_id JOIN product_items ON product_items.id = order_items.product_item_id"
  );

  const output = await client.query(
    "SELECT EXTRACT(MONTH FROM oi.created_on) AS month, ps.collection_name, SUM(oi.quantity_ordered * pi.price) AS total_sales FROM order_items oi JOIN product_items pi ON oi.product_item_id = pi.id JOIN product_category pc ON pi.product_category_id = pc.category_id JOIN product_collections ps ON ps.collection_id = pc.product_collection_id JOIN orders o ON oi.order_id = o.id WHERE o.payment=true GROUP BY month, ps.collection_name"
  );

  const orderItems = results.rows;
  const salesByCollectionByMonth = output.rows;
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
      orderItems: orderItems.map((item) => ({
        order_id: item.order_id,
        payment: item.payment,
        product_item_id: item.product_item_id,
        product_name: item.name,
        quantity_ordered: item.quantity_ordered,
        price: item.price,
        date: new Date(item.order_modified_at).toISOString(),
      })),
      salesByCollectionByMonth: salesByCollectionByMonth.map((item) => ({
        name: item.month,
        collection_name: item.collection_name,
        total_sales: item.total_sales,
      })),
    },
  };
}) satisfies GetServerSideProps;

MonthlyStats.PageLayout = ProfileLayout;
