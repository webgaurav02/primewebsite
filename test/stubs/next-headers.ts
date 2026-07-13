// Test stub for next/headers. Only `headers()` is used by code under test
// (lib/audit/log.ts reads x-forwarded-for). Returns an empty header bag so the
// audit path runs without a live request scope.
export async function headers(): Promise<{ get(name: string): string | null }> {
  return { get: () => null };
}

export async function cookies(): Promise<{
  get(): undefined;
  set(): void;
  delete(): void;
}> {
  return { get: () => undefined, set: () => {}, delete: () => {} };
}
