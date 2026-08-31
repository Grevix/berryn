import { isAbsolute, normalize, resolve } from 'node:path';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
export class SecurityError extends Error {
    diagnostic;
    constructor(message, diagnostic) {
        super(message);
        this.name = 'SecurityError';
        this.diagnostic = diagnostic;
    }
}
export function assertPathInSandbox(targetPath, allowedRoots) {
    if (allowedRoots.length === 0) {
        // If no explicit roots provided, resolve against cwd
        allowedRoots = [process.cwd()];
    }
    const resolvedTarget = resolve(normalize(targetPath));
    const isAllowed = allowedRoots.some((root) => {
        const resolvedRoot = resolve(normalize(root));
        return resolvedTarget === resolvedRoot || resolvedTarget.startsWith(resolvedRoot + (resolvedRoot.endsWith('/') || resolvedRoot.endsWith('\\') ? '' : '/')) || resolvedTarget.startsWith(resolvedRoot + '\\');
    });
    if (!isAllowed) {
        const diagnostic = createDiagnostic({
            code: DIAGNOSTIC_CODES.SEC_PATH_TRAVERSAL,
            severity: 'critical',
            message: `Path traversal violation: Target path '${targetPath}' resolves outside allowed sandbox roots [${allowedRoots.join(', ')}]`,
            confidence: 'high',
            remediation: 'Ensure the requested path is inside the project workspace root directory.'
        });
        throw new SecurityError(diagnostic.message, diagnostic);
    }
    return resolvedTarget;
}
//# sourceMappingURL=sandbox.js.map