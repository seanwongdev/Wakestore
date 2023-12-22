// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await isAdminRequest(req, res);
    if (req.method === "GET") {
      const { id } = req.query;
      const client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM users WHERE role = 'user' AND id= $1",
        [id]
      );
      const user = result.rows[0];
      client.release();

      res.status(200).json({ user });
    } else if (req.method === "PATCH") {
      const { id } = req.query;
      const { username, email, role, image_url } = req.body.newUser;
      const modifiedAt = new Date().toLocaleDateString("en-CA");
      const client = await pool.connect();
      await client.query(
        "UPDATE users SET username=$2,email=$3,role=$4, modified_at=$5  WHERE id = $1",
        [id, username, email, role, modifiedAt]
      );

      const { rows } = await client.query("SELECT * FROM users where id = $1", [
        id,
      ]);

      const user = rows[0];
      client.release();

      res.status(200).json({ user });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (err) {
    console.error("Error in API handler:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
