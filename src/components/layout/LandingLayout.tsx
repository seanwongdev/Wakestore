import { ReactNode, useEffect, useState } from "react";
import SideNavbar from "../Navbar/SideNavbar";
import { LayoutProps } from "next-auth";
import { toast } from "react-toastify";

const LandingLayout: React.FC<ReactNode> = ({ children }) => {
  return (
    <div className="h-auto  w-[98vw] mx-auto my-4">
      <div>{children}</div>
    </div>
  );
};

export default LandingLayout;
