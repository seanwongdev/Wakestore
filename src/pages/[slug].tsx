import { useRouter } from "next/router";

export default function Product() {
  const router = useRouter();
  return <p>Product: {router.query.slug}</p>;
}
