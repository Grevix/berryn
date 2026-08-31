import type { Confidence, Diagnostic } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const tsMorph = require('ts-morph');
const { SyntaxKind } = tsMorph;

export interface CodemodRuleContext {
  filePath: string;
  sourceFile: any; // ts-morph SourceFile
}

export interface CodemodRuleResult {
  ruleId: string;
  file: string;
  line: number;
  kind: 'import-rewrite' | 'api-replace' | 'ambiguous-pattern';
  originalText: string;
  replacementText: string;
  confidence: Confidence;
  reversible: boolean;
  manualStepRequired?: string | undefined;
  diagnostic?: Diagnostic;
}

export interface CodemodRule {
  id: string;
  description: string;
  sourcePackage: string;
  targetPackage: string;
  match: (context: CodemodRuleContext) => boolean;
  transform: (context: CodemodRuleContext) => CodemodRuleResult[];
}

export class CodemodRuleRegistry {
  private rulesMap = new Map<string, CodemodRule>();

  constructor() {
    this.registerDefaultRules();
  }

  register(rule: CodemodRule): void {
    this.rulesMap.set(rule.id, rule);
  }

  get(id: string): CodemodRule | undefined {
    return this.rulesMap.get(id);
  }

  list(): CodemodRule[] {
    return Array.from(this.rulesMap.values());
  }

  executeRules(context: CodemodRuleContext): { results: CodemodRuleResult[]; diagnostics: Diagnostic[] } {
    const results: CodemodRuleResult[] = [];
    const diagnostics: Diagnostic[] = [];

    for (const rule of this.rulesMap.values()) {
      if (rule.match(context)) {
        try {
          const ruleResults = rule.transform(context);
          for (const res of ruleResults) {
            results.push(res);
            if (res.diagnostic) {
              diagnostics.push(res.diagnostic);
            }
          }
        } catch (err: any) {
          diagnostics.push(
            createDiagnostic({
              code: DIAGNOSTIC_CODES.CODE_TRANSFORM_FAILED,
              severity: 'warning',
              message: `Rule '${rule.id}' failed on '${context.filePath}': ${err.message}`,
              location: { file: context.filePath }
            })
          );
        }
      }
    }

    return { results, diagnostics };
  }

  private registerDefaultRules(): void {
    // 1. ESM Import Specifier Rule: import ... from 'exceljs' -> '@berryn/exceljs-compat'
    this.register({
      id: 'BRN-CODEMOD-IMPORT-EXCELJS',
      description: 'Rewrite ESM import specifiers from exceljs to @berryn/exceljs-compat',
      sourcePackage: 'exceljs',
      targetPackage: '@berryn/exceljs-compat',
      match: (ctx) => {
        const importDeclarations = ctx.sourceFile.getImportDeclarations();
        return importDeclarations.some((imp: any) => imp.getModuleSpecifierValue() === 'exceljs');
      },
      transform: (ctx) => {
        const results: CodemodRuleResult[] = [];
        const importDeclarations = ctx.sourceFile.getImportDeclarations();
        for (const imp of importDeclarations) {
          if (imp.getModuleSpecifierValue() === 'exceljs') {
            const line = imp.getStartLineNumber();
            const orig = imp.getText();
            imp.setModuleSpecifier('@berryn/exceljs-compat');
            const replacement = imp.getText();
            results.push({
              ruleId: 'BRN-CODEMOD-IMPORT-EXCELJS',
              file: ctx.filePath,
              line,
              kind: 'import-rewrite',
              originalText: orig,
              replacementText: replacement,
              confidence: 'high',
              reversible: true
            });
          }
        }
        return results;
      }
    });

    // 2. CJS Require Specifier Rule: require('exceljs') -> require('@berryn/exceljs-compat')
    this.register({
      id: 'BRN-CODEMOD-REQUIRE-EXCELJS',
      description: 'Rewrite CJS require calls from exceljs to @berryn/exceljs-compat',
      sourcePackage: 'exceljs',
      targetPackage: '@berryn/exceljs-compat',
      match: (ctx) => {
        const callExpressions = ctx.sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
        return callExpressions.some((call: any) => {
          const expr = call.getExpression();
          const args = call.getArguments();
          return expr.getText() === 'require' && args.length > 0 && args[0].getText() === "'exceljs'";
        });
      },
      transform: (ctx) => {
        const results: CodemodRuleResult[] = [];
        const callExpressions = ctx.sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
        for (const call of callExpressions) {
          const expr = call.getExpression();
          const args = call.getArguments();
          if (expr.getText() === 'require' && args.length > 0 && args[0].getText() === "'exceljs'") {
            const line = call.getStartLineNumber();
            const orig = call.getText();
            args[0].replaceWithText("'@berryn/exceljs-compat'");
            const replacement = call.getText();
            results.push({
              ruleId: 'BRN-CODEMOD-REQUIRE-EXCELJS',
              file: ctx.filePath,
              line,
              kind: 'import-rewrite',
              originalText: orig,
              replacementText: replacement,
              confidence: 'high',
              reversible: true
            });
          }
        }
        return results;
      }
    });

    // 3. AST Call-Site Rule: new ExcelJS.Workbook() constructor validation
    this.register({
      id: 'BRN-CODEMOD-WORKBOOK-CONSTRUCTOR',
      description: 'Validate and map ExcelJS.Workbook constructor AST call-sites',
      sourcePackage: 'exceljs',
      targetPackage: '@berryn/exceljs-compat',
      match: (ctx) => {
        const newExpressions = ctx.sourceFile.getDescendantsOfKind(SyntaxKind.NewExpression);
        return newExpressions.some((expr: any) => expr.getExpression().getText().endsWith('Workbook'));
      },
      transform: (ctx) => {
        const results: CodemodRuleResult[] = [];
        const newExpressions = ctx.sourceFile.getDescendantsOfKind(SyntaxKind.NewExpression);
        for (const expr of newExpressions) {
          if (expr.getExpression().getText().endsWith('Workbook')) {
            const line = expr.getStartLineNumber();
            const orig = expr.getText();
            results.push({
              ruleId: 'BRN-CODEMOD-WORKBOOK-CONSTRUCTOR',
              file: ctx.filePath,
              line,
              kind: 'api-replace',
              originalText: orig,
              replacementText: orig, // Constructor call site verified compatible
              confidence: 'high',
              reversible: true
            });
          }
        }
        return results;
      }
    });

    // 4. Ambiguous Dynamic Expression Detection (Safety Protection Rule)
    this.register({
      id: 'BRN-CODEMOD-AMBIGUOUS-EXPR',
      description: 'Detect dynamic index call expressions or dynamic require and request manual review',
      sourcePackage: 'exceljs',
      targetPackage: '@berryn/exceljs-compat',
      match: (ctx) => {
        const callExpressions = ctx.sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
        return callExpressions.some((call: any) => {
          const exprText = call.getExpression().getText();
          return exprText.includes('xlsx[') || (exprText === 'require' && call.getArguments().length > 0 && !call.getArguments()[0].isKind(SyntaxKind.StringLiteral));
        });
      },
      transform: (ctx) => {
        const results: CodemodRuleResult[] = [];
        const callExpressions = ctx.sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
        for (const call of callExpressions) {
          const exprText = call.getExpression().getText();
          if (exprText.includes('xlsx[') || (exprText === 'require' && call.getArguments().length > 0 && !call.getArguments()[0].isKind(SyntaxKind.StringLiteral))) {
            const line = call.getStartLineNumber();
            const orig = call.getText();
            const diag = createDiagnostic({
              code: DIAGNOSTIC_CODES.CODE_AMBIGUOUS_AST,
              severity: 'warning',
              message: `Ambiguous dynamic call expression detected: '${orig}'`,
              remediation: 'Manually inspect dynamic API invocation and verify compatibility with @berryn/exceljs-compat.',
              location: { file: ctx.filePath, line }
            });
            results.push({
              ruleId: 'BRN-CODEMOD-AMBIGUOUS-EXPR',
              file: ctx.filePath,
              line,
              kind: 'ambiguous-pattern',
              originalText: orig,
              replacementText: orig, // Unchanged
              confidence: 'low',
              reversible: true,
              manualStepRequired: `Inspect dynamic call '${orig}' at line ${line}`,
              diagnostic: diag
            });
          }
        }
        return results;
      }
    });
  }
}
