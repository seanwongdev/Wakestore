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
      let stripeItems: any = [];
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

          const createdMatchedItemId = createdProd.default_price;
          console.log(createdProd, createdMatchedItemId);
          const createdStripeItem = {
            price: createdMatchedItemId,
            quantity: product.quantity_ordered,
          };
          stripeItems.push(createdStripeItem);
        } else {
          const existingMatchedItemId = existingProd.default_price;
          const existingStripeItem = {
            price: existingMatchedItemId,
            quantity: product.quantity_ordered,
          };
          console.log(existingProd, existingMatchedItemId);
          stripeItems.push(existingStripeItem);
        }
      }

      // creating order
      const createdOn = new Date().toLocaleDateString("en-CA");
      const userId = data[0].user_id;
      const total = data
        .reduce((acc, cur) => acc + +cur.price * cur.quantity_ordered, 0)
        .toFixed(2);
      const client = await pool.connect();
      const { rows } = await client.query(
        "INSERT INTO orders(user_id, total, order_created_on,order_modified_at) VALUES($1, $2, $3, $4) RETURNING id, guid",
        [userId, total, createdOn, createdOn]
      );
      const order = rows[0];

      // creating order items
      const orderItems = data.map((row) => ({
        orderId: order.id,
        productItemId: row.product_item_id,
        quantity: row.quantity_ordered,
        createdOn: createdOn,
        modifiedAt: createdOn,
      }));

      const values = orderItems.map((row) => [
        row.orderId,
        row.productItemId,
        row.quantity,
        row.createdOn,
        row.modifiedAt,
      ]);

      const query = `
        INSERT INTO order_items(order_id, product_item_id, quantity_ordered, created_on, modified_at)
        SELECT * FROM UNNEST($1::int[], $2::int[], $3::int[], $4::timestamp[], $5::timestamp[]);
        `;
      await client.query(query, [
        values.map((v) => v[0]), // order_id
        values.map((v) => v[1]), // product_item_id
        values.map((v) => v[2]), // quantity
        values.map((v) => v[3]), // created_on
        values.map((v) => v[4]), // modified_at
      ]);

      client.release();

      console.log(stripeItems);
      const session = await stripe.checkout.sessions.create({
        line_items: stripeItems,
        mode: "payment",
        shipping_address_collection: {
          allowed_countries: ["US"],
        },
        phone_number_collection: {
          enabled: true,
        },
        success_url: `${req.headers.origin}/checkout/success/${order.guid}`,
        cancel_url: `${req.headers.origin}/checkout/rejected`,
        metadata: {
          orderId: order.id,
          userId: userId,
        },
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
