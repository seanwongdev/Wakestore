// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    const idArray = req.body;
    console.log(idArray);
    const client = await pool.connect();
    await client.query(
      "UPDATE product_items SET is_deleted = true WHERE id = ANY($1)",
      [idArray]
    );
    const result = await client.query(
      "SELECT id, is_deleted FROM product_items WHERE id = ANY($1)",
      [idArray]
    );
    const products = result.rows;
    client.release();

    res.status(200).json({ products });
  }
}
