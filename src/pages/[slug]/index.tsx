import { useRouter } from "next/router";
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import pool from "@/database/db";

interface Product {
  name: string;
  url: string;
  description: string;
  quantity: number;
  price: string;
}

export default function Product() {
  const router = useRouter();
  return (
    <div className="h-screen text-center">Product: {router.query.slug}</div>
  );
}

export const getStaticProps = (async (context) => {
  const slug = context.params?.slug;
  const client = await pool.connect();
  const result = await client.query<Product>(
    "SELECT * FROM product_items WHERE url = ?",
    [slug]
  );
  console.log(result.rows);
  return {
    props: {
      product: result.rows,
    },
    revalidate: 3600,
  };
}) satisfies GetStaticProps;

export const getStaticPaths = (async () => {
  const client = await pool.connect();
  const result = await client.query("SELECT url FROM product_items");

  return {
    paths: result.rows.map((product) => ({
      params: {
        slug: product.url.slice(1),
      },
    })),
    fallback: false,
  };
}) satisfies GetStaticPaths;
