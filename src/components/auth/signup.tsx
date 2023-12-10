import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavbarProps } from "../navbar";

interface SignupProps {
  onSignup: () => void;
  onSwap: () => void;
}

const SignUp: React.FC<SignupProps> = ({ onSignup, onSwap }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity opacity-100 ">
      <div className="bg-white inset-1 p-8 rounded shadow-lg">
        <FontAwesomeIcon icon={faXmark} onClick={onSignup} />
        <div className="flex flex-col gap-4">
          <span>Already a member?</span>
          <span onClick={onSwap}>Sign in</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

//
