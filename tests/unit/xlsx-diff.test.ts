import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { inspectXlsx } from '../../packages/xlsx-inspect/src/index.js';
import {
  areXmlStringsEquivalent,
  diffPackageArchives,
  diffXlsxWorkbooks
} from '../../packages/xlsx-diff/src/index.js';

describe('@berryn/xlsx-diff', () => {
  const simplePath = join(process.cwd(), 'tests', 'fixtures', 'xlsx', 'simple.xlsx');
  const styledPath = join(process.cwd(), 'tests', 'fixtures', 'xlsx', 'styled.xlsx');
  const opaquePath = join(process.cwd(), 'tests', 'fixtures', 'xlsx', 'with-opaque-parts.xlsx');

  it('evaluates XML string equivalence ignoring whitespace', () => {
    const xml1 = '<worksheet><sheetData><row r="1"/></sheetData></worksheet>';
    const xml2 = `
      <worksheet>
        <sheetData>
          <row r="1" />
        </sheetData>
      </worksheet>
    `;
    expect(areXmlStringsEquivalent(xml1, xml2)).toBe(true);
  });

  it('detects package differences between different binary workbooks', () => {
    const buf1 = readFileSync(simplePath);
    const buf2 = readFileSync(styledPath);

    const { value: r1 } = inspectXlsx(buf1);
    const { value: r2 } = inspectXlsx(buf2);

    const result = diffPackageArchives(r1, r2);
    expect(result.entryDiffs.length).toBeGreaterThan(0);
  });

  it('runs complete workbook diff pipeline', () => {
    const buf1 = readFileSync(simplePath);
    const buf2 = readFileSync(opaquePath);

    const { value, diagnostics } = diffXlsxWorkbooks(buf1, buf2);
    expect(value.packageDiff.hasDifferences).toBe(true);
  });
});
