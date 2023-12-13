import { ReactNode, useEffect, useState } from "react";
import { LayoutProps } from "next-auth";
import SideProfileNavBar from "../SideProfileBar";

const ProfileLayout: React.FC<LayoutProps> = ({ children }) => {
  const [user, setUser] = useState("");
  return (
    <div className="flex  h-screen w-[91vw] mx-auto mt-10">
      <div className="w-[280px]">
        <SideProfileNavBar />
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default ProfileLayout;
