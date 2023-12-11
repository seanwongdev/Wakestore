import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, email, password, passwordConfirm } = req.body;
  const created_on = new Date().toLocaleDateString("en-CA");
  const modified_at = new Date().toLocaleDateString("en-CA");
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  try {
    if (username.length < 3)
      throw new Error("Your username needs to be min 3 characters");

    if (!emailRegex.test(email))
      throw new Error("Your email does not appear to be valid");

    if (passwordConfirm !== password)
      throw new Error("Your passwords do not match!");

    if (password.length < 6)
      throw new Error("Your password needs to be min 6 characters");

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
  } catch (err: any) {
    res.status(401).json({
      status: "error",
      message: err.message,
    });
  }
}
