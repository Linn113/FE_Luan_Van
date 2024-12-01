"use client";
import axiosClient from "@/lib/axios-client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Bolt, PackagePlus, Trash2 } from "lucide-react";
import { Modal } from "antd";
import { Select, Space } from "antd";
import { useQuery } from "@tanstack/react-query";
import type { SelectProps } from "antd";
import { Button } from "@/components/ui/button";

let options: SelectProps["options"] = [];

const MutiSelectproduct = ({ products, setProducts }: any) => {
  const { isLoading, isError, data, error }: any = useQuery({
    queryKey: ["products12"],
    queryFn: async () => {
      const res = await axiosClient.get("/product/withoutPaginate");
      return res;
    },
  });

  if (data) {
    const seenValues = new Set();
    options = data.reduce((acc: any[], product: any) => {
      const value = product?.id;
      if (value && !seenValues.has(value)) {
        seenValues.add(value);
        acc.push({
          label: product?.name,
          value: value,
        });
      }
      return acc;
    }, []);
  }

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChange = (value: string[]) => {
    setProducts(value);
  };

  return (
    <>
      <div
        onClick={showModal}
        className="border-slate-200 border-2 px-4 py-2 rounded-md bg-black text-white hover:bg-slate-300 hover:text-black cursor-pointer"
      >
        {" "}
        Thêm sản phẩm vào menu
      </div>
      <Modal
        title="Chọn sản phẩm thêm vào giảm giá"
        open={open}
        onOk={() => {
          handleOk();
        }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Space style={{ width: "100%" }} direction="vertical">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Chọn Danh sách sản phẩm"
            defaultValue={[]}
            onChange={handleChange}
            options={options}
          />
        </Space>
      </Modal>
    </>
  );
};

export default MutiSelectproduct;
