# @berryn/xlsx-inspect

> **Bounded XLSX package ZIP archive reader and Open Packaging Conventions (OPC) relationship parser.**

[![npm version](https://img.shields.io/npm/v/@berryn/xlsx-inspect.svg)](https://www.npmjs.com/package/@berryn/xlsx-inspect)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Overview

`@berryn/xlsx-inspect` performs deep structural inventory and relationship graph extraction on Open Packaging Conventions (OPC) spreadsheet packages (`.xlsx`, `.xlsm`, `.xltx`).

It safely reads ZIP container archives using bounded memory constraints, parses `[Content_Types].xml` and `_rels/.rels` graphs, and classifies every package part against Berryn's 5-tier support taxonomy.

---

## Installation

```bash
# Using pnpm
pnpm add @berryn/xlsx-inspect

# Using npm
npm install @berryn/xlsx-inspect
```

---

## 5-Tier Part Classification Taxonomy

Every ZIP entry in the OOXML package is evaluated and assigned to a tier:

| Tier | Meaning | Examples |
|---|---|---|
| `supported` | Fully modeled and semantically validated by Berryn. | `xl/workbook.xml`, `xl/worksheets/sheet1.xml`, `xl/styles.xml`, `xl/sharedStrings.xml` |
| `partially-supported` | Modeled with bounded feature coverage. | `xl/tables/table1.xml`, `xl/theme/theme1.xml` |
| `preserved-not-modeled` | Opaque binary/XML preserved byte-for-byte to prevent silent data loss. | `xl/pivotTables/pivotTable1.xml`, `xl/drawings/drawing1.xml`, `xl/media/image1.png`, `customXml/*` |
| `unsupported` | Known OOXML feature currently out of scope. Emits audit warning. | `xl/vbaProject.bin`, `xl/activeX/*` |
| `rejected` | Hazardous, unrecognized, or invalid part violating safety invariants. | Unrecognized executable binaries or corrupted parts |

---

## Usage Examples

### 1. Inspecting an XLSX Workbook Buffer

```typescript
import { readFileSync } from 'node:fs';
import { inspectXlsx } from '@berryn/xlsx-inspect';

const buffer = readFileSync('financial_model.xlsx');
const { value: report, diagnostics } = inspectXlsx(buffer);

console.log(`Total Entries: ${report.containerMeta.totalEntries}`);
console.log(`Uncompressed Size: ${report.containerMeta.totalUncompressedBytes} bytes`);
console.log(`Unsupported Parts: ${report.unsupportedPartCount}`);

for (const part of report.parts) {
  console.log(`[${part.classification.toUpperCase()}] ${part.partPath} (${part.contentType})`);
}
```

---

### 2. Low-Level Bounded ZIP Container Reading

```typescript
import { readZipContainer } from '@berryn/xlsx-inspect';
import { DEFAULT_RESOURCE_LIMITS } from '@berryn/core';

const { container, diagnostics } = readZipContainer(buffer, DEFAULT_RESOURCE_LIMITS);

for (const meta of container.meta) {
  console.log(`Path: ${meta.path}, Size: ${meta.uncompressedSize} bytes, CRC32: ${meta.crc32}`);
}
```

---

### 3. Parsing OPC Relationships and Content Types

```typescript
import { parseContentTypesXml, parseRelsXml } from '@berryn/xlsx-inspect';

// Parse [Content_Types].xml
const contentTypesXml = new TextDecoder().decode(container.entries.get('[Content_Types].xml')!);
const { contentTypes } = parseContentTypesXml(contentTypesXml);

console.log('Overrides:', contentTypes.overrides);

// Parse root _rels/.rels
const relsXml = new TextDecoder().decode(container.entries.get('_rels/.rels')!);
const { relationships } = parseRelsXml(relsXml);

for (const rel of relationships) {
  console.log(`ID: ${rel.id} -> Type: ${rel.type} -> Target: ${rel.target}`);
}
```

---

## Exported Symbols

| Symbol | Category | Description |
|---|---|---|
| `inspectXlsx` | Function | High-level inspector returning full metadata, part classifications, and OPC relations. |
| `readZipContainer` | Function | Safe, memory-bounded ZIP decompression and entry extraction (`fflate`). |
| `parseContentTypesXml` | Function | Extracts `Default` extension mappings and `Override` part content types. |
| `parseRelsXml` | Function | Parses OOXML relationship XML documents into typed `OpcRelationship[]` records. |
| `classifyOpcPart` | Function | Maps part path and MIME content-type to one of the 5 classification tiers. |
| `XlsxInspectionReport` | Interface | Aggregate inspection report containing container metrics, parts, and diagnostics. |
| `PartClassification` | Interface | Structure describing path, content type, tier, and associated diagnostic notes. |

---

## Links

- **Repository**: [https://github.com/Grevix/berryn](https://github.com/Grevix/berryn)
- **License**: [MIT](https://opensource.org/licenses/MIT) © 2026 Berryn Core Engineering Team
