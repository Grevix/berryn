import { describe, expect, it } from 'vitest';
import {
  createResultEnvelope,
  createRunContext,
  makeContentHash,
  makeRunId,
  BerrynError,
  MigrationError,
  CompatibilityError,
  ValidationError,
  SecurityError,
  ResourceLimitError,
  CorruptionRiskError,
  UnsupportedFeatureError
} from '../../packages/core/src/index.js';

describe('@berryn/core', () => {
  it('creates branded types correctly', () => {
    const runId = makeRunId('run_123');
    const hash = makeContentHash('abc123hash');
    expect(runId).toBe('run_123');
    expect(hash).toBe('abc123hash');
  });

  it('creates run context with default policy', () => {
    const context = createRunContext();
    expect(context.runMetadata.network).toBe('disabled');
    expect(context.policy.mode).toBe('strict');
    expect(context.policy.network).toBe('deny');
  });

  it('computes envelope status passed for zero diagnostics', () => {
    const context = createRunContext();
    const envelope = createResultEnvelope({ ok: true }, context.runMetadata, []);
    expect(envelope.status).toBe('passed');
    expect(envelope.schemaVersion).toBe('0.1.0');
  });

  it('instantiates canonical structured error hierarchy correctly', () => {
    const baseErr = new BerrynError('Base error');
    const migErr = new MigrationError('Migration failed');
    const compatErr = new CompatibilityError('API not supported');
    const valErr = new ValidationError('Validation failed');
    const secErr = new SecurityError('Sandbox escape blocked');
    const limitErr = new ResourceLimitError('File too large');
    const corruptErr = new CorruptionRiskError('Part dropped');
    const unsuppErr = new UnsupportedFeatureError('Macro rejected');

    expect(baseErr.name).toBe('BerrynError');
    expect(migErr.name).toBe('MigrationError');
    expect(compatErr.name).toBe('CompatibilityError');
    expect(valErr.name).toBe('ValidationError');
    expect(secErr.name).toBe('SecurityError');
    expect(limitErr.name).toBe('ResourceLimitError');
    expect(corruptErr.name).toBe('CorruptionRiskError');
    expect(unsuppErr.name).toBe('UnsupportedFeatureError');

    expect(secErr.severity).toBe('critical');
    expect(valErr.severity).toBe('error');
  });
});

