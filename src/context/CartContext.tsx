import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createCart,
  createCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/utils/cart";
import { LayoutProps } from "next-auth";
import { useSession } from "next-auth/react";

import ShoppingCart from "@/components/cart/ShoppingCart";
import { toast } from "react-toastify";
import { ToastProvider } from "@chakra-ui/react";

export interface CartContext {
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  loadingStates: { [key: number]: boolean };

  removeFromCart: (id: number) => void;
  changeCartQuantity: (id: number, value: string) => void;
  toggleCart: () => void;
  handleOverlayClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  cartItems: CartItem[];
  isOpen: boolean;
}

export interface CartItem {
  user_id?: number;
  cart_id: number;
  cartitems_id: number;
  product_item_id: number;
  name: string;
  quantity_ordered: number;
  price: string;
}

const CartContext = createContext({} as CartContext);

export const CartProvider = ({ children }: LayoutProps) => {
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const { data: session, status } = useSession();

  const setCartToState = async () => {
    try {
      const cartProds = (await getCart()) ?? [];

      // const { cart } = localStorage.getItem("cart")
      //   ? JSON.parse(localStorage.getItem("cart")!)
      //   : [];
      setCartItems(cartProds);
    } catch (err: any) {
      console.error("Error setting cart to state:", err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    setCartToState();
  }, [status]);
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const toggleCart = () => {
    setIsOpen((state) => !state);
    document.body.classList.toggle("overflow-hidden", !isOpen);
  };

  const getItemQuantity = (id: number) => {
    return (
      cartItems?.find((item) => item.cartitems_id === id)?.quantity_ordered || 0
    );
  };

  const increaseCartQuantity = async (productId: number) => {
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [productId]: true,
    }));
    try {
      if (cartItems.length > 0) {
        const articleInCart = cartItems.find(
          (item) => item.product_item_id === productId
        );

        if (articleInCart) {
          await updateCartItem(
            articleInCart.cartitems_id,
            articleInCart.quantity_ordered + 1
          );
          await setCartToState();
        } else {
          await createCartItem(productId, cartItems[0].cart_id);
          await setCartToState();
        }
      } else {
        const cart = await createCart();
        await createCartItem(productId, cart.cart_id);
        await setCartToState();
      }
      toggleCart();
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      toast.error(err.message);
    } finally {
      setLoadingStates({});
    }
  };
  // const increaseCartQuantity = (id: number) => {
  //   if (!cartItems?.find((item) => item.id === id)) {
  //     const newCartItems = cartItems?.length > 0 ?  [...cartItems,  {id, quantity: 1 }] : [{id, quantity: 1}];
  //     localStorage.setItem("cart", JSON.stringify({ cart: newCartItems }));
  //     setCartToState();
  //   } else {
  //     const newCartItems = cartItems.map((item) => {
  //       if (item.id === id) {
  //         return { ...item, quantity: item.quantity + 1 };
  //       } else {
  //         return item;
  //       }
  //     });
  //     localStorage.setItem("cart", JSON.stringify({ cart: newCartItems }));
  //     setCartToState();
  //   }
  // };

  const changeCartQuantity = async (id: number, value: string) => {
    const newQuantity = parseInt(value, 10);
    try {
      if (!isNaN(newQuantity) && newQuantity > 0) {
        const cartItemId = cartItems.find((item) => item.product_item_id === id)
          ?.cartitems_id!;
        await updateCartItem(cartItemId, newQuantity);
        await setCartToState();
      }
    } catch (err: any) {
      console.error("Error changing cart quantity:", err);
      toast.error(err.message);
    }
  };

  // const changeCartQuantity = (id: number, value: string) => {
  //   const newQuantity = parseInt(value, 10);
  //   if (!isNaN(newQuantity) && newQuantity > 0) {
  //     const newCartItems = cartItems.map((item) =>
  //       item.id === id ? { ...item, quantity: newQuantity } : item
  //     );
  //     localStorage.setItem("cart", JSON.stringify({ cart: newCartItems }));
  //     setCartToState();
  //   }
  // };
  const removeFromCart = async (id: number) => {
    try {
      const cartItemId = cartItems.find((item) => item.product_item_id === id)
        ?.cartitems_id!;
      await removeCartItem(cartItemId);
      await setCartToState();
    } catch (err: any) {
      console.error("Error removing from cart:", err);
      toast.error(err.message);
    }
  };

  // const removeFromCart = (id: number) => {
  //   const newCartItems = cartItems.filter((item) => item.id !== id);
  //   localStorage.setItem("cart", JSON.stringify({ cart: newCartItems }));
  //   setCartToState();
  // };

  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
      document.body.classList.toggle("overflow-hidden", !isOpen);
    }
  };

  return (
    <CartContext.Provider
      value={{
        toggleCart,
        cartItems,
        getItemQuantity,
        increaseCartQuantity,
        loadingStates,

        removeFromCart,
        isOpen,
        changeCartQuantity,
        handleOverlayClick,
      }}
    >
      <ShoppingCart />
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
