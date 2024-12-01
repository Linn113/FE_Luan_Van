import React from "react";
import { Button } from "@/components/ui/button";

export type ButtonProps = {
  type: "outline" | "default";
  title: string;
  className?: string;
};

const ButtonCpn: React.FC<ButtonProps> = ({ type, title, className }) => {
  return (
    <>
      {type === "default" ? (
        <Button
          variant="default"
          className={`min-w-[5rem] px-12 py-6 rounded-full bg-[#00f07d]  text-white ${className}`}
        >
          {title}
        </Button>
      ) : (
        <Button
          variant="outline"
          className={`min-w-[5rem] px-12 py-6 rounded-full text-main border-[#00f07d] ${className}`}
        >
          {title}
        </Button>
      )}
    </>
  );
};

export default ButtonCpn;
