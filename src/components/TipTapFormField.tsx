import { Controller, useFormContext } from "react-hook-form";
import { inlineStyles } from "@/utils/inlineStyles";
import TipTapEditor from "./TipTapEditor";

interface TipTapFormFieldProps {
  name: string;
  label?: string;
  initialContent?: string;
}

export default function TipTapFormField({
  name,
  label,
  initialContent,
}: TipTapFormFieldProps) {
  const { control } = useFormContext();
  console.log(initialContent)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="py-2">
          {label && (
            <label className="text-[13px] font-medium text-foreground tracking-[0.01em] mb-1.5 block">
              {label}
            </label>
          )}

          <TipTapEditor
            value={initialContent ?? field.value}
            onChange={(html) => field.onChange(inlineStyles(html))}
          />

          {fieldState.error && (
            <p className="mt-1.5 text-[12px] text-red-500">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
