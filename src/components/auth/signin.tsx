import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavbarProps } from "../navbar";

const Signin: React.FC<NavbarProps> = ({ onSignin }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity opacity-100 ">
      <div className="bg-white inset-1 p-8 rounded shadow-lg">
        <FontAwesomeIcon icon={faXmark} onClick={onSignin} />
        <div className="flex flex-col gap-4">
          {/* {links.map((link) => {
            const { text, path, icon } = link;
            return (
              <LinkButton
                type="small"
                to={path}
                key={text}
                onClick={handleToggleSidebar}
              >
                {icon} {text}{" "}
              </LinkButton>
            );
          })} */}
        </div>
      </div>
    </div>
  );
};

export default Signin;

//
