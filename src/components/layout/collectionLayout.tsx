import { ReactNode, useEffect, useState } from "react";
import SideNavbar from "../sideNavbar";

interface LayoutProps {
  children: ReactNode;
}

export interface Category {
  category_id: number;
  category_name: string;
  collection_name: string;
  category_url: string;
  collection_url: string;
}

const CollectionLayout: React.FC<LayoutProps> = ({ children }) => {
  const [data, setData] = useState<Category[]>([]);
  useEffect(() => {
    const fetchHeaderData = async () => {
      const res = await fetch("/api/category");
      const { category } = await res.json();
      setData(category);
    };
    fetchHeaderData();
  }, []);
  return (
    <div className="md:grid md:grid-cols-[auto,1fr] gap-5 h-screen">
      <div>
        <SideNavbar data={data} />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default CollectionLayout;
