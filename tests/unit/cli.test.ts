import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { handleInspectCommand } from '../../packages/cli/src/commands/inspect.js';
import { handleMigrateCommand } from '../../packages/cli/src/commands/migrate.ts';

describe('packages/cli', () => {
  const sampleProjDir = join(process.cwd(), 'tests', 'fixtures', 'sample-project');

  it('exports command handlers', () => {
    expect(typeof handleInspectCommand).toBe('function');
    expect(typeof handleMigrateCommand).toBe('function');
  });
});
