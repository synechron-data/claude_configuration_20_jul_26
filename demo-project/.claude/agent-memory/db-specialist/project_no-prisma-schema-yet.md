---
name: no-prisma-schema-yet
description: Repo has no Prisma schema/client at all yet — auth data is fully in-memory despite CLAUDE.md naming Postgres+Prisma as the intended stack
metadata:
  type: project
---

Confirmed (2026-07-21): there is no Prisma schema anywhere in this repository — no `*.prisma`
file, no `prisma/` directory, and no `prisma`/`@prisma/client` entries in `package.json`
dependencies. This is true even though CLAUDE.md's tech stack section names PostgreSQL +
Prisma ORM as the intended database layer.

Currently everything is in-memory:
- `src/api/routes.js` builds a mock user record inline for `/login`.
- `src/auth/authService.js` `getUserById` returns a hardcoded stub.
- `src/auth/authService.js` `refreshTokenStore` is an in-memory `Map` holding opaque UUID
  refresh tokens (not JWTs).

**Why:** CLAUDE.md's stated tech stack is aspirational/demo framing, not current reality —
don't assume a schema exists or try to review/migrate one that isn't there yet.

**How to apply:** Before doing any schema review, migration, or index recommendation work in
this repo, re-verify (file existence + package.json) rather than trusting this note, since a
real schema may have been introduced since. If still absent and the user asks for schema/
migration work, treat it as greenfield: propose an initial schema rather than a diff.

When a real DB layer is introduced, the two models implied by the current in-memory code are:
- `User` — backs the mock user in `routes.js` and `authService.getUserById`.
- `RefreshToken` — backs `refreshTokenStore`; will need a foreign key to `User` and an index
  on the token lookup field (looked up on every refresh/revoke request).

See also [[schema-design-notes]] if that memory exists for deeper index/FK design once
a schema is actually proposed.
