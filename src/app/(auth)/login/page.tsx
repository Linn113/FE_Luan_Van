"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";
import { SignInData, Token } from "../action-type";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email không được để trống",
      invalid_type_error: "Email phải là một chuỗi",
    })
    .email({ message: "Địa chỉ email không hợp lệ" }),
  password: z
    .string({
      required_error: "Mật khẩu không được để trống",
      invalid_type_error: "Mật khẩu phải là một chuỗi",
    })
    .min(7, {
      message: "Mật khẩu phải có ít nhất 7 ký tự.",
    }),
});

const SignIn = () => {
  const { toast } = useToast();
  const router = useRouter();
  // const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (formData: SignInData): Promise<Token> => {
      return axiosClient.post("/user/login", formData);
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
    onSuccess: (data: Token, variables, context) => {
      // Store tokens in cookies

      window.localStorage.setItem("accessToken", data.accessToken); // 15 minutes

      toast({
        variant: "default",
        title: "Đăng nhập thành công",
        description: "Chào mừng quý khách",
      });

      if (data.isAdmin) {
        router.push("/dashboard");
      } else {
        router.push("/home");
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Card className="min-w-[24rem] shadow-2xl">
      <CardHeader className="relative">
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>Đăng nhập và bắt đầu đặt hàng</CardDescription>
        <div className="w-full flex justify-end absolute top-1/2 -translate-y-1/2 -left-4">
          <Link href={"/"}>
            <Button size={"sm"} className="hover:bg-blue-600">
              Trở về
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Nhập email của bạn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu của bạn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end">
              <Button type="submit">Đăng nhập</Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <div>
          <div className="text-center">
            Bạn chưa có tài khoản?{" "}
            <Link className="text-blue-500" href={"/register"}>
              Đăng ký
            </Link>
          </div>
          {/* <div className="text-[0.8rem] text-slate-400 mt-2">
            Don't remember your password?{" "}
            <Link className="text-blue-500" href={"/forgot"}>
              Forgot Password
            </Link>
          </div> */}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignIn;
