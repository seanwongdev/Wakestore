import { ReactNode, useState } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import SignUp from "../auth/signup";
import Signin from "../auth/signin";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const handleSignup = () => {
    setShowSignup((state) => !state);
    document.body.classList.toggle("overflow-hidden", !showSignup);
  };
  const handleSignin = () => {
    setShowSignin((state) => !state);
    document.body.classList.toggle("overflow-hidden", !showSignin);
  };
  return (
    <div>
      {showSignup && <SignUp onSignup={handleSignup} />}
      {showSignin && <Signin onSignin={handleSignin} />}
      <Navbar onSignup={handleSignup} onSignin={handleSignin} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
