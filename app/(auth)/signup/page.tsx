"use client";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useForm } from "@tanstack/react-form";
import {
  AnimeGithubIcon,
  AnimeGoogleIcon,
  AnimeAlert,
  AnimeEye,
  AnimeEyeOff,
  AnimeLoaderIcon,
} from "@/components/ui/AnimeIcons";
import Link from "next/link";
import { useState } from "react";
import z from "zod";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const page = () => {
  const [isShaking, setIsShaking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const { signIn } = useAuthActions();
  const convex = useConvex();
  const router = useRouter();

  const handlePasswordSignup = async (formData: any) => {
    setIsLoading(true);
    setErrors("");
    try {
      await signIn("password", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        username: formData.username,
        flow: "signUp",
      });
      router.push("/");
    } catch (error) {
      setIsLoading(false);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setErrors("Error creating account");
    }
  };

  const handleProviderSignup = (provider: "github" | "google") => {
    void signIn(provider);
  };

  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await handlePasswordSignup(value);
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4">
      <div
        className={`w-full max-w-md space-y-8 bg-card border border-border rounded-xl shadow-lg p-8 ${isShaking && "animate-shake"} ${errors && "border-destructive"}`}
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Get ready to see the most innocent website ever
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleProviderSignup("github")}
            className="flex items-center justify-center gap-2 w-full"
          >
            <AnimeGithubIcon className="w-5 h-5" />
            <span>GitHub</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleProviderSignup("google")}
            className="flex items-center justify-center gap-2 w-full"
          >
            <AnimeGoogleIcon className="w-5 h-5" />
            <span>Google</span>
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.Field
            name="name"
            validators={{
              onChange: z.string().min(2, "Name must be at least 2 characters"),
            }}
            children={(field) => (
              <div className="space-y-2">
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="Waifu Lover"
                  id={field.name}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setErrors("");
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-xs font-medium pl-1">
                    {field.state.meta.errors
                      .map((err: any) => err.message || err)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="username"
            validators={{
              onChange: z
                .string()
                .min(3, "Username must be at least 3 characters")
                .max(20, "Username must be at most 20 characters")
                .regex(
                  /^[a-zA-Z0-9_]+$/,
                  "Only letters, numbers, and underscores allowed",
                ),
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                if (!value) return undefined;
                const isTaken = await convex.query(api.users.isUsernameTaken, {
                  username: value,
                });
                return isTaken ? "Username is already taken" : undefined;
              },
            }}
            children={(field) => (
              <div className="space-y-2">
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Username
                </label>
                <input
                  type="text"
                  placeholder="anime_lover_69"
                  id={field.name}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setErrors("");
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-xs font-medium pl-1">
                    {field.state.meta.errors
                      .map((err: any) => err.message || err)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
          />

          <form.Field
            name="email"
            validators={{
              onChange: z.string().email("Invalid email address"),
            }}
            children={(field) => (
              <div className="space-y-2">
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  id={field.name}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setErrors("");
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-xs font-medium pl-1">
                    {field.state.meta.errors
                      .map((err: any) => err.message || err)
                      .join(", ")}
                  </p>
                )}
              </div>
            )}
          />

          <div className="space-y-4">
            <form.Field
              name="password"
              validators={{
                onChange: z
                  .string()
                  .min(8, "Password must be at least 8 characters")
                  .regex(/[A-Z]/, "Must contain an uppercase letter")
                  .regex(/[0-9]/, "Must contain a number")
                  .regex(/[^a-zA-Z0-9]/, "Must contain a special character"),
              }}
              children={(field) => (
                <div className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium leading-none"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="your secret"
                      id={field.name}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        setErrors("");
                      }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <AnimeEyeOff className="h-4 w-4" />
                      ) : (
                        <AnimeEye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <ul className="text-destructive text-xs font-medium list-disc pl-4">
                      {field.state.meta.errors.map((err: any, i: number) => (
                        <li key={i}>
                          {typeof err === "string" ? err : err.message}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            />
          </div>

          {errors && (
            <div className="animate-in slide-in-from-left-2 fade-in duration-300 flex items-center gap-3 rounded-lg bg-destructive/15 p-4 text-destructive">
              <AnimeAlert className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{errors}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full font-semibold"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <AnimeLoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                Almost there...
              </>
            ) : (
              "Warm up your hands now"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already a fan?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
