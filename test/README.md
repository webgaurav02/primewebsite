# Tests

Vitest. Two tiers:

- **`test/unit/`** — pure logic, no DB: password hashing, PII field encryption,
  token hashing, RBAC matrix, rate limiter, Zod validation.
- **`test/db/`** and **`test/integration/`** — run against a **real Postgres**
  (`prime_portal_test`) as the least-privilege `prime_app` role, so they prove
  the actual RLS policies, the audit hash-chain, ticket allocation, and the full
  auth lifecycle (register → verify → login → lockout → reset) end-to-end.

## Run

```bash
npm test            # auto-runs test:db:setup (pretest), then the suite
npm run test:watch  # watch mode
```

`pretest` creates + migrates `prime_portal_test`. It needs a local Postgres and
a superuser login (defaults to `$USER`); override the owner connection with
`TEST_DATABASE_URL_MIGRATOR` if needed. The app role/URL used by the tests is set
in `vitest.config.ts` (`test.env`).

## How server modules are tested

Vitest runs modules directly (no Next bundler), so `vitest.config.ts` aliases the
`server-only` guard and `next/headers` to test stubs (`test/stubs/`). Everything
else — Postgres, RLS, scrypt, AES-GCM, the audit functions — is the real thing.
