import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ children, type }) => {
  const styles = {
    primary: "",
    secondary: "",
  };
  return <button className={styles[type]}>{children}</button>;
};

export default Button;
