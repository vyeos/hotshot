"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AnimeEnergyIcon,
  AnimeCrownIcon,
  AnimeMedalIcon,
  AnimeTimerIcon,
} from "@/components/ui/AnimeIcons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getDropTitleGradient } from "@/lib/gradients";

export default function LeaderboardPage() {
  const dailyDrop = useQuery(api.daily_drops.getDailyDrop);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  if (dailyDrop === undefined) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (dailyDrop === null || dailyDrop.images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4 space-y-4">
        <h1 className="text-4xl font-black text-muted-foreground">
          NO DROP ACTIVE
        </h1>
        <p className="text-xl">Leaderboard is closed.</p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  const tributes = dailyDrop.userState?.tributes ?? {};
  const votedImageIds = new Set(Object.keys(tributes));
  const isCompleted = dailyDrop.images.every((img) =>
    votedImageIds.has(img._id),
  );

  if (!isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <AnimeCrownIcon className="w-24 h-24 text-muted-foreground relative z-10" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-4xl font-black italic tracking-tighter">
            LOCKED
          </h1>
          <p className="text-xl text-muted-foreground">
            You must complete today's drop to access availability to the Global
            Leaderboard.
          </p>
        </div>
        <Link href="/">
          <Button
            size="lg"
            className="font-bold tracking-widest text-lg shadow-xl shadow-primary/20"
          >
            VOTE NOW
          </Button>
        </Link>
      </div>
    );
  }

  const sortedImages = [...dailyDrop.images].sort(
    (a, b) => b.total_tributes - a.total_tributes,
  );
  const [first, second, third, ...rest] = sortedImages;

  return (
    <div className="container mx-auto px-4 py-8 pb-20 min-h-screen">
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary/20 border border-secondary text-sm font-mono text-secondary-foreground mb-4">
          <AnimeTimerIcon className="w-4 h-4" />
          <span>Next Drop In: {timeLeft}</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-accent-foreground to-accent-foreground/60 drop-shadow-2xl">
          LEADERBOARD
        </h1>
        <p className="text-xl font-bold text-primary/80">
          Global Rankings for{" "}
          <span
            className={cn(
              "font-black italic text-transparent bg-clip-text pr-2",
              getDropTitleGradient(dailyDrop.images.length),
            )}
          >
            {dailyDrop.title}
          </span>
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 my-24 px-4">
        {/* 2nd Place */}
        {second && (
          <div className="order-2 md:order-1 flex flex-col items-center w-full md:w-1/3 max-w-75">
            <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden border-4 border-slate-400 bg-slate-400/10 shadow-[0_0_30px_rgba(148,163,184,0.3)] group hover:-translate-y-2 transition-transform duration-300">
              <img
                src={second.url!}
                alt="2nd Place"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2 left-2 bg-slate-400 text-black font-black px-3 py-1 rounded text-sm shadow-lg flex items-center gap-1">
                <AnimeMedalIcon className="w-4 h-4" /> #2
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm p-3 text-center border-t border-slate-400/50">
                <div className="flex items-center justify-center gap-2 font-mono font-bold text-slate-300 text-xl">
                  {second.total_tributes}{" "}
                  <AnimeEnergyIcon className="w-5 h-5 text-slate-300" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {first && (
          <div className="order-1 md:order-2 flex flex-col items-center w-full md:w-1/3 max-w-85 z-10 -mt-8 md:-mt-12">
            <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden border-4 border-yellow-500 bg-yellow-500/10 shadow-[0_0_50px_rgba(234,179,8,0.5)] group hover:-translate-y-2 transition-transform duration-300 scale-105">
              <img
                src={first.url!}
                alt="1st Place"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-0 left-0 w-full bg-linear-to-b from-yellow-500/80 to-transparent p-4 flex justify-center">
                <AnimeCrownIcon className="w-12 h-12 text-yellow-100 drop-shadow-md" />
              </div>
              <div className="absolute top-4 left-4 bg-yellow-400 text-black font-black px-4 py-1 rounded text-lg shadow-lg">
                #1
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-yellow-500/90 backdrop-blur-sm p-4 text-center border-t border-yellow-400">
                <div className="flex items-center justify-center gap-2 font-mono font-black text-black text-3xl">
                  {first.total_tributes}{" "}
                  <AnimeEnergyIcon className="w-7 h-7 text-black" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {third && (
          <div className="order-3 flex flex-col items-center w-full md:w-1/3 max-w-75">
            <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden border-4 border-amber-700 bg-amber-700/10 shadow-[0_0_30px_rgba(180,83,9,0.3)] group hover:-translate-y-2 transition-transform duration-300">
              <img
                src={third.url!}
                alt="3rd Place"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2 left-2 bg-amber-700 text-white font-black px-3 py-1 rounded text-sm shadow-lg flex items-center gap-1">
                <AnimeMedalIcon className="w-4 h-4" /> #3
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm p-3 text-center border-t border-amber-700/50">
                <div className="flex items-center justify-center gap-2 font-mono font-bold text-amber-600 text-xl">
                  {third.total_tributes}{" "}
                  <AnimeEnergyIcon className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rest of the List */}
      {rest.length > 0 && (
        <div className="max-w-6xl mx-auto space-y-8">
          <h3 className="text-3xl font-black italic text-center mb-8 text-muted-foreground tracking-widest">
            HONORABLE MENTIONS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rest.map((img, idx) => (
              <div
                key={img._id}
                className="group relative flex flex-col rounded-xl overflow-hidden bg-secondary/10 border border-primary/5 hover:bg-secondary/20 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="absolute top-2 left-2 z-10 bg-primary px-3 py-1 rounded text-sm font-black text-primary-foreground">
                  #{idx + 4}
                </div>

                <div className="relative w-full aspect-3/4 overflow-hidden">
                  <img
                    src={img.url!}
                    alt={`Rank ${idx + 4}`}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-3 bg-background/80 backdrop-blur-sm border-t border-primary/5">
                  <div className="flex items-center justify-center gap-2 font-mono font-bold text-lg text-accent-foreground">
                    {img.total_tributes} <AnimeEnergyIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
