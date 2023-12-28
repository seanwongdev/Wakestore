import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface OrderItemProps {
  user_id: number;
  guid: string;
  address: string;
  phone: string;
  total: string;
  order_modified_at: string;
  name: string;
  quantity_ordered: number;
  price: string;
}

const OrderItem = ({ data }: { data: OrderItemProps[] }) => {
  const dateOptions = { day: "numeric", month: "short", year: "numeric" };
  return (
    <div className="mt-10">
      {data.length > 0 ? (
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:justify-between md:items-center">
            <CardTitle>Order {data[0]?.guid.toUpperCase()}</CardTitle>
            <CardDescription>
              {new Intl.DateTimeFormat("en-GB", dateOptions).format(
                new Date(data[0]?.order_modified_at)
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y space-y-3">
            <div className="space-y-3">
              {data.map((item) => (
                <div key={item.name} className="flex justify-between">
                  <div>
                    <span>{item.name}</span>
                    <span className="md:hidden">
                      {" "}
                      ({item.quantity_ordered})
                    </span>
                  </div>
                  <div>
                    <span className="hidden md:inline">
                      {item.quantity_ordered} X{" "}
                    </span>
                    <span>{formatCurrency(parseFloat(item.price))}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 flex justify-between">
              <span className="font-semibold">Subtotal</span>
              <span className="font-semibold">
                {formatCurrency(parseFloat(data[0]?.total))}
              </span>
            </div>
          </CardContent>
          <CardFooter className="space-y-3 flex flex-col items-start">
            <p className="underline">Delivery Details:</p>
            <p>{data[0]?.address}</p>
            <p>{data[0]?.phone}</p>
          </CardFooter>
        </Card>
      ) : (
        ""
      )}
    </div>
  );
};

export default OrderItem;
