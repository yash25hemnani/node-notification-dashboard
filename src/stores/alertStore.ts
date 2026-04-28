import { create } from "zustand";
import { toast } from "sonner";

type AlertType = "success" | "error" | "info" | "warning";

type AlertStore = {
  showAlert: (
    title: string,
    description?: string,
    type?: AlertType,
    duration?: number
  ) => void;
};

export const useAlertStore = create<AlertStore>(() => ({
  showAlert: (
    title,
    description,
    type = "info",
    duration = 3000
  ) => {
    toast[type](title, {
      description,
      duration,
    });
  },
}));