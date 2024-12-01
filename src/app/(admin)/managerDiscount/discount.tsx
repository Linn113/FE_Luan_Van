"use client";
import { formatVietnamCurrency } from "@/components/ProductCard";
// component shadcn
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";

import axiosClient from "@/lib/axios-client";
import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "antd";
import { Select, Space } from "antd";
import type { SelectProps } from "antd";
import {
  Dialog,
  DialogContent,
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
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Bolt, PackagePlus, Trash2 } from "lucide-react";

let options: SelectProps["options"] = [];

const formSchema = z
  .object({
    title: z
      .string()
      .min(2, "Tiêu đề phải có ít nhất 2 ký tự")
      .max(50, "Tiêu đề không được vượt quá 50 ký tự"),
    description: z
      .string()
      .min(2, "Mô tả phải có ít nhất 2 ký tự")
      .max(50, "Mô tả không được vượt quá 50 ký tự"),
    percent: z
      .number()
      .min(1, "Phần trăm phải lớn hơn hoặc bằng 1")
      .max(100, "Phần trăm không được vượt quá 100"),
    dateStart: z
      .date()
      .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Ngày bắt đầu không được là ngày trong quá khứ",
      }),
    dateEnd: z.date(),
  })
  .refine((data) => data.dateEnd >= data.dateStart, {
    message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
    path: ["dateEnd"],
  });

export function Discount({ discount }: { discount: any }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [discountId, setDiscountId] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [products, setProducts] = useState<any>([]);
  const [modalText, setModalText] = useState("Content of the modal");

  const { isLoading, isError, data, error }: any = useQuery({
    queryKey: ["products12"],
    queryFn: async () => {
      const res = await axiosClient.get("/product/withoutPaginate");
      return res;
    },
  });

  const mutation = useMutation({
    mutationFn: async (value: any) => {
      return await axiosClient.patch(`/discount/${discountId}`, value);
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
          description: "Cập tạo thành công!",
        });
        setIsChange(false);
        window.location.reload();
      }
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async (value: any) => {
      return await axiosClient.delete(`/discount/${value.id}`);
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

  console.log(discount);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: discount.title || "",
      description: discount.description || "",
      percent:  discount.percent ||0,
      dateStart: new Date(discount.dateStart),
      dateEnd: new Date(discount.dateEnd),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  if (data) {
    const seenValues = new Set();
    options = data.reduce((acc: any[], product: any) => {
      const value = product?.id;
      if (value && !seenValues.has(value)) {
        seenValues.add(value);
        acc.push({
          label: product?.name,
          value: value,
        });
      }
      return acc;
    }, []);
  }

  const handleChange = (value: string[]) => {
    setProducts(value);
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async (id: string) => {
    setConfirmLoading(true);
    try {
      const data = await axiosClient.put(`discount/${id}`, {
        products: products,
      });

      if (data) {
        console.log(data);
        setConfirmLoading(false);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <TableRow className="">
      <TableCell className="font-medium capitalize">
        {discount?.title}
      </TableCell>
      <TableCell className="font-medium capitalize truncate max-w-xs">
        {discount?.description}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-red-500 text-white">
          {discount?.percent}%
        </Badge>
      </TableCell>
      <TableCell>
        {discount?.dateStart
          ? new Date(discount.dateStart).toLocaleDateString("en-GB")
          : "N/A"}
      </TableCell>
      <TableCell>
        {discount?.dateEnd
          ? new Date(discount.dateEnd).toLocaleDateString("en-GB")
          : "N/A"}
      </TableCell>
      <TableCell>
        <>
          <>
            <Badge
              onClick={showModal}
              variant="outline"
              className="mx-1 cursor-pointer hover:bg-slate-300"
            >
              <PackagePlus className="cursor-pointer " />
            </Badge>
            <Modal
              title="Chọn sản phẩm thêm vào giảm giá"
              open={open}
              onOk={() => {
                handleOk(discount?.id);
              }}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <Space style={{ width: "100%" }} direction="vertical">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Chọn Danh sách sản phẩm"
                  defaultValue={[]}
                  onChange={handleChange}
                  options={options}
                />
              </Space>
            </Modal>
          </>
          <>
            <Dialog
              open={isChange}
              onOpenChange={() => {
                setIsChange(!isChange);
                setDiscountId(discount?.id);
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
                  <DialogTitle>Chỉnh sửa thông tin giảm giá</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit, discount.id)}
                      className="space-y-8"
                    >
                      {/* Title Field */}
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tên giảm giá"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Description Field */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập mô tả giảm giá"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Percent Field */}
                      <FormField
                        control={form.control}
                        name="percent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phần trăm (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Nhập phần trăm giảm giá"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Start Date Field */}
                      <FormField
                        control={form.control}
                        name="dateStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày bắt đầu</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                value={
                                  field.value
                                    ? new Date(field.value)
                                        .toISOString()
                                        .split("T")[0]
                                    : ""
                                }
                                onChange={(e) =>
                                  field.onChange(new Date(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* End Date Field */}
                      <FormField
                        control={form.control}
                        name="dateEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày kết thúc</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                value={
                                  field.value
                                    ? new Date(field.value)
                                        .toISOString()
                                        .split("T")[0]
                                    : ""
                                }
                                onChange={(e) =>
                                  field.onChange(new Date(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Chỉnh sửa</Button>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </>
          <Badge
            variant="outline"
            className="mx-1 cursor-pointer hover:bg-slate-300"
            onClick={() => {
              mutationDelete.mutate({ id: discount?.id });
            }}
          >
            <Trash2 className="" />
          </Badge>
        </>
      </TableCell>
    </TableRow>
  );
}
