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
import { Discount } from "./discount";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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

export default function UsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isChange, setIsChange] = useState(false);
  const { toast } = useToast();

  const [discounts, setDiscounts] = useState<any>([]);
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
      .get(`http://localhost:3000/discount`, {
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
          setDiscounts(data?.data);
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

  const mutation = useMutation({
    mutationFn: async (value: any) => {
      return await axiosClient.post(`/discount`, value);
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      percent: 0,
      dateStart: new Date(),
      dateEnd: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản Lý giảm giá</CardTitle>
        <CardDescription>Quản lý Giảm giá của bạn.</CardDescription>
      </CardHeader>
      <div className="px-[4%] my-4 flex justify-between">
        <div>
          <Dialog open={isChange} onOpenChange={setIsChange}>
            <DialogTrigger asChild>
              <Button>Tạo Giảm Giá</Button>
            </DialogTrigger>
            <DialogContent className="sm:min-w-[34rem]">
              <DialogHeader>
                <DialogTitle>Tạo giảm gía</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
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
                            <Input placeholder="Nhập tên giảm giá" {...field} />
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
                    <Button type="submit">Tạo</Button>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
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
              <TableHead>Tên giảm giá</TableHead>
              <TableHead className="hidden md:table-cell">Mô tả</TableHead>
              <TableHead className="hidden md:table-cell">Phần trăm</TableHead>
              <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
              <TableHead className="hidden md:table-cell">
                Ngày hết hạn
              </TableHead>
              <TableHead className="hidden md:table-cell">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.length > 0 ? (
              discounts.map((discount: any) => <Discount discount={discount} />)
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
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
}
