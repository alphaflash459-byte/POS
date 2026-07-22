const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import html2canvas from 'html2canvas-pro';\n/, "import domtoimage from 'dom-to-image-more';\n");

const match = /const handleDownloadPDF = async \(\) => \{[\s\S]*?  \};\n/g;
const newPdfFn = `const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-pdf-template');
    if (!element) return;
    
    showToast('កំពុងបង្កើតឯកសារ PDF...', 'info');
    try {
      // Use dom-to-image-more which supports modern CSS (like oklch) via SVG foreignObject
      const imgData = await domtoimage.toJpeg(element, { quality: 0.98, bgcolor: '#ffffff' });
      const pdf = new jsPDF({ unit: 'in', format: 'letter', orientation: 'portrait' });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
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
