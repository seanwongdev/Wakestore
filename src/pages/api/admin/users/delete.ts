// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const idsArray = req.body;
    const client = await pool.connect();
    await client.query("DELETE FROM users WHERE id = ANY($1)", [idsArray]);

    client.release();

    res.status(200).json({});
  }
}
