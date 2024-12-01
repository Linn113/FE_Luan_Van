"use client";
import axiosClient from "@/lib/axios-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ButtonCpn from "@/components/ButtonCpn";

const page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [news, setNews] = useState<any>([]);
  const [totalPage, setTotalPage] = useState<any>();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 6;
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
        newSearchParams.set("limit", "6");
      }

      if (!newSearchParams.has("sortOrder")) {
        newSearchParams.set("sortOrder", "ASC");
      }

      router.replace(`?${newSearchParams.toString()}`);
    }

    axiosClient
      .get(`http://localhost:3000/new`, {
        params: {
          page,
          limit,
          search,
          sortOrder,
          sortOrderBy,
          category,
        },
      })
      .then((data: any) => {
        if (data) {
          setNews(data?.data || []);
          setTotalPage(data?.totalCount);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [searchParams, router, page, limit, search, sortOrder, sortOrderBy]);

  return (
    <>
      <div className="w-full text-center my-4 text-4xl font-bold">
        Tin tức & Kiến tức
      </div>
      <div className="py-[4%] md:flex md:ml-[8%] flex-wrap gap-8">
        {news &&
          news.length > 0 &&
          news.map((new12: any) => (
            <Link className="group" href={`/tintuc/${new12?.id}`}>
              <Card className=" min-h-[12rem] md:h-[12rem] md:w-[24rem] my-4 md:my-0s shadow-lg pb-4 relative">
                <CardHeader>
                  <CardTitle className="w-full truncate">
                    {new12?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="w-full h-[4.1rem] text-slate-400">
                  <p className="max-w-[24rem] text-sm break-words line-clamp-3">
                    {new12?.description}
                  </p>
                </CardContent>
                <CardFooter className="relate mt-4 w-full flex justify-between">
                  <div className="text-sm text-slate-400 ">
                    {new Date(new12.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-slate-400 group-hover:text-black transition-all duration-75">
                    xem thêm
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
      </div>
      {!news && (
        <>
          <div className="py-[10%] w-full text-center">Chưa có tin tức nào</div>
        </>
      )}
      <div className="w-full flex justify-center items-center">
        {news && news.length > 0 && (
          <Button
            onClick={() => {
              router.push(
                `?page=${page}&limit=${limit * (page + 1)}${
                  search ? `&search=${search}` : ""
                }${sortOrder ? `&sortOrder=${sortOrder}` : ""}${
                  sortOrderBy ? `&sortOrderBy=${sortOrderBy}` : ""
                }&category=${category}`
              );
            }}
          >
            Xem Thêm
          </Button>
        )}
      </div>
    </>
  );
};

export default page;
