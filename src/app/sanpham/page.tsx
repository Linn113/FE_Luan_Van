"use client";
import { useRouter, useSearchParams } from "next/navigation";
import FilterCpn from "./FilterCpn";
import ListProduct from "./ListProduct";
import PaginationCpn from "./PaginationCpn";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios-client";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<any>([]);
  const [totalPage, setTotalPage] = useState<any>();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 8;
  const search = searchParams.get("search") || "";
  const sortOrder = searchParams.get("sortOrder") || "ASC";
  const category = searchParams.get("category") || "";
  const sortOrderBy = searchParams.get("sortOrderBy") || "";

  useEffect(() => {
    if (!searchParams.has("page") || !searchParams.has("limit")) {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      if (!newSearchParams.has("page")) {
        newSearchParams.set("page", "1");
      }

      if (!newSearchParams.has("limit")) {
        newSearchParams.set("limit", "8");
      }

      if (!newSearchParams.has("sortOrder")) {
        newSearchParams.set("sortOrder", "ASC");
      }

      router.replace(`?${newSearchParams.toString()}`);
    }

    axiosClient
      .get(`http://localhost:3000/product`, {
        params: {
          page,
          limit,
          search,
          sortOrder,
          sortOrderBy,
          category,
        },
      })
      .then((data) => {
        if (data) {
          const handleData = data.data?.map((data: any) => {
            return {
              ...data,
              images: JSON.parse(data.images),
            };
          });
          setProducts(handleData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [searchParams, router, page, limit, search, sortOrder, sortOrderBy]);

  return (
    <div className="w-full relative md:flex my-10">
      <div className="md:w-[25%] max-h-[24rem] p-4 bg-white shadow-sms rounded-md md:mr-4">
        <FilterCpn
          page={page}
          limit={limit}
          category={category}
          search={search}
          sortOrder={sortOrder}
          sortOrderBy={sortOrderBy}
        />
      </div>
      <div className="md:w-[75%]  ml-4">
        <ListProduct
          searchParams={{
            page: page,
            limit: limit,
            category: category,
            search: search,
            sortOrder: sortOrder,
            sortOrderBy: sortOrderBy,
          }}
          products={products}
        />
        <PaginationCpn
          searchParams={{
            page: page,
            limit: limit,
            category: category,
            search: search,
            sortOrder: sortOrder,
            sortOrderBy: sortOrderBy,
          }}
          totalPage={totalPage}
          className="my-10"
        />
      </div>
    </div>
  );
}
