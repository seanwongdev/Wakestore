import { ReactNode, useEffect, useState } from "react";
import { LayoutProps } from "next-auth";
import SideProfileNavBar from "../SideProfileBar";

const ProfileLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="md:grid md:grid-cols-[auto,1fr] gap-5 h-screen">
      <div>
        <SideProfileNavBar />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ProfileLayout;
