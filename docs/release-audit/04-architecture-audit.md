# BERRYN RELEASE AUDIT: 04 - ARCHITECTURE AUDIT

- **Acyclic Dependencies**: Verified zero circular dependencies across all 15 packages.
- **Vertical Neutrality**: `@berryn/core` contains zero XLSX or format-specific logic.
- **Security Scoping**: All I/O and archive boundaries delegate to `@berryn/security`.
- **CLI Separation**: `packages/cli` contains zero embedded parser logic; delegates to workspace packages.
