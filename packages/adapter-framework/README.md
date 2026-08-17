# @berryn/adapter-framework

> **Abstract `VerticalAdapter` base class and migration capability contracts.**

[![npm version](https://img.shields.io/npm/v/@berryn/adapter-framework.svg)](https://www.npmjs.com/package/@berryn/adapter-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Overview

`@berryn/adapter-framework` provides the core extensibility contract for the Berryn ecosystem. While Berryn's initial primary focus is XLSX/spreadsheet migrations, the architecture is designed as a generalized dependency migration framework capable of supporting multiple technical verticals (e.g. `ffmpeg`, `pdf`, `images`, `csv`).

The framework defines standard contracts for target inspection, feasibility scoring, and capability negotiation via the abstract `VerticalAdapter` base class.

---

## Installation

```bash
# Using pnpm
pnpm add @berryn/adapter-framework

# Using npm
npm install @berryn/adapter-framework
```

---

## Architecture & Contract

Every vertical in Berryn implements `VerticalAdapter<TResult>`:

```typescript
export abstract class VerticalAdapter<TResult = VerticalInspectionResult> {
  abstract readonly verticalId: string;
  abstract readonly capabilities: AdapterCapability[];

  abstract inspectTarget(
    targetPath: string,
    context: RunContext
  ): Promise<{ value: TResult; diagnostics: Diagnostic[] }>;

  abstract evaluateMigrationFeasibility(
    targetPath: string
  ): Promise<{
    feasible: boolean;
    recommendedApproach: 'direct-spawn' | 'facade' | 'manual-refactor' | 'blocked';
  }>;
}
```

---

## Usage Examples

### Implementing a Custom Vertical Adapter

```typescript
import {
  VerticalAdapter,
  type AdapterCapability,
  type VerticalInspectionResult
} from '@berryn/adapter-framework';
import type { Diagnostic, RunContext } from '@berryn/core';

export interface PdfInspectionResult extends VerticalInspectionResult {
  pdfLibDetected: boolean;
}

export class PdfProbeAdapter extends VerticalAdapter<PdfInspectionResult> {
  readonly verticalId = 'pdf';
  readonly capabilities: AdapterCapability[] = [
    {
      id: 'cap_pdf_inspect',
      name: 'PDF Workflow Inspector',
      vertical: 'generic',
      supportedOperations: ['detect-legacy-pdfkit', 'evaluate-pdf-lib']
    }
  ];

  async inspectTarget(
    targetPath: string,
    context: RunContext
  ): Promise<{ value: PdfInspectionResult; diagnostics: Diagnostic[] }> {
    return {
      value: {
        vertical: 'pdf',
        incumbentName: 'pdfkit',
        pdfLibDetected: false,
        observedPatterns: ['pdfkit stream creation']
      },
      diagnostics: []
    };
  }

  async evaluateMigrationFeasibility(targetPath: string) {
    return {
      feasible: true,
      recommendedApproach: 'facade' as const
    };
  }
}
```

---

## Exported Symbols

| Symbol | Category | Description |
|---|---|---|
| `VerticalAdapter` | Abstract Class | Base class defining lifecycle methods for target inspection and feasibility analysis. |
| `AdapterCapability` | Interface | Schema declaring supported vertical operations and capability identifiers. |
| `VerticalInspectionResult` | Interface | Standardized result payload returned by vertical inspection operations. |

---

## Links

- **Repository**: [https://github.com/Grevix/berryn](https://github.com/Grevix/berryn)
- **License**: [MIT](https://opensource.org/licenses/MIT) © 2026 Berryn Core Engineering Team
