const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the html2pdf import
code = code.replace(/import html2pdf from 'html2pdf\.js';\n/, "import html2canvas from 'html2canvas-pro';\nimport { jsPDF } from 'jspdf';\n");

// Replace handleDownloadPDF
const oldPdfFn = `  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-pdf-template');
    if (!element) return;
    // @ts-ignore
    if (html2pdf) {
      showToast('កំពុងបង្កើតឯកសារ PDF...', 'info');
      const opt = {
        margin: [0.2, 0.2, 0.2, 0.2],
        filename: \`វិក្កយបត្រ-\${activeInvoice?.id}.pdf\`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      // @ts-ignore
      html2pdf()
        .from(element)
        .set(opt)
        .save()
        .then(() => {
          showToast('ទាញយក PDF ជោគជ័យ!', 'success');
        });
    } else {
      showToast('មិនមានមុខងារបង្កើត PDF ទេ!', 'error');
    }
  };`;

const newPdfFn = `  const handleDownloadPDF = async () => {
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
  };`;

code = code.replace(oldPdfFn, newPdfFn);

fs.writeFileSync('src/App.tsx', code);
