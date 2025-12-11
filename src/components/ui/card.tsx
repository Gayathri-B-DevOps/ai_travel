import * as React from "react";
import { cn } from "@/utils/cn";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";


