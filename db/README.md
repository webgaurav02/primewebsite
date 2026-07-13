# Database — Postgres + Row-Level Security

This is the **live data store** for the portal. The app connects through the
Data Access Layer only (`lib/dal/*` via `lib/db/client.ts`) — the DAL is the
sole module that touches storage.

## Why Postgres (and not Mongo, for this data)

RLS gives a **second, independent authorization layer** at the database. The DAL
already checks role + region, but RLS means that even a buggy or future query
physically cannot return another region's grievance, and the audit log is
append-only at the engine level. Mongo has no equivalent.

## Setup

```bash
# Postgres: either a local service, or `docker compose up -d` (see docker-compose.yml)
createdb prime_portal_dev                    # skip when using docker-compose
cp .env.example .env.local                   # fill DATABASE_URL(_MIGRATOR), PII_ENCRYPTION_KEY
npm run db:migrate                           # applies db/migrations/*.sql in order
npm run db:seed                              # dev admins + sample grievances (idempotent)
```

Migrations run as the owner/superuser (`DATABASE_URL_MIGRATOR`); in dev the
runner also creates the `prime_app` / `prime_audit` roles if missing. The app
itself must run as `prime_app` (`DATABASE_URL`) or RLS is silently bypassed.
`db/schema.sql` is the original design document; the migrations are canonical.

Audit entries are written exclusively through the `record_audit()` SECURITY
DEFINER function (owned by `prime_audit`) — `prime_app` has no direct INSERT on
`audit_log` — and the chain is checked in-database by `verify_audit_chain()`.

## The contract the DAL must honor

RLS policies read two per-request settings. The DAL must open a transaction and
set them from the **server-verified** session before any query:

```sql
BEGIN;
SET LOCAL app.current_admin_id   = '<uuid from verified session>';
SET LOCAL app.current_admin_role = '<role from verified session>';
-- ... queries ...
COMMIT;
```

- Use `SET LOCAL` (transaction-scoped) so settings never leak across pooled
  connections.
- Connect as `prime_app` (non-owner, non-superuser) — RLS is bypassed for owners
  even with `FORCE`, so the login role matters.

## PII encryption

`complainant_*_enc` columns store ciphertext. Encrypt in the app with a key from
your secret manager (envelope encryption), decrypt only for callers holding
`grievance:read_pii`. Disk-level "encryption at rest" is necessary but **not
sufficient** — the threat is exposure of complainant identity, which requires
field-level control.

## Audit retention

Keep `audit_log` ≥ **180 days** (CERT-In). Ship a copy off-box so an admin with
DB access cannot edit their own trail, and run `verifyAuditChain()`
(`lib/audit/log.ts`) on a schedule to detect tampering.
