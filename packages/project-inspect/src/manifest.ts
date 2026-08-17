import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Diagnostic } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { assertPathInSandbox } from '@berryn/security';

export interface PackageManifestInfo {
  name: string;
  version: string;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun' | 'unknown';
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  incumbentsFound: {
    exceljs?: string;
    xlsx?: string;
  };
}

export function inspectPackageManifest(
  projectRoot: string,
  allowedRoots: string[] = [projectRoot]
): { manifest: PackageManifestInfo; diagnostics: Diagnostic[] } {
  const sanitizedRoot = assertPathInSandbox(projectRoot, allowedRoots);
  const manifestPath = join(sanitizedRoot, 'package.json');
  const diagnostics: Diagnostic[] = [];

  if (!existsSync(manifestPath)) {
    diagnostics.push(
      createDiagnostic({
        code: DIAGNOSTIC_CODES.PROJ_MANIFEST_NOT_FOUND,
        severity: 'warning',
        message: `No package.json manifest found at root '${sanitizedRoot}'`,
        remediation: 'Verify project directory path contains a valid package.json file.'
      })
    );

    return {
      manifest: {
        name: 'unknown',
        version: '0.0.0',
        packageManager: 'unknown',
        dependencies: {},
        devDependencies: {},
        incumbentsFound: {}
      },
      diagnostics
    };
  }

  const rawContent = readFileSync(manifestPath, 'utf-8');
  let parsed: any = {};
  try {
    parsed = JSON.parse(rawContent);
  } catch (err: any) {
    diagnostics.push(
      createDiagnostic({
        code: DIAGNOSTIC_CODES.PROJ_MANIFEST_NOT_FOUND,
        severity: 'error',
        message: `Failed to parse JSON in package.json at '${manifestPath}': ${err.message}`,
        remediation: 'Ensure package.json is valid JSON format.'
      })
    );
  }

  const deps = parsed.dependencies || {};
  const devDeps = parsed.devDependencies || {};

  const incumbentsFound: PackageManifestInfo['incumbentsFound'] = {};

  if (deps.exceljs || devDeps.exceljs) {
    incumbentsFound.exceljs = deps.exceljs || devDeps.exceljs;
    diagnostics.push(
      createDiagnostic({
        code: DIAGNOSTIC_CODES.PROJ_INCUMBENT_DETECTED,
        severity: 'info',
        message: `Detected incumbent package 'exceljs' version '${incumbentsFound.exceljs}'`,
        confidence: 'high'
      })
    );
  }

  if (deps.xlsx || devDeps.xlsx) {
    incumbentsFound.xlsx = deps.xlsx || devDeps.xlsx;
    diagnostics.push(
      createDiagnostic({
        code: DIAGNOSTIC_CODES.PROJ_INCUMBENT_DETECTED,
        severity: 'info',
        message: `Detected incumbent package 'xlsx' version '${incumbentsFound.xlsx}'`,
        confidence: 'high'
      })
    );
  }

  // Detect package manager from lockfiles
  let pm: PackageManifestInfo['packageManager'] = 'unknown';
  if (existsSync(join(sanitizedRoot, 'pnpm-lock.yaml'))) pm = 'pnpm';
  else if (existsSync(join(sanitizedRoot, 'yarn.lock'))) pm = 'yarn';
  else if (existsSync(join(sanitizedRoot, 'package-lock.json'))) pm = 'npm';
  else if (existsSync(join(sanitizedRoot, 'bun.lockb'))) pm = 'bun';

  return {
    manifest: {
      name: parsed.name || 'unnamed',
      version: parsed.version || '0.0.0',
      packageManager: pm,
      dependencies: deps,
      devDependencies: devDeps,
      incumbentsFound
    },
    diagnostics
  };
}
