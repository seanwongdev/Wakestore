// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import errorHandler from "@/middleware/error-handler";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { id } = req.query;
      const client = await pool.connect();
      const { rows } = await client.query(
        "SELECT user_id, carts.cart_id, cartitems_id, product_item_id, name, quantity_ordered, price FROM carts JOIN cart_items ON carts.cart_id = cart_items.cart_id JOIN product_items ON cart_items.product_item_id = product_items.id WHERE carts.cart_id = $1  ORDER BY cartitems_id ASC",
        [id]
      );

      client.release();

      res.status(200).json(rows);
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (err: any) {
    errorHandler(err, req, res);
  }
}
