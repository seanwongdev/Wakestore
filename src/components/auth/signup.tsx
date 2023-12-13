import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavbarProps } from "../Navbar";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SignupProps {
  onSignup: () => void;
  onSwap: () => void;
}

const SignUp: React.FC<SignupProps> = ({ onSignup, onSwap }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const user = {
      username,
      email,
      password,
      passwordConfirm,
    };
    try {
      const res = await fetch("/api/auth/signup", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(user),
      });
      const data = await res.json();

      if (data.message) toast.error(data.message);
      else {
        onSignup();
        toast.success("User successfully created ");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity opacity-100 ">
      <div className="bg-white inset-1 p-8 rounded shadow-lg">
        <div className="flex justify-end">
          <FontAwesomeIcon icon={faXmark} onClick={onSignup} />
        </div>
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md  bg-gray-200 px-4 py-3 text-sm transition-all duration-300"
                ></input>
              </div>
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
              </div>
              <div className="flex flex-col">
                <label htmlFor="email">Retype Password</label>
                <input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full rounded-md  bg-gray-200 px-4 py-3 text-sm transition-all duration-300"
                ></input>
              </div>
              <button type="submit"> Sign up</button>
            </div>
          </form>
          <span>Already a member?</span>
          <span onClick={onSwap}>Sign in</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

//
