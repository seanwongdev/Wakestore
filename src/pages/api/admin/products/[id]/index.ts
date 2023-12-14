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
    const result = await client.query(
      "SELECT * FROM product_items WHERE is_deleted = false AND id = $1",
      [id]
    );
    const products = result.rows[0];
    client.release();

    res.status(200).json({ products });
  }
  if (req.method === "PATCH") {
    const { id } = req.query;
    const { name, price, quantity, product_category_id, url, image_url } =
      req.body;
    const modifiedAt = new Date().toLocaleDateString("en-CA");
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE product_items SET name=$2,price=$3, quantity=$4, product_category_id=$5, url=$6, modified_at=$7, image_url = $8 WHERE id = $1",
      [
        id,
        name,
        price,
        quantity,
        product_category_id,
        url,
        modifiedAt,
        image_url,
      ]
    );
    const products = result.rows[0];
    client.release();

    res.status(200).json({ products });
  }
}
