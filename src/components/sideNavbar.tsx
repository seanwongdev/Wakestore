import Link from "next/link";
import { Category } from "./collectionLayout";

interface SideNavbarProps {
  data: Category[];
}

const SideNavbar: React.FC<SideNavbarProps> = ({ data }) => {
  return (
    <div className="flex flex-col">
      {data.map((row) => (
        <Link
          href={
            "/" +
            row.collection_name
              .toLowerCase()
              .replace(/ /g, "-")
              .replace(/'/g, "") +
            "/" +
            row.category_name
              .toLowerCase()
              .replace(/[^\w\s]/g, "")
              .replace(/ /g, "-")
              .replace(/'/g, "")
          }
          key={row.category_id}
          className=""
        >
          {row.category_name}
        </Link>
      ))}
    </div>
  );
};

export default SideNavbar;
