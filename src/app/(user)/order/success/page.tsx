"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/lib/axios-client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();
  const hasProcessedPayment = useRef(false); // Ref to track payment processing

  useEffect(() => {
    const handlePaymentOnline = async (paymentData: string) => {
      try {
        const response = await axiosClient.post(
          "/order",
          JSON.parse(paymentData)
        );
        // Handle response if needed
        window.localStorage.removeItem("product-payment");
        console.log("Payment processed successfully:", response.data);
      } catch (error) {
        console.error("Error processing payment:", error);
        // You might want to redirect or show an error message here
      }
    };

    const paymentData = window.localStorage.getItem("product-payment");

    if (paymentData && !hasProcessedPayment.current) {
      hasProcessedPayment.current = true; // Set to true to prevent reprocessing
      handlePaymentOnline(paymentData);
      toast({
        variant: "default",
        title: "Thành công",
        description:
          "Đặt hàng thành công, Cửa hàng sẽ điện bạn vào thời gian sớm nhất",
      });
    } else {
      router.push("http://localhost:4000/user");
    }
  }, [router, toast]); // Add toast to dependency array

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Cảm ơn bạn!</h1>
        <h2 className="text-2xl">Đơn hàng của bạn đã thanh toán thành công</h2>

        <Button
          onClick={() => {
            router.push("http://localhost:4000/user");
          }}
        >
          Trở về trang đơn hàng
        </Button>
      </div>
    </main>
  );
};

export default Page;
