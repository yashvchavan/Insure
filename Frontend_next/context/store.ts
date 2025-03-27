import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";

// Zustand Store
const useAuth = create(
  persist(
    (set: any) => ({
      user: null,
      email:null,
      isAuthenticated: false,
      useAuthlogin: (newUser: any) => {
        set({ user: newUser,email:newUser.email, isAuthenticated: true });
      },
      adminEmail:(Email: any)=>{
        set({email:Email});   
      },
      useAuthlogout: () => {
        // sessionStorage.removeItem("auth-storage");
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
export default useAuth;