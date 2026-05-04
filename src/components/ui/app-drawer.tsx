"use client";

import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

type DrawerDirection = "top" | "bottom" | "left" | "right";

interface AppDrawerProps {
  open: boolean;
  onClose: (open: boolean) => void;
  direction?: DrawerDirection;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function AppDrawer({
  open,
  onClose,
  direction = "right",
  title,
  description,
  children,
  className = "",
}: AppDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onClose} direction={direction}>
      <DrawerContent className={className}>
        {(title || description) && (
          <DrawerHeader>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
        )}

        <div className="p-4 overflow-y-auto">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}