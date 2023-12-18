// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { productId, cartId } = req.body;
    const createdOn = new Date().toLocaleDateString("en-CA");
    const modifiedAt = createdOn;
    const client = await pool.connect();
    const { rows } = await client.query(
      "WITH inserted_cart_item AS (INSERT INTO cart_items(cart_id, product_item_id, quantity_ordered, created_on, modified_at) VALUES($1, $2, $3, $4,$5) RETURNING cartitems_id, product_item_id, quantity_ordered) SELECT c.user_id, ic.cartitems_id, ic.product_item_id, ic.quantity_ordered FROM inserted_cart_item ic JOIN carts c on c.cart_id = $1",
      [cartId, productId, 1, createdOn, modifiedAt]
    );
    client.release();

    res.status(200).json({ cartItem: rows[0] });
  }
}
