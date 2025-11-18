
export const exportToCsv = (filename: string, rows: (string | number | boolean)[][]) => {
  if (!rows || rows.length === 0) {
    alert('No data to export.');
    return;
  }

  const processRow = (row: (string | number | boolean)[]) => {
    return row.map(val => {
      const str = String(val).replace(/"/g, '""'); // Escape double quotes
      if (str.search(/("|,|\n)/g) >= 0) {
        return `"${str}"`; // Enclose in double quotes if it contains special characters
      }
      return str;
    }).join(',');
  };

  const csvContent = rows.map(processRow).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) { // feature detection
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
