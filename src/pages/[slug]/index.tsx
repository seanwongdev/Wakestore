import { useRouter } from "next/router";
import type { GetStaticProps, GetStaticPaths } from "next";
import pool from "@/database/db";
import Button from "@/components/Button";

interface Product {
  name: string;
  url: string;
  description: string;
  quantity: number;
  price: string;
}

export default function Product(props: Product) {
  const { name, description, quantity, price } = props;
  return (
    <div className="h-screen w-3/4 mx-auto grid grid-cols-2 gap-5 mt-16">
      <div></div>
      <div className="flex flex-col gap-5">
        <div>{name}</div>
        <div>{description}</div>
        <div>{price}</div>
        <div>
          <Button type="primary">BUY NOW</Button>
        </div>
        <div>
          <Button type="secondary">ADD TO CART</Button>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = (async (context) => {
  const slug = "/" + context.params?.slug;

  const client = await pool.connect();
  const result = await client.query(
    "SELECT name, description, quantity, price FROM product_items WHERE url = $1",
    [slug]
  );
  client.release();
  return {
    props: result.rows[0],
    revalidate: 3600,
  };
}) satisfies GetStaticProps;

export const getStaticPaths = (async () => {
  const client = await pool.connect();
  const result = await client.query("SELECT url FROM product_items");
  client.release();
  return {
    paths: result.rows.map((product) => ({
      params: {
        slug: product.url.slice(1),
      },
    })),
    fallback: false,
  };
}) satisfies GetStaticPaths;
