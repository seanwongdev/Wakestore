import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      Come Wakeboard!
      <button className="bg-gray-500 rounded-md">
        <Link href="/riding-essentials" className="font-bold text-white p-2">
          {" "}
          Shop{" "}
        </Link>
      </button>
    </div>
  );
}
