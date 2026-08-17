# @berryn/project-inspect

> **Package manifest inspector and `ts-morph` AST static import scanner.**

[![npm version](https://img.shields.io/npm/v/@berryn/project-inspect.svg)](https://www.npmjs.com/package/@berryn/project-inspect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Overview

`@berryn/project-inspect` statically analyzes application source trees and repository configuration without executing untrusted code. It detects incumbent libraries (`exceljs`, `xlsx`, `fluent-ffmpeg`), determines the active package manager (npm, pnpm, yarn, bun), and parses TypeScript/JavaScript ASTs to identify exact call sites, imported symbols, and usage patterns.

Static analysis eliminates runtime side-effects and provides the prerequisite dependency graph needed to plan safe codemods.

---

## Installation

```bash
# Using pnpm
pnpm add @berryn/project-inspect

# Using npm
npm install @berryn/project-inspect
```

---

## Key Features

- **Manifest Parsing (`inspectPackageManifest`)**: Scans `package.json` and lockfiles (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb`) to extract dependency versions and incumbent footprints.
- **Static AST Scanner (`scanSourceFileAst`)**: Leverages TypeScript compiler APIs and `ts-morph` to extract ESM imports, CommonJS `require()` calls, and member invocations.
- **Aggregated Project Graph (`inspectProject`)**: Combines manifest metadata and source-level call-site occurrences into a unified inspection structure.
- **Safety First**: Runs within the `@berryn/security` sandbox with zero code evaluation (`eval` / dynamic module execution).

---

## Usage Examples

### 1. Inspecting a Project Manifest

```typescript
import { inspectPackageManifest } from '@berryn/project-inspect';

const { manifest, diagnostics } = inspectPackageManifest('/workspace/my-project');

console.log(`Package Name: ${manifest.name}`);
console.log(`Package Manager: ${manifest.packageManager}`);
console.log(`Incumbent Detected:`, manifest.incumbentsFound);
// e.g. { exceljs: '^4.4.0' }
```

---

### 2. Scanning Source File AST for Incumbent Usage

```typescript
import { scanSourceFileAst } from '@berryn/project-inspect';

const { imports, calls, diagnostics } = scanSourceFileAst('/workspace/my-project/src/export.ts');

for (const imp of imports) {
  console.log(`Import at line ${imp.line}: ${imp.packageName} -> [${imp.importedSymbols.join(', ')}]`);
}

for (const call of calls) {
  console.log(`API call at line ${call.line}: ${call.expressionText} (method: ${call.methodName})`);
}
```

---

### 3. Full Project Inspection

```typescript
import { inspectProject } from '@berryn/project-inspect';

const sourceFiles = [
  '/workspace/my-project/src/index.ts',
  '/workspace/my-project/src/reports.ts'
];

const { value: projectReport, diagnostics } = inspectProject('/workspace/my-project', sourceFiles);

console.log(`Scanned ${projectReport.totalSourceFilesScanned} files.`);
console.log(`Found ${projectReport.imports.length} imports and ${projectReport.apiCalls.length} API calls.`);
```

---

## Exported Symbols

| Symbol | Type | Description |
|---|---|---|
| `inspectPackageManifest` | Function | Parses `package.json`, detects lockfiles, and identifies incumbent libraries. |
| `scanSourceFileAst` | Function | Static AST parser extracting imports and member call expressions. |
| `inspectProject` | Function | High-level orchestrator performing manifest and multi-file AST inspection. |
| `PackageManifestInfo` | Interface | Schema for parsed manifest data, package manager, and incumbent versions. |
| `ImportOccurrence` | Interface | Metadata for an import declaration (file, line, symbols, CJS vs ESM). |
| `ApiCallOccurrence` | Interface | Metadata for an API call site (file, line, method name, expression text). |
| `ProjectInspectionResult` | Interface | Aggregated result structure containing manifest and all occurrences. |

---

## Links

- **Repository**: [https://github.com/Grevix/berryn](https://github.com/Grevix/berryn)
- **License**: [MIT](https://opensource.org/licenses/MIT) © 2026 Berryn Core Engineering Team
