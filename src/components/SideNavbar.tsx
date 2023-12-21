import Link from "next/link";
import { Category } from "./layout/CollectionLayout";

interface SideNavbarProps {
  data: Category[];
}

const SideNavbar: React.FC<SideNavbarProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-3 font-semibold mt-8">
      {data.map((row) => (
        <Link
          href={row.collection_url + row.category_url}
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
