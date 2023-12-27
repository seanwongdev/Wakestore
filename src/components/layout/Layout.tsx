import { ReactNode, useEffect, useState } from "react";
import { LayoutProps } from "next-auth";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer";
import SignUp from "../auth/Signup";
import Signin from "../auth/Signin";
import SearchBar from "../search/SearchBar";
import { toast } from "react-toastify";

export interface Collection {
  collection_id: number;
  collection_name: string;
  collection_url: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [data, setData] = useState<Collection[]>([]);
  const handleClickSearch = () => {
    setShowSearchBar((state) => !state);
    document.body.classList.toggle("overflow-hidden", !showSearchBar);
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

  const handleOverlaySignin: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignin(false);
      document.body.classList.toggle("overflow-hidden", !showSignin);
    }
  };

  const handleOverlaySignup: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignup(false);
      document.body.classList.toggle("overflow-hidden", !showSignup);
    }
  };

  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      setShowSearchBar((state) => !state);
      document.body.classList.toggle("overflow-hidden", !showSearchBar);
    }
  };

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const res = await fetch("/api/collection");
        if (!res.ok) throw new Error("Failed to fetch header data");
        const { collection } = await res.json();

        setData(collection);
      } catch (err: any) {
        console.error("Error in fetching header data:", err);
        toast.error(err.message);
      }
    };
    fetchHeaderData();
  }, []);

  return (
    <div>
      {showSignup && (
        <SignUp
          onSignup={handleSignup}
          onSwap={handleSwapToSignin}
          onOverlaySignup={handleOverlaySignup}
        />
      )}
      {showSignin && (
        <Signin
          onSignin={handleSignin}
          onSwap={handleSwapToSignup}
          onOverlaySignin={handleOverlaySignin}
        />
      )}
      {showSearchBar && <SearchBar onOverlayClick={handleOverlayClick} />}
      <Navbar
        onSearch={handleClickSearch}
        onSignup={handleSignup}
        onSignin={handleSignin}
        data={data}
      />
      {children}
      <Footer data={data} />
    </div>
  );
};

export default Layout;
