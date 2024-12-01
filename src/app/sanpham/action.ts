import axiosClient from "@/lib/axios-client";

export const getSanPham = async (id: string) => {
  try {
    const sanPham = await axiosClient.get(
      `http://localhost:3000/product/${id}`
    );
    return sanPham;
  } catch (error) {
    console.log(error);
  }
};

export const getCart = async (id: string) => {
  try {
    const sanPham = await axiosClient.get(
      `http://localhost:3000/cart/${id}`
    );
    return sanPham;
  } catch (error) {
    console.log(error);
  }
};

export const addToCart = async (
  userId: string,
  cartItem: { id: string; quantity: number }
) => {
  try {
    const sanPham = await axiosClient.put(
      `http://localhost:3000/cart/add/${userId}`,
      {
        id: cartItem.id,
        quantity: cartItem.quantity,
      }
    );
    return sanPham;
  } catch (error) {
    console.log(error);
  }
};

export const minusFromCart = async (
  userId: string,
  cartItem: { id: string; quantity: number }
) => {
  try {
    const sanPham = await axiosClient.put(
      `http://localhost:3000/cart/minus/${userId}`,
      {
        id: cartItem.id,
        quantity: cartItem.quantity,
      }
    );
    return sanPham;
  } catch (error) {
    console.log(error);
  }
};

export const removeFromCart = async (
  userId: string,
  cartItem: { id: string; quantity: number }
) => {
  try {
    const sanPham = await axiosClient.put(
      `http://localhost:3000/cart/remove/${userId}`,
      {
        id: cartItem.id,
        quantity: cartItem.quantity,
      }
    );
    return sanPham;
  } catch (error) {
    console.log(error);
  }
};