import * as React from "react";
import { cn } from "@/lib/utils";

type StackProps = React.HTMLAttributes<HTMLDivElement> & {
  direction?: "row" | "column";
  gap?: number; 
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
};

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = "column",
      gap = 4,
      align = "start",
      justify = "start",
      wrap = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          direction === "row" ? "flex-row" : "flex-col",
          wrap && "flex-wrap",

          // gap
          `gap-${gap}`,

          // alignment
          align === "start" && "items-start",
          align === "center" && "items-center",
          align === "end" && "items-end",
          align === "stretch" && "items-stretch",

          // justify
          justify === "start" && "justify-start",
          justify === "center" && "justify-center",
          justify === "end" && "justify-end",
          justify === "between" && "justify-between",
          justify === "around" && "justify-around",
          justify === "evenly" && "justify-evenly",

          className
        )}
        {...props}
      />
    );
  }
);
