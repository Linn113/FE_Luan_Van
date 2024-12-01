"use client";
import { getSanPham } from "@/app/sanpham/action";
import { formatVietnamCurrency } from "@/components/ProductCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useStore from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import axiosClient from "@/lib/axios-client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  sao: z
    .number({
      required_error: "Chưa nhập tên",
      invalid_type_error: "Tên phải là ký tự",
    })
    .min(1, {
      message: "sao thấp nhất là 1",
    })
    .max(5, { message: "sao Lớn nhất là 5" }),
  danhGia: z
    .string({
      required_error: "Chưa nhập Đánh giá",
      invalid_type_error: "Họ phải là ký tự",
    })
    .min(2, {
      message: "Họ lớn hơn 2 ký tự.",
    }),
});

const page = ({
  params,
}: {
  params: { sanphamId: string; nguoidungId: string };
}) => {
  const { user } = useStore();
  const { toast } = useToast();
  const route = useRouter();
  const { isPending, isError, data, error }: any = useQuery({
    queryKey: ["detailItem"],
    queryFn: () => {
      return getSanPham(params.sanphamId);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sao: 0,
      danhGia: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axiosClient.post(
        `product/${params.sanphamId}/rating/${params.nguoidungId}`,
        values
      );
      if (res) {
        toast({
          variant: "default",
          title: "Thành Công",
          description: `Đánh giá thành công`,
        });
      }
      window.location.href = `/sanpham/${params.sanphamId}`;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ôi không! có lỗi đã xảy ra.",
        description: `${error?.message}`,
      });
    }
  }

  if (isPending) {
    return (
      <div className="w-full text-center my-[10%] text-3xl">Loading...</div>
    );
  }

  if (isError) {
    return <>Error</>;
  }

  return (
    <Card className="w-2/3 mx-auto my-[4%]">
      <CardHeader>
        <CardTitle>Đánh giá sản phẩm</CardTitle>
        <CardDescription>Vung lòng đánh giá sản phẩm</CardDescription>
      </CardHeader>
      <CardContent>
        <img
          className="shadow-2xl rounded-md max-h-[14rem] mx-auto "
          src={data?.images ? JSON.parse(data?.images)[0]?.url : ""}
          alt="Product Image"
        />
        <div className="text-xl font-bold mt-10">
          Sản phẩm: <span className="font-normal"> {data?.name}</span>
        </div>
        <div className="text-xl font-bold mt-4">
          Giá:{" "}
          <span className="font-normal">
            {formatVietnamCurrency(data?.price)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex-col fle">
        <div className="text-xl font-bold text-start">Đánh giá của bạn</div>
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="sao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sao</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Số sao"
                          {...field}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            console.log(value);
                            if (value <= 1) {
                              field.onChange(1);
                            } else if (value >= 5) {
                              field.onChange(5);
                            }
                            field.onChange(Number(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="danhGia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase">Đánh giá</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Nhập Ghi Chú" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Đánh giá</Button>
            </form>
          </Form>
        </div>
      </CardFooter>
    </Card>
  );
};

export default page;
