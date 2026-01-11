"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  const handleSignup = () => {};

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center justify-center p-4 bg-card border border-border">
        <h1 className="font-bold text-lg border-b">
          Get Ready to see the most innocent website ever
        </h1>
        <div className="flex items-center justify-center gap-2">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="getting there"
            className="border border-border p-1"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="your secret"
            className="border border-border p-1"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <label htmlFor="confirm-password">Password Again</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="confirm your secret"
            className="border border-border p-1"
          />
        </div>
        <Button onClick={handleSignup} className="text-lg font-semibold mt-2">
          Warm up your hands now
        </Button>
        <div className="flex items-center justify-center gap-2">
          <span>Already a fan of the website</span>
          <Link
            href="/login"
            className="bg-primary text-primary-foreground px-1"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
