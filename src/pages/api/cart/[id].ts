// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;
    const client = await pool.connect();
    const { rows } = await client.query("SELECT * FROM carts WHERE id = $1", [
      id,
    ]);

    client.release();

    res.status(200).json({ cart: rows[0] });
  }
}
