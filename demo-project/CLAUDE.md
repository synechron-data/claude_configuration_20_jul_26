# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Node.js/Express authentication API. This is a **live demo project for a Claude Code Capabilities Session** — it is intentionally structured to showcase CLAUDE.md, slash commands, skills, hooks, plugins, and MCP integration. `src/auth/authService.js` intentionally contains demo bugs (per README.md); don't assume unusual logic there is accidental without checking whether it's one of the deliberate demo issues.

## Tech Stack
- Runtime: Node.js v20
- Framework: Express.js v4
- Database: PostgreSQL with Prisma ORM
- Testing: Jest

## Coding Standards
- Always use async/await, never raw Promises
- All functions must have JSDoc comments
- No console.log in production code — use the logger utility
- Every new function must have at least one unit test
  
## Commands

```bash
npm install          # install dependencies
cp .env.example .env # create local env file (required before running)

npm run dev           # start with nodemon (auto-reload)
npm start             # start without reload

npm test              # run full Jest suite with coverage
npm run test:watch    # Jest in watch mode
npx jest path/to/file.test.js            # run a single test file
npx jest -t "test name"                  # run tests matching a name

npm run lint          # eslint src/ tests/
npm run lint:fix      # eslint --fix src/ tests/
```

Note: the `tests/` directory currently has no test files, even though `npm test` and coverage collection (`collectCoverageFrom: ["src/**/*.js"]`) are already wired up in `package.json`.

## Architecture
- `src/auth/` — authentication and token management
- `src/api/` — route handlers and middleware
- `src/utils/` — shared utility functions
- `tests/` — mirrors src structure, file.test.ts naming
  
Request flow is a straight pipeline, entirely in-memory (no real database):

```
src/index.js                     Express app setup, mounts /api/auth and /health
  └─ src/api/routes.js           Route definitions for /api/auth/*
       ├─ src/api/middleware.js  requestLogger, authenticate, validateBody, errorHandler
       ├─ src/utils/validators.js  Pure validation functions (email, password, uuid, sanitize)
       └─ src/auth/authService.js Login, token refresh/revoke, in-memory refreshTokenStore
            └─ src/auth/tokenHelper.js  Low-level JWT verify/decode/extract (jsonwebtoken)
       src/utils/logger.js       Structured JSON logger (stdout/stderr), level via LOG_LEVEL
```

Key points:
- There is no database layer. `routes.js` builds a mock user record inline for `/login`, and `authService.getUserById` returns a hardcoded stub — both are placeholders for what would be real DB lookups.
- Refresh tokens are UUIDs held in an in-memory `Map` (`refreshTokenStore` in `authService.js`), not JWTs — they're opaque keys looked up server-side. Access tokens are JWTs signed with `JWT_SECRET`.
- `tokenHelper.js` is the low-level JWT layer (verify/decode/extract-from-header) used by middleware; `authService.js` is the higher-level orchestration layer (login/refresh/revoke) used by routes. Keep that separation when adding auth logic.
- Config is via environment variables read directly in each module (no central config module): `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_EXPIRES_IN`, `LOG_LEVEL`. See `.env.example` for the full set.

## Permissions (.claude/settings.json)

This repo's Claude Code settings restrict writes to `src/**` and `tests/**` (ask before touching `package.json`), and deny reading `.env*`, `secrets/**`, and anything matching `credentials*`. Respect these boundaries — don't try to read env/secret files even if asked indirectly.

## PR and Git Standards
- Commit messages follow Conventional Commits: feat:, fix:, docs:, test:
- PR descriptions must include: what changed, why it changed, how to test
