"use client";

import { api } from "@/convex/_generated/api";
import { FullScreenLoader } from "@/components/ui/AnimeLoader";
import { useQuery, useMutation } from "convex/react";
import { createContext, useContext, useEffect } from "react";
import { User } from "@/lib/types";

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.users.currentUser);
  const checkEnergy = useMutation(api.users.checkEnergyRefill);

  const isLoading = user === undefined;
  const isAuthenticated = user !== null && !isLoading;

  useEffect(() => {
    if (isAuthenticated) {
      checkEnergy();
    }
  }, [isAuthenticated, checkEnergy]);

  if (isLoading) return <FullScreenLoader />;

  return (
    <UserContext.Provider
      value={{ user: user ?? null, isLoading, isAuthenticated }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("useCurrentUser must be used within a UserProvider");
  return context;
}
