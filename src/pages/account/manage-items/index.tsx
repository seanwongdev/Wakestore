import { DataTable } from "@/components/table/DataTable";
import { GetStaticProps } from "next";
import { columns } from "@/components/table/columns";

import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";

export interface ProductAdmin {
  id: number;
  name: string;
  price: number;
  quantity: number;
  product_category_id: number;
  url: string;
  is_deleted: boolean;
  image_url: string[];
}

export default function ManageItems({
  products,
}: {
  products: ProductAdmin[];
}) {
  return (
    <div>
      <DataTable products={products} columns={columns} />
    </div>
  );
}

export const getStaticProps = (async () => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query("SELECT * FROM product_items");
    client.release();
    return {
      props: {
        products: rows.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          product_category_id: item.product_category_id,
          url: item.url,
          image_url: item.image_url,
          is_deleted: item.is_deleted,
        })),
      },
    };
  } catch (err) {
    console.error("Error in getStaticProps:", err);
    return {
      notFound: true,
    };
  }
}) satisfies GetStaticProps;

ManageItems.PageLayout = ProfileLayout;
