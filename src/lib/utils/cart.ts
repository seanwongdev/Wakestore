import { getSession } from "next-auth/react";

const fetchConfig = (method: string, body: any) => ({
  method,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

export const getCart = async () => {
  try {
    const session = await getSession();

    if (session) {
      const { id } = session.user;
      const res = await fetch("/api/cart", fetchConfig("PATCH", id));
      if (!res.ok) throw new Error("Failed to get cart");

      const cartItemsArray = await res.json();
      return cartItemsArray;
    } else {
      if (!localStorage.getItem("cart")) return;
      const localCartId = JSON.parse(localStorage.getItem("cart")!);
      const res = await fetch(`/api/cart/${localCartId.cart_id}`);
      if (!res.ok) throw new Error("Failed to get cart");

      const cartItemsArray = await res.json();
      return cartItemsArray;
    }
  } catch (err) {
    console.error("Error fetching cart:", err);
    throw err;
  }
};

export const createCart = async () => {
  try {
    const session = await getSession();

    if (session) {
      const { id } = session.user;
      const res = await fetch("/api/cart", fetchConfig("POST", id));
      if (!res.ok) throw new Error("Failed to create cart");

      const { cart } = await res.json();
      return cart;
    } else {
      const res = await fetch("/api/cart", fetchConfig("POST", null));
      if (!res.ok) throw new Error("Failed to create cart");

      const { cart } = await res.json();

      localStorage.setItem("cart", JSON.stringify(cart));
      return cart;
    }
  } catch (err) {
    console.error("Error creating cart:", err);
    throw err;
  }
};

export const createCartItem = async (productId: number, cartId: number) => {
  try {
    const res = await fetch(
      "/api/cartitems",
      fetchConfig("POST", { productId, cartId })
    );
    if (!res.ok) throw new Error("Failed to create cartItem");
    const { cartItem } = await res.json();
    return cartItem;
  } catch (err) {
    console.error("Error creating cartItem:", err);
    throw err;
  }
};

export const updateCartItem = async (
  cartItemId: number,
  quantityOrdered: number
) => {
  try {
    const res = await fetch(
      `/api/cartitems/${cartItemId}`,
      fetchConfig("PATCH", { quantityOrdered })
    );
    if (!res.ok) throw new Error("Failed to update cartItem");
    const { cartitem } = await res.json();
    return cartitem;
  } catch (err) {
    console.error("Error updating cartItem:", err);
    throw err;
  }
};

export const removeCartItem = async (cartItemId: number) => {
  try {
    const res = await fetch(`/api/cartitems/${cartItemId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete cartItem");
    const { cartitem } = await res.json();
    return cartitem;
  } catch (err) {
    console.error("Error removing cart:", err);
    throw err;
  }
};

export const mergeAnonymousCartIntoUserCart = async (userId: number) => {};
