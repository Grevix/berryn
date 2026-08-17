# BERRYN RELEASE AUDIT: 16 - NO SILENT LOSS AUDIT

- **Preservation Manifest**: `@berryn/preservation` calculates `PreservationManifest`.
- **No-Silent-Loss Guard**: `assertNoSilentLoss()` verifies opaque parts before and after mutation.
- **Fail-Safe Exception**: Dropped opaque parts throw `NoSilentLossError` (`BRN-XLSX-MUTATION-REJECTED`).
