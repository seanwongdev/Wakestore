import Link from "next/link";
import { useState, useEffect, MouseEventHandler } from "react";
import { signOut, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { faWaveSquare } from "@fortawesome/free-solid-svg-icons/faWaveSquare";
import { useCart } from "@/context/CartContext";
import { Collection } from "./layout/Layout";

import Button from "./Button";
import NavbarHover from "./NavbarHover";

export interface NavbarProps {
  onSignup: () => void;
  onSignin: () => void;
  onSearch: () => void;
  data: Collection[];
}

const Navbar: React.FC<NavbarProps> = ({
  onSignup,
  onSignin,
  onSearch,
  data,
}) => {
  const { data: session, status } = useSession();

  const [header, setHeader] = useState("");
  const { toggleCart, cartItems } = useCart();

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

  return (
    <div className="flex  w-full  py-11 bg-navbar bg-navbar::before  text-white items-center">
      <div className="flex w-[90vw] mx-auto justify-between">
        <Link href="/">
          <FontAwesomeIcon className="text-4xl" icon={faWaveSquare} />{" "}
          <span className="font-bold text-xl">ShredShop </span>
        </Link>
        <div className="flex justify-evenly items-center gap-14 relative">
          {data.map((row) => (
            <Link
              href={row.collection_url}
              key={row.collection_id}
              onMouseEnter={() => handleMouseEnter(row.collection_name)}
              onMouseLeave={handleMouseExit}
            >
              <span className="font-semibold py-2 hover-underline-animation hover-underline-animation::after hover-underline-animation:hover::after">
                {row.collection_name}
              </span>
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
          <div>
            <FontAwesomeIcon
              className="text-white hover:cursor-pointer"
              icon={faMagnifyingGlass}
              onClick={onSearch}
            />
          </div>
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
    </div>
  );
};

export default Navbar;
