import pool from "@/database/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { keyword } = req.body;
    const client = await pool.connect();
    const { rows } = await client.query(
      "SELECT * FROM product_items WHERE name ILIKE $1",
      [`%${keyword}%`]
    );
    client.release();
    res.status(200).json({ products: rows });
  }
}
