# BERRYN RELEASE AUDIT: 07 - SECURITY AUDIT

- **ZIP Decompression Defense**: `assertZipBombRatio(100:1)` active and verified.
- **Path Traversal Defense**: `assertPathInSandbox()` verifies roots and rejects relative `../` escapes.
- **XXE & DTD Defense**: `assertSafeXmlPayload()` disables external entity resolution and DTD processing.
- **Resource Limits**: Max 512 MB input, 2 GB uncompressed, 100,000 entries enforced.
- **Subprocess Execution**: Array-form `execFileSync` arguments used. Zero `shell: true` interpolation.
