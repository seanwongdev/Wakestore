import Button from "@/components/Button";
import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";
import { uploadCloudinary } from "@/lib/utils/upload";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

interface Category {
  id: number;
  name: string;
}

export default function NewItem({ category }: { category: Category[] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [url, setUrl] = useState("");
  const [images, setImages] = useState([]);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let imgArr = [];
      for (let i = 0; i < images.length; i++) {
        const data = await uploadCloudinary(images[i]);
        imgArr.push(data);
      }

      const product = {
        name,
        description,
        quantity: Number(quantity),
        price: Number(price),
        product_category_id: Number(categoryId),
        url,
        image_url: imgArr,
      };

      const res = await fetch("/api/admin/products", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ product }),
      });
      router.push("/account/manage-items");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="product"
              className="block  text-sm font-medium text-gray-900 dark:text-white"
            >
              Product Name
            </label>
            <input
              className="rounded-md py-2 border border-gray-600 bg-white px-6"
              type="text"
              id="product"
              placeholder="Hyperlite Wakeboard 2023"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="description"
              className="block  text-sm font-medium text-gray-900 dark:text-white"
            >
              Product Description
            </label>
            <textarea
              className="rounded-md py-2 border border-gray-600 bg-white px-6"
              id="description"
              rows={4}
              placeholder="Write your product description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-20">
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="quantity"
                className="block  text-sm font-medium text-gray-900 dark:text-white"
              >
                Inventory Quantity
              </label>
              <input
                className="rounded-md py-2 border border-gray-600 bg-white px-6"
                type="number"
                id="quantity"
                placeholder="21"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="price"
                className="block  text-sm font-medium text-gray-900 dark:text-white"
              >
                Price
              </label>
              <input
                className="rounded-md py-2 border border-gray-600 bg-white px-6"
                type="number"
                id="price"
                placeholder="934.20"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="category"
                className="block  text-sm font-medium text-gray-900 dark:text-white"
              >
                Product Category
              </label>
              <select
                className="rounded-md py-2 border border-gray-600 bg-white px-6"
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select Category</option>
                {category.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="url"
              className="block  text-sm font-medium text-gray-900 dark:text-white"
            >
              Product URL
            </label>
            <input
              className="rounded-md py-2 border border-gray-600 bg-white px-6"
              type="text"
              id="url"
              placeholder="/hyperlite-wakeboard"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
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
              onChange={(e) => setImages(e.target.files)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="primary">Submit</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export const getStaticProps = (async () => {
  const client = await pool.connect();
  const { rows } = await client.query(
    "SELECT * FROM product_category ORDER BY position_id ASC"
  );
  client.release();
  return {
    props: {
      category: rows.map((item) => ({
        id: item.category_id,
        name: item.category_name,
      })),
    },
  };
}) satisfies GetStaticProps;

NewItem.PageLayout = ProfileLayout;
