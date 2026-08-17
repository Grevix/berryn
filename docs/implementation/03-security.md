# BERRYN SECURITY & TRUST CONSTITUTION

**Invariant**: *No Berryn release may knowingly ship a known exploitable vulnerability that has failed the project's defined security gates.*

---

## 1. Threat Control Register

| Threat Category | Attack Vector | Control Function | Blocking Release Gate |
|---|---|---|---|
| **ZIP Decompression Bomb** | Adversarial high-ratio compression archive | `assertZipBombRatio(compressed, uncompressed, ratioLimit=100)` | **REQUIRED** |
| **Path Traversal / Symlink Escape** | `../` relative or symlink archive path | `assertPathInSandbox(targetPath, allowedRoots)` | **REQUIRED** |
| **XML External Entity (XXE)** | `<!ENTITY>` or DTD expansion payload | `assertSafeXmlPayload(xmlContent)` | **REQUIRED** |
| **Resource Limit Exhaustion** | Oversized byte buffer or entry count | `assertResourceLimits(metrics, policyLimits)` | **REQUIRED** |
| **No Silent Data Loss** | Dropping unmodeled opaque OOXML parts | `assertNoSilentLoss(beforeManifest, afterManifest)` | **REQUIRED** |
| **Unsafe Subprocess Command Injection** | Shell string interpolation | Explicit argument arrays in `execFileSync` | **REQUIRED** |

---

## 2. Default Policy Standards

- **Network Access**: Denied by default (`network: 'disabled'`). Local-first execution only.
- **Data Upload**: Zero default uploading of source files, workbooks, or telemetry.
- **Resource Default Limits**:
  - Max Input Bytes: 512 MB
  - Max Total Uncompressed Bytes: 2 GB
  - Max Compression Ratio: 100:1
  - Max XML Depth: 50
