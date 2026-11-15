"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Close as DialogClose,
  Content as DialogContent,
  Description as DialogDescription,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
  Title as DialogTitle,
} from "@radix-ui/react-dialog";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/constants";
import { CORNER_INSET } from "@/lib/styles";
import { TEXT_BODY, TEXT_DISPLAY } from "@/lib/typography";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// Focus the dialog itself rather than the first field, so phones don't pop the
// keyboard on open; focus must still leave the (now aria-hidden) trigger.
function focusDialog(e: Event) {
  e.preventDefault();
  (e.currentTarget as HTMLElement | null)?.focus();
}

export function ContactDialog({ isOpen, onClose }: Props) {
  const { showToast } = useToast();
  const honeyRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    defaultValues: { email: "", message: "", name: "", phone: "" },
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    if (honeyRef.current?.value) {
      return;
    }

    const fd = new FormData();
    fd.set("name", values.name);
    fd.set("email", values.email);
    fd.set("phone", values.phone ?? "");
    fd.set("message", values.message);
    fd.set("_replyto", values.email);
    fd.set("_subject", `Portfolio Contact from ${values.name}`);

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        body: fd,
        headers: { Accept: "application/json" },
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("send failed");
      }

      new Audio("/audio/mail-sent.mp3").play().catch(() => {
        // autoplay blocked — the toast is confirmation enough
      });
      reset();
      onClose();
      showToast("Message sent", "I'll get back to you as soon as possible.");
    } catch {
      showToast(
        "Couldn't send your message",
        `Email me at ${CONTACT_EMAIL} instead`,
        "error"
      );
    }
  };

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        return;
      }
      reset();
      onClose();
    },
    [reset, onClose]
  );

  return (
    <DialogRoot onOpenChange={handleOpenChange} open={isOpen}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-30 data-[state=closed]:animate-[fade-out_200ms_ease-in-out_both] data-[state=open]:animate-[fade-in_200ms_ease-in-out_both]">
          <div className="fixed inset-y-0 left-1/2 w-full max-w-page -translate-x-1/2">
            <div className="mx-px h-full bg-canvas/95 backdrop-blur-sm" />
          </div>
        </DialogOverlay>
        <DialogContent
          className="fixed inset-0 z-40 overflow-y-auto data-[state=closed]:animate-[dialog-out_600ms_var(--ease-spring-dialog)_both,blur-out_600ms_var(--ease-spring-dialog)_50ms_both] data-[state=open]:animate-[dialog-in_600ms_var(--ease-spring-dialog)_both,blur-in_600ms_var(--ease-spring-dialog)_50ms_both]"
          onOpenAutoFocus={focusDialog}
        >
          <div className="relative mx-auto flex min-h-screen max-w-page items-center justify-center">
            <DialogClose asChild>
              <Button
                className={cn("absolute z-60", CORNER_INSET)}
                variant="pill"
              >
                Close
              </Button>
            </DialogClose>

            <div className="w-full max-w-136 space-y-12 px-8 py-12">
              <div className="space-y-2">
                <DialogTitle asChild>
                  <h2 className={TEXT_DISPLAY}>Get in Touch</h2>
                </DialogTitle>
                <DialogDescription asChild>
                  <p className={TEXT_BODY}>
                    Fill out the form below. Or reach me directly at{" "}
                    <a
                      className="hover-fade text-ink"
                      href={`mailto:${CONTACT_EMAIL}`}
                    >
                      {CONTACT_EMAIL}
                    </a>{" "}
                    or{" "}
                    <a
                      className="hover-fade text-ink"
                      href={CONTACT_PHONE.href}
                    >
                      {CONTACT_PHONE.display}
                    </a>
                    .
                  </p>
                </DialogDescription>
              </div>

              <form
                className="space-y-5"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex gap-4">
                  <Field
                    error={errors.name}
                    id="name"
                    label="Name"
                    placeholder="John Doe"
                    register={register("name")}
                  />
                  <Field
                    error={errors.email}
                    id="email"
                    label="Email"
                    placeholder="your@email.com"
                    register={register("email")}
                    type="email"
                  />
                </div>

                <div className="flex gap-4">
                  <Field
                    hint={
                      <span className="text-dim-gray-100"> (optional)</span>
                    }
                    id="phone"
                    label="Phone"
                    placeholder="+1 (555) 000-0000"
                    register={register("phone")}
                    type="tel"
                  />
                  <div className="flex-1" />
                </div>

                <Field
                  error={errors.message}
                  id="message"
                  label="Message"
                  multiline
                  placeholder="I'm looking for help with..."
                  register={register("message")}
                />

                <input
                  aria-hidden="true"
                  autoComplete="off"
                  className="hidden"
                  name="_honey"
                  ref={honeyRef}
                  tabIndex={-1}
                  type="text"
                />

                <Button
                  disabled={isSubmitting || !isValid}
                  type="submit"
                  variant="pillLg"
                >
                  {isSubmitting ? "Sending…" : "Send"}
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}
