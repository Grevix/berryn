import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { SecurityError } from './sandbox.js';
export function assertResourceLimits(usage, limits) {
    if (usage.inputBytes !== undefined && usage.inputBytes > limits.maxInputBytes) {
        const diag = createDiagnostic({
            code: DIAGNOSTIC_CODES.SEC_RESOURCE_EXCEEDED,
            severity: 'critical',
            message: `Input size limit breached: ${usage.inputBytes} bytes > max allowed ${limits.maxInputBytes} bytes`,
            remediation: 'Reduce input artifact size or update maxInputBytes in policy configuration.'
        });
        throw new SecurityError(diag.message, diag);
    }
    if (usage.entryCount !== undefined && usage.entryCount > limits.maxEntryCount) {
        const diag = createDiagnostic({
            code: DIAGNOSTIC_CODES.SEC_RESOURCE_EXCEEDED,
            severity: 'critical',
            message: `Archive entry count breached: ${usage.entryCount} > max allowed ${limits.maxEntryCount}`,
            remediation: 'Reject oversized ZIP archive container.'
        });
        throw new SecurityError(diag.message, diag);
    }
    if (usage.totalUncompressedBytes !== undefined &&
        usage.totalUncompressedBytes > limits.maxTotalUncompressedBytes) {
        const diag = createDiagnostic({
            code: DIAGNOSTIC_CODES.SEC_RESOURCE_EXCEEDED,
            severity: 'critical',
            message: `Total uncompressed archive size breached: ${usage.totalUncompressedBytes} bytes > max allowed ${limits.maxTotalUncompressedBytes} bytes`,
            remediation: 'Potential decompression bomb detected. Aborting parsing.'
        });
        throw new SecurityError(diag.message, diag);
    }
    if (usage.xmlDepth !== undefined && usage.xmlDepth > limits.maxXmlDepth) {
        const diag = createDiagnostic({
            code: DIAGNOSTIC_CODES.SEC_RESOURCE_EXCEEDED,
            severity: 'critical',
            message: `XML recursion depth breached: ${usage.xmlDepth} > max allowed ${limits.maxXmlDepth}`,
            remediation: 'Reject deeply nested XML document.'
        });
        throw new SecurityError(diag.message, diag);
    }
}
//# sourceMappingURL=limits.js.map