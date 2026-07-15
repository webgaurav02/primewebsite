/**
 * Tiny structured logger. Emits ONE JSON line per event to stdout/stderr, which
 * Azure App Service captures in the container Log Stream
 * (Portal → Log stream, or `az webapp log tail`). One line per event keeps it
 * greppable and machine-parseable.
 *
 * PII rule (this is a DPDP-regulated gov app): never log raw email, mobile,
 * passwords, tokens, or request bodies. Mask emails with maskEmail(); pass only
 * non-identifying context (registrantType, flags, timings, error name/message).
 */

type Fields = Record<string, unknown>;

function emit(level: "info" | "warn" | "error", event: string, fields?: Fields): void {
  let line: string;
  try {
    line = JSON.stringify({ ts: new Date().toISOString(), level, event, ...fields });
  } catch {
    line = JSON.stringify({ ts: new Date().toISOString(), level, event, note: "unserializable-fields" });
  }
  // eslint-disable-next-line no-console -- this module IS the logging boundary
  (level === "error" ? console.error : level === "warn" ? console.warn : console.log)(line);
}

export const log = {
  info: (event: string, fields?: Fields) => emit("info", event, fields),
  warn: (event: string, fields?: Fields) => emit("warn", event, fields),
  error: (event: string, fields?: Fields) => emit("error", event, fields),
};

/** Mask an email for correlation without persisting the PII: `a***@example.com`. */
export function maskEmail(email: unknown): string {
  if (typeof email !== "string" || !email) return "";
  const at = email.indexOf("@");
  if (at < 1) return "***";
  return `${email[0]}***${email.slice(at)}`;
}

/** Reduce an unknown thrown value to a safe, loggable shape. */
export function errInfo(err: unknown): { name: string; message: string } {
  if (err instanceof Error) return { name: err.name, message: err.message };
  return { name: "NonError", message: String(err) };
}
