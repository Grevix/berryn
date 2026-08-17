import { describe, expect, it } from 'vitest';
import { DEFAULT_RESOURCE_LIMITS } from '../../packages/core/src/index.js';
import { assertPathInSandbox, assertResourceLimits, assertSafeXmlPayload, assertZipBombRatio, SecurityError } from '../../packages/security/src/index.js';

describe('@berryn/security', () => {
  it('allows paths within allowed roots sandbox', () => {
    const root = process.cwd();
    const result = assertPathInSandbox(root, [root]);
    expect(result).toBeDefined();
  });

  it('rejects path traversal outside allowed sandbox roots', () => {
    expect(() => assertPathInSandbox('../../../windows/system32', [process.cwd()])).toThrow(SecurityError);
  });

  it('detects XXE DTD payloads in XML strings', () => {
    const maliciousXml = '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>';
    expect(() => assertSafeXmlPayload(maliciousXml)).toThrow(SecurityError);
  });

  it('detects high-ratio ZIP bomb compression ratios', () => {
    expect(() => assertZipBombRatio(100, 50 * 1024 * 1024, 100)).toThrow(SecurityError);
  });

  it('rejects breaches of resource byte limits', () => {
    expect(() =>
      assertResourceLimits(
        { inputBytes: 10 * 1024 * 1024 * 1024 },
        DEFAULT_RESOURCE_LIMITS
      )
    ).toThrow(SecurityError);
  });
});
