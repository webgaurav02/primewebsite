/**
 * Shared discriminated form state for `useActionState`-driven forms, plus a
 * helper to pull a field's first error. Kept dependency-free so both client
 * form components and server actions can import it.
 */
export type FormState =
  | { status: "idle" }
  | { status: "success"; message?: string }
  | {
      status: "error";
      fieldErrors?: Record<string, string[]>;
      formError?: string;
    };

export const IDLE: FormState = { status: "idle" };

export function fieldError(state: FormState, name: string): string | undefined {
  return state.status === "error" ? state.fieldErrors?.[name]?.[0] : undefined;
}

export function formError(state: FormState): string | undefined {
  return state.status === "error" ? state.formError : undefined;
}
