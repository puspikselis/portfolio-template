"use client";

import {
  Close as DialogClose,
  Content as DialogContent,
  Description as DialogDescription,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
  Title as DialogTitle,
} from "@radix-ui/react-dialog";
import { useCallback, useRef, useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/constants";
import { TEXT_BODY, TEXT_DISPLAY } from "@/lib/typography";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Native constraints (required, minLength, type="email") on each field decide
// validity; these are the messages shown under an invalid field.
const ERRORS = {
  email: "Enter a valid email address",
  message: "Message must be at least 10 characters",
  name: "Name must be at least 2 characters",
} as const;

type ValidatedField = keyof typeof ERRORS;
type Errors = Partial<Record<ValidatedField, string>>;
type FieldElement = HTMLInputElement | HTMLTextAreaElement;

const isValidated = (name: string): name is ValidatedField => name in ERRORS;

/** The message for every invalid validated control in the form. */
const collectErrors = (form: HTMLFormElement): Errors => {
  const errors: Errors = {};
  for (const name of Object.keys(ERRORS)) {
    const control = form.elements.namedItem(name);
    if (
      isValidated(name) &&
      (control instanceof HTMLInputElement ||
        control instanceof HTMLTextAreaElement) &&
      !control.validity.valid
    ) {
      errors[name] = ERRORS[name];
    }
  }
  return errors;
};

const formString = (data: FormData, key: string) => {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
};

// Focus the dialog itself rather than the first field, so phones don't pop the
// keyboard on open; focus must still leave the (now aria-hidden) trigger.
const focusDialog = (e: Event) => {
  e.preventDefault();
  (e.currentTarget as HTMLElement | null)?.focus();
};

export const ContactDialog = ({ isOpen, onClose }: Props) => {
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // After the first submit, leaving a field re-checks it too.
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const reset = useCallback(() => {
    formRef.current?.reset();
    setErrors({});
    setIsValid(false);
    setHasSubmitted(false);
  }, []);

  const checkField = (el: FieldElement) => {
    const { name } = el;
    if (isValidated(name)) {
      setErrors((prev) => ({
        ...prev,
        [name]: el.validity.valid ? undefined : ERRORS[name],
      }));
    }
  };

  // Every keystroke re-checks its field and the Send button's enabled state.
  const handleInput = (e: FormEvent<FieldElement>) => {
    checkField(e.currentTarget);
    setIsValid(e.currentTarget.form?.checkValidity() ?? false);
  };

  const handleBlur = (e: FormEvent<FieldElement>) => {
    if (hasSubmitted) {
      checkField(e.currentTarget);
    }
  };

  const send = async (data: FormData) => {
    const name = formString(data, "name");
    const email = formString(data, "email");
    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("phone", formString(data, "phone"));
    fd.set("message", formString(data, "message"));
    fd.set("_replyto", email);
    fd.set("_subject", `Portfolio Contact from ${name}`);

    const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
      body: fd,
      headers: { Accept: "application/json" },
      method: "POST",
    }).catch(() => null);
    if (!res?.ok) {
      showToast(
        "Couldn't send your message",
        `Email me at ${CONTACT_EMAIL} instead`,
        "error"
      );
      return;
    }

    new Audio("/audio/mail-sent.mp3").play().catch(() => {
      // autoplay blocked — the toast is confirmation enough
    });
    reset();
    onClose();
    showToast("Message sent", "I'll get back to you as soon as possible.");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setHasSubmitted(true);
    if (!form.checkValidity()) {
      setErrors(collectErrors(form));
      return;
    }
    const data = new FormData(form);
    if (formString(data, "_honey")) {
      return;
    }
    setIsSubmitting(true);
    await send(data);
    setIsSubmitting(false);
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
        <DialogOverlay className="fixed inset-0 z-30 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in">
          <div className="fixed inset-y-0 left-1/2 w-full max-w-page -translate-x-1/2">
            <div className="mx-px h-full bg-canvas/95 backdrop-blur-sm" />
          </div>
        </DialogOverlay>
        <DialogContent
          className="fixed inset-0 z-40 overflow-y-auto data-[state=closed]:animate-dialog-out data-[state=open]:animate-dialog-in"
          onOpenAutoFocus={focusDialog}
        >
          <div className="relative mx-auto flex min-h-screen max-w-page items-center justify-center">
            <DialogClose asChild>
              <Button className="z-60" placement="corner" variant="pill">
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
                      className="text-ink hover-fade"
                      href={`mailto:${CONTACT_EMAIL}`}
                    >
                      {CONTACT_EMAIL}
                    </a>{" "}
                    or{" "}
                    <a
                      className="text-ink hover-fade"
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
                onSubmit={handleSubmit}
                ref={formRef}
              >
                <div className="flex gap-4">
                  <Field
                    error={errors.name}
                    id="name"
                    label="Name"
                    minLength={2}
                    onBlur={handleBlur}
                    onInput={handleInput}
                    placeholder="John Doe"
                    required
                  />
                  <Field
                    error={errors.email}
                    id="email"
                    label="Email"
                    onBlur={handleBlur}
                    onInput={handleInput}
                    // Stricter than type="email" alone: needs a dot in the domain.
                    pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                    placeholder="your@email.com"
                    required
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
                    onBlur={handleBlur}
                    onInput={handleInput}
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                  />
                  <div className="flex-1" />
                </div>

                <Field
                  error={errors.message}
                  id="message"
                  label="Message"
                  minLength={10}
                  multiline
                  onBlur={handleBlur}
                  onInput={handleInput}
                  placeholder="I'm looking for help with..."
                  required
                />

                <input
                  aria-hidden="true"
                  autoComplete="off"
                  className="hidden"
                  name="_honey"
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
};
