# Berryn 0.1.0 Architecture Specification
## Technical Design for the Berryn Migration & Validation Engine

---

## 1. System Overview & Core Philosophy

Berryn is **migration, compatibility, and validation infrastructure**. Its primary mission is reducing developer risk when replacing aging, deprecated, or vulnerable dependencies.

The architecture is built on five strict principles:
1. **Vertical Isolation**: Core orchestration logic (`@berryn/core`) has zero knowledge of spreadsheet XML schemas or file formats. XLSX capabilities live strictly in domain vertical packages (`@berryn/xlsx-*`).
2. **Local-First & Offline**: Execution occurs entirely on the developer's machine or CI worker. Zero ambient network egress or cloud dependencies.
3. **Zero Silent Data Loss**: Unknown or unmodeled content in transformed artifacts is preserved opaquely or mutation is explicitly rejected.
4. **AST-Driven Codemods**: Code modifications are performed via Abstract Syntax Trees (`ts-morph`), avoiding fragile regex search-and-replace routines.
5. **Strict Multi-Stage Diagnostics**: All observations are emitted in deterministic, branded result envelopes (`ResultEnvelope<T>`).

---

## 2. High-Level Architecture Diagram

```text
                               ┌───────────────────────────┐
                               │        berryn CLI         │
                               └─────────────┬─────────────┘
                                             │
                       ┌─────────────────────▼─────────────────────┐
                       │               @berryn/core                │
                       │ (Context, Policy, ResultEnvelopes, Hashes)│
                       └─────────────┬─────────────┬───────────────┘
                                     │             │
              ┌──────────────────────┴──────┐      └────────────────────────────┐
              │                                                         │
┌─────────────▼─────────────┐                             ┌─────────────▼─────────────┐
│    @berryn/security       │                             │    @berryn/diagnostics    │
│  (Sandbox, Limits, XML)   │                             │  (Codes, Severity, Rem.)  │
└─────────────┬─────────────┘                             └─────────────┬─────────────┘
              │                                                         │
              └──────────────────────┬──────────────────────────────────┘
                                     │
                       ┌─────────────▼─────────────┐
                       │  @berryn/project-inspect  │
                       │(AST Import & Manifest Map)│
                       └─────────────┬─────────────┘
                                     │
                       ┌─────────────▼─────────────┐
                       │   @berryn/xlsx-inspect    │
                       │(ZIP/OPC Graph & Classify) │
                       └──────┬──────────┬─────────┘
                              │          │
         ┌────────────────────┘          └────────────────────┐
         │                                                    │
┌────────▼────────────┐  ┌─────────────────────┐    ┌─────────▼───────────┐
│  @berryn/xlsx-diff  │  │@berryn/xlsx-validate│    │   @berryn/codemod   │
│(Package & Semantic) │  │ (Structural & Cons.)│    │ (AST Transform Engine)│
└────────┬────────────┘  └───────────┬─────────┘    └─────────┬───────────┘
         │                           │                        │
         └───────────────────────────┼────────────────────────┘
                                     │
                       ┌─────────────▼─────────────┐
                       │ @berryn/migration-report  │
                       │(Schema & Human Rendering) │
                       └───────────────────────────┘
```

---

## 3. Package Boundaries & Dependency Flow Rules

Dependencies flow downward toward vertical-neutral layers. Upward or circular dependencies are strictly forbidden and enforced by CI reference checks.

```mermaid
graph TD
    CLI[berryn] --> CORE[@berryn/core]
    CLI --> DIAG[@berryn/diagnostics]
    CLI --> SEC[@berryn/security]
    CLI --> PROJ[@berryn/project-inspect]
    CLI --> INSPECT[@berryn/xlsx-inspect]
    CLI --> DIFF[@berryn/xlsx-diff]
    CLI --> VAL[@berryn/xlsx-validate]
    CLI --> CODEMOD[@berryn/codemod]
    CLI --> COMPAT[@berryn/exceljs-compat]
    CLI --> REPORT[@berryn/migration-report]

    PROJ --> CORE
    PROJ --> DIAG
    PROJ --> SEC

    INSPECT --> CORE
    INSPECT --> DIAG
    INSPECT --> SEC

    DIFF --> CORE
    DIFF --> DIAG
    DIFF --> INSPECT

    VAL --> CORE
    VAL --> DIAG
    VAL --> INSPECT

    CODEMOD --> CORE
    CODEMOD --> DIAG
    CODEMOD --> PROJ

    COMPAT --> CORE
    COMPAT --> INSPECT

    REPORT --> CORE
    REPORT --> DIAG
```

---

## 4. Core Domain Models (`@berryn/core`)

All core data structures use TypeScript branded types for nominal safety:

```typescript
export type RunId = string & { readonly __brand: 'RunId' };
export type ContentHash = string & { readonly __brand: 'ContentHash' };
export type DiagnosticCode = string & { readonly __brand: 'DiagnosticCode' };

export type Severity = 'info' | 'warning' | 'error' | 'critical';
export type Confidence = 'high' | 'medium' | 'low' | 'unknown';
export type SupportClassification = 
  | 'supported' 
  | 'partially-supported' 
  | 'preserved-not-modeled' 
  | 'unsupported' 
  | 'rejected';

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

export interface Diagnostic {
  code: DiagnosticCode;
  severity: Severity;
  message: string;
  confidence: Confidence;
  location?: {
    file?: string;
    line?: number;
    column?: number;
    partPath?: string;
  };
  remediation?: string;
  evidenceRef?: string;
}

export interface BerrynPolicy {
  schemaVersion: '0.1.0';
  mode: 'advisory' | 'strict' | 'migration';
  network: 'deny';
  unknownParts: 'report' | 'reject-mutation';
  failOn: Severity;
  limits: ResourceLimits;
  allowedRoots: string[];
}

export interface ResourceLimits {
  maxInputBytes: number;
  maxEntryCount: number;
  maxEntryUncompressedBytes: number;
  maxTotalUncompressedBytes: number;
  maxXmlCharacters: number;
  maxXmlDepth: number;
  maxRelationships: number;
  maxDiagnostics: number;
  maxRunMilliseconds: number;
  maxTempBytes: number;
}
```

---

## 5. OPC & ZIP Inspection Engine (`@berryn/xlsx-inspect`)

The Open Packaging Conventions (OPC) inspector analyzes `.xlsx` ZIP containers:

1. **ZIP Container Stream Reader**: Opened under strict `@berryn/security` resource checks (`maxEntryCount`, `maxTotalUncompressedBytes`).
2. **Content Types Inventory**: Parses `[Content_Types].xml` to discover all declared XML parts and override types.
3. **Relationship Graph Resolver**: Reads top-level `_rels/.rels` and part-level `.rels` files to map explicit directional edges between parts (e.g., Workbook -> Worksheet, Workbook -> Shared Strings, Worksheet -> Drawings).
4. **Feature Classification**:
   - `Supported`: Core Worksheets, Cell Values (Primitives), Shared Strings.
   - `PartiallySupported`: Common Styles (`xl/styles.xml`), Formatted Export Tables, Simple Formulas.
   - `PreservedNotModeled`: Custom XML Parts, Unrecognized Metadata, Theme definitions.
   - `Unsupported`: Complex Pivot Tables, Legacy VML Drawings.
   - `Rejected`: Encrypted Office Open XML streams, Malformed ZIP headers.

---

## 6. Semantic Diffing Engine (`@berryn/xlsx-diff`)

The diff engine executes a two-tier comparison algorithm:

### Tier 1: Package Diff
- Evaluates ZIP archive entry inventory.
- Compares compressed/uncompressed sizes, SHA-256 content hashes, and OPC relationship graph topology.
- Flagging a byte difference does NOT automatically imply a semantic failure.

### Tier 2: Semantic Diff
- **XML Normalization**: Strips ignorable XML whitespace, canonicalizes attribute ordering, and resolves namespace prefixes.
- **Workbook Semantics**: Compares logical sheet order, worksheet visibility, and named ranges.
- **Worksheet Semantics**: Compares row/column indices, cell primitive data types (string, number, boolean, date), and formula text expressions.
- **Style Semantics**: Normalizes font names, font sizes, fill colors, and cell border definitions.

---

## 7. AST Codemod Engine (`@berryn/codemod`)

The codemod engine transforms developer source code using `ts-morph`:

```typescript
export interface MigrationPlan {
  planId: string;
  sourceFiles: string[];
  transformations: TransformationStep[];
  manualSteps: ManualStep[];
  confidence: Confidence;
}

export interface TransformationStep {
  file: string;
  line: number;
  kind: 'import-rewrite' | 'api-replace' | 'property-rename';
  originalText: string;
  replacementText: string;
  reversible: boolean;
}
```

### Safety Invariants
- **Zero Regex Rewriting**: Every replacement is computed via AST node manipulation.
- **Reversibility**: Generates a `.patch` file and reversal manifest for single-command rollback (`berryn migrate --undo`).
- **Disposable Worktrees**: Supports `--worktree` flag to isolate code transformations in an isolated Git worktree before merging into the main branch.

---

## 8. Semantic Validation Engine (`@berryn/xlsx-validate`)

Orchestrates 4 verification checks:

1. **Structural Validator**: Validates ZIP container integrity, XML well-formedness, and lack of corruption.
2. **Relationship Validator**: Verifies all OPC relationships resolve to valid target parts inside the package.
3. **Semantic Validator**: Asserts that target cell values, computed values, and formatting match expected golden values.
4. **Consumer Validator**: (Optional) Headless verification attempting to open generated workbooks in local Excel / LibreOffice binaries to confirm zero repair prompts.

---

## 9. ExcelJS Compatibility Facade (`@berryn/exceljs-compat`)

A narrow, evidence-gated compatibility layer provided for smooth incremental migrations:

- **Supported Subset**:
  - `Workbook.xlsx.readFile(path)`
  - `Workbook.xlsx.writeFile(path)`
  - `Worksheet.addRow(values)`
  - `Worksheet.getCell(address)`
  - `Cell.value` (get/set for primitive types)
- **Loud Failure Principle**:
  If application code calls an unsupported ExcelJS method (e.g., `worksheet.protect()`), the facade throws a `BerrynCompatibilityError` with a clear diagnostic code and manual remediation guide, preventing silent degradation.

---

## 10. CI Infrastructure & Exit Codes

Integrates into GitHub Actions and local terminal workflows with stable exit codes:

| Exit Code | Symbol | Trigger Condition |
|---|---|---|
| `0` | `SUCCESS` | Successful execution with no policy violations. |
| `2` | `ERR_CONFIG` | Invalid CLI flags or policy file configuration. |
| `3` | `ERR_UNSUPPORTED` | Operation rejected due to unsupported format feature. |
| `4` | `ERR_VALIDATION` | Required semantic or structural validation failed. |
| `5` | `ERR_SECURITY` | Security or resource limit threshold violated. |
| `10` | `ERR_INTERNAL` | Unhandled runtime exception inside Berryn engine. |

---

## 11. Security Architecture & Sandbox Controls

Security is built directly into parsing libraries inside `@berryn/security`:

- **ZIP Bomb Shield**: Bounded stream extraction with maximum ratio checks (100:1) and total uncompressed limit (2 GB).
- **XXE Prevention Shield**: XML parsers disable external entity resolution (`resolveExternalEntities: false`), DTD processing, and XInclude.
- **Path Sandbox**: Restricts file reading and writing strictly to canonical target workspace paths (`allowedRoots`), rejecting traversal (`../`).
- **Subprocess Isolation**: Children processes run strictly with array parameters (no `shell: true`).
