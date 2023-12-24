import Link from "next/link";
import { Category } from "./layout/CollectionLayout";
import Accordion from "./Accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { useState } from "react";

interface SideNavbarProps {
  data: Category[];
}

interface AccordionProps {
  "Riding Essentials": boolean;
  Apparel: boolean;
  Accessories: boolean;
  Kids: boolean;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ data }) => {
  const [isCollectionOpen, setIsCollectionOpen] = useState<AccordionProps>({
    "Riding Essentials": false,
    Apparel: false,
    Accessories: false,
    Kids: false,
  });
  const toggleAccordion = (collection: string) => {
    setIsCollectionOpen((state) => ({
      ...state,
      [collection]: !state[collection],
    }));
  };
  const collectionNames = [
    ...new Set(data.map((item) => item.collection_name)),
  ];
  console.log(collectionNames);
  return (
    <div className="flex flex-col font-semibold mt-8">
      <span className="font-bold text-xl italic border-b border-b-black py-2">
        CATEGORIES
      </span>
      <div>
        {collectionNames.map((row) => (
          <>
            <div className="flex justify-between items-center py-3 border-t">
              <Link
                href={
                  data.find((item) => item.collection_name === row)
                    ?.collection_url
                }
                key={row}
                className=""
              >
                {row}
              </Link>
              <FontAwesomeIcon
                onClick={() => toggleAccordion(row)}
                icon={faChevronDown}
              />
            </div>
            {isCollectionOpen[row] && (
              <Accordion data={data} collection={row} />
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default SideNavbar;
