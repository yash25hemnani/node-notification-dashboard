"use client";

import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectOption = {
  label: string;
  value: string;
};

type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  options: SelectOption[];
};

export function FormSelect<T extends FieldValues>({
  name,
  label,
  description,
  placeholder,
  options,
}: FormSelectProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined} className="w-full">
          {label && <FieldLabel>{label}</FieldLabel>}

          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={field.disabled}
          >
            <SelectTrigger
              ref={field.ref}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid || undefined}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {description && <FieldDescription>{description}</FieldDescription>}

          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}