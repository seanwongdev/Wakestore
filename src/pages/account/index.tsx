import { useSession } from "next-auth/react";

import ProfileLayout from "@/components/layout/ProfileLayout";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function Account() {
  const [image, setImage] = useState("");
  const router = useRouter();

  const { data: session, status } = useSession();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (status !== "authenticated") {
          // If session or user ID is missing, handle accordingly
          throw new Error("User ID not available");
        }
        const res = await fetch(`/api/account/${session.user.id}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const { userData } = await res.json();

        setImage(userData.img_url);
      } catch (err: any) {
        console.error("Error in fetching user data:", err);
      }
    };
    fetchUserData();
  }, [session?.user?.id, status, image]);

  const handleSignout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleUpdate = () => {
    router.push(`/account/${session?.user.id}`);
  };
  return (
    <div className="flex flex-col ms-6 gap-14 mt-10">
      <div className="flex gap-10 flex-wrap">
        {session?.user.image ? (
          <Image
            className="rounded-full"
            alt="avatar"
            width={200}
            height={200}
            loading="lazy"
            quality={60}
            src={image}
          />
        ) : (
          <>
            <Image
              className="rounded-full"
              alt="avatar"
              width={200}
              height={200}
              loading="lazy"
              quality={60}
              src="https://res.cloudinary.com/dleikmnsf/image/upload/v1702456346/Blank-Avatar-Man-in-Suit_vzwexp.jpg"
            />
          </>
        )}
        <div className="flex flex-col space-y-3 justify-center">
          <div className="flex flex-col">
            <span className="text-sm underline">Username</span>{" "}
            <span className="font-semibold text-xl">
              {session?.user.username}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm underline">Email</span>{" "}
            <span className="font-semibold text-xl">{session?.user.email}</span>
          </div>
        </div>
      </div>
      <div className="w-[400px] flex justify-center gap-5">
        <Button onClick={handleUpdate} className="bg-gray-600 w-[130px]">
          Update Profile
        </Button>
        <Button onClick={handleSignout} className="w-[130px]">
          Log Out
        </Button>
      </div>
    </div>
  );
}

Account.PageLayout = ProfileLayout;
