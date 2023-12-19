import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { Product } from "@/pages/products/[products]";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons/faCaretUp";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Image from "next/image";

interface CartItemsProps {
  id: number;
  quantity: number;
}

const CartItems = ({ id, quantity }: CartItemsProps) => {
  const quantityOptions: JSX.Element[] = [];
  for (let i = 1; i < 100; i++) {
    quantityOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }
  const [data, setData] = useState<Product[]>([]);
  const {
    removeFromCart,

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
      {item?.image_url ? (
        <Image
          height="30"
          width="80"
          alt="product"
          src={item.image_url[0]}
        ></Image>
      ) : (
        <span>image</span>
      )}
      <div className="flex flex-col gap-2 flex-grow ">
        <span>{item?.name}</span>
        <span className="font-bold">
          {quantity > 1 ? `${quantity} x` : ""} $
          {Number(item?.price).toFixed(2)}
        </span>
        <div className="font-semibold relative">
          Quantity:{" "}
          <select
            className="py-2.5 border rounded-md w-1/4 px-3.5 "
            value={quantity}
            onChange={(e) => changeCartQuantity(id, e.target.value)}
          >
            {quantityOptions.map((row) => row)}
          </select>
        </div>
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
