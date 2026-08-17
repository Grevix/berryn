# BERRYN SECURITY CONSTITUTION & THREAT MODEL

**Invariant**: *No Berryn release may knowingly ship a known exploitable vulnerability that has failed the project's defined security gates.*

---

## 1. Threat Control Matrix

| Threat Category | Attack Vector | Prevention Control | Detection & Audit |
|---|---|---|---|
| **ZIP Bomb / Decompression** | Crafted compression ratio | `assertZipBombRatio()` (Max 100:1 ratio) | Memory & entry counters |
| **Path Traversal / Symlink** | `../` relative path or symlink | `assertPathInSandbox()` (Canonical allowed roots) | Path resolution check |
| **XXE & DTD Expansion** | External entity in XML | `assertSafeXmlPayload()` (Disables DTD/XInclude) | Fast XML parser guard |
| **Resource Exhaustion** | Oversized buffers / entries | `assertResourceLimits()` (Max 512 MB input, 2 GB total) | Resource counter check |
| **No Silent Data Loss** | Opaque part dropping | `assertNoSilentLoss()` | Preservation manifest diff |
| **Command Injection** | Unsafe shell interpolation | Explicit argument arrays in process execution | Command argument audit |

---

## 2. Default Execution Constraints

- **Offline Execution**: Local-first network isolation (`network: 'disabled'`).
- **Zero Default Upload**: Source files, workbooks, and telemetry are never uploaded without explicit opt-in.
