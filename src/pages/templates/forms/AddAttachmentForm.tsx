import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  addAttachmentSchema,
  type AddAttachmentFormValues,
} from "../schemas/addAttachment.schema";
import { extractApiError } from "@/utils/extractApiError";
import { useAlertStore } from "@/stores/alertStore";
import apiClient from "@/api/apiClient";
import { FormProvider } from "@/components/ui/form-provider";
import { FormFileInput } from "@/components/ui/form-file-input";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { uploadFile } from "@/utils/uploadFile";

const AddAttachmentForm = ({
  templateId,
  onSuccess,
  onCancel
}: {
  templateId: string;
  onSuccess: () => void;
  onCancel:() => void;
}) => {
  const showAlert = useAlertStore((s) => s.showAlert);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<AddAttachmentFormValues>({
    resolver: zodResolver(addAttachmentSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = async (data: AddAttachmentFormValues) => {
    try {
      setIsSubmitting(true);
      const id = await uploadFile(data.file);

      const response = await apiClient.post(`/attachments/${templateId}/`, {
        fileId: id
      });

      if (response.status === 201) {
        showAlert(
          "Attachment added",
          "Your attachment has been successfully added.",
          "success",
        );

        onSuccess();
      }
    } catch (error: any) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    } finally {
      setIsSubmitting(true);
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <FormFileInput name="file" label="Choose Attachment" />

      <Box className="flex items-center justify-end gap-3 pt-4">
        <Button variant="outline" onClick={() => onCancel()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Attachment"}
        </Button>
      </Box>
    </FormProvider>
  );
};

export default AddAttachmentForm;
