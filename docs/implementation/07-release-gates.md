# BERRYN RELEASE GATES MATRIX

**Rule**: *All release gates marked REQUIRED block publication when failing.*

| Release Gate | Verification Method | Status |
|---|---|---|
| **1. Strict TypeScript Compilation** | `npx tsc --build` (0 errors) | **REQUIRED** |
| **2. Unit & Security Tests** | `npx vitest run` (100% pass) | **REQUIRED** |
| **3. Security Controls & Guards** | Path sandbox, ZIP bomb, XXE checks | **REQUIRED** |
| **4. No Silent Data Loss** | Opaque part preservation assertion | **REQUIRED** |
| **5. SBOM Generation** | CycloneDX 1.5 JSON generation | **REQUIRED** |
| **6. Provenance Verification** | npm OIDC attestation statement audit | **REQUIRED** |
| **7. Clean CLI Smoke Test** | `node packages/cli/dist/index.js inspect` | **REQUIRED** |
