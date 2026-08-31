import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  validateRelationshipIntegrity,
  validateSemanticContents,
  validateStructuralIntegrity
} from '../../packages/xlsx-validate/src/index.js';

describe('@berryn/xlsx-validate', () => {
  const simplePath = join(process.cwd(), 'tests', 'fixtures', 'xlsx', 'simple.xlsx');
  const formulasPath = join(process.cwd(), 'tests', 'fixtures', 'xlsx', 'formulas.xlsx');

  it('validates structural integrity of binary workbook', () => {
    const buffer = readFileSync(simplePath);
    const result = validateStructuralIntegrity(buffer);
    expect(result.passed).toBe(true);
    expect(result.stageName).toContain('Structural');
  });

  it('validates relationship integrity of OPC package', () => {
    const buffer = readFileSync(simplePath);
    const result = validateRelationshipIntegrity(buffer);
    expect(result.passed).toBe(true);
    expect(result.stageName).toContain('Relationship');
  });

  it('validates semantic XML contents of workbook with formulas', () => {
    const buffer = readFileSync(formulasPath);
    const result = validateSemanticContents(buffer);
    expect(result.passed).toBe(true);
    expect(result.stageName).toContain('Semantic');
  });
});
