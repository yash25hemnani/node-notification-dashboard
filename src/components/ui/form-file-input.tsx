"use client";

import * as React from "react";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type FormFileInputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export function FormFileInput<T extends FieldValues>({
  name,
  label,
  description,
  accept,
  multiple,
  inputProps,
}: FormFileInputProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, ref }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel>{label}</FieldLabel>}

          <Input
            {...inputProps}
            ref={ref}
            type="file"
            accept={accept}
            multiple={multiple}
            onBlur={onBlur}
            aria-invalid={fieldState.invalid}
            onChange={(e) => onChange(multiple ? e.target.files : e.target.files?.[0] ?? null)}
            className="hover:cursor-pointer"
          />

          {description && (
            <FieldDescription>{description}</FieldDescription>
          )}

          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}