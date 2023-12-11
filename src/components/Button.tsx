import { MouseEvent, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type: "primary" | "secondary";
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ children, type, onClick }) => {
  const styles = {
    primary: "font-semibold",
    secondary: "font-semibold",
  };

  return (
    <button onClick={onClick} className={styles[type]}>
      {children}
    </button>
  );
};
export default Button;
