import Link from "next/link";
import { useState, useEffect, MouseEventHandler } from "react";
import Button from "./Button";
import { signOut, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { useCart } from "@/context/CartContext";
import NavbarHover from "./NavbarHover";

interface Collection {
  collection_id: number;
  collection_name: string;
  collection_url: string;
}

export interface NavbarProps {
  onSignup: () => void;
  onSignin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignup, onSignin }) => {
  const [header, setHeader] = useState("");
  const { toggleCart, cartItems } = useCart();
  const [data, setData] = useState<Collection[]>([]);
  const { data: session, status } = useSession();

  const handleMouseEnter = (name: string) => {
    setHeader(name);
  };

  const handleMouseExit = () => {
    setHeader("");
  };

  const handleDropdownEnter = (name: string) => {
    setHeader(name);
  };

  const handleDropdownExit = () => {
    setHeader("");
  };

  useEffect(() => {
    const fetchHeaderData = async () => {
      const res = await fetch("/api/collection");
      const { collection } = await res.json();

      setData(collection);
    };
    fetchHeaderData();
  }, []);
  return (
    <div className="flex justify-between w-full px-20 py-12 bg-gray-800 text-white">
      <span>Logo</span>
      <div className="flex justify-evenly items-center gap-14 relative">
        {data.map((row) => (
          <Link
            href={row.collection_url}
            key={row.collection_id}
            className="font-semibold p-2 hover-underline-animation hover-underline-animation::after hover-underline-animation:hover::after"
            onMouseEnter={() => handleMouseEnter(row.collection_name)}
            onMouseLeave={handleMouseExit}
          >
            {row.collection_name}
          </Link>
        ))}
        {header && (
          <NavbarHover
            collection={header}
            onMouseEnter={() => handleDropdownEnter(header)}
            onMouseExit={handleDropdownExit}
          />
        )}{" "}
      </div>

      <div className="flex items-center space-x-10 relative">
        {status === "authenticated" ? (
          <>
            <Link href="/account" className="font-semibold">
              {session.user.username &&
                session.user.username[0].toUpperCase() +
                  session.user.username?.slice(1)}
            </Link>
            <Button type="primary" onClick={() => signOut()}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button type="primary" onClick={onSignin}>
              Sign in
            </Button>
            <Button type="secondary" onClick={onSignup}>
              Sign up
            </Button>
          </>
        )}

        <FontAwesomeIcon
          icon={faCartShopping}
          onClick={toggleCart}
          className="cursor-pointer text-2xl"
        />
        {cartItems?.length > 0 && (
          <button className="absolute bottom-[-6px] right-[-16px] rounded-full bg-white h-[18px] w-[18px] text-black font-bold text-xs flex items-center justify-center">
            {cartItems?.length}
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
