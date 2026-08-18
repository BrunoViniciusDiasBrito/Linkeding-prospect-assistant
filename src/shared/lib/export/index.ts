const escapeCsv = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
export function exportJson<T>(rows: T[]): string { return JSON.stringify(rows, null, 2); }
export function exportCsv<T extends Record<string, unknown>>(rows: T[]): string {
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  return [headers.map(escapeCsv).join(','), ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(','))].join('\n');
}
export function exportXlsx<T extends Record<string, unknown>>(rows: T[]): Blob {
  const html = `<table>${exportCsv(rows).split('\n').map((line) => `<tr>${line.split(',').map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</table>`;
  return new Blob([html], { type: 'application/vnd.ms-excel' });
}
