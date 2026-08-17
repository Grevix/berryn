# GITHUB CI LOCAL PARITY SPECIFICATION

**CI Configuration**: [`.github/workflows/ci.yml`](file:///c:/Users/Aaryan%20Rawat/Downloads/Berryn/.github/workflows/ci.yml)  
**Runner Environment**: `ubuntu-latest` (Node.js 22 LTS, pnpm v9+)

---

## Workflow Step Parity Mapping

| Step Number | GitHub Actions Step Name | GitHub Command | Local Verification Command | Local Status |
|---|---|---|---|---|
| 1 | Checkout Source Code | `actions/checkout@v4` | Local workspace checkout | **PASS** |
| 2 | Setup Node.js 22 LTS | `actions/setup-node@v4` | Node.js 22 LTS runtime | **PASS** |
| 3 | Setup pnpm | `pnpm/action-setup@v3` | pnpm 11.22.0 workspace | **PASS** |
| 4 | Install Dependencies | `pnpm install --frozen-lockfile` | `npx pnpm install --frozen-lockfile` | **PASS** |
| 5 | Typecheck TypeScript Packages | `pnpm run typecheck` | `npx tsc --build` | **PASS (0 errors)** |
| 6 | Execute Vitest Suite | `pnpm test` | `npx vitest run` | **PASS (24/24 tests)** |
| 7 | Build Monorepo Packages | `pnpm run build` | `npx tsc --build` | **PASS (0 errors)** |
| 8 | Run Berryn CLI Smoke Test | `node packages/cli/dist/index.js inspect . --project --format markdown` | `node packages/cli/dist/index.js inspect . --project --format markdown` | **PASS (Exit code 0)** |

---

## Clean-Room Verification Procedure
To reproduce the GitHub Actions execution environment locally from scratch:
```bash
npx tsc --build --clean
npx pnpm install --frozen-lockfile
npx tsc --build
npx vitest run
node packages/cli/dist/index.js inspect . --project --format markdown
```
