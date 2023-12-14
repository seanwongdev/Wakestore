// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM product_items WHERE is_deleted = false"
    );
    const products = result.rows;
    client.release();

    res.status(200).json({ products });
  }
  if (req.method === "POST") {
    const createdOn = new Date().toLocaleDateString("en-CA");
    const modifiedAt = new Date().toLocaleDateString("en-CA");
    const { product } = req.body;
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO product_items(name, description, quantity, price, product_category_id, url, created_on, modified_at, image_url)  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        product.name,
        product.description,
        product.quantity,
        product.price,
        product.product_category_id,
        product.url,
        createdOn,
        modifiedAt,
        product.image_url,
      ]
    );

    client.release();

    res.status(201).json({ product });
  }
}
