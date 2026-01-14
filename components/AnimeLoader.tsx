import React from "react";
import { AnimeEye } from "./AnimeIcons";

export function AnimeLoader({ className = "", size = "md" }: { className?: string, size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-16 h-16",
        lg: "w-32 h-32",
    };

    const containerSize = sizeClasses[size];

    return (
        <div className={`relative flex items-center justify-center ${containerSize} ${className}`}>
            {/* Outer Rotating Ring */}
            <div className="absolute inset-0 border-2 border-primary/30 border-t-primary rounded-full animate-spin" style={{ animationDuration: '3s' }} />

            {/* Middle Counter-Rotating Ring */}
            <div className="absolute inset-2 border-2 border-primary/20 border-b-primary rounded-full animate-spin-reverse" />

            {/* Center Pulsing Eye */}
            <div className="relative z-10 animate-pulse text-primary">
                <AnimeEye className={size === 'sm' ? "w-4 h-4" : size === 'md' ? "w-8 h-8" : "w-16 h-16"} />
            </div>

            {/* Decorative Particles (Optional, simple CSS dots) */}
            <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-caret-blink" />
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-caret-blink" />
            <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-caret-blink" />
            <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-caret-blink" />

            <style jsx>{`
        .animate-spin-reverse {
          animation: spin-reverse 4s linear infinite;
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
        </div>
    );
}

export function FullScreenLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <AnimeLoader size="lg" />
            <p className="mt-4 text-primary font-medium animate-pulse tracking-widest">LOADING</p>
        </div>
    );
}
