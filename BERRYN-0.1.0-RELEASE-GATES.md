# BERRYN RELEASE GATES & ROLLBACK PROTOCOL

**Public Package Version**: `0.1.0`

---

## 1. Release Validation Gates Matrix

| Release Gate | Verification Command | Requirement | Status |
|---|---|---|---|
| **1. Strict TypeScript Compilation** | `npx tsc --build` | 0 errors across 15 packages | **PASSED** |
| **2. Unit & Integration Tests** | `npx vitest run` | 14/14 tests passing | **PASSED** |
| **3. Security Shield & Sandbox** | `assertPathInSandbox`, `assertZipBombRatio`, `assertSafeXmlPayload` | 0 security bypasses | **PASSED** |
| **4. No Silent Data Loss Invariant** | `assertNoSilentLoss()` | Opaque parts preserved | **PASSED** |
| **5. CycloneDX SBOM Generation** | `generateSbomJson()` | Valid CycloneDX 1.5 JSON | **PASSED** |
| **6. npm Provenance Verification** | `verifyProvenanceAttestation()` | Valid attestation statement | **PASSED** |
| **7. CLI Binary Smoke Test** | `node packages/cli/dist/index.js inspect . --project` | Exit code 0 | **PASSED** |

---

## 2. Emergency Rollback Protocol

In the event of a critical post-release issue:
1. Deprecate affected package version on npm (`npm deprecate`).
2. Publish fixed patch update under public version `0.1.0`.
3. Retain forensic hashes and add a regression test to `tests/unit/`.
