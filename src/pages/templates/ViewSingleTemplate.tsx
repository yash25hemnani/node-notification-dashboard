import apiClient from "@/api/apiClient";
import TipTapFormField from "@/components/TipTapFormField";
import AppDialog from "@/components/ui/app-dialog";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormProvider } from "@/components/ui/form-provider";
import { FormTextarea } from "@/components/ui/form-textarea";
import PageContainer from "@/components/ui/page-container";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileInput, Info, Loader, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import AttachmentList from "./components/AttachmentList";
import AddAttachmentForm from "./forms/AddAttachmentForm";
import {
  templatePatchSchema,
  type TemplatePatchFormValues,
} from "./schemas/templatePatch.schema";
import { type Attachment, type Template } from "./types/templates.type";

const ViewSingleTemplate = () => {
  const { templateId, slug } = useParams();
  const showAlert = useAlertStore((s) => s.showAlert);
  const [template, setTemplate] = useState<Template | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmSendTestDialogOpen, setConfirmSendTestDialogOpen] =
    useState(false);
  const [addAttachmentDialogOpen, setAddAttachmentDialogOpen] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [userSubscriptionFound, setUserSubscriptionFound] = useState(false);
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const { loading, subscribe, permission } = usePushNotifications();

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

  const fetchUserSubscription = async () => {
    try {
      const response = await apiClient.get(`/subscription/`);
      if (response.status === 200) {
        setUserSubscriptionFound(response.data.data.count !== 0);
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  useEffect(() => {
    fetchUserSubscription();
  }, []);

  const methods = useForm<TemplatePatchFormValues>({
    resolver: zodResolver(templatePatchSchema),
    defaultValues: { subject: "", body: "" },
  });

  const { setValue, formState } = methods;

  const { isDirty } = formState;

  useEffect(() => {
    if (template?.subject) setValue("subject", template.subject);

    if (template?.channel === "push") {
      setValue("body", template.body ?? "");
    }
  }, [template]);

  const onSubmit = async (data: TemplatePatchFormValues) => {
    try {
      const response = await apiClient.patch(`/templates/${templateId}`, data);
      if (response.status === 200) {
        showAlert("SUCCESS", "Template was updated successfully!", "success");
        methods.reset(data); // Reset the form with update values so isDirty becomes false
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
      const response = await apiClient.post("/notification/test", {
        channel: template?.channel,
        templateSlug: template?.slug,
        data: {},
      });

      if (response.status === 201) {
        showAlert(
          "SUCCESS",
          `Test ${template?.channel === "email" ? "email" : "notification"} queued! 
          See Notification tab for details`,
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

  /**
   * Checks if template is completed, if not shows an alert, otherwise open dialog
   */
  const isTemplateComplete = !!(template?.subject && template?.body);

  const handleSendTestClick = () => {
    if (isDirty) {
      showAlert(
        "UNSAVED CHANGES",
        "Please save the form before sending a test.",
        "error",
      );
      return;
    }

    if (!isTemplateComplete) {
      showAlert(
        "TEMPLATE INCOMPLETE",
        "Please save subject and body before sending a test.",
        "error",
      );
      return;
    }

    setConfirmSendTestDialogOpen(true);
  };

  const fetchTemplateAttachments = async (templateId: string) => {
    try {
      const response = await apiClient.get(`/attachments/${templateId}/`);
      if (response.status === 200) {
        setAttachments(response.data.data.attachments);
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  useEffect(() => {
    if (!template) return;
    fetchTemplateAttachments(template?.id);
  }, [template]);

  if (!template) return <Loader />;

  const handleDeleteAttachment = (_attachmentId: string) => {};

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
        <Box className="flex gap-2">
          {template.channel !== "push" && (
            <Button
              variant={"default"}
              size={"default"}
              onClick={() => setAddAttachmentDialogOpen(true)}
            >
              <FileInput className="w-6 h-6" />
              Attach File
            </Button>
          )}
          <Button
            variant="destructive"
            size="default"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="w-6 h-6" />
            Delete
          </Button>
        </Box>
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

        <AttachmentList
          attachments={attachments}
          onDelete={(attachmentId) => handleDeleteAttachment(attachmentId)}
        />

        <Box className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleSendTestClick}>
            Send Test {template.channel === "email" ? "Email" : "Notification"}
          </Button>
          <Button type="submit">Submit</Button>
        </Box>
      </FormProvider>
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
            fetchTemplateAttachments(template.id)
          }}
          onCancel={() => {
            setAddAttachmentDialogOpen(false);
          }}
        />
      </AppDialog>
      {/* Send Test Dialog */}
      <AppDialog
        heading={`Send Test ${
          template.channel === "email" ? "Email" : "Notification"
        }`}
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

            {template.channel !== "email" && permission === "default" && (
              <Button onClick={subscribe} disabled={loading}>
                {loading ? "Enabling..." : "Enable Notifications First"}
              </Button>
            )}

            {template.channel !== "email" && permission === "denied" && (
              <Button disabled>Notifications Blocked</Button>
            )}

            {(template.channel === "email" ||
              (template.channel !== "email" && permission === "granted")) && (
              <Button onClick={handleSendTest} disabled={testLoading}>
                {testLoading ? "Sending..." : "Send"}
              </Button>
            )}
          </>
        }
      >
        <Box className="space-y-4">
          <p>
            This will send a test{" "}
            {template.channel === "email" ? "email" : "push notification"} to
            your account. Are you sure?
          </p>

          {template.channel !== "email" && (
            <Box className="flex flex-col gap-2">
              {permission === "granted" && (
                <Box className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-green-700">
                  <Info size={18} />
                  Notifications are enabled.
                </Box>
              )}

              {permission === "default" && (
                <Box className="flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-yellow-700">
                  <Info size={18} />
                  Notification permission has not been granted yet. Please
                  enable notifications first.
                </Box>
              )}

              {permission === "denied" && (
                <Box className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
                  <Info size={18} />
                  Notifications are blocked in your browser settings.
                </Box>
              )}

              {!userSubscriptionFound && (
                <Box className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
                  <Info size={18} />

                  <span className="flex-1">Subscription not found.</span>

                  <Button
                    onClick={() => subscribe()}
                    variant="outline"
                    className="border-red-400 text-red-700 hover:bg-red-100 hover:text-red-800"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Subscribe"}
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </AppDialog>
    </PageContainer>
  );
};

export default ViewSingleTemplate;
