const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import html2pdf from 'html2pdf\.js';\n/, "import html2canvas from 'html2canvas-pro';\nimport { jsPDF } from 'jspdf';\n");

const match = /const handleDownloadPDF = \(\) => \{[\s\S]*?  \};\n/g;
const newPdfFn = `const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-pdf-template');
    if (!element) return;
    
    showToast('កំពុងបង្កើតឯកសារ PDF...', 'info');
    try {
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({ unit: 'in', format: 'letter', orientation: 'portrait' });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(\`វិក្កយបត្រ-\${activeInvoice?.id}.pdf\`);
      showToast('ទាញយក PDF ជោគជ័យ!', 'success');
    } catch (error: any) {
      console.error(error);
      showToast('បរាជ័យក្នុងការបង្កើត PDF!', 'error');
    }
  };\n`;

code = code.replace(match, newPdfFn);
fs.writeFileSync('src/App.tsx', code);
