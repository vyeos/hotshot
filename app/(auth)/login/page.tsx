"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";

const page = () => {
  const [isShaking, setIsShaking] = useState(false);
  const [errors, setErrors] = useState("");
  const convex = useConvex();

  const handleSubmit = async (username: string, password: string) => {
    if (!username.trim() || !password.trim()) {
      setErrors("Write some shit");
      return;
    }
    try {
      const user = await convex.action(api.auth.login, {
        username,
        password,
      });

      if (!user) {
        setErrors("Invalid Credentials");
        return;
      }
      console.log(user);
    } catch (error) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      if (error instanceof ConvexError) {
        setErrors(error.data);
      } else {
        setErrors("Something went wrong. Please try again.");
      }
    }
  };

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        username: z.string(),
        password: z.string(),
      }),
    },
    onSubmit: ({ value }) => {
      handleSubmit(value.username, value.password);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4"
    >
      <div
        className={`w-full max-w-md space-y-8 bg-card border border-border rounded-xl shadow-lg p-8 ${isShaking && "animate-shake"} ${errors && "border-destructive"}`}
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Getting horny again huh!
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back to the platform
          </p>
        </div>

        <div className="space-y-6">
          <form.Field
            name="username"
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
                  placeholder="getting there"
                  id={field.name}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setErrors("");
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            )}
          />

          <div className="space-y-2">
            <form.Field
              name="password"
              children={(field) => (
                <>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-muted-foreground hover:text-primary"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    placeholder="your secret"
                    id={field.name}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      setErrors("");
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </>
              )}
            />
          </div>

          {errors && (
            <div className="animate-in slide-in-from-left-2 fade-in duration-300 flex items-center gap-3 rounded-lg bg-destructive/15 p-4 text-destructive">
              <TriangleAlert className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{errors}</p>
            </div>
          )}

          <Button
            type="submit"
            className={`w-full font-semibold ${errors && "border border-destructive"}`}
            size="lg"
          >
            Back to business
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Become a fan of the website?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default page;
