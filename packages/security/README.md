# @berryn/security

> **Security sandbox, canonical path validation, resource limit enforcement, and XXE / ZIP bomb ratio shields.**

[![npm version](https://img.shields.io/npm/v/@berryn/security.svg)](https://www.npmjs.com/package/@berryn/security)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Overview

`@berryn/security` provides defense-in-depth protections for parsing untrusted spreadsheet binaries and inspecting foreign codebases. It enforces strict path traversal sandboxing, decompression ratio anomaly detection (ZIP bombs), XML External Entity (XXE) and billion laughs expansion shields, and hard resource limit constraints.

Spreadsheet containers (`.xlsx`, `.xlsm`) are compressed ZIP archives containing nested XML files, making them common vectors for denial-of-service (DoS) and path traversal attacks. `@berryn/security` ensures zero untrusted file operations occur outside explicit sandbox boundaries.

---

## Installation

```bash
# Using pnpm
pnpm add @berryn/security

# Using npm
npm install @berryn/security
```

---

## Key Security Shields

1. **Path Traversal Shield (`assertPathInSandbox`)**:
   - Resolves target paths canonicalizing `../`, symlinks, and Windows/POSIX path separators.
   - Throws `SecurityError` with code `BRN-SEC-001` if a path resolves outside authorized sandbox roots.

2. **ZIP Bomb & Decompression Ratio Shield (`assertZipBombRatio`)**:
   - Analyzes compression ratios before and during decompression.
   - Rejects archives exceeding a configurable ratio limit (default: 100:1 for payloads > 10MB) with `BRN-SEC-002`.

3. **XXE & Billion Laughs Shield (`assertSafeXmlPayload`)**:
   - Strictly forbids `<!DOCTYPE>` declarations, internal/external `<!ENTITY>` definitions, and external `XInclude` directives.
   - Rejects malicious XML payloads prior to AST parsing with `BRN-SEC-003`.

4. **Resource Limit Guard (`assertResourceLimits`)**:
   - Enforces ceilings on maximum archive entry count, individual entry size, aggregate uncompressed bytes, and XML nesting depth.

---

## Usage Examples

### 1. Enforcing Sandbox Paths

```typescript
import { assertPathInSandbox, SecurityError } from '@berryn/security';

try {
  // Will succeed if inside project workspace
  const safePath = assertPathInSandbox('./data/input.xlsx', ['/workspace/app']);
  console.log(`Access granted: ${safePath}`);

  // Will throw SecurityError (BRN-SEC-001)
  assertPathInSandbox('../../../etc/passwd', ['/workspace/app']);
} catch (error) {
  if (error instanceof SecurityError) {
    console.error(`Security violation: ${error.diagnostic.code} - ${error.message}`);
  }
}
```

---

### 2. Guarding Against ZIP Bomb Anomalies

```typescript
import { assertZipBombRatio } from '@berryn/security';

const compressedSize = 1024; // 1 KB
const uncompressedSize = 100 * 1024 * 1024; // 100 MB (Ratio 102,400:1)

// Throws SecurityError (BRN-SEC-002)
assertZipBombRatio(compressedSize, uncompressedSize, 100);
```

---

### 3. XML Entity & XXE Shield

```typescript
import { assertSafeXmlPayload } from '@berryn/security';

const maliciousXml = `<?xml version="1.0"?>
<!DOCTYPE root [
  <!ENTITY xxe SYSTEM "file:///etc/shadow">
]>
<root>&xxe;</root>`;

// Throws SecurityError (BRN-SEC-003)
assertSafeXmlPayload(maliciousXml);
```

---

### 4. Enforcing Resource Limits

```typescript
import { assertResourceLimits } from '@berryn/security';
import { DEFAULT_RESOURCE_LIMITS } from '@berryn/core';

assertResourceLimits(
  {
    entryCount: 50,
    totalUncompressedBytes: 15 * 1024 * 1024,
    xmlDepth: 8
  },
  DEFAULT_RESOURCE_LIMITS
);
```

---

## Exported Symbols

| Symbol | Type | Description |
|---|---|---|
| `assertPathInSandbox` | Function | Validates that a path is fully contained inside allowed sandbox roots. |
| `assertZipBombRatio` | Function | Checks compression ratio against maximum allowed safety limits. |
| `assertSafeXmlPayload` | Function | Rejects XML containing DOCTYPE, ENTITY, or external XInclude references. |
| `assertResourceLimits` | Function | Verifies memory, file size, entry count, and XML depth metrics. |
| `SecurityError` | Class | Domain error wrapping a `Diagnostic` object with `BRN-SEC-*` codes. |

---

## Links

- **Repository**: [https://github.com/Grevix/berryn](https://github.com/Grevix/berryn)
- **License**: [MIT](https://opensource.org/licenses/MIT) © 2026 Berryn Core Engineering Team
