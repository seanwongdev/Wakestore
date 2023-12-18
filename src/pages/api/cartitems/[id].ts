// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    const { id } = req.query;
    const modifiedAt = new Date().toLocaleDateString("en-CA");
    const { quantityOrdered } = req.body;

    const client = await pool.connect();
    const { rows } = await client.query(
      "UPDATE cart_items SET quantity_ordered = $1, modified_at= $2 WHERE cartitems_id = $3 RETURNING cartitems_id, quantity_ordered ",
      [quantityOrdered, modifiedAt, id]
    );

    client.release();

    res.status(200).json({ cartitem: rows[0] });
  }
  if (req.method === "DELETE") {
    const { id } = req.query;

    const client = await pool.connect();
    const { rows } = await client.query(
      "DELETE FROM cart_items WHERE cartitems_id = $1",
      [id]
    );

    client.release();

    res.status(200).json({ cartitem: rows[0] });
  }
}
