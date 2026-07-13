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
    },
  },
});
