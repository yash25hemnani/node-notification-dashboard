import apiClient from "@/api/apiClient";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FormProvider } from "@/components/ui/form-provider";
import { useAlertStore } from "@/stores/alertStore";
import { extractApiError } from "@/utils/extractApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  generateApiKeySchema,
  type GenerateApiKeyFormValues,
} from "../schemas/generateApiKey.schema";

const GenerateApiKeyForm = ({
  onSuccess,
  onCancel,
}: {
  onSuccess: (apiKey: string) => void;
  onCancel: () => void;
}) => {
  const showAlert = useAlertStore((s) => s.showAlert);

  const methods = useForm<GenerateApiKeyFormValues>({
    resolver: zodResolver(generateApiKeySchema),
    defaultValues: { name: "" },
  });

  const onSubmit = async (data: GenerateApiKeyFormValues) => {
    try {
      const response = await apiClient.post("/keys/generate", data);

      if (response.status === 201) {
        showAlert("SUCCESS", "API key generated successfully!", "success");
        onSuccess(response.data.data.api_key);
      }
    } catch (error) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <FormInput
        name="name"
        label="Key Name"
        placeholder="e.g. Production, Development"
      />
      <Box className="flex gap-2 justify-end">
        <Button variant={"outline"} onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button type="submit">Generate Key</Button>
      </Box>
    </FormProvider>
  );
};

export default GenerateApiKeyForm;
