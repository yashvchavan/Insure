// context/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserSession } from "@/types/auth";

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  adminEmail: string | null;
  useAuthlogin: (newUser: UserSession) => void;
  useAuthlogout: () => void;
  setAdminEmail: (email: string) => void;
  login: (userData: any) => void;
  logout: () => void;
}

const useAuth = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      isAuthenticated: false,
      adminEmail: null,
      useAuthlogin: (newUser) => {
        set({ 
          user: newUser,
          isAuthenticated: true,
          adminEmail: newUser.role === 'admin' ? newUser.email : null
        });
      },
      useAuthlogout: () => {
        set({ user: null, isAuthenticated: false, adminEmail: null });
      },
      setAdminEmail: (email) => set({ adminEmail: email }),
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, adminEmail: null }),
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => JSON.parse(sessionStorage.getItem(name) || "null"),
        setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);

export default useAuth;