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
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/lib/axios-client";
import { Badge } from "@/components/ui/badge";
import MutiSelectproduct from "../MutiSelectproduct";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function create() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any>();
  const [products, setProducts] = useState<any>({
    buoiSang: [],
    buoiChieu: [],
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Tên sản phẩm không được bỏ trống!!",
    }),
    price: z.number().min(1, {
      message: "Giá sản phẩm không được bỏ trống",
    }),
    status: z.string().nonempty({
      message: "Trạng thái không được bỏ trống",
    }),
    category: z.string().nonempty({
      message: "Trạng thái không được bỏ trống",
    }),
    calories: z.number().min(1, {
      message: "Calories sản phẩm không được bỏ trống",
    }),
    description: z.string().min(10, {
      message: "Mô tả không được bỏ trống",
    }),
    images: z.string(), // Changed from array to string for a single URL
  });

  useEffect(() => {
    (async () => {
      const res = await axiosClient.get("/category/all");
      setCategories(res);
    })();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "",
      description: "",
      images: "", // Changed from array to string for a single URL
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (fileList.length <= 0 || !fileList) {
      toast({
        variant: "destructive",
        title: "Chưa thêm hình ảnh cho sản phẩm",
        description: "Vui lòng thêm hình ảnh cho sản phẩm",
      });
      return;
    }

    if (
      !(
        products.buoiSang.length === 7 ||  
        products.buoiChieu.length === 7 ||
        (products.buoiSang.length === 7 && products.buoiChieu.length === 7)
      )
    ) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn đúng 7 sản phẩm cho một buổi. ",
        description: "Vui lòng điều chỉnh.",
      });
      return;
    }

    let images = fileList?.map((file) => {
      return {
        url: file?.response?.url,
      };
    });

    try {
      const res = await axiosClient.post("http://localhost:3000/product/menu", {
        ...values,
        products: products ? products : [],
        images: JSON.stringify(images),
      });

      if (res) {
        toast({
          variant: "default",
          title: "Thành công",
          description: "Đã tạo sản phẩm thành công",
        });
        window.location.href = "/managerProduct";
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra!!!",
        description: `${error?.message}`,
      });
    }
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Card className="min-h-svh">
      <CardHeader>
        <CardTitle>Quản lý sản phẩm</CardTitle>
        <CardDescription>Tạo Menu.</CardDescription>
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
                    <FormLabel>Tên Menu</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên Menu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="ml-10">
                    <FormLabel>Giá Menu </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Giá Menu"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormItem className="ml-10">
                    <FormLabel>Trạng Thái:</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Trạng Thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Còn Hàng">Còn hàng</SelectItem>
                        <SelectItem value="Gần Hết Hàng">
                          Gần hết hàng
                        </SelectItem>
                        <SelectItem value="Hết Hàng">Hết Hàng</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex items-center">
              <FormField
                control={form.control}
                name="calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Tổng Calories</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tổng calories"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="ml-10">
                    <FormLabel>Danh mục</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(e) => {
                          field.onChange(e);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn Danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories &&
                            categories.length > 0 &&
                            categories?.map((category: any) => (
                              <SelectItem
                                key={category.id}
                                value={category.name}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=" ml-14 mt-8 min-w-[14rem]">
                <MutiSelectproduct
                  products={products}
                  setProducts={setProducts}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả sản phẩm</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả sản phẩm"
                      className="resize"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <>
              <p className="text-xl font-medium">Hình Ảnh Sản phẩm:</p>
              <Upload
                action="http://localhost:3000/product/upload"
                listType="picture-card"
                fileList={fileList}
                className=""
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
