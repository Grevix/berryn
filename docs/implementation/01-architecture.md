# BERRYN ARCHITECTURE & PACKAGE BOUNDARIES (ROADMAP 0.1 → 1.0)

**Public Version**: `0.1.0`  
**Internal Scope**: Stages 0.1 → 1.0

---

## 1. System Architecture Diagram

```
                 BERRYN CLI (berryn)
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
   PROJECT INSPECTION             XLSX / ADAPTER INSPECTION
 (@berryn/project-inspect)        (@berryn/xlsx-inspect, @berryn/adapter-framework)
        │                                 │
        ▼                                 ▼
    MIGRATION PLAN / CODEMOD        DIFF ENGINE
    (@berryn/codemod)            (@berryn/xlsx-diff)
        │                                 │
        └────────────────┬────────────────┘
                         ▼
                 VALIDATION HARNESS
              (@berryn/xlsx-validate)
                         │
                         ▼
                PRESERVATION ENGINE
              (@berryn/preservation)
                         │
                         ▼
                EVIDENCE REPORT SCHEMAS
              (@berryn/migration-report)
                         │
                         ▼
                RELEASE CANDIDATE / GATES
             (@berryn/release-candidate)
```

---

## 2. Package Responsibilities & Security Boundaries

1. **`@berryn/core`**: Run context, execution policy, nominal branded types (`RunId`, `ContentHash`), result envelopes (`ResultEnvelope<T>`), hash utilities.
2. **`@berryn/diagnostics`**: Branded diagnostic code catalog (`BRN-SEC-*`, `BRN-XLSX-*`, `BRN-PROJ-*`, `BRN-VAL-*`, `BRN-COMPAT-*`, `BRN-CODE-*`), location formatters.
3. **`@berryn/security`**: Path traversal sandbox (`assertPathInSandbox`), resource limits (`assertResourceLimits`), ZIP bomb ratio guard, XXE/DTD parser shield.
4. **`@berryn/project-inspect`**: Manifest inspector (`package.json`), TypeScript AST scanner (`ts-morph`).
5. **`@berryn/xlsx-inspect`**: Bounded ZIP reader (`fflate`), OPC parser (`fast-xml-parser`), 5-tier classification engine.
6. **`@berryn/xlsx-diff`**: ZIP entry package diff, normalized XML string diff, semantic workbook diff.
7. **`@berryn/xlsx-validate`**: Structural, OPC relationship, semantic XML, and headless LibreOffice consumer validators.
8. **`@berryn/codemod`**: `ts-morph` AST codemod generator, unified `.patch` preview generator, disposable Git worktree manager. Zero regex search/replace.
9. **`@berryn/exceljs-compat`**: Narrow import-compatible ExcelJS facade (`Workbook`, `Worksheet`, `Cell`), loud failure mechanics (`BerrynCompatibilityError`).
10. **`@berryn/migration-report`**: `BERRYN_REPORT_V1` JSON schema validator, JSON & Markdown summary renderers.
11. **`@berryn/preservation`**: Opaque OOXML part preservation, preservation manifests (`PreservationManifest`), no-silent-loss mutation guards (`assertNoSilentLoss`).
12. **`@berryn/adapter-framework`**: Abstract `VerticalAdapter` base class for multi-vertical migration probes.
13. **`@berryn/ffmpeg-probe`**: Research probe evaluating `fluent-ffmpeg` deprecation & direct `child_process.spawn("ffmpeg")` recommendations.
14. **`@berryn/release-candidate`**: CycloneDX SBOM generator (`generateSbomJson`), release gate auditor (`auditReleaseGates`), npm provenance attestation verifier.
15. **`berryn` (CLI)**: Command-line binary orchestrating all operations with stable exit codes (0, 2, 3, 4, 5, 10).
