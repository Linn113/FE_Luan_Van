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
  description: z
    .string({
      required_error: "Chưa nhập mô tẩ",
      invalid_type_error: "nhập mô tả",
    })
    .min(10, {
      message: "mô tả lớn hơn 10 ký tự",
    }),
});

// tankStack query
export function Category({ category }: { category: any }) {
  const { toast } = useToast();
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (value: any) => {
      return await axiosClient.put(`/category/${category?.id}`, value);
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
          description: "Cập nhật thông tin thành công!",
        });
        setDialogOpen(false);
        window.location.reload();
      }
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async (value: any) => {
      return await axiosClient.delete(`/category/${category?.id}`);
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <TableRow className="">
      <TableCell className="font-medium capitalize">{category.name}</TableCell>
      <TableCell className="font-medium capitalize">
        {category.description}
      </TableCell>

      <TableCell>
        <div className="flex h-full w-full justify-center item-center ">
          <Dialog
            open={dialogOpen}
            onOpenChange={() => {
              setDialogOpen((state) => !state);
            }}
          >
            <DialogTrigger asChild>
              <Badge
                variant="outline"
                className="mx-1 cursor-pointer hover:bg-slate-300"
              >
                <Bolt className="cursor-pointer " />
              </Badge>
            </DialogTrigger>
            <DialogContent className="sm:min-w-[34rem]">
              <DialogHeader>
                <DialogTitle>Chỉnh sửa thông tin Sản phẩm</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên sản phẩm</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Nhập Tên Sản phẩm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập mô tả sản phẩm"
                            {...field}
                            onChange={(e: any) =>
                              field.onChange(e.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full flex justify-end">
                    <Button type="submit">Chỉnh sửa</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
      </TableCell>
    </TableRow>
  );
}
