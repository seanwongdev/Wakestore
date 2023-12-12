import {
  ChangeEvent,
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useState,
} from "react";
import ShoppingCart from "@/components/cart/shoppingCart";

interface CartProviderProps {
  children: ReactNode;
}

export interface CartContext {
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  changeCartQuantity: (id: number, value: string) => void;
  toggleCart: () => void;
  cartQuantity: number;
  cartItems: CartItem[];
  isOpen: boolean;
}

interface CartItem {
  id: number;
  quantity: number;
}

const CartContext = createContext({} as CartContext);

export const CartProvider = ({ children }: CartProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const toggleCart = () => {
    setIsOpen((state) => !state);
    document.body.classList.toggle("overflow-hidden", !isOpen);
  };

  const cartQuantity = cartItems.reduce((acc, cur) => {
    return acc + cur.quantity;
  }, 0);

  const getItemQuantity = (id: number) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };

  const increaseCartQuantity = (id: number) => {
    setCartItems((currItems) => {
      if (!currItems.find((item) => item.id === id)) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const changeCartQuantity = (id: number, value: string) => {
    const newQuantity = parseInt(value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setCartItems((currItems) => {
        return currItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
      });
    }
  };

  const decreaseCartQuantity = (id: number) => {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((currItems) => currItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        toggleCart,
        cartQuantity,
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
