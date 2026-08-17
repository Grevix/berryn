export type RunId = string & { readonly __brand: unique symbol };
export type ContentHash = string & { readonly __brand: unique symbol };
export type DiagnosticCode = string & { readonly __brand: unique symbol };

export function makeRunId(id: string): RunId {
  return id as RunId;
}

export function makeContentHash(hash: string): ContentHash {
  return hash as ContentHash;
}

export function makeDiagnosticCode(code: string): DiagnosticCode {
  return code as DiagnosticCode;
}

export type Severity = 'info' | 'warning' | 'error' | 'critical';
export type Confidence = 'high' | 'medium' | 'low' | 'unknown';
export type EnvelopeStatus = 'passed' | 'passed-with-warnings' | 'failed' | 'rejected';

export type SupportClassification =
  | 'supported'
  | 'partially-supported'
  | 'preserved-not-modeled'
  | 'unsupported'
  | 'rejected';

export interface DiagnosticLocation {
  file?: string;
  line?: number;
  column?: number;
  partPath?: string;
}

export interface Diagnostic {
  code: DiagnosticCode;
  severity: Severity;
  message: string;
  confidence: Confidence;
  location?: DiagnosticLocation;
  remediation?: string;
  evidenceRef?: string;
}
