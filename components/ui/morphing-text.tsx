"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface MorphingTextProps {
    children: string;
    className?: string;
    as?: React.ElementType;
}

export function MorphingText({
    children,
    className,
    as: Component = "span",
}: MorphingTextProps) {
    const [displayText, setDisplayText] = useState(children);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if (children !== displayText) {
            setIsTransitioning(true);

            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
                setDisplayText(children);
                setIsTransitioning(false);
            }, 300);
        }
    }, [children, displayText]);

    return (
        <Component
            className={cn(
                "transition-all duration-300 ease-in-out inline-block min-w-[fit-content]",
                isTransitioning ? "opacity-0 blur-sm scale-95" : "opacity-100 blur-0 scale-100",
                className
            )}
        >
            {displayText}
        </Component>
    );
}
