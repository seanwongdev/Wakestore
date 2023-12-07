// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await pool.connect();
  const result = await client.query(
    "SELECT * FROM product_category JOIN product_collections ON product_category.product_collection_id = product_collections.collection_id"
  );
  const category = result.rows;
  client.release();

  res.status(200).json({ category });
}
