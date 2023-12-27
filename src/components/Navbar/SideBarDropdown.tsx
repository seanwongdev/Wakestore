import Link from "next/link";
import { Collection } from "../layout/Layout";

interface SideBarDropdownProps {
  data: Collection[];
}

const SideBarDropdown: React.FC<SideBarDropdownProps> = ({ data }) => {
  return (
    <div className="absolute flex flex-col gap-3 rounded z-100 bg-white shadow-md text-black p-2.5 ">
      {data.map((row) => (
        <Link
          className="font-semibold whitespace-nowrap"
          key={row.collection_id}
          href={row.collection_url}
        >
          {row.collection_name}
        </Link>
      ))}
    </div>
  );
};

export default SideBarDropdown;
