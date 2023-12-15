import { ReactNode, useState } from "react";
import { LayoutProps } from "next-auth";
import Navbar from "../Navbar";
import Footer from "../Footer";
import SignUp from "../auth/Signup";
import Signin from "../auth/Signin";
import SearchBar from "../search/SearchBar";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const handleClickSearch = () => {
    setShowSearchBar((state) => !state);
    document.body.classList.toggle("overflow-hidden", !showSignup);
  };
  const handleSignup = () => {
    setShowSignup((state) => !state);
    document.body.classList.toggle("overflow-hidden", !showSignup);
  };
  const handleSignin = () => {
    setShowSignin((state) => !state);
    document.body.classList.toggle("overflow-hidden", !showSignin);
  };
  const handleSwapToSignup = () => {
    setShowSignup((state) => !state);
    setShowSignin((state) => !state);
    document.body.classList.toggle("overflow-hidden", !showSignup);
  };
  const handleSwapToSignin = () => {
    setShowSignup((state) => !state);
    setShowSignin((state) => !state);
    document.body.classList.toggle("overflow-hidden", !showSignin);
  };

  return (
    <div>
      {showSignup && (
        <SignUp onSignup={handleSignup} onSwap={handleSwapToSignin} />
      )}
      {showSignin && (
        <Signin onSignin={handleSignin} onSwap={handleSwapToSignup} />
      )}
      {showSearchBar && (
        <SearchBar isOpen={showSearchBar} setShowSearchBar={setShowSearchBar} />
      )}
      <Navbar
        onSearch={handleClickSearch}
        onSignup={handleSignup}
        onSignin={handleSignin}
      />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
