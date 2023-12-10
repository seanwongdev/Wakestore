import { MouseEvent, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type: "primary" | "secondary";
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ children, type, onClick }) => {
  const styles = {
    primary: "",
    secondary: "",
  };

  return (
    <button onClick={onClick} className={styles[type]}>
      {children}
    </button>
  );
};
export default Button;
