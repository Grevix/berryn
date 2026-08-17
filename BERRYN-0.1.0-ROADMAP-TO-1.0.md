# BERRYN TECHNICAL ROADMAP (0.1.0 → 1.0.0 UNDER 0.1.0 UMBRELLA)

**Public Version**: `0.1.0`  
**Internal Maturity Stages**: Stage 0.1 through Stage 1.0

---

## 1. Stage Capabilities & Verification Summary

| Stage | Milestone Name | Key Engineering Capabilities | Implemented Package / Module | Verification Status |
|---|---|---|---|---|
| **0.1** | Foundation & Evidence Probe | Branded types, envelopes, diagnostic catalog, ZIP/OPC inspection, package diff, XML diff, reports | `@berryn/core`<br/>`@berryn/diagnostics`<br/>`@berryn/security`<br/>`@berryn/project-inspect`<br/>`@berryn/xlsx-inspect`<br/>`@berryn/xlsx-diff`<br/>`@berryn/migration-report` | **PASSED** |
| **0.2** | Safe Migration Assistance | Reversible `ts-morph` AST migration plan, unified `.patch` previews, Git worktree manager | `@berryn/codemod` | **PASSED** |
| **0.3** | Real-Fixture Validation | Structural, OPC relationship, semantic XML, and headless LibreOffice consumer validators | `@berryn/xlsx-validate` | **PASSED** |
| **0.4** | ExcelJS Compatibility Facade | Narrow import-compatible facade (`Workbook`, `Worksheet`, `Cell`), loud failure error | `@berryn/exceljs-compat` | **PASSED** |
| **0.5** | CI Migration Infrastructure | CLI executable binary, stable exit codes (0, 2, 3, 4, 5, 10), GitHub Action, CI pipeline | `berryn` CLI<br/>`action.yml`<br/>`.github/workflows/ci.yml` | **PASSED** |
| **0.6** | Bounded Preservation | Preservation manifests (`PreservationManifest`), no-silent-loss mutation guards | `@berryn/preservation` | **PASSED** |
| **0.7** | Production Hardening | Benchmark suite, hardened resource limits, memory/CPU safeguards | `@berryn/core` | **PASSED** |
| **0.8** | Adapter Framework & Probe | Abstract `VerticalAdapter` base class, `fluent-ffmpeg` probe recommending direct spawn | `@berryn/adapter-framework`<br/>`@berryn/ffmpeg-probe` | **PASSED** |
| **0.9** | Release Candidate Infrastructure | CycloneDX SBOM generator, provenance verifier, release gate auditor | `@berryn/release-candidate` | **PASSED** |
| **1.0** | Stable Evidence Contract | Monorepo architectural completeness & CLI contract stability | Monorepo root / `berryn` | **PASSED** |
