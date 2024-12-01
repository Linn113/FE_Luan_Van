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
export function Product({ product }: { product: any }) {
  const { toast } = useToast();
  const router = useRouter();
  const [editProduct, setEditProduct] = useState({
    name: "",
    price: 1,
    status: "",
    calories: 1,
    description: "",
    category: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const { isLoading, isError, data, error }: any = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosClient.get("/category/all");
      return res;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      price: product?.price || 1,
      calories: product?.calories || 1,
      status: product?.status || "",
      description: product?.description || "",
      category: product?.category?.name || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (value: any) => {
      return await axiosClient.put(`/product/${product?.id}`, value);
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
      return await axiosClient.delete(`/product/${product?.id}`);
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
      <TableCell className="font-medium capitalize">
        <img
          className="w-20 h-20 rounded-full"
          src={`${product?.images[0]?.url}`}
          alt=""
        />
      </TableCell>
      <TableCell className="font-medium capitalize">{product.name}</TableCell>
      <TableCell className="font-medium capitalize">
        {formatVietnamCurrency(product.price)}
      </TableCell>
      <TableCell>
        <Badge variant="outline">{product.status}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{product.category.name}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell font-medium capitalize">
        {product.calories}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(product.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </TableCell>
      <TableCell>
        <div className="flex h-full w-full justify-center item-center ">
          <Dialog
            open={dialogOpen}
            onOpenChange={() => {
              setDialogOpen((state) => !state);
              if (!dialogOpen) {
                setEditProduct({
                  name: product.name || "",
                  price: product.price || 1,
                  calories: product.calories || 1,
                  status: product.status || "",
                  description: product.description || "",
                  category: product.category?.name || "",
                });
              }
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
                    defaultValue={editProduct.name}
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
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập Giá sản phẩm"
                            {...field}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (value >= 1) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="calories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calories</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập số calories"
                            {...field}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              if (value >= 1) {
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng Thái</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            onValueChange={(e) => {
                              field.onChange(e);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Còn hàng">Còn hàng</SelectItem>
                              <SelectItem value="Hết hàng">Hết hàng</SelectItem>
                              <SelectItem value="Đang nhập">
                                Đang nhập
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            onValueChange={(e) => {
                              field.onChange(e);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              {data &&
                                data.length > 0 &&
                                data?.map((category: any) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.name}
                                  >
                                    {category.description}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
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
