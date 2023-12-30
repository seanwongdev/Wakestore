import { ToastContainer } from "react-toastify";

import { ReactNode } from "react";
import { CartProvider } from "./context/CartContext";
import { CategoryProvider } from "./context/CategoryContext";

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <CategoryProvider>
        <CartProvider>{children}</CartProvider>
      </CategoryProvider>
    </>
  );
};

export default GlobalProvider;
