"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Image from "next/image";
import Link from "next/link";
import icons from "../common/icons";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import useStore from "../store/store";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/api/user.api";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchInput } from "./search";
import { getCart } from "@/app/sanpham/action";

const listMainMenu = [
  {
    title: "TRANG CHỦ",
    href: "/",
  },
  {
    title: "SẢN PHẨM",
    href: "/sanpham",
  },

  {
    title: "TIN TỨC",
    href: "/tintuc",
  },
];

const NavMenu = () => {
  const { setProfile, user, setLogin, isChange } = useStore();
  const [cartNumber, setCartNumber] = useState(0);
  const { isPending, isError, isSuccess, data, error }: any = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  const updateCartNumber = (cartData: any) => {
    if (!cartData) {
      const storedCart = window.localStorage.getItem("products");
      if (storedCart) {
        const cartData = JSON.parse(storedCart);
        const numberProduct = cartData.reduce(
          (total: any, item: any) => total + item.quantity,
          0
        );
        setCartNumber(numberProduct);
      }
    } else {
      const numberProduct = cartData.reduce(
        (total: any, item: any) => total + item.quantity,
        0
      );
      setCartNumber(numberProduct);
    }
  };

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
        address: Array.isArray(data.addresses)
          ? data.addresses.map((address: any) => {
              try {
                return {
                  ...address,
                  nameAddress: JSON.parse(address.nameAddress), // Parse JSON string
                };
              } catch (error) {
                console.error("Error parsing nameAddress:", error);
                return {
                  ...address,
                  nameAddress: null, // Set to null if parsing fails
                };
              }
            })
          : [],
      });
    }
  }, [isSuccess, data, setProfile]);

  useEffect(() => {
    if (user.isLogin) {
      (async () => {
        const res: any = await getCart(user.id);

        if (res?.detailCard) {
          updateCartNumber(JSON.parse(res?.detailCard));
        } else {
          localStorage.removeItem("products");
          updateCartNumber(0);
        }
      })();
    } else {
      updateCartNumber(0);
    }
  }, [isChange, user]);

  return (
    <>
      <NavigationMenu.Root className="hidden md:flex items-center justify-between w-full">
        <div className="w-[200px]">
          <Image
            width={200}
            height={100}
            alt="Logo"
            src={"./HealthyFood.svg"}
          />
          <p className="text-center w-[200px] mt-4 text-xl font-bold text-main">
            MeLinh Healthy Food
          </p>
        </div>
        <div className="flex md:w-full xl:w-4/6 justify-between">
          <NavigationMenu.List className="flex">
            {listMainMenu.map((menu) => (
              <NavigationMenu.Item
                key={menu.title}
                className="px-8 py-2 drop-shadow-lg hover:text-blue-500"
              >
                <Link className="text-[0.8rem] xl:text-md" href={menu.href}>
                  {menu.title}
                </Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>

          <NavigationMenu.List className="flex">
            {user.isLogin ? (
              <NavigationMenu.List className="flex ">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <NavigationMenu.Item className="p-2 text-3xl hover:text-blue-500 cursor-pointer">
                      <icons.CiSearch />
                    </NavigationMenu.Item>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-100 p-4 shadow-2xl rounded-md ">
                    <SearchInput limit={8} page={1} sortOrder={"ASC"} />
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* cart */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href={"/cart"}>
                        <NavigationMenu.Item className="p-2 text-3xl hover:text-blue-500 cursor-pointer relative">
                          <icons.CiShoppingCart />
                          <span className="absolute -top-0 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {cartNumber}
                          </span>
                        </NavigationMenu.Item>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Giỏ hàng</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {/* user  */}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <NavigationMenu.Item className="p-2 text-3xl hover:text-blue-500 cursor-pointer">
                      <icons.CiUser />
                    </NavigationMenu.Item>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-100 p-4 shadow-2xl rounded-md z-10">
                    <DropdownMenuLabel className="p-2 ">
                      {user.firstName} {user.lastName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href={"/user"}>
                      <DropdownMenuItem className="p-2 cursor-pointer">
                        Thông tin
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/order"}>
                      <DropdownMenuItem className="p-2 cursor-pointer">
                        Đơn hàng
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/cart"}></Link>

                    <DropdownMenuItem
                      onClick={() => {
                        localStorage.removeItem("accessToken");
                        setLogin(false);
                      }}
                      className="p-2 cursor-pointer"
                    >
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenu.List>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <NavigationMenu.Item className="p-2 text-3xl hover:text-blue-500 cursor-pointer">
                      <icons.CiSearch />
                    </NavigationMenu.Item>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-100 p-4 shadow-2xl rounded-md ">
                    <SearchInput limit={8} page={1} sortOrder={"ASC"} />
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* cart */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href={"/cart"}>
                        <NavigationMenu.Item className="p-2 text-3xl hover:text-blue-500 cursor-pointer relative">
                          <icons.CiShoppingCart />
                          <span className="absolute -top-0 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {cartNumber}
                          </span>
                        </NavigationMenu.Item>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Giỏ hàng</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <NavigationMenu.Item className="px-4 py-2 hover:text-blue-500 drop-shadow-lg">
                  <Link className="text-[0.8rem] xl:text-md" href={"/login"}>
                    ĐĂNG NHÂP
                  </Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item className="px-4 py-2 hover:text-blue-500 drop-shadow-lg">
                  <Link className="text-[0.8rem] xl:text-md" href={"/register"}>
                    ĐĂNG KÝ
                  </Link>
                </NavigationMenu.Item>
              </>
            )}
          </NavigationMenu.List>
        </div>
      </NavigationMenu.Root>
      <NavigationMenu.Root className="flex md:hidden items-center justify-between w-full mt-10">
        <Image width={200} height={100} alt="Logo" src={"./HealthyFood.svg"} />
        <Drawer direction="right">
          <DrawerTrigger>
            <icons.MdMenuOpen width={100} height={100} className="text-4xl" />
          </DrawerTrigger>
          <DrawerContent className="h-full left-40 w-[80%]">
            <NavigationMenu.List className="h-full">
              {listMainMenu.map((menu) => (
                <NavigationMenu.Item
                  key={menu.title}
                  className="px-8 py-2 drop-shadow-lg hover:text-blue-500"
                >
                  <Link className="text-xl cursor-pointer" href={menu.href}>
                    {menu.title}
                  </Link>
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>

            <NavigationMenu.List className="px-4 flex mt-10">
              {user.isLogin ? (
                <NavigationMenu.List className="px-6 ">
                  <NavigationMenu.Item className="p-2 text-3xl hover:text-blue-500 cursor-pointer">
                    <SearchInput />
                  </NavigationMenu.Item>
                  <div className="flex">
                    <Link href={"/cart"}>
                      <NavigationMenu.Item className="p-2 text-3xl hover:text-blue-500 cursor-pointer relative">
                        <icons.CiShoppingCart />
                        <span className="absolute -top-0 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {1}
                        </span>
                      </NavigationMenu.Item>
                    </Link>
                    <Link href={"/user"}>
                      <NavigationMenu.Item className="p-2 text-3xl hover:text-blue-500 cursor-pointer">
                        <icons.CiUser />
                      </NavigationMenu.Item>
                    </Link>
                  </div>
                </NavigationMenu.List>
              ) : (
                <>
                  <NavigationMenu.Item className="px-4 py-2 text-xl hover:text-blue-500 drop-shadow-lg">
                    <Link href={"/login"}>ĐĂNG NHÂP</Link>
                  </NavigationMenu.Item>
                  <NavigationMenu.Item className="px-4 py-2 text-xl hover:text-blue-500 drop-shadow-lg">
                    <Link href={"/register"}>ĐĂNG KÝ</Link>
                  </NavigationMenu.Item>
                </>
              )}
            </NavigationMenu.List>
          </DrawerContent>
        </Drawer>
      </NavigationMenu.Root>
    </>
  );
};

export default NavMenu;
