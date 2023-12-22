// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import pool from "@/database/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { isAdminRequest } from "../../auth/[...nextauth]";
import errorHandler from "@/middleware/error-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await isAdminRequest(req, res);

    if (req.method === "GET") {
      const client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM product_items WHERE is_deleted = false"
      );
      const products = result.rows;
      client.release();

      res.status(200).json({ products });
    } else if (req.method === "POST") {
      const createdOn = new Date().toLocaleDateString("en-CA");
      const modifiedAt = new Date().toLocaleDateString("en-CA");
      const { product } = req.body;

      const client = await pool.connect();
      const { rows } = await client.query(
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
      const insertedProd = rows[0];
      client.release();

      res.status(201).json({ insertedProd });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (err: any) {
    errorHandler(err, req, res);
  }
}
