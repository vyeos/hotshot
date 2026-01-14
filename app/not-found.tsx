"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 text-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/404a.jpg"
          alt="Anime Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      <h1 className="mb-2 text-6xl font-black text-primary tracking-tighter drop-shadow-lg">
        404
      </h1>
      <h2 className="mb-6 text-2xl font-bold bg-linear-to-r from-primary to-purple-400 bg-clip-text text-transparent drop-shadow-md">
        Gomenasai!
      </h2>

      <p className="mb-8 max-w-md text-foreground font-medium drop-shadow-sm">
        It seems you have lost your way... This page does not exist in this
        timeline.
      </p>

      <Button
        onClick={() => router.push("/")}
        size="lg"
        className="group shadow-lg"
      >
        Return Home
      </Button>
    </div>
  );
}
