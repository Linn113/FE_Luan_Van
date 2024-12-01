"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

import type { GetProp, UploadFile, UploadProps } from "antd";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/lib/axios-client";

export default function create() {
  const { toast } = useToast();
  
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Tên danh mục không được bỏ trống!!",
    }),
    description: z.string().min(10, {
      message: "Mô tả không được bỏ trống",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });


  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axiosClient.post("http://localhost:3000/category", {
        ...values,
      });

      if (res) {
        toast({
          variant: "default",
          title: "Thành công",
          description: "Đã tạo sản phẩm thành công",
        });
        window.location.href = '/managerCategory'
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra!!!",
        description: `${error?.message}`,
      });
    }
  }

  return (
    <Card className="min-h-svh">
      <CardHeader>
        <CardTitle>Quản lý Danh Mục</CardTitle>
        <CardDescription>Tạo Danh Mục.</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[34rem] py-[3%] overflow-y-scroll">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên Danh mục</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên danh mục" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả danh mục</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả danh mục"
                      className="resize"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Tạo</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
