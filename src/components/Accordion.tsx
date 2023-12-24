import React from "react";
import { Category } from "./layout/CollectionLayout";
import Link from "next/link";

interface AccordionProps {
  data: Category[];
  collection: string;
}

const Accordion: React.FC<AccordionProps> = ({ data, collection }) => {
  const categories = data.filter((item) => item.collection_name === collection);

  return (
    <div className="flex flex-col gap-3 px-5 py-3">
      {categories.map((item) => (
        <Link
          key={item.category_id}
          href={item.collection_url + item.category_url}
        >
          {item.category_name}
        </Link>
      ))}
    </div>
  );
};

export default Accordion;
