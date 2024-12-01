"use client";

import ButtonCpn from "@/components/ButtonCpn";
import CardBanner from "@/components/CardBanner";
import ProductCard, { ProductProps } from "@/components/ProductCard";
import axiosClient from "@/lib/axios-client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<any>();

  useEffect(() => {
    (async () => {
      const res = await axiosClient.get("/product/withoutPag");
      console.log(res);
      if (res) {
        setProducts(res);
      }
    })();
  }, []);

  const handleStar = (rating: any): number => {
    let listRating;
    let totalStar = 0;

    if (rating) {
      listRating = JSON.parse(rating);
    }

    for (let _rating of listRating) {
      totalStar += Number(_rating.sao);
    }

    const average =
      totalStar > 0 ? Math.round(totalStar / listRating.length) : 0;

    return average;
  };

  return (
    <>
      <div className="w-full min-h-svh relative">
        <div className="py-20">
          <p className="mt-10 text-main  font-bold text-center text-3xl md:text-left md:text-xl">
            Healthyfood
          </p>
          <h1 className="text-5xl font-semibold mt-4 text-center md:text-left">
            Chúng tôi phục vụ
          </h1>
          <h1 className="text-5xl font-semibold mt-4 text-center md:text-left">
            cho bạn <span className="text-main ">Healthyfood</span>
          </h1>
          <p className=" mt-8 text-[#757575] text-center md:text-left md:w-[40%]">
            Với Mê Linh HealthyFood, bạn sẽ luôn có những sản phẩm vừa healthy,
            đảm bảo sức khỏe, an toàn tuyệt đối. Việc eat_clean hay giảm cân,
            tâng cân hãy để Mê Linh lo. Hãy sẵn sàng tận hưởng các món ăn của Mê
            Linh HealthyFood
          </p>
          <div className="w-full flex justify-center md:block">
            <Link href={"/sanpham"}>
              <ButtonCpn type="default" title="Bắt đầu" className="my-4" />
            </Link>
          </div>
        </div>
        <div className="py-20 md:flex">
          <div className="w-full md:w-1/2 relative">
            <img
              src="./disk-about1.svg"
              className="w-[54%] h-full absolute right-[40%] z-10"
            />
            <img
              src="./disk-about2.svg"
              className="w-[60%] h-full absolute right-[2%] z-0"
            />
          </div>
          <div className="w-full md:w-1/2 ">
            <p className="mt-10 text-main font-bold text-center text-3xl md:text-left md:text-xl ">
              Healthyfood
            </p>
            <h1 className="text-5xl font-semibold mt-4  text-center md:text-left">
              Chúng tôi phục vụ
            </h1>
            <h1 className="text-5xl font-semibold mt-4  text-center md:text-left ">
              cho bạn <span className="  text-main   z-10">Healthyfood</span>
            </h1>
            <p className="mt-8 text-[#757575]  text-center md:text-left md:w-[90%] ">
              Với Mê Linh HealthyFood, bạn sẽ luôn có những sản phẩm vừa
              healthy, đảm bảo sức khỏe, an toàn tuyệt đối. Việc eat_clean hay
              giảm cân, tâng cân hãy để Mê Linh lo. Hãy sẵn sàng tận hưởng các
              món ăn của Mê Linh HealthyFood
            </p>
            <div className="w-full flex justify-center md:block">
              <Link href={"/sanpham"}>
                <ButtonCpn type="outline" title="Bắt đầu" className="my-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full text-center text-4xl  font-bold">
          <span className="text-main">Món ăn</span> phổ biến
        </div>
        <div className={`relative max-w-screen overflow-auto`}>
          <div className="my-4 flex h-[28rem] overflow-auto justify-between">
            {products &&
              products.length > 0 &&
              products.map((product: any, index: number) => (
                <CardBanner
                  key={index}
                  title={product?.name}
                  id={product?.id}
                  calories={product?.calories}
                  star={product?.rating ? handleStar(product?.rating) : 1}
                  price={product.price}
                  img={product?.images ? JSON.parse(product?.images)[0].url : ''}
                  discount={product?.discount ? product.discount : null}
                  className="min-h-[25rem] md:h-[24rem] md:w-[14rem] pb-4"
                />
              ))}
          </div>
        </div>
        {/* <div className="w-full text-center text-4xl  font-bold mt-10">
          <span className="text-main">Bài viết</span> Nỗi bật
        </div> */}
        {/* <div className={`relative max-w-screen overflow-auto`}>
          <div className="my-4 flex h-[28rem] overflow-auto justify-between">
            {products &&
              products.length > 0 &&
              products.map((product: any, index: number) => (
                <CardBanner
                  key={index}
                  title={product?.name}
                  calories={product.calories}
                  star={product?.rating ? handleStar(product?.rating) : 1}
                  price={product.price}
                  img={product?.images[0]?.url}
                  discount={product?.discount ? product.discount : null}
                  className="min-h-[25rem] md:h-[24rem] md:w-[14rem] pb-4"
                />
              ))}
          </div>
        </div> */}
      </div>
    </>
  );
}
