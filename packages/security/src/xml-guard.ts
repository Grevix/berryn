import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { SecurityError } from './sandbox.js';

export function assertSafeXmlPayload(xmlContent: string): void {
  // Check for DTD / ENTITY declarations
  if (/<!DOCTYPE/i.test(xmlContent) || /<!ENTITY/i.test(xmlContent)) {
    const diag = createDiagnostic({
      code: DIAGNOSTIC_CODES.SEC_XXE_PAYLOAD,
      severity: 'critical',
      message: 'XXE Payload Detected: XML document contains DTD or DOCTYPE entity declarations which are prohibited.',
      remediation: 'Remove DTD declarations or external entity references from XML before parsing.'
    });
    throw new SecurityError(diag.message, diag);
  }

  // Check for XInclude elements
  if (/<[^>]*:include\b/i.test(xmlContent) || /<include\b/i.test(xmlContent)) {
    if (/href\s*=/i.test(xmlContent)) {
      const diag = createDiagnostic({
        code: DIAGNOSTIC_CODES.SEC_XXE_PAYLOAD,
        severity: 'critical',
        message: 'XInclude Payload Detected: XML document contains external resource include directives.',
        remediation: 'Disable external XInclude directives.'
      });
      throw new SecurityError(diag.message, diag);
    }
  }
}
