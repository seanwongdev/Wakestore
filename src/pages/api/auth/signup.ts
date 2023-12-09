import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, email, password } = req.body;
  const created_on = new Date().toLocaleDateString("en-CA");
  const modified_at = new Date().toLocaleDateString("en-CA");
  const hashedPassword = await bcrypt.hash(password, 12);
  // need to solve later issue of checking if code is modified before password is rehashed

  const client = await pool.connect();
  await client.query(
    "INSERT INTO users(username, password, email, created_on, modified_at) VALUES ($1, $2, $3, $4, $5)",
    [username, hashedPassword, email, created_on, modified_at]
  );
  const result = await client.query(
    "SELECT * FROM users ORDER BY id desc LIMIT 1"
  );
  client.release();

  res.status(201).json({
    status: "success",
    data: { user: result.rows[0] },
  });
}
