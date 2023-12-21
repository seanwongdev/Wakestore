// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { guid } = req.query;
  const client = await pool.connect();
  const result = await client.query(
    "SELECT user_id, guid,address, phone,total, order_modified_at, pi.name, quantity_ordered, price FROM orders o JOIN order_items oi ON oi.order_id = o.id JOIN product_items pi ON pi.id = oi.product_item_id WHERE o.guid = $1 AND payment=true",
    [guid]
  );
  const orderItems = result.rows;
  client.release();

  res.status(200).json(orderItems);
}
