const Footer = () => {
  return (
    <div className="md:flex w-full py-10">
      <div
        className=" text-[#00F07D] 
        text-3xl font-bold 
        md:py-2 md:mr-8 "
      >
        <p className="border-b-4 border-[#00F07D] pb-4 cursor-pointer text-center md:text-left">
          MÊ LINH <br />
          HealthyFood
        </p>
      </div>
      <div className="w-full md:w-5/6 md:flex justify-between ml-8">
        <div className="w-4/5 md:w-1/3 mt-10 md:mt-0 ">
          <h1 className="font-bold uppercase">GIỜ MỞ CỬA</h1>
          <p className="pt-6 text-sm uppercase">THỨ 2 - 6: 09:00AM - 06:00PM</p>
          <p className="pt-6 text-sm uppercase">THỨ 7: 12:00AM - 06:00PM</p>
          <p className="pt-6 text-sm uppercase">CN: ĐÓNG CỬA</p>
        </div>
        <div className="w-4/5 md:w-1/3 mt-10 md:mt-0 ">
          <h1 className="font-bold uppercase">LIÊN HỆ CHÚNG TÔI</h1>
          <p className="pt-6 text-sm uppercase">
            150, đ.30/4, Phường xuân khánh
          </p>
          <p className="pt-6 text-sm uppercase">
            quận ninh kiều, thành phố cần thơ
          </p>
          <p className="pt-6 text-sm uppercase">SDT: 0123123123</p>
        </div>
        <div className="w-4/5 md:w-1/3 mt-10 md:mt-0 ">
          <h1 className="font-bold uppercase">Phương thức khác</h1>
          <p className="pt-6 text-sm uppercase">Email: abcak@gmail.com</p>
          <p className="pt-6 text-sm uppercase">
            facebook: mê linh healthyfood
          </p>
          <p className="pt-6 text-sm uppercase">instagram: mlinhhlf_123</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
