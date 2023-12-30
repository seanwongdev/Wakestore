import { LayoutProps } from "next-auth";
import { createContext, useContext, useEffect, useState } from "react";

export interface CategoryContext {
  category: Category[];
}
export interface Category {
  category_id: number;
  category_name: string;
  collection_name: string;
  category_url: string;
  collection_url: string;
  collection_id: number;
}

const CategoryContext = createContext({} as CategoryContext);

export const CategoryProvider = ({ children }: LayoutProps) => {
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const res = await fetch("/api/category");
        const { category } = await res.json();
        setCategoryData(category);
      } catch (err: any) {
        console.error("Error in fetching data:", err);
        console.error(err.message);
      }
    };
    fetchHeaderData();
  }, []);

  const [category, setCategoryData] = useState<Category[]>([]);
  return (
    <CategoryContext.Provider
      value={{
        category,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
