// components/ui/box.tsx
import { cn } from "@/lib/utils";

type BoxProps = React.HTMLAttributes<HTMLDivElement>;

export function Box({ className, ...props }: BoxProps) {
  return <div className={cn("border-zinc-800", className)} {...props} />;
}