# @berryn/core

> **Core types, policy context, result envelopes, hashing, and error models for Berryn infrastructure.**

[![npm version](https://img.shields.io/npm/v/@berryn/core.svg)](https://www.npmjs.com/package/@berryn/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Overview

`@berryn/core` provides the foundational abstractions and vertical-neutral primitives for the entire Berryn ecosystem. It defines the deterministic execution context (`RunContext`), structured diagnostic envelopes (`ResultEnvelope<T>`), execution policies and resource limits (`BerrynPolicy`), branded types, cryptographic content hashing, and domain error hierarchies.

All Berryn packages build upon this core contract to guarantee reproducibility, tamper resistance, and consistent diagnostic reporting.

---

## Installation

```bash
# Using pnpm
pnpm add @berryn/core

# Using npm
npm install @berryn/core
```

---

## Key Features

- **Standardized Result Envelope**: Uniform envelope wrapping payloads, execution status, metadata, and diagnostic collections.
- **Hermetic Run Context**: Cryptographically pinned execution environment with runtime tracking and policy hashing.
- **Configurable Policies**: Resource budgets (memory, decompression ratio, timeouts) and sandbox boundary definitions.
- **Branded Types**: Type-safe branded primitives for `RunId`, `ContentHash`, and `DiagnosticCode`.
- **Domain Error Hierarchy**: Strongly-typed errors with embedded diagnostics (`BerrynError`, `BerrynCompatibilityError`, `BerrynSecurityError`).

---

## API & Usage Examples

### 1. Creating a Run Context

The `RunContext` captures environment invariants, pins the active policy hash, and generates unique run identifiers.

```typescript
import { createRunContext, DEFAULT_BERRYN_POLICY } from '@berryn/core';

const context = createRunContext({
  cwd: process.cwd(),
  toolVersion: '0.1.0',
  policy: {
    ...DEFAULT_BERRYN_POLICY,
    network: 'disabled',
    limits: {
      maxFileSize: 50 * 1024 * 1024,      // 50 MB
      maxMemoryRss: 512 * 1024 * 1024,    // 512 MB
      maxZipRatio: 100,                   // 100:1 ratio limit
      timeoutMs: 30_000                   // 30s timeout
    }
  }
});

console.log(`Run ID: ${context.runMetadata.runId}`);
console.log(`Policy Hash: ${context.policy.policyHash}`);
```

---

### 2. Wrapping Results in a `ResultEnvelope`

Every operation in Berryn returns a deterministic `ResultEnvelope<T>` containing typed payloads and diagnostic collections.

```typescript
import { createResultEnvelope, createSuccessEnvelope, createErrorEnvelope } from '@berryn/core';

// Create a successful result envelope
const success = createSuccessEnvelope(
  { processedFiles: 42, durationMs: 120 },
  context.runMetadata
);

// Create an envelope with diagnostics
const customEnvelope = createResultEnvelope({
  status: 'passed-with-warnings',
  value: { transformed: true },
  metadata: context.runMetadata,
  diagnostics: [
    {
      code: 'BRN-VAL-003' as any,
      severity: 'warning',
      message: 'Optional metadata part omitted during serialization.',
      confidence: 'high'
    }
  ]
});
```

---

### 3. Cryptographic Content Hashing

Deterministic SHA-256 content hashing for binary buffers and UTF-8 strings.

```typescript
import { hashBuffer, hashString } from '@berryn/core';

const bufferHash = hashBuffer(new Uint8Array([1, 2, 3, 4]));
const stringHash = hashString('Berryn OOXML Manifest');

console.log(bufferHash); // sha256:...
```

---

### 4. Error Handling with `BerrynError`

Berryn domain errors wrap full diagnostic information to provide actionable context and remediation guidance.

```typescript
import { BerrynCompatibilityError, makeDiagnosticCode } from '@berryn/core';

throw new BerrynCompatibilityError(
  'Direct assignment to worksheet.protect() is not supported in facade.',
  {
    code: makeDiagnosticCode('BRN-COMPAT-001'),
    severity: 'error',
    message: 'Unsupported legacy method invocation.',
    confidence: 'high',
    remediation: 'Use worksheet.protect(password, options) method call.'
  }
);
```

---

## Exported Symbols

| Symbol | Category | Description |
|---|---|---|
| `createRunContext` | Factory | Initializes a deterministic execution context and pinned policy hash. |
| `createResultEnvelope` | Factory | Wraps arbitrary execution values into a standardized envelope. |
| `createSuccessEnvelope` | Factory | Shortcut for creating successful execution envelopes. |
| `createErrorEnvelope` | Factory | Shortcut for creating failure envelopes with attached diagnostics. |
| `BerrynPolicy` | Interface | Schema for sandbox boundaries, resource budgets, and network rules. |
| `ResourceLimits` | Interface | Upper bounds for file sizes, memory usage, zip ratios, and timeouts. |
| `ResultEnvelope<T>` | Interface | Generic wrapper standardizing value, status, run metadata, and diagnostics. |
| `RunMetadata` | Interface | Cryptographic snapshot of runtime version, timestamps, and policy hash. |
| `BerrynError` | Class | Base error class with embedded diagnostic context. |
| `BerrynSecurityError` | Class | Thrown upon sandbox or resource limit violations. |
| `BerrynValidationError` | Class | Thrown upon structural or semantic validation failures. |
| `BerrynCompatibilityError` | Class | Thrown when encountering unsupported compatibility facade APIs. |
| `hashBuffer` / `hashString` | Utility | Deterministic SHA-256 content hashing helpers. |

---

## Links

- **Repository**: [https://github.com/Grevix/berryn](https://github.com/Grevix/berryn)
- **License**: [MIT](https://opensource.org/licenses/MIT) © 2026 Berryn Core Engineering Team
