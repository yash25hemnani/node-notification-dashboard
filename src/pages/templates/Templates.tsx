import AppDialog from "@/components/ui/app-dialog";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/ui/page-container";
import SearchBar from "@/components/ui/search-bar";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import CreateTemplateForm from "./forms/CreateTemplateForm";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import apiClient from "@/api/apiClient";
import { type Template } from "./types/templates.type";
import { TemplateCard } from "./components/TemplateCard";
import { PlaceholderCard } from "@/components/ui/placeholder-card";
import { useNavigate } from "react-router-dom";

const Templates = () => {
  const [createTemplateDialogOpen, setCreateTemplateDialogOpen] =
    useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const showAlert = useAlertStore((s) => s.showAlert);
  const navigate = useNavigate();

  const fetchAllTemplates = async () => {
    try {
      const response = await apiClient.get(`/templates/`);
      if (response.status === 200) {
        const data = response.data.data.results ?? response.data ?? [];
        setTemplates(data);
      }
    } catch (error: any) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  useEffect(() => {
    fetchAllTemplates();
  }, []);

  return (
    <PageContainer
      heading="Templates"
      action={
        <Box className="flex items-center gap-3">
          <SearchBar />
          <Button onClick={() => setCreateTemplateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </Box>
      }
    >
      <>
        <Box className="flex flex-wrap gap-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() =>
                navigate(`/templates/${template.id}/${template.slug}`)
              }
            />
          ))}

          {/* Placeholder when empty */}
          {templates.length === 0 && (
            <PlaceholderCard
              text="No templates yet"
              action={<Button size="sm" onClick={() => setCreateTemplateDialogOpen(true)}>Create Template</Button>}
            />
          )}
        </Box>
        <AppDialog
          heading="Create New Template"
          open={createTemplateDialogOpen}
          onClose={() => setCreateTemplateDialogOpen(false)}
        >
          <CreateTemplateForm />
        </AppDialog>
      </>
    </PageContainer>
  );
};

export default Templates;
