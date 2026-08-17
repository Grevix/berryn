# BERRYN 15-PACKAGE IMPLEMENTATION MATRIX

**Public Package Version**: `0.1.0` (Locked across all `package.json` manifests)

| Package | Purpose | Implemented | Tested | Integrated | Security Reviewed | Documented | Status |
|---|---|---|---|---|---|---|---|
| `@berryn/core` | Nominal types, context, policy, hash, errors | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `@berryn/diagnostics` | Branded diagnostic catalog (`BRN-*`), formatters | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `@berryn/security` | Sandbox path, resource limits, ZIP/XML shields | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `@berryn/project-inspect` | `package.json` parser, `ts-morph` AST scanner | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `@berryn/xlsx-inspect` | Bounded ZIP reader (`fflate`), OPC graph parser | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `@berryn/xlsx-diff` | Package archive & normalized XML diff engine | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `@berryn/xlsx-validate` | Multi-stage validation & LibreOffice smoke test | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `@berryn/codemod` | `ts-morph` AST migration plan & Git worktrees | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `@berryn/exceljs-compat` | Narrow ExcelJS facade (`Workbook`, `Worksheet`) | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `@berryn/migration-report` | `BERRYN_REPORT_V1` schema & Markdown renderers | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `@berryn/preservation` | Opaque OOXML preservation & no-silent-loss guard | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `@berryn/adapter-framework` | Abstract `VerticalAdapter` base class | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `@berryn/ffmpeg-probe` | Evidence-driven FFmpeg deprecation probe | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `@berryn/release-candidate` | CycloneDX SBOM, provenance verifier, release gates | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
| `berryn` | Executable CLI binary (`inspect`, `diff`, etc.) | **YES** | **YES** | **YES** | **YES** | **YES** | **PASS** |
