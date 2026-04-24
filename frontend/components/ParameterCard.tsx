"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ParameterCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit: string;
  status?: "good" | "warning" | "bad";
  description?: string;
  limit?: {
    min?: number;
    max?: number;
    optimal?: [number, number];
  };
}

export default function ParameterCard({
  icon: Icon,
  label,
  value,
  unit,
  status = "good",
  description,
  limit,
}: ParameterCardProps) {
  const statusColors = {
    good: "text-fresh-600 bg-fresh-50 border-fresh-200",
    warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
    bad: "text-red-600 bg-red-50 border-red-200",
  };

  const iconColors = {
    good: "text-fresh-600",
    warning: "text-yellow-600",
    bad: "text-red-600",
  };

  return (
    <div className="data-card group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-lg transition-colors",
              statusColors[status]
            )}
          >
            <Icon className={cn("h-5 w-5", iconColors[status])} />
          </div>
          <div>
            <h3 className="font-mono font-medium text-earth-900">{label}</h3>
            {description && (
              <p className="text-xs text-earth-600 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-mono font-bold text-earth-900">
          {value}
        </span>
        <span className="text-lg text-earth-600 font-mono">{unit}</span>
      </div>

      {limit && (
        <div className="mt-3 pt-3 border-t border-water-100">
          <div className="text-xs text-earth-600 space-y-1">
            {limit.max && (
              <div className="flex justify-between">
                <span>Hygienický limit:</span>
                <span className="font-mono font-medium">
                  {limit.min && `${limit.min} - `}
                  {limit.max} {unit}
                </span>
              </div>
            )}
            {limit.optimal && (
              <div className="flex justify-between">
                <span>Optimální rozsah:</span>
                <span className="font-mono font-medium text-fresh-600">
                  {limit.optimal[0]} - {limit.optimal[1]} {unit}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
