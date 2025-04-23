import { create, Mutate, StoreApi, UseBoundStore } from "zustand";
import { AxiosError } from "axios";

import { Axios } from "@/api/api-provider.ts";

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isSupport: boolean;
}

interface IAuthStore {
  token: string | null;
  user: IUser | null;
  isLoggedIn: boolean;
  isSupport: boolean;
  checkAuth: () => Promise<void>;
}

export const useAuthStore: UseBoundStore<Mutate<StoreApi<IAuthStore>, []>> =
  create((set) => ({
    token: localStorage.getItem("token") || null,
    isLoggedIn: false,
    isSupport: false,
    user: null,
    checkAuth: async () => {
      if (localStorage.getItem("token")) {
        try {
          const response = await Axios.get("/api/identity/me");

          set({ user: response.data });
          set({ isLoggedIn: true });
          set({ isSupport: response.data.isSupport });
        } catch (err: any) {
          if (
            err instanceof AxiosError &&
            err.response &&
            err.response.status === 401
          ) {
            localStorage.removeItem("token");
            set({ token: null, user: null, isLoggedIn: false });
          } else {
            throw err;
          }
        }
      } else {
        set({ isLoggedIn: false });
      }
    },
  }));
