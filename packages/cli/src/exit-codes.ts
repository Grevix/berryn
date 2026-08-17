export const EXIT_CODES = {
  SUCCESS: 0,
  ERR_CONFIG: 2,
  ERR_UNSUPPORTED: 3,
  ERR_VALIDATION: 4,
  ERR_SECURITY: 5,
  ERR_INTERNAL: 10
} as const;

export function exitWithCode(code: number, message?: string): never {
  if (message) {
    if (code === EXIT_CODES.SUCCESS) {
      console.log(message);
    } else {
      console.error(message);
    }
  }
  process.exit(code);
}
