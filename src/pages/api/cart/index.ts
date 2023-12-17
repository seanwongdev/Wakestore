// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const userId = req.body;
    const createdOn = new Date().toLocaleDateString("en-CA");
    const modifiedAt = createdOn;
    const client = await pool.connect();
    const { rows } = await client.query(
      "INSERT INTO carts(user_id, created_on, modified_at) VALUES($1, $2, $3) RETURNING ",
      [userId, createdOn, modifiedAt]
    );
    client.release();

    res.status(200).json({ cart: rows[0] });
  }
}
