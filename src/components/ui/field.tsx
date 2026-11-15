"use client";

import type { FormEventHandler, ReactNode } from "react";

import { cn } from "@/lib/utils";

const inputClasses =
  "inset-highlight h-11 w-full rounded-xl bg-nero-100 px-4 py-3 text-15/6 text-ink shadow-input transition-all placeholder:text-dim-gray-100 focus:placeholder:opacity-50 focus:outline-none focus:ring-1 focus:ring-orange-100";
const labelClasses = "block font-medium text-15 text-ink tracking-tight-1";
const errorClasses = "text-12/4 text-error tracking-tight-1";

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

interface FieldProps {
  /** Message shown under the field; also marks it aria-invalid. */
  error?: string;
  hint?: ReactNode;
  /** Also the control's `name` in the submitted FormData. */
  id: string;
  label: string;
  minLength?: number;
  multiline?: boolean;
  onBlur?: FormEventHandler<FieldElement>;
  onInput?: FormEventHandler<FieldElement>;
  /** Regex the value must match (inputs only). */
  pattern?: string;
  placeholder: string;
  required?: boolean;
  type?: "email" | "tel" | "text";
}

export const Field = ({
  error,
  hint,
  id,
  label,
  minLength,
  multiline,
  onBlur,
  onInput,
  pattern,
  placeholder,
  required,
  type = "text",
}: FieldProps) => {
  const errorId = error ? `${id}-error` : undefined;
  const sharedProps = {
    "aria-describedby": errorId,
    "aria-invalid": error ? true : undefined,
    id,
    minLength,
    name: id,
    onBlur,
    onInput,
    placeholder,
    required,
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
        <input
          {...sharedProps}
          className={inputClasses}
          pattern={pattern}
          type={type}
        />
      )}
      {error ? (
        <p className={errorClasses} id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
};
