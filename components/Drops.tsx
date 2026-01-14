"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { cn } from "@/lib/utils";
import { getDropTitleGradient } from "@/lib/gradients";

const Drops = () => {
  const dailyDrop = useQuery(api.daily_drops.getDailyDrop);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2
          className={cn(
            "text-3xl font-black italic tracking-tighter text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]",
            getDropTitleGradient(dailyDrop.images.length),
          )}
        >
          {dailyDrop.title}
        </h2>
        <div className="text-xs font-mono text-muted-foreground border border-white/10 px-2 py-1 rounded">
          {dailyDrop.date}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dailyDrop.images.map((img, idx) => (
          <div
            key={img._id}
            className="group relative aspect-4/5 rounded-xl overflow-hidden border-2 border-white/5 bg-black/20 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:-translate-y-1"
          >
            <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
              #{idx + 1}
            </div>

            <img
              src={img.url ?? ""}
              alt={`Drop ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drops;
