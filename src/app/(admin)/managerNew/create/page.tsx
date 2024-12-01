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
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/lib/axios-client";

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
  const formSchema = z.object({
    title: z.string().min(2, {
      message: "Tên Tin tức phẩm không được bỏ trống!!",
    }),
    description: z.string().min(10, {
      message: "Mô tả phải hơn 10 kys tự và không được bỏ trống",
    }),
    sections: z.array(
      z.object({
        headTitle: z.string().min(2, { message: "Tiêu là là trường bắt buộc" }),
        content: z
          .string()
          .min(5, { message: "nội dung là yêu cầu bắt buộc và hơn 5 ky tự" }),
        imageUrl: z.string().optional(),
      })
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      sections: [{ headTitle: "", content: "", imageUrl: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (fileList.length <= 0 || !fileList) {
      toast({
        variant: "destructive",
        title: "Chưa thêm hình ảnh cho tin tức",
        description: "Vui lòng thêm hình ảnh cho tin tức",
      });
      return;
    }

    let images = fileList?.map((file) => {
      return {
        url: file?.response?.url,
      };
    });

    try {
      const res = await axiosClient.post("http://localhost:3000/new", {
        ...values,
        imageUrl: JSON.stringify(images),
      });

      if (res) {
        toast({
          variant: "default",
          title: "Thành công",
          description: "Đã tạo sản phẩm thành công",
        });
        window.location.href = "/managerNew";
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
        <CardTitle>Quản lý Tin tức</CardTitle>
        <CardDescription>Tạo tin tức.</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[34rem] py-[3%] overflow-y-scroll">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Tiêu đề tin tức" {...field} />
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
                  <FormLabel>Mô tả Tin tức</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả tin tức"
                      className="resize"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <>
              <p className="text-xl font-medium">Hình ảnh:</p>
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
            <div>
              <h3 className="text-lg font-semibold">Nội dung</h3>
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`sections.${index}.headTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Thêm tiêu đề cho nội dung"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`sections.${index}.content`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nội dung</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="thêm nội dung cho phần này"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    Loại bỏ nội dung này
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  append({ headTitle: "", content: "", imageUrl: "" })
                }
              >
                Thêm nội dung
              </Button>
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
