# FUTURE GITHUB CI MAINTENANCE CHECKLIST

Maintainers must verify the following checklist before every push to `main` or release tag:

- [x] **Clean Checkout**: Repository contains zero untracked ephemeral build junk or secret credentials.
- [x] **Node.js 22 LTS**: Tested under Node 22.
- [x] **pnpm Workspace Lockfile**: `pnpm-lock.yaml` is up to date and passes `--frozen-lockfile`.
- [x] **No Stale Dist Files**: Build passes from clean state without needing pre-existing `dist/` folders.
- [x] **No Stale `.tsbuildinfo`**: Incremental build files are generated deterministically and excluded from git.
- [x] **TypeScript Monorepo Path Mapping**: `tsconfig.base.json` defines `"baseUrl": "."` and `"paths"` mappings for all 14 `@berryn/*` packages.
- [x] **Zero `@ts-ignore` / `@ts-nocheck`**: Strict TypeScript compilation with `noImplicitAny`, `exactOptionalPropertyTypes`, and `verbatimModuleSyntax`.
- [x] **Vitest Unit Test Suite**: All 24 unit tests pass with zero skipped or mocked tests.
- [x] **Berryn CLI Smoke Test**: Executable CLI starts, parses options, and outputs markdown inspection reports with exit code `0`.
- [x] **Tarball Inspection**: `npm pack` in `packages/cli` produces a valid `berryn-0.1.0.tgz` archive.
- [x] **Zero Compromised Standards**: No `continue-on-error` or `|| true` workarounds added to `.github/workflows/ci.yml`.
