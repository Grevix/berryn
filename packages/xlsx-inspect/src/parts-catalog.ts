import type { Diagnostic, ResourceLimits } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { classifyOpcPart, type PartClassification } from './classifier.js';
import { parseContentTypesXml, parseRelsXml, type OpcRelationship } from './opc-parser.js';
import { readZipContainer, type ZipEntryMeta } from './zip-reader.js';

export interface XlsxInspectionReport {
  containerMeta: {
    totalCompressedBytes: number;
    totalUncompressedBytes: number;
    totalEntries: number;
  };
  parts: PartClassification[];
  relationships: OpcRelationship[];
  unsupportedPartCount: number;
}

export function inspectXlsx(
  buffer: Uint8Array,
  limits?: ResourceLimits
): { value: XlsxInspectionReport; diagnostics: Diagnostic[] } {
  const allDiagnostics: Diagnostic[] = [];

  const { container, diagnostics: zipDiags } = readZipContainer(buffer, limits);
  allDiagnostics.push(...zipDiags);

  // Read [Content_Types].xml
  const contentTypesData = container.entries.get('[Content_Types].xml');
  let defaultsMap = new Map<string, string>();
  let overridesMap = new Map<string, string>();

  if (contentTypesData) {
    const xmlText = new TextDecoder('utf-8').decode(contentTypesData);
    const { contentTypes, diagnostics: ctDiags } = parseContentTypesXml(xmlText);
    defaultsMap = contentTypes.defaults;
    overridesMap = contentTypes.overrides;
    allDiagnostics.push(...ctDiags);
  }

  // Parse root relationships
  const rootRelsData = container.entries.get('_rels/.rels');
  const allRels: OpcRelationship[] = [];

  if (rootRelsData) {
    const xmlText = new TextDecoder('utf-8').decode(rootRelsData);
    const { relationships, diagnostics: relsDiags } = parseRelsXml(xmlText);
    allRels.push(...relationships);
    allDiagnostics.push(...relsDiags);
  }

  const parts: PartClassification[] = [];
  let unsupportedCount = 0;

  for (const meta of container.meta) {
    const normalizedPath = meta.path.startsWith('/') ? meta.path : `/${meta.path}`;
    const contentType = overridesMap.get(normalizedPath) || 'application/xml';
    const classification = classifyOpcPart(meta.path, contentType);

    if (classification.classification === 'unsupported' || classification.classification === 'rejected') {
      unsupportedCount++;
      allDiagnostics.push(
        createDiagnostic({
          code: DIAGNOSTIC_CODES.XLSX_UNSUPPORTED_PART,
          severity: 'warning',
          message: `Part '${meta.path}' is classified as unsupported: ${classification.reason}`,
          location: { partPath: meta.path }
        })
      );
    }

    parts.push(classification);
  }

  return {
    value: {
      containerMeta: {
        totalCompressedBytes: container.totalCompressedBytes,
        totalUncompressedBytes: container.totalUncompressedBytes,
        totalEntries: container.meta.length
      },
      parts,
      relationships: allRels,
      unsupportedPartCount: unsupportedCount
    },
    diagnostics: allDiagnostics
  };
}
