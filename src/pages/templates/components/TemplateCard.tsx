import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EyeOffIcon } from "lucide-react";
import { Box } from "@/components/ui/box";
import type { Template } from "../types/templates.type";

type TemplateCardProps = {
  template: Template;
  onClick?: (template: Template) => void;
};

const channelColors: Record<string, string> = {
  email: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
  push: "bg-cyan-50 border-cyan-200 dark:bg-cyan-950/30 dark:border-cyan-800",
};

export const TemplateCard = ({ template, onClick }: TemplateCardProps) => {
  return (
    <Card
      onClick={() => onClick?.(template)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "w-full sm:w-[48%] lg:w-[31%] xl:w-[23%] max-w-[320px] shrink-0",
        "rounded-2xl border border-border/60",
        "transition-all duration-200 ease-out",
        "hover:shadow-md hover:-translate-y-1 hover:scale-[1.02]",
        onClick &&
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40",
        template.channel && channelColors[template.channel], 
      )}
    >
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-base font-semibold line-clamp-1">
          {template.name}
        </CardTitle>
      </CardHeader>

      {/* Body */}
      <CardContent>
        {template.body ? (
          <Box className="rounded-xl border border-border/50 bg-muted/40 p-3 text-sm text-muted-foreground line-clamp-4 min-h-36">
            {template.body}
          </Box>
        ) : (
          <Box className="rounded-xl border border-dashed border-border/50 bg-muted/30 p-3 text-sm text-muted-foreground min-h-36 flex flex-col items-center justify-center gap-2">
            <EyeOffIcon className="h-4 w-4 opacity-70" />
            <span>No Content</span>
          </Box>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center justify-between bg-muted/30 px-4 py-2 rounded-b-2xl">
        <Badge variant="secondary" className="text-xs truncate max-w-[60%]">
          {template.slug}
        </Badge>

        <Badge variant="default" className="text-xs capitalize">
          {template.channel}
        </Badge>
      </CardFooter>
    </Card>
  );
};
