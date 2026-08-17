# BERRYN RELEASE AUDIT: 17 - MIGRATION SAFETY AUDIT

- **Dry-Run Default**: Default CLI migration runs in `--dry-run` or plan preview mode.
- **Reversible AST Transformations**: `ts-morph` AST codemods generate unified `.patch` preview files.
- **Disposable Git Worktrees**: `createDisposableWorktree()` isolates transformations.
