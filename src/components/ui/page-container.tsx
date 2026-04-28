import * as React from "react";
import { cn } from "@/lib/utils";
import { Box } from "./box";

type PageContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  heading?: string | React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, heading, description, action, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3 p-2", className)} {...props}>
        {(heading || description || action) && (
          <Box className="flex items-start justify-between gap-4 w-auto">
            <Box className="space-y-1">
              {heading && (
                <h1 className="text-md font-semibold tracking-tight uppercase">
                  {heading}
                </h1>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </Box>

            {action && (
              <Box className="flex shrink-0 items-center gap-2">{action}</Box>
            )}
          </Box>
        )}

        <Box className="py-2">{children}</Box>
      </div>
    );
  },
);

// PageContainer.displayName = "PageContainer";

export default PageContainer;
