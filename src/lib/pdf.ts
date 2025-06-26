'use client';

declare const pdfjsLib: any;

export const extractTextFromPdf = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if pdfjsLib is loaded
    if (typeof pdfjsLib === 'undefined' || !pdfjsLib.getDocument) {
        return reject(new Error("PDF processing library is not loaded. Please try again in a moment."));
    }
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error("Failed to read file."));
      }
      try {
        const pdf = await pdfjsLib.getDocument(event.target.result).promise;
        let content = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          content += textContent.items.map((item: any) => item.str).join(' ');
        }
        resolve(content);
      } catch (error) {
        console.error("PDF processing error:", error);
        reject(new Error("Could not process PDF file. It might be corrupted or protected."));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file."));
    reader.readAsArrayBuffer(file);
  });
};
