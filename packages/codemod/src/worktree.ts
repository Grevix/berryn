import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export interface WorktreeSession {
  worktreePath: string;
  branchName: string;
  cleanup: () => void;
}

export function createDisposableWorktree(repoRoot: string): WorktreeSession {
  const branchName = `berryn-migration-${Date.now()}`;
  const worktreePath = join(repoRoot, '.berryn', 'worktrees', branchName);

  if (!existsSync(join(repoRoot, '.berryn', 'worktrees'))) {
    mkdirSync(join(repoRoot, '.berryn', 'worktrees'), { recursive: true });
  }

  try {
    execFileSync('git', ['worktree', 'add', '-b', branchName, worktreePath], {
      cwd: repoRoot,
      stdio: 'pipe'
    });
  } catch (err: any) {
    throw new Error(`Failed to create Git worktree at '${worktreePath}': ${err.message}`);
  }

  const cleanup = () => {
    try {
      execFileSync('git', ['worktree', 'remove', '--force', worktreePath], {
        cwd: repoRoot,
        stdio: 'pipe'
      });
      execFileSync('git', ['branch', '-D', branchName], {
        cwd: repoRoot,
        stdio: 'pipe'
      });
    } catch (e) {
      // Ignore cleanup errors
    }
  };

  return {
    worktreePath,
    branchName,
    cleanup
  };
}
