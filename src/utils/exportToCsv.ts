export const exportToCsv = (data: Record<string, any>[], filename: string) => {
  const headers = Object.keys(data[0]);
  const rows = data.map(item => Object.values(item));
  const csvContent = [headers, ...rows]
  .map(row => row.map(cell => `"${cell}"`))
  .join('\n');
  const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}