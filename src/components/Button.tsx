import { MouseEvent, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type: "primary" | "secondary" | "checkout";
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ children, type, onClick }) => {
  const styles = {
    primary: "font-semibold  hover:text-blue-300",
    secondary: "font-semibold",
    checkout:
      "font-semibold bg-blue-500 text-white p-2.5 rounded-md mt-4 space-x-4",
  };

  return (
    <button onClick={onClick} className={styles[type]}>
      {children}
    </button>
  );
};
export default Button;
