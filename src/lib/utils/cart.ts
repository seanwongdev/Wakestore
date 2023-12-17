export const getCart = async () => {
  const localCartId = JSON.parse(localStorage.getItem("cart")!);
  const res = await fetch(`/api/cart/${localCartId}`);
  const { cart } = await res.json();
};

export const createCart = async (userId: number | null = null) => {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userId),
  });
  const { cart } = await res.json();

  localStorage.setItem("cart", JSON.stringify(cart.id));
};
