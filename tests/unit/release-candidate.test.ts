import { describe, expect, it } from 'vitest';
import { auditReleaseGates, generateSbomJson, verifyProvenanceAttestation } from '../../packages/release-candidate/src/index.js';

describe('@berryn/release-candidate', () => {
  it('generates valid CycloneDX SBOM JSON', () => {
    const sbom = generateSbomJson('@berryn/core', '0.1.0', { fflate: '^0.8.2' });
    expect(sbom.bomFormat).toBe('CycloneDX');
    expect(sbom.components.length).toBe(1);
  });

  it('audits release gates cleanly', () => {
    const { results, overallPassed } = auditReleaseGates();
    expect(overallPassed).toBe(true);
    expect(results.length).toBe(6);
  });

  it('parses npm provenance attestation statement', () => {
    const json = JSON.stringify({ builderId: 'https://github.com/actions/runner', invocation: { configSource: { uri: 'git+https://github.com/berryn/berryn' } } });
    const { statement } = verifyProvenanceAttestation(json);
    expect(statement.verified).toBe(true);
  });
});
