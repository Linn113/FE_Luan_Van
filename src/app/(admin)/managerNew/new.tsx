"use client";
// component shadcn
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Bolt, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";
import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatVietnamCurrency } from "@/components/ProductCard";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Chưa nhập tên",
      invalid_type_error: "Tên phải là ký tự",
    })
    .min(2, {
      message: "Tên phải lớn hơn 2 ký tự",
    }),
  price: z.number({
    required_error: "Chưa nhập Giấ",
    invalid_type_error: "Giá là số",
  }),
  calories: z.number({
    required_error: "Chưa nhập calories",
    invalid_type_error: "calories là số",
  }),
  status: z
    .string({
      required_error: "Chưa nhập trậng thái",
      invalid_type_error: "Tên nhập trạng thái",
    })
    .min(2, {
      message: "thạng thái lớn hơn 2 ký tự",
    }),
  description: z
    .string({
      required_error: "Chưa nhập mô tẩ",
      invalid_type_error: "nhập mô tả",
    })
    .min(10, {
      message: "mô tả lớn hơn 10 ký tự",
    }),
  category: z
    .string({
      required_error: "Chưa nhập danh mục",
      invalid_type_error: "Chưa nhập danh mục",
    })
    .min(2, {
      message: "danh mục lớn hơn 2 ký tự",
    }),
});

// tankStack query
export function New({ new2 }: { new2: any }) {
  const { toast } = useToast();
  const router = useRouter();

  const mutationDelete = useMutation({
    mutationFn: async (value: any) => {
      return await axiosClient.delete(`/new/${new2?.id}`);
    },
    onError(error: any, variables, context) {
      if (error) {
        toast({
          variant: "destructive",
          title: "Ôi không! có lỗi đã xảy ra.",
          description: error?.response
            ? error?.response?.message
            : "Có lỗi xảy ra khi cập nhật!",
        });
      }
    },
    onSuccess(data, variables, context) {
      if (data) {
        toast({
          variant: "default",
          title: "Thành công",
          description: "Xóa sản phẩm thành công!",
        });

        window.location.reload();
      }
    },
  });

  return (
    <TableRow className="">
      <TableCell className="font-medium capitalize">{new2.title}</TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(new2.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </TableCell>
      <TableCell>
        <div className="flex h-full w-full item-center ">
          <Badge
            variant="outline"
            className="mx-1 cursor-pointer hover:bg-slate-300"
            onClick={() => {
              mutationDelete.mutate({});
            }}
          >
            <Trash2 className="" />
          </Badge>
        </div>

        <>
        </>
      </TableCell>
    </TableRow>
  );
}
