import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

/**
 * Vitest runs server modules directly (no Next bundler), so two things are
 * aliased away: the `server-only` import guard (would throw outside RSC) and
 * `next/headers` (needs a live request). The DB tests hit a REAL Postgres —
 * prime_portal_test — so set it up first:  npm run test:db:setup
 */
export default defineConfig({
  resolve: {
    alias: {
      "server-only": path.join(root, "test/stubs/server-only.ts"),
      "next/headers": path.join(root, "test/stubs/next-headers.ts"),
      "@": root,
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    // DB integration tests share one Postgres; run serially to avoid
    // cross-file truncation races.
    fileParallelism: false,
    env: {
      NODE_ENV: "test",
      DATABASE_URL:
        "postgres://prime_app:prime_app_dev_password@localhost:5432/prime_portal_test",
      DATABASE_URL_MIGRATOR:
        process.env.TEST_DATABASE_URL_MIGRATOR ??
        `postgres://${process.env.USER ?? "postgres"}@localhost:5432/prime_portal_test`,
      // Fixed dev/test key (base64 of 32 bytes) — never used outside tests.
      PII_ENCRYPTION_KEY: "FJ202uLa10UnYYn0DHrHP3NiaPyxyoOMC+4OHMHldpo=",
      APP_BASE_URL: "http://localhost:3000",
      // Ed25519 PRIME ID signing keys (base64 PEM) — dev/test only.
      PRIME_ID_SIGNING_KID: "prime-ed25519-2026",
      PRIME_ID_SIGNING_PRIVATE_KEY:
        "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1DNENBUUF3QlFZREsyVndCQ0lFSUlZL1pVV0xzYmpWUkJqRXpEM3plNVdzdk4vTlRkbkxCVmN3ZnJWeUNZdXEKLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLQ==",
      PRIME_ID_SIGNING_PUBLIC_KEY:
        "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUNvd0JRWURLMlZ3QXlFQWo0czNSdGlkWUFZOW1HSTV3RysrQndjMTRpQlQ3TzlSWTNEbmdhMW1nR0U9Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQ==",
    },
  },
});
