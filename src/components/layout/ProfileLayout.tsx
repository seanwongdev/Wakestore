import { ReactNode, useEffect, useState } from "react";
import { LayoutProps } from "next-auth";
import SideProfileNavBar from "../Navbar/SideProfileBar";

const ProfileLayout: React.FC<LayoutProps> = ({ children }) => {
  const [user, setUser] = useState("");
  return (
    <div className="lg:flex  h-auto w-[91vw] mx-auto my-10 flex-wrap">
      <div className="w-[280px]">
        <SideProfileNavBar />
      </div>
      <div className="lg:flex-1">{children}</div>
    </div>
  );
};

export default ProfileLayout;
