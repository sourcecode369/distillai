/**
 * Exports the current page content to PDF by opening a print dialog
 * 
 * Creates a new window with a print-friendly version of the content,
 * then automatically triggers the browser's print dialog. The content
 * is styled for optimal printing with proper typography and spacing.
 * 
 * Note: This function relies on the browser's native print functionality.
 * For true PDF generation, consider using a library like jsPDF or Puppeteer.
 * 
 * @returns {void}
 * 
 * @example
 * // Call when user clicks "Export to PDF" button
 * exportToPDF();
 */
export const exportToPDF = () => {
  // Create a print-friendly version in a new window
  const printWindow = window.open('', '_blank');
  // Try to find the main content area, fallback to entire body
  const content = document.querySelector('.topic-content') || document.body;
  
  // Write HTML with print-optimized styles
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${document.title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            line-height: 1.6;
            color: #333;
          }
          h1, h2, h3 {
            color: #1e293b;
            margin-top: 2em;
          }
          h1 { font-size: 2.5em; }
          h2 { font-size: 2em; }
          h3 { font-size: 1.5em; }
          p { margin: 1em 0; }
          @media print {
            body { padding: 20px; }
            a { color: #6366f1; text-decoration: none; }
            a::after { content: " (" attr(href) ")"; }
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);
  
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
};



