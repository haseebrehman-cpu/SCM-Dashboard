/**
 * Export data to PNG image file
 * @param data - Array of objects to export
 * @param filename - Name of the PNG file
 */
export const exportToPng = (data: unknown[], filename: string) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No data to export");
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Configuration
  const headers = Object.keys(data[0] as Record<string, unknown>);
  const rows = data.map(item => Object.values(item as Record<string, unknown>));
  const padding = 10;
  const cellPadding = 8;
  const headerHeight = 40;
  const rowHeight = 30;
  const columnWidth = 120;
  
  // Calculate canvas dimensions
  const tableWidth = headers.length * columnWidth + padding * 2;
  const tableHeight = (rows.length + 1) * rowHeight + padding * 2;
  
  canvas.width = tableWidth;
  canvas.height = tableHeight;

  // Draw background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header styling
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(padding, padding, tableWidth - padding * 2, headerHeight);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Draw headers
  headers.forEach((header, index) => {
    const x = padding + index * columnWidth + cellPadding;
    const y = padding + headerHeight / 2;
    
    // Truncate long headers
    const maxLength = 15;
    const displayHeader = header.length > maxLength ? header.substring(0, maxLength) + '...' : header;
    ctx.fillText(displayHeader, x, y);
  });

  // Draw rows
  ctx.fillStyle = '#000000';
  ctx.font = '12px Arial';

  rows.forEach((row, rowIndex) => {
    const yPos = padding + headerHeight + rowIndex * rowHeight;

    // Alternate row background
    if (rowIndex % 2 === 0) {
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(padding, yPos, tableWidth - padding * 2, rowHeight);
    }

    // Draw row borders
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, yPos, tableWidth - padding * 2, rowHeight);

    // Draw cell content
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    row.forEach((cell, cellIndex) => {
      const x = padding + cellIndex * columnWidth + cellPadding;
      const y = yPos + rowHeight / 2;
      
      // Truncate long cell values
      const maxLength = 18;
      const displayValue = String(cell).length > maxLength 
        ? String(cell).substring(0, maxLength) + '...' 
        : String(cell);
      
      ctx.fillText(displayValue, x, y);
    });
  });

  // Draw table borders
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2;
  ctx.strokeRect(padding, padding, tableWidth - padding * 2, tableHeight - padding * 2);

  // Draw column separators
  ctx.strokeStyle = '#d0d0d0';
  ctx.lineWidth = 1;
  for (let i = 1; i < headers.length; i++) {
    const x = padding + i * columnWidth;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, tableHeight - padding);
    ctx.stroke();
  }

  // Draw row separators
  for (let i = 1; i <= rows.length; i++) {
    const y = padding + headerHeight + i * rowHeight;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(tableWidth - padding, y);
    ctx.stroke();
  }

  // Convert canvas to image and download
  canvas.toBlob((blob) => {
    if (!blob) {
      throw new Error("Failed to create blob");
    }
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  });
};
