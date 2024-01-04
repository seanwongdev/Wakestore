import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrown } from "@fortawesome/free-regular-svg-icons/faFaceFrown";

export default function Rejected() {
  return (
    <div className="text-center my-8">
      <header className="font-bold text-2xl my-2">TRANSACTION FAILED</header>
      Unfortunately, your order was not successful. Please try again!
      <div className="my-4 flex justify-center">
        <div className="h-[2px] bg-black w-[70px]"></div>
      </div>
      <div className="flex flex-col">
        <span className="mb-4"> {"Don't miss out!"}</span>
        <FontAwesomeIcon className="text-5xl" icon={faFaceFrown} />
      </div>
    </div>
  );
}
