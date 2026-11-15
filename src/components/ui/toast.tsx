"use client";

import {
  Description as ToastDescription,
  Provider as ToastProviderPrimitive,
  Root as ToastRoot,
  Title as ToastTitle,
  Viewport as ToastViewport,
} from "@radix-ui/react-toast";
import { createContext, useCallback, useMemo, useState } from "react";

import { CheckCircle } from "@/components/icons/check-circle";
import { CORNER_INSET } from "@/lib/styles";
import { TEXT_CAPTION } from "@/lib/typography";
import { useRequiredContext } from "@/lib/use-required-context";
import { cn } from "@/lib/utils";

type ToastTone = "error" | "success";

interface ToastContextType {
  showToast: (title: string, description?: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);
ToastContext.displayName = "ToastProvider";

export const useToast = () => useRequiredContext(ToastContext, "useToast");

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<{
    description: string;
    open: boolean;
    title: string;
    tone: ToastTone;
  }>({
    description: "",
    open: false,
    title: "",
    tone: "success",
  });
  const { description, open, title, tone } = toast;

  const setOpen = useCallback(
    (nextOpen: boolean) => setToast((prev) => ({ ...prev, open: nextOpen })),
    []
  );
  const showToast = useCallback(
    (
      newTitle: string,
      newDescription?: string,
      newTone: ToastTone = "success"
    ) =>
      setToast({
        description: newDescription || "",
        open: true,
        title: newTitle,
        tone: newTone,
      }),
    []
  );
  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastProviderPrimitive swipeDirection="up">
        {children}
        {title ? (
          <ToastRoot asChild duration={4000} onOpenChange={setOpen} open={open}>
            <div
              className={cn(
                "fixed z-50 flex h-15 w-76 items-center justify-center gap-3 rounded-2xl bg-nero-300 p-3 inset-highlight",
                CORNER_INSET,
                "data-[state=closed]:animate-toast-out data-[state=open]:animate-toast-in"
              )}
            >
              {tone === "success" ? (
                <div className="flex size-8 items-center justify-center rounded-lg bg-nero-100 inset-highlight">
                  <CheckCircle />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-1">
                <ToastTitle className="text-12/4 font-semibold tracking-tight-3 text-ink">
                  {title}
                </ToastTitle>
                {description ? (
                  <ToastDescription className={TEXT_CAPTION}>
                    {description}
                  </ToastDescription>
                ) : null}
              </div>
            </div>
          </ToastRoot>
        ) : null}
        <ToastViewport />
      </ToastProviderPrimitive>
    </ToastContext.Provider>
  );
};
