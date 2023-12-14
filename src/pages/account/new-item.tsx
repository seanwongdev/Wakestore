import Button from "@/components/Button";
import ProfileLayout from "@/components/layout/ProfileLayout";
import pool from "@/database/db";
import { GetStaticProps } from "next";
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const product = {
      name,
      description,
      quantity: Number(quantity),
      price: Number(price),
      product_category_id: Number(categoryId),
      url,
    };
    const res = await fetch("/api/admin/products", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ product }),
    });
    const data = await res.json();
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="product">Product Name</label>
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
            <label htmlFor="description">Product Description</label>
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
              <label htmlFor="quantity">Inventory Quantity</label>
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
              <label htmlFor="price">Price</label>
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
              <label htmlFor="category">Product Category</label>
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
            <label htmlFor="url">Product URL</label>
            <input
              className="rounded-md py-2 border border-gray-600 bg-white px-6"
              type="text"
              id="url"
              placeholder="/hyperlite-wakeboard"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
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
  const { rows } = await client.query("SELECT * FROM product_category");

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
