"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ParameterCardProps {
  icon: LucideIcon;
  label: string;
  // Hodnoty pro jednotlivé úpravny (např. ÚV Tlumačov, ÚV Klečůvka).
  values: { label: string; value: string }[];
  unit: string;
  status?: "good" | "warning" | "bad";
  description?: string;
  limit?: { label: string; text: string };
}

export default function ParameterCard({
  icon: Icon,
  label,
  values,
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
          <div className={cn("p-2 rounded-lg transition-colors", statusColors[status])}>
            <Icon className={cn("h-5 w-5", iconColors[status])} />
          </div>
          <div>
            <h3 className="font-mono font-medium text-earth-900">{label}</h3>
            {description && <p className="text-xs text-earth-600 mt-0.5">{description}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-1 mb-2">
        {values.map((item) => (
          <div key={item.label} className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-earth-600">{item.label}</span>
            <span>
              <span className="text-2xl font-mono font-bold text-earth-900">{item.value}</span>
              {unit && <span className="ml-1 text-sm text-earth-600 font-mono">{unit}</span>}
            </span>
          </div>
        ))}
      </div>

      {limit && (
        <div className="mt-3 pt-3 border-t border-water-100">
          <div className="flex justify-between text-xs text-earth-600">
            <span>{limit.label}:</span>
            <span className="font-mono font-medium">{limit.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
