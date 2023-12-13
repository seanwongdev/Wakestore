import { useEffect, useState } from "react";
import { Category } from "./layout/collectionLayout";
import Link from "next/link";

interface NavbarHoverProps {
  collection: string;
  onMouseEnter: () => void;
  onMouseExit: () => void;
}

const NavbarHover: React.FC<NavbarHoverProps> = ({
  collection,
  onMouseEnter,
  onMouseExit,
}) => {
  const [data, setData] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategoryData = async () => {
      const res = await fetch("/api/category");
      const { category } = await res.json();
      setData(category);
    };
    fetchCategoryData();
  }, []);

  const collectionId = data.find(
    (item) => item.collection_name === collection
  )?.collection_id;

  return (
    <div
      className="absolute z-20 top-10  rounded-md shadow w-[150px] flex-wrap bg-white text-black divide-y-1 divide-x-gray"
      style={collectionId ? { left: `${(collectionId - 1) * 30}%` } : {}}
    >
      {data.map((row) =>
        row.collection_name === collection ? (
          <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseExit}
            key={row.category_name}
            className="flex flex-col p-1.5 hover:underline hover:text-blue-600  "
          >
            <Link href={`${row.collection_url}${row.category_url}`}>
              {row.category_name}
            </Link>
          </div>
        ) : null
      )}
    </div>
  );
};

export default NavbarHover;
