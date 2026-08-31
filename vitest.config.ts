import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@berryn/core': resolve(__dirname, './packages/core/src/index.ts'),
      '@berryn/diagnostics': resolve(__dirname, './packages/diagnostics/src/index.ts'),
      '@berryn/guard': resolve(__dirname, './packages/guard/src/index.ts'),
      '@berryn/project-inspect': resolve(__dirname, './packages/project-inspect/src/index.ts'),
      '@berryn/xlsx-inspect': resolve(__dirname, './packages/xlsx-inspect/src/index.ts'),
      '@berryn/xlsx-diff': resolve(__dirname, './packages/xlsx-diff/src/index.ts'),
      '@berryn/xlsx-validate': resolve(__dirname, './packages/xlsx-validate/src/index.ts'),
      '@berryn/codemod': resolve(__dirname, './packages/codemod/src/index.ts'),
      '@berryn/exceljs-compat': resolve(__dirname, './packages/exceljs-compat/src/index.ts'),
      '@berryn/migration-report': resolve(__dirname, './packages/migration-report/src/index.ts'),
      '@berryn/preservation': resolve(__dirname, './packages/preservation/src/index.ts'),
      '@berryn/adapter-framework': resolve(__dirname, './packages/adapter-framework/src/index.ts'),
      '@berryn/ffmpeg-probe': resolve(__dirname, './packages/ffmpeg-probe/src/index.ts'),
      '@berryn/release-candidate': resolve(__dirname, './packages/release-candidate/src/index.ts')
    }
  }
});
