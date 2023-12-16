import CollectionLayout from "@/components/layout/CollectionLayout";
import pool from "@/database/db";
import type { GetStaticProps, GetStaticPaths } from "next";
import { Product } from "../products/[products]";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";

export default function Index({ products }: { products: Product[] }) {
  const router = useRouter();

  const { page } = router.query;

  const resultsPerPage = 5;

  let pageNum = Number(page) || 1;
  const maxPage = products.length / resultsPerPage;
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
      router.push(`/riding-essentials?page=${pageNum}`);
    }
  };

  const handleNext = () => {
    if (pageNum < maxPage) {
      pageNum++;
      router.push(`/riding-essentials?page=${pageNum}`);
    }
  };

  const handleClick = (value: number) => {
    pageNum = value;
    router.push(`/riding-essentials?page=${pageNum}`);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-y-6 py-4 ">
        {entries.map((item) => (
          <div key={item.id} className="flex flex-col justify-center">
            <Link href={`/products${item.url}`}>
              {item.image_url?.length > 0 ? (
                <Image
                  width={350}
                  height={200}
                  alt="product"
                  src={item.image_url[0]}
                ></Image>
              ) : (
                <span>Image coming</span>
              )}
            </Link>
            <Link href={`/products${item.url}`}>{item.name}</Link>
            <span className="font-semibold">
              {formatCurrency(Number(item.price))}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center space-x-4">
        <Button onClick={handlePrev} disabled={pageNum === 1}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        {pageArray.map((page) => (
          <Button
            className={page === pageNum ? "bg-gray-400" : ""}
            key={page}
            onClick={() => handleClick(page)}
          >
            {page}
          </Button>
        ))}

        <Button onClick={handleNext} disabled={pageNum === maxPage}>
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>
    </>
  );
}

export const getStaticProps = (async (context) => {
  const collection = "/" + context.params?.collection;
  const client = await pool.connect();
  const result = await client.query(
    "SELECT id, description, quantity, name, price, url, image_url FROM product_items JOIN product_category ON product_items.product_category_id = product_category.category_id JOIN product_collections ON product_category.product_collection_id = product_collections.collection_id WHERE is_deleted = false AND collection_url = $1 ",
    [collection]
  );
  client.release();

  return {
    props: {
      products: [...result.rows],
      revalidate: 3600,
    },
  };
}) satisfies GetStaticProps;

export const getStaticPaths = (async () => {
  const client = await pool.connect();
  const result = await client.query(
    "SELECT collection_url FROM product_collections"
  );
  client.release();
  return {
    paths: result.rows.map((product) => ({
      params: {
        collection: product.collection_url.slice(1),
      },
    })),
    fallback: false,
  };
}) satisfies GetStaticPaths;

Index.PageLayout = CollectionLayout;
