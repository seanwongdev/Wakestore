import { useSession } from "next-auth/react";

import ProfileLayout from "@/components/layout/ProfileLayout";
import Image from "next/image";

export default function Account() {
  const { data: session, status } = useSession();
  return (
    <div className="flex gap-10">
      {session?.user.image ? null : (
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
      <div className="flex flex-col space-y-3">
        <span>Username: {session?.user.username} </span>
        <span>Email: {session?.user.email} </span>
      </div>
    </div>
  );
}

Account.PageLayout = ProfileLayout;
