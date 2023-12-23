import Link from "next/link";
import { Collection } from "./layout/Layout";

interface FooterProps {
  data: Collection[];
}

const Footer = ({ data }: { data: FooterProps }) => {
  return (
    <div className="bg-footer bg-footer::before mt-4 h-auto">
      <div className="flex flex-col w-[90vw] mx-auto ">
        <div className="grid lg:grid-cols-[4fr,3fr,3fr,4fr] md:grid-cols-3 gap-6 text-white pt-14">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-xl">logo and address</span>
            <span>logo and address</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-xl">Shop by</span>
            {data.map((collection) => (
              <Link
                href={collection.collection_url}
                key={collection.collection_id}
              >
                {collection.collection_name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-xl">Customer Service</span>
            <span>Contact us</span>
            <span>About us</span>
            <span>Shipping & Returns</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-xl">Newsletter sign up</span>
            <span>
              Receive our latest updates about our products and promotions
            </span>
            <input placeholder="Enter your email address" type="text"></input>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-gray-200 text-sm mt-10 pb-4">
          <span>Inspired by BuyWake.com </span>
          <span>
            Photo by{" "}
            <a href="https://unsplash.com/@jor9en?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
              Jorgen Hendriksen
            </a>{" "}
            on{" "}
            <a href="https://unsplash.com/photos/a-man-flying-through-the-air-while-riding-a-snowboard-nlMXEfw9xqQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
              Unsplash
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
