import type { DiagnosticCode } from './types.js';

export class BerrynError extends Error {
  readonly code: DiagnosticCode | string;
  readonly severity: 'error' | 'critical';

  constructor(message: string, code: DiagnosticCode | string = 'BRN-ERR-000', severity: 'error' | 'critical' = 'error') {
    super(message);
    this.name = 'BerrynError';
    this.code = code;
    this.severity = severity;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MigrationError extends BerrynError {
  constructor(message: string, code: DiagnosticCode | string = 'BRN-MIG-ERR') {
    super(message, code, 'error');
    this.name = 'MigrationError';
  }
}

export class CompatibilityError extends BerrynError {
  constructor(message: string, code: DiagnosticCode | string = 'BRN-COMPAT-ERR') {
    super(message, code, 'error');
    this.name = 'CompatibilityError';
  }
}

export class ValidationError extends BerrynError {
  constructor(message: string, code: DiagnosticCode | string = 'BRN-VAL-ERR') {
    super(message, code, 'error');
    this.name = 'ValidationError';
  }
}

export class SecurityError extends BerrynError {
  constructor(message: string, code: DiagnosticCode | string = 'BRN-SEC-ERR') {
    super(message, code, 'critical');
    this.name = 'SecurityError';
  }
}

export class UnsupportedFeatureError extends BerrynError {
  constructor(message: string, code: DiagnosticCode | string = 'BRN-UNSUPPORTED-ERR') {
    super(message, code, 'error');
    this.name = 'UnsupportedFeatureError';
  }
}

export class CorruptionRiskError extends BerrynError {
  constructor(message: string, code: DiagnosticCode | string = 'BRN-CORRUPT-ERR') {
    super(message, code, 'critical');
    this.name = 'CorruptionRiskError';
  }
}

export class ResourceLimitError extends BerrynError {
  constructor(message: string, code: DiagnosticCode | string = 'BRN-LIMIT-ERR') {
    super(message, code, 'critical');
    this.name = 'ResourceLimitError';
  }
}
