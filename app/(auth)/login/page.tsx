"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  const handleLogin = () => {};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8 bg-card border border-border rounded-xl shadow-lg p-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Getting horny again huh!
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back to the platform
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="getting there"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
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
              id="password"
              placeholder="your secret"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <Button
            onClick={handleLogin}
            className="w-full font-semibold"
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
    </div>
  );
};

export default page;
