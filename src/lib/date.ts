export function todayKey(): string {
  return new Date().toLocaleDateString('en-CA'); // en-CA formats as YYYY-MM-DD
}

export function isValidDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
