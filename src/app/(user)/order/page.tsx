"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { ToastAction } from "@/components/ui/toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";

import axiosClient from "@/lib/axios-client";
import { useToast } from "@/hooks/use-toast";
import { formatVietnamCurrency } from "@/components/ProductCard";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStore from "@/store/store";
import { getCart } from "@/app/sanpham/action";
import { loadStripe } from "@stripe/stripe-js";
import { CanThoData } from "./CanTho";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY undefined");
}

const formSchema = z.object({
  nguoiNhan: z.string().min(2, {
    message: "Người nhận phải hơn 2 ký tự",
  }),
  sdt: z
    .string()
    .refine((value) => /^\+?(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(value), {
      message: "SĐT không đúng định hạng",
    }),
  tp: z.string().min(2, {
    message: "Thành phố phải hơn 2 ký tự",
  }),
  huyen: z.string().nonempty({ message: "Vui lòng chọn Quận/Huyện" }),
  xa: z.string().nonempty({ message: "Vui lòng chọn Phường/Xã" }),
  ghiChu: z.string(),
  thanhToan: z.string({
    required_error: "Vui Lòng chọn hình thức thanh toán",
  }),
  giao: z.coerce.date().refine((date) => date >= new Date(), {
    message: "Ngày giao không thể ở quá khứ",
  }),
});

const page = () => {
  const { toast } = useToast();
  const { user, isChange, setIsChange } = useStore();
  const router = useRouter();
  const [districts, setDistricts] = useState<any>([]);
  const [wards, setWards] = useState<any>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isPayment, setIsPayment] = useState<any>(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedValue, setSelectedValue] = useState<any>("0");

  const loadOrderItemsFromStorage = () => {
    const storedOrder = localStorage.getItem("products");
    if (storedOrder) {
      setOrderItems(JSON.parse(storedOrder));
    }
  };

  useEffect(() => {
    if (!user.isLogin) {
      loadOrderItemsFromStorage();
    } else {
      try {
        (async () => {
          const res: any = await getCart(user.id);
          if (res && res?.detailCard) {
            setOrderItems(JSON.parse(res?.detailCard));
          } else {
            setOrderItems([]);
          }
        })();
      } catch (error) {
        console.log(error);
      }
    }
    if (window.localStorage.getItem("product-payment")) {
      window.localStorage.removeItem("product-payment");
    }
  }, [user]);

  useEffect(() => {
    const calculateTotalPrice = () => {
      return orderItems.reduce((total, item) => {
        let itemPrice = item.price * item.quantity;

        if (
          item.discount &&
          user.isLogin &&
          isDiscountValid(
            new Date(item.discount.dateStart),
            new Date(item.discount.dateEnd)
          )
        ) {
          itemPrice =
            calculateDiscountedPrice(item.price, item.discount.percent) *
            item.quantity;
        }

        return total + itemPrice;
      }, 0);
    };

    const total = calculateTotalPrice() + 30000;
    setTotalPrice(total);
  }, [orderItems]);

  useEffect(() => {
    // Initialize districts based on city selection
    setDistricts(CanThoData.districts);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nguoiNhan: "",
      sdt: "",
      tp: "Cần Thơ",
      huyen: "",
      xa: "",
      ghiChu: "",
      thanhToan: "",
      giao: new Date(),
    },
  });

  useEffect(() => {
    if (selectedAddress) {
      // If an address is selected, update the form values with the corresponding address
      form.setValue("tp", selectedAddress?.nameAddress.tp);
      form.setValue("huyen", selectedAddress?.nameAddress.huyen);
      form.setValue("xa", selectedAddress?.nameAddress.xa);
    }
  }, [selectedAddress, form]);

  const mutation = useMutation({
    mutationFn: async (formData: any): Promise<any> => {
      if (orderItems?.length > 0) {
        try {

          for (const orderItem of orderItems) {
            const detail = orderItem?.description
              ? JSON.parse(orderItem.description)
              : null;

            if (detail?.isMenu && orderItems.length !== 1) {
              console.log("going here 3");
              toast({
                variant: "destructive",
                title: "Bạn chỉ có thể chọn nhiều sản phẩm hoặc một menu",
                description: "Vui lòng chỉnh sửa lại sản phẩm trong giỏ hàng",
              });
              return;
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      console.log("go here 2");

      const data = {
        totalPrice: totalPrice,
        timeShipping: new Date(formData.giao),
        isClient: user.isLogin,
        userId: user?.id ? user.id : "",
        description: JSON.stringify({
          nguoinhan: formData.nguoiNhan,
          sdt: formData.sdt,
        }),
        address: JSON.stringify({
          tp: formData.tp ? formData.tp : "Tp.Cần Thơ",
          xa: formData.xa,
          huyen: formData.huyen,
        }),
        payment: formData.thanhToan,
        orderDetailJson: JSON.stringify(orderItems),
      };

      if (!formData.thanhToan) {
        toast({
          variant: "destructive",
          title: "Ôi không! có lỗi đã xảy ra.",
          description: `Vui lòng chọn hình thức thanh toán`,
        });
        return Promise.resolve({}).then(() => {});
      }

      if (formData.thanhToan === "TT") {
        window.localStorage.setItem("product-payment", JSON.stringify(data));

        const dataVnp = {
          amount: Number(totalPrice),
          language: "vn",
          bankCode: "",
        };

        const response: any = await axiosClient.post("/order/VnPay", {
          ...dataVnp,
        });

        if (response) {
          window.location.href = response?.directURL;
        }

        return Promise.resolve({}).then(() => {});
      }
      return axiosClient.post("/order", data);
    },
    onError: (error: any, variables, context: any) => {
      if (error.statusCode && error.message) {
        toast({
          variant: "destructive",
          title: "Ôi không! có lỗi đã xảy ra.",
          description: `${error?.message}`,
          action: (
            <ToastAction altText="Try again">Vui lòng thử lại</ToastAction>
          ),
        });
      }
    },
    onSuccess: (data: any, variables, context) => {
      if (data?.directURL) {
        return;
      }
      if (data) {
        toast({
          variant: "default",
          title: "Thành công",
          description:
            "Đặt hàng thành công, Cửa hàng sẽ điện bạn vào thời gian sớm nhất",
        });
        if (user.isLogin) {
          router.push("/user");
        }
      }
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  const isDiscountValid = (dateStart: Date, dateEnd: Date): boolean => {
    const currentDate = new Date();
    return currentDate >= dateStart && currentDate <= dateEnd;
  };

  const calculateDiscountedPrice = (
    price: number,
    discountPercentage: number
  ) => {
    const discountAmount = (price * discountPercentage) / 100;
    return price - discountAmount;
  };

  const handleDistrictChange = (districtName: string) => {
    const district = CanThoData.districts.find((d) => d.name === districtName);
    if (district) {
      setWards(district.wards || district.communes);
    }
    form.setValue("huyen", districtName);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="my-[5%] px-10 py-14 ">
            <h1 className="text-4xl flex items-center">Sản Phẩm</h1>
            <Table className="mt-10 rounded-2xl border-2  border-slate-200  ">
              <TableBody className=" rounded-2xl border-2 border-slate-200">
                {orderItems.length > 0 ? (
                  orderItems.map((item) => (
                    <TableRow key={item.name} className="py-10 bg-white border-2 border-slate-200" >
                      <TableCell className="font-medium">
                        <img
                          src={`${JSON.parse(item.images)[0].url}`}
                          className="w-28 h-28 rounded-full"
                          alt=""
                        />
                      </TableCell>
                      <TableCell className="font-medium text-xl">
                        {item.name}
                      </TableCell>
                      <TableCell className="font-medium text-xl ">
                        <div className="flex items-center">
                          <h2 className="mx-4">{item.quantity}</h2>
                        </div>
                      </TableCell>
                      {user.isLogin ? (
                        <>
                          {item.discount &&
                          isDiscountValid(
                            new Date(item.discount.dateStart),
                            new Date(item.discount.dateEnd)
                          ) ? (
                            <TableCell className="font-medium text-xl text-right">
                              <p className="line-through">
                                {formatVietnamCurrency(item.price)}
                              </p>
                              <p className="text-red-500">
                                {formatVietnamCurrency(
                                  calculateDiscountedPrice(
                                    item.price,
                                    item.discount.percent
                                  )
                                )}
                              </p>
                            </TableCell>
                          ) : (
                            <TableCell className="font-medium text-xl text-right">
                              {formatVietnamCurrency(item.price)}
                            </TableCell>
                          )}
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium text-xl text-right ">
                            {formatVietnamCurrency(item.price)}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow >
                    <TableCell
                      colSpan={4}
                      className="text-center font-medium text-xl bg-white border-2"
                    >
                      Không có sản phẩm nào trong đơn hàng.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="md:flex justify-between mt-10 bg-white border-2 px-6 py-10">
              <div className="w-full mt-4 md:mt-0 md:w-1/2 mr-4 ">
                <h1 className="w-full capitalize text-3xl font-semibold text-center">
                  Địa chỉ nhận hàng
                </h1>
                <FormField
                  control={form.control}
                  name="nguoiNhan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase">Người nhận</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nhập tên người nhận"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sdt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase">SĐT</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nhập số điện thoại"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {user.isLogin && (
                  <>
                    <div className="mt-2">Địa chỉ đã lưu</div>
                    <Select
                      value={selectedValue}
                      onValueChange={(value: any) => {
                        setSelectedValue(Number(value));

                        const detailAd = user.address.find(
                          (addr: any) => Number(addr.id) === Number(value)
                        );
                        if (Number(value) === 0) {
                          setSelectedAddress(null);
                        }
                        setSelectedAddress(detailAd);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Địa chỉ đã lưu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={0}>Chọn địa chỉ mới</SelectItem>
                        {user.address &&
                          user.address.map((address: any) => {
                            return (
                              <SelectItem key={address.id} value={address.id}>
                                {`${address.nameAddress.xa}-${address.nameAddress.huyen}-${address.nameAddress.tp}`}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </>
                )}

                <FormItem>
                  <FormLabel>Thành Phố</FormLabel>
                  <FormControl>
                    <Input defaultValue="Cần Thơ" disabled />
                  </FormControl>
                </FormItem>

                <FormField
                  control={form.control}
                  name="huyen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quận/Huyện</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          handleDistrictChange(value);
                        }}
                        disabled={selectedAddress ? true : false}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn Quận/Huyện" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district: any) => (
                            <SelectItem
                              key={district.name}
                              value={district.name}
                            >
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="xa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phường/Xã</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        disabled={selectedAddress ? true : false}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn Phường/Xã" />
                        </SelectTrigger>
                        <SelectContent>
                          {wards &&
                            wards.length > 0 &&
                            wards.map((ward: any) => (
                              <SelectItem key={ward.name} value={ward.name}>
                                {ward.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full mt-4 md:mt-0 md:w-1/2 ml-4 ">
                <h1 className="w-full capitalize text-3xl font-semibold text-center">
                  Thời gian nhận hàng
                </h1>
                <FormField
                  control={form.control}
                  name="giao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase">Ngày nhận</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Nhập Ngày Giao"
                          {...field}
                          value={
                            field.value instanceof Date &&
                            !isNaN(field.value.getTime())
                              ? field.value.toISOString().split("T")[0]
                              : new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
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
                <FormField
                  control={form.control}
                  name="ghiChu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase">Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Nhập Ghi Chú" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <FormField
                  control={form.control}
                  name="thanhToan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hình thức thanh toán</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setIsPayment(value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Hình thức thanh toán" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NH">
                            Thanh toán khi nhận hàng
                          </SelectItem>
                          <SelectItem value="TT">
                            Thanh Toán online
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <div className="w-full mt-4  mr-4 ">
                <h1 className="w-full capitalize text-3xl font-semibold text-center">
                  Tóm tắt thanh toán
                </h1>
                <div className="flex justify-between mt-4">
                  <h1>Tổng giá sản phẩm:</h1>
                  <h1>{formatVietnamCurrency(totalPrice - 30000)}</h1>
                </div>
                <div className="flex justify-between mt-4">
                  <h1>Phí Vận chuyển:</h1>
                  <h1>{formatVietnamCurrency(30000)}</h1>
                </div>
                <div className="flex justify-between mt-4 font-bold">
                  <h1>Tổng thanh toán:</h1>
                  <h1>{formatVietnamCurrency(totalPrice)}</h1>
                </div>
              </div>
              </div>
            </div>
            
            <div className=" flex justify-end w-full mt-14">
             <div className="w-[30rem] flex">
              <Link href='http://localhost:4000/cart'>
                  <button
                    className="mx-auto block px-16 py-4 bg-main text-white rounded-sm shadow-sm"
                  
                  >
                    Trở về giỏ hàng
                  </button>
                </Link>
                <button
                  className="mx-auto block px-16 py-4 bg-main text-white rounded-sm shadow-sm"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Đặt hàng
                </button>
             </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default page;
