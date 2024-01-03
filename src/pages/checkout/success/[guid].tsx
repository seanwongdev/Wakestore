import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();
  console.log(router);
  const { guid } = router.query;
  const orderId = Array.isArray(guid) ? guid[0] : guid;
  return (
    <div className="text-center my-6">
      <header className="font-bold text-2xl my-2">
        THANK YOU FOR YOUR ORDER!
      </header>
      <span className="">
        Your order has been confirmed. You will receive an email confirmation
        shortly. Your order ID is <strong>{orderId?.toUpperCase()}</strong>
      </span>
    </div>
  );
}
