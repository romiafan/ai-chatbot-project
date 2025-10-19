"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProviderBadgeProps {
  provider: "openai" | "gemini";
  model: string;
  className?: string;
}

export function ProviderBadge({
  provider,
  model,
  className,
}: ProviderBadgeProps) {
  const providerInfo = {
    openai: {
      name: "ChatGPT",
      color:
        "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    },
    gemini: {
      name: "Gemini",
      color:
        "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    },
  };

  const info = providerInfo[provider];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        info.color,
        className
      )}
    >
      <Sparkles className="h-3 w-3" />
      <span>
        {info.name} • {model}
      </span>
    </div>
  );
}
