// Api/editDocumentAPI.js - Complete fixed version for React with jsPDF

// Import the libraries at the top of the file
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Helper function to get standard headers (no auth tokens needed - using session auth)
const getStandardHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

// Upload file with better error handling and timeout
export const uploadFile = async (categoryId, file) => {
  try {
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File is too large. Maximum size is 10MB.');
    }

    const formData = new FormData();
    formData.append('file', file);
    
    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(`${BASE_URL}/api/files/upload/${categoryId}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      signal: controller.signal, // Add timeout signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Upload timeout. Please try again with a smaller file.');
    }
    console.error("Error uploading file:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

// Upload document as PDF using jsPDF - React version
export const uploadDocumentAsPDF = async (categoryId, htmlContent, fileName) => {
  try {
    // Generate PDF using jsPDF
    const pdfBlob = await generatePDFWithJsPDF(htmlContent, fileName);
    
    // Create a File object with PDF MIME type
    const pdfFile = new File([pdfBlob], `${fileName}.pdf`, { 
      type: 'application/pdf' 
    });
    
    return await uploadFile(categoryId, pdfFile);
  } catch (error) {
    console.error("Error uploading document as PDF:", error);
    throw new Error(`Failed to upload document as PDF: ${error.message}`);
  }
};

// Generate PDF with reduced size and better compression
const generatePDFWithJsPDF = async (htmlContent, fileName) => {
  return new Promise((resolve, reject) => {
    try {
      // Create PDF instance with compression
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16,
        compress: true // Enable compression
      });

      // Clean and simplify HTML content
      const cleanedHTML = cleanHTMLForPDF(htmlContent);
      
      // Create smaller, optimized container
      const container = document.createElement('div');
      container.innerHTML = `
        <div style="
          width: 180mm;
          padding: 5mm;
          margin: 0;
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #000;
          background: #fff;
          box-sizing: border-box;
        ">
          <div style="
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #6366f1;
          ">
            <h1 style="
              font-size: 16px;
              font-weight: bold;
              color: #6366f1;
              margin: 0 0 5px 0;
            ">${fileName}</h1>
            <p style="
              font-size: 10px;
              color: #666;
              margin: 0;
            ">${new Date().toLocaleDateString()}</p>
          </div>
          <div style="
            word-wrap: break-word;
            overflow-wrap: break-word;
          ">
            ${cleanedHTML}
          </div>
        </div>
      `;

      // Style the container for rendering
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.background = '#fff';
      container.style.width = '190mm';
      
      document.body.appendChild(container);

      // Use html2canvas with reduced quality for smaller file size
      html2canvas(container, {
        scale: 1.5, // Reduced from 2 to 1.5
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 680, // Reduced width
        height: 900, // Reduced height
        scrollX: 0,
        scrollY: 0,
        logging: false, // Disable logging
        imageTimeout: 15000 // 15 second timeout for images
      }).then(canvas => {
        document.body.removeChild(container);
        
        // Compress image quality
        const imgData = canvas.toDataURL('image/jpeg', 0.7); // JPEG with 70% quality
        const imgWidth = 190; // Reduced width
        const pageHeight = 277; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'JPEG', 10, position + 10, imgWidth, imgHeight, undefined, 'MEDIUM');
        heightLeft -= pageHeight;

        // Add additional pages if needed (limit to 5 pages max)
        let pageCount = 1;
        while (heightLeft >= 0 && pageCount < 5) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 10, position + 10, imgWidth, imgHeight, undefined, 'MEDIUM');
          heightLeft -= pageHeight;
          pageCount++;
        }

        const pdfBlob = pdf.output('blob');
        
        // Check final PDF size
        if (pdfBlob.size > 8 * 1024 * 1024) { // 8MB limit
          reject(new Error('Generated PDF is too large. Please reduce content or try HTML format.'));
          return;
        }
        
        resolve(pdfBlob);
      }).catch(error => {
        document.body.removeChild(container);
        reject(new Error('Failed to generate PDF: ' + error.message));
      });

    } catch (error) {
      reject(new Error('PDF generation failed: ' + error.message));
    }
  });
};

// Clean HTML content for better PDF rendering
const cleanHTMLForPDF = (htmlContent) => {
  return htmlContent
    .replace(/contenteditable="true"/g, '')
    .replace(/class="editableTable"/g, 'style="border-collapse: collapse; width: 100%; margin: 10px 0; border: 1px solid #ddd;"')
    .replace(/class="editableImage"/g, 'style="max-width: 100%; height: auto; border: none;"')
    .replace(/style="[^"]*outline[^"]*"/g, '')
    .replace(/style="[^"]*border:\s*[^"]*solid[^"]*#6366f1[^"]*"/g, 'style="border: 1px solid #ddd;"')
    .replace(/<table[^>]*>/g, '<table style="border-collapse: collapse; width: 100%; margin: 10px 0; border: 1px solid #ddd;">')
    .replace(/<th[^>]*>/g, '<th style="border: 1px solid #ddd; padding: 8px; background-color: #f8f9fa; font-weight: bold;">')
    .replace(/<td[^>]*>/g, '<td style="border: 1px solid #ddd; padding: 8px;">');
};

// Simple text-only PDF generation (emergency fallback)
export const uploadDocumentAsSimplePDF = async (categoryId, htmlContent, fileName) => {
  try {
    // Create simple text-only PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Extract text content only
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.innerText || tempDiv.textContent || '';

    // Add title
    pdf.setFontSize(16);
    pdf.text(fileName, 20, 20);
    
    // Add date
    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add content as text
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(textContent, 170);
    pdf.text(lines, 20, 45);

    const pdfBlob = pdf.output('blob');
    
    // Create file and upload
    const pdfFile = new File([pdfBlob], `${fileName}.pdf`, { 
      type: 'application/pdf' 
    });
    
    return await uploadFile(categoryId, pdfFile);
  } catch (error) {
    console.error("Error uploading simple PDF:", error);
    throw new Error(`Failed to upload simple PDF: ${error.message}`);
  }
};

// Simple fallback - save as HTML but viewable in browser
export const uploadDocumentAsHTML = async (categoryId, htmlContent, fileName) => {
  try {
    const styledHTML = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      background: #fff;
      color: #333;
    }
    .document-header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid #6366f1;
    }
    .document-title {
      font-size: 24px;
      font-weight: bold;
      color: #6366f1;
      margin: 0 0 10px 0;
    }
    .document-info {
      font-size: 12px;
      color: #666;
      margin: 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
      border: 1px solid #ddd;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: right;
    }
    th {
      background-color: #f8f9fa;
      font-weight: bold;
    }
    img {
      max-width: 100%;
      height: auto;
      border: none !important;
    }
    .editableTable {
      border: 1px solid #ddd !important;
    }
    .editableImage {
      border: none !important;
    }
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="document-header">
    <h1 class="document-title">${fileName}</h1>
    <p class="document-info">נוצר ב-${new Date().toLocaleDateString('he-IL')}</p>
  </div>
  <div class="document-content">
    ${htmlContent}
  </div>
</body>
</html>`;

    const blob = new Blob([styledHTML], { type: 'text/html;charset=utf-8' });
    const file = new File([blob], `${fileName}.html`, { type: 'text/html' });
    
    return await uploadFile(categoryId, file);
  } catch (error) {
    console.error("Error uploading document as HTML:", error);
    throw new Error(`Failed to upload document as HTML: ${error.message}`);
  }
};

// Get files by category - matches your getFilesByCategory method
export const getFilesByCategory = async (categoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/files/by-category/${categoryId}`, {
      method: 'GET',
      headers: getStandardHeaders(),
      credentials: 'include', // Session-based auth
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching files by category:", error);
    throw error;
  }
};

// Get files by category (simple version) - matches your getFilesByCategorySimple method
export const getFilesByCategorySimple = async (categoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/files/by-category/${categoryId}/simple`, {
      method: 'GET',
      headers: getStandardHeaders(),
      credentials: 'include', // Session-based auth
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching files by category (simple):", error);
    throw error;
  }
};

// Delete file - matches your deleteFile method
export const deleteFile = async (fileId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/files/${fileId}`, {
      method: 'DELETE',
      headers: getStandardHeaders(),
      credentials: 'include', // Session-based auth
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // 204 No Content response doesn't have a body
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

// Download file - matches your downloadFile method
export const downloadFile = async (fileId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/files/${fileId}/download`, {
      method: 'GET',
      credentials: 'include', // Session-based auth
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // Return the blob for download
    return await response.blob();
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

// Get file count by category - matches your getFilesCountByCategory method
export const getFilesCountByCategory = async (categoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/files/category/${categoryId}/count`, {
      method: 'GET',
      headers: getStandardHeaders(),
      credentials: 'include', // Session-based auth
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching file count:", error);
    throw error;
  }
};

// Get courses - matches your CourseController.getAllCourses method
export const getCourses = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/courses`, {
      method: 'GET',
      headers: getStandardHeaders(),
      credentials: 'include', // Session-based auth
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// Get categories by course - you'll need to add this endpoint to your backend
export const getCategoriesByCourse = async (courseId, year = new Date().getFullYear()) => {
  try {
    const response = await fetch(`${BASE_URL}/api/categories/by-course/${courseId}?year=${year}`, {
      method: 'GET',
      headers: getStandardHeaders(),
      credentials: 'include', // Session-based auth
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories by course:", error);
    throw error;
  }
};