import { readFileSync } from 'node:fs';
import type { Diagnostic } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import ts from 'typescript';

export interface ImportOccurrence {
  filePath: string;
  line: number;
  packageName: string;
  importedSymbols: string[];
  isCjsRequire: boolean;
}

export interface ApiCallOccurrence {
  filePath: string;
  line: number;
  expressionText: string;
  methodName: string;
}

export function scanSourceFileAst(
  filePath: string,
  content?: string
): { imports: ImportOccurrence[]; calls: ApiCallOccurrence[]; diagnostics: Diagnostic[] } {
  const code = content ?? readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const imports: ImportOccurrence[] = [];
  const calls: ApiCallOccurrence[] = [];
  const diagnostics: Diagnostic[] = [];

  function visit(node: ts.Node) {
    // Check ESM import declaration
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier;
      if (ts.isStringLiteral(moduleSpecifier)) {
        const pkgName = moduleSpecifier.text;
        if (pkgName === 'exceljs' || pkgName === 'xlsx') {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
          const symbols: string[] = [];

          if (node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)) {
            for (const el of node.importClause.namedBindings.elements) {
              symbols.push(el.name.text);
            }
          } else if (node.importClause?.name) {
            symbols.push(node.importClause.name.text);
          }

          imports.push({
            filePath,
            line,
            packageName: pkgName,
            importedSymbols: symbols,
            isCjsRequire: false
          });
        }
      }
    }

    // Check CJS require call
    if (ts.isCallExpression(node)) {
      if (
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'require' &&
        node.arguments.length > 0
      ) {
        const firstArg = node.arguments[0];
        if (firstArg && ts.isStringLiteral(firstArg)) {
          const pkgName = firstArg.text;
          if (pkgName === 'exceljs' || pkgName === 'xlsx') {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
            imports.push({
              filePath,
              line,
              packageName: pkgName,
              importedSymbols: [],
              isCjsRequire: true
            });
          }
        }
      }

      // Check method call expressions like workbook.xlsx.readFile
      if (ts.isPropertyAccessExpression(node.expression)) {
        const methodName = node.expression.name.text;
        const exprText = node.expression.getText(sourceFile);
        if (
          exprText.includes('xlsx') ||
          exprText.includes('workbook') ||
          exprText.includes('worksheet')
        ) {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
          calls.push({
            filePath,
            line,
            expressionText: exprText,
            methodName
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return { imports, calls, diagnostics };
}
