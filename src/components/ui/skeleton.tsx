import * as React from "react";
import { cn } from "@/utils/cn";

export const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("animate-pulse rounded-2xl bg-slate-800/80", className)}
    {...props}
  />
);


