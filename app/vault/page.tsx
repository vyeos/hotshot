"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimeEnergyIcon, AnimeSleepIcon, AnimeCloseIcon, AnimeTrophyIcon } from "@/components/ui/AnimeIcons";
import { cn } from "@/lib/utils";
import { getDropTitleGradient } from "@/lib/gradients";

export default function VaultPage() {
  const vaultDrops = useQuery(api.daily_drops.getVault);
  type VaultDrop = NonNullable<typeof vaultDrops>[number];
  const [selectedDrop, setSelectedDrop] = useState<VaultDrop | null>(null);

  if (vaultDrops === undefined) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-primary to-primary/50 drop-shadow-2xl">
          THE VAULT
        </h1>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
          Relive the glory of past beauties. Witness the waifus who captured our
          hearts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vaultDrops.map((drop) => (
          <div
            key={drop._id}
            onClick={() => setSelectedDrop(drop)}
            className="group cursor-pointer"
          >
            <Card className="h-full bg-background/40 border-primary/5 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
              <div className="relative aspect-3/4 overflow-hidden bg-secondary/10">
                {drop.winner ? (
                  <>
                    <img
                      src={drop.winner.url!}
                      alt={drop.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      <div className="flex items-center justify-start gap-2 text-accent-foreground">
                        <span className="font-mono font-bold text-lg">
                          {drop.winner.total_tributes}
                        </span>
                        <AnimeEnergyIcon className="w-5 h-5" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center space-y-2">
                    <AnimeSleepIcon className="w-16 h-16 text-muted-foreground/50" />
                    <span className="font-bold uppercase tracking-widest text-sm">
                      Skipped
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-1">
                <p className="text-xs font-mono text-primary font-bold tracking-wider uppercase">
                  {drop.date.split("-").reverse().join("-")}
                </p>
                <h3 className="font-bold text-xl text-primary line-clamp-1 group-hover:text-primary transition-colors">
                  {drop.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {drop.images.length} Images • {drop.totalDropTributes} Total
                  Tributes
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {selectedDrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-background/50 backdrop-blur-lg cursor-pointer"
            onClick={() => setSelectedDrop(null)}
          />

          <div className="relative w-full max-w-6xl max-h-[90vh] bg-background/50 border border-primary/10 overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-primary/10 bg-background/40 backdrop-blur-md z-10 shrink-0">
              <div>
                <h2
                  className={cn(
                    "pr-4 text-3xl font-black italic tracking-tighter text-transparent bg-clip-text",
                    getDropTitleGradient(selectedDrop.images.length),
                  )}
                >
                  {selectedDrop.title}
                </h2>
                <p className="text-primary font-mono text-md font-semibold">
                  {selectedDrop.date.split("-").reverse().join("-")}
                </p>
              </div>
              <button
                onClick={() => setSelectedDrop(null)}
                className="p-2 rounded-full hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <AnimeCloseIcon className="w-6 h-6 text-primary" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 lg:p-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {selectedDrop.images.map((img: any, idx: number) => {
                  const isWinner = selectedDrop.winner?._id === img._id;

                  return (
                    <div
                      key={img._id}
                      className={cn(
                        "relative group rounded-xl overflow-hidden border-2 transition-all duration-300",
                        isWinner
                          ? "border-accent/50 bg-accent/5 shadow-xl shadow-accent/10 scale-105 md:col-span-2 md:row-span-2"
                          : "border-primary/5 bg-background/20 hover:border-primary/20",
                      )}
                    >
                      {isWinner && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-accent text-accent-foreground font-black px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
                          <AnimeTrophyIcon className="w-4 h-4 fill-accent-foreground text-accent-foreground" />
                          WHITE FACED
                        </div>
                      )}

                      <div
                        className={cn(
                          "relative w-full",
                          isWinner ? "h-100" : "h-60",
                        )}
                      >
                        <img
                          src={img.url}
                          alt={`Image ${idx + 1}`}
                          className="w-full h-full object-contain bg-background/50"
                        />
                      </div>

                      <div className="absolute bottom-0 left-0 w-full px-4 py-2 bg-accent/60">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary uppercase tracking-widest">
                            #{idx + 1}
                          </span>
                          <div className="flex items-center gap-2 text-accent-foreground">
                            <span
                              className={cn("font-mono font-bold text-xl ")}
                            >
                              {img.total_tributes}
                            </span>
                            <AnimeEnergyIcon className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
