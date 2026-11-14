// Minimal types for the parts of `bun:test` these tests use, so `tsc` passes
// without adding @types/bun as a dependency.
declare module "bun:test" {
  interface Matchers {
    not: Matchers;
    toBe: (expected: unknown) => void;
    toBeGreaterThanOrEqual: (expected: number) => void;
    toBeLessThanOrEqual: (expected: number) => void;
    toBeNull: () => void;
    toBeUndefined: () => void;
    toContain: (expected: unknown) => void;
    toContainEqual: (expected: unknown) => void;
    toEqual: (expected: unknown) => void;
    toMatchObject: (expected: object) => void;
    toStartWith: (expected: string) => void;
  }
  export function describe(name: string, fn: () => void): void;
  export function expect(actual: unknown): Matchers;
  export function test(name: string, fn: () => void | Promise<void>): void;
}
