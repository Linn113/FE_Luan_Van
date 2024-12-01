"use clients";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { FilterProps } from "./FilterCpn";

export type PaginationType = {
  className: string;
  totalPage: number;
  searchParams: FilterProps;
};

const PaginationCpn: React.FC<PaginationType> = ({
  className,
  searchParams,
}: any) => {
  const router = useRouter();

  const handleChangePagination = (pagination: number) => {
    router.push(
      `?page=${pagination}&limit=${searchParams.limit}${
        searchParams.search ? `&search=${searchParams.search}` : ""
      }${searchParams.sortOrder ? `&sortOrder=${searchParams.sortOrder}` : ""}${
        searchParams.sortOrderBy
          ? `&sortOrderBy=${searchParams.sortOrderBy}`
          : ""
      }${searchParams.category ? `&category=${searchParams.category}` : ""}`
    );
  };

  return (
    <Pagination className={`${className}`}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`bg-main text-slate-800 shadow-lg mr-4 ${Number(searchParams.page) <= 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={() => {
              if (Number(searchParams.page) > 1) {
                const previous = Number(searchParams.page) - 1;
                handleChangePagination(previous);
              }
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className="bg-main text-slate-800 shadow-lg ml-4 cursor-pointer"
            onClick={() => {
              const next = Number(searchParams.page) + 1;
              console.log(next);
              handleChangePagination(next);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationCpn;
