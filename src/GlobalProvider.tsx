import { ToastContainer } from "react-toastify";

import { ReactNode } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </>
  );
};

export default GlobalProvider;
