"use client";
// component shadcn
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import axiosClient from "@/lib/axios-client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserCog } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
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

export function User({
  user,
  isChange,
  setIsChange,
}: {
  user: any;
  isChange: any;
  setIsChange: any;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      email: user?.email || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (value: any) => {
      return await axiosClient.put(`/user/${user?.id}/admin`, value);
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
          description: "Cập nhật thông tin  thành công!",
        });
        setIsChange(!isChange);
        setDialogOpen(false);
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <TableRow className="">
      <TableCell className="font-medium capitalize">
        {`${user.firstName} ${user.lastName}`}
      </TableCell>
      <TableCell className="font-medium capitalize">{user.email}</TableCell>
      <TableCell>
        <Badge variant="outline">{user.phone}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {user?.isAdmin ? (
          <Badge variant="outline" className="text-white bg-red-500">
            Admin
          </Badge>
        ) : (
          <Badge variant="outline" className="text-white bg-blue-500">
            User
          </Badge>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(user?.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </TableCell>
      <TableCell>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Badge variant="outline" className="mx-1 cursor-pointer">
              <UserCog />
            </Badge>
          </DialogTrigger>
          <DialogContent className="sm:min-w-[34rem]">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nhập Tên của bạn"
                          {...field}
                        />
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
                        <Input
                          type="text"
                          placeholder="Nhập họ của bạn"
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
                      <FormLabel>Số Điện Thoại</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>email</FormLabel>
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
                <div className="w-full flex justify-end">
                  <Button type="submit">Chỉnh sửa</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
