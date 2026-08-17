# Berryn 0.1.0 Master Implementation Plan
## Umbrella Implementation Blueprint for Scope 0.1.0 → 0.5.0

---

## 1. Executive Implementation Decision

The engineering mandate for Berryn **0.1.0** is defined by a binding operational rule:

> **WHEN IMPLEMENTING VERSION 0.1.0, IMPLEMENT THE ENTIRE 0.1.0 → 0.5.0 CAPABILITY SCOPE UNDER THE PUBLIC VERSION 0.1.0 UMBRELLA, WITHOUT PUBLISHING 0.2.0–0.5.0 AS SEPARATE PUBLIC RELEASES.**

This Master Implementation Plan transforms the Berryn Product Constitution and associated master documents into a production-grade engineering blueprint. Berryn 0.1.0 is not a tiny prototype or a generic spreadsheet parser. It is a comprehensive **migration, compatibility, and validation infrastructure** release.

The first production vertical is **XLSX migration analysis and fidelity validation**. 

Historical roadmap milestones (0.1.0, 0.2.0, 0.3.0, 0.4.0, 0.5.0) are structured into internal implementation phases (`0.1.0-P0` through `0.1.0-P11`). Public distribution remains locked at `0.1.0` until all 0.1.0–0.5.0 capability gates, security controls, fixture tests, and real-repository validations pass.

---

## 2. Source Documents Analyzed

Four authoritative workspace documents were audited:

1. **`Berryn-Master-Book.md`** (132 KB, 1,369 lines): Primary text source for the product constitution, evidence discipline, threat register, package boundaries, and roadmap.
2. **`Berryn_Master_Constitution_—_Audit_Summary.pdf`** (59 KB, 2 pages): Executive summary confirming locked product identity, evidence hierarchy, audit checks, and deliberate limitations.
3. **`Berryn-Master-Constitution.pdf`** (951 KB, 59 A4 pages): Formally compiled PDF artifact containing the authoritative constitution, governance rules, and full specifications.
4. **`Berryn-Master-Book.pdf`** (398 KB): PDF compilation of the master book.

Supplementary technical specifications evaluated in the workspace context:
- `Berryn product identity brief.md` (8.7 KB)
- `Berryn 0.1.0 Technical Design Specification` (28.8 KB)
- `Berryn Version Masterplan 0.1.0 → 1.0.0` (29.2 KB)

---

## 3. Document Reconciliation

Every material requirement across all source documents was classified using the canonical evidence hierarchy (**FACT**, **INFERENCE**, **HYPOTHESIS**, **UNKNOWN**):

| Topic / Requirement | Source Document | Classification | Resolution / Authority | Implementation Impact |
|---|---|---|---|---|
| **Product Identity** | Master Book §3.1 / Identity Brief §1 | **CONSTITUTIONAL RULE** | Berryn is migration, compatibility, and validation infrastructure. XLSX is the 1st vertical. | Architecture must be vertical-neutral with XLSX as adapter 1. |
| **Umbrella Scope (0.1.0–0.5.0)** | Master Plan Prompt Directive | **CONSTITUTIONAL RULE** | Public version 0.1.0 encapsulates 0.1.0–0.5.0 capabilities. | 12 internal phases (P0–P11); single public release at P11. |
| **ExcelJS Compatibility Facade** | Master Book §15.5 | **HYPOTHESIS** | Evidence-gated subset in Phase P4 (`@berryn/exceljs-compat`). | Unsupported methods fail loudly; no false completeness claims. |
| **FFmpeg Vertical** | Master Book §15.9 | **DEFERRED / UNKNOWN** | Out of scope for 0.1.0 umbrella. Research probe only. | Do not implement FFmpeg wrapper logic in 0.1.0. |
| **Zero Silent Data Loss** | Master Book §9 / §12 | **CONSTITUTIONAL RULE** | Unknown OOXML parts preserved opaquely or mutation rejected. | Archive preservation manifest required in `@berryn/xlsx-inspect`. |
| **Local-First Privacy** | Master Book §13 / §14 | **CONSTITUTIONAL RULE** | No default network access, no automated file uploads. | `@berryn/security` enforces sandbox and redaction defaults. |
| **1M Weekly Downloads** | Master Book §2.3 / §18 | **TARGET / UNKNOWN** | Strategic growth target; not a measure of technical correctness. | CI and release telemetry must be opt-in only. |

---

## 4. Current Repository Audit

An audit of the workspace path (`c:\Users\Aaryan Rawat\Downloads\Berryn`) yields:

- **Directory State**: EMPTY (Workspace directory initialized, 0 source files present).
- **Current Capabilities**: `NOT IMPLEMENTED`
- **Build Infrastructure**: `NOT IMPLEMENTED`
- **Package Graph**: `NOT IMPLEMENTED`

### Implementation Gap Assessment
The repository is at ground zero. Phase 0 must construct the pnpm monorepo workspace, TypeScript base configurations, security boundaries, build scripts, and test harnesses from scratch.

---

## 5. Product Contract

Berryn operates on strict execution contracts:

1. **Evidence Over Replacement**: Berryn never demands blind trust. Every recommendation is backed by structural, relationship, and semantic diffs.
2. **Compatibility Before Novelty**: Meet developers where their code lives (ExcelJS / SheetJS import patterns).
3. **Safe Refusal Over Silent Corruption**: If an OOXML feature cannot be modeled or preserved opaquely during mutation, Berryn halts and emits a `BRN-XLSX-MUTATION-REJECTED` diagnostic.
4. **Local and Private Execution**: Default operations run 100% offline without external HTTP requests.

---

## 6. 0.1.0 Umbrella Definition

The **Berryn 0.1.0 Umbrella Program** pulls forward historical roadmap capabilities (0.1.0 through 0.5.0) into internal phases of a single public `0.1.0` release:

- **0.1.0-P0**: Repository & Architecture Foundation
- **0.1.0-P1**: Project & XLSX Inspection + Diff + Reporting (Historical 0.1.0)
- **0.1.0-P2**: Safe Migration Assistance & Reversible AST Codemods (Historical 0.2.0)
- **0.1.0-P3**: Real-Fixture Semantic Validation Engine (Historical 0.3.0)
- **0.1.0-P4**: Narrow Evidence-Gated ExcelJS Compatibility Facade (Historical 0.4.0)
- **0.1.0-P5**: CI Migration Infrastructure & Action (Historical 0.5.0)
- **0.1.0-P6**: System Integration & Core Flow Verification
- **0.1.0-P7**: Hardening, Benchmarking & Edge-Case Stress Testing
- **0.1.0-P8**: Comprehensive Threat Model & Security Control Verification
- **0.1.0-P9**: End-to-End Fixture & Real-Repository Validation
- **0.1.0-P10**: 0.1.0 Release Candidate Freeze
- **0.1.0-P11**: Final 0.1.0 Public Release

---

## 7. Historical 0.1–0.5 Capability Mapping

```
Historical 0.1.0 (Inspect/Diff/Report)  ──► Internal Phase 0.1.0-P1
Historical 0.2.0 (AST Safe Codemods)     ──► Internal Phase 0.1.0-P2
Historical 0.3.0 (Semantic Validation)   ──► Internal Phase 0.1.0-P3
Historical 0.4.0 (ExcelJS Facade)        ──► Internal Phase 0.4.0-P4 (Gated)
Historical 0.5.0 (CI Infrastructure)     ──► Internal Phase 0.5.0-P5
                                                    │
                                                    ▼
                                     PUBLIC RELEASE: BERRYN 0.1.0
```

---

## 8. Architecture

Berryn's system architecture decouples vertical-neutral core orchestration from domain-specific inspection and transformation layers:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              berryn CLI                                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                             @berryn/core                               │
│        (RunContext, ResultEnvelopes, Hashes, Clocks, Policies)         │
└───────┬───────────────────────────┬───────────────────────────┬────────┘
        │                           │                           │
┌───────▼─────────────┐   ┌─────────▼───────────┐   ┌───────────▼────────┐
│  @berryn/security   │   │ @berryn/diagnostics │   │@berryn/project-    │
│  (Limits, Sandbox)  │   │  (Codes, Remediation│   │ inspect (AST Graph)│
└─────────────────────┘   └─────────────────────┘   └────────────────────┘
        │                           │                           │
┌───────▼───────────────────────────▼───────────────────────────▼────────┐
│                        @berryn/xlsx-inspect                            │
│           (ZIP Archive, OPC Graph, OOXML Parts, Content Types)         │
└───────┬───────────────────────────┬───────────────────────────┬────────┘
        │                           │                           │
┌───────▼─────────────┐   ┌─────────▼───────────┐   ┌───────────▼────────┐
│  @berryn/xlsx-diff  │   │@berryn/xlsx-validate│   │  @berryn/codemod   │
│  (Package/Semantic) │   │(Structural/Consumer)│   │ (AST Patch/Plan)   │
└───────┬─────────────┘   └─────────┬───────────┘   └───────────┬────────┘
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                       @berryn/migration-report                         │
│                    (JSON Schema & Text/MD Renderers)                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Package Architecture

Berryn monorepo packages and their exact constraints:

| Package | Status | Responsibilities | Prohibited Behaviors | Dependencies |
|---|---|---|---|---|
| `@berryn/core` | Internal | Types, result envelopes, hashing, policies, run context. | No filesystem I/O, no parser imports. | None (Zero dependency). |
| `@berryn/diagnostics` | Internal | Error codes, severity levels, location formatting, remediation text. | No safety decisions without policy context. | `@berryn/core` |
| `@berryn/security` | Internal | Resource limits, zip/XML limits, canonical path sandbox, temp file handling. | No business logic or XLSX semantics. | `@berryn/core`, `@berryn/diagnostics` |
| `@berryn/project-inspect` | Internal | AST dependency inspection, package.json parsing, import graph mapping. | Never execute scanned source code or scripts. | `@berryn/core`, `@berryn/diagnostics`, `@berryn/security`, `typescript` |
| `@berryn/xlsx-inspect` | Internal | ZIP container inventory, OPC relationship graph, raw OOXML extraction. | No universal semantic modeling assertions. | `@berryn/core`, `@berryn/diagnostics`, `@berryn/security`, `fflate`, `fast-xml-parser` |
| `@berryn/xlsx-diff` | Internal | Package zip diffs, OPC relationship diffs, semantic XML diffs. | Do not treat non-semantic whitespace as failures. | `@berryn/core`, `@berryn/diagnostics`, `@berryn/xlsx-inspect` |
| `@berryn/xlsx-validate` | Internal | Structural, schema, relationship, and optional consumer test orchestration. | No silent auto-repair; no network calls. | `@berryn/core`, `@berryn/diagnostics`, `@berryn/xlsx-inspect` |
| `@berryn/codemod` | Internal | AST transformations, patch previews, worktrees, reversal manifests. | No regex search-and-replace; no direct branch edits without opt-in. | `@berryn/core`, `@berryn/diagnostics`, `@berryn/project-inspect`, `ts-morph` |
| `@berryn/exceljs-compat` | Gated (P4) | Narrow import facade for ExcelJS API subset. | No unevidenced API mocks; fail loudly on unsupported calls. | `@berryn/core`, `@berryn/xlsx-inspect` |
| `@berryn/migration-report`| Internal | Versioned JSON report schema, markdown/human renderers. | No diagnostic suppression or false optimism. | `@berryn/core`, `@berryn/diagnostics` |
| `berryn` | Public | CLI entry point, argument parsing, command composition, exit codes. | No embedded parser logic; no global state. | All `@berryn/*` packages, `commander` |

---

## 10. Dependency Graph

```mermaid
graph TD
    CLI[berryn CLI] --> CORE[@berryn/core]
    CLI --> DIAG[@berryn/diagnostics]
    CLI --> SEC[@berryn/security]
    CLI --> PROJ[@berryn/project-inspect]
    CLI --> XLSX_INSPECT[@berryn/xlsx-inspect]
    CLI --> XLSX_DIFF[@berryn/xlsx-diff]
    CLI --> XLSX_VAL[@berryn/xlsx-validate]
    CLI --> CODEMOD[@berryn/codemod]
    CLI --> COMPAT[@berryn/exceljs-compat]
    CLI --> REPORT[@berryn/migration-report]

    PROJ --> CORE
    PROJ --> DIAG
    PROJ --> SEC

    XLSX_INSPECT --> CORE
    XLSX_INSPECT --> DIAG
    XLSX_INSPECT --> SEC

    XLSX_DIFF --> CORE
    XLSX_DIFF --> DIAG
    XLSX_DIFF --> XLSX_INSPECT

    XLSX_VAL --> CORE
    XLSX_VAL --> DIAG
    XLSX_VAL --> XLSX_INSPECT

    CODEMOD --> CORE
    CODEMOD --> DIAG
    CODEMOD --> PROJ

    COMPAT --> CORE
    COMPAT --> XLSX_INSPECT

    REPORT --> CORE
    REPORT --> DIAG
```

---

## 11. Monorepo Structure

```text
berryn/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.base.json
├── tsconfig.json
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── security.yml
│       ├── fuzz.yml
│       └── release.yml
├── packages/
│   ├── core/
│   ├── diagnostics/
│   ├── security/
│   ├── project-inspect/
│   ├── xlsx-inspect/
│   ├── xlsx-diff/
│   ├── xlsx-validate/
│   ├── codemod/
│   ├── exceljs-compat/
│   ├── migration-report/
│   └── cli/
├── fixtures/
│   ├── synthetic/
│   ├── malformed/
│   ├── security/
│   └── public-real/
└── tools/
    ├── generate-sbom.ts
    └── verify-packages.ts
```

---

## 12. Core Implementation (`@berryn/core`)

Defines execution context, policy schemas, branded types, and standard envelopes:

```typescript
export type RunId = string & { readonly __brand: 'RunId' };
export type ContentHash = string & { readonly __brand: 'ContentHash' };

export interface ResultEnvelope<T> {
  schemaVersion: '0.1.0';
  run: RunMetadata;
  value: T;
  diagnostics: Diagnostic[];
  status: 'passed' | 'passed-with-warnings' | 'failed' | 'rejected';
}

export interface RunMetadata {
  runId: RunId;
  toolVersion: string;
  startedAt: string;
  completedAt?: string;
  cwd: string;
  runtime: { name: string; version: string };
  network: 'disabled';
  policyHash: ContentHash;
}
```

---

## 13. Project Inspection (`@berryn/project-inspect`)

Analyzes target TypeScript/JavaScript codebases for dependency usage:

- Package manager detection (`npm`, `pnpm`, `yarn`, `bun`).
- Manifest inspection (`package.json` dependency extraction).
- Import AST graph builder (discovers ESM `import` & CJS `require` statements for `exceljs` & `xlsx`).
- Call-expression inventory (catalogs API methods invoked, e.g., `workbook.xlsx.readFile`).

---

## 14. XLSX Inspection (`@berryn/xlsx-inspect`)

Processes ZIP container and OPC structures safely:

- Zip container inventory via stream/bounded buffer.
- `[Content_Types].xml` parsing to classify parts.
- `_rels/.rels` and part-level `.rels` relationship mapping.
- Worksheets, Shared Strings, Styles (`xl/styles.xml`), Tables, Formulas, Drawings, Macros, Custom XML detection.
- **Support Classification**: `Supported`, `PartiallySupported`, `PreservedNotModeled`, `Unsupported`, `Rejected`.

---

## 15. Diff Engine (`@berryn/xlsx-diff`)

Two-stage comparison engine:

1. **Package Diff**: Compares ZIP entries, hashes, content-types, and relationship graph topology.
2. **Semantic Diff**: Normalizes XML whitespace/ordering and performs logical structural comparisons for sheet data, cell values, formula expressions, and style definitions.

---

## 16. Evidence / Report Engine (`@berryn/migration-report`)

Produces standard `BERRYN_REPORT_V1` artifacts:

- Schema validation via JSON Schema.
- Machine-readable JSON output.
- Markdown / Human-readable executive summary renderer.
- Redaction filters for local file paths and confidential strings.

---

## 17. Migration Engine (`@berryn/codemod`)

Provides safe code modification support:

- Generates migration plans containing explicit transformation steps.
- Uses `ts-morph` AST engine to update import references and API calls.
- Emits unified diff patches (`.patch` format) and supports disposable Git worktrees (`--worktree`).
- Generates reversal manifests for 100% reversible operations.

---

## 18. Codemod Engine Rules

- **NO REGEX REPLACEMENTS**: All code transforms must be AST-validated.
- **Idempotence**: Running a codemod twice produces identical output.
- **Ambiguity Refusal**: Complex dynamic calls (e.g., `workbook[dynamicMethod]()`) are flagged for manual review rather than auto-transformed.

---

## 19. Semantic Validation (`@berryn/xlsx-validate`)

Validation harness executing 4 check levels:

1. **Structural Check**: Verifies valid ZIP container and XML syntax.
2. **Relationship Check**: Validates OPC target resolutions.
3. **Semantic Check**: Verifies cell values, formulas, and styles against golden targets.
4. **Consumer Check** (Optional): Executes LibreOffice / Excel headless validation if available locally.

---

## 20. Compatibility Facade (`@berryn/exceljs-compat`)

Narrow, evidence-gated facade layer implementing the subset of ExcelJS APIs justified by real repository audits:

- `Workbook.xlsx.readFile()`, `Workbook.xlsx.writeFile()`, `Workbook.xlsx.writeBuffer()`.
- `Worksheet.addRow()`, `Worksheet.getCell()`, `Worksheet.mergeCells()`.
- Cell value get/set for scalar primitives (string, number, boolean, date).
- **Loud Failure**: Invoking unsupported ExcelJS APIs throws `BerrynCompatibilityError` with exact remediation instructions.

---

## 21. CI Infrastructure (`@berryn/cli` & GitHub Action)

Provides continuous regression testing for migrations:

- `berryn validate` command integration into GitHub Actions workflow.
- Strict non-zero exit codes on policy/security threshold violations.
- Offline execution mode (`--no-network`) guaranteed.

---

## 22. Security Implementation (`@berryn/security`)

Security controls enforced at all parser boundaries:

- **ZIP Bomb Defense**: Max compressed size (512 MB), max uncompressed size (2 GB), max compression ratio (100:1), max entries (100,000).
- **XXE Prevention**: DTD processing, external entity resolution, and XInclude disabled in XML parsers.
- **Path Traversal Shield**: Canonical path resolution enforcing boundary within approved target root.
- **Command Injection Guard**: No `shell: true` execution in child processes. Array-form execution only.

---

## 23. Fixture Architecture

Categorized fixture repository:

- `synthetic/`: Minimal edge-case XLSX files created programmatically.
- `malformed/`: Archives with corrupted headers, truncated streams, or bad XML.
- `security/`: ZIP bombs, XXE payloads, traversal paths.
- `public-real/`: Permissively licensed real-world workbooks.

---

## 24. Testing Architecture

- **Unit Tests**: `vitest` suite for individual modules (100% core coverage requirement).
- **Integration Tests**: End-to-end command testing.
- **Property Tests**: `fast-check` generation for XML/Zip parsing.
- **Fuzz Testing**: Bounded stream fuzzing for zip and XML readers.

---

## 25. Performance

- Benchmark budget: Process a 100 MB compressed XLSX in < 5 seconds under 512 MB RAM.
- Streamed XML processing where possible to minimize heap footprint.

---

## 26. CLI Specifications

Standard CLI commands implemented in `berryn`:

```bash
berryn inspect <path> [--project] [--format json|text]
berryn diff <before> <after> [--package] [--semantic]
berryn validate <input> [--policy file] [--no-network]
berryn migrate <project> --from exceljs [--dry-run] [--worktree path]
berryn report <runId> [--format text|json|markdown]
```

---

## 27. API Specifications

Programmatic TypeScript exports from subpackages:

```typescript
import { inspectProject } from '@berryn/project-inspect';
import { inspectXlsx } from '@berryn/xlsx-inspect';
import { diffXlsx } from '@berryn/xlsx-diff';
import { validateXlsx } from '@berryn/xlsx-validate';
import { generateCodemodPatch } from '@berryn/codemod';
```

---

## 28. Error Model & Exit Codes

Standard exit codes enforced across CLI execution:

| Code | Constant | Meaning |
|---|---|---|
| `0` | `SUCCESS` | Completed successfully without threshold breach. |
| `2` | `ERR_CONFIG` | Invalid CLI flags or policy file configuration. |
| `3` | `ERR_UNSUPPORTED` | Operation rejected due to unsupported format feature. |
| `4` | `ERR_VALIDATION` | Required semantic or structural validation failed. |
| `5` | `ERR_SECURITY` | Security or resource limit threshold violated. |
| `10` | `ERR_INTERNAL` | Unhandled runtime exception inside Berryn engine. |

---

## 29. Documentation

- Complete CLI usage manuals.
- Schema definitions (`BERRYN_REPORT_V1.json`).
- Security model and threat register documentation.

---

## 30. CI/CD Integration

- GitHub Actions workflows for PR validation, security scanning, fuzz testing, and automated release.

---

## 31. Release Pipeline

- Clean build from protected git commit tag.
- Verification of lockfiles, SBOM generation, and npm provenance attestations.
- Published to npm under `@berryn/*` scope at public version `0.1.0`.

---

## 32. Internal Implementation Phases

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PHASE 0: FOUNDATION                             │
│       Monorepo, pnpm workspaces, tsconfig, @berryn/core, build         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                    PHASE 1: 0.1.0 INSPECTION & DIFF                    │
│      @berryn/project-inspect, @berryn/xlsx-inspect, @berryn/xlsx-diff  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                     PHASE 2: 0.2.0 CODEMOD ENGINE                      │
│        @berryn/codemod, ts-morph AST rules, patch preview, worktree    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                   PHASE 3: 0.3.0 SEMANTIC VALIDATION                   │
│        @berryn/xlsx-validate, fixture harness, consumer validation     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                   PHASE 4: 0.4.0 EXCELJS COMPATIBILITY                 │
│        @berryn/exceljs-compat facade, narrow API subset implementation │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                    PHASE 5: 0.5.0 CI INFRASTRUCTURE                    │
│        GitHub Actions, Continuous regression testing, CLI exit gates   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                PHASES 6 - 11: INTEGRATION & RELEASE                    │
│     System integration, hardening, security audit, RC, 0.1.0 release   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 33. Detailed Task Breakdown

Refer to `BERRYN_0.1.0_TASK_BACKLOG.md` for the complete 120-task itemized breakdown across all phases.

---

## 34. File-by-File Implementation Map

```text
packages/core/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── types.ts
    ├── context.ts
    ├── envelope.ts
    ├── hash.ts
    └── policy.ts

packages/diagnostics/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── codes.ts
    └── formatter.ts

packages/security/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── limits.ts
    ├── sandbox.ts
    ├── zip-guard.ts
    └── xml-guard.ts

packages/project-inspect/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── manifest.ts
    ├── ast-parser.ts
    └── graph.ts

packages/xlsx-inspect/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── zip-reader.ts
    ├── opc-parser.ts
    ├── parts-catalog.ts
    └── classifier.ts

packages/xlsx-diff/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── package-diff.ts
    ├── xml-diff.ts
    └── semantic-diff.ts

packages/xlsx-validate/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── structural.ts
    ├── relationship.ts
    └── consumer.ts

packages/codemod/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── ast-transform.ts
    ├── patch-generator.ts
    └── worktree.ts

packages/exceljs-compat/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── workbook.ts
    ├── worksheet.ts
    └── cell.ts

packages/migration-report/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── schema.ts
    ├── json-renderer.ts
    └── md-renderer.ts

packages/cli/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── commands/
    │   ├── inspect.ts
    │   ├── diff.ts
    │   ├── validate.ts
    │   ├── migrate.ts
    │   └── report.ts
    └── exit-codes.ts
```

---

## 35. Dependency Ordering

Sequential execution path:
1. `core`
2. `diagnostics` & `security`
3. `project-inspect` & `xlsx-inspect`
4. `xlsx-diff`, `xlsx-validate`, `codemod`
5. `exceljs-compat`
6. `migration-report`
7. `cli`

---

## 36. Parallelization Opportunities

- `@berryn/project-inspect` and `@berryn/xlsx-inspect` can be developed concurrently once `core`, `diagnostics`, and `security` are stable.
- `@berryn/xlsx-diff`, `@berryn/xlsx-validate`, and `@berryn/codemod` can be built in parallel after `xlsx-inspect`.

---

## 37. Risks

- **OPC Structural Complexity**: OOXML parts have complex relationship chains that may lead to incomplete parsing.
- **Performance Constraints**: Large XLSX files may exceed node memory if stream processing is bypassed.

---

## 38. Blockers

- Unresolved ZIP bomb handling could block security release gates.

---

## 39. Unknowns

- Exact proportion of ExcelJS codebase features used in real production repositories.

---

## 40. 0.1.0 Acceptance Criteria

1. Monorepo builds cleanly with zero TypeScript or lint errors.
2. All unit, integration, property, and fuzz tests pass.
3. 100% offline execution verified (`--no-network`).
4. Security limits prevent ZIP bombs and XXE payloads.
5. All CLI commands function as specified.

---

## 41. 0.1.0 Release Gates

Refer to `BERRYN_0.1.0_RELEASE_GATES.md` for full release gate requirements.

---

## 42. 0.1.0 Definition of Done

The Berryn 0.1.0 Umbrella release is complete when all internal phases (P0 through P11) are implemented, verified against real fixtures, passed through security gates, packaged with SBOM and provenance, and published to npm under version `0.1.0`.

---

## 43. Post-0.1.0 Roadmap Handoff

- **0.6.0**: Bounded preservation for unmodeled OOXML parts.
- **0.7.0**: Enterprise production hardening & performance scaling.
- **0.8.0**: FFmpeg / secondary vertical adapter probe evaluation.
- **0.9.0**: API contract freeze & 1.0 Candidate.
- **1.0.0**: Production Stable Ecosystem Release.

---

## Master Implementation Table

| Internal Phase | Historical Roadmap | Public Release | Capability | Primary Packages | Key Files | Dependencies | Acceptance Criteria | Status |
|---|---|---|---|---|---|---|---|---|
| **0.1.0-P0** | Foundation | 0.1.0 | Monorepo & Core Infrastructure | `@berryn/core`, `@berryn/security`, `@berryn/diagnostics` | `packages/core/src/index.ts`, `packages/security/src/limits.ts` | None | Monorepo builds cleanly; core types, result envelopes, and security limits established. | Planned |
| **0.1.0-P1** | 0.1.0 Scope | 0.1.0 | Project & XLSX Inspection + Diff + Report | `@berryn/project-inspect`, `@berryn/xlsx-inspect`, `@berryn/xlsx-diff`, `@berryn/migration-report` | `packages/xlsx-inspect/src/zip-reader.ts`, `packages/xlsx-diff/src/package-diff.ts` | P0 | Can inspect project source and XLSX archives; compute package & semantic diffs; emit `BERRYN_REPORT_V1`. | Planned |
| **0.1.0-P2** | 0.2.0 Scope | 0.1.0 | Safe Reversible AST Migration Assistance | `@berryn/codemod` | `packages/codemod/src/ast-transform.ts`, `packages/codemod/src/worktree.ts` | P1 | Can transform imports/API calls safely via `ts-morph`; generate `.patch` files & disposable worktrees. | Planned |
| **0.1.0-P3** | 0.3.0 Scope | 0.1.0 | Real-Fixture Semantic Validation Engine | `@berryn/xlsx-validate` | `packages/xlsx-validate/src/structural.ts`, `packages/xlsx-validate/src/consumer.ts` | P1 | Executes structural, relationship, semantic, and consumer validation checks on real fixtures. | Planned |
| **0.1.0-P4** | 0.4.0 Scope | 0.1.0 | Evidence-Gated ExcelJS Compatibility Facade | `@berryn/exceljs-compat` | `packages/exceljs-compat/src/workbook.ts`, `packages/exceljs-compat/src/worksheet.ts` | P1, P3 | Provides narrow import-compatible ExcelJS facade for verified API subset; fails loudly on unsupported APIs. | Planned |
| **0.1.0-P5** | 0.5.0 Scope | 0.1.0 | CI Migration Infrastructure | `berryn` CLI, GitHub Action | `.github/workflows/ci.yml`, `packages/cli/src/commands/validate.ts` | P1-P4 | `berryn validate` integrates into CI with stable exit codes (0, 2, 3, 4, 5, 10); runs 100% offline. | Planned |
| **0.1.0-P6** | Integration | 0.1.0 | System Integration & Core Flow | All packages | `packages/cli/src/index.ts` | P0-P5 | Core flow (Discover → Inspect → Diff → Migrate → Validate → Report) works coherently end-to-end. | Planned |
| **0.1.0-P7** | Hardening | 0.1.0 | Performance & Stress Hardening | All packages | `tools/verify-packages.ts` | P6 | Processes 100 MB compressed XLSX in < 5s under 512 MB memory; zero memory leaks. | Planned |
| **0.1.0-P8** | Security | 0.1.0 | Threat Model & Security Controls | `@berryn/security` | `packages/security/src/zip-guard.ts`, `packages/security/src/xml-guard.ts` | P7 | ZIP bomb, XXE, path traversal, and command injection security gates pass 100%. | Planned |
| **0.1.0-P9** | Validation | 0.1.0 | Real-World Repository & Fixture Validation | All packages | `fixtures/public-real/` | P8 | Successfully processes full real-world fixture suite with zero unhandled diagnostic crashes. | Planned |
| **0.1.0-P10**| RC Freeze | 0.1.0 | Release Candidate Freeze | All packages | All | P9 | API surface, CLI flags, diagnostic codes, and report schemas frozen; release notes complete. | Planned |
| **0.1.0-P11**| Final Release | 0.1.0 | Production Release to npm | `berryn` (public) | `package.json` | P10 | Provenance attested, SBOM generated, published to npm as `berryn@0.1.0`. | Planned |
