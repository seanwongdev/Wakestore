import Link from "next/link";
import { useState, useEffect, MouseEventHandler } from "react";
import Button from "./Button";

interface Collection {
  collection_id: number;
  collection_name: string;
}

export interface NavbarProps {
  onSignup?: () => void;
  onSignin?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignup, onSignin }) => {
  const [data, setData] = useState<Collection[]>([]);

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
      <div className="flex justify-evenly gap-14 ">
        {data.map((row) => (
          <Link
            href={row.collection_name.toLowerCase().replace(/ /g, "-")}
            key={row.collection_id}
          >
            {" "}
            {row.collection_name}
          </Link>
        ))}
      </div>
      <div className="space-x-10">
        <Button type="primary" onClick={onSignin}>
          Sign in
        </Button>
        <Button type="secondary" onClick={onSignup}>
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
