import apiClient from "@/api/apiClient";
import AppDialog from "@/components/ui/app-dialog";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { FileIcon, FileText, Image, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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
  templateId: string;
}

const AttachmentList = ({ attachments, templateId }: AttachmentListProps) => {
  const [items, setItems] = useState<Attachment[]>(attachments);
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const showAlert = useAlertStore((s) => s.showAlert);

  const handleDeleteClick = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    setItems(attachments);
  }, [attachments]);

  const handleDeleteConfirm = async () => {
    if (!selectedAttachment) return;

    try {
      setDeleting(true);
      await apiClient.delete(
        `/attachments/${templateId}/${selectedAttachment.id}`,
      );
      setItems((prev) => prev.filter((a) => a.id !== selectedAttachment.id));
      showAlert("SUCCESS", "Attachment deleted successfully.", "success");
      setDeleteDialogOpen(false);
      setSelectedAttachment(null);
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    } finally {
      setDeleting(false);
    }
  };

  if (!items.length) return null;

  return (
    <>
      <Box className="flex flex-wrap gap-3">
        {items.map((attachment) => (
          <Box
            key={attachment.id}
            className="relative w-40 h-40 rounded-xl border bg-muted flex flex-col justify-between p-3 overflow-hidden"
          >
            {/* Icon */}
            <Box
              className="flex-1 flex items-center justify-center text-muted-foreground hover:cursor-pointer"
              onClick={() => window.open(attachment.file.path, "_blank")}
            >
              {getFileIcon(attachment.file.mimeType)}
            </Box>

            {/* Bottom row */}
            <Box className="flex items-end justify-between gap-1">
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

              <Box className="flex items-center shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteClick(attachment)}
                >
                  <Trash2 size={13} />
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <AppDialog
        heading="Delete Attachment"
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        action={
          <Box className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </Box>
        }
      >
        Are you sure you want to delete{" "}
        <span className="font-medium">
          {selectedAttachment?.file.originalName}
        </span>
        ? This action cannot be undone.
      </AppDialog>
    </>
  );
};

export default AttachmentList;
