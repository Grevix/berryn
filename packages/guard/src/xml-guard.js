import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { SecurityError } from './sandbox.js';
export function assertSafeXmlPayload(xmlContent, maxBytes = 50 * 1024 * 1024, maxDepth = 100) {
    if (xmlContent.length > maxBytes) {
        const diag = createDiagnostic({
            code: DIAGNOSTIC_CODES.SEC_RESOURCE_EXCEEDED,
            severity: 'critical',
            message: `XML payload size (${xmlContent.length} bytes) exceeds maximum limit (${maxBytes} bytes).`,
            remediation: 'Reduce XML artifact size or configure custom resource limit.'
        });
        throw new SecurityError(diag.message, diag);
    }
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
    // Check for deeply nested XML structures
    let currentDepth = 0;
    let maxObservedDepth = 0;
    const tagRegex = /<\/?([a-zA-Z0-9_\-\:]+)[^>]*>/g;
    let match;
    while ((match = tagRegex.exec(xmlContent)) !== null) {
        const fullTag = match[0];
        if (fullTag.endsWith('/>') || fullTag.startsWith('<?') || fullTag.startsWith('<!')) {
            continue;
        }
        if (fullTag.startsWith('</')) {
            currentDepth = Math.max(0, currentDepth - 1);
        }
        else {
            currentDepth++;
            if (currentDepth > maxObservedDepth) {
                maxObservedDepth = currentDepth;
            }
            if (currentDepth > maxDepth) {
                const diag = createDiagnostic({
                    code: DIAGNOSTIC_CODES.SEC_RESOURCE_EXCEEDED,
                    severity: 'critical',
                    message: `XML nesting depth (${currentDepth}) exceeds safety limit (${maxDepth}).`,
                    remediation: 'Flatten deeply nested XML payload to prevent stack overflow.'
                });
                throw new SecurityError(diag.message, diag);
            }
        }
    }
}
//# sourceMappingURL=xml-guard.js.map