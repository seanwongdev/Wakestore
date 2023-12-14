import CollectionLayout from "@/components/layout/CollectionLayout";
import pool from "@/database/db";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";

interface Product {
  name: string;
  url: string;
  description: string;
  quantity: number;
  price: string;
  image_url: string[];
}

const Category = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid grid-cols-3">
      {products.map((product) => {
        return (
          <div key={product.url} className="py-4 flex flex-col justify-center ">
            <Link href={`/products${product.url}`}>
              {product.image_url?.length > 0 ? (
                <Image
                  width="200"
                  height="200"
                  alt="product"
                  src={product.image_url[0]}
                ></Image>
              ) : (
                <span>Image coming</span>
              )}
            </Link>
            <Link href={`/products${product.url}`}>{product.name}</Link>
            <span className="font-semibold">
              {formatCurrency(Number(product.price))}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const getStaticProps = (async (context) => {
  const category = "/" + context.params?.category;
  const client = await pool.connect();
  const result = await client.query<Product>(
    "SELECT * FROM product_items JOIN product_category ON product_items.product_category_id = product_category.category_id WHERE category_url = $1 AND is_deleted = false",
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
        image_url: product.image_url,
      })),
    },
    revalidate: 3600,
  };
}) satisfies GetStaticProps;

export const getStaticPaths = (async () => {
  const client = await pool.connect();
  const result = await client.query(
    "SELECT category_url, collection_url FROM product_category JOIN product_collections ON product_category.product_collection_id = product_collections.collection_id"
  );
  client.release();

  return {
    paths: result.rows.map((category) => ({
      params: {
        category: category.category_url.slice(1),
        collection: category.collection_url.slice(1),
      },
    })),
    fallback: false,
  };
}) satisfies GetStaticPaths;

Category.PageLayout = CollectionLayout;
export default Category;
