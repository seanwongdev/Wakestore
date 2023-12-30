import SideNavbar from "../Navbar/SideNavbar";
import { LayoutProps } from "next-auth";

import { useCategory } from "@/context/CategoryContext";

const CollectionLayout: React.FC<LayoutProps> = ({ children }) => {
  const { category } = useCategory();

  return (
    <div className="md:grid md:grid-cols-[3fr,9fr] gap-14 h-auto w-[90vw] mx-auto">
      <div>
        <SideNavbar data={category} />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default CollectionLayout;
