# BERRYN RELEASE AUDIT: 10 - CI/CD AUDIT

- **CI Pipeline Workflow**: Defined in `.github/workflows/ci.yml`.
- **Steps Included**: Checkout, Node.js 22 setup, pnpm 9 setup, frozen lockfile install, typecheck, unit tests, build, CLI smoke test.
- **Deterministic Execution**: `--no-network` mode enforced.
