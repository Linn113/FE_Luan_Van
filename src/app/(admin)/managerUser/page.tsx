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
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SearchInput } from "@/components/search";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosClient from "@/lib/axios-client";
import { User } from "./user";

export default function UsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isChange, setIsChange] = useState(false);

  const [users, setUsers] = useState<any>([]);
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
      .get(`http://localhost:3000/user/admin`, {
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
        console.log(data);
        if (data) {
          setUsers(data.data);
          setTotalPage(data?.totalCount);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [
    searchParams,
    router,
    page,
    limit,
    search,
    sortOrder,
    sortOrderBy,
    isChange,
  ]);

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
        <CardTitle>Quản lý người dùng</CardTitle>
        <CardDescription>Quản lý người dùng của cửa hàng.</CardDescription>
      </CardHeader>
      <div className="px-[4%] my-4 flex justify-between">
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
              <TableHead>Họ Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Điện Thoại</TableHead>
              <TableHead className="hidden md:table-cell">Vai trò</TableHead>
              <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
              <TableHead className="hidden md:table-cell">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user: any) => (
                <User
                  key={user.id}
                  user={user}
                  isChange={isChange}
                  setIsChange={setIsChange}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="w-full text-center py-[10%] font-se text-xl"
                >
                  Không tồn tại người dùng nào
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
