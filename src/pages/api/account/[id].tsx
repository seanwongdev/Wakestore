// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import errorHandler from "@/middleware/error-handler";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "PATCH") {
      const { id } = req.query;
      const { username, email, image_url } = req.body;
      const modifiedAt = new Date().toLocaleDateString("en-CA");
      const client = await pool.connect();
      const result = await client.query(
        "UPDATE users SET username=$1, email=$2, img_url=$3, modified_at=$4 WHERE id=$5 ",
        [username, email, image_url, modifiedAt, id]
      );
      const user = result.rows[0];
      client.release();

      res.status(200).json({ user });
    } else if (req.method === "GET") {
      const { id } = req.query;

      const client = await pool.connect();
      const result = await client.query(
        "SELECT id, email, img_url FROM users WHERE id=$1 ",
        [id]
      );
      const userData = result.rows[0];
      client.release();

      res.status(200).json({ userData });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (err: any) {
    errorHandler(err, req, res);
  }
}
