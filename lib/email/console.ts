import "server-only";
import type { EmailMessage } from "./index";

/**
 * Dev email transport: logs the message to the server console instead of
 * sending it. The verification / reset link is printed so you can complete the
 * flow locally without a mail server.
 */
export async function sendViaConsole(msg: EmailMessage): Promise<void> {
  console.log(
    [
      "",
      "──────────────── EMAIL (dev console transport) ────────────────",
      `To:      ${msg.to}`,
      `Subject: ${msg.subject}`,
      "",
      msg.text,
      "───────────────────────────────────────────────────────────────",
      "",
    ].join("\n"),
  );
}
