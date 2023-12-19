import type { NextApiRequest, NextApiResponse } from "next";
import { CartItem } from "@/context/CartContext";
import ProductImage from "../account/manage-items/[id]";
import pool from "@/database/db";
import { create } from "domain";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { cartItems } = req.body;
    const data: CartItem[] = cartItems;
    try {
      const getActive = await stripe.products.list({
        active: true,
      });

      //check if cart is already in active products list
      for (const product of data) {
        const existingProd = getActive.data.find(
          (item: any) => item.name.toLowerCase() === product.name.toLowerCase()
        );

        if (!existingProd) {
          const createdProd = await stripe.products.create({
            name: product.name,
            active: true,
            default_price_data: {
              unit_amount: Math.ceil(+product.price * 100),
              currency: "USD",
            },
          });
        }
      }

      const createdOn = new Date().toLocaleDateString("en-CA");
      const userId = data[0].user_id;

      const total = data
        .reduce((acc, cur) => acc + +cur.price * cur.quantity_ordered, 0)
        .toFixed(2);

      const client = await pool.connect();
      const { rows } = await client.query(
        "INSERT INTO orders(user_id, total, created_on,modified_at) VALUES($1, $2, $3, $4) RETURNING id",
        [userId, total, createdOn, createdOn]
      );
      const order = rows[0];

      let stripeItems: any = [];
      for (const product of data) {
        const matchedItemId = getActive.data.find(
          (item: any) => item.name.toLowerCase() === product.name.toLowerCase()
        )?.default_price;
        stripeItems.push({
          price: matchedItemId,
          quantity: product.quantity_ordered,
        });
      }

      const session = await stripe.checkout.sessions.create({
        line_items: stripeItems,
        mode: "payment",
        shipping_address_collection: {
          allowed_countries: ["US"],
        },
        phone_number_collection: {
          enabled: true,
        },
        success_url: `${req.headers.origin}/checkout/success`,
        cancel_url: `${req.headers.origin}/checkout/rejected`,
        metadata: { orderId: order.id },
      });
      res.status(200).json({ url: session.url });
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
