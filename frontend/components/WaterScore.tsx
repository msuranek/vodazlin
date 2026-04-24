"use client";

import { cn, getScoreColor, getScoreLabel } from "@/lib/utils";
import { Droplet } from "lucide-react";

interface WaterScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

export default function WaterScore({
  score,
  size = "lg",
  showLabel = true,
  animated = true,
}: WaterScoreProps) {
  const sizeClasses = {
    sm: "w-20 h-20",   // 80px - matches circleSize
    md: "w-28 h-28",   // 112px - matches circleSize
    lg: "w-44 h-44",   // 176px - matches circleSize
  };

  const textSizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  const circleSize = {
    sm: 80,
    md: 112,
    lg: 176,
  };

  const strokeWidth = {
    sm: 8,
    md: 10,
    lg: 12,
  };

  const radius = circleSize[size] / 2 - strokeWidth[size];
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Pozadí - vodní animace */}
        {animated && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-water-400/10 ripple"></div>
          </div>
        )}

        {/* SVG kruh */}
        <div className={cn("relative", sizeClasses[size])}>
          <svg
            className="transform -rotate-90"
            width={circleSize[size]}
            height={circleSize[size]}
          >
            {/* Pozadí kruhu */}
            <circle
              cx={circleSize[size] / 2}
              cy={circleSize[size] / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth[size]}
              fill="none"
              className="text-water-100"
            />
            {/* Progress kruh */}
            <circle
              cx={circleSize[size] / 2}
              cy={circleSize[size] / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth[size]}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={cn(
                getScoreColor(score),
                animated && "transition-all duration-1000 ease-out"
              )}
            />
          </svg>

          {/* Střed - skóre */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Droplet
              className={cn(
                "mb-1",
                size === "sm" && "h-6 w-6",
                size === "md" && "h-8 w-8",
                size === "lg" && "h-10 w-10",
                getScoreColor(score)
              )}
            />
            <span
              className={cn(
                "font-mono font-bold -ml-1",
                textSizeClasses[size],
                getScoreColor(score)
              )}
            >
              {score}
            </span>
          </div>
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <div className="text-center">
          <p
            className={cn(
              "font-mono font-bold",
              size === "sm" && "text-base",
              size === "md" && "text-lg",
              size === "lg" && "text-2xl",
              getScoreColor(score)
            )}
          >
            {getScoreLabel(score)}
          </p>
          <p className="text-sm text-earth-600 mt-1">Kvalita vody</p>
        </div>
      )}
    </div>
  );
}
