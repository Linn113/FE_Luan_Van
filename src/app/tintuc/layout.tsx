import Footer from "@/components/Footer";
import NavMenu from "@/components/NavMenu";

export default function PagessLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full px-[4%]">
      <NavMenu />
      <section >{children}</section>
      <Footer />
    </div>
  );
}
