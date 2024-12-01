import Footer from "@/components/Footer";
import NavMenu from "@/components/NavMenu";

export default function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full px-[4%] relative">
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 left-0 -z-30 overflow-hidden">
        <img
          className="absolute -top-[25%] -right-[20%] w-[100%] h-[100%] -z-30"
          src="./Ellipse1.svg"
          alt="elip"
        />
        <img
          className="absolute md:top-[8%] md:right-[10%] top-[6%] right-[6%] w-[36%] h-[36%] -z-30"
          src="./disk.svg"
          alt="elip"
        />
        <img
          className="absolute md:top-[10%] md:right-[8%] top-[8%] right-[4%] w-[10%] h-[10%] -z-30"
          src="./disk2.svg"
          alt="elip"
        />
        <img
          className="absolute md:top-[24%] md:right-[6%] top-[20%] right-10 w-[8%] h-[8%] -z-30"
          src="./disk3.svg"
          alt="elip"
        />
        <img
          className="absolute md:top-[34%] md:right-[12%] top-[30%] right-[7%] w-[6%] h-[6%] -z-30"
          src="./disk4.svg"
          alt="elip"
        />
      </div>
      <div className="hidden md:block lg:hidden absolute top-0 right-0 bottom-0 left-0 -z-30 overflow-hidden">
        <img
          className=" absolute top-[2%] right-[6%] w-[36%] h-[36%] -z-30"
          src="./disk.svg"
          alt="elip"
        />
        <img
          className="absolute top-[26%] right-[26%] w-[10%] h-[10%] -z-30"
          src="./disk2.svg"
          alt="elip"
        />
        <img
          className="absolute top-[26%] right-[20%] w-[10%] h-[10%] -z-30"
          src="./disk3.svg"
          alt="elip"
        />
        <img
          className="absolute top-[26%] right-[14%] w-[10%] h-[10%] -z-30"
          src="./disk4.svg"
          alt="elip"
        />
      </div>
      <NavMenu />

      {children}
      <Footer />
    </div>
  );
}
