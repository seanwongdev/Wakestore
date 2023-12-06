// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await pool.connect();
  const result = await client.query("SELECT * FROM product_items");
  const products = result.rows;
  console.log(products);
  res.status(200).json({ products });
}
