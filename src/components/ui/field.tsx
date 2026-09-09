"use client";

import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/lib/utils";

const inputClasses =
  "inset-shadow-0-1-0 inset-shadow-highlight/8 h-11 w-full rounded-xl bg-nero-100 px-4 py-3 text-15/6 text-ink shadow-[0_1px_2px_light-dark(transparent,rgba(0,0,0,.48))] transition-all placeholder:text-dim-gray-100 focus:placeholder:opacity-50 focus:outline-none focus:ring-1 focus:ring-orange-100";
const labelClasses = "block font-medium text-15 text-ink -tracking-[0.01em]";
const errorClasses = "text-12/4 text-red-500 -tracking-[0.01em]";

interface FieldProps {
  error?: FieldError;
  hint?: React.ReactNode;
  id: string;
  label: string;
  multiline?: boolean;
  placeholder: string;
  register: UseFormRegisterReturn;
  type?: "email" | "tel" | "text";
}

export function Field({
  error,
  hint,
  id,
  label,
  multiline,
  placeholder,
  register,
  type = "text",
}: FieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const sharedProps = {
    "aria-describedby": errorId,
    "aria-invalid": error ? true : undefined,
    id,
    placeholder,
    ...register,
  };

  return (
    <div className="flex-1 space-y-2">
      <label className={labelClasses} htmlFor={id}>
        {label}
        {hint}
      </label>
      {multiline ? (
        <textarea
          {...sharedProps}
          className={cn(inputClasses, "h-auto min-h-24 resize-y")}
        />
      ) : (
        <input {...sharedProps} className={inputClasses} type={type} />
      )}
      {error ? (
        <p className={errorClasses} id={errorId}>
          {error.message}
        </p>
      ) : null}
    </div>
  );
}
