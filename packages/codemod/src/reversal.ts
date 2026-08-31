import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Diagnostic } from '@berryn/core';
import { hashString } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';

export interface FileReversalItem {
  filePath: string;
  originalHash: string;
  originalContent: string;
  modifiedHash: string;
  modifiedContent: string;
  patch: string;
}

export interface ReversalRecord {
  runId: string;
  timestamp: string;
  projectRoot: string;
  toolVersion: string;
  fileReversals: FileReversalItem[];
}

export function getReversalsDirectory(projectRoot: string): string {
  const dir = join(projectRoot, '.berryn', 'reversals');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function saveReversalRecord(projectRoot: string, record: ReversalRecord): string {
  const dir = getReversalsDirectory(projectRoot);
  const filePath = join(dir, `reversal_${record.runId}.json`);
  writeFileSync(filePath, JSON.stringify(record, null, 2), 'utf-8');
  return filePath;
}

export function getLatestReversalRecord(projectRoot: string): ReversalRecord | undefined {
  const dir = join(projectRoot, '.berryn', 'reversals');
  if (!existsSync(dir)) return undefined;

  const files = readdirSync(dir).filter(f => f.startsWith('reversal_') && f.endsWith('.json')).sort().reverse();
  const firstFile = files[0];
  if (!firstFile) return undefined;

  const latestFile = join(dir, firstFile);
  try {
    const raw = readFileSync(latestFile, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function undoMigration(
  projectRoot: string,
  runId?: string
): { success: boolean; restoredFiles: string[]; diagnostics: Diagnostic[] } {
  const diagnostics: Diagnostic[] = [];
  const restoredFiles: string[] = [];

  let record: ReversalRecord | undefined;
  if (runId) {
    const filePath = join(getReversalsDirectory(projectRoot), `reversal_${runId}.json`);
    if (existsSync(filePath)) {
      record = JSON.parse(readFileSync(filePath, 'utf-8'));
    }
  } else {
    record = getLatestReversalRecord(projectRoot);
  }

  if (!record) {
    diagnostics.push(
      createDiagnostic({
        code: DIAGNOSTIC_CODES.CODE_TRANSFORM_FAILED,
        severity: 'error',
        message: 'UNDO BLOCKED: No reversal record found in .berryn/reversals/',
        remediation: 'Run a migration with --apply before attempting to undo.'
      })
    );
    return { success: false, restoredFiles: [], diagnostics };
  }

  for (const item of record.fileReversals) {
    if (!existsSync(item.filePath)) {
      diagnostics.push(
        createDiagnostic({
          code: DIAGNOSTIC_CODES.CODE_TRANSFORM_FAILED,
          severity: 'error',
          message: `UNDO BLOCKED: Target file '${item.filePath}' does not exist on disk`,
          location: { file: item.filePath }
        })
      );
      return { success: false, restoredFiles: [], diagnostics };
    }

    const currentContent = readFileSync(item.filePath, 'utf-8');
    const currentHash = hashString(currentContent);

    if (currentHash !== item.modifiedHash) {
      diagnostics.push(
        createDiagnostic({
          code: DIAGNOSTIC_CODES.CODE_TRANSFORM_FAILED,
          severity: 'error',
          message: `UNDO BLOCKED: File '${item.filePath}' content has diverged since migration. Current hash (${currentHash.substring(0, 8)}) does not match post-migration hash (${item.modifiedHash.substring(0, 8)}).`,
          remediation: 'Revert uncommitted manual modifications before applying migration undo.',
          location: { file: item.filePath }
        })
      );
      return { success: false, restoredFiles: [], diagnostics };
    }
  }

  // All files verified match post-migration state — perform clean restoration
  for (const item of record.fileReversals) {
    writeFileSync(item.filePath, item.originalContent, 'utf-8');
    restoredFiles.push(item.filePath);
  }

  return { success: true, restoredFiles, diagnostics };
}
