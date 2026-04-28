import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import * as React from "react";

type AppDialogProps = {
  heading: string;
  children: React.ReactNode;
  action?: React.ReactNode; // footer button
  open: boolean;
  onClose: (open: boolean) => void;
};

const AppDialog: React.FC<AppDialogProps> = ({
  heading,
  children,
  action,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>

      <DialogContent className="sm:max-w-md">
        {/* Header */}
        {heading && (
          <DialogHeader>
            <DialogTitle>{heading}</DialogTitle>
          </DialogHeader>
        )}

        {/* Body */}
        <div className="py-2">{children}</div>

        {/* Footer */}
        {action && <DialogFooter>{action}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default AppDialog;