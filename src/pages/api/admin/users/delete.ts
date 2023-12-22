// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { isAdminRequest } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await isAdminRequest(req, res);

    if (req.method === "DELETE") {
      const idsArray = req.body;
      const client = await pool.connect();
      await client.query("DELETE FROM users WHERE id = ANY($1)", [idsArray]);

      client.release();

      res.status(200).json({});
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (err) {
    console.error("Error in API handler:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
