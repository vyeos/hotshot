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
} from "./ui/AnimeIcons";
import { useCurrentUser } from "./UserProvider";
import { useState } from "react";

interface NavLinkProps {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const Navbar = () => {
  const { signOut } = useAuthActions();
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
          <>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 group relative overflow-hidden",
                isProfileOpen
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-secondary/20 text-muted-foreground hover:text-foreground"
              )}
            >
              {isProfileOpen && (
                <div className="absolute inset-0 bg-primary/5 opacity-50 animate-pulse" />
              )}

              <span className={cn(
                "transition-transform duration-300",
                isProfileOpen ? "scale-110" : "group-hover:scale-110"
              )}>
                <AnimeUserIcon className="w-6 h-6" />
              </span>

              <span className="hidden md:inline-block font-semibold text-sm tracking-wide z-10 transition-transform duration-300">
                {user.username}
              </span>

              {isProfileOpen && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_rgba(255,100,0,0.5)]" />
              )}
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-card/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 p-4 space-y-4">
                <div className="space-y-1">
                  <p className="font-bold text-lg text-white">{user.username}</p>
                  <p className="text-xs text-muted-foreground truncate" title={user.email}>
                    {user.email}
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-white/5">
                  <span className="text-sm text-muted-foreground">Energy</span>
                  <span className="font-mono font-bold text-yellow-400">
                    {user.energy ?? 0} ⚡
                  </span>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => void signOut()}
                  className="w-full font-bold tracking-wider"
                >
                  SIGN OUT
                </Button>
              </div>
            )}
          </>
        ) : (
          <Link href="/login">
            <Button className="font-bold tracking-wider px-6">
              LOG IN
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
