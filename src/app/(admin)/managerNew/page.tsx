"use client";

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { New } from "./new";
import { SearchInput } from "@/components/search";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import axiosClient from "@/lib/axios-client";

export default function UsersPage() {
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

  function prevPage() {
    if (Number(page) > 1) {
      const newPage = Number(page) - 1;
      router.push(
        `?page=${newPage}&limit=${limit}${search ? `&search=${search}` : ""}${
          sortOrder ? `&sortOrder=${sortOrder}` : ""
        }${sortOrderBy ? `&sortOrderBy=${sortOrderBy}` : ""}`,
        { scroll: false }
      );
    }
  }

  function nextPage() {
    const totalPages = Math.ceil(20 / Number(limit));
    if (Number(page) < totalPages) {
      const newPage = Number(page) + 1;
      router.push(
        `?page=${newPage}&limit=${limit}${search ? `&search=${search}` : ""}${
          sortOrder ? `&sortOrder=${sortOrder}` : ""
        }${sortOrderBy ? `&sortOrderBy=${sortOrderBy}` : ""}`,
        { scroll: false }
      );
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý sản phẩm</CardTitle>
        <CardDescription>Quản lý sản phẩm của bạn.</CardDescription>
      </CardHeader>
      <div className="px-[4%] my-4 flex justify-between">
        <div>
          <Link href={"/managerNew/create"}>
            <Button>Tạo Tin tức</Button>
          </Link>
        </div>
        <SearchInput
          limit={limit}
          page={page}
          search={search}
          sortOrder={sortOrder}
          sortOrderBy={sortOrderBy}
        />
      </div>
      <CardContent className="max-h-[24rem] overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tin tức</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="hidden md:table-cell">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news && news.length > 0 ? (
              news.map((new2: any) => <New key={new2.id} new2={new2} />)
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="w-full text-center py-[10%] font-se text-xl"
                >
                  Không tồn tại sản phẩm nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Page <strong>{page}</strong> of{" "}
            <strong>{Math.ceil(Number(totalPage) / Number(limit))}</strong>
          </div>
          <div className="flex">
            <Button
              onClick={prevPage}
              variant="ghost"
              size="sm"
              disabled={page === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              onClick={nextPage}
              variant="ghost"
              size="sm"
              disabled={page * limit >= totalPage}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
