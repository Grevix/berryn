# BERRYN FIXTURE STRATEGY & REGISTRY

---

## 1. Fixture Classification & Storage Model

Fixtures are stored under `tests/unit/` and `fixtures/` with explicit metadata tracking:

- **Synthetic Fixtures**: Micro-workbooks and project manifests generated in memory for fast deterministic unit testing.
- **Malformed & Adversarial Fixtures**: Truncated ZIP files, invalid XML documents, XXE payloads, ZIP bombs, and broken relationship graphs.
- **Public Fixtures**: Openly licensed sample XLSX files for feature classification and diff verification.

---

## 2. Privacy & Sanitization Rules

1. **Local-First Privacy**: Customer workbooks must be sanitized (redacting text/formulas while preserving OOXML graph structure) before inclusion in non-private fixture sets.
2. **Hash Provenance**: Every fixture records its original `ContentHash` to detect tampering or accidental modification.
