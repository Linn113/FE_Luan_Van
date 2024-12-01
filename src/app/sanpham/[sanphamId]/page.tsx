"use client";
import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { formatVietnamCurrency } from "@/components/ProductCard";
import ButtonCpn from "@/components/ButtonCpn";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import StartCpn from "@/components/startCpn";
import { useQuery } from "@tanstack/react-query";
import { addToCart, getSanPham } from "../action";
import useStore from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const page = ({ params }: { params: { sanphamId: string } }) => {
  const [numberProduct, setNumberProduct] = useState(1);
  const [ratings, setRatings] = useState([]);
  const [ratingsCount, setRatingsCount] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [assumeRating, setAssumeRating] = useState(0);
  const [averageRating, setAverageRating] = useState(1);
  const [discountedPrice, setDiscountedPrice] = useState<any>(null);
  const { user, isChange, setIsChange } = useStore();
  const { toast } = useToast();

  const { isPending, isError, data, error }: any = useQuery({
    queryKey: ["detailItem"],
    queryFn: async () => {
      const data: any = await getSanPham(params.sanphamId);

      if (data?.rating) {
        const productRatings = JSON.parse(data.rating || "[]");
        let newRatingsCount: any = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalRating = 0;
        let sumRating = 0;

        productRatings.forEach((rating: any) => {
          if (rating.sao >= 1 && rating.sao <= 5) {
            newRatingsCount[rating.sao] += 1;
            totalRating++;
            sumRating += rating.sao;
          }
        });

        setRatings(productRatings);
        setRatingsCount(newRatingsCount);
        setAssumeRating(totalRating);
        const average =
          totalRating > 0 ? Math.round(sumRating / totalRating) : 0;
        setAverageRating(average);
      }

      if (data?.price && data?.discount) {
        const dateStart = new Date(data.discount.dateStart);
        const dateEnd = new Date(data.discount.dateEnd);

        if (isDiscountValid(dateStart, dateEnd)) {
          calculateDiscountedPrice(data.price, data.discount.percent);
        } else {
          setDiscountedPrice(data.price);
        }
      }
      return data;
    },
  });

  const handleAddProduct = async () => {
    if (data.status === "Hết hàng" || data.status === "Đang nhập") {
      toast({
        variant: "destructive",
        title: "Sản phẩm đang tạm hết hàng!!!",
      });
      return;
    }

    if (user?.isLogin) {
      try {
        const res = await addToCart(user.id, {
          id: params.sanphamId,
          quantity: numberProduct,
        });

        if (res) {
          setIsChange(!isChange);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // Retrieve existing products from localStorage (or set it to an empty array if none exist)
      const existingProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );

      // Check if the product already exists in the localStorage
      const productIndex = existingProducts.findIndex(
        (item: any) => item.id === data.id
      );

      if (productIndex !== -1) {
        // If the product exists, update the quantity
        existingProducts[productIndex].quantity += numberProduct;
      } else {
        // If the product doesn't exist, add it to the list with the selected quantity
        existingProducts.push({ ...data, quantity: numberProduct });
      }

      // Save the updated array of products to localStorage
      localStorage.setItem("products", JSON.stringify(existingProducts));

      toast({
        variant: "default",
        title: "Thêm sản phẩm thành công",
      });
      setIsChange(!isChange);
    }
  };

  const isDiscountValid = (dateStart: Date, dateEnd: Date): boolean => {
    const currentDate = new Date();
    return currentDate >= dateStart && currentDate <= dateEnd;
  };

  const calculateDiscountedPrice = (
    price: number,
    discountPercentage: number
  ) => {
    const discountAmount = (price * discountPercentage) / 100;
    setDiscountedPrice(price - discountAmount);
  };

  if (isPending) {
    return (
      <div className="w-full text-center my-[10%] text-3xl">Loading...</div>
    );
  }
  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <div className="flex justify-around px-[6%] mt-14">
        <Carousel className="w-[40%]">
          <CarouselContent className="shadow-lg">
            {JSON.parse(data.images).map((item: any, index:any) => (
              <CarouselItem key={item.url}>
                <div className="p-1">
                  <Card>
                    <CardContent
                      style={{
                        backgroundImage: `url(${item.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      className="flex flex-col aspect-square items-center justify-between p-6 relative rounded-xl overflow-hidden"
                    >
                      <div className="flex-grow" />
                      <div className="w-full bg-black bg-opacity-50 text-white p-2 absolute bottom-0 left-0">
                        <p className="text-lg font-semibold">hình {index+1}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="w-1/2">
          <h1 className="font-medium text-2xl capitalize">{data?.name}</h1>
          {/* <h2 className="font-medium text-xl mt-10 capitalize ">
            Mã sản phẩm: {params.sanphamId}
          </h2>
          <div className="font-medium text-xl mt-4 capitalize">
            Loại sản phẩm:
            <p className="">{data.category.description}</p>
          </div> */}
         
          <p className="pt-2 ">
              {(() => {
                try {
                  const parsedDescription = JSON.parse(data.description);

                  // Extract description text and list of products
                  const descriptionText = parsedDescription.description;
                  const productListSang = parsedDescription.listProductsSang;
                  const productListChieu = parsedDescription.listProductsChieu;

                  return (
                    <>
                      <p>{descriptionText}</p>
                    
                    </>
                  );
                } catch (error) {
                  // Fallback if data.description is not valid JSON
                  return <p>{data.description}</p>;
                }
              })()}
          </p>
          <div className="font-medium text-md mt-4 capitalize">
            Calories:
            <span className="ml-2">{data.calories}</span>
          </div>
          {/* <div className="font-medium text-xl mt-2 capitalize">
            Số lượng đã bán:
            <span className="ml-2">
              {data.numberSeller ? data.numberSeller : 0}
            </span>
          </div> */}
        
          <div className="mt-4 flex items-center ">
            <h2
              className={`font-medium text-xl mr-4 capitalize  ${
                isDiscountValid(
                  new Date(data?.discount?.dateStart),
                  new Date(data?.discount?.dateEnd)
                )
                  ? "line-through"
                  : ""
              }`}
            >
              <span className="px-4 py-[0.7rem] border-2 rounded-3xl bg-white">{formatVietnamCurrency(data.price)}</span>
            </h2>
            <div className=" flex items-center px-4 py-1 border-2 rounded-3xl bg-white">
              <div
                onClick={(e) => {
                  if (numberProduct - 1 <= 0) {
                    setNumberProduct(0);
                  } else {
                    setNumberProduct(numberProduct - 1);
                  }
                }}
                className="text-4xl cursor-pointer"
              >
                -
              </div>
              <h2 className="text-2xl mx-6">{numberProduct}</h2>
              <div
                onClick={() => {
                  if (numberProduct + 1 > 14) {
                    setNumberProduct(15);
                  } else {
                    setNumberProduct(numberProduct + 1);
                  }
                }}
                className="text-4xl cursor-pointer"
              >
                +
              </div>
            </div>
          </div>
          {isDiscountValid(
            new Date(data?.discount?.dateStart),
            new Date(data?.discount?.dateEnd)
          ) ? (
            <>
              <h2 className="font-medium text-xl mt-4 capitalize text-red-600">
                Giá giảm: {formatVietnamCurrency(discountedPrice)}
              </h2>
              <h2 className="font-medium text-xl mt-4 capitalize text-blue-400">
                thời gian:{" "}
                {`${new Date(data.discount.dateStart).toLocaleDateString(
                  "en-GB"
                )}`}{" "}
                -
                {`${new Date(data.discount.dateEnd).toLocaleDateString(
                  "en-GB"
                )}`}
                
              </h2>
              <p className="mt-4 text-xl text-red-500 font-bold">
                Lưu ý: Chỉ áp dụng cho khách hàng là thành viên của quán!
              </p>
            </>
          ) : (
            ""
          )}
          <div className="mt-4 flex">
            <div onClick={handleAddProduct} className="my-4 mr-4">
              <ButtonCpn title="Thêm" type="default" className="w-[12rem]" />
            </div>
            <div className="my-4">
              <Link href={"/order"}>
                <ButtonCpn
                  title="Mua hàng"
                  type="default"
                  className="w-[12rem]"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
        {(() => {
              try {
                const parsedDescription = JSON.parse(data.description);

                // Extract description text and list of products
                const productListSang = parsedDescription.listProductsSang;
                const productListChieu = parsedDescription.listProductsChieu;

                return (
                  <>
                  <div className="mt-10 w-4/6 mx-auto min-h-[14rem]">
                        <Separator />
                        <h1 className="text-3xl font-mono mt-4">Danh sách sản phẩm:</h1>
                        <p className="pt-10 pb-[10%]">
                          {productListSang && productListSang.length > 0 && (
                                    <ul>
                                      <h1 className="font-semibold">Buổi sáng</h1>
                                      {productListSang.map((product: any, index: any) => (
                                        <>
                                          {index + 2 === 8 ? (
                                            <li className="ml-4" key={index}>
                                              CN-{product}
                                            </li>
                                          ) : (
                                            <li className="ml-4" key={index}>
                                              T{index + 2}-{product}
                                            </li>
                                          )}
                                        </>
                                      ))}
                                    </ul>
                            )}
                          {productListChieu && productListChieu.length > 0 && (
                                    <ul>
                                      <h1 className="font-semibold">Buổi chiều</h1>
                                      {productListChieu.map((product: any, index: any) => (
                                        <>
                                          {index + 2 === 8 ? (
                                            <li className="ml-4" key={index}>
                                              CN-{product}
                                            </li>
                                          ) : (
                                            <li className="ml-4" key={index}>
                                              T{index + 2}-{product}
                                            </li>
                                          )}
                                        </>
                                      ))}
                                    </ul>
                            )}
                        </p>
                        <Separator />
                      </div>
                    
                  </>
                );
              } catch (error) {
                // Fallback if data.description is not valid JSON
                return ""
              }
        })()}
      <div className="mt-10 w-4/6 mx-auto min-h-[14rem]">
        <h1 className="text-3xl font-mono mt-4">Đánh giá sản phẩm</h1>
        <div className="md:flex justify-between pb-10">
          <div className="md:w-1/3">
            <h1 className="text-5xl font-semibold mt-2">
              Đánh giá của người dùng{" "}
            </h1>
            <div className="mt-4 ">
              <div className="flex justify-center items-center">
                <h1 className="text-xl w-[6rem]">5 Sao </h1>
                <Slider
                  className="my-4"
                  disabled={true}
                  defaultValue={[ratingsCount[5]]}
                  max={1}
                />
                <p className="text-xl">{ratingsCount[5]}</p>
              </div>
              <div className="flex justify-center items-center">
                <h1 className="text-xl w-[6rem]">4 Sao</h1>
                <Slider
                  className="my-4 "
                  disabled={true}
                  defaultValue={[ratingsCount[4]]}
                  max={assumeRating}
                />
                <p className="text-xl">{ratingsCount[4]}</p>
              </div>
              <div className="flex justify-center items-center">
                <h1 className="text-xl w-[6rem]">3 Sao</h1>
                <Slider
                  className="my-4"
                  disabled={true}
                  defaultValue={[ratingsCount[3]]}
                  max={assumeRating}
                />
                <p className="text-xl">{ratingsCount[3]}</p>
              </div>
              <div className="flex justify-center items-center">
                <h1 className="text-xl w-[6rem]">2 Sao</h1>
                <Slider
                  className="my-4"
                  disabled={true}
                  defaultValue={[ratingsCount[2]]}
                  max={assumeRating}
                />
                <p className="text-xl">{ratingsCount[2]}</p>
              </div>
              <div className="flex justify-center items-center">
                <h1 className="text-xl w-[6rem]">1 Sao</h1>
                <Slider
                  className="my-4"
                  disabled={true}
                  defaultValue={[ratingsCount[1]]}
                />
                <p className="text-xl">{ratingsCount[1]}</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 md:mt-[20%]">
            <div className="flex justify-end">
              <StartCpn numberStar={averageRating} />
            </div>
            <div className="text-3xl font-mono text-end my-2">4/5</div>
            <div className="text-3xl font-mono text-end my-2">
              ({assumeRating} REVIEW)
            </div>
          </div>
        </div>
        <Separator />
      </div>
      <div className="mt-10 w-4/6 mx-auto min-h-[14rem]">
        {ratings &&
          ratings.length > 0 &&
          ratings.map((rating: any) => (
            <div className="">
              <Separator />
              <div className="flex items-center pt-4">
                <StartCpn width="20" height="20" numberStar={rating?.sao} />
              </div>
              <div className="my-4">Khách hàng: {rating?.name}</div>
              <div className="pb-4">
                Đánh giá:{" "}
                <span className=" text-slate-500">{rating?.danhGia}</span>
              </div>
              <Separator />
            </div>
          ))}
      </div>
    </>
  );
};

export default page;
