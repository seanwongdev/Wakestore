import CollectionLayout from "@/components/layout/CollectionLayout";
import { Button } from "@/components/ui/button";
import pool from "@/database/db";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

interface Product {
  name: string;
  url: string;
  description: string;
  quantity: number;
  price: string;
  image_url: string[];
}

const Category = ({ products }: { products: Product[] }) => {
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
          className="border rounded-sm border-gray-300 p-2 focus:outline-blue-500 "
          onClick={(e) => handleSelectResults(e.target.value)}
        >
          <option value="9">9 products per page</option>
          <option value="18">18 products per page</option>
          <option value="36">36 products per page</option>
          <option value="72">72 products per page</option>
        </select>
      </div>
      <div className="grid grid-cols-3">
        {products.map((product) => {
          return (
            <div
              key={product.url}
              className="py-4 flex flex-col justify-center "
            >
              <Link href={`/products${product.url}`}>
                {product.image_url?.length > 0 ? (
                  <Image
                    width={350}
                    height={200}
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
      <div className="flex justify-end items-center space-x-4">
        {pageNum !== 1 && (
          <Button onClick={handlePrev}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
        )}
        {pageArray.map((page) => (
          <Button
            className={page === pageNum ? "bg-gray-400" : ""}
            disabled={page === pageNum}
            key={page}
            onClick={() => handleClick(page)}
          >
            {page}
          </Button>
        ))}

        {pageNum !== maxPage && (
          <Button onClick={handleNext}>
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        )}
      </div>
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
