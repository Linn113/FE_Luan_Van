"use client";
import BreadcrumbCpn from "@/components/BreadcrumbCpn";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button, Empty, Typography } from "antd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ProductCard from "@/components/ProductCard";
import icons from "@/common/icons";
import { NavigationMenu } from "@/components/ui/navigation-menu";

import Link from "next/link";
import { FilterProps } from "./FilterCpn";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/components/search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RefreshCcw } from "lucide-react";

export type ListProductType = {
  products: any;
  searchParams: FilterProps;
};

const ListProduct: React.FC<ListProductType> = ({ products, searchParams }) => {
  const router = useRouter();

  const handleChangeSortOrder = (sortOrder: string) => {
    router.push(
      `?page=${searchParams.page}&limit=${searchParams.limit}${
        searchParams.search ? `&search=${searchParams.search}` : ""
      }${searchParams.sortOrder ? `&sortOrder=${sortOrder}` : ""}${
        searchParams.sortOrderBy
          ? `&sortOrderBy=${searchParams.sortOrderBy}`
          : ""
      }${searchParams.category ? `&category=${searchParams.category}` : ""}`
    );
  };

  const handleChangeSortOrderBy = (sortOrderBy: string) => {
    router.push(
      `?page=${searchParams.page}&limit=${searchParams.limit}${
        searchParams.search ? `&search=${searchParams.search}` : ""
      }${
        searchParams.sortOrder ? `&sortOrder=${searchParams.sortOrder}` : ""
      }&sortOrderBy=${sortOrderBy}${
        searchParams.category ? `&category=${searchParams.category}` : ""
      }`
    );
  };

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
      <BreadcrumbCpn className="pt-10 md:p-0" />
      <div className="w-full min-h-[4rem] p-4 bg-slate-100 rounded-md shadow-md my-4 md:flex">
        <h3 className="text-sm text-slate-600 min-w-[2rem] block text-center mb-4 md:text-start md:mb-0">
          Sắp xếp theo:
        </h3>
        <div className="flex w-full justify-center md:justify-start">
          <div className="w-[86%] flex">
            <Select
              onValueChange={(value: any) => handleChangeSortOrderBy(value)}
            >
              <SelectTrigger className="ml-2 w-[10rem]">
                <SelectValue placeholder="Lọc theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Giá</SelectItem>
                <SelectItem value="calories">Calories</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value: any) => handleChangeSortOrder(value)}
            >
              <SelectTrigger className="ml-2 w-[10rem]">
                <SelectValue placeholder="Sắp Xếp Theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">Tăng dần</SelectItem>
                <SelectItem value="DESC">Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <NavigationMenu className="p-2 text-3xl hover:text-blue-500 cursor-pointer">
                  <icons.CiSearch />
                </NavigationMenu>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-100 p-4 shadow-2xl rounded-md ">
                <SearchInput
                  limit={searchParams.limit}
                  page={searchParams.page}
                  search={searchParams.search}
                  sortOrder={searchParams.sortOrder}
                  sortOrderBy={searchParams.sortOrderBy}
                />
              </DropdownMenuContent>
            </DropdownMenu>
            <RefreshCcw
              className="ml-4"
              onClick={() => {
                window.location.href = "/sanpham";
              }}
            />
          </div>
        </div>
      </div>
      <div className="md:flex md:ml-[8%] flex-wrap gap-4 ">
        {products.length <= 0 && (
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 200, width: 300, margin: "auto" }}
            className="w-full"
            description={
              <Typography.Text>Chưa có sản phẩm !!!</Typography.Text>
            }
          ></Empty>
        )}
        {products.length > 0 &&
          products.map((product: any) => (
            <Link
              key={product.id}
              className="mx-4 my-4 "
              href={`/sanpham/${product?.id}`}
            >
              <ProductCard
                key={product.id}
                title={product.name}
                calories={product.calories}
                star={product?.rating ? handleStar(product?.rating) : 1}
                price={product.price}
                img={product?.images[0]?.url}
                discount={product?.discount ? product.discount : null}
                className="min-h-[25rem] md:h-[24rem] md:w-[14rem] pb-4"
              />
            </Link>
          ))}
      </div>
    </>
  );
};

export default ListProduct;
