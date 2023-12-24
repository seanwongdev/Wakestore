import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Accordion.module.css"; // Import your CSS module for styling
import { Category } from "./layout/CollectionLayout";

interface AccordionProps {
  data: Category[];
  collection: string;
}

const Accordion: React.FC<AccordionProps> = ({ data, collection }) => {
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Measure the content height when it becomes visible
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [contentRef]);

  const categories = data.filter((item) => item.collection_name === collection);

  return (
    <div
      className={styles.accordionContent}
      style={{ maxHeight: contentHeight || "0px" }}
    >
      <div ref={contentRef} className="flex flex-col gap-3 px-5 py-3">
        {categories.map((item) => (
          <Link
            key={item.category_id}
            href={item.collection_url + item.category_url}
          >
            {item.category_name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Accordion;
