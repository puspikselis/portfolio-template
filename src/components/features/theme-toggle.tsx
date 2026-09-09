"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // ponytail: renders nothing until mounted — theme is unknowable during SSR
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    setDark(
      root.classList.contains("dark") ||
        (!root.classList.contains("light") &&
          matchMedia("(prefers-color-scheme: dark)").matches)
    );
  }, []);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      document.documentElement.classList.toggle("light", !next);
      localStorage.theme = next ? "dark" : "light";
      return next;
    });
  }, []);

  if (dark === null) {
    return <div aria-hidden="true" className="size-9" />;
  }

  return (
    <Button
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="size-9 rounded-full px-0 text-nobel-100 hover:text-ink"
      onClick={toggle}
      variant="unstyled"
    >
      {dark ? (
        <svg
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
          viewBox="0 0 16 16"
        >
          <circle cx="8" cy="8" r="3.25" />
          <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M12.6 3.4l-1.06 1.06M4.46 11.54L3.4 12.6" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 16 16"
        >
          <path d="M13.5 9.5A5.75 5.75 0 0 1 6.5 2.5a5.75 5.75 0 1 0 7 7Z" />
        </svg>
      )}
    </Button>
  );
}
