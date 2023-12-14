// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM product_items WHERE is_deleted = false"
    );
    const products = result.rows;
    client.release();

    res.status(200).json({ products });
  }
}
