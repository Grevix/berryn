import { XMLParser } from 'fast-xml-parser';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: true
});

export function normalizeXmlString(xmlContent: string): string {
  try {
    const parsed = xmlParser.parse(xmlContent);
    return JSON.stringify(parsed, Object.keys(parsed).sort());
  } catch (err) {
    // If parsing fails, collapse whitespace
    return xmlContent.replace(/>\s+</g, '><').trim();
  }
}

export function areXmlStringsEquivalent(xml1: string, xml2: string): boolean {
  if (xml1 === xml2) return true;
  return normalizeXmlString(xml1) === normalizeXmlString(xml2);
}
