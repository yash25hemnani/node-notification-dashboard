import { Trash2, FileText, Image, FileIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import type { Attachment } from "../types/templates.type";

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return <Image size={28} />;
  if (mimeType === "application/pdf") return <FileText size={28} />;
  return <FileIcon size={28} />;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface AttachmentListProps {
  attachments: Attachment[];
  onDelete?: (attachmentId: string) => void;
  onDownload?: (attachment: Attachment) => void;
}

const AttachmentList = ({
  attachments,
  onDelete,
  onDownload,
}: AttachmentListProps) => {
  if (!attachments.length) {
    return null;
  }

  return (
    <Box className="flex flex-wrap gap-3">
      {attachments.map((attachment) => (
        <Box
          key={attachment.id}
          className="relative w-40 h-40 rounded-xl border bg-muted flex flex-col justify-between p-3 overflow-hidden"
        >
          {/* Icon — centered in upper area */}
          <Box
            className="flex-1 flex items-center justify-center text-muted-foreground hover:cursor-pointer"
            onClick={() => window.open(attachment.file.path, "_blank")}
          >
            {getFileIcon(attachment.file.mimeType)}
          </Box>

          {/* Bottom row */}
          <Box className="flex items-end justify-between gap-1">
            {/* Name + size */}
            <Box className="flex flex-col min-w-0">
              <span
                className="text-xs font-medium text-foreground truncate max-w-22.5"
                title={attachment.file.originalName}
              >
                {attachment.file.originalName}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {formatSize(attachment.file.size)}
              </span>
            </Box>

            {/* Actions */}
            <Box className="flex items-center shrink-0">
              {onDownload && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => onDownload(attachment)}
                >
                  <Download size={13} />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(attachment.id)}
                >
                  <Trash2 size={13} />
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AttachmentList;
