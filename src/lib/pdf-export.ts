import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const downloadQuizReviewAsPdf = async (element: HTMLElement | null): Promise<boolean> => {
    if (!element) {
        console.error("PDF generation failed: element not found.");
        return false;
    }

    try {
        const canvas = await html2canvas(element, { 
            scale: 2, 
            windowWidth: element.scrollWidth, 
            windowHeight: element.scrollHeight,
            useCORS: true, 
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }
        
        pdf.save(`quiz-review-score.pdf`);
        return true;
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        return false;
    }
};
