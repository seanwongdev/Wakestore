import type { GetStaticPaths, GetStaticProps } from "next";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";

import CollectionLayout from "@/components/layout/CollectionLayout";
import pool from "@/database/db";
import Image from "next/image";
import Link from "next/link";
import React, { ChangeEvent } from "react";

interface Product {
  id: number;
  name: string;
  url: string;
  description: string;
  quantity: number;
  price: string;
  image_url: string[];
}

const Category = ({ products }: { products: Product[] }) => {
  const { increaseCartQuantity } = useCart();
  const router = useRouter();

  const { page, collection, category, per_page } = router.query;

  let resultsPerPage = Number(per_page) || 9;

  let pageNum = Number(page) || 1;
  const maxPage = Math.ceil(products.length / resultsPerPage);
  let pageArray = [];
  for (let i = 1; i < maxPage + 1; i++) {
    pageArray.push(i);
  }

  const entries = products.slice(
    (pageNum - 1) * resultsPerPage,
    pageNum * resultsPerPage
  );

  const handlePrev = () => {
    if (pageNum > 1) {
      pageNum--;
      router.push(
        `/${collection}/${category}?page=${pageNum}&per_page=${resultsPerPage}`
      );
    }
  };

  const handleNext = () => {
    if (pageNum < maxPage) {
      pageNum++;
      router.push(
        `/${collection}/${category}?page=${pageNum}&per_page=${resultsPerPage}`
      );
    }
  };

  const handleClick = (value: number) => {
    pageNum = value;
    router.push(
      `/${collection}/${category}?page=${pageNum}&per_page=${resultsPerPage}`
    );
  };

  const handleSelectResults = (value: number) => {
    resultsPerPage = value;
    router.push(
      `/${collection}/${category}?page=${pageNum}&per_page=${resultsPerPage}`
    );
  };

  return (
    <div className="mt-4">
      <div className="flex justify-end items-center gap-2">
        <span className="font-bold">Show</span>
        <select
          name="resultsPerPage"
          id="resultsPerPage"
          className="border rounded border-gray-300 p-2 focus:outline-blue-500 "
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            handleSelectResults(Number(e.target.value))
          }
        >
          <option value="9">9 products per page</option>
          <option value="18">18 products per page</option>
          <option value="36">36 products per page</option>
          <option value="72">72 products per page</option>
        </select>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 mt-4">
        {entries.map((product) => {
          return (
            <div
              key={product.url}
              className="py-4 flex flex-col justify-center gap-2"
            >
              <Link className="h-full" href={`/products${product.url}`}>
                {product.image_url?.length > 0 ? (
                  <Image
                    width={0}
                    height={0}
                    alt="product"
                    loading="lazy"
                    quality={60}
                    className="w-full h-auto"
                    sizes="100vw"
                    src={product.image_url[0]}
                  ></Image>
                ) : (
                  <span>Image coming</span>
                )}
              </Link>
              <Link className="text-sm" href={`/products${product.url}`}>
                {product.name}
              </Link>
              <span className="font-bold text-l ">
                {formatCurrency(Number(product.price))}
              </span>
              <Button
                className="space-x-4 bg-gray-800"
                onClick={() => increaseCartQuantity(product.id)}
              >
                <FontAwesomeIcon icon={faCartShopping} />
                <span>ADD TO CART</span>
              </Button>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end items-center space-x-2 mt-6">
        {pageNum !== 1 && (
          <Button
            className="bg-white text-black hover:bg-gray-200"
            onClick={handlePrev}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
        )}
        {maxPage > 1 &&
          pageArray.map((page) => (
            <Button
              className={
                page === pageNum
                  ? "bg-gray-400"
                  : "bg-white text-black border hover:bg-gray-200"
              }
              disabled={page === pageNum}
              key={page}
              onClick={() => handleClick(page)}
            >
              {page}
            </Button>
          ))}

        {pageNum !== maxPage && (
          <Button
            className="bg-white text-black hover:bg-gray-200"
            onClick={handleNext}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        )}
      </div>
    </div>
  );
};

export const getStaticProps = (async (context) => {
  try {
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
          id: product.id,
          name: product.name,
          description: product.description,
          url: product.url,
          quantity: product.quantity,
          price: product.price,
          image_url: product.image_url,
        })),
      },
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
  } catch (err) {
    console.error("Error in getStaticPaths:", err);
    return {
      notFound: true,
    };
  }
};

Category.PageLayout = CollectionLayout;
export default Category;
