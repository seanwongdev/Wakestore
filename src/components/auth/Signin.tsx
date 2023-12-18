import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Signin {
  onSignin: () => void;
  onSwap: () => void;
  onOverlaySignin: React.MouseEventHandler<HTMLDivElement>;
}

const Signin: React.FC<Signin> = ({ onSignin, onSwap, onOverlaySignin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (data?.ok) {
      toast.success("Successfully logged in");
      onSignin();
    }

    toast.error(data?.error);
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity opacity-100"
      onClick={onOverlaySignin}
    >
      <div className="bg-white inset-1 p-8 rounded shadow-lg">
        <span className="flex justify-end">
          <FontAwesomeIcon icon={faXmark} onClick={onSignin} />
        </span>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md  bg-gray-200 px-4 py-3 text-sm transition-all duration-300"
              ></input>
            </div>

            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md  bg-gray-200 px-4 py-3 text-sm transition-all duration-300"
              ></input>

              <button type="submit"> Sign in</button>
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