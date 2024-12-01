import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
export type ProductProps = {
  title: string;
  price: number;
  calories: number;
  img: string;
  id: string;
  star?: number;
  className?: string;
  discount?: any;
};

export const formatVietnamCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("đ", "VNĐ");
};

const CardBanner: React.FC<ProductProps> = ({
  title,
  img,
  calories,
  id,
  price,
  star = 0,
  discount,
  className,
}) => {
  // Calculate discounted price if discount is available
  const discountedPrice = discount
    ? price - (price * discount.percent) / 100
    : price;

  const isDiscountValid = (dateStart: Date, dateEnd: Date): boolean => {
    const currentDate = new Date();
    return currentDate >= dateStart && currentDate <= dateEnd;
  };

  const calculateDiscountedPrice = (
    price: number,
    discountPercentage: number
  ) => {
    const discountAmount = (price * discountPercentage) / 100;
    return price - discountAmount;
  };

  return (
    <Link href={`/sanpham/${id}`} className="cursor-pointer">
      <Card
        className={`h-[24rem] min-w-[14rem] w-[14rem] mx-2 my-2 ${className} cursor-pointer`}
      >
        <CardHeader
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="min-w-[10rem] min-h-[14rem] group-hover:zoom-in-75 relative"
        >
          {isDiscountValid(
            new Date(discount?.dateStart),
            new Date(discount?.dateEnds)
          ) ? (
            <Badge className="absolute top-4 right-4 bg-red-600 text-white">
              {discount.percent}% OFF
            </Badge>
          ) : null}
        </CardHeader>

        <CardContent className="mt-4 flex items-center justify-center w-full">
          <div className="text-md font-medium">
            <p className="text-center max-w-[10rem] truncate">{title}</p>
            {isDiscountValid(
              new Date(discount?.dateStart),
              new Date(discount?.dateEnd)
            ) ? (
              <>
                <p className="text-center mt-2 text-red-500 font-semibold">
                  {formatVietnamCurrency(discountedPrice)}
                </p>
                <p className="text-center line-through text-gray-500">
                  {formatVietnamCurrency(price)}
                </p>
              </>
            ) : (
              <p className="text-center mt-2 text-red-500 font-semibold">
                {formatVietnamCurrency(price)}
              </p>
            )}
            <p className="text-center text-sm text-slate-400 mt-2 max-w-[10rem] truncate">
              Calories: {calories}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-center w-full">
          {Array.from({ length: star }, (_, index) => (
            <img
              key={index}
              src="./Star1.svg"
              alt={`Star ${index + 1}`}
              className="w-5 h-5 inline-block mr-1"
            />
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CardBanner;
