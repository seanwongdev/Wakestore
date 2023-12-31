import Link from "next/link";
import { Category } from "@/context/CategoryContext";
import Accordion from "./Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface SideNavbarProps {
  data: Category[];
}

interface AccordionProps {
  "Riding Essentials": boolean;
  Apparel: boolean;
  Accessories: boolean;
  Kids: boolean;
  [key: string]: boolean;
}

const initialAccordion = {
  "Riding Essentials": false,
  Apparel: false,
  Accessories: false,
  Kids: false,
};

const SideNavbar: React.FC<SideNavbarProps> = ({ data }) => {
  const router = useRouter();
  const { collection, category } = router.query;

  const [isCollectionOpen, setIsCollectionOpen] =
    useState<AccordionProps>(initialAccordion);

  useEffect(() => {
    if (!collection || !data) return;
    const collectionSetup: string | undefined = data.find(
      (item) => item.collection_url.slice(1) === collection
    )?.collection_name;
    setIsCollectionOpen(initialAccordion);
    if (collectionSetup)
      setIsCollectionOpen((state) => ({ ...state, [collectionSetup]: true }));
  }, [collection, data]);
  const toggleAccordion = (collection: string) => {
    setIsCollectionOpen((state) => ({
      ...state,
      [collection]: !state[collection],
    }));
  };
  const collectionNames = [
    ...new Set(data.map((item) => item.collection_name)),
  ];

  const currentCategory = Array.isArray(category) ? category[0] : category;

  return (
    <div className="flex flex-col font-semibold mt-8">
      <span className="font-bold text-xl italic border-b border-b-black py-2">
        CATEGORIES
      </span>
      <div>
        {collectionNames.map((row) => (
          <>
            <div
              onClick={() => toggleAccordion(row)}
              className="flex justify-between items-center py-3 border-t hover:cursor-pointer"
            >
              <Link
                href={
                  data.find((item) => item.collection_name === row)
                    ?.collection_url ?? "/"
                }
                key={row}
                className={` 
                ${
                  !category &&
                  row ===
                    data.find(
                      (item) => item.collection_url.slice(1) === collection
                    )?.collection_name
                    ? "underline underline-offset-2  hover:text-blue-400"
                    : " hover:text-blue-400 hoverside-underline-animation:hover:after hoverside-underline-animation:after hoverside-underline-animation"
                }
              `}
              >
                {row}
              </Link>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
            {isCollectionOpen[row] && (
              <Accordion
                data={data}
                collection={row}
                category={currentCategory}
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default SideNavbar;
