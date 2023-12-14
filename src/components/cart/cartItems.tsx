import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { Product } from "@/pages/[collection]";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons/faCaretUp";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface CartItemsProps {
  id: number;
  quantity: number;
}

const CartItems = ({ id, quantity }: CartItemsProps) => {
  const [data, setData] = useState<Product[]>([]);
  const {
    removeFromCart,
    increaseCartQuantity,
    decreaseCartQuantity,
    changeCartQuantity,
  } = useCart();
  useEffect(() => {
    const fetchProductData = async () => {
      const res = await fetch("/api/admin/products");
      const { products } = await res.json();

      setData(products);
    };
    fetchProductData();
  }, []);

  const item = data.find((item) => item.id === id);
  if (item === null) return null;

  return (
    <div className="flex gap-4 justify-evenly py-6 border-b">
      <div>image</div>
      <div className="flex flex-col gap-2 flex-grow ">
        <span>{item?.name}</span>
        <span className="font-bold">
          {quantity > 1 ? `${quantity} x` : ""} ${item?.price}
        </span>
        <span className="font-semibold relative">
          Quantity: <button></button>
          <FontAwesomeIcon
            className="absolute top-[10px] left-[130px]"
            icon={faCaretUp}
            onClick={() => increaseCartQuantity(id)}
          />
          <FontAwesomeIcon
            className="absolute top-[20px] left-[130px]"
            icon={faCaretDown}
            onClick={() => decreaseCartQuantity(id)}
          />
          <input
            className="py-2.5 border rounded-md w-1/4 px-3.5 "
            value={quantity}
            onChange={(e) => {
              changeCartQuantity(id, e.target.value);
            }}
          />
        </span>
      </div>

      <div className="flex items-center">
        <FontAwesomeIcon
          className="text-2xl text-gray-500"
          icon={faXmark}
          onClick={() => removeFromCart(id)}
        />
      </div>
    </div>
  );
};

export default CartItems;
