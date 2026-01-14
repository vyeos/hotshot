"use client";

import { api } from "@/convex/_generated/api";
import { User } from "@/lib/types";
import { useQuery } from "convex/react";
import { createContext, useContext } from "react";

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.users.currentUser);

  const isLoading = user === undefined;
  const isAuthenticated = user !== null && !isLoading;

  if (isLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="animate-pulse">Loading Application...</p>
      </div>
    );

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
