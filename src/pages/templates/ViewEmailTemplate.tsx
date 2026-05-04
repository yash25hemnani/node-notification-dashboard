// ViewEmailTemplate.tsx
import apiClient from "@/api/apiClient";
import TipTapFormField from "@/components/TipTapFormField";
import AppDialog from "@/components/ui/app-dialog";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormProvider } from "@/components/ui/form-provider";
import PageContainer from "@/components/ui/page-container";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileInput, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import AttachmentList from "./components/AttachmentList";
import AddAttachmentForm from "./forms/AddAttachmentForm";
import {
  templatePatchSchema,
  type TemplatePatchFormValues,
} from "./schemas/templatePatch.schema";
import { type Attachment, type Template } from "./types/templates.type";
import Attributes from "./components/Attributes";

const ViewEmailTemplate = () => {
  const { templateId, slug } = useParams();
  const showAlert = useAlertStore((s) => s.showAlert);
  const [template, setTemplate] = useState<Template | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmSendTestDialogOpen, setConfirmSendTestDialogOpen] =
    useState(false);
  const [addAttachmentDialogOpen, setAddAttachmentDialogOpen] = useState(false);
  const [attributeDrawerOpen, setAttributeDrawerOpen] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attributeList, setAttributeList] = useState<string[]>([]);
  const navigate = useNavigate();

  const attributeFormRef = useRef<UseFormReturn<Record<string, string>> | null>(
    null,
  );

  const fetchTemplateDetails = async () => {
    try {
      const response = await apiClient.get(`/templates/${templateId}`);
      if (response.status === 200) setTemplate(response.data.data);
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  const fetchTemplateAttachments = async (id: string) => {
    try {
      const response = await apiClient.get(`/attachments/${id}/`);
      if (response.status === 200)
        setAttachments(response.data.data.attachments);
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  useEffect(() => {
    fetchTemplateDetails();
  }, [templateId]);

  useEffect(() => {
    if (template) fetchTemplateAttachments(template.id);

    console.log(template)
  }, [template]);

  const methods = useForm<TemplatePatchFormValues>({
    resolver: zodResolver(templatePatchSchema),
    defaultValues: { subject: "", body: "" },
  });

  const {
    setValue,
    watch,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (template?.subject) setValue("subject", template.subject);
    if (template?.body) setValue("body", template.body);
  }, [template]);

  const onSubmit = async (data: TemplatePatchFormValues) => {
    try {
      const response = await apiClient.patch(`/templates/${templateId}`, data);
      if (response.status === 200) {
        showAlert("SUCCESS", "Template was updated successfully!", "success");
        methods.reset(data);
        fetchTemplateDetails();
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

  const handleSendTest = async () => {
    try {
      setTestLoading(true);
      const data = attributeFormRef.current?.getValues() ?? {};
      const response = await apiClient.post("/notification/test/email", {
        templateSlug: template?.slug,
        data,
      });
      if (response.status === 201) {
        showAlert(
          "SUCCESS",
          "Test email queued! See Notification tab for details",
          "success",
        );
        setConfirmSendTestDialogOpen(false);
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    } finally {
      setTestLoading(false);
    }
  };

  const handleSendTestClick = () => {
    if (isDirty) {
      showAlert(
        "UNSAVED CHANGES",
        "Please save the form before sending a test.",
        "error",
      );
      return;
    }
    if (!template?.subject || !template?.body) {
      showAlert(
        "TEMPLATE INCOMPLETE",
        "Please save subject and body before sending a test.",
        "error",
      );
      return;
    }
    setConfirmSendTestDialogOpen(true);
  };

  // Watched Components
  const watchedSubject = watch("subject");
  const watchedBody = watch("body");

  useEffect(() => {
    // Get all strings of format {{ something }}
    const subjectMatches = [...(watchedSubject ?? "").matchAll(/{{(.*?)}}/g)];
    const bodyMatches = [...(watchedBody ?? "").matchAll(/{{(.*?)}}/g)];

    const values = [...subjectMatches, ...bodyMatches].map((match) =>
      match[1].trim(),
    );

    // Keep unique values
    const uniqueAttributes: string[] = [...new Set(values)];

    setAttributeList(uniqueAttributes);
    setAttributeDrawerOpen(uniqueAttributes.length > 0);

    console.log(uniqueAttributes);
  }, [watchedSubject, watchedBody]);

  if (!template) return null;

  return (
    <PageContainer
      heading={
        <Box className="flex justify-center items-center gap-2">
          {slug}
          <Badge variant="default" className="text-xs capitalize">
            email
          </Badge>
        </Box>
      }
      action={
        <Box className="flex gap-2">
          <Button
            variant="default"
            onClick={() => setAddAttachmentDialogOpen(true)}
          >
            <FileInput className="w-6 h-6" />
            Attach File
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="w-6 h-6" />
            Delete
          </Button>
        </Box>
      }
    >
      <Box className="flex gap-6">
        <Box className="flex-1 min-w-0">
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <FormInput
              name="subject"
              label="Subject"
              placeholder="Enter Email Title"
            />

            <TipTapFormField
              name="body"
              label="Email Body"
              initialContent={template.body ?? ""}
            />

            <AttachmentList
              attachments={attachments}
              templateId={template.id}
            />

            <Box className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSendTestClick}
              >
                Send Test Email
              </Button>
              <Button type="submit">Save</Button>
            </Box>
          </FormProvider>
        </Box>

        {attributeDrawerOpen && (
          <Box className="w-108 border rounded-xl shrink-0 p-2 h-full">
            <Attributes
              attributeList={attributeList}
              formRef={attributeFormRef}
            />
          </Box>
        )}
      </Box>

      {/* Delete Dialog */}
      <AppDialog
        heading="Delete Template"
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        action={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        Are you sure you want to delete this template?
      </AppDialog>

      {/* Add Attachment Dialog */}
      <AppDialog
        heading="Add Attachment"
        open={addAttachmentDialogOpen}
        onClose={() => setAddAttachmentDialogOpen(false)}
      >
        <AddAttachmentForm
          templateId={template.id}
          onSuccess={() => {
            setAddAttachmentDialogOpen(false);
            fetchTemplateAttachments(template.id);
          }}
          onCancel={() => setAddAttachmentDialogOpen(false)}
        />
      </AppDialog>

      {/* Send Test Dialog */}
      <AppDialog
        heading="Send Test Email"
        open={confirmSendTestDialogOpen}
        onClose={() => setConfirmSendTestDialogOpen(false)}
        action={
          <>
            <Button
              variant="outline"
              onClick={() => setConfirmSendTestDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSendTest} disabled={testLoading}>
              {testLoading ? "Sending..." : "Send"}
            </Button>
          </>
        }
      >
        This will send a test email to your account. Are you sure?
      </AppDialog>
    </PageContainer>
  );
};

export default ViewEmailTemplate;
