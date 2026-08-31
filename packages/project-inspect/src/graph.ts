import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import type { Diagnostic } from '@berryn/core';
import { scanSourceFileAst, type ApiCallOccurrence, type ImportOccurrence } from './ast-parser.js';
import { inspectPackageManifest, type PackageManifestInfo } from './manifest.js';

export interface ProjectInspectionResult {
  manifest: PackageManifestInfo;
  imports: ImportOccurrence[];
  apiCalls: ApiCallOccurrence[];
  totalSourceFilesScanned: number;
}

export function findSourceFiles(dirPath: string): string[] {
  const results: string[] = [];
  const ignoredDirs = new Set(['node_modules', 'dist', '.git', '.berryn', '.next', 'coverage', 'build']);
  const validExts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

  function walk(currentDir: string) {
    let entries: string[] = [];
    try {
      entries = readdirSync(currentDir);
    } catch {
      return;
    }

    for (const entry of entries) {
      if (ignoredDirs.has(entry)) continue;
      const fullPath = join(currentDir, entry);
      try {
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (stat.isFile()) {
          const ext = extname(entry);
          if (validExts.has(ext)) {
            results.push(fullPath);
          }
        }
      } catch {
        // Skip unreadable files
      }
    }
  }

  walk(dirPath);
  return results;
}

export function inspectProject(
  projectRoot: string,
  sourceFiles: string[] = []
): { value: ProjectInspectionResult; diagnostics: Diagnostic[] } {
  const allDiagnostics: Diagnostic[] = [];
  const { manifest, diagnostics: manifestDiags } = inspectPackageManifest(projectRoot);
  allDiagnostics.push(...manifestDiags);

  const filesToScan = sourceFiles.length > 0 ? sourceFiles : findSourceFiles(projectRoot);

  const allImports: ImportOccurrence[] = [];
  const allApiCalls: ApiCallOccurrence[] = [];

  for (const file of filesToScan) {
    try {
      const { imports, calls, diagnostics: astDiags } = scanSourceFileAst(file);
      allImports.push(...imports);
      allApiCalls.push(...calls);
      allDiagnostics.push(...astDiags);
    } catch (err: any) {
      // Ignore unparseable non-code files safely
    }
  }

  return {
    value: {
      manifest,
      imports: allImports,
      apiCalls: allApiCalls,
      totalSourceFilesScanned: filesToScan.length
    },
    diagnostics: allDiagnostics
  };
}
