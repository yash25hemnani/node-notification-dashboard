import apiClient from "@/api/apiClient";
import TipTapFormField from "@/components/TipTapFormField";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormProvider } from "@/components/ui/form-provider";
import PageContainer from "@/components/ui/page-container";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  templatePatchSchema,
  type TemplatePatchFormValues,
} from "./schemas/templatePatch.schema";
import { type Template } from "./types/templates.type";
import AppDialog from "@/components/ui/app-dialog";
import { FormTextarea } from "@/components/ui/form-textarea";

const ViewSingleTemplate = () => {
  const { templateId, slug } = useParams();
  const showAlert = useAlertStore((s) => s.showAlert);
  const [template, setTemplate] = useState<Template | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchTemplateDetails = async () => {
    try {
      const response = await apiClient.get(`/templates/${templateId}`);

      if (response.status === 200) {
        setTemplate(response.data.data);
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  useEffect(() => {
    fetchTemplateDetails();
  }, [templateId]);

  const methods = useForm<TemplatePatchFormValues>({
    resolver: zodResolver(templatePatchSchema),
    defaultValues: {
      subject: "",
      body: "",
    },
  });

  const { setValue } = methods;

  useEffect(() => {
    if (template?.subject) setValue("subject", template.subject);
  }, [template]);

  const onSubmit = async (data: TemplatePatchFormValues) => {
    try {
      const response = await apiClient.patch(`/templates/${templateId}`, data);

      if (response.status === 200) {
        showAlert(
          "SUCCESS",
          "Give template was updated successfully!",
          "success",
        );
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await apiClient.delete(`/templates/${templateId}`);

      if (response.status === 200) {
        showAlert("SUCCESS", "Template was deleted successfully!", "success");
        navigate("/templates");
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  if (!template) return <Loader />;

  return (
    <PageContainer
      heading={
        <Box className="flex justify-center items-center gap-2">
          {slug}{" "}
          {template && (
            <Badge variant="default" className="text-xs capitalize">
              {template?.channel}
            </Badge>
          )}
        </Box>
      }
      action={
        <>
          <Button
            variant={"destructive"}
            size={"default"}
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="w-6 h-6" />
            Delete
          </Button>
        </>
      }
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <FormInput
          name="subject"
          label="Subject"
          placeholder={`Enter ${template?.channel === "email" ? "Email" : "Push Notification"} Title`}
        />

        {template.channel === "email" && (
          <TipTapFormField
            name="body"
            label="Email Body"
            initialContent={template?.body ?? ""}
          />
        )}

        {template.channel === "push" && (
          <FormTextarea
            name="body"
            label="Push Notification Message"
            placeholder="Enter push notification message..."
          />
        )}

        <Box className="flex justify-end">
          <Button>Submit</Button>
        </Box>
      </FormProvider>

      <AppDialog
        heading="Delete Template"
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        action={
          <>
            <Button variant={"outline"}>Cancel</Button>
            <Button variant={"destructive"} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        Are you sure you want to delete this template?
      </AppDialog>
    </PageContainer>
  );
};

export default ViewSingleTemplate;
