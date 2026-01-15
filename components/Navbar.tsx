"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "./ui/button";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AnimeTodayIcon,
  AnimeArchiveIcon,
  AnimeRankingIcon,
  AnimeUserIcon,
  AnimeEnergyIcon,
  AnimePenIcon,
  AnimeCheckIcon,
} from "./ui/AnimeIcons";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCurrentUser } from "./UserProvider";
import { useState } from "react";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface NavLinkProps {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const Navbar = () => {
  const { user } = useCurrentUser();
  const { signOut } = useAuthActions();

  const convex = useConvex();
  const setUsername = useMutation(api.users.setUsername);

  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleSaveUsername = async () => {
    if (!newUsername.trim() || newUsername === user?.username) {
      setIsEditingUsername(false);
      return;
    }

    if (newUsername.length < 3 || newUsername.length > 20) {
      alert("Username must be between 3 and 20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      alert("Username can only contain letters, numbers, and underscores");
      return;
    }

    setIsChecking(true);
    try {
      const isTaken = await convex.query(api.users.isUsernameTaken, {
        username: newUsername,
      });

      if (isTaken) {
        alert("Username is already taken");
        return;
      }

      await setUsername({ username: newUsername });
      setIsEditingUsername(false);
    } catch (error) {
      console.error("Failed to update username:", error);
      alert("Failed to update username. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const navLinks: NavLinkProps[] = [
    {
      name: "DROPS",
      url: "/",
      icon: <AnimeTodayIcon className="w-6 h-6" />,
    },
    {
      name: "VAULT",
      url: "/vault",
      icon: <AnimeArchiveIcon className="w-6 h-6" />,
    },
    {
      name: "LEADERBOARD",
      url: "/leaderboard",
      icon: <AnimeRankingIcon className="w-6 h-6" />,
    },
  ];

  return (
    <div className="sticky top-0 left-0 flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur-sm z-50">
      <div className="flex items-center gap-8">
        <Logo />
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.url;
            return (
              <Link
                key={link.name}
                href={link.url}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary/20 text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-primary/5 opacity-50 animate-pulse" />
                )}
                <span
                  className={cn(
                    "transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110",
                  )}
                >
                  {link.icon}
                </span>
                <span className="font-semibold text-sm tracking-wide z-10">
                  {link.name}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(255,100,0,0.5)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4 relative">
        {user ? (
          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 group relative overflow-hidden outline-none ring-0",
                  isProfileOpen
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary/20 text-muted-foreground hover:text-foreground",
                )}
              >
                {isProfileOpen && (
                  <div className="absolute inset-0 bg-primary/5 opacity-50 animate-pulse" />
                )}

                <span
                  className={cn(
                    "transition-transform duration-300",
                    isProfileOpen ? "scale-110" : "group-hover:scale-110",
                  )}
                >
                  <AnimeUserIcon className="w-6 h-6" />
                </span>

                <span className="hidden md:inline-block font-semibold text-sm tracking-wide z-10 transition-transform duration-300">
                  {user.username}
                </span>

                {isProfileOpen && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(255,100,0,0.5)]" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 bg-card/95 backdrop-blur-xl border-primary/10 rounded-xl shadow-2xl p-4 space-y-4"
            >
              <div className="space-y-1">
                {isEditingUsername ? (
                  <div className="flex items-center gap-2 text-primary w-full">
                    <Input
                      className="font-bold text-lg h-8 bg-black/20 border-primary/20"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveUsername();
                        if (e.key === "Escape") setIsEditingUsername(false);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSaveUsername}
                      disabled={isChecking}
                      className="h-6 w-6 text-primary hover:text-primary cursor-pointer shrink-0"
                    >
                      {isChecking ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <AnimeCheckIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-primary">
                    <p className="font-bold text-lg">{user.username}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setNewUsername(user.username ?? "");
                        setIsEditingUsername(true);
                      }}
                      className="h-6 w-6 text-muted-foreground hover:text-primary cursor-pointer"
                    >
                      <AnimePenIcon className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                <p
                  className="text-xs text-muted-foreground truncate"
                  title={user.email}
                >
                  {user.email}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-bacakground/5">
                <span className="text-sm text-muted-foreground">Energy</span>
                <span className="font-mono font-bold text-accent-foreground flex items-center gap-2">
                  {user.energy ?? 0}{" "}
                  <AnimeEnergyIcon className="w-4 h-4 text-accent-foreground" />
                </span>
              </div>

              <Button
                variant="destructive"
                onClick={() => void signOut()}
                className="w-full font-bold tracking-wider"
              >
                SIGN OUT
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button className="font-bold tracking-wider px-6">LOG IN</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
