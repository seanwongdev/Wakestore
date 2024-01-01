import { MouseEvent, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type: "primary" | "secondary" | "checkout" | "submit";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  onClick,
  disabled,
}) => {
  const styles = {
    primary: "font-semibold  hover:text-blue-300",
    secondary:
      "font-bold rounded hover:bg-blue-300 bg-gray-800 p-2.5 text-white transition ",
    checkout:
      "font-semibold bg-blue-500 text-white p-2.5 rounded-md mt-4 space-x-4",
    submit: "mt-4 font-semibold bg-gray-800 rounded text-white p-2 w-[100px]",
  };

  return (
    <button onClick={onClick} className={styles[type]} disabled={disabled}>
      {children}
    </button>
  );
};
export default Button;
