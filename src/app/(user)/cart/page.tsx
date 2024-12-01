"use client";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatVietnamCurrency } from "@/components/ProductCard";
import Link from "next/link";
import ButtonCpn from "@/components/ButtonCpn";
import useStore from "@/store/store"; // Assuming you have a global store for user state
import {
  addToCart,
  getCart,
  minusFromCart,
  removeFromCart,
} from "@/app/sanpham/action";

const CartPage = () => {
  const { user, isChange, setIsChange } = useStore(); // Retrieve user login status
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Function to load cart items from localStorage
  const loadCartItemsFromStorage = () => {
    const storedCart = localStorage.getItem("products");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  };

  useEffect(() => {
    if (!user.isLogin) {
      loadCartItemsFromStorage();
    } else {
      try {
        (async () => {
          const res: any = await getCart(user.id);

          if (res?.detailCard) {
            setCartItems(JSON.parse(res.detailCard));
          } else {
            setCartItems([]);
          }
        })();
      } catch (error) {
        console.log(error);
      }
    }
  }, [user, isChange]);

  const AddProductQuantity = async (productId: string, quantity: number) => {
    if (!user.isLogin) {
      if (quantity <= 0) {
        const updatedCart = cartItems.filter((item) => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem("products", JSON.stringify(updatedCart));
      } else {
        const updatedCart = cartItems.map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: quantity };
          }
          return item;
        });
        setCartItems(updatedCart);
        localStorage.setItem("products", JSON.stringify(updatedCart));
        setIsChange(!isChange);
      }
    } else {
      try {
        const res = await addToCart(user.id, {
          id: `${productId}`,
          quantity: 1,
        });

        if (res) {
          setIsChange(!isChange);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const MinusProductQuantity = async (productId: string, quantity: number) => {
    if (!user.isLogin) {
      if (quantity <= 0) {
        const updatedCart = cartItems.filter((item) => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem("products", JSON.stringify(updatedCart));
      } else {
        const updatedCart = cartItems.map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: quantity };
          }
          return item;
        });
        setCartItems(updatedCart);

        setIsChange(!isChange);
      }
    } else {
      try {
        const res = await minusFromCart(user.id, {
          id: `${productId}`,
          quantity: 1,
        });

        if (res) {
          setIsChange(!isChange);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteProductFromCart = async (productId: string) => {
    if (!user.isLogin) {
      const updatedCart = cartItems.filter((item) => item.id !== productId);
      setCartItems(updatedCart);
      localStorage.setItem("products", JSON.stringify(updatedCart));
      setIsChange(!isChange);
    } else {
      try {
        const res = await removeFromCart(user.id, {
          id: `${productId}`,
          quantity: 1,
        });

        if (res) {
          setIsChange(!isChange);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const isDiscountValid = (dateStart: Date, dateEnd: Date): boolean => {
    const currentDate = new Date();
    return currentDate >= dateStart && currentDate <= dateEnd;
  };

  const calculateDiscountedPrice = (
    price: number,
    discountPercentage: number
  ) => {
    const discountAmount = (price * discountPercentage) / 100;
    return price - discountAmount;
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      let itemPrice = item.price * item.quantity;

      if (
        item.discount && user.isLogin &&
        isDiscountValid(
          new Date(item.discount.dateStart),
          new Date(item.discount.dateEnd)
        )
      ) {
        itemPrice =
          calculateDiscountedPrice(item.price, item.discount.percent) *
          item.quantity;
      }

      return total + itemPrice;
    }, 0);
  };

  return (
    <div className="bg-white my-[5%] px-10 py-14 shadow-md rounded-md">
      <h1 className="text-4xl flex items-center">
        Giỏ hàng <img src="/love1.svg" className="w-20 h-20" alt="Cart" />
      </h1>

      <Table className="mt-10">
        <TableBody>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <TableRow className="py-10" key={item.name}>
                <TableCell className="font-medium">
                  <img
                    src={
                      item.images && item.images[0] && item.images[0].url
                        ? item.images[0].url
                        : JSON.parse(item.images)[0].url
                    }
                    className="w-28 h-28 rounded-full"
                    alt={item.name}
                  />
                </TableCell>
                <TableCell className="font-medium text-xl">
                  {item.name}
                </TableCell>
                <TableCell className="font-medium text-xl ">
                  <div className="flex items-center">
                    <div
                      className="font-semibold text-3xl cursor-pointer"
                      onClick={() =>
                        MinusProductQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </div>
                    <h2 className="mx-4">{item.quantity}</h2>
                    <div
                      className="font-semibold text-3xl cursor-pointer"
                      onClick={() =>
                        AddProductQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </div>
                  </div>
                </TableCell>
                {user.isLogin ? (
                  <>
                    {item.discount &&
                    isDiscountValid(
                      new Date(item.discount.dateStart),
                      new Date(item.discount.dateEnd)
                    ) ? (
                      <TableCell className="font-medium text-xl text-right">
                        <p className="line-through">
                          {formatVietnamCurrency(item.price)}
                        </p>
                        <p className="text-red-500">
                          {formatVietnamCurrency(
                            calculateDiscountedPrice(
                              item.price,
                              item.discount.percent
                            )
                          )}
                        </p>
                      </TableCell>
                    ) : (
                      <TableCell className="font-medium text-xl text-right">
                        {formatVietnamCurrency(item.price)}
                      </TableCell>
                    )}
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium text-xl text-right">
                      {formatVietnamCurrency(item.price)}
                    </TableCell>
                  </>
                )}
                <TableCell
                  className="text-center font-bold text-3xl cursor-pointer"
                  onClick={() => deleteProductFromCart(item.id)}
                >
                  x
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center font-medium text-xl"
              >
                Giỏ hàng của bạn trống.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between mt-10">
        <Link href={"/sanpham"} className="font-semibold text-2xl text-main">
          Tiếp tục mua hàng
        </Link>
        <div className="w-1/3 flex-col justify-end items-center">
          <div className="font-semibold text-2xl text-end">
            Tổng giá: {formatVietnamCurrency(calculateTotalPrice())}
          </div>
          <div className="w-full flex justify-end">
            <Link href={"/order"}>
              <ButtonCpn className="mt-4" title="Thanh Toán" type="default" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
