import type { CodemodPlan } from './ast-transform.js';

export function createUnifiedPatch(plan: CodemodPlan): string {
  if (plan.transformations.length === 0) {
    return '# Berryn Codemod Patch -- Zero transformations required.\n';
  }

  let patchText = `# Berryn Codemod Patch (Plan: ${plan.planId})\n`;
  patchText += `# Target: ${plan.targetProjectRoot}\n\n`;

  for (const t of plan.transformations) {
    patchText += `--- a/${t.file}\n`;
    patchText += `+++ b/${t.file}\n`;
    patchText += `@@ -${t.line},1 +${t.line},1 @@\n`;
    patchText += `-${t.originalText}\n`;
    patchText += `+${t.replacementText}\n\n`;
  }

  return patchText;
}
