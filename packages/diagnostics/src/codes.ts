import type { Confidence, Diagnostic, DiagnosticCode, DiagnosticLocation, Severity } from '@berryn/core';
import { makeDiagnosticCode } from '@berryn/core';

export const DIAGNOSTIC_CODES = {
  // Security
  SEC_PATH_TRAVERSAL: makeDiagnosticCode('BRN-SEC-001'),
  SEC_ZIP_BOMB: makeDiagnosticCode('BRN-SEC-002'),
  SEC_XXE_PAYLOAD: makeDiagnosticCode('BRN-SEC-003'),
  SEC_RESOURCE_EXCEEDED: makeDiagnosticCode('BRN-SEC-004'),
  SEC_UNSAFE_SUBPROCESS: makeDiagnosticCode('BRN-SEC-005'),

  // Project Inspection
  PROJ_MANIFEST_NOT_FOUND: makeDiagnosticCode('BRN-PROJ-001'),
  PROJ_INCUMBENT_DETECTED: makeDiagnosticCode('BRN-PROJ-002'),
  PROJ_AST_DYNAMIC_CALL: makeDiagnosticCode('BRN-PROJ-003'),

  // XLSX Inspection & Diff
  XLSX_ZIP_MALFORMED: makeDiagnosticCode('BRN-XLSX-001'),
  XLSX_OPC_RELATIONSHIP_BROKEN: makeDiagnosticCode('BRN-XLSX-002'),
  XLSX_UNSUPPORTED_PART: makeDiagnosticCode('BRN-XLSX-003'),
  XLSX_MUTATION_REJECTED: makeDiagnosticCode('BRN-XLSX-004'),
  XLSX_SEMANTIC_MISMATCH: makeDiagnosticCode('BRN-XLSX-005'),

  // Validation
  VAL_STRUCTURAL_FAILED: makeDiagnosticCode('BRN-VAL-001'),
  VAL_RELATIONSHIP_FAILED: makeDiagnosticCode('BRN-VAL-002'),
  VAL_CONSUMER_REPAIR_WARNING: makeDiagnosticCode('BRN-VAL-003'),

  // Compatibility
  COMPAT_UNSUPPORTED_METHOD: makeDiagnosticCode('BRN-COMPAT-001'),

  // Codemod
  CODE_TRANSFORM_FAILED: makeDiagnosticCode('BRN-CODE-001'),
  CODE_AMBIGUOUS_AST: makeDiagnosticCode('BRN-CODE-002')
} as const;

export interface CreateDiagnosticOptions {
  code: DiagnosticCode;
  severity: Severity;
  message: string;
  confidence?: Confidence;
  location?: DiagnosticLocation;
  remediation?: string;
  evidenceRef?: string;
}

export function createDiagnostic(options: CreateDiagnosticOptions): Diagnostic {
  const diag: Diagnostic = {
    code: options.code,
    severity: options.severity,
    message: options.message,
    confidence: options.confidence ?? 'high'
  };

  if (options.location) diag.location = options.location;
  if (options.remediation) diag.remediation = options.remediation;
  if (options.evidenceRef) diag.evidenceRef = options.evidenceRef;

  return diag;
}
