import type { SupportClassification } from '@berryn/core';

export interface PartClassification {
  partPath: string;
  contentType: string;
  classification: SupportClassification;
  reason: string;
}

export function classifyOpcPart(partPath: string, contentType: string): PartClassification {
  const pathLower = partPath.toLowerCase();

  // Core Supported Parts
  if (pathLower.includes('xl/worksheets/sheet')) {
    return {
      partPath,
      contentType,
      classification: 'supported',
      reason: 'Core worksheet data XML part'
    };
  }

  if (pathLower.includes('xl/sharedstrings.xml')) {
    return {
      partPath,
      contentType,
      classification: 'supported',
      reason: 'Shared strings table'
    };
  }

  if (pathLower.includes('xl/workbook.xml')) {
    return {
      partPath,
      contentType,
      classification: 'supported',
      reason: 'Workbook structure definition'
    };
  }

  // Partially Supported Parts
  if (pathLower.includes('xl/styles.xml')) {
    return {
      partPath,
      contentType,
      classification: 'partially-supported',
      reason: 'Cell styles and formatting definitions (Common font/fill styles supported)'
    };
  }

  if (pathLower.includes('xl/tables/table')) {
    return {
      partPath,
      contentType,
      classification: 'partially-supported',
      reason: 'Export formatted table structure'
    };
  }

  // Preserved Not Modeled
  if (pathLower.includes('customxml/')) {
    return {
      partPath,
      contentType,
      classification: 'preserved-not-modeled',
      reason: 'Custom XML data part; preserved opaquely during mutation'
    };
  }

  if (pathLower.includes('xl/theme/theme')) {
    return {
      partPath,
      contentType,
      classification: 'preserved-not-modeled',
      reason: 'Office document color/font theme; preserved opaquely'
    };
  }

  // Unsupported / High Risk
  if (pathLower.includes('xl/vbaproject.bin') || pathLower.includes('vba')) {
    return {
      partPath,
      contentType,
      classification: 'unsupported',
      reason: 'VBA Macro binary file; modification unsupported'
    };
  }

  if (pathLower.includes('xl/pivot')) {
    return {
      partPath,
      contentType,
      classification: 'unsupported',
      reason: 'Pivot table cache/definition part'
    };
  }

  return {
    partPath,
    contentType,
    classification: 'preserved-not-modeled',
    reason: 'Unrecognized OOXML part; defaults to opaque preservation'
  };
}
