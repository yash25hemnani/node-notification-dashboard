import apiClient from "@/api/apiClient";
import { FormInput } from "@/components/ui/form-input";
import { FormProvider } from "@/components/ui/form-provider";
import { useAlertStore } from "@/stores/alertStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { extractApiError } from "@/utils/extractApiError";
import { useNavigate } from "react-router-dom";
import {
  createTemplateFormSchema,
  type CreateTemplateFormValues,
} from "../schemas/createTemplate.schema";
import { FormSelect } from "@/components/ui/form-select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";

const options = [
  { label: "Email", value: "email" },
  { label: "Push", value: "push" },
];
const CreateTemplateForm = () => {
  const showAlert = useAlertStore((s) => s.showAlert);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugDescription, setSlugDescription] = useState("");

  const methods = useForm<CreateTemplateFormValues>({
    resolver: zodResolver(createTemplateFormSchema),
    defaultValues: {
      name: "",
      channel: undefined,
    },
  });

  const onSubmit = async (data: CreateTemplateFormValues) => {
    try {
      setIsSubmitting(true);
      const response = await apiClient.post("/templates/create", data);

      if (response.status === 201) {
        showAlert(
          "Template created",
          "Your template has been successfully created.",
          "success",
        );

        navigate("/templates");
      }
    } catch (error: any) {
      const { code, message } = extractApiError(error);
      showAlert(code.split("_").join(" "), message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { watch } = methods;

  const watchedName = watch("name");

  useEffect(() => {
    setSlugDescription(watchedName.toLowerCase().split(" ").join("-"));
  }, [watchedName]);

  return (
    <FormProvider
      methods={methods}
      onSubmit={onSubmit}
      id="create-template-form"
    >
      <FormInput
        name="name"
        label="Template Name"
        inputProps={{
          type: "text",
          placeholder: "e.g. welcome-email",
        }}
        description={`Slug: ${slugDescription}`}
      />
      <FormSelect
        placeholder="Select a Channel"
        name="channel"
        label="Channel"
        options={options}
      />
      <Box className="flex items-center justify-end gap-3 pt-4">
        <Button variant="outline">Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Template"}
        </Button>
      </Box>
    </FormProvider>
  );
};

export default CreateTemplateForm;
