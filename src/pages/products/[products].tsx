import { useRouter } from "next/router";
import type { GetStaticProps, GetStaticPaths } from "next";
import pool from "@/database/db";
import Button from "@/components/Button";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/formatCurrency";

export interface Product {
  id: number;
  name: string;
  url: string;
  description: string;
  quantity: number;
  price: string;
  image_url: string[];
}

export default function Product(props: Product) {
  const { increaseCartQuantity, loadingStates } = useCart();
  const { id, name, description, quantity, price, image_url } = props;

  return (
    <div className="h-auto w-3/4 mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 mt-16">
      {image_url && (
        <Image
          width="600"
          height="400"
          alt="product"
          src={image_url[0]}
          loading="lazy"
          quality={60}
        ></Image>
      )}
      <div className="flex flex-col gap-5">
        <div className="font-bold">{name}</div>
        <div>{description}</div>
        <div className="text-gray-700 font-semibold">
          {formatCurrency(parseFloat(price))}
        </div>

        <div>
          <Button
            onClick={() => increaseCartQuantity(id)}
            type="secondary"
            disabled={loadingStates[id]}
          >
            {loadingStates[id] ? "ADDING..." : "ADD TO CART"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = (async (context) => {
  try {
    const products = "/" + context.params?.products;

    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, name, description, quantity, price, image_url FROM product_items WHERE url = $1 AND is_deleted = false",
      [products]
    );
    client.release();
    if (result.rows.length === 0) {
      return {
        notFound: true,
      };
    }

    return {
      props: result.rows[0],
      revalidate: 60,
    };
  } catch (err) {
    console.error("Error in getStaticProps:", err);
    return {
      notFound: true,
    };
  }
}) satisfies GetStaticProps;

export const getStaticPaths = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT url FROM product_items");
    client.release();
    return {
      paths: result.rows.map((product) => ({
        params: {
          products: product.url.slice(1),
        },
      })),
      fallback: false,
    };
  } catch (err) {
    console.error("Error in getStaticPaths:", err);
    return {
      notFound: true,
    };
  }
};
