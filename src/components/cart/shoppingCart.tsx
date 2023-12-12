import { useCart } from "@/context/CartContext";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import CartItems from "./cartItems";

const ShoppingCart = () => {
  const { isOpen, toggleCart, cartItems } = useCart();
  console.log(cartItems);
  return (
    <div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <FontAwesomeIcon
          className={`text-3xl absolute text-white top-[20px] right-[520px] z-10 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-400`}
          icon={faXmark}
          onClick={toggleCart}
        />
        <div
          className={`bg-white p-8 w-[500px] h-full overflow-y-auto transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-400`}
        >
          <span className="flex justify-start font-bold text-2xl">
            Your Cart
          </span>
          <div className="mt-4 text-gray-500 font-semibold">
            {cartItems.length} items
          </div>

          {cartItems.length > 0 ? (
            <div className="  ">
              {cartItems.map((item) => (
                <CartItems
                  key={item.id}
                  id={item.id}
                  quantity={item.quantity}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 text-center">Your cart is empty</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
