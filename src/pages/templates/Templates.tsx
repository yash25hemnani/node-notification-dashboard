import AppDialog from "@/components/ui/app-dialog";
import { AppTabs } from "@/components/ui/app-tabs";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/ui/page-container";
import SearchBar from "@/components/ui/search-bar";
import { Plus } from "lucide-react";
import { useState } from "react";
import TemplateList from "./components/TemplateList";
import CreateTemplateForm from "./forms/CreateTemplateForm";

const Templates = () => {
  const [createTemplateDialogOpen, setCreateTemplateDialogOpen] =
    useState(false);

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
        <AppTabs
          tabs={[
            {
              value: "email",
              label: "Email",
              content: (
                <TemplateList
                  channel="email"
                  onCreateClick={() => setCreateTemplateDialogOpen(true)}
                />
              ),
            },
            {
              value: "push",
              label: "Push",
              content: (
                <TemplateList
                  channel="push"
                  onCreateClick={() => setCreateTemplateDialogOpen(true)}
                />
              ),
            },
          ]}
        />
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
