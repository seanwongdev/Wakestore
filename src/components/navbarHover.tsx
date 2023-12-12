import { useEffect, useState } from "react";
import { Category } from "./layout/collectionLayout";

interface NavbarHoverProps {
  collection: string;
  onMouseEnter: () => void;
}

const NavbarHover: React.FC<NavbarHoverProps> = ({
  collection,
  onMouseEnter,
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

  return (
    <div className="absolute z-20 top-12 rounded-md shadow w-[150px] flex-wrap bg-white text-black divide-y-1 divide-x-gray">
      {data.map((row) =>
        row.collection_name === collection ? (
          <div key={row.category_name} className="flex flex-col p-1.5 ">
            {row.category_name}
          </div>
        ) : null
      )}
    </div>
  );
};

export default NavbarHover;
