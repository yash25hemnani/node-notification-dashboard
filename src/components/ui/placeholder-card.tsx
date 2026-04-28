import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Box } from "./box";

type PlaceholderCardProps = {
  text: string;
  action?: React.ReactNode;
  className?: string;
};

export const PlaceholderCard = ({
  text,
  action,
  className,
}: PlaceholderCardProps) => {
  return (
    <Card
      className={cn(
        "w-full border-dashed border-muted-foreground/40 bg-muted/20 hover:bg-muted/30 transition-colors",
        className
      )}
    >
      <CardContent className="flex flex-col items-center justify-center py-10 text-center gap-3">
        <p className="text-sm text-muted-foreground">{text}</p>

        {action && <Box className="mt-1">{action}</Box>}
      </CardContent>
    </Card>
  );
};