// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import errorHandler from "@/middleware/error-handler";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM product_collections");
      const collection = result.rows;
      client.release();

      res.status(200).json({ collection });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (err: any) {
    errorHandler(err, req, res);
  }
}
