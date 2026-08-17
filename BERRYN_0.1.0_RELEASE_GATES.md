# Berryn 0.1.0 Release Gates & Validation Protocol
## Mandate for Public Version 0.1.0 Release Approval

---

## 1. Executive Release Gate Principle

No release of Berryn **0.1.0** may be published to npm or distributed publicly unless **100% of required release gates pass**. 

A single gate failure in a required category halts the release pipeline immediately. Exceptions cannot be granted to bypass known exploitable security vulnerabilities or silent data corruption risks.

---

## 2. Release Validation Matrix

The release matrix below governs public version `0.1.0` (which encapsulates capability scope 0.1.0 through 0.5.0):

| Release Gate | Gate Category | Requirement Level | Failure Action | Required Evidence |
|---|---|---|---|---|
| **Formatting & Linting** | Code Quality | **Required** | Block Release | `pnpm prettier --check` & `pnpm eslint` pass cleanly. |
| **TypeScript Typecheck** | Code Quality | **Required** | Block Release | `pnpm -r exec tsc --noEmit` returns zero errors. |
| **Unit Test Suite** | Reliability | **Required** | Block Release | `vitest run` 100% pass across all packages. |
| **Integration Test Suite** | Reliability | **Required** | Block Release | E2E CLI workflow execution tests pass. |
| **Property & Fuzzing** | Security / Robustness | **Required** | Block Release | `fast-check` generator & stream fuzzing pass zero crashes. |
| **SAST & SCA Scanning** | Security | **Required** | Block Release | Sonar / CodeQL static analysis yields 0 critical/high findings. |
| **Dependency Vulnerabilities** | Security | **Required** | Block Release | `pnpm audit --audit-level=high` reports zero vulnerabilities. |
| **Secret Scanning** | Security | **Required** | Block Release | `gitleaks` / secret scanner confirms zero leaked credentials. |
| **License Compliance** | Compliance | **Required** | Block Release | All dependencies match OSI-approved permissive licenses. |
| **SBOM Generation** | Supply Chain | **Required** | Block Release | Valid CycloneDX / SPDX JSON SBOM emitted by tool. |
| **npm Provenance** | Supply Chain | **Required** | Block Release | OIDC attestations bound to GitHub Actions release run. |
| **Clean Install Smoke Test** | Distribution | **Required** | Block Release | `npm install -g berryn@0.1.0` succeeds in isolated Docker container. |
| **Real Fixture Corpus** | Validation | **Required** | Block Release | 100% pass on synthetic, malformed, security, and public-real fixtures. |
| **Offline Sandbox Gate** | Security / Privacy | **Required** | Block Release | CLI execution with `--no-network` makes zero socket calls. |
| **Rollback Rehearsal** | Operational | **Required** | Block Release | `npm deprecate` script and release rollback procedure tested. |

---

## 3. Detailed Gate Enforcement Protocol

### Gate 1: Code Quality & Type Safety
```bash
# Must pass without warnings or errors
pnpm prettier --check "."
pnpm eslint "packages/*/src/**/*.ts"
pnpm -r exec tsc --noEmit
```

### Gate 2: Security & Vulnerability Controls
- **ZIP Bomb Shield**: Fuzzing suite submits nested archives and high-ratio compressed payloads. Engine must reject with Exit Code `5` (`ERR_SECURITY`).
- **XXE Shield**: XML payload with `<!ENTITY>` external definitions must be parsed with entities disabled. Zero network fetch or local file read attempts permitted.
- **Path Sandbox**: Target directory operations attempting `../` traversal must throw `SecurityError` with Exit Code `5`.

### Gate 3: Real Fixture & Regression Verification
- All test workbooks in `fixtures/` must process deterministically.
- SHA-256 output hashes for normalized diffs must match golden references exactly across 10 consecutive test runs.

### Gate 4: Supply-Chain & Release Integrity
- Release must be triggered via GitHub Actions tag push (`v0.1.0`).
- Build worker uses GitHub OIDC Trusted Publishing (no static `NPM_TOKEN`).
- Software Bill of Materials (`sbom.json`) generated and attached to release artifacts.

---

## 4. Post-Publish Verification & Rollback Procedure

### Post-Publish Verification Protocol
1. Spin up clean Node.js 22 LTS container environment.
2. Run `npm install -g berryn@0.1.0`.
3. Verify version string: `berryn --version` returns `0.1.0`.
4. Run sample inspection: `berryn inspect ./fixtures/public-real/sample.xlsx`.
5. Confirm exit code `0` and valid `BERRYN_REPORT_V1` JSON output.

### Emergency Rollback Protocol
If a critical post-release flaw or zero-day regression is identified post-publish:
1. Immediately issue deprecation via npm CLI:
   ```bash
   npm deprecate berryn@0.1.0 "Critical regression identified in 0.1.0. Please upgrade to 0.1.0-patch1 or downgrade."
   ```
2. Trigger rollback GitHub Actions workflow to publish patch release containing fix and new security regression fixture.
3. Post security advisory to repository release notes detailing impact and remediation.
