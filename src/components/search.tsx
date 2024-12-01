"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { FaSpinner } from "react-icons/fa";
import { Search } from "lucide-react";

export const SearchInput: React.FC<any> = ({
  limit,
  page,
  search,
  sortOrder,
  sortOrderBy,
  category,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function searchAction(formData: FormData) {
    const value = formData.get("search") as string;
    const params = new URLSearchParams({ search: value });
  
    startTransition(() => {
      router.push(
        `/sanpham?page=${page}&limit=${limit}${value ? `&search=${value}` : ""}${
          sortOrder ? `&sortOrder=${sortOrder}` : ""
        }${sortOrderBy ? `&sortOrderBy=${sortOrderBy}` : ""}${
          category ? `&category=${category}` : ""
        }`
      );
    });
  }

  return (
    <form action={searchAction} className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
      <Input
        defaultValue={search || ""}
        name="search"
        type="search"
        placeholder="Tìm kiếm"
        className="w-full rounded-lg bg-background pl-8 md:w-[140px] lg:w-[240px]"
      />
      {isPending && <FaSpinner />}
    </form>
  );
};
