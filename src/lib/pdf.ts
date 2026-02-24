import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export const generatePDF = async (containerId: string, filename: string) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Element with id ${containerId} not found`);
    alert("Errore: Elemento non trovato per la generazione del PDF.");
    return;
  }

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Find all elements with class 'print-page'
    const pages = container.getElementsByClassName('print-page');
    
    if (pages.length === 0) {
      // Fallback if no pages found (shouldn't happen with new ReportView)
      console.warn("No .print-page elements found, capturing entire container");
      const dataUrl = await toPng(container, { quality: 0.95, backgroundColor: '#ffffff' });
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    } else {
      // Capture each page separately
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        // Add new page if not the first one
        if (i > 0) {
          pdf.addPage();
        }

        const dataUrl = await toPng(page, { 
          quality: 0.95, 
          backgroundColor: '#ffffff',
          // Ensure we capture at a good resolution
          pixelRatio: 2 
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // We assume the page element is already sized for A4 (ratio wise), 
        // but we fit it to the PDF page just in case.
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
    }

    pdf.save(filename);
  } catch (error) {
    console.error("PDF Generation failed", error);
    alert("Errore durante la generazione del PDF: " + (error as Error).message);
  }
};
