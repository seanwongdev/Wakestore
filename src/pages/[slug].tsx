import { useRouter } from "next/router";

export default function Product() {
  const router = useRouter();
  return <p>Product: {router.query.slug}</p>;
}

export async function getStaticProps() {
  // connect to DB
  // set variable to data.
  // close client
  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
    revalidate: 3600,
  };
}

function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    const { title, image, address, description } = data;
  }
}
