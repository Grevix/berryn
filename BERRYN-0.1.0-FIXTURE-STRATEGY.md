# BERRYN FIXTURE STRATEGY & REGISTRY

---

## 1. Registry Architecture

Fixtures are classified under 4 tiers:

1. **Synthetic Fixtures**: Generated in memory for fast unit tests.
2. **Malformed & Adversarial Fixtures**: Corrupted ZIP archives, XXE payloads, ZIP bombs, invalid OPC XML.
3. **Public Open Fixtures**: Permissively licensed sample workbooks.
4. **Sanitized Customer Fixtures**: Redacted workbooks preserving graph structure without proprietary data.
