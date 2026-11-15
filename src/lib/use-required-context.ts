import { useContext } from "react";
import type { Context } from "react";

/** Reads a context that must have a provider above it; throws a clear error otherwise. */
export const useRequiredContext = <T>(
  context: Context<T | null>,
  hookName: string
): T => {
  const value = useContext(context);
  if (!value) {
    throw new Error(`${hookName} must be used within ${context.displayName}`);
  }
  return value;
};
