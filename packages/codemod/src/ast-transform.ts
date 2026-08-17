import type { Confidence, Diagnostic } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const tsMorph = require('ts-morph');
const { Project } = tsMorph;

export interface TransformationStep {
  file: string;
  line: number;
  kind: 'import-rewrite' | 'api-replace';
  originalText: string;
  replacementText: string;
  reversible: boolean;
}

export interface CodemodPlan {
  planId: string;
  targetProjectRoot: string;
  transformations: TransformationStep[];
  confidence: Confidence;
}

export function generateExcelJsCodemodPlan(
  projectRoot: string,
  sourceFilePaths: string[]
): { plan: CodemodPlan; diagnostics: Diagnostic[] } {
  const diagnostics: Diagnostic[] = [];
  const transformations: TransformationStep[] = [];

  const project = new Project({
    compilerOptions: { allowJs: true }
  });

  for (const filePath of sourceFilePaths) {
    try {
      const sourceFile = project.addSourceFileAtPath(filePath);
      const importDeclarations = sourceFile.getImportDeclarations();

      for (const imp of importDeclarations) {
        if (imp.getModuleSpecifierValue() === 'exceljs') {
          const line = imp.getStartLineNumber();
          const orig = imp.getText();
          // Update import to @berryn/exceljs-compat
          imp.setModuleSpecifier('@berryn/exceljs-compat');
          const replacement = imp.getText();

          transformations.push({
            file: filePath,
            line,
            kind: 'import-rewrite',
            originalText: orig,
            replacementText: replacement,
            reversible: true
          });
        }
      }
    } catch (err: any) {
      diagnostics.push(
        createDiagnostic({
          code: DIAGNOSTIC_CODES.CODE_TRANSFORM_FAILED,
          severity: 'warning',
          message: `Could not parse AST for file '${filePath}': ${err.message}`,
          location: { file: filePath }
        })
      );
    }
  }

  return {
    plan: {
      planId: `plan_${Date.now()}`,
      targetProjectRoot: projectRoot,
      transformations,
      confidence: transformations.length > 0 ? 'high' : 'medium'
    },
    diagnostics
  };
}
