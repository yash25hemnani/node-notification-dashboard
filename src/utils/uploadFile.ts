import apiClient from "@/api/apiClient";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "./extractApiError";

export const uploadFile = async (file: File) => {
  const showAlert = useAlertStore.getState().showAlert;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    showAlert("UPLOAD SUCCESS", "File uploaded successfully.", "success");

    return response.data.data.id;
  } catch (error) {
    const { code, message } = extractApiError(error);

    showAlert(code.split("_").join(" "), message, "error");

    throw error;
  }
};
