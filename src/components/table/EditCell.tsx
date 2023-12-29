import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Column, Row, Table } from "@tanstack/react-table";

interface EditCellProps {
  getValue: () => any;
  row: any;
  column: any;
  table: any;
}

function EditCell({ getValue, row, column, table }: EditCellProps) {
  const initValue = getValue();
  const [value, setValue] = useState(initValue);
  const { updateData } = table.options.meta;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isValidKey = /^\d$/.test(e.key);

    if (!isValidKey) {
      e.preventDefault();
    }
  };

  const handleEditCell = async () => {
    try {
      const productId = row.original.id;

      const payload = { ...row.original, [column.id]: value };
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      const { data } = await res.json();

      updateData(row.index, column.id, value);
    } catch (err: any) {
      console.error("Error in editing cell:", err);
      toast.error(err.message);
    }
  };
  useEffect(() => {
    setValue(initValue);
  }, [initValue]);
  return (
    <div>
      <Input
        htmlSize={14}
        minW={40}
        width="full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        border={0}
        onBlur={handleEditCell}
        rounded={0}
        height="100%"
        className="hover:bg-light p-3.5"
      ></Input>
    </div>
  );
}

export default EditCell;
