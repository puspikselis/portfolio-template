"use client";

import { useCallback, useSyncExternalStore } from "react";

// The server cannot know the answer, so it and the hydrating client render `null`.
const unknown = (): null => null;

/** Whether `query` matches, kept live; `null` on the server and during hydration. */
export const useMediaQuery = (query: string): boolean | null => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query]
  );
  return useSyncExternalStore(subscribe, getSnapshot, unknown);
};
