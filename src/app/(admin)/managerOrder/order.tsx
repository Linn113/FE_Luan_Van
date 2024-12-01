"use client";
import { formatVietnamCurrency } from "@/components/ProductCard";
// component shadcn
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosClient from "@/lib/axios-client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useReactToPrint } from "react-to-print";
import ButtonCpn from "@/components/ButtonCpn";

// tankStack query
export function Order({
  order,
  isChange,
  setIsChange,
}: {
  order: any;
  isChange: any;
  setIsChange: any;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });

  const mutation = useMutation({
    mutationFn: async (status: any) => {
      return await axiosClient.put(`/order/${order?.id}/status`, {
        status: status.status,
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

  const handleStatusChange = (status: string) => {
    mutation.mutate({ status });
  };

  const renderSelect = (order: any) => {
    if (order.status.id === 4) {
      return (
        <Select
          onValueChange={(value) => {
            handleStatusChange(value);
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
            handleStatusChange(value);
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
            handleStatusChange(value);
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
            handleStatusChange(value);
          }}
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
              <SelectItem value="4">Đang Giao</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }
  };

  console.log(order);

  return (
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
        <Badge variant="outline">{order?.payment?.description}</Badge>
      </TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Badge variant="outline" className="mx-1 cursor-pointer">
              Xem Thêm
            </Badge>
          </DialogTrigger>
          <DialogContent className="sm:min-w-[40rem] max-h-[40rem] overflow-y-scroll">
            <DialogHeader className="">
              <DialogTitle>Chi tiết đơn hàng</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 px-10" ref={contentRef}>
              <div>
                <h1 className="text-2xl font-bold">Thông tin khách hàng:</h1>
                <span className="font-normal text-xl my-1">
                  Tên: {order?.description?.nguoinhan}
                </span>
                <p className="font-normal text-xl my-1">
                  Số điện thoại: {order?.description?.sdt}
                </p>
              </div>

              <div>
                <h1 className="text-2xl font-bold">Địa chỉ Giao Hàngs: </h1>
                <span className="font-normal text-xl mt-2">
                  Xã:{order.address.xa},Huyện: {order.address.huyen}, TP:{" "}
                  {order.address.tp}
                </span>
                <p className="font-normal text-xl mt-2">
                  Thời gian giao hàng:{" "}
                  {new Date(order?.timeShipping).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <h1 className="text-2xl font-bold">Tổng đơn hàng & PTTT: </h1>
                <span className="font-normal text-xl mt-2">
                  PTTT: {order?.payment?.description}
                </span>
                <p className="font-normal text-xl mt-2">
                  {" "}
                  Tổng giá: {formatVietnamCurrency(order?.totalPrice)}
                </p>
              </div>

              <h1 className="text-2xl font-bold">Danh Sách Sản Phẩm:</h1>
              {order.orderDetailJson &&
                order.orderDetailJson.map((item: any) => {
                  return (
                    <>
                      <div className="w-full flex justify-between">
                        <div>
                          <div className="w-full text-xl font-semibold">
                            Sản phẩm:{" "}
                            <span className="font-normal">{item.name}</span>
                          </div>
                          <div className="w-full text-xl font-semibold">
                            Giá:{" "}
                            <span className="font-normal">
                              {formatVietnamCurrency(item.price)}
                            </span>
                          </div>
                          <div className="w-full text-xl font-semibold">
                            Số lượng:{" "}
                            <span className="font-normal">{item.quantity}</span>
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
            <DialogFooter>
              <Button className="w-full mt-10" onClick={handlePrint}>
                In đơn hàng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(order.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(order.timeShipping).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="hidden md:table-cell ">
        {renderSelect(order)}
      </TableCell>
    </TableRow>
  );
}
