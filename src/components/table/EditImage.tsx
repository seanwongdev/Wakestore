import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";

interface EditImageProps {
  getValue: () => any;
  row: any;
}

function EditImage({ getValue, row }: EditImageProps) {
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
