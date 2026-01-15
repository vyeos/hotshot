"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "./ui/button";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AnimeDropsIcon,
  AnimeVaultIcon,
  AnimeLeaderboardIcon,
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

  const form = useForm({
    defaultValues: {
      username: user?.username ?? "",
    },
    onSubmit: async ({ value }) => {
      const { username } = value;

      try {
        const isTaken = await convex.query(api.users.isUsernameTaken, {
          username,
        });

        if (isTaken && username !== user?.username) {
          form.setFieldMeta("username", (prev) => ({ ...prev, errorMap: { onChange: "Username is already taken" } }));
          return;
        }

        await setUsername({ username });
        setIsEditingUsername(false);
      } catch (error) {
        console.error("Failed to update username:", error);
        form.setFieldMeta("username", (prev) => ({ ...prev, errorMap: { onChange: "Failed to update. Try again." } }));
      }
    },
  });

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const navLinks: NavLinkProps[] = [
    {
      name: "DROPS",
      url: "/",
      icon: <AnimeDropsIcon className="w-6 h-6" />,
    },
    {
      name: "VAULT",
      url: "/vault",
      icon: <AnimeVaultIcon className="w-6 h-6" />,
    },
    {
      name: "LEADERBOARD",
      url: "/leaderboard",
      icon: <AnimeLeaderboardIcon className="w-6 h-6" />,
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
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}
                    className="w-full"
                  >
                    <form.Field
                      name="username"
                      validators={{
                        onChange: z
                          .string()
                          .min(3, "Min 3 characters")
                          .max(20, "Max 20 characters")
                          .regex(
                            /^[a-zA-Z0-9_]+$/,
                            "Only letters, numbers, _",
                          ),
                      }}
                      children={(field) => (
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center gap-2 text-primary w-full">
                            <Input
                              className={cn(
                                "font-bold text-lg h-8 bg-black/20 border-primary/20",
                                field.state.meta.errors.length > 0 &&
                                "border-destructive",
                              )}
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Escape")
                                  setIsEditingUsername(false);
                              }}
                            />
                            <form.Subscribe
                              selector={(state) => [
                                state.canSubmit,
                                state.isSubmitting,
                              ]}
                              children={([canSubmit, isSubmitting]) => (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  type="submit"
                                  disabled={!canSubmit || isSubmitting}
                                  className="h-6 w-6 text-primary hover:text-primary cursor-pointer shrink-0"
                                >
                                  {isSubmitting ? (
                                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  ) : (
                                    <AnimeCheckIcon className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            />
                          </div>
                          {field.state.meta.errors.length > 0 ? (
                            <ul className="text-destructive text-xs ml-4 list-disc">
                              {field.state.meta.errors.map((error, i) => (
                                <li key={i}>
                                  {typeof error === "object" &&
                                    error !== null &&
                                    "message" in error
                                    ? (error as any).message
                                    : String(error)}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      )}
                    />
                  </form>
                ) : (
                  <div className="flex items-center gap-2 text-primary">
                    <p className="font-bold text-lg">{user.username}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        form.setFieldValue("username", user.username ?? "");
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
