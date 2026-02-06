/**
 * Export data to CSV file
 * @param data - Array of objects to export
 * @param filename - Name of the CSV file
 */
export const exportToCsv = (data: unknown[], filename: string) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No data to export");
  }

  const headers = Object.keys(data[0] as Record<string, unknown>);
  const rows = data.map(item => Object.values(item as Record<string, unknown>));
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`))
    .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}