import { ToastContainer } from "react-toastify";

import { ReactNode } from "react";
import { CartProvider } from "./context/CartContext";

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <CartProvider>{children}</CartProvider>
    </>
  );
};

export default GlobalProvider;
