import { useFormContext } from "react-hook-form";
import { Textarea } from "../ui/textarea";

interface FormTextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
}

export function FormTextarea({ name, label, placeholder }: FormTextareaProps) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col gap-1.5 py-2">
      {label && (
        <label className="text-[13px] font-medium text-foreground tracking-[0.01em]">
          {label}
        </label>
      )}
      <Textarea
        {...register(name)}
        placeholder={placeholder}
        className="min-h-30 resize-none"
      />
      {errors[name] && (
        <p className="text-[12px] text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}