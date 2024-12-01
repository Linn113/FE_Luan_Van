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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosClient from "@/lib/axios-client";
import { formatVietnamCurrency } from "./ProductCard";
import { Badge } from "./ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

const OrderUser = ({ userId }: any) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isChange, setIsChange] = useState(false);
  const { toast } = useToast();

  const [orders, setOrders] = useState<any>([]);
  const [totalPage, setTotalPage] = useState<any>();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 6;
  const search = searchParams.get("search") || "";
  const sortOrder = searchParams.get("sortOrder") || "DESC";
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
        newSearchParams.set("sortOrder", "DESC");
      }

      router.replace(`?${newSearchParams.toString()}`);
    }
    axiosClient
      .get(`http://localhost:3000/order/user/${userId}`, {
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
          console.log(data);
          const handleData: any = data.data?.map((data: any) => {
            return {
              ...data,
              address: JSON.parse(data.address),
              description: JSON.parse(data.description),
              orderDetailJson: JSON.parse(data.orderDetailJson),
            };
          });
          setOrders(handleData);
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
    userId,
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

  const mutation = useMutation({
    mutationFn: async (value: any) => {
      console.log(value);
      return await axiosClient.put(`/order/${value?.id}/status`, {
        status: value.status,
      });
    },
    onError(error, variables, context) {
      if (error) {
        toast({
          variant: "destructive",
          title: "Ôi không! có lỗi đã xảy ra.",
          description: `Có lỗi xảy ra khi cập nhật sản phẩm!`,
        });
      }
    },
    onSuccess(data, variables, context) {
      if (data) {
        toast({
          variant: "default",
          title: "Thành công",
          description: "Cập nhật sản phẩm thành công!",
        });
        setIsChange(!isChange);
      }
    },
  });

  const handleStatusChange = (status: string, orderId: string) => {
    mutation.mutate({ status: status, id: orderId });
  };

  const renderSelect = (order: any) => {
    if (order.status.id === 4) {
      return (
        <Select
          onValueChange={(value) => {
            handleStatusChange(value, order.id);
          }}
          defaultValue={`${order.status.id}`}
        >
          <SelectTrigger className="w-[10rem]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Trạng thái</SelectLabel>
              <SelectItem value="2">Thành công</SelectItem>
              <SelectItem value="3">Hủy Đơn</SelectItem>
              <SelectItem value="4">Đang Giao</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }
    if (order.status.id === 2) {
      return (
        <Select
          onValueChange={(value) => {
            handleStatusChange(value, order.id);
          }}
          disabled={true}
          defaultValue={`${order.status.id}`}
        >
          <SelectTrigger className="w-[10rem]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Trạng thái</SelectLabel>
              <SelectItem value="2">Thành công</SelectItem>
              <SelectItem value="3">Hủy Đơn</SelectItem>
              <SelectItem value="4">Đang Giao</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }
    if (order.status.id === 3) {
      return (
        <Select
          onValueChange={(value) => {
            handleStatusChange(value, order.id);
          }}
          disabled={true}
          defaultValue={`${order.status.id}`}
        >
          <SelectTrigger className="w-[10rem]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Trạng thái</SelectLabel>
              <SelectItem value="2">Thành công</SelectItem>
              <SelectItem value="3">Hủy Đơn</SelectItem>
              <SelectItem value="4">Đang Giao</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }
    if (order.status.id === 1) {
      return (
        <Select
          onValueChange={(value) => {
            handleStatusChange(value, order.id);
          }}
          disabled={true}
          defaultValue={`${order.status.id}`}
        >
          <SelectTrigger className="w-[10rem]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Trạng thái</SelectLabel>
              <SelectItem value="1">Đang xử lý</SelectItem>
              <SelectItem value="2">Thành công</SelectItem>
              <SelectItem value="3">Hủy Đơn</SelectItem>
              {/* <SelectItem value="4">Đang Giao</SelectItem> */}
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng của bạn</CardTitle>
        <CardDescription>Quản lý đơn hàng của bạn.</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[24rem] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell">Người Đặt</TableHead>
              <TableHead>Tổng đơn hàng</TableHead>
              <TableHead className="hidden md:table-cell">Trạng thái</TableHead>
              <TableHead className="hidden md:table-cell">PTTT</TableHead>
              <TableHead className="hidden md:table-cell">Chi tiết</TableHead>
              <TableHead className="hidden md:table-cell">Ngày giao</TableHead>
              <TableHead className="hidden md:table-cell">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order: any) => (
                <>
                  <TableRow className="">
                    <TableCell className="font-medium capitalize">
                      {order?.description?.nguoinhan}
                    </TableCell>
                    <TableCell className="font-medium capitalize">
                      {formatVietnamCurrency(order.totalPrice)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order?.status?.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {order?.payment?.description}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Badge
                            variant="outline"
                            className="mx-1 cursor-pointer"
                          >
                            Xem Thêm
                          </Badge>
                        </DialogTrigger>
                        <DialogContent className="sm:min-w-[34rem]">
                          <DialogHeader>
                            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <h1 className="text-2xl font-bold">
                              Địa chỉ:{" "}
                              <span className="font-normal text-xl">
                                Xã:{order.address.xa},Huyện:{" "}
                                {order.address.huyen}, TP: {order.address.tp}
                              </span>
                            </h1>

                            <h1 className="text-2xl font-bold">
                              Danh Sách Sản Phẩm:
                            </h1>
                            {order.orderDetailJson &&
                              order.orderDetailJson.map((item: any) => {
                                return (
                                  <>
                                    <div className="w-full flex justify-between">
                                      <div>
                                        <div className="w-full text-xl font-semibold">
                                          Đánh giá:
                                          {order.status.id === 2 && (
                                            <Badge
                                              variant="destructive"
                                              className="cursor-pointer ml-4 "
                                              onClick={() => {
                                                router.replace(
                                                  `/sanpham/${item.id}/danhgia/${userId}`
                                                );
                                              }}
                                            >
                                              Đánh giá
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="w-full text-xl font-semibold">
                                          Sản phẩm:{" "}
                                          <span className="font-normal">
                                            {item.name}
                                          </span>
                                        </div>
                                        <div className="w-full text-xl font-semibold">
                                          Giá:{" "}
                                          <span className="font-normal">
                                            {formatVietnamCurrency(item.price)}
                                          </span>
                                        </div>
                                        <div className="w-full text-xl font-semibold">
                                          Số lượng:{" "}
                                          <span className="font-normal">
                                            {item.quantity}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="w-1/2 flex justify-end pr-[4%]">
                                        <img
                                          className="w-24 h-24 shadow-xl rounded-md"
                                          src={JSON.parse(item.images)[0].url}
                                          alt="Product Image"
                                        />
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(order.timeShipping).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell>{renderSelect(order)}</TableCell>
                  </TableRow>
                </>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="w-full text-center py-[10%] font-se text-xl"
                >
                  Không tồn tại đơn hàng nào
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
};

export default OrderUser;
