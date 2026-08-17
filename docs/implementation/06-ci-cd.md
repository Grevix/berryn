# BERRYN CI/CD PIPELINE SPECIFICATION

---

## 1. Pipeline Architecture

The CI pipeline is defined in [`.github/workflows/ci.yml`](file:///c:/Users/Aaryan%20Rawat/Downloads/Berryn/.github/workflows/ci.yml) and supported by [`action.yml`](file:///c:/Users/Aaryan%20Rawat/Downloads/Berryn/action.yml).

### Workflow Steps:
1. **Checkout**: `actions/checkout@v4`
2. **Setup Node**: `actions/setup-node@v4` (Node.js 22 LTS)
3. **Setup pnpm**: `pnpm/action-setup@v3` (pnpm 9)
4. **Install Dependencies**: `pnpm install --frozen-lockfile`
5. **Typecheck**: `pnpm run typecheck` (`tsc --build`)
6. **Unit Tests**: `pnpm test` (`vitest run`)
7. **Build**: `pnpm run build`
8. **CLI Smoke**: `node packages/cli/dist/index.js inspect . --project`

---

## 2. GitHub Action Action.yml Interface

The `action.yml` step allows Berryn to run directly inside user repositories to enforce continuous migration risk checks.
