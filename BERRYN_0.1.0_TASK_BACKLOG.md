# Berryn 0.1.0 Task Backlog
## Phase-by-Phase Itemized Engineering Tasks for the 0.1.0 Umbrella Release

---

## Phase 0: Repository & Architecture Foundation (`0.1.0-P0`)

### TASK-001: Initialize Monorepo Architecture & pnpm Workspaces
- **TASK ID**: `TASK-001`
- **PURPOSE**: Establish monorepo configuration, workspace packages, and typescript project references.
- **FILES**: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `tsconfig.json`
- **DEPENDENCIES**: None
- **INPUT**: Workspace directory initialization
- **OUTPUT**: Configured monorepo root with pnpm workspace settings
- **TESTS**: `pnpm install` succeeds; `pnpm build` executes workspace graph
- **SECURITY**: Pin dependencies; restrict npm scripts from running untrusted lifecycle hooks
- **ACCEPTANCE CRITERIA**: Monorepo root is configured with workspaces `packages/*`; `pnpm -r exec tsc --noEmit` runs cleanly
- **PHASE**: `0.1.0-P0`
- **ESTIMATE**: `S`

### TASK-002: Build `@berryn/core` Branded Types & Result Envelopes
- **TASK ID**: `TASK-002`
- **PURPOSE**: Define standard execution contracts, branded types, and policy structures.
- **FILES**: `packages/core/package.json`, `packages/core/tsconfig.json`, `packages/core/src/index.ts`, `packages/core/src/types.ts`, `packages/core/src/envelope.ts`
- **DEPENDENCIES**: `TASK-001`
- **INPUT**: Technical spec definitions
- **OUTPUT**: `@berryn/core` ESM package
- **TESTS**: Unit tests verifying envelope creation, status assignment, and type branding
- **SECURITY**: Branded types prevent parameter confusion between hashes, IDs, and paths
- **ACCEPTANCE CRITERIA**: Export `ResultEnvelope<T>`, `RunMetadata`, `RunId`, `ContentHash`, `BerrynPolicy` with 100% test coverage
- **PHASE**: `0.1.0-P0`
- **ESTIMATE**: `S`

### TASK-003: Implement `@berryn/diagnostics` Error Registry & Code Formatter
- **TASK ID**: `TASK-003`
- **PURPOSE**: Create structured diagnostic code catalog and text/json error renderers.
- **FILES**: `packages/diagnostics/package.json`, `packages/diagnostics/src/index.ts`, `packages/diagnostics/src/codes.ts`, `packages/diagnostics/src/formatter.ts`
- **DEPENDENCIES**: `TASK-002`
- **INPUT**: Error definitions and severity levels
- **OUTPUT**: `@berryn/diagnostics` package
- **TESTS**: Unit tests verifying string formatting, location attaches, and code lookup
- **SECURITY**: Sanitize output paths and confidential tokens in error messages
- **ACCEPTANCE CRITERIA**: Diagnostic codes (`BRN-SEC-*`, `BRN-XLSX-*`, `BRN-CODE-*`) defined and printable with remediation guides
- **PHASE**: `0.1.0-P0`
- **ESTIMATE**: `S`

### TASK-004: Implement `@berryn/security` Sandbox & Resource Limits Guard
- **TASK ID**: `TASK-004`
- **PURPOSE**: Provide path canonicalization sandbox and resource budget checkers.
- **FILES**: `packages/security/package.json`, `packages/security/src/index.ts`, `packages/security/src/limits.ts`, `packages/security/src/sandbox.ts`
- **DEPENDENCIES**: `TASK-002`, `TASK-003`
- **INPUT**: ResourceLimits object and path targets
- **OUTPUT**: `@berryn/security` package
- **TESTS**: Path traversal attack unit tests; resource breach rejection tests
- **SECURITY**: Prevent traversal outside `allowedRoots`; reject negative or oversized limit parameters
- **ACCEPTANCE CRITERIA**: `assertPathInSandbox()` and `checkResourceLimits()` throw `SecurityError` on violations
- **PHASE**: `0.1.0-P0`
- **ESTIMATE**: `M`

---

## Phase 1: 0.1.0 Inspection, Diff & Evidence Reporting (`0.1.0-P1`)

### TASK-005: Build `@berryn/project-inspect` AST Dependency & Import Graph Parser
- **TASK ID**: `TASK-005`
- **PURPOSE**: Scan source codebases for incumbent dependencies (`exceljs`, `xlsx`) and API invocations.
- **FILES**: `packages/project-inspect/package.json`, `packages/project-inspect/src/index.ts`, `packages/project-inspect/src/manifest.ts`, `packages/project-inspect/src/ast-parser.ts`
- **DEPENDENCIES**: `TASK-004`
- **INPUT**: Target project directory path
- **OUTPUT**: `ProjectInspectionResult` AST graph
- **TESTS**: Unit tests on synthetic JS/TS files containing ESM `import` and CJS `require` calls
- **SECURITY**: Never evaluate target project JS code or execute lifecycle scripts
- **ACCEPTANCE CRITERIA**: Accurately catalogs package dependencies, version constraints, and API usage sites
- **PHASE**: `0.1.0-P1`
- **ESTIMATE**: `M`

### TASK-006: Build `@berryn/xlsx-inspect` Bounded ZIP Container & OPC Parser
- **TASK ID**: `TASK-006`
- **PURPOSE**: Safely inspect `.xlsx` ZIP container archives and parse Open Packaging Conventions (OPC) relationship structures.
- **FILES**: `packages/xlsx-inspect/package.json`, `packages/xlsx-inspect/src/index.ts`, `packages/xlsx-inspect/src/zip-reader.ts`, `packages/xlsx-inspect/src/opc-parser.ts`, `packages/xlsx-inspect/src/classifier.ts`
- **DEPENDENCIES**: `TASK-004`
- **INPUT**: `.xlsx` file path or buffer
- **OUTPUT**: `XlsxInspectionReport` with part catalog and support classifications
- **TESTS**: Stream parsing tests, malformed ZIP header tests, OPC relationship resolution tests
- **SECURITY**: Enforce ZIP bomb ratio checks and XXE-disabled XML parsing via `@berryn/security`
- **ACCEPTANCE CRITERIA**: Enumerates parts, parses `[Content_Types].xml` and `.rels` graphs, assigns support classifications
- **PHASE**: `0.1.0-P1`
- **ESTIMATE**: `L`

### TASK-007: Build `@berryn/xlsx-diff` Package & Semantic Comparison Engine
- **TASK ID**: `TASK-007`
- **PURPOSE**: Compute 2-stage diffs (Package level and normalized Semantic level) between before/after workbooks.
- **FILES**: `packages/xlsx-diff/package.json`, `packages/xlsx-diff/src/index.ts`, `packages/xlsx-diff/src/package-diff.ts`, `packages/xlsx-diff/src/xml-diff.ts`, `packages/xlsx-diff/src/semantic-diff.ts`
- **DEPENDENCIES**: `TASK-006`
- **INPUT**: Two `.xlsx` workbook files
- **OUTPUT**: `DiffReport` containing ZIP diffs and semantic structure diffs
- **TESTS**: Unit tests comparing identical workbooks, modified cell values, whitespace variations, and layout changes
- **SECURITY**: Handle giant diff buffers safely under memory limits
- **ACCEPTANCE CRITERIA**: Distinguishes non-semantic whitespace changes from actual data/formula modifications
- **PHASE**: `0.1.0-P1`
- **ESTIMATE**: `L`

### TASK-008: Implement `@berryn/migration-report` JSON & Markdown Generators
- **TASK ID**: `TASK-008`
- **PURPOSE**: Render standardized `BERRYN_REPORT_V1` artifacts in JSON and human-readable Markdown formats.
- **FILES**: `packages/migration-report/package.json`, `packages/migration-report/src/index.ts`, `packages/migration-report/src/schema.ts`, `packages/migration-report/src/json-renderer.ts`, `packages/migration-report/src/md-renderer.ts`
- **DEPENDENCIES**: `TASK-003`
- **INPUT**: Result envelopes and inspection/diff outputs
- **OUTPUT**: Machine-readable JSON string and formatted Markdown report
- **TESTS**: Schema validation unit tests, snapshot tests for Markdown output
- **SECURITY**: Apply path redaction filters to remove sensitive directory paths from reports
- **ACCEPTANCE CRITERIA**: Valid JSON schema compliance (`BERRYN_REPORT_V1`); clean executive Markdown summary
- **PHASE**: `0.1.0-P1`
- **ESTIMATE**: `M`

---

## Phase 2: 0.2.0 Safe Migration Assistance & Codemods (`0.1.0-P2`)

### TASK-009: Build `@berryn/codemod` AST Transformation Engine
- **TASK ID**: `TASK-009`
- **PURPOSE**: Execute safe AST modifications on target codebases to migrate ExcelJS imports and calls.
- **FILES**: `packages/codemod/package.json`, `packages/codemod/src/index.ts`, `packages/codemod/src/ast-transform.ts`, `packages/codemod/src/rules/exceljs-to-berryn.ts`
- **DEPENDENCIES**: `TASK-005`
- **INPUT**: Target source files and AST rule definitions
- **OUTPUT**: Transformed source code string & patch plan
- **TESTS**: `ts-morph` transformation tests, import rewrite verification, code formatting preservation
- **SECURITY**: Refuse transformations on ambiguous dynamic code calls
- **ACCEPTANCE CRITERIA**: Safely updates `import ExcelJS from 'exceljs'` to `@berryn/exceljs-compat` or native Berryn APIs
- **PHASE**: `0.1.0-P2`
- **ESTIMATE**: `L`

### TASK-010: Build Patch Preview, Reversibility & Git Worktree Manager
- **TASK ID**: `TASK-010`
- **PURPOSE**: Emit unified diff `.patch` files and support isolated Git worktree execution.
- **FILES**: `packages/codemod/src/patch-generator.ts`, `packages/codemod/src/worktree.ts`
- **DEPENDENCIES**: `TASK-009`
- **INPUT**: AST transformation diffs and project repository root
- **OUTPUT**: Standard `.patch` file, temporary Git worktree path, reversal manifest
- **TESTS**: Patch generation & application tests, worktree cleanup tests
- **SECURITY**: Execute Git subprocesses safely with array parameters (no shell execution)
- **ACCEPTANCE CRITERIA**: `--dry-run` outputs valid diff preview; `--worktree` isolates modifications safely
- **PHASE**: `0.1.0-P2`
- **ESTIMATE**: `M`

---

## Phase 3: 0.3.0 Real-Fixture Semantic Validation (`0.1.0-P3`)

### TASK-011: Build `@berryn/xlsx-validate` Multi-Stage Validation Harness
- **TASK ID**: `TASK-011`
- **PURPOSE**: Execute Structural, Relationship, Semantic, and Consumer validation routines.
- **FILES**: `packages/xlsx-validate/package.json`, `packages/xlsx-validate/src/index.ts`, `packages/xlsx-validate/src/structural.ts`, `packages/xlsx-validate/src/relationship.ts`, `packages/xlsx-validate/src/semantic.ts`
- **DEPENDENCIES**: `TASK-006`
- **INPUT**: `.xlsx` workbook path and golden reference target
- **OUTPUT**: `ValidationReport` with stage-by-stage diagnostics
- **TESTS**: Test suite using valid, corrupted, and edge-case XLSX fixtures
- **SECURITY**: Isolated validator execution without network access
- **ACCEPTANCE CRITERIA**: Validates ZIP structure, OPC relationship resolution, and cell content equality
- **PHASE**: `0.1.0-P3`
- **ESTIMATE**: `L`

### TASK-012: Build Optional Headless Consumer Validation Runner
- **TASK ID**: `TASK-012`
- **PURPOSE**: Run optional headless LibreOffice / Excel checks on generated workbooks to verify zero repair warnings.
- **FILES**: `packages/xlsx-validate/src/consumer.ts`
- **DEPENDENCIES**: `TASK-011`
- **INPUT**: Generated `.xlsx` file path
- **OUTPUT**: `ConsumerValidationResult` detailing exit code and stdout/stderr logs
- **TESTS**: Integration test executing against local LibreOffice binary if present
- **SECURITY**: Sanitize shell command arguments; capture and redact subprocess stdout
- **ACCEPTANCE CRITERIA**: Gracefully skips if binary is missing; records redacted output if executed
- **PHASE**: `0.1.0-P3`
- **ESTIMATE**: `M`

---

## Phase 4: 0.4.0 Narrow ExcelJS Compatibility Facade (`0.1.0-P4`)

### TASK-013: Build `@berryn/exceljs-compat` Narrow Facade
- **TASK ID**: `TASK-013`
- **PURPOSE**: Implement an import-compatible subset of ExcelJS APIs backed by Berryn engines.
- **FILES**: `packages/exceljs-compat/package.json`, `packages/exceljs-compat/src/index.ts`, `packages/exceljs-compat/src/workbook.ts`, `packages/exceljs-compat/src/worksheet.ts`, `packages/exceljs-compat/src/cell.ts`
- **DEPENDENCIES**: `TASK-006`, `TASK-011`
- **INPUT**: ExcelJS API calls from existing client applications
- **OUTPUT**: Compatible Workbook / Worksheet runtime objects
- **TESTS**: Existing ExcelJS test suite subset compatibility tests
- **SECURITY**: Fail loudly with `BerrynCompatibilityError` when unsupported methods are called
- **ACCEPTANCE CRITERIA**: Passes `Workbook.xlsx.readFile()`, `writeFile()`, `addRow()`, and primitive cell operations
- **PHASE**: `0.1.0-P4`
- **ESTIMATE**: `XL`

---

## Phase 5: 0.5.0 CI Migration Infrastructure (`0.1.0-P5`)

### TASK-014: Build `berryn` Public CLI Package & Commands
- **TASK ID**: `TASK-014`
- **PURPOSE**: Implement CLI entry point and commands (`inspect`, `diff`, `validate`, `migrate`, `report`).
- **FILES**: `packages/cli/package.json`, `packages/cli/src/index.ts`, `packages/cli/src/commands/*.ts`, `packages/cli/src/exit-codes.ts`
- **DEPENDENCIES**: All prior packages (`P0` through `P4`)
- **INPUT**: CLI arguments and options
- **OUTPUT**: Executable CLI binary (`berryn`) emitting stable exit codes (0, 2, 3, 4, 5, 10)
- **TESTS**: E2E CLI execution tests using Commander test harness
- **SECURITY**: Enforce `--no-network` default execution
- **ACCEPTANCE CRITERIA**: Full CLI interface implemented and emitting valid exit codes and reports
- **PHASE**: `0.1.0-P5`
- **ESTIMATE**: `L`

### TASK-015: Build GitHub Action & CI Workflow Integration
- **TASK ID**: `TASK-015`
- **PURPOSE**: Package Berryn CLI as a reusable GitHub Action for continuous PR checks.
- **FILES**: `action.yml`, `.github/workflows/ci.yml`, `docs/ci.md`
- **DEPENDENCIES**: `TASK-014`
- **INPUT**: GitHub PR workspace context
- **OUTPUT**: Automated GitHub Action workflow step
- **TESTS**: CI integration test running in GitHub Actions environment
- **SECURITY**: Redact repository secrets and confidential file paths from action output logs
- **ACCEPTANCE CRITERIA**: GitHub Action runs `berryn validate`, uploads artifacts, and sets status checks
- **PHASE**: `0.1.0-P5`
- **ESTIMATE**: `M`

---

## Phases 6 - 11: Integration, Security, Validation & Release (`0.1.0-P6` .. `0.1.0-P11`)

### TASK-016: System Integration & Core Flow End-to-End Verification
- **TASK ID**: `TASK-016`
- **PURPOSE**: Validate complete conceptual loop (Discover -> Inspect -> Diff -> Migrate -> Validate -> Report) across integrated packages.
- **FILES**: `tests/integration/e2e-flow.test.ts`
- **DEPENDENCIES**: `TASK-001` through `TASK-015`
- **INPUT**: Real multi-file target application and XLSX workbooks
- **OUTPUT**: Verified complete migration flow execution
- **TESTS**: End-to-end integration test suite
- **SECURITY**: Complete sandbox and isolation verification
- **ACCEPTANCE CRITERIA**: Complete flow executes end-to-end with zero unhandled runtime exceptions
- **PHASE**: `0.1.0-P6`
- **ESTIMATE**: `L`

### TASK-017: Execute Comprehensive Security Threat Gate Verification
- **TASK ID**: `TASK-017`
- **PURPOSE**: Run security test suite covering ZIP bombs, XXE payloads, path traversal attempts, and command injection vectors.
- **FILES**: `fixtures/security/*`, `tests/security/threat-model.test.ts`
- **DEPENDENCIES**: `TASK-016`
- **INPUT**: Malicious security fixture corpus
- **OUTPUT**: 100% security gate pass report
- **TESTS**: Security regression and adversarial fuzzing tests
- **SECURITY**: Verify 100% compliance with security threat model
- **ACCEPTANCE CRITERIA**: Zero security bypasses permitted; all malicious inputs safely rejected with code 5
- **PHASE**: `0.1.0-P8`
- **ESTIMATE**: `L`

### TASK-018: Final Release Packaging, SBOM Generation & Provenance Attestation
- **TASK ID**: `TASK-018`
- **PURPOSE**: Package clean build, generate Software Bill of Materials (SBOM), produce npm provenance attestations, and publish `@berryn/*` packages at public version `0.1.0`.
- **FILES**: `tools/generate-sbom.ts`, `.github/workflows/release.yml`
- **DEPENDENCIES**: `TASK-017`
- **INPUT**: Clean Git release tag
- **OUTPUT**: Published npm packages under public version `0.1.0`
- **TESTS**: Clean installation verification test from npm registry in isolated environment
- **SECURITY**: OIDC Trusted Publishing without long-lived npm tokens; verified SBOM
- **ACCEPTANCE CRITERIA**: `npm install berryn@0.1.0` installs cleanly and passes smoke test
- **PHASE**: `0.1.0-P11`
- **ESTIMATE**: `M`
