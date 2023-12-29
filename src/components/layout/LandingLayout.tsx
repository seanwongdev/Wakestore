import { LayoutProps } from "next-auth";

const LandingLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-auto  w-[98vw] mx-auto my-4">
      <div>{children}</div>
    </div>
  );
};

export default LandingLayout;
