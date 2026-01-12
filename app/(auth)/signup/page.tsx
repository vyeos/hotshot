"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import { useForm } from "@tanstack/react-form";
import { useConvex } from "convex/react";
import Link from "next/link";
import z from "zod";

const page = () => {
  const convex = useConvex();

  const handleSubmit = async (
    username: string,
    shouldHash: boolean,
    password: string,
    confirm: string,
  ) => {
    // if (!username.trim() || !password.trim()) {
    //   alert("Write some shit");
    //   return;
    // }
    // try {
    //   const user = await convex.query(api.users.getUser, {
    //     username,
    //     password,
    //   });
    //
    //   if (!user) {
    //     alert("Invalid Credentials");
    //     return;
    //   }
    //   console.log(user);
    // } catch (error) {
    //   console.error("Login failed:", error);
    // }
  };

  const form = useForm({
    defaultValues: {
      username: "",
      shouldHash: true,
      password: "",
      confirm: "",
    },
    validators: {
      onChange: z.object({
        username: z.string(),
        shouldHash: z.boolean(),
        password: z.string(),
        confirm: z.string(),
      }),
    },
    onSubmit: ({ value }) => {
      handleSubmit(
        value.username,
        value.shouldHash,
        value.password,
        value.confirm,
      );
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
      <div className="w-full max-w-md space-y-8 bg-card border border-border shadow-lg p-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Get ready to see the most innocent website ever
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
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            )}
          />

          <form.Field
            name="shouldHash"
            children={(field) => (
              <div
                className={`flex items-center justify-between border p-4 ${field.state.value && "bg-primary/20"}`}
              >
                <div className="space-y-0.5">
                  <label htmlFor={field.name} className="text-sm font-medium">
                    Password Hashing
                  </label>
                  <p className="text-xs text-muted-foreground">
                    I won't be able to see your password if this is on
                  </p>
                </div>
                <Switch
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                  id={field.name}
                />
              </div>
            )}
          />

          <div className="space-y-4">
            <form.Field
              name="password"
              children={(field) => (
                <div className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium leading-none"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="your secret"
                    id={field.name}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              )}
            />

            <form.Field
              name="confirm"
              children={(field) => (
                <div className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="text-sm font-medium leading-none"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="confirm your secret"
                    id={field.name}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              )}
            />
          </div>

          <Button type="submit" className="w-full font-semibold" size="lg">
            Warm up your hands now
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
        </div>
      </div>
    </form>
  );
};

export default page;
