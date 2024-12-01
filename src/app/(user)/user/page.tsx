"use client";

import useStore from "@/store/store";
import { UserRoundPen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { Button } from "@/components/ui/button";
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
import axiosClient from "@/lib/axios-client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import OrderUser from "@/components/OrderUser";

const formEditSchema = z.object({
  firstName: z
    .string({
      required_error: "Chưa nhập tên",
      invalid_type_error: "Tên phải là ký tự",
    })
    .min(2, {
      message: "Tên phải lớn hơn 2 ký tự",
    }),
  lastName: z
    .string({
      required_error: "Chưa nhập Họ",
      invalid_type_error: "Họ phải là ký tự",
    })
    .min(2, {
      message: "Họ lớn hơn 2 ký tự.",
    }),
  email: z
    .string({
      required_error: "Chưa nhập email",
      invalid_type_error: "email must be a string",
    })
    .email({ message: "Email chưa hợp lệ" }),
  phone: z
    .string({
      required_error: "Chưa nhập số điện thoại",
      invalid_type_error: "Số điện thoại phải là ký tự",
    })
    .regex(/^(\+84|84|0)?[1-9]\d{8}$/, {
      message: "Số điện thoại không hợp lệ",
    }),
});

const page = () => {
  const { user } = useStore();
  const { toast } = useToast();
  const formEditUser = useForm<z.infer<typeof formEditSchema>>({
    resolver: zodResolver(formEditSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formEditSchema>) {
    try {
      const res = await axiosClient.put("user/Profile", values);
      if (res) {
        toast({
          variant: "default",
          title: "Thành Công",
          description: `Cập nhật thông tin người dùng thành công`,
        });
      }
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ôi không! có lỗi đã xảy ra.",
        description: `${error?.message}`,
      });
    }
  }

  return (
    <div className="w-full">
      <div className="py-[6%] ml-[4%]">
        <h1 className="text-3xl font-bold flex items-center">
          Thông Tin Người dùng:{" "}
          <Dialog>
            <DialogTrigger asChild>
              <UserRoundPen className="ml-4 cursor-pointer hover:text-main" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cập nhật thông tin người dùng</DialogTitle>
                <DialogDescription>
                  Thay đỗi thông tin người dùng
                </DialogDescription>
              </DialogHeader>
              <Form {...formEditUser}>
                <form
                  onSubmit={formEditUser.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={formEditUser.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên</FormLabel>
                          <FormControl>
                            <Input placeholder="Tên người dùng" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formEditUser.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Họ người dùng người dùng"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formEditUser.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formEditUser.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số Điện thoại</FormLabel>
                          <FormControl>
                            <Input placeholder="SĐT" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Submit</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </h1>
        <p className="mt-10 text-xl font-semibold">
          Họ Tên:{" "}
          <span className="font-normal">
            {user.firstName} {user.lastName}
          </span>
        </p>
        <p className="mt-4 text-xl font-semibold">
          Email: <span className="font-normal">{user.email}</span>
        </p>
        <p className="mt-4 text-xl font-semibold">
          Số Điện Thoại: <span className="font-normal">{user.phone}</span>
        </p>
      </div>
      <div>
        <OrderUser userId={user.id} />
      </div>
    </div>
  );
};

export default page;
