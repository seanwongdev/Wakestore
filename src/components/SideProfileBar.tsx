import Link from "next/link";

const SideProfileNavBar: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Link href="/account/new-item">Add Product</Link>
      <Link href="/account/manage-items">Manage Products</Link>
      <Link href="/account/monthly-stats">Monthly Stats</Link>
      <Link href="/account/all-users">All Users</Link>
      <Link href="/account/">Profile</Link>
      <Link href="/account/view-orders">Orders</Link>
      <Link href="/account/update-profile">Manage Profile</Link>
      <Link href="/account/update-password">Update Password</Link>
    </div>
  );
};

export default SideProfileNavBar;
