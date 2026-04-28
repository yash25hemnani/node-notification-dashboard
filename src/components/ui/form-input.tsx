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

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export function FormInput<T extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  inputProps,
}: FormInputProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel>{label}</FieldLabel>}

          <Input
            {...field}
            {...inputProps}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
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