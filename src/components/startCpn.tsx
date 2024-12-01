import React from "react";

const StartCpn: React.FC<{
  numberStar: number;
  width?: string;
  height?: string;
}> = ({ numberStar, height, width }) => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          width={`${height ? height : 32}`}
          height={`${width ? width : 32}`}
          viewBox="0 0 32 29"
          fill={index < numberStar ? "black" : "gray"}
        >
          <path d="M15.836 0L19.5393 11.0557H31.5235L21.8281 17.8885L25.5314 28.9443L15.836 22.1115L6.14068 28.9443L9.84398 17.8885L0.148619 11.0557H12.1327L15.836 0Z" />
        </svg>
      ))}
    </>
  );
};

export default StartCpn;
