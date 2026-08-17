# @berryn/codemod

> **AST migration plan builder, unified `.patch` generator, and disposable Git worktree runner.**

[![npm version](https://img.shields.io/npm/v/@berryn/codemod.svg)](https://www.npmjs.com/package/@berryn/codemod)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Overview

`@berryn/codemod` automates the migration of legacy dependencies (such as `exceljs`) to Berryn compatibility facades using Abstract Syntax Tree (AST) manipulation powered by `ts-morph`.

Instead of performing unsafe string replacements or destructive in-place writes, `@berryn/codemod`:
1. Constructs a non-destructive, reversible AST transformation plan.
2. Emits standardized unified `.patch` files for code review and automated git application.
3. Provides disposable Git worktree sessions (`git worktree`) to run codemods, build checks, and test suites in full isolation without dirtying the developer's working directory.

---

## Installation

```bash
# Using pnpm
pnpm add @berryn/codemod

# Using npm
npm install @berryn/codemod
```

---

## Key Features

- **Reversible AST Rewriting (`generateExcelJsCodemodPlan`)**: Scans import declarations and API call sites, mapping incumbent package names to Berryn compatibility packages.
- **Unified Diff Generation (`createUnifiedPatch`)**: Renders a standard `git apply`-compatible patch preview showing line-by-line before/after code modifications.
- **Disposable Worktrees (`createDisposableWorktree`)**: Instantiates an ephemeral git worktree branch (`berryn-migration-*`) and guarantees teardown via a returned `cleanup()` handler.

---

## Usage Examples

### 1. Generating a Codemod Migration Plan

```typescript
import { generateExcelJsCodemodPlan } from '@berryn/codemod';

const projectRoot = '/workspace/my-app';
const sourceFiles = [
  '/workspace/my-app/src/excel/export.ts',
  '/workspace/my-app/src/services/report.ts'
];

const { plan, diagnostics } = generateExcelJsCodemodPlan(projectRoot, sourceFiles);

console.log(`Plan ID: ${plan.planId}`);
console.log(`Transformations Planned: ${plan.transformations.length}`);
console.log(`Confidence: ${plan.confidence}`);
```

---

### 2. Creating a Unified Patch Preview

```typescript
import { createUnifiedPatch } from '@berryn/codemod';

const patchText = createUnifiedPatch(plan);
console.log(patchText);

// Output:
// # Berryn Codemod Patch (Plan: plan_12345)
// # Target: /workspace/my-app
//
// --- a/src/excel/export.ts
// +++ b/src/excel/export.ts
// @@ -1,1 +1,1 @@
// -import ExcelJS from 'exceljs';
// +import ExcelJS from '@berryn/exceljs-compat';
```

---

### 3. Running Transformations in a Disposable Worktree

```typescript
import { createDisposableWorktree } from '@berryn/codemod';

const session = createDisposableWorktree('/workspace/my-app');

try {
  console.log(`Running isolated migration in: ${session.worktreePath}`);
  console.log(`On temporary branch: ${session.branchName}`);

  // Apply changes, run typecheck, run test suite...
} finally {
  // Always safely remove worktree and delete ephemeral branch
  session.cleanup();
}
```

---

## Exported Symbols

| Symbol | Category | Description |
|---|---|---|
| `generateExcelJsCodemodPlan` | Function | Scans source files with `ts-morph` and plans safe import & API replacements. |
| `createUnifiedPatch` | Function | Formats a `CodemodPlan` into a unified diff string. |
| `createDisposableWorktree` | Function | Spawns a temporary `git worktree` for isolated validation and cleanup. |
| `CodemodPlan` | Interface | Schema containing plan ID, target root, confidence, and transformation list. |
| `TransformationStep` | Interface | Individual AST transformation record with line number, kind, and diff strings. |
| `WorktreeSession` | Interface | Worktree context with `worktreePath`, `branchName`, and `cleanup()` callback. |

---

## Links

- **Repository**: [https://github.com/Grevix/berryn](https://github.com/Grevix/berryn)
- **License**: [MIT](https://opensource.org/licenses/MIT) © 2026 Berryn Core Engineering Team
