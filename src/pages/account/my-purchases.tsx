import ProfileLayout from "@/components/layout/ProfileLayout";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import pool from "@/database/db";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface ItemProps {
  name: string;
  price: string;
  date: string;
  image: string;
}

export default function MyPurchases({ items }: { items: ItemProps[] }) {
  const uniqueItems = [...new Set(items.map((item) => item.name))];
  const dateOptions = { day: "numeric", month: "short", year: "numeric" };
  const uniqueArray = uniqueItems.map((product) => ({
    name: product,
    price: items.find((item) => item.name === product)?.price,
    date: items.find((item) => item.name === product)?.date,
    image: items.find((item) => item.name === product)?.image,
  }));
  console.log(uniqueArray);
  return (
    <div className="grid grid-cols-2">
      {uniqueArray.map((item) => (
        <div key={item.name} className="flex gap-10 border rounded">
          <Image
            alt="product"
            height={100}
            width={200}
            src={item.image[0]}
          ></Image>
          <div className="flex flex-col justify-evenly">
            <span className="font-semibold">
              Last purchased on{" "}
              {new Intl.DateTimeFormat("en-GB", dateOptions).format(
                new Date(item.date)
              )}
            </span>

            <span className="font-semibold">{item.name}</span>
            <span className="font-semibold">
              {formatCurrency(parseFloat(item.price))}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const client = await pool.connect();
  const { rows } = await client.query(
    "SELECT name, price, order_modified_at, image_url FROM order_items oi JOIN orders o ON o.id = oi.order_id JOIN product_items pi ON pi.id = oi.product_item_id WHERE o.user_id = $1 AND payment=true ORDER BY order_modified_at DESC",
    [session?.user.id]
  );

  client.release();
  return {
    props: {
      items: rows.map((row) => ({
        name: row.name,
        price: row.price,
        date: new Date(row.order_modified_at).toISOString(),
        image: row.image_url,
      })),
    },
  };
}) satisfies GetServerSideProps;

MyPurchases.PageLayout = ProfileLayout;
