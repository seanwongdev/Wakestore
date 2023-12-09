import CollectionLayout from "@/components/layout/collectionLayout";
import pool from "@/database/db";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";

interface Product {
  name: string;
  url: string;
  description: string;
  quantity: number;
  price: string;
}

const RidingCategory = ({ products }: { products: Product[] }) => {
  return (
    <div className="flex justify-evenly flex-wrap">
      {products.map((product) => {
        return (
          <div
            key={product.url}
            className="py-4 flex justify-center items-center"
          >
            <Link href={product.url}>{product.name}</Link>
          </div>
        );
      })}
    </div>
  );
};

export const getStaticProps = (async (context) => {
  const category = "/" + context.params?.slug;
  const client = await pool.connect();
  const result = await client.query<Product>(
    "SELECT * FROM product_items JOIN product_category ON product_items.product_category_id = product_category.category_id WHERE category_url = $1",
    [category]
  );
  client.release();

  return {
    props: {
      products: result.rows.map((product) => ({
        name: product.name,
        description: product.description,
        url: product.url,
        quantity: product.quantity,
        price: product.price,
      })),
    },
    revalidate: 3600,
  };
}) satisfies GetStaticProps;

export const getStaticPaths = (async () => {
  const client = await pool.connect();
  const result = await client.query(
    "SELECT category_url FROM product_category WHERE product_collection_id = 1"
  );
  client.release();

  return {
    paths: result.rows.map((category) => ({
      params: {
        slug: category.category_url.slice(1),
      },
    })),
    fallback: false,
  };
}) satisfies GetStaticPaths;

RidingCategory.PageLayout = CollectionLayout;
export default RidingCategory;
