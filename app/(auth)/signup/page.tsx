"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useState } from "react";

const page = () => {
  const [isToggled, setIsToggled] = useState(true);

  const handleSignup = () => {};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4">
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
              className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div
            className={`flex items-center justify-between border p-4 ${isToggled && "bg-primary/20"}`}
          >
            <div className="space-y-0.5">
              <label htmlFor="hashing" className="text-sm font-medium">
                Password Hashing
              </label>
              <p className="text-xs text-muted-foreground">
                I won't be able to see your password if this is on
              </p>
            </div>
            <Switch
              checked={isToggled}
              onCheckedChange={() => setIsToggled(!isToggled)}
              id="hashing"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="your secret"
                className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium leading-none"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="confirm your secret"
                className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <Button
            className="w-full font-semibold"
            size="lg"
            onClick={handleSignup} // Uncomment when logic is ready
          >
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
    </div>
  );
};

export default page;
