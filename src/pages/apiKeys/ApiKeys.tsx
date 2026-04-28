import apiClient from "@/api/apiClient";
import AppDialog from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import PageContainer from "@/components/ui/page-container";
import { PlaceholderCard } from "@/components/ui/placeholder-card";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { Key, Loader, Plus, PlusIcon, RotateCcw, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import GenerateApiKeyForm from "./forms/GenerateApiKeyForm";
import { Card, CardContent } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import RotateApiKeyForm from "./forms/RotateApiKeyForm";
import ApiKeyRevealDialog from "./components/ApiKeyRevealDialog";

interface ApiKey {
  id: string;
  name: string;
  createdAt: string;
}

const ApiKeys = () => {
  const [apiKey, setApiKey] = useState<ApiKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [rotateDialogOpen, setRotateDialogOpen] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const showAlert = useAlertStore((s) => s.showAlert);

  const getApiKeys = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/keys");

      if (response.status === 200) {
        setApiKey(response.data.data.apiKey); // id, name and scope
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApiKeys();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await apiClient.delete(`/keys/${apiKey?.id}`);

      if (response.status === 200) {
        showAlert("SUCCESS", "API key deleted successfully!", "success");
        setApiKey(null);
        setDeleteDialogOpen(false)
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  if (loading) return <Loader />;

  return (
    <PageContainer
      heading="API Keys"
      action={
        <>
          {!apiKey && (
            <Button
              variant={"default"}
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus />
              Generate Key
            </Button>
          )}
        </>
      }
    >
      {apiKey ? (
        <Card className="w-full">
          <CardContent className="flex items-center justify-between py-4 px-5">
            {/* Left */}
            <Box className="flex items-center gap-6">
              <Box className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Key size={16} className="text-muted-foreground" />
              </Box>
              <Box className="flex flex-col ">
                <span className="text-base font-medium text-foreground">
                  {apiKey.name}
                </span>
                <span className="text-sm text-muted-foreground font-mono tracking-widest mt-0.5">
                  key_••••••••••••••••••••••••••••••••
                </span>
                <span className="text-[11px] text-muted-foreground mt-1">
                  Created {new Date(apiKey.createdAt).toLocaleDateString()}
                </span>
              </Box>
            </Box>

            {/* Right */}
            <Box className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setRotateDialogOpen(true)}
              >
                <RotateCcw size={13} />
                Rotate
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash size={13} />
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <PlaceholderCard
          text="No Keys Found"
          action={
            <Button onClick={() => setCreateDialogOpen(true)}>
              <PlusIcon />
              Generate Key
            </Button>
          }
        />
      )}

      <AppDialog
        heading="Create API Key"
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      >
        <GenerateApiKeyForm
          onCancel={() => setCreateDialogOpen(false)}
          onSuccess={(apiKey: string) => {
            getApiKeys();
            setCreateDialogOpen(false);
            setRevealedKey(apiKey);
          }}
        />
      </AppDialog>

      <AppDialog
        heading="Rotate API Key"
        open={rotateDialogOpen}
        onClose={() => setRotateDialogOpen(false)}
      >
        <RotateApiKeyForm
          previousName={apiKey?.name ?? ""}
          onCancel={() => setRotateDialogOpen(false)}
          onSuccess={(apiKey: string) => {
            getApiKeys();
            setRotateDialogOpen(false);
            setRevealedKey(apiKey);
          }}
        />
      </AppDialog>

      <ApiKeyRevealDialog
        apiKey={revealedKey ?? ""}
        open={!!revealedKey}
        onClose={() => setRevealedKey(null)}
      />

      <AppDialog
        heading="Delete API Key"
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        action={
          <Box className="flex gap-2">
            <Button
              variant={"outline"}
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant={"destructive"} onClick={() => handleDelete()}>
              Delete
            </Button>
          </Box>
        }
      >
        Are you sure you want to delete this API Key?
      </AppDialog>
    </PageContainer>
  );
};

export default ApiKeys;
