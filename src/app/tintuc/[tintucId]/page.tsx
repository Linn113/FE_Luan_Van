"use client";
import axiosClient from "@/lib/axios-client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const page = ({ params }: { params: { tintucId: string } }) => {
  const { isError, data, error }: any = useQuery({
    queryKey: ["detailItem"],
    queryFn: async () => {
      let data;

      try {
        data = await axiosClient.get(`new/${params.tintucId}`);
      } catch (error) {
        throw new Error("có lỗi");
      }

      return data;
    },
  });

  console.log(data?.contents);

  if (isError) {
    return (
      <>
        <div>Có lỗi xảy ra</div>
      </>
    );
  }

  if (data) {
    return (
      <div className="my-10 w-full">
        <h1 className="text-4xl w-full text-center font-bold my-10">Tin tức</h1>
        <h1 className="text-3xl font-semibold">{data?.title}</h1>
        <p className="my-4 text-sm font-semibold text-slate-600 italic">
          Ngày đăng:{" "}
          {new Date(data?.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>

        {/* Add break-words and max-w-lg for text wrap */}
        <h1 className="text-md my-2 indent-10 break-words max-w-[96%] mx-auto">
          {data?.description}
        </h1>

        {data?.imageUrl && (
          <img
            className="w-2/3 mx-auto mt-10 mb-4 rounded-md shadow-lg"
            src={data?.imageUrl ? JSON.parse(data?.imageUrl)[0].url : ""}
            alt="Tin tức"
          />
        )}
        <p className="w-full text-center text-sm font-semibold text-slate-600 italic mb-6">
          Hình ảnh mô tả
        </p>

        {data?.contents &&
          data?.contents.length > 0 &&
          data?.contents.map((content: any, index: number) => {
            return (
              <article
                key={index}
                className="w-full max-w-[96%] mx-auto  text-wrap"
              >
                <h2 className="text-2xl font-semibold mt-10">
                  {content.headTitle}
                </h2>
                <p className="text-md my-2 indent-10 mb-10 break-words">
                  {content.content}
                </p>
              </article>
            );
          })}
      </div>
    );
  }

  return null;
};

export default page;
