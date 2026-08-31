import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEFAULT_RESOURCE_LIMITS } from '../../packages/security/src/index.js';
import {
  inspectXlsx,
  parseRelsXml,
  readZipContainer
} from '../../packages/xlsx-inspect/src/index.js';

describe('@berryn/xlsx-inspect', () => {
  const simpleXlsxPath = join(process.cwd(), 'tests', 'fixtures', 'xlsx', 'simple.xlsx');
  const opaqueXlsxPath = join(process.cwd(), 'tests', 'fixtures', 'xlsx', 'with-opaque-parts.xlsx');

  it('reads binary ZIP archive entries safely', () => {
    const buffer = readFileSync(simpleXlsxPath);
    const { container, diagnostics } = readZipContainer(buffer, DEFAULT_RESOURCE_LIMITS);
    expect(diagnostics.length).toBe(0);
    expect(container.entries.has('[Content_Types].xml')).toBe(true);
    expect(container.entries.has('xl/workbook.xml')).toBe(true);
  });

  it('parses OPC relationships correctly', () => {
    const buffer = readFileSync(simpleXlsxPath);
    const { container } = readZipContainer(buffer, DEFAULT_RESOURCE_LIMITS);
    const relsContent = new TextDecoder().decode(container.entries.get('_rels/.rels'));

    const { relationships } = parseRelsXml(relsContent);
    expect(relationships.length).toBeGreaterThan(0);
    expect(relationships[0].target).toBe('xl/workbook.xml');
  });

  it('classifies parts catalog tiers correctly', () => {
    const buffer = readFileSync(opaqueXlsxPath);
    const { container } = readZipContainer(buffer, DEFAULT_RESOURCE_LIMITS);

    expect(container.meta.length).toBeGreaterThan(0);
    expect(container.entries.has('customData/opaque.xml')).toBe(true);
  });

  it('runs complete inspectXlsx pipeline on binary fixture', () => {
    const buffer = readFileSync(simpleXlsxPath);
    const { value, diagnostics } = inspectXlsx(buffer, DEFAULT_RESOURCE_LIMITS);
    expect(value.containerMeta.totalEntries).toBeGreaterThan(0);
    expect(value.unsupportedPartCount).toBe(0);
  });
});
