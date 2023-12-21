import { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import type { ProductAdmin } from "@/pages/account/manage-items";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface SearchBarProps {
  onOverlayClick: React.MouseEventHandler<HTMLDivElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onOverlayClick }) => {
  const [keyword, setKeyword] = useState("");

  const [data, setData] = useState<ProductAdmin[]>([]);

  useEffect(() => {
    const fetchSearchQuery = async () => {
      if (keyword === "") return;
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }),
      });
      const { products } = await res.json();
      setData(products);
    };
    fetchSearchQuery();
  }, [keyword]);
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-top z-50"
        onClick={onOverlayClick}
      >
        {" "}
      </div>

      <div className="fixed top-0 left-0 right-0   w-full  bg-gray-300 shadow-md  z-50">
        <div className="bg-gray-200  w-full  h-[80px] flex items-center justify-center ">
          <SearchInput
            keyword={keyword ?? ""}
            onChange={(value) => setKeyword(value)}
          />
        </div>
        <div className="bg-white  w-full  min-h-[60px]  max-h-[550px] overflow-y-auto py-6">
          {data.length > 0 ? (
            <div className=" w-2/3 mx-auto grid grid-cols-4 gap-y-8">
              {data.map((item) => (
                <div className="flex flex-col" key={item.id}>
                  <Link href={`/products${item.url}`}>
                    {item.image_url?.length > 0 ? (
                      <Image
                        loading="lazy"
                        width={250}
                        height={200}
                        alt="product"
                        quality={60}
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
              ))}{" "}
            </div>
          ) : (
            <span className="flex justify-center items-center font-bold ">
              No results
            </span>
          )}
        </div>
      </div>
    </>
  );
};
export default SearchBar;
