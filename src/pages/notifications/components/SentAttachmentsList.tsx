import { Box } from "@/components/ui/box";
import { openFile } from "@/utils/openFile";
import { FileIcon, FileText, Image } from "lucide-react";
import type {
  FileAttachment,
  SnapshotAttachment,
} from "../types/notification.types";

const getFileIcon = (mimeType: string, isTemplate: boolean) => {
  const cls = isTemplate ? "text-blue-400" : "text-cyan-400";
  if (mimeType.startsWith("image/")) return <Image size={28} className={cls} />;
  if (mimeType === "application/pdf")
    return <FileText size={28} className={cls} />;
  return <FileIcon size={28} className={cls} />;
};

const formatSize = (bytes?: number) => {
  if (bytes === undefined) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface SentAttachmentListProps {
  templateAttachments?: SnapshotAttachment[];
  files?: FileAttachment[];
}

const SentAttachmentList = ({
  templateAttachments = [],
  files = [],
}: SentAttachmentListProps) => {
  const hasTemplate = templateAttachments.length > 0;
  const hasFiles = files.length > 0;

  if (!hasTemplate && !hasFiles) return null;

  return (
    <Box className="flex flex-wrap gap-3">
      {templateAttachments.map((attachment) => (
        <Box
          key={attachment.id}
          className="relative w-40 h-40 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/60 flex flex-col justify-between p-3 overflow-hidden group"
        >
          {/* Badge */}
          <Box className="absolute top-2 right-2">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-blue-500 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 px-1.5 py-0.5 rounded-md">
              Template
            </span>
          </Box>

          <Box
            className="flex-1 flex items-center justify-center hover:cursor-pointer"
            onClick={() => openFile(attachment.file.path, attachment.source)}
          >
            {getFileIcon("application/pdf", true)}
          </Box>

          <Box className="flex items-end justify-between gap-1">
            <Box className="flex flex-col min-w-0">
              <span
                className="text-xs font-medium text-foreground truncate max-w-22.5"
                title={attachment.file.originalName}
              >
                {attachment.file.originalName}
              </span>
            </Box>
          </Box>
        </Box>
      ))}

      {files.map((file) => (
        <Box
          key={file.id}
          className="relative w-40 h-40 rounded-xl border border-cyan-200 bg-cyan-50 dark:bg-cyan-950/20 dark:border-cyan-900/60 flex flex-col justify-between p-3 overflow-hidden group"
        >
          <Box className="absolute top-2 right-2">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-cyan-500 bg-cyan-100 dark:bg-cyan-900/50 dark:text-cyan-300 px-1.5 py-0.5 rounded-md">
              User
            </span>
          </Box>

          <Box
            className="flex-1 flex items-center justify-center hover:cursor-pointer"
            onClick={() => openFile(file.path, file.source)}
          >
            {getFileIcon(file.mimeType, false)}
          </Box>

          <Box className="flex items-end justify-between gap-1">
            <Box className="flex flex-col min-w-0">
              <span
                className="text-xs font-medium text-foreground truncate max-w-22.5"
                title={file.originalName}
              >
                {file.originalName}
              </span>
              {file.size !== undefined && (
                <span className="text-[10px] text-cyan-400">
                  {formatSize(file.size)}
                </span>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SentAttachmentList;
