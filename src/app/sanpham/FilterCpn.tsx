"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import axiosClient from "@/lib/axios-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type FilterProps = {
  page: number;
  limit: number;
  search: string;
  sortOrder: string;
  sortOrderBy: string;
  category: string;
};

const FilterCpn: React.FC<FilterProps> = ({
  page,
  limit,
  search,
  sortOrder,
  sortOrderBy,
}) => {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);

  const handleChangeCategory = (category: string) => {
    router.push(
      `?page=${page}&limit=${limit}${search ? `&search=${search}` : ""}${
        sortOrder ? `&sortOrder=${sortOrder}` : ""
      }${sortOrderBy ? `&sortOrderBy=${sortOrderBy}` : ""}&category=${category}`
    );
  };

  useEffect(() => {
    (async () => {
      const res:any = await axiosClient.get("/category/all");
      setCategories(res);
    })();
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold mb-10">Danh Mục</h1>
      <div
        onClick={() => {
          handleChangeCategory("");
        }}
        className="w-full font-medium cursor-pointer"
      >
        Tất cả sản phẩm
      </div>
      <Separator className="my-2" />
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Menu cố định</AccordionTrigger>
          <AccordionContent className="flex-col">
            {categories &&
              categories
                .filter((category) => !category.name.toLowerCase().includes("gói"))
                .map((category) => (
                  <div className="ml-[4%] hover:text-main my-[1px]" key={category.name}>
                    <div
                      onClick={() => {
                        handleChangeCategory(category.name);
                      }}
                      className="w-full block py-2 cursor-pointer"
                    >
                      {category.name}
                    </div>
                  </div>
                ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-start">
            Các gói sản phẩm
          </AccordionTrigger>
          <AccordionContent className="flex-col">
            {categories &&
              categories
                .filter((category) => category.name.toLowerCase().includes("gói"))
                .map((category) => (
                  <div className="ml-[4%] hover:text-main my-[1px]" key={category.name}>
                    <div
                      onClick={() => {
                        handleChangeCategory(category.name);
                      }}
                      className="w-full block py-2 cursor-pointer"
                    >
                      {category.name}
                    </div>
                  </div>
                ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default FilterCpn;
