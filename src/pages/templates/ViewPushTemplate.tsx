import apiClient from "@/api/apiClient";
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
import { CheckCircle2, Info, Trash, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  templatePatchSchema,
  type TemplatePatchFormValues,
} from "./schemas/templatePatch.schema";
import { type Template } from "./types/templates.type";

const ViewPushTemplate = () => {
  const { templateId, slug } = useParams();
  const showAlert = useAlertStore((s) => s.showAlert);
  const [template, setTemplate] = useState<Template | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmSendTestDialogOpen, setConfirmSendTestDialogOpen] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [userSubscriptionFound, setUserSubscriptionFound] = useState(false);
  const navigate = useNavigate();

  const { loading, subscribe, permission } = usePushNotifications();

  const fetchTemplateDetails = async () => {
    try {
      const response = await apiClient.get(`/templates/${templateId}`);
      if (response.status === 200) setTemplate(response.data.data);
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const response = await apiClient.get(`/subscription/`);
      if (response.status === 200) setUserSubscriptionFound(response.data.data.count !== 0);
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  useEffect(() => { fetchTemplateDetails(); }, [templateId]);
  useEffect(() => { fetchUserSubscription(); }, []);

  const methods = useForm<TemplatePatchFormValues>({
    resolver: zodResolver(templatePatchSchema),
    defaultValues: { subject: "", body: "" },
  });

  const { setValue, formState: { isDirty } } = methods;

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
      const response = await apiClient.post("/notification/test/push", {
        templateSlug: template?.slug,
        data: {},
      });
      if (response.status === 201) {
        showAlert("SUCCESS", "Test notification queued! See Notification tab for details", "success");
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
      showAlert("UNSAVED CHANGES", "Please save the form before sending a test.", "error");
      return;
    }
    if (!template?.subject || !template?.body) {
      showAlert("TEMPLATE INCOMPLETE", "Please save subject and body before sending a test.", "error");
      return;
    }
    setConfirmSendTestDialogOpen(true);
  };

  if (!template) return null;

  return (
    <PageContainer
      heading={
        <Box className="flex items-center gap-2.5">
          <span className="font-semibold text-foreground">{slug}</span>
          <Badge variant="default" className="text-xs capitalize rounded-md px-2">
            push
          </Badge>
        </Box>
      }
      action={
        <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
          <Trash size={14} />
          Delete
        </Button>
      }
    >
      {/* ── Main Editor ─────────────────────────────────── */}
      <Box className="max-w-2xl space-y-4">
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box className="rounded-xl border bg-card p-5 space-y-4">
            <FormInput
              name="subject"
              label="Title"
              placeholder="Enter push notification title..."
            />
            <FormTextarea
              name="body"
              label="Message"
              placeholder="Enter push notification message..."
            />
          </Box>

          <Box className="flex justify-end items-center gap-2 pt-1">
            <Button type="button" variant="outline" size="sm" onClick={handleSendTestClick}>
              Send Test Notification
            </Button>
            <Button type="submit" size="sm">
              Save Changes
            </Button>
          </Box>
        </FormProvider>
      </Box>

      {/* Delete Dialog */}
      <AppDialog
        heading="Delete Template"
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        action={
          <>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        Are you sure you want to delete this template?
      </AppDialog>

      {/* Send Test Dialog */}
      <AppDialog
        heading="Send Test Notification"
        open={confirmSendTestDialogOpen}
        onClose={() => setConfirmSendTestDialogOpen(false)}
        action={
          <>
            <Button variant="outline" onClick={() => setConfirmSendTestDialogOpen(false)}>
              Cancel
            </Button>
            {permission === "default" && (
              <Button onClick={subscribe} disabled={loading}>
                {loading ? "Enabling..." : "Enable Notifications First"}
              </Button>
            )}
            {permission === "denied" && (
              <Button disabled>Notifications Blocked</Button>
            )}
            {permission === "granted" && (
              <Button onClick={handleSendTest} disabled={testLoading}>
                {testLoading ? "Sending..." : "Send"}
              </Button>
            )}
          </>
        }
      >
        <Box className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will send a test push notification to your account. Are you sure?
          </p>

          <Box className="flex flex-col gap-2">
            {/* Permission status */}
            {permission === "granted" && (
              <Box className="flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
                <CheckCircle2 size={15} className="shrink-0" />
                Notifications are enabled on this device.
              </Box>
            )}
            {permission === "default" && (
              <Box className="flex items-center gap-2.5 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2.5 text-sm text-yellow-700">
                <Info size={15} className="shrink-0" />
                Permission not granted yet. Enable notifications first.
              </Box>
            )}
            {permission === "denied" && (
              <Box className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <XCircle size={15} className="shrink-0" />
                Notifications are blocked in your browser settings.
              </Box>
            )}

            {/* Subscription status */}
            {!userSubscriptionFound && (
              <Box className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <XCircle size={15} className="shrink-0" />
                <span className="flex-1">No subscription found for this device.</span>
                <Button
                  onClick={() => subscribe()}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800 shrink-0"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Subscribe"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </AppDialog>
    </PageContainer>
  );
};

export default ViewPushTemplate;