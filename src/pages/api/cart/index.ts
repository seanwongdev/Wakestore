// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const user_id = req.body;

    const createdOn = new Date().toLocaleDateString("en-CA");
    const modifiedAt = createdOn;
    const client = await pool.connect();
    const { rows } = await client.query(
      "INSERT INTO carts(user_id, created_on, modified_at) VALUES($1, $2, $3) RETURNING cart_id, user_id ",
      [user_id, createdOn, modifiedAt]
    );
    client.release();

    res.status(200).json({ cart: rows[0] });
  }
  if (req.method === "PATCH") {
    const id = req.body;

    const client = await pool.connect();
    const { rows } = await client.query(
      "SELECT user_id, carts.cart_id, cartitems_id, product_item_id, name, quantity_ordered, price FROM carts JOIN cart_items ON carts.cart_id = cart_items.cart_id JOIN product_items ON cart_items.product_item_id = product_items.id WHERE carts.user_id = $1  ORDER BY cartitems_id ASC",
      [id]
    );
    client.release();

    res.status(200).json(rows);
  }
}
