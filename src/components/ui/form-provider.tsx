"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import {
  FormProvider as RHFProvider,
  type UseFormReturn,
  type SubmitHandler,
  type FieldValues,
} from "react-hook-form";

type FormProviderProps<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  id?: string;
  className?: string;
};

export function FormProvider<T extends FieldValues>({
  methods,
  onSubmit,
  children,
  id,
  className,
}: FormProviderProps<T>) {
  return (
    <RHFProvider {...methods}>
      <form
        id={id}
        onSubmit={methods.handleSubmit(onSubmit)}
        className={cn("space-y-3", className)}
      >
        {children}
      </form>
    </RHFProvider>
  );
}