# berryn

> **Berryn — Local-first migration, compatibility, validation, and evidence infrastructure CLI**

[![npm version](https://img.shields.io/npm/v/berryn.svg)](https://www.npmjs.com/package/berryn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Overview

`berryn` is the official command-line interface for the Berryn ecosystem. It provides engineering teams with local-first, zero-network, sandboxed tools to migrate away from deprecated or vulnerable dependencies (such as legacy `exceljs` and `xlsx`), validate workbook structural and semantic integrity, generate AST-driven reversible codemods, and emit deterministic evidence reports for CI/CD gates.

Berryn replaces guesswork with empirical verification: every modification is audited against OPC relationships, XML equivalence rules, and opaque part preservation invariants.

---

## Installation

Run directly with `npx` (recommended for zero-install CI workflows) or install globally:

```bash
# Direct execution via npx
npx berryn --help

# Global installation
npm install -g berryn
# or with pnpm
pnpm add -g berryn
```

---

## CLI Subcommands

```bash
berryn [command] [options]
```

### 1. `inspect`

Inventories project dependencies, declared manifests, and static AST import call sites, or inspects the Open Packaging Conventions (OPC) parts of an XLSX workbook container.

```bash
# Inspect repository dependencies and AST imports
berryn inspect ./my-app --project --format text

# Inspect XLSX container structure and OPC parts
berryn inspect ./fixtures/spreadsheet.xlsx --format json
```

**Options:**
- `--project`: Scan repository manifest (`package.json`) and TypeScript AST imports instead of an XLSX binary container.
- `--format <text|json|markdown>`: Formatter for inspection results (default: `text`).

---

### 2. `diff`

Computes package archive differences (entry sizes, CRCs) and normalized XML semantic differences between two XLSX workbooks to ensure zero unintended mutations.

```bash
berryn diff ./before.xlsx ./after.xlsx --format markdown
```

**Options:**
- `--format <text|json|markdown>`: Formatter for diff output (default: `text`).

---

### 3. `validate`

Runs multi-layer verification against a target XLSX workbook container across 4 progressive stages:
1. Structural integrity (ZIP entry structure, ratio shields)
2. OPC relationship integrity (`[Content_Types].xml`, `_rels/.rels`)
3. Semantic XML well-formedness
4. Consumer repair smoke tests

```bash
berryn validate ./output/generated.xlsx --format json
```

**Options:**
- `--format <text|json|markdown>`: Formatter for validation diagnostics (default: `text`).

---

### 4. `migrate`

Builds an AST-driven codemod migration plan to transition codebase imports and API calls from legacy libraries (e.g. `exceljs`) to Berryn compatibility facades. Previews changes via a unified `.patch` without touching working files.

```bash
# Preview AST codemod transformations (dry-run)
berryn migrate ./src --from exceljs --dry-run

# Output patch in markdown format
berryn migrate ./src --from exceljs --format markdown
```

**Options:**
- `--from <incumbent>`: Incumbent library name to target (e.g. `exceljs`, `xlsx`; default: `exceljs`).
- `--dry-run`: Preview transformations safely in memory (default: `true`).
- `--format <text|json|markdown>`: Formatter for migration patch preview (default: `text`).

---

### 5. `report`

Reads a machine-readable `BERRYN_REPORT_V1` JSON artifact and renders an executive, auditable Markdown summary suitable for pull request comments or compliance documentation.

```bash
berryn report ./artifacts/berryn-report.json
```

---

## Exit Codes

Berryn CLI adheres to deterministic POSIX exit codes for robust CI/CD integration:

| Exit Code | Constant | Meaning |
|---|---|---|
| `0` | `SUCCESS` | Operation completed cleanly with zero blocking diagnostics. |
| `2` | `SEMANTIC_ERROR` | Structural or semantic validation failed; corrupt or broken container. |
| `3` | `SECURITY_VIOLATION` | Path traversal violation, ZIP bomb ratio exceeded, or XXE payload detected. |
| `4` | `INPUT_NOT_FOUND` | Specified target file, project directory, or report artifact not found. |
| `5` | `INTERNAL_ERROR` | Unhandled internal exception or execution failure. |
| `10` | `DIFFERENCES_FOUND` | Diff or dry-run detected changes between workbooks or AST trees. |

---

## Security Model

The CLI enforces sandboxed execution by default:
- **Zero Network Access**: Completely offline execution; zero external telemetry or network calls.
- **Path Confinement**: All file reads/writes are strictly restricted to the authorized working directory root.
- **Resource Shields**: Active decompression ratio checks (100:1 max) and XML entity expansion shields.

---

## Links & Community

- **Repository**: [https://github.com/Grevix/berryn](https://github.com/Grevix/berryn)
- **Issue Tracker**: [https://github.com/Grevix/berryn/issues](https://github.com/Grevix/berryn/issues)
- **License**: [MIT](https://opensource.org/licenses/MIT) © 2026 Berryn Core Engineering Team
