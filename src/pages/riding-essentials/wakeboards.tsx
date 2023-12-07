import CollectionLayout from "@/components/collectionLayout";
import pool from "@/database/db";
import { GetStaticProps } from "next";
import Link from "next/link";

interface Product {
  name: string;
  url: string;
  description: string;
  quantity: number;
  price: string;
}

const Wakeboards = ({ products }: { products: Product[] }) => {
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

export const getStaticProps = (async () => {
  const client = await pool.connect();
  const result = await client.query<Product>("SELECT * FROM product_items");
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

Wakeboards.PageLayout = CollectionLayout;
export default Wakeboards;
