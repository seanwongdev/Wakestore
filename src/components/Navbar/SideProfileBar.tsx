import Link from "next/link";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons/faFileCirclePlus";
import { faRectangleList } from "@fortawesome/free-regular-svg-icons/faRectangleList";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons/faChartSimple";
import { faAddressBook } from "@fortawesome/free-regular-svg-icons/faAddressBook";
import { faUser } from "@fortawesome/free-regular-svg-icons/faUser";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons/faCreditCard";

import { faKey } from "@fortawesome/free-solid-svg-icons/faKey";
import { useRouter } from "next/router";

const SideProfileNavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <>
      <div className="hidden lg:flex flex-col space-y-6 font-semibold">
        {session?.user?.role === "admin" && (
          <>
            <Link href="/account/new-item" className="space-x-4">
              <FontAwesomeIcon icon={faFileCirclePlus} />{" "}
              <span>Add Product</span>
            </Link>
            <Link href="/account/manage-items" className="space-x-4">
              <FontAwesomeIcon icon={faRectangleList} />{" "}
              <span>Manage Products</span>
            </Link>
            <Link href="/account/monthly-stats" className="space-x-4">
              <FontAwesomeIcon icon={faChartSimple} /> <span>Dashboard</span>
            </Link>
            <Link href="/account/all-users" className="space-x-4">
              <FontAwesomeIcon icon={faAddressBook} /> <span>All Users</span>
            </Link>
          </>
        )}

        <Link href="/account/" className="space-x-4">
          <FontAwesomeIcon icon={faUser} /> <span>Personal Information</span>
        </Link>
        <Link href="/account/view-orders" className="space-x-4">
          <FontAwesomeIcon icon={faCartShopping} /> <span>View Orders</span>
        </Link>
        <Link href="/account/my-purchases" className="space-x-4">
          <FontAwesomeIcon icon={faCreditCard} /> <span>My Purchases</span>
        </Link>
        <Link href="/account/update-password" className="space-x-4">
          <FontAwesomeIcon icon={faKey} />
          <span>Update Password</span>
        </Link>
      </div>
      <div className="lg:hidden text-start mb-4">
        <select
          className="bg-gray-800 w-full text-white p-2 focus:outline-none"
          onChange={(e) => router.push(e.target.value)}
        >
          {session?.user?.role === "admin" && (
            <>
              <option className="text-sm" value="/account/new-item">
                Add Product
              </option>
              <option className="text-sm" value="/account/manage-items">
                Manage Products
              </option>
              <option className="text-sm" value="/account/monthly-stats">
                Dashboard
              </option>
              <option className="text-sm" value="/account/all-users">
                All Users
              </option>
            </>
          )}

          <option className="text-sm" value="/account">
            Personal Information
          </option>
          <option className="text-sm" value="/account/view-orders">
            View Orders
          </option>
          <option className="text-sm" value="/account/my-purchases">
            My Purchases
          </option>
          <option className="text-sm" value="/account/update-password">
            Update Password
          </option>
        </select>
      </div>
    </>
  );
};

export default SideProfileNavBar;
