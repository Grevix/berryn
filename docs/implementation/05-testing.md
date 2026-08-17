# BERRYN TESTING CONSTITUTION

---

## 1. Testing Pyramid

```
                  ┌──────────────────────┐
                  │   Release Verification│
                  │   (Provenance, SBOM) │
                  ├──────────────────────┤
                  │  Consumer Smoke Test │
                  │     (LibreOffice)    │
                  ├──────────────────────┤
                  │ Integration & Diff   │
                  │   (Package & XML)    │
                  ├──────────────────────┤
                  │ Unit & Security Test │
                  │  (Vitest Unit Suite) │
                  └──────────────────────┘
```

---

## 2. Test Execution Commands

- **Unit Suite**: `npx vitest run` (Executes core, security, preservation, release candidate, and adapter tests).
- **TypeScript Typecheck**: `npx tsc --build` (Verifies strict type references across all 15 workspace packages).
- **CLI Smoke Test**: `node packages/cli/dist/index.js inspect . --project`
