import {
  ChangeEvent,
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { LayoutProps } from "next-auth";
import ShoppingCart from "@/components/cart/ShoppingCart";

export interface CartContext {
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  changeCartQuantity: (id: number, value: string) => void;
  toggleCart: () => void;

  cartItems: CartItem[];
  isOpen: boolean;
}

interface CartItem {
  id: number;
  quantity: number;
}

const CartContext = createContext({} as CartContext);

export const CartProvider = ({ children }: LayoutProps) => {
  const setCartToState = () => {
    const { cart } = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")!)
      : [];
    setCartItems(cart);
  };

  useEffect(() => {
    setCartToState();
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const toggleCart = () => {
    setIsOpen((state) => !state);
    document.body.classList.toggle("overflow-hidden", !isOpen);
  };

  const getItemQuantity = (id: number) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };

  const increaseCartQuantity = (id: number) => {
    if (!cartItems.find((item) => item.id === id)) {
      const newCartItems = [...cartItems, { id, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify({ cart: newCartItems }));
      setCartToState();
    } else {
      const newCartItems = cartItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
      localStorage.setItem("cart", JSON.stringify({ cart: newCartItems }));
      setCartToState();
    }
  };

  const changeCartQuantity = (id: number, value: string) => {
    const newQuantity = parseInt(value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      const newCartItems = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("cart", JSON.stringify({ cart: newCartItems }));
      setCartToState();
    }
  };

  const decreaseCartQuantity = (id: number) => {
    if (cartItems.find((item) => item.id === id)?.quantity === 1) {
      const newCartItems = cartItems.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify({ cart: newCartItems }));
      setCartToState();
    } else {
      const newCartItems = cartItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        } else {
          return item;
        }
      });
      localStorage.setItem("cart", JSON.stringify({ cart: newCartItems }));
      setCartToState();
    }
  };

  const removeFromCart = (id: number) => {
    const newCartItems = cartItems.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify({ cart: newCartItems }));
    setCartToState();
  };

  return (
    <CartContext.Provider
      value={{
        toggleCart,
        cartItems,
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        isOpen,
        changeCartQuantity,
      }}
    >
      <ShoppingCart />
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
