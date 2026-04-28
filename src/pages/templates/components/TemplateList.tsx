import apiClient from "@/api/apiClient";
import { Box } from "@/components/ui/box";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TemplateCard } from "./TemplateCard";
import { PlaceholderCard } from "@/components/ui/placeholder-card";
import { Button } from "@/components/ui/button";
import type { Template } from "../types/templates.type";

// TemplateList.tsx
const TemplateList = ({
  channel,
  onCreateClick,
}: {
  channel: "email" | "push" | "sms" | "whatsapp";
  onCreateClick: () => void;
}) => {
  const [templates, setTemplates] = useState<Template[] | null>(null);
  const showAlert = useAlertStore((s) => s.showAlert);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/templates?channel=${channel}`);
      if (response.status === 200) {
        setTemplates(response.data.data.results ?? []);
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [channel]); // ← refetches if channel changes

  if (loading && !templates) return;

  return (
    <Box className="flex flex-wrap gap-4 mt-4">
      {templates?.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onClick={() => navigate(`/templates/${template.id}/${template.slug}`)}
        />
      ))}
      {templates?.length === 0 && (
        <PlaceholderCard
          text={`No ${channel} templates yet`}
          action={
            <Button size="sm" onClick={onCreateClick}>
              Create Template
            </Button>
          }
        />
      )}
    </Box>
  );
};

export default TemplateList;
