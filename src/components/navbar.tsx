import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex justify-between w-full px-20 py-12 bg-gray-800 text-white">
      <span>Logo</span>
      <div className="flex justify-evenly gap-14 ">
        <Link href={"/riding-essentials"}> Riding Essentials</Link>
        <span>Apparel</span>
        <span>Accessories</span>
        <span>Kids</span>
      </div>
      <div>Sign in</div>
    </div>
  );
};

export default Navbar;
