"use client";
import { CreditCard, ShoppingCart, TicketPercent } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FaChartBar,
  FaBell,
  FaTasks,
  FaSearch,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaRegNewspaper,
} from "react-icons/fa";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { fetchUserProfile } from "@/api/user.api";
import { useQuery } from "@tanstack/react-query";

const menu = [
  { name: "Thống kê", url: "/dashboard", icon: FaChartBar },
  { name: "Sản phẩm", url: "/managerProduct", icon: FaChartBar },
  { name: "Doanh Mục", url: "/managerCategory", icon: FaChartBar },
  { name: "Tin Tức", url: "/managerNew", icon: FaRegNewspaper },
  { name: "Đơn hàng", url: "/managerOrder", icon: FaChartBar },
  { name: "Người dùng", url: "/managerUser", icon: FaBell },
  { name: "Giảm giá", url: "/managerDiscount", icon: FaBell },
];

export default function AdminLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { setProfile, user, setLogin, isChange } = useStore();
  const { isPending, isError, isSuccess, data, error }: any = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && data) {
      setProfile({
        id: data?.id,
        isLogin: true,
        firstName: data?.firstName,
        email: data?.email,
        phone: data?.phone,
        lastName: data?.lastName,
        avatar: data?.avatar,
        isAdmin: data?.isAdmin,
      });

      if (!data.isAdmin) {
        toast({
          variant: "destructive",
          title: "Ôi không! có lỗi đã xảy ra.",
          description: "Bạn không có quyền vào trang này!",
        });
        router.push("/");
      }
    }
  }, [isSuccess, data, setProfile]);

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
        >
          <nav>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Dashboard</h2>
              <button onClick={toggleSidebar} className="md:hidden">
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-2">
              {menu.map((section) => (
                <div
                  onClick={() => {
                    console.log(section.url);
                    window.location.href = section.url;
                    setActiveSection(section.name);
                  }}
                  className={`flex items-center space-x-2 w-full px-4 py-2 rounded-md hover:bg-gray-700 ${
                    activeSection === section.name ? "bg-gray-700" : ""
                  }`}
                >
                  {section.url === "/dashboard" && (
                    <FaChartBar className="h-5 w-5" />
                  )}
                  {section.url === "/managerProduct" && (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                  {section.url === "/managerCategory" && (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                  {section.url === "/managerNew" && (
                    <FaRegNewspaper className="h-5 w-5" />
                  )}
                  {section.url === "/managerOrder" && (
                    <CreditCard className="h-5 w-5" />
                  )}
                  {section.url === "/managerDiscount" && (
                    <TicketPercent className="h-5 w-5" />
                  )}
                  {section.url === "/managerUser" && (
                    <FaBell className="h-5 w-5" />
                  )}

                  {section.url === "/tasks" && <FaTasks className="h-5 w-5" />}
                  <span className="capitalize">{section.name}</span>
                </div>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Menu */}
          <header className="bg-white shadow-md">
            <div className="flex items-center justify-between px-4 py-3">
              <button onClick={toggleSidebar} className="md:hidden">
                <FaBars className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="User avatar"
                    />
                    <span className="hidden md:inline-block font-medium text-gray-700">
                      {user.firstName} {user.lastName}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Log out
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <section className="">{children}</section>
        </div>
      </div>
    </>
  );
}
