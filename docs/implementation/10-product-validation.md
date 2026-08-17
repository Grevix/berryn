# BERRYN PRODUCT VALIDATION VS IMPLEMENTATION VALIDATION

---

## 1. Constitutional Separation

- **Implementation Validation**: "Did we build what we specified?" (Design, TypeScript code, unit tests, integration tests, CI gates).
- **Product Validation**: "Did this solve a real developer problem?" (Real repository runs, reviewed migration PRs, staging deployments, retained CI usage).

---

## 2. Product Validation Dashboard Counters

- **Qualified Installations**: Clean installs followed by successful `berryn` runs.
- **Analyzed Repositories**: Repositories scanned by `berryn inspect --project`.
- **Accepted Migration Patches**: Unified `.patch` previews reviewed and merged by maintainers.
- **Recurring CI Installations**: Active GitHub Actions invocations across pull requests.
