import { telegramUser } from "@/types/telegram_types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppUser {
  chatId: string;
  phone?: string,
  telegram?: telegramUser;
}
interface UserStore {
  user: AppUser | null;
  setUser: (user: AppUser) => void;
  updateUser: (user: Partial<AppUser>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,

      // Replace user data completely
      setUser: (user) => set({ user }),

      // update user partially
      updateUser: (partial) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...partial }
            : ({ ...partial } as AppUser),
        })),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "app-user",
      version: 1,
    }
  )
);

// interface UserStore {
//   user: AppUser | null;
//   setUser: (user: AppUser) => void;
// }

// export const useUserStore = create<UserStore>((set) => ({
//   user: null,
//   setUser: (user) => set({ user }),
// }));
