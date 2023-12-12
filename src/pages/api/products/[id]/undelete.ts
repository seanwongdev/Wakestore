// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== "PATCH") return;

  const client = await pool.connect();
  const result = await client.query(
    "UPDATE product_items SET is_deleted = false WHERE id = $1",
    [id]
  );
  const products = result.rows[0];
  client.release();

  res.status(200).json({ products });
}
