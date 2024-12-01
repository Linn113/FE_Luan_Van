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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";
import { SignUpData, Token } from "../action-type";
import { ToastAction } from "@radix-ui/react-toast";

// import { setIsLogin } from '../../store/slice/user.slice'
// import { useAppDispatch } from '../../hook/useSelector'

const formSchema = z
  .object({
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
    password: z
      .string({
        required_error: "Chưa nhập mật khẩu",
        invalid_type_error: "Mật khẩu phải là ký tự",
      })
      .min(7, {
        message: "Mật khẩu phải lớn hơn 7 ký tự",
      }),
    phone: z
      .string({
        required_error: "Chưa nhập số điện thoại",
        invalid_type_error: "Số điện thoại phải là ký tự",
      })
      .regex(/^(\+84|84|0)?[1-9]\d{8}$/, {
        message: "Số điện thoại không hợp lệ",
      }),
    retypePassword: z
      .string({
        required_error: "Chưa nhập lại mật khẩu",
        invalid_type_error: "Mật khẩu phải là ký tự",
      })
      .min(7, {
        message: "Nhập mật khẩu phải lớn hơn 7 ký tự.",
      }),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Nhập lại mật khẩu không đúng",
    path: ["retypePassword"],
  });

const Register = () => {
  const { toast } = useToast();
  const router = useRouter();
  // const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      retypePassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (formData: SignUpData): Promise<Token> => {
      return axiosClient.post("/user/register", formData);
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
      console.log('asdasd',data);
      window.localStorage.setItem("accessToken", data?.accessToken);
      toast({
        variant: "default",
        title: "Đăng nhập thành công",
        description: "Chào mừng quý khách",
      });
      router.push("/home");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Card className="min-w-[24rem] shadow-xl">
      <CardHeader className="relative">
        <CardTitle>Đăng ký</CardTitle>
        <CardDescription>Hãy đăng ký tài khoản của bạn</CardDescription>
        <div className="w-full flex justify-end absolute top-1/2 -translate-y-1/2 -left-4">
          <Link href={"/home"}>
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
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      type="phone"
                      placeholder="Nhập số điện thoại của bạn"
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
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="retypePassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập lại mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end">
              <Button type="submit">Đăng ký</Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p>
          Bạn đã có tài khoản?{" "}
          <Link className="text-blue-500" href={"/login"}>
            Đăng nhập
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Register;
