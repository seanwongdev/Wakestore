import pool from "@/database/db";
import { ProductAdmin } from "./index";
import { GetStaticPaths, GetStaticProps } from "next";
import { ChangeEvent, FormEvent, useState } from "react";
import { uploadCloudinary } from "@/lib/utils/upload";
import ProfileLayout from "@/components/layout/ProfileLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function ProductImage({ product }: { product: ProductAdmin }) {
  const [images, setImages] = useState<File[]>([]);
  const router = useRouter();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let imgArr = [];
      for (let i = 0; i < images.length; i++) {
        const data = await uploadCloudinary(images[i]);
        imgArr.push(data);
      }

      const payload = { ...product, image_url: imgArr };
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error uploading product images");
      router.push("/account/manage-items");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <label
            className="block  text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm  text-gray-900 border border-gray-600 rounded-lg file:bg-gray-600 file:rounded-lg file:py-2 file:text-white"
            id="file_input"
            type="file"
            multiple={true}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setImages(Array.from(e.target.files || []))
            }
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button>Upload File</Button>
        </div>
      </form>
    </div>
  );
}

export const getStaticProps = (async (context) => {
  try {
    const { id } = context.params as { id: string };
    const client = await pool.connect();
    const { rows } = await client.query(
      "SELECT * FROM product_items WHERE id = $1",
      [id]
    );
    client.release();
    return {
      props: {
        product: {
          id: rows[0].id,
          name: rows[0].name,
          price: rows[0].price,
          quantity: rows[0].quantity,
          product_category_id: rows[0].product_category_id,
          url: rows[0].url,
          image_url: rows[0].image_url,
          is_deleted: rows[0].is_deleted,
        },
      },
    };
  } catch (err) {
    console.error("Error in getStaticProps:", err);
    return { notFound: true };
  }
}) satisfies GetStaticProps;

export const getStaticPaths = async () => {
  try {
    const client = await pool.connect();
    const { rows } = await client.query("SELECT id FROM product_items");
    client.release();
    return {
      paths: rows.map((item) => ({
        params: {
          id: item.id.toString(),
        },
      })),
      fallback: false,
    };
  } catch (err) {
    console.error("Error in getStaticPaths:", err);
    return { notFound: true };
  }
};

ProductImage.PageLayout = ProfileLayout;
