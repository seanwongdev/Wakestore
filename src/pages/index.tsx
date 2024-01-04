import CollectionLayout from "@/components/layout/CollectionLayout";
import LandingLayout from "@/components/layout/LandingLayout";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-start ">
        <Image
          width="0"
          height="0"
          alt="landingpage"
          loading="lazy"
          sizes="100vw"
          quality={60}
          className="w-full h-[450px] object-cover object-[50%_74%]"
          src="https://res.cloudinary.com/dleikmnsf/image/upload/v1703562355/kalisa-veer-uo_sPhQWe5k-unsplash_aje5bm.jpg"
        ></Image>
        {/* <button className="bg-black border border-white p-1 absolute shadow bottom-[9%] left-[43.5%]">
          <Link href="/riding-essentials" className="font-bold text-white p-2">
            {" "}
            Rediscover your Passions{" "}
          </Link>
        </button> */}
      </div>
      <div className="text-center  mt-4">
        <span data-testid="landing-message" className="font-bold">
          SHRED YOUR SORROWS AWAY WITH US - COME REDISCOVER YOURSELF!
        </span>
        <div className=" w-[90vw] mx-auto grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 mt-6 h-auto">
          <Link
            href="/riding-essentials"
            className="flex flex-col justify-between h-4/5 pb-2"
          >
            <Image
              width="0"
              height="0"
              alt="collection1"
              loading="lazy"
              sizes="50vw"
              quality={60}
              className="w-auto h-auto object-cover "
              src="https://res.cloudinary.com/dleikmnsf/image/upload/v1703573657/BTG0721-WTF-Wakeboards-scaled_apz85d.jpg"
            ></Image>
            <div className="">
              <p
                data-testid="collections-paragraph"
                className="text-center font-bold"
              >
                RIDING ESSENTIALS
              </p>
              <p data-testid="collections-paragraph" className="text-center">
                Get everything you need for wakeboarding here!
              </p>
            </div>
          </Link>
          <Link
            href="/apparel"
            className=" flex flex-col justify-between h-4/5 pb-2"
          >
            <Image
              width="0"
              height="0"
              alt="collection2"
              loading="lazy"
              sizes="50vw"
              quality={60}
              className="w-auto h-auto object-cover "
              src="https://res.cloudinary.com/dleikmnsf/image/upload/v1703577325/t-shirt_v02yvl.jpg"
            ></Image>
            <div className="">
              <p
                data-testid="collections-paragraph"
                className="text-center font-bold"
              >
                APPAREL
              </p>
              <p data-testid="collections-paragraph" className="text-center">
                Look good while feeling good!
              </p>
            </div>
          </Link>
          <Link
            href="/accessories"
            className=" flex flex-col justify-between  h-4/5 pb-2"
          >
            <Image
              width="0"
              height="0"
              alt="collection3"
              loading="lazy"
              sizes="50vw"
              quality={60}
              className="w-auto h-3/4 object-contain"
              src="https://res.cloudinary.com/dleikmnsf/image/upload/v1703139516/dev_projects/qyq9ceotu7tj0dtzheme.jpg"
            ></Image>
            <div className="">
              <p
                data-testid="collections-paragraph"
                className="text-center font-bold"
              >
                ACCESSORIES
              </p>
              <p data-testid="collections-paragraph" className="text-center">
                Miscellaneous items to complete your needs
              </p>
            </div>
          </Link>
          <Link
            href="/kids"
            className=" flex flex-col justify-between  h-4/5 pb-2"
          >
            <Image
              width="0"
              height="0"
              alt="collection4"
              loading="lazy"
              sizes="50vw"
              quality={60}
              className="w-auto h-2/3 object-contain"
              src="https://res.cloudinary.com/dleikmnsf/image/upload/v1703578682/wakeboardstarterpackageimpactbrickwithaquabuddy_wakeboard___1_700x_xtvwy2.webp"
            ></Image>
            <div className="">
              <p
                data-testid="collections-paragraph"
                className="text-center font-bold"
              >
                KIDS
              </p>
              <p data-testid="collections-paragraph" className="text-center">
                For the little ones
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

Home.PageLayout = LandingLayout;
