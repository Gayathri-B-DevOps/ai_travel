import * as React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  ...props
}) => {
  const base =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide";
  const styles =
    variant === "outline"
      ? "border-slate-700 text-slate-300"
      : "border-transparent bg-brand-500/20 text-brand-200";
  return <span className={cn(base, styles, className)} {...props} />;
};


