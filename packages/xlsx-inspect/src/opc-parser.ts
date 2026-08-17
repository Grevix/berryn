import type { Diagnostic } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { assertSafeXmlPayload } from '@berryn/security';
import { XMLParser } from 'fast-xml-parser';

export interface OpcRelationship {
  id: string;
  type: string;
  target: string;
  targetMode?: 'Internal' | 'External';
}

export interface OpcContentTypes {
  defaults: Map<string, string>;
  overrides: Map<string, string>;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

export function parseContentTypesXml(
  xmlContent: string
): { contentTypes: OpcContentTypes; diagnostics: Diagnostic[] } {
  assertSafeXmlPayload(xmlContent);
  const diagnostics: Diagnostic[] = [];
  const defaults = new Map<string, string>();
  const overrides = new Map<string, string>();

  try {
    const parsed = xmlParser.parse(xmlContent);
    const types = parsed.Types || {};

    if (types.Default) {
      const list = Array.isArray(types.Default) ? types.Default : [types.Default];
      for (const item of list) {
        if (item['@_Extension'] && item['@_ContentType']) {
          defaults.set(item['@_Extension'], item['@_ContentType']);
        }
      }
    }

    if (types.Override) {
      const list = Array.isArray(types.Override) ? types.Override : [types.Override];
      for (const item of list) {
        if (item['@_PartName'] && item['@_ContentType']) {
          overrides.set(item['@_PartName'], item['@_ContentType']);
        }
      }
    }
  } catch (err: any) {
    diagnostics.push(
      createDiagnostic({
        code: DIAGNOSTIC_CODES.XLSX_ZIP_MALFORMED,
        severity: 'error',
        message: `Failed to parse [Content_Types].xml: ${err.message}`
      })
    );
  }

  return {
    contentTypes: { defaults, overrides },
    diagnostics
  };
}

export function parseRelsXml(
  xmlContent: string
): { relationships: OpcRelationship[]; diagnostics: Diagnostic[] } {
  assertSafeXmlPayload(xmlContent);
  const diagnostics: Diagnostic[] = [];
  const relationships: OpcRelationship[] = [];

  try {
    const parsed = xmlParser.parse(xmlContent);
    const relsRoot = parsed.Relationships || {};

    if (relsRoot.Relationship) {
      const list = Array.isArray(relsRoot.Relationship) ? relsRoot.Relationship : [relsRoot.Relationship];
      for (const rel of list) {
        if (rel['@_Id'] && rel['@_Type'] && rel['@_Target']) {
          relationships.push({
            id: rel['@_Id'],
            type: rel['@_Type'],
            target: rel['@_Target'],
            targetMode: rel['@_TargetMode'] as any
          });
        }
      }
    }
  } catch (err: any) {
    diagnostics.push(
      createDiagnostic({
        code: DIAGNOSTIC_CODES.XLSX_OPC_RELATIONSHIP_BROKEN,
        severity: 'warning',
        message: `Failed to parse .rels XML: ${err.message}`
      })
    );
  }

  return { relationships, diagnostics };
}
