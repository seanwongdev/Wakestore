// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await pool.connect();
  const result = await client.query("SELECT * FROM product_collections");
  const collection = result.rows;
  client.release();

  res.status(200).json({ collection });
}
