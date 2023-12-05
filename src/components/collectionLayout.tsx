import { ReactNode } from "react";
import SideNavbar from "./sideNavbar";

interface LayoutProps {
  children: ReactNode;
}

const CollectionLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="md:grid md:grid-cols-[auto,1fr] gap-5 h-screen">
      <div>
        <SideNavbar />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default CollectionLayout;
