import { DataTable } from "@/components/table/DataTable";
import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";
import { GetStaticProps } from "next";
import { columns } from "@/components/table/columns";

export interface ProductAdmin {
  id: number;
  name: string;
  price: number;
  quantity: number;
  product_category_id: number;
  url: string;
  is_deleted: boolean;
}

export default function ManageItems({
  products,
}: {
  products: ProductAdmin[];
}) {
  return (
    <div>
      In this dashboard you can manage your items
      <DataTable data={products} columns={columns} />
    </div>
  );
}

export const getStaticProps = (async () => {
  const client = await pool.connect();
  const { rows } = await client.query("SELECT * FROM product_items");

  return {
    props: {
      products: rows.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        product_category_id: item.product_category_id,
        url: item.url,
        is_deleted: item.is_deleted,
      })),
    },
  };
}) satisfies GetStaticProps;

ManageItems.PageLayout = ProfileLayout;