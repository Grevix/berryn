import { createHash } from 'node:crypto';
import type { ContentHash } from './types.js';
import { makeContentHash } from './types.js';

export function hashString(input: string): ContentHash {
  const hash = createHash('sha256').update(input, 'utf8').digest('hex');
  return makeContentHash(hash);
}

export function hashBuffer(buffer: Uint8Array): ContentHash {
  const hash = createHash('sha256').update(buffer).digest('hex');
  return makeContentHash(hash);
}
