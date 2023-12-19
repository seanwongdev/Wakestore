import { getSession, useSession } from "next-auth/react";

export const getCart = async () => {
  const session = await getSession();

  if (session) {
    const { id } = session.user;
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    });
    const cartItemsArray = await res.json();
    return cartItemsArray;
  } else {
    if (!localStorage.getItem("cart")) return;
    const localCartId = JSON.parse(localStorage.getItem("cart")!);
    const res = await fetch(`/api/cart/${localCartId.cart_id}`);
    const cartItemsArray = await res.json();
    return cartItemsArray;
  }
};

export const createCart = async () => {
  const session = await getSession();

  if (session) {
    const { id } = session.user;
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    });
    const { cart } = await res.json();
    return cart;
  } else {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(null),
    });
    const { cart } = await res.json();

    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
  }
};

export const createCartItem = async (productId: number, cartId: number) => {
  const res = await fetch("/api/cartitems", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ productId, cartId }),
  });
  const { cartItem } = await res.json();
  return cartItem;
};

export const updateCartItem = async (
  cartItemId: number,
  quantityOrdered: number
) => {
  const res = await fetch(`/api/cartitems/${cartItemId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({ quantityOrdered }),
  });
  const { cartitem } = await res.json();
  return cartitem;
};

export const removeCartItem = async (cartItemId: number) => {
  const res = await fetch(`/api/cartitems/${cartItemId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });
  const { cartitem } = await res.json();
  return cartitem;
};

export const mergeAnonymousCartIntoUserCart = async (userId: number) => {};
