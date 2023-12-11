import { ToastContainer } from "react-toastify";

import { ReactNode } from "react";

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  return (
    <>
      <ToastContainer position="bottom-right" />
      {children}
    </>
  );
};

export default GlobalProvider;
