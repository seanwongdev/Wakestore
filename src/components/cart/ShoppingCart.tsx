import { useCart } from "@/context/CartContext";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faCreditCard } from "@fortawesome/free-regular-svg-icons/faCreditCard";

import CartItems from "./CartItems";
import Button from "../Button";
import { Product } from "@/pages/products/[products]";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { toast } from "react-toastify";

const ShoppingCart = () => {
  const { isOpen, toggleCart, cartItems, handleOverlayClick, loadingStates } =
    useCart();

  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch product data");
        const { products } = await res.json();

        setData(products);
      } catch (err: any) {
        console.error("Error in fetching product data:", err);
        toast.error(err.message);
      }
    };
    fetchProductData();
  }, []);

  const totalCost = cartItems?.reduce((acc: number, cur) => {
    const product = data?.find((item) => item.id === cur.product_item_id);

    if (product) {
      return acc + cur.quantity_ordered * +product.price;
    }

    return acc;
  }, 0);

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout_sessions", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",

        body: JSON.stringify({ cartItems }),
      });
      console.log(res);
      if (!res.ok) throw new Error("Failed to checkout");
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
      return;
    } catch (err: any) {
      console.error("Error in checkout:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleOverlayClick}
      >
        <FontAwesomeIcon
          className={`text-3xl absolute text-white top-[20px] right-[340px] md:right-[520px] z-10 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-400`}
          icon={faXmark}
          onClick={toggleCart}
        />
        <div
          className={`bg-white p-8 w-[330px] md:w-[500px] h-full overflow-y-auto transform ${
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
                {cartItems.map((item) =>
                  loadingStates[item.product_item_id] ? (
                    <div
                      key={item.product_item_id}
                      className="loading md:mx-40 my-6 mx-20"
                    ></div>
                  ) : (
                    <CartItems
                      key={item.product_item_id}
                      id={item.product_item_id}
                      quantity={item.quantity_ordered}
                      productData={data}
                    />
                  )
                )}
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
                <Button type="checkout" onClick={checkout} disabled={loading}>
                  <FontAwesomeIcon icon={faCreditCard} />
                  <span>{loading ? "CHECKING OUT..." : "CHECKOUT"}</span>
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
