# @berryn/ffmpeg-probe

> **Research probe evaluating `fluent-ffmpeg` usage patterns and direct process spawn recommendations.**

[![npm version](https://img.shields.io/npm/v/@berryn/ffmpeg-probe.svg)](https://www.npmjs.com/package/@berryn/ffmpeg-probe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Overview

`@berryn/ffmpeg-probe` is a specialized research adapter that evaluates the feasibility of migrating codebases away from unmaintained wrappers like `fluent-ffmpeg` toward modern, secure, direct process spawning via `node:child_process.spawn`.

The probe statically inspects repository manifests, analyzes FFmpeg call chains, and outputs actionable architectural migration recommendations.

---

## Motivation

Many Node.js applications rely on `fluent-ffmpeg` for audio/video transcoding. However, `fluent-ffmpeg`:
- Has unaddressed edge cases around stream buffering, unhandled process errors, and zombie child processes.
- Conceals underlying FFmpeg command-line arguments, complicating debugging and hardware acceleration (VAAPI, NVENC, QuickSync).
- Adds unnecessary abstraction over standard Node.js stream piping.

Berryn's research probe analyzes existing call sites and formulates direct-spawn conversion recipes.

---

## Installation

```bash
# Using pnpm
pnpm add @berryn/ffmpeg-probe

# Using npm
npm install @berryn/ffmpeg-probe
```

---

## Usage Examples

### Inspecting a Target Project for `fluent-ffmpeg`

```typescript
import { createRunContext } from '@berryn/core';
import { FfmpegProbeAdapter } from '@berryn/ffmpeg-probe';

const adapter = new FfmpegProbeAdapter();
const context = createRunContext({ cwd: '/workspace/video-service' });

const { value: result, diagnostics } = await adapter.inspectTarget('/workspace/video-service', context);

console.log(`Fluent-FFmpeg Detected: ${result.fluentFfmpegDetected}`);
console.log(`Recommended Path: ${result.recommendedPath}`); // 'direct-spawn'
console.log(`Observed Patterns:`, result.observedPatterns);

const feasibility = await adapter.evaluateMigrationFeasibility('/workspace/video-service');
console.log(`Feasible: ${feasibility.feasible}, Approach: ${feasibility.recommendedApproach}`);
```

---

## Exported Symbols

| Symbol | Category | Description |
|---|---|---|
| `FfmpegProbeAdapter` | Class | `VerticalAdapter` implementation for static FFmpeg usage analysis. |
| `FfmpegInspectionResult` | Interface | Schema containing detection flags, observed patterns, and recommended migration paths. |

---

## Links

- **Repository**: [https://github.com/Grevix/berryn](https://github.com/Grevix/berryn)
- **License**: [MIT](https://opensource.org/licenses/MIT) © 2026 Berryn Core Engineering Team
