# BERRYN RISK REGISTER & HOSTILE ARCHITECTURAL REVIEW

---

## 1. Hostile Architecture Review Q&A (20 Questions)

1. **Q: Is Berryn an ExcelJS replacement?**  
   *A*: No. Berryn is Migration, Compatibility, and Validation Infrastructure. XLSX is its first vertical.

2. **Q: Can Berryn silently destroy unknown OOXML parts?**  
   *A*: No. `@berryn/preservation` enforces `assertNoSilentLoss()`. Dropping unknown parts aborts with `BRN-XLSX-MUTATION-REJECTED`.

3. **Q: Does project inspection execute lifecycle scripts?**  
   *A*: No. `@berryn/project-inspect` uses static AST parsing (`ts-morph`) and manifest parsing only.

4. **Q: Are dynamic regex rewrites permitted in codemods?**  
   *A*: No. Codemods require AST-driven, reversible, confidence-labeled transformations.

5. **Q: Are user workbooks uploaded to external servers?**  
   *A*: No. Default policy is 100% offline (`network: 'disabled'`).

6. **Q: What happens when an unsupported ExcelJS method is called?**  
   *A*: The facade fails loudly by throwing `BerrynCompatibilityError` with a diagnostic code and remediation.

7. **Q: Does opening a file in Excel prove semantic equivalence?**  
   *A*: No. Consumer opening is one signal; layered XML semantic diffing and relationship validation are required.

8. **Q: How are ZIP bomb attacks prevented?**  
   *A*: `@berryn/security` asserts `assertZipBombRatio()` (max 100:1 compression ratio).

9. **Q: How are XXE payloads prevented?**  
   *A*: `@berryn/security` asserts `assertSafeXmlPayload()` to disable DTDs, external entities, and XInclude.

10. **Q: How are path traversal attacks prevented?**  
    *A*: `@berryn/security` canonicalizes paths using `assertPathInSandbox()` against allowed roots.

11. **Q: Is FFmpeg a giant wrapper package in Berryn?**  
    *A*: No. `@berryn/ffmpeg-probe` is an evidence probe recommending direct `child_process.spawn("ffmpeg")` where appropriate.

12. **Q: What version is published to npm?**  
    *A*: `0.1.0` locked across all packages in `package.json`.

13. **Q: Are intermediate versions (0.2.0, 0.5.0, 1.0.0) published to npm?**  
    *A*: No. Intermediate versions represent internal implementation maturity stages under the public `0.1.0` umbrella.

14. **Q: How is supply chain security maintained?**  
    *A*: `@berryn/release-candidate` generates CycloneDX SBOMs and verifies npm OIDC provenance.

15. **Q: Are exit codes standardized across CLI commands?**  
    *A*: Yes (0 = SUCCESS, 2 = ERR_CONFIG, 3 = ERR_UNSUPPORTED, 4 = ERR_VALIDATION, 5 = ERR_SECURITY, 10 = ERR_INTERNAL).

16. **Q: Can CLI commands overwrite input files by default?**  
    *A*: No. Default mode is dry-run or plan preview.

17. **Q: Does Berryn invent performance metrics?**  
    *A*: No. All performance numbers are empirical measurements.

18. **Q: How are worktree mutations isolated?**  
    *A*: `@berryn/codemod` creates disposable Git worktrees using `createDisposableWorktree()`.

19. **Q: Is telemetry enabled by default?**  
    *A*: No. Zero telemetry by default.

20. **Q: What is the primary metric of success for Berryn?**  
    *A*: Verified developer migration utility, security, and retained CI validation.
