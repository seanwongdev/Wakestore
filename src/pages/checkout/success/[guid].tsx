import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWater } from "@fortawesome/free-solid-svg-icons/faWater";
import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();
  console.log(router);
  const { guid } = router.query;
  const orderId = Array.isArray(guid) ? guid[0] : guid;
  return (
    <div className="text-center my-8">
      <header className="font-bold text-2xl my-2">
        THANK YOU FOR YOUR ORDER!
      </header>
      <span className="">
        Your order has been confirmed. You will receive an email confirmation
        shortly. Your order ID is <strong>{orderId?.toUpperCase()}</strong>
      </span>
      <div className="my-4 flex justify-center">
        <div className="h-[2px] bg-black w-[70px]"></div>
      </div>
      <div className="flex flex-col">
        <span className="mb-4">
          Get ready to start <em>SHREDDING!</em>
        </span>
        <FontAwesomeIcon className="text-5xl text-blue-500" icon={faWater} />
      </div>
    </div>
  );
}
