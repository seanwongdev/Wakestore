import { useCart } from "@/context/CartContext";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import CartItems from "./cartItems";

const ShoppingCart = () => {
  const { isOpen, toggleCart, cartItems } = useCart();
  return (
    <div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white p-8 w-[350px] h-full overflow-y-auto transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-400`}
        >
          <FontAwesomeIcon icon={faXmark} onClick={toggleCart} />
          <span className="flex justify-center font-bold text-xl">
            Shopping Cart
          </span>
          {cartItems.map((item) => (
            <CartItems key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
