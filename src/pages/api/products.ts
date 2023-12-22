import pool from "@/database/db";
import errorHandler from "@/middleware/error-handler";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { keyword } = req.body;
      const client = await pool.connect();
      const { rows } = await client.query(
        "SELECT * FROM product_items WHERE name ILIKE $1",
        [`%${keyword}%`]
      );
      client.release();
      res.status(200).json({ products: rows });
    } else if (req.method === "GET") {
      const client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM product_items WHERE is_deleted = false"
      );
      const products = result.rows;
      client.release();

      res.status(200).json({ products });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (err: any) {
    errorHandler(err, req, res);
  }
}
