import CollectionLayout from "@/components/layout/collectionLayout";
import pool from "@/database/db";
import type { GetStaticProps, GetStaticPaths } from "next";
import { Product } from "../products/[products]";
import Link from "next/link";

export default function Index({ products }: { products: Product[] }) {
  return (
    <div>
      {products.map((item) => (
        <Link key={item.id} href={`/products${item.url}`}>
          {item.name}
        </Link>
      ))}
    </div>
  );
}

export const getStaticProps = (async (context) => {
  const collection = "/" + context.params?.collection;
  const client = await pool.connect();
  const result = await client.query(
    "SELECT id, description, quantity, name, price, url FROM product_items JOIN product_category ON product_items.product_category_id = product_category.category_id JOIN product_collections ON product_category.product_collection_id = product_collections.collection_id WHERE is_deleted = false AND collection_url = $1 ",
    [collection]
  );
  client.release();

  return {
    props: {
      products: [...result.rows],
      revalidate: 3600,
    },
  };
}) satisfies GetStaticProps;

export const getStaticPaths = (async () => {
  const client = await pool.connect();
  const result = await client.query(
    "SELECT collection_url FROM product_collections"
  );
  client.release();
  return {
    paths: result.rows.map((product) => ({
      params: {
        collection: product.collection_url.slice(1),
      },
    })),
    fallback: false,
  };
}) satisfies GetStaticPaths;

Index.PageLayout = CollectionLayout;
