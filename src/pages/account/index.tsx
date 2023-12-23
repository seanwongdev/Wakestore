import { useSession } from "next-auth/react";

import ProfileLayout from "@/components/layout/ProfileLayout";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function Account() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const handleUpdate = () => {
    router.push(`/account/${session?.user.id}`);
  };
  return (
    <div className="flex flex-col gap-14 ">
      <div className="flex gap-10">
        {session?.user.image ? (
          <Image
            className="rounded-full"
            alt="avatar"
            width={200}
            height={200}
            loading="lazy"
            quality={60}
            src={session?.user.image}
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
      <div className="w-[400px] flex justify-center">
        <Button onClick={handleUpdate} className="w-[130px]">
          Update Profile
        </Button>
      </div>
    </div>
  );
}

Account.PageLayout = ProfileLayout;
