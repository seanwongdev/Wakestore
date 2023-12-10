import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavbarProps } from "../navbar";

interface Signin {
  onSignin: () => void;
  onSwap: () => void;
}

const Signin: React.FC<Signin> = ({ onSignin, onSwap }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity opacity-100 ">
      <div className="bg-white inset-1 p-8 rounded shadow-lg">
        <span className="flex justify-end">
          <FontAwesomeIcon icon={faXmark} onClick={onSignin} />
        </span>
        <form action="">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                value=""
                onChange=""
                className="w-full rounded-md  bg-gray-200 px-4 py-3 text-sm transition-all duration-300"
              ></input>
            </div>

            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                value=""
                onChange=""
                className="w-full rounded-md  bg-gray-200 px-4 py-3 text-sm transition-all duration-300"
              ></input>
            </div>
          </div>
        </form>
        <span>Not a member yet?</span> <span onClick={onSwap}>Sign up</span>
      </div>
    </div>
  );
};

export default Signin;

//
