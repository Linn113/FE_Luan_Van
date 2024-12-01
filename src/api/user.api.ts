import axiosClient from "@/lib/axios-client";

export const fetchUserProfile = async () => {
  try {
    const user = axiosClient.get("/user/profile");

    return user;
  } catch (error) {
    console.log(error);
  }
};
