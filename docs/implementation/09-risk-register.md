# BERRYN RISK REGISTER & HOSTILE REVIEW

---

## 1. Top Technical Risks & Mitigations

1. **Silent Data Loss during Workbook Mutation**:
   - *Risk*: Modifying a sheet discards unmodeled custom XML or VBA binary parts.
   - *Control*: `@berryn/preservation` generates a `PreservationManifest` and executes `assertNoSilentLoss()`. If an opaque part is dropped, execution aborts with `BRN-XLSX-MUTATION-REJECTED`.

2. **False Reassurance from Consumer Open Success**:
   - *Risk*: A file opens in LibreOffice but cell formulas or formatting were lost.
   - *Control*: Layered validation in `@berryn/xlsx-validate` computes semantic XML diffs independently of consumer smoke tests.

3. **Untrusted Code Execution during Project Inspection**:
   - *Risk*: Project scanner executes malicious `scripts` or `postinstall` hooks in scanned target repositories.
   - *Control*: `@berryn/project-inspect` performs static AST scanning only (`ts-morph`) and never invokes `eval()` or project scripts.

4. **Supply Chain & Vulnerable Dependencies**:
   - *Risk*: Berryn inherits unpatched vulnerabilities from legacy XLSX dependencies.
   - *Control*: Berryn uses zero legacy XLSX dependencies; parsing uses modern `fflate` and `fast-xml-parser` under strict limits.
