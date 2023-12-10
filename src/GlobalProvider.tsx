import { ToastContainer } from "react-toastify";
import { ReactNode } from "react";

export function GlobalProvider:React.FC<ReactNode>({ children }) {
  return (
    <>
      <ToastContainer position="bottom-right" />
    </>
  );
}
