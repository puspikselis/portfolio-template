"use client";

import {
  Description as ToastDescription,
  Provider as ToastProviderPrimitive,
  Root as ToastRoot,
  Title as ToastTitle,
  Viewport as ToastViewport,
} from "@radix-ui/react-toast";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { CheckCircle } from "@/components/icons/check-circle";
import { TEXT_CAPTION } from "@/lib/typography";
import { cn } from "@/lib/utils";

type ToastTone = "error" | "success";

interface ToastContextType {
  showToast: (title: string, description?: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
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
                "inset-shadow-0-1-0 inset-shadow-highlight/8",
                "fixed top-5 right-5 z-50 flex h-15 w-76 items-center justify-center gap-3 rounded-2xl bg-nero-300 p-3",
                "md:top-8 md:right-12",
                "data-[state=closed]:animate-[toast-out_250ms_ease-in_both] data-[state=open]:animate-[toast-in_600ms_var(--ease-spring-toast)_both]"
              )}
            >
              {tone === "success" ? (
                <div className="inset-shadow-0-1-0 inset-shadow-highlight/8 flex size-8 items-center justify-center rounded-lg bg-nero-100">
                  <CheckCircle />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-1">
                <ToastTitle className="font-semibold text-12/4 text-ink -tracking-[0.03em]">
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
}
