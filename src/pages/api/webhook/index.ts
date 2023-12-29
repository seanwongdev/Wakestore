import type { NextApiRequest, NextApiResponse } from "next";

import { buffer } from "micro";
import Stripe from "stripe";
import pool from "@/database/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);
  let event;

  try {
    if (!sig || !endpointSecret) return;
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const address = session?.customer_details?.address;
  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];
  const addressStr = addressComponents.filter((obj) => obj !== null).join(", ");
  const phoneStr = session?.customer_details?.phone || "";
  const orderId = session?.metadata?.orderId;
  const userId = session?.metadata?.userId;
  const modifiedAt = new Date().toLocaleDateString("en-CA");
  if (event.type === "checkout.session.completed") {
    const client = await pool.connect();
    await client.query(
      "UPDATE orders SET payment=true, address=$1, phone=$2, order_modified_at=$3 WHERE id = $4 ",
      [addressStr, phoneStr, modifiedAt, orderId]
    );

    if (userId) {
      const { rows } = await client.query(
        "SELECT cart_id FROM carts WHERE user_id = $1",
        [userId]
      );
      const { cart_id } = rows[0];
      await client.query("DELETE FROM cart_items WHERE cart_id = $1 ", [
        cart_id,
      ]);
      await client.query("DELETE FROM carts WHERE cart_id = $1 ", [cart_id]);
    }

    client.release();
  }

  res.status(200).json(null);
}
