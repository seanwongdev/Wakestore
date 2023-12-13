import { ColumnDef } from "@tanstack/react-table";
import { ProductAdmin } from "@/pages/account/manage-items";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ProductAdmin>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "product_category_id",
    header: "Category Id",
  },
  {
    accessorKey: "url",
    header: "URL",
  },
  {
    accessorKey: "is_deleted",
    header: "Active",
  },
];
