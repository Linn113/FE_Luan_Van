import { create } from "zustand";

interface User {
  id: string;
  isLogin: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  isAdmin: boolean;
  address: any
}

interface Store {
  user: User;
  isChange: boolean;
  setIsChange: (isChange: boolean) => void;
  getProfile: () => User;
  setLogin: (isLogin: boolean) => void;
  setProfile: (user: User) => void;
}

const useStore = create<Store>((set, get) => ({
  user: {
    id: "",
    isLogin: false,
    isAdmin: false,
    firstName: "",
    email: "",
    phone: "",
    lastName: "",
    avatar: "",
    address: []
  },
  isChange: false,
  setIsChange: (isChange: boolean) => set(() => ({ isChange })),
  getProfile: () => get().user,
  setLogin: (isLogin: boolean) =>
    set((state) => ({ user: { ...state.user, isLogin } })),
  setProfile: (user: User) =>
    set((state) => ({ user: { ...state.user, ...user } })),
}));

export default useStore;
