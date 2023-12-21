import { Input } from "@chakra-ui/react";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";

function EditImage({ getValue, row }) {
  const initValue = getValue();

  return (
    <Link href={`/account/manage-items/${row.original.id}`}>
      {initValue ? (
        <Image
          width="60"
          height="60"
          alt="product"
          loading="lazy"
          quality={60}
          src={initValue[0]}
        ></Image>
      ) : (
        <Button>Add Image</Button>
      )}
    </Link>
  );
}

export default EditImage;
