import { useState } from "react";
import AppDialog from "@/components/ui/app-dialog";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

const ApiKeyRevealDialog = ({
  apiKey,
  open,
  onClose,
}: {
  apiKey: string;
  open: boolean;
  onClose: () => void;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppDialog heading="Your API Key" open={open} onClose={onClose}>
      <p className="text-sm text-muted-foreground mb-3">
        Copy your API key now. You won't be able to see it again.
      </p>

      <Box className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2.5">
        <code className="text-xs font-mono text-foreground break-all flex-1">
          {apiKey}
        </code>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="shrink-0"
        >
          {copied ? (
            <Check size={14} className="text-green-500" />
          ) : (
            <Copy size={14} />
          )}
        </Button>
      </Box>

      <Box className="flex justify-end mt-4">
        <Button onClick={onClose}>Done</Button>
      </Box>
    </AppDialog>
  );
};

export default ApiKeyRevealDialog;
