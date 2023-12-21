import { ReactNode, useEffect, useState } from "react";
import SideNavbar from "../SideNavbar";
import { LayoutProps } from "next-auth";

export interface Category {
  category_id: number;
  category_name: string;
  collection_name: string;
  category_url: string;
  collection_url: string;
  collection_id: number;
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
    <div className="md:grid md:grid-cols-[3fr,9fr] gap-5 h-screen w-[90vw] mx-auto">
      <div>
        <SideNavbar data={data} />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default CollectionLayout;
