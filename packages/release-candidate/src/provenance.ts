import type { Diagnostic } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';

export interface ProvenanceStatement {
  builderId: string;
  buildType: string;
  invocation: {
    configSource: { uri: string; digest: Record<string, string> };
  };
  verified: boolean;
}

export function verifyProvenanceAttestation(attestationJson: string): { statement: ProvenanceStatement; diagnostics: Diagnostic[] } {
  const diagnostics: Diagnostic[] = [];

  try {
    const parsed = JSON.parse(attestationJson);
    const verified = parsed.builderId && parsed.invocation;

    return {
      statement: {
        builderId: parsed.builderId || 'https://github.com/actions/runner',
        buildType: parsed.buildType || 'https://github.com/npm/provenance/v1',
        invocation: parsed.invocation || { configSource: { uri: 'git+https://github.com/berryn/berryn', digest: {} } },
        verified: !!verified
      },
      diagnostics
    };
  } catch (err: any) {
    diagnostics.push(
      createDiagnostic({
        code: DIAGNOSTIC_CODES.SEC_RESOURCE_EXCEEDED,
        severity: 'error',
        message: `Failed to parse npm provenance attestation statement: ${err.message}`
      })
    );

    return {
      statement: {
        builderId: 'unknown',
        buildType: 'unknown',
        invocation: { configSource: { uri: '', digest: {} } },
        verified: false
      },
      diagnostics
    };
  }
}
