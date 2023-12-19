import type { NextApiRequest, NextApiResponse } from "next";
import { CartItem } from "@/context/CartContext";
import ProductImage from "../account/manage-items/[id]";

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
          (item) => item.name.toLowerCase() === product.name.toLowerCase()
        );

        if (!existingProd) {
          const createdProd = await stripe.products.create({
            name: product.name,
            active: true,
            default_price_data: {
              unit_amount: +product.price * 100,
              currency: "USD",
            },
          });
        }
      }

      let stripeItems: any = [];
      for (const product of data) {
        const matchedItemId = getActive.data.find(
          (item) => item.name.toLowerCase() === product.name.toLowerCase()
        )?.default_price;
        stripeItems.push({
          price: matchedItemId,
          quantity: product.quantity_ordered,
        });
      }

      const session = await stripe.checkout.sessions.create({
        line_items: stripeItems,
        mode: "payment",
        success_url: `${req.headers.origin}/checkout/success`,
        cancel_url: `${req.headers.origin}/checkout/rejected`,
      });
      res.status(200).json({ url: session.url });
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
