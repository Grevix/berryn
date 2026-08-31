import type { Diagnostic } from '@berryn/core';
export declare class SecurityError extends Error {
    readonly diagnostic: Diagnostic;
    constructor(message: string, diagnostic: Diagnostic);
}
export declare function assertPathInSandbox(targetPath: string, allowedRoots: string[]): string;
//# sourceMappingURL=sandbox.d.ts.map