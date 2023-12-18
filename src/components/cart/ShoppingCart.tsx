import { useCart } from "@/context/CartContext";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import CartItems from "./CartItems";
import Button from "../Button";
import { Product } from "@/pages/products/[products]";
import { formatCurrency } from "@/lib/utils/formatCurrency";

const ShoppingCart = () => {
  const { isOpen, toggleCart, cartItems, handleOverlayClick } = useCart();
  const [data, setData] = useState<Product[]>([]);
  useEffect(() => {
    const fetchProductData = async () => {
      const res = await fetch("/api/admin/products");
      const { products } = await res.json();

      setData(products);
    };
    fetchProductData();
  }, []);

  const totalCost = cartItems?.reduce(
    (acc, cur) =>
      acc +
      cur.quantity_ordered *
        (data.find((item) => item.id === cur.product_item_id)?.price || 0),
    0
  );

  return (
    <div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleOverlayClick}
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
            {cartItems?.length} items
          </div>

          {cartItems?.length > 0 ? (
            <>
              <div className="  ">
                {cartItems.map((item) => (
                  <CartItems
                    key={item.product_item_id}
                    id={item.product_item_id}
                    quantity={item.quantity_ordered}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-8">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(totalCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Grand Total: </span>
                  <span className="font-bold">{formatCurrency(totalCost)}</span>
                </div>
                <Button type="primary" onClick={() => {}}>
                  CHECKOUT
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-4 text-center">Your cart is empty</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
