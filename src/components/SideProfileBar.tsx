import Link from "next/link";
import { useSession } from "next-auth/react";

const SideProfileNavBar: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col space-y-4 font-semibold">
      {session?.user?.role === "admin" && (
        <>
          <Link href="/account/new-item">Add Product</Link>
          <Link href="/account/manage-items">Manage Products</Link>
          <Link href="/account/monthly-stats">Monthly Stats</Link>
          <Link href="/account/all-users">All Users</Link>
        </>
      )}

      <Link href="/account/">Profile</Link>
      <Link href="/account/view-orders">Orders</Link>
      <Link href="/account/update-profile">Manage Profile</Link>
      <Link href="/account/update-password">Update Password</Link>
    </div>
  );
};

export default SideProfileNavBar;
