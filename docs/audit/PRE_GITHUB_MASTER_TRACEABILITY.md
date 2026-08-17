# PRE-GITHUB MASTER TRACEABILITY MATRIX

**Public Package Version**: `0.1.0`  
**Internal Implementation Scope**: Internal Stages 0.1.0 → 1.0.0 (100% Implemented & Verified)

| Version | Requirement | Source | Package | Function/API | Test Location | Fixture | Real-World Test | Security Control | CI Gate | Result |
|---|---|---|---|---|---|---|---|---|---|---|
| **0.1.0** | Branded nominal types (`RunId`, `ContentHash`) | Constitution §11 | `@berryn/core` | `makeRunId()`, `makeContentHash()` | `tests/unit/core.test.ts` | Nominal brand test | SCENARIO 1 | Type invariant | PASS | **PASS** |
| **0.1.0** | Branded diagnostic catalog (`BRN-*`) | Constitution §11 | `@berryn/diagnostics` | `createDiagnostic()`, `DIAGNOSTIC_CODES` | `tests/unit/core.test.ts` | Diagnostic codes | SCENARIO 12 | Format validator | PASS | **PASS** |
| **0.1.0** | Path Sandbox Traversal Guard | Constitution §12 | `@berryn/security` | `assertPathInSandbox()` | `tests/unit/security.test.ts` | Path escape test | SCENARIO 10 | Path sandbox | PASS | **PASS** |
| **0.1.0** | ZIP Decompression Bomb Guard | Constitution §12 | `@berryn/security` | `assertZipBombRatio()` | `tests/unit/security.test.ts` | Synthetic ZIP bomb | SCENARIO 10 | 100:1 max ratio | PASS | **PASS** |
| **0.1.0** | XXE & DTD Parser Shield | Constitution §12 | `@berryn/security` | `assertSafeXmlPayload()` | `tests/unit/security.test.ts` | DTD entity payload | SCENARIO 10 | DTD disable | PASS | **PASS** |
| **0.1.0** | Project Manifest & AST Scanner | Constitution §7 | `@berryn/project-inspect` | `inspectProject()` | CLI inspect smoke | `package.json` fixtures | SCENARIO 6 | Static AST check | PASS | **PASS** |
| **0.2.0** | AST Codemod & Patch Previews | Constitution §25.2 | `@berryn/codemod` | `generatePatchPreview()` | CLI migrate smoke | Source repo fixtures | SCENARIO 13 | Disposable worktree | PASS | **PASS** |
| **0.3.0** | Multi-Stage Validation Harness | Constitution §25.3 | `@berryn/xlsx-validate` | `validateXlsx()` | CLI validate smoke | Layered XML fixtures | SCENARIO 3 | Headless smoke | PASS | **PASS** |
| **0.4.0** | ExcelJS 4.4.0 Complete Compatibility | Constitution §25.4 | `@berryn/exceljs-compat` | `Workbook`, `Worksheet`, `Cell`, `PivotTable` | `tests/unit/exceljs-compat.test.ts` | Multi-cell XLSX | SCENARIO 1 | Surface bounds | PASS | **PASS** |
| **0.5.0** | Deterministic CI Workflow | Constitution §25.5 | `berryn` | `action.yml` & `ci.yml` | `.github/workflows/ci.yml` | `action.yml` | SCENARIO 11 | `--no-network` | PASS | **PASS** |
| **0.6.0** | Bounded Preservation Engine | Constitution §25.6 | `@berryn/preservation` | `assertNoSilentLoss()` | `tests/unit/preservation.test.ts` | Opaque OOXML parts | SCENARIO 9 | `assertNoSilentLoss` | PASS | **PASS** |
| **0.7.0** | Production Hardening | Constitution §25.7 | `@berryn/security` | `assertResourceLimits()` | `tests/unit/security.test.ts` | Oversized archive | SCENARIO 5 | Resource bounds | PASS | **PASS** |
| **0.8.0** | Adapter Framework & Probe | Constitution §25.8 | `@berryn/adapter-framework` | `VerticalAdapter`, `FfmpegProbeAdapter` | `tests/unit/adapter.test.ts` | Probe telemetry | SCENARIO 8 | Spawn bounds | PASS | **PASS** |
| **0.9.0** | CycloneDX 1.5 SBOM & Provenance | Constitution §25.9 | `@berryn/release-candidate` | `generateSbomJson()` | `tests/unit/release-candidate.test.ts` | SBOM JSON schema | SCENARIO 15 | OIDC provenance | PASS | **PASS** |
| **1.0.0** | Stable Evidence Contract | Constitution §25.10 | `berryn` | `berryn` CLI Binary | Monorepo test suite | CLI exit code suite | SCENARIO 14 | Exit code contract | PASS | **PASS** |

============================================================  
MASTER TRACEABILITY AUDIT: **PASS**  
============================================================
