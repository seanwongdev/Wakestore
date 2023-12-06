import { useRouter } from "next/router";

export default function Product() {
  const router = useRouter();
  return (
    <div className="h-screen text-center">Product: {router.query.slug}</div>
  );
}
