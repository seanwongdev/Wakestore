import pool from "@/database/db";
import errorHandler from "@/middleware/error-handler";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { id } = req.query;

      const client = await pool.connect();
      const result = await client.query(
        "SELECT password FROM users WHERE id=$1 ",
        [id]
      );
      const userData = result.rows[0];
      client.release();

      res.status(200).json({ userData });
    } else if (req.method === "PATCH") {
      const { id } = req.query;
      const { updatedPassword } = req.body;
      const modifiedAt = new Date().toLocaleDateString("en-CA");
      const client = await pool.connect();
      const result = await client.query(
        "UPDATE users SET password=$1, modified_at=$2 WHERE id=$3 ",
        [updatedPassword, modifiedAt, id]
      );
      const user = result.rows[0];
      client.release();

      res.status(200).json({ user });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (err: any) {
    errorHandler(err, req, res);
  }
}
