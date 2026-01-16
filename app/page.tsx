"use client";

import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { cn } from "@/lib/utils";
import { getDropTitleGradient, getDropImageGlow } from "@/lib/gradients";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimeEnergyIcon } from "@/components/ui/AnimeIcons";
import { MorphingText } from "@/components/ui/morphing-text";
import Link from "next/link";

const Page = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const dailyDrop = useQuery(api.daily_drops.getDailyDrop);
  const giveTribute = useMutation(api.daily_drops.giveTribute);

  const [tributeAmount, setTributeAmount] = useState<string>("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lowEnergyError, setLowEnergyError] = useState(false);

  // Determine which images have been voted on
  const tributes = dailyDrop?.userState?.tributes ?? {};
  const votedImageIds = new Set(Object.keys(tributes));

  // Find the first unvoted image index
  const firstUnvotedIndex =
    dailyDrop?.images.findIndex((img) => !votedImageIds.has(img._id)) ?? -1;
  const isCompleted = firstUnvotedIndex === -1;

  const currentVotingImage =
    !isCompleted && dailyDrop ? dailyDrop.images[firstUnvotedIndex] : null;

  const handleTribute = async () => {
    if (!dailyDrop || !currentVotingImage || !dailyDrop.userState) return;

    const amount = parseInt(tributeAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (dailyDrop.userState.energy < amount) {
      setLowEnergyError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await giveTribute({
        imageId: currentVotingImage._id,
        amount: amount,
      });
      setTributeAmount("1");
      setLowEnergyError(false);
    } catch (error) {
      console.error("Failed to give tribute:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary flex items-center justify-center">
          <div className="h-2 w-2 bg-primary rounded-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <AnimeEnergyIcon className="w-24 h-24 text-muted-foreground relative z-10" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-4xl font-black italic tracking-tighter text-primary">
            LOCKED
          </h1>
          <p className="text-xl text-muted-foreground">
            Please sign in to view today's specific drop and vote for your waifu!
          </p>
        </div>
      </div>
    );
  }

  if (dailyDrop === undefined) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary flex items-center justify-center">
          <div className="h-2 w-2 bg-primary rounded-full" />
        </div>
      </div>
    );
  }

  if (dailyDrop === null) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p className="text-4xl font-black tracking-widest uppercase text-primary mb-4">
          No Drops Yet
        </p>
        <p className="text-xl font-medium text-primary/80">
          Check back later, Senpai!
        </p>
      </div>
    );
  }

  if (dailyDrop.images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground px-4 text-center">
        <p className="text-4xl font-black tracking-widest uppercase text-destructive mb-4">
          No Drop Today
        </p>
        <p className="text-xl font-medium text-primary/80">
          A release will come tomorrow!
        </p>
      </div>
    );
  }

  const hasEnergy = (dailyDrop.userState?.energy ?? 0) > 0;
  const showVoting = !isCompleted && hasEnergy;

  if (showVoting && currentVotingImage) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pt-10 px-4">
        <div className="text-center space-y-2">
          <h2
            className={cn(
              "text-3xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]",
              getDropTitleGradient(dailyDrop.images.length),
            )}
          >
            {dailyDrop.title}
          </h2>
          <p className="text-muted-foreground text-sm">
            Image {firstUnvotedIndex + 1} of {dailyDrop.images.length}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="relative rounded-xl overflow-hidden border-2 border-primary/5 bg-background/20 shadow-xl flex justify-center flex-1 w-full max-w-3xl">
            <img
              src={currentVotingImage.url ?? ""}
              alt={`Drop ${firstUnvotedIndex + 1}`}
              className="h-[50vh] lg:h-[70vh] w-auto max-w-full object-contain"
            />
          </div>

          <div className="space-y-4 p-6 bg-secondary/10 rounded-xl border border-primary/5 w-full lg:w-96 shrink-0 lg:sticky lg:top-24 backdrop-blur-sm">
            <div className="flex justify-between items-center text-sm border-b border-primary/5 pb-4">
              <span className="text-muted-foreground font-medium">Your Energy</span>
              <span className="font-mono font-bold text-accent-foreground flex items-center gap-2 text-lg">
                {dailyDrop.userState?.energy ?? 0}{" "}
                <AnimeEnergyIcon className="w-5 h-5" />
              </span>
            </div>

            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Tribute Amount</label>
                <Input
                  type="number"
                  min="1"
                  max={dailyDrop.userState?.energy ?? 1}
                  value={tributeAmount}
                  onChange={(e) => {
                    setTributeAmount(e.target.value);
                    setLowEnergyError(false);
                  }}
                  className="font-mono text-center text-3xl h-16 bg-background/50 border-primary/10 w-full focus:border-primary/50 transition-colors"
                />
              </div>
              <Button
                onClick={handleTribute}
                disabled={isSubmitting}
                className={cn(
                  "w-full font-black tracking-widest h-14 text-lg shadow-lg transition-all active:scale-[0.98]",
                  lowEnergyError
                    ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-destructive/20"
                    : "shadow-primary/20 hover:scale-[1.02]"
                )}
              >
                {isSubmitting ? (
                  "CUMMING..."
                ) : (
                  <MorphingText className="font-black tracking-widest">
                    {lowEnergyError ? "NOT ENOUGH ENERGY!" : "GIVE TRIBUTE"}
                  </MorphingText>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Gallery / Completed View
  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-primary/10 pb-4">
        <div>
          <h2
            className={cn(
              "px-2 text-3xl font-black italic tracking-tighter text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]",
              getDropTitleGradient(dailyDrop.images.length),
            )}
          >
            {dailyDrop.title}
          </h2>
          {isCompleted && (
            <p className="px-2 text-xs text-green-500 font-mono mt-1">
              You reviewed today's drop!
            </p>
          )}
          {!isCompleted && !hasEnergy && (
            <p className="px-2 text-xs text-destructive font-mono mt-1">
              Out of energy. Come back tomorrow!
            </p>
          )}
        </div>

        <div className="text-xl font-mono font-bold text-primary border border-primary/20 px-3 py-1 rounded bg-primary/5">
          {dailyDrop.date.split("-").reverse().join("-")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {dailyDrop.images.map((img, idx) => {
          const isVoted = votedImageIds.has(img._id);
          return (
            <div
              key={img._id}
              className={cn(
                "group relative rounded-xl overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1",
                isVoted
                  ? cn(
                    getDropImageGlow(dailyDrop.images.length),
                    "border-primary/5 bg-background/20",
                  )
                  : "grayscale opacity-60 border-primary/5 bg-background/50 hover:opacity-100",
              )}
            >
              <div className="absolute top-2 left-2 z-10 bg-background/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-primary border border-primary/10">
                #{idx + 1}
              </div>

              {isVoted && (
                <div className="absolute top-2 right-2 z-10 bg-green-500/20 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-green-500 border border-green-500/50">
                  Voted
                </div>
              )}

              <img
                src={img.url ?? ""}
                alt={`Drop ${idx + 1}`}
                className="w-full h-96 object-contain transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute bottom-0 left-0 w-full p-4 font-bold bg-linear-to-t from-background/90 to-background/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-primary">
                    My Tributes
                  </span>
                  <span
                    className={cn(
                      "font-mono",
                      isVoted ? "text-accent-foreground" : "text-gray-400",
                    )}
                  >
                    {dailyDrop.userState?.tributes?.[img._id] ?? 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center py-8 text-center text-xl font-bold text-primary/80">
        {isCompleted ? (
          <div className="space-y-4">
            <p className="text-primary">New drop will come tomorrow.</p>
            <Link href="/leaderboard">
              <Button
                size="lg"
                className="font-black tracking-widest text-lg shadow-xl shadow-accent/20 bg-accent hover:bg-accent/90 text-accent-foreground border-2 border-accent hover:scale-105 transition-transform"
              >
                VIEW LEADERBOARD
              </Button>
            </Link>
          </div>
        ) : (
          "Get more energy to continue voting or wait for tomorrow for new drops!"
        )}
      </div>
    </div>
  );
};

export default Page;
