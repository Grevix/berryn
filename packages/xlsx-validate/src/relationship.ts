import type { Diagnostic } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { inspectXlsx } from '@berryn/xlsx-inspect';
import type { ValidationStageResult } from './structural.js';

export function validateRelationshipIntegrity(buffer: Uint8Array): ValidationStageResult {
  const diagnostics: Diagnostic[] = [];
  let passed = true;

  try {
    const { value: report, diagnostics: inspectDiags } = inspectXlsx(buffer);
    diagnostics.push(...inspectDiags);

    const partPaths = new Set(report.parts.map((p) => p.partPath.toLowerCase()));

    for (const rel of report.relationships) {
      if (rel.targetMode === 'External') continue;

      let targetNormalized = rel.target.startsWith('/') ? rel.target : `/xl/${rel.target}`;
      targetNormalized = targetNormalized.toLowerCase();

      if (!partPaths.has(targetNormalized) && !partPaths.has(rel.target.toLowerCase())) {
        passed = false;
        diagnostics.push(
          createDiagnostic({
            code: DIAGNOSTIC_CODES.VAL_RELATIONSHIP_FAILED,
            severity: 'error',
            message: `Broken OPC relationship '${rel.id}': Target part '${rel.target}' does not exist in package.`
          })
        );
      }
    }
  } catch (err: any) {
    passed = false;
  }

  return {
    passed,
    stageName: 'OPC Relationship Validation',
    diagnostics
  };
}
