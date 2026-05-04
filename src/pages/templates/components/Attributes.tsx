import { Box } from "@/components/ui/box";
import { FormInput } from "@/components/ui/form-input";
import { FormProvider } from "@/components/ui/form-provider";
import { Info } from "lucide-react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { useEffect } from "react";

const Attributes = ({
  attributeList,
  formRef,
}: {
  attributeList: string[];
  formRef?: React.MutableRefObject<UseFormReturn<
    Record<string, string>
  > | null>;
}) => {
  const methods = useForm<Record<string, string>>({
    defaultValues: Object.fromEntries(attributeList.map((a) => [a, ""])),
  });

  useEffect(() => {
    if (formRef) formRef.current = methods;
  }, [methods]);

  return (
    <Box className="space-y-4">
      <Box className="flex items-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-yellow-700 text-sm">
        <Info size={16} className="shrink-0" />
        These fields are for testing purposes only and will not be saved.
      </Box>

      <FormProvider methods={methods} onSubmit={() => {}}>
        <Box className="space-y-3">
          {attributeList.map((attribute) => (
            <FormInput
              key={attribute}
              name={attribute}
              label={attribute.charAt(0).toUpperCase() + attribute.slice(1)}
              placeholder={`Enter ${attribute}`}
            />
          ))}
        </Box>
      </FormProvider>
    </Box>
  );
};

export default Attributes;
