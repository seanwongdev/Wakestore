import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { faWaveSquare } from "@fortawesome/free-solid-svg-icons/faWaveSquare";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";

import { useCart } from "@/context/CartContext";
import { Collection } from "../layout/Layout";

import Button from "../Button";
import NavbarHover from "./NavbarHover";
import { useRouter } from "next/router";
import SideBarDropdown from "./SideBarDropdown";

export interface NavbarProps {
  onSignup: () => void;
  onSignin: () => void;
  onSearch: () => void;
  data: Collection[];
}

const Navbar: React.FC<NavbarProps> = ({ onSignin, onSearch, data }) => {
  const { data: session, status } = useSession();
  const [showAccount, setShowAccount] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [header, setHeader] = useState("");
  const { toggleCart, cartItems } = useCart();
  const router = useRouter();

  const handleProfileRouting = () => {
    router.push("/account");
    setShowAccount(false);
  };

  const handleHoverAccount = () => {
    setShowAccount(true);
  };

  const handleLeaveAccount = () => {
    setShowAccount(false);
  };

  const handleMouseEnter = (name: string) => {
    setHeader(name);
  };

  const handleSignout = () => {
    setShowAccount(false);
    signOut({ callbackUrl: "/" });
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
    <div className="flex  w-full py-11 bg-[#302c2c] md:bg-transparent bg-navbar bg-navbar::before  text-white items-center">
      <div className="flex w-[90vw] mx-auto items-center justify-between">
        <div className="md:hidden text-xl relative">
          <FontAwesomeIcon
            icon={faBars}
            onMouseEnter={() => setShowSidebar(true)}
            onMouseLeave={() => setShowSidebar(false)}
          />
          {showSidebar && <SideBarDropdown data={data} />}
        </div>
        <Link className="" href="/">
          <FontAwesomeIcon className="text-4xl" icon={faWaveSquare} />{" "}
          <span className="font-bold text-xl">ShredShop </span>
        </Link>
        <div className="hidden md:flex justify-evenly items-center md:gap-5 lg:gap-14 relative">
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

        <div className="flex items-center gap-5 lg:gap-10 relative">
          <div>
            <FontAwesomeIcon
              data-testid="button-search-icon"
              className="text-white hover:cursor-pointer"
              icon={faMagnifyingGlass}
              onClick={onSearch}
            />
          </div>
          {status === "authenticated" ? (
            <div className="relative">
              <button
                className="font-bold hover:text-blue-300"
                onMouseEnter={handleHoverAccount}
                onMouseLeave={handleLeaveAccount}
              >
                {session.user.username &&
                  session.user.username[0].toUpperCase() +
                    session.user.username?.slice(1)}
              </button>
              {showAccount && (
                <div
                  className="absolute bottom-[-66px] left-[-8px] space-y-1 bg-[#302c2c] pb-2 px-2 rounded pt-2"
                  onMouseEnter={handleHoverAccount}
                  onMouseLeave={handleLeaveAccount}
                >
                  <Button type="primary" onClick={handleProfileRouting}>
                    Account
                  </Button>

                  <Button type="primary" onClick={handleSignout}>
                    Log out
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button type="primary" onClick={onSignin}>
                Log in
              </Button>
              {/* <Button type="secondary" onClick={onSignup}>
                Sign up
              </Button> */}
            </>
          )}

          <FontAwesomeIcon
            data-testid="button-cart-icon"
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
