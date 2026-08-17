import type { Diagnostic } from '@berryn/core';
import { scanSourceFileAst, type ApiCallOccurrence, type ImportOccurrence } from './ast-parser.js';
import { inspectPackageManifest, type PackageManifestInfo } from './manifest.js';

export interface ProjectInspectionResult {
  manifest: PackageManifestInfo;
  imports: ImportOccurrence[];
  apiCalls: ApiCallOccurrence[];
  totalSourceFilesScanned: number;
}

export function inspectProject(
  projectRoot: string,
  sourceFiles: string[] = []
): { value: ProjectInspectionResult; diagnostics: Diagnostic[] } {
  const allDiagnostics: Diagnostic[] = [];
  const { manifest, diagnostics: manifestDiags } = inspectPackageManifest(projectRoot);
  allDiagnostics.push(...manifestDiags);

  const allImports: ImportOccurrence[] = [];
  const allApiCalls: ApiCallOccurrence[] = [];

  for (const file of sourceFiles) {
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
      totalSourceFilesScanned: sourceFiles.length
    },
    diagnostics: allDiagnostics
  };
}
