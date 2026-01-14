"use client";

import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { cn } from "@/lib/utils";
import { getDropTitleGradient, getDropImageGlow } from "@/lib/gradients";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Drops = () => {
  const dailyDrop = useQuery(api.daily_drops.getDailyDrop);
  const giveTribute = useMutation(api.daily_drops.giveTribute);

  const [tributeAmount, setTributeAmount] = useState<string>("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine which images have been voted on
  const votedImageIds = new Set(dailyDrop?.userState?.votedImageIds ?? []);

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
      alert("Not enough energy!");
      return;
    }

    setIsSubmitting(true);
    try {
      await giveTribute({
        imageId: currentVotingImage._id,
        amount: amount,
      });
      setTributeAmount("1");
    } catch (error) {
      console.error("Failed to give tribute:", error);
      alert("Failed to give tribute. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <p className="text-xl font-bold tracking-widest uppercase">
          No Drops Today
        </p>
        <p className="text-sm">Check back later, Senpai!</p>
      </div>
    );
  }

  const hasEnergy = (dailyDrop.userState?.energy ?? 0) > 0;
  const showVoting = !isCompleted && hasEnergy;

  if (showVoting && currentVotingImage) {
    return (
      <div className="max-w-md mx-auto space-y-6 pt-10">
        <div className="text-center space-y-2">
          <h2
            className={cn(
              "text-3xl font-black italic tracking-tighter text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]",
              getDropTitleGradient(dailyDrop.images.length),
            )}
          >
            {dailyDrop.title}
          </h2>
          <p className="text-muted-foreground text-sm">
            Image {firstUnvotedIndex + 1} of {dailyDrop.images.length}
          </p>
        </div>

        <div className="relative rounded-xl overflow-hidden border-2 border-white/5 bg-black/20 shadow-xl flex justify-center">
          <img
            src={currentVotingImage.url ?? ""}
            alt={`Drop ${firstUnvotedIndex + 1}`}
            className="h-[60vh] w-auto max-w-full object-contain"
          />
        </div>

        <div className="space-y-4 p-4 bg-secondary/10 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Your Energy</span>
            <span className="font-mono font-bold text-yellow-400">
              {dailyDrop.userState?.energy ?? 0} ⚡
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              type="number"
              min="1"
              max={dailyDrop.userState?.energy ?? 1}
              value={tributeAmount}
              onChange={(e) => setTributeAmount(e.target.value)}
              className="font-mono text-center text-2xl h-14 bg-black/50 border-white/10 w-full"
            />
            <Button
              onClick={handleTribute}
              disabled={isSubmitting}
              className="w-full font-bold tracking-wide h-12"
            >
              {isSubmitting ? "CUMMING..." : "GIVE TRIBUTE"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Gallery / Completed View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
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
            <p className="px-2 text-xs text-green-400 font-mono mt-1">
              You reviewed today's drop!
            </p>
          )}
          {!isCompleted && !hasEnergy && (
            <p className="px-2 text-xs text-red-400 font-mono mt-1">
              Out of energy. Come back tomorrow!
            </p>
          )}
        </div>

        <div className="text-xs font-mono text-muted-foreground border border-white/10 px-2 py-1 rounded">
          {dailyDrop.date}
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
                      "border-white/5 bg-black/20",
                    )
                  : "grayscale opacity-60 border-white/5 bg-black/50 hover:opacity-100",
              )}
            >
              <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                #{idx + 1}
              </div>

              {isVoted && (
                <div className="absolute top-2 right-2 z-10 bg-green-500/20 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-green-400 border border-green-500/50">
                  Voted
                </div>
              )}

              <img
                src={img.url ?? ""}
                alt={`Drop ${idx + 1}`}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute bottom-0 left-0 w-full p-4 bg-linear-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white">Tributes</span>
                  <span
                    className={cn(
                      "font-mono",
                      isVoted ? "text-yellow-400" : "text-gray-400",
                    )}
                  >
                    {img.total_tributes}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center py-8 text-center text-xl font-bold text-white/80">
        {isCompleted
          ? "New drop will come tomorrow."
          : "Get more energy to continue voting or wait for tomorrow for new drops!"}
      </div>
    </div>
  );
};

export default Drops;
