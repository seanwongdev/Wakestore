import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { Product } from "@/pages/products/[products]";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons/faCaretUp";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Image from "next/image";
import { toast } from "react-toastify";

interface CartItemsProps {
  id: number;
  quantity: number;
  productData: Product[];
}

const CartItems = ({ id, quantity, productData }: CartItemsProps) => {
  const quantityOptions: JSX.Element[] = [];
  for (let i = 1; i < 100; i++) {
    quantityOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  const {
    removeFromCart,

    changeCartQuantity,
  } = useCart();

  const item = productData?.find((item) => item.id === id);
  if (item === null) return null;

  return (
    <div className="flex md:gap-4 md:justify-evenly py-6 border-b">
      {item?.image_url ? (
        <Image
          loading="lazy"
          height="0"
          width="0"
          alt="product"
          sizes="90vw"
          className="w-[80px] object-contain md:w-[100px] h-auto"
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
            className="py-2 border rounded-md md:w-1/4 px-1 md:px-3.5 "
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
