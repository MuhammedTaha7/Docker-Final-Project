import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Upload, Download, Save, Printer, Share2, 
  Bold, Underline, AlignLeft, AlignCenter, AlignRight, 
  Search, ZoomIn, ZoomOut, Type, Palette, Hash,
  RotateCcw, RotateCw, Languages, Globe, Image, X,
  Plus, List, Square, Minus, Link, Clock, Wrench,
  BarChart3, BookOpen, SearchCheck, Copy, Maximize2,
  Minimize2, Move, Trash2
} from 'lucide-react';
import './DocumentEditor.css';

const DocumentEditorPage = () => {
  // Core states
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('Untitled Document');
  const [language, setLanguage] = useState('en');
  const [textDirection, setTextDirection] = useState('ltr');
  const [zoom, setZoom] = useState(100);
  
  // Editor settings
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [lineHeight, setLineHeight] = useState(1.6);
  
  // Formatting states
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  
  // UI states
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceMode, setReplaceMode] = useState(false);
  const [replaceTerm, setReplaceTerm] = useState('');
  
  // Image control states
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageControls, setShowImageControls] = useState(false);
  const [imageSettings, setImageSettings] = useState({
    width: 100,
    height: 'auto',
    rotation: 0,
    opacity: 100,
    borderRadius: 0,
    margin: 10
  });
  
  // Stats
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  
  // Refs
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Languages with proper RTL/LTR configuration
  const languages = {
    en: { name: 'English', dir: 'ltr', font: 'Arial, sans-serif', align: 'left' },
    ar: { name: 'العربية', dir: 'rtl', font: 'Tahoma, Arial, sans-serif', align: 'right' },
    he: { name: 'עברית', dir: 'rtl', font: 'David, Tahoma, sans-serif', align: 'right' },
    ur: { name: 'اردو', dir: 'rtl', font: 'Tahoma, Arial, sans-serif', align: 'right' },
    fa: { name: 'فارسی', dir: 'rtl', font: 'Tahoma, Arial, sans-serif', align: 'right' },
    fr: { name: 'Français', dir: 'ltr', font: 'Arial, sans-serif', align: 'left' },
    es: { name: 'Español', dir: 'ltr', font: 'Arial, sans-serif', align: 'left' },
    de: { name: 'Deutsch', dir: 'ltr', font: 'Arial, sans-serif', align: 'left' },
    it: { name: 'Italiano', dir: 'ltr', font: 'Arial, sans-serif', align: 'left' },
    pt: { name: 'Português', dir: 'ltr', font: 'Arial, sans-serif', align: 'left' },
    ru: { name: 'Русский', dir: 'ltr', font: 'Arial, sans-serif', align: 'left' },
    hi: { name: 'हिन्दी', dir: 'ltr', font: 'Arial, sans-serif', align: 'left' }
  };
  
  // Font options
  const fonts = [
    'Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Tahoma', 'Calibri',
    'Helvetica', 'Trebuchet MS', 'Comic Sans MS', 'Impact', 'Courier New'
  ];
  
  // Color presets
  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080',
    '#FFA500', '#FFC0CB', '#A0522D', '#90EE90', '#ADD8E6', '#DDA0DD'
  ];
  
  // Utility to convert rgb to hex
  const rgbToHex = (rgb) => {
    if (!rgb || rgb.startsWith('#')) return rgb;
    const match = rgb.match(/\d+/g);
    if (!match) return '#000000';
    const [r, g, b] = match.map(Number);
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  // Update word/character count
  useEffect(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText.trim();
      const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
      const chars = text.length;
      setWordCount(words);
      setCharCount(chars);
    }
  }, [content]);
  
  // Handle language change
  const handleLanguageChange = (langCode) => {
    const selectedLang = languages[langCode];
    setLanguage(langCode);
    setTextDirection(selectedLang.dir);
    setFontFamily(selectedLang.font.split(',')[0]);
    setTextAlign(selectedLang.align);
    
    if (editorRef.current) {
      editorRef.current.style.direction = selectedLang.dir;
      editorRef.current.style.fontFamily = selectedLang.font;
      editorRef.current.setAttribute('dir', selectedLang.dir);
      editorRef.current.setAttribute('lang', langCode);
      editorRef.current.focus();
    }
  };
  
  // Handle content change
  const handleContentChange = (e) => {
    setContent(e.currentTarget.innerHTML);
  };

  // Handle selection change for formatting states
  const handleSelect = () => {
    setIsBold(document.queryCommandState('bold'));
    setIsUnderline(document.queryCommandState('underline'));
    
    let align = 'left';
    if (document.queryCommandState('justifyCenter')) align = 'center';
    else if (document.queryCommandState('justifyRight')) align = 'right';
    setTextAlign(align);
    
    const color = document.queryCommandValue('foreColor');
    setTextColor(rgbToHex(color));
  };
  
  // Toggle text direction
  const toggleTextDirection = () => {
    const newDir = textDirection === 'ltr' ? 'rtl' : 'ltr';
    const newAlign = newDir === 'rtl' ? 'right' : 'left';
    setTextDirection(newDir);
    setTextAlign(newAlign);
    
    if (editorRef.current) {
      editorRef.current.style.direction = newDir;
      editorRef.current.setAttribute('dir', newDir);
      editorRef.current.focus();
    }
  };
  
  // Apply formatting
  const toggleBold = () => {
    document.execCommand('bold');
    setIsBold(!isBold);
    editorRef.current.focus();
  };
  
  const toggleUnderline = () => {
    document.execCommand('underline');
    setIsUnderline(!isUnderline);
    editorRef.current.focus();
  };
  
  const handleTextAlign = (alignment) => {
    let command = 'justifyLeft';
    if (alignment === 'center') command = 'justifyCenter';
    else if (alignment === 'right') command = 'justifyRight';
    document.execCommand(command);
    setTextAlign(alignment);
    editorRef.current.focus();
  };

  // Enhanced image insertion function
  const insertHTMLAtCursor = (html) => {
    const sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const el = document.createElement('div');
      el.innerHTML = html;
      const frag = document.createDocumentFragment();
      let lastNode;
      
      // Fixed: Use let instead of const
      let node;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      
      range.insertNode(frag);
      if (lastNode) {
        const newRange = range.cloneRange();
        newRange.setStartAfter(lastNode);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
    }
  };
  
  // Generate unique ID for images
  const generateImageId = () => {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
  
  // Enhanced image upload handler
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image too large. Please select an image smaller than 5MB.');
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageId = generateImageId();
        const imgHtml = `<img 
          id="${imageId}" 
          src="${e.target.result}" 
          alt="${file.name}" 
          class="editable-image"
          style="
            max-width: 100%; 
            height: auto; 
            display: block; 
            margin: 10px auto; 
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 0px;
            opacity: 1;
            transform: rotate(0deg);
          " 
        /><p></p>`;
        
        insertHTMLAtCursor(imgHtml);
        setContent(editorRef.current.innerHTML);
        
        // Add click event listener to the new image
        setTimeout(() => {
          const img = document.getElementById(imageId);
          if (img) {
            img.addEventListener('click', () => handleImageClick(imageId));
          }
        }, 100);
      };
      reader.readAsDataURL(file);
      setShowImageMenu(false);
    } catch (error) {
      alert('Error loading image: ' + error.message);
    }
  };
  
  // Handle image click for selection
  const handleImageClick = (imageId) => {
    const img = document.getElementById(imageId);
    if (img) {
      // Remove selection from other images
      document.querySelectorAll('.editable-image').forEach(image => {
        image.style.border = '2px solid transparent';
      });
      
      // Select current image
      img.style.border = '2px solid #3b82f6';
      setSelectedImage(imageId);
      setShowImageControls(true);
      
      // Get current image settings
      const currentStyle = img.style;
      const transform = currentStyle.transform || '';
      const rotation = transform.match(/rotate\((-?\d+)deg\)/) || [null, 0];
      
      setImageSettings({
        width: parseInt(currentStyle.maxWidth) || 100,
        height: currentStyle.height || 'auto',
        rotation: parseInt(rotation[1]) || 0,
        opacity: parseInt(currentStyle.opacity * 100) || 100,
        borderRadius: parseInt(currentStyle.borderRadius) || 0,
        margin: parseInt(currentStyle.margin) || 10
      });
    }
  };
  
  // Apply image settings
  const applyImageSettings = () => {
    if (!selectedImage) return;
    
    const img = document.getElementById(selectedImage);
    if (img) {
      img.style.maxWidth = `${imageSettings.width}%`;
      img.style.height = imageSettings.height;
      img.style.opacity = imageSettings.opacity / 100;
      img.style.borderRadius = `${imageSettings.borderRadius}px`;
      img.style.margin = `${imageSettings.margin}px auto`;
      img.style.transform = `rotate(${imageSettings.rotation}deg)`;
      
      setContent(editorRef.current.innerHTML);
    }
  };
  
  // Remove selected image
  const removeSelectedImage = () => {
    if (!selectedImage) return;
    
    const img = document.getElementById(selectedImage);
    if (img && confirm('Remove this image?')) {
      img.remove();
      setSelectedImage(null);
      setShowImageControls(false);
      setContent(editorRef.current.innerHTML);
    }
  };
  
  // Insert image URL with enhanced options
  const insertImageURL = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const imageId = generateImageId();
      const imgHtml = `<img 
        id="${imageId}" 
        src="${url}" 
        alt="Image from URL" 
        class="editable-image"
        style="
          max-width: 100%; 
          height: auto; 
          display: block; 
          margin: 10px auto; 
          cursor: pointer;
          border: 2px solid transparent;
          border-radius: 0px;
          opacity: 1;
          transform: rotate(0deg);
        " 
      /><p></p>`;
      
      insertHTMLAtCursor(imgHtml);
      setContent(editorRef.current.innerHTML);
      
      // Add click event listener to the new image
      setTimeout(() => {
        const img = document.getElementById(imageId);
        if (img) {
          img.addEventListener('click', () => handleImageClick(imageId));
        }
      }, 100);
      
      setShowImageMenu(false);
    }
  };
  
  // File operations
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    
    try {
      const text = await file.text();
      let html;
      if (file.name.endsWith('.html')) {
        html = text;
      } else if (file.name.endsWith('.json')) {
        const parsed = JSON.parse(text);
        html = parsed.content;
      } else {
        html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
      }
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
        setContent(html);
      }
    } catch (error) {
      alert('Error loading file: ' + error.message);
    }
  };
  
  // Export functions
  const handleExport = (format) => {
    let exportContent = content;
    let mimeType = 'text/plain';
    let extension = '.txt';
    
    switch (format) {
      case 'html':
        const htmlStyles = `
          font-family: ${fontFamily};
          font-size: ${fontSize}px;
          line-height: ${lineHeight};
          color: ${textColor};
          background-color: ${backgroundColor};
          direction: ${textDirection};
        `.trim();
        
        exportContent = `<!DOCTYPE html>
<html lang="${language}" dir="${textDirection}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <style>
        body {
            ${htmlStyles}
            margin: 40px;
            max-width: 800px;
            margin: 40px auto;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .editable-image {
            cursor: default !important;
            border: none !important;
        }
    </style>
</head>
<body>
${content}
</body>
</html>`;
        mimeType = 'text/html';
        extension = '.html';
        break;
      case 'txt':
        exportContent = editorRef.current.innerText;
        break;
      case 'json':
        exportContent = JSON.stringify({
          fileName,
          content,
          settings: {
            language,
            textDirection,
            fontSize,
            fontFamily,
            textColor,
            backgroundColor,
            lineHeight,
            textAlign,
            isBold,
            isUnderline
          },
          statistics: { wordCount, charCount },
          timestamp: new Date().toISOString()
        }, null, 2);
        mimeType = 'application/json';
        extension = '.json';
        break;
      case 'pdf':
        generatePDF();
        return;
      case 'docx':
        generateDOCX();
        return;
    }
    
    const blob = new Blob([exportContent], { type: mimeType + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.[^/.]+$/, '') + extension;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Generate PDF with enhanced formatting
  const generatePDF = () => {
    try {
      const printWindow = window.open('', '_blank');
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="${language}" dir="${textDirection}">
        <head>
            <meta charset="UTF-8">
            <title>${fileName}</title>
            <style>
                @page { 
                    margin: 1.2in 1in 1in 1in; 
                    size: letter;
                }
                body {
                    font-family: ${fontFamily}, serif;
                    font-size: ${fontSize}px;
                    line-height: ${lineHeight};
                    color: ${textColor};
                    direction: ${textDirection};
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    margin: 0;
                    padding: 0;
                    background: white;
                }
                .document-header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding: 30px 20px 25px 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                }
                .document-title {
                    font-size: ${fontSize + 14}px;
                    font-weight: 700;
                    margin: 0 0 15px 0;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                    letter-spacing: 1px;
                }
                .document-subtitle {
                    font-size: ${fontSize + 2}px;
                    font-weight: 300;
                    margin: 0 0 20px 0;
                    opacity: 0.9;
                }
                .document-meta {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    flex-wrap: wrap;
                    font-size: ${fontSize - 1}px;
                    opacity: 0.8;
                }
                .meta-item {
                    background: rgba(255,255,255,0.2);
                    padding: 6px 12px;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .document-stats {
                    margin-top: 15px;
                    font-size: ${fontSize - 2}px;
                    opacity: 0.7;
                }
                .content-wrapper {
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    margin: 20px 0;
                }
                .document-content {
                    line-height: ${lineHeight};
                }
                .editable-image {
                    cursor: default !important;
                    border: none !important;
                }
                [dir="rtl"] {
                    text-align: right;
                }
                [dir="rtl"] .document-header {
                    text-align: center;
                }
                img {
                    max-width: 100%;
                    height: auto;
                }
                @media print {
                    body { 
                        print-color-adjust: exact; 
                        -webkit-print-color-adjust: exact;
                    }
                    .document-header {
                        background: #667eea !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="document-header">
                <div class="document-title">${fileName}</div>
                <div class="document-subtitle">Professional Document</div>
                <div class="document-meta">
                    <span class="meta-item">📅 ${new Date().toLocaleDateString(language)}</span>
                    <span class="meta-item">🌍 ${languages[language].name}</span>
                    <span class="meta-item">↔️ ${textDirection.toUpperCase()}</span>
                </div>
                <div class="document-stats">
                    ${wordCount} words • ${charCount} characters • ~${Math.ceil(wordCount / 200)} min read
                </div>
            </div>
            
            <div class="content-wrapper">
                <div class="document-content">${content}</div>
            </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 600);
      
      setShowExportMenu(false);
      setShowSaveMenu(false);
    } catch (error) {
      alert('PDF generation failed. Please try using your browser\'s print function and save as PDF.');
    }
  };

  // Generate enhanced DOCX
  const generateDOCX = () => {
    try {
      const htmlForWord = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>${fileName}</title>
          <style>
            @page {
              margin: 1in;
              mso-page-orientation: portrait;
            }
            body {
              font-family: ${fontFamily}, serif;
              font-size: ${fontSize}px;
              line-height: ${lineHeight};
              color: ${textColor};
              direction: ${textDirection};
              white-space: pre-wrap;
              margin: 0;
              padding: 20px;
              mso-line-height-rule: exactly;
            }
            .doc-header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 15px;
              border-bottom: 2px solid #333;
            }
            .doc-title {
              font-size: ${fontSize + 8}px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .doc-meta {
              font-size: ${fontSize - 1}px;
              color: #666;
              margin: 5px 0;
            }
            .doc-content {
              margin-top: 20px;
            }
            .editable-image {
              cursor: default !important;
              border: none !important;
            }
            [dir="rtl"] {
              mso-bidi-font-family: Tahoma;
              direction: rtl;
              text-align: right;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <div class="doc-header">
            <div class="doc-title">${fileName}</div>
            <div class="doc-meta">Document created on ${new Date().toLocaleDateString(language)}</div>
            <div class="doc-meta">Language: ${languages[language].name} • Direction: ${textDirection.toUpperCase()}</div>
            <div class="doc-meta">Statistics: ${wordCount} words, ${charCount} characters</div>
          </div>
          <div class="doc-content">${content}</div>
        </body>
        </html>
      `;

      const blob = new Blob([htmlForWord], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace(/\.[^/.]+$/, '') + '.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setShowExportMenu(false);
      setShowSaveMenu(false);
    } catch (error) {
      alert('DOCX generation failed: ' + error.message);
    }
  };
  
  // Search functions
  const handleSearch = () => {
    if (!searchTerm || !editorRef.current) return;
    window.find(searchTerm);
  };
  
  const handleReplace = () => {
    if (!searchTerm || !editorRef.current) return;
    
    function replaceInNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.includes(searchTerm)) {
          node.textContent = node.textContent.replace(new RegExp(searchTerm, 'gi'), replaceTerm);
        }
      } else {
        for (let child of node.childNodes) {
          replaceInNode(child);
        }
      }
    }
    
    replaceInNode(editorRef.current);
    setContent(editorRef.current.innerHTML);
    alert(`Replaced "${searchTerm}" with "${replaceTerm}"`);
  };
  
  // Template insertion
  const insertTemplate = (type) => {
    let template = '';
    const date = new Date().toLocaleDateString(language);
    
    switch (type) {
      case 'letter':
        template = `${date}

Dear [Name],

[Your message here]

Sincerely,
[Your name]`;
        break;
      case 'memo':
        template = `MEMORANDUM

TO: [Recipient]
FROM: [Your name]
DATE: ${date}
RE: [Subject]

[Content]`;
        break;
      case 'report':
        template = `Report Title

Executive Summary
[Summary]

Introduction
[Introduction]

Results
[Results]

Conclusion
[Conclusion]`;
        break;
      case 'meeting':
        template = `MEETING NOTES

Date: ${date}
Time: [Time]
Attendees: [Names]
Location: [Location/Virtual]

AGENDA:
1. [Item 1]
2. [Item 2]
3. [Item 3]

DISCUSSION:
- [Point 1]
- [Point 2]
- [Point 3]

ACTION ITEMS:
□ [Task 1] - [Responsible person] - [Due date]
□ [Task 2] - [Responsible person] - [Due date]
□ [Task 3] - [Responsible person] - [Due date]

NEXT MEETING: [Date and time]`;
        break;
      case 'invoice':
        template = `INVOICE

Invoice #: [Number]
Date: ${date}
Due Date: [Date]

BILL TO:
[Client Name]
[Address]
[City, State ZIP]
[Email]

FROM:
[Your Name/Company]
[Your Address]
[City, State ZIP]
[Phone] | [Email]

SERVICES/ITEMS:
Description                    Qty    Rate    Amount
[Service 1]                    1      $0.00   $0.00
[Service 2]                    1      $0.00   $0.00
[Service 3]                    1      $0.00   $0.00

                              SUBTOTAL: $0.00
                                   TAX: $0.00
                                 TOTAL: $0.00

PAYMENT TERMS: [Terms]
NOTES: [Additional information]`;
        break;
      case 'todo':
        template = `TO-DO LIST
Created: ${date}

HIGH PRIORITY:
□ [Important task 1]
□ [Important task 2]
□ [Important task 3]

MEDIUM PRIORITY:
□ [Task 1]
□ [Task 2]
□ [Task 3]

LOW PRIORITY:
□ [Task 1]
□ [Task 2]
□ [Task 3]

COMPLETED:
✅ [Completed task example]

NOTES:
- [Additional notes]
- [Reminders]`;
        break;
    }
    
    document.execCommand('insertText', false, template);
    setContent(editorRef.current.innerHTML);
  };
  
  // Apply style changes to editor
  const applyStyleToEditor = (styleProperty, value) => {
    if (editorRef.current) {
      editorRef.current.style[styleProperty] = value;
    }
  };
  
  // Editor styles (global styles only)
  const getEditorStyles = () => ({
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily,
    lineHeight: lineHeight,
    backgroundColor: backgroundColor,
    direction: textDirection,
    color: textColor
  });
  
  return (
    <div className="document-editor-container">
      {/* Header */}
      <div className="document-editor-header">
        <div className="header-top">
          <div>
            <h1 className="header-title">{fileName}</h1>
            <div className="header-subtitle">
              <Globe size={14} />
              <span>{languages[language].name}</span>
              <span>•</span>
              <span>{textDirection.toUpperCase()}</span>
              <span>•</span>
              <span>RICH TEXT</span>
            </div>
          </div>
          
          <div className="button-group">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-primary"
            >
              <Upload size={16} />
              Open
            </button>
            
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setShowSaveMenu(!showSaveMenu)}
                className="btn btn-success"
              >
                <Save size={16} />
                Save
              </button>
              {showSaveMenu && (
                <div className="dropdown">
                  <button
                    onClick={() => handleExport('txt')}
                    className="dropdown-item"
                  >
                    💾 Save as Text (.txt)
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="dropdown-item"
                  >
                    📕 Save as PDF (.pdf)
                  </button>
                  <button
                    onClick={() => handleExport('docx')}
                    className="dropdown-item"
                  >
                    📘 Save as Word (.docx)
                  </button>
                </div>
              )}
            </div>
            
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="btn btn-gray"
              >
                <Download size={16} />
                Export
              </button>
              {showExportMenu && (
                <div className="dropdown">
                  <button
                    onClick={() => handleExport('txt')}
                    className="dropdown-item"
                  >
                    📄 Plain Text (.txt)
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="dropdown-item"
                  >
                    📕 PDF Document (.pdf)
                  </button>
                  <button
                    onClick={() => handleExport('docx')}
                    className="dropdown-item"
                  >
                    📘 Word Document (.docx)
                  </button>
                  <button
                    onClick={() => handleExport('html')}
                    className="dropdown-item"
                  >
                    🌐 Web Page (.html)
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="dropdown-item"
                  >
                    📊 Data Format (.json)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Toolbar */}
        <div className="toolbar">
          {/* Formatting */}
          <div className="tool-section">
            <button
              onClick={toggleBold}
              className={`tool-btn ${isBold ? 'active' : ''}`}
              title="Bold"
              style={{fontWeight: 'bold'}}
            >
              <Bold size={16} />
            </button>
            <button
              onClick={toggleUnderline}
              className={`tool-btn ${isUnderline ? 'active' : ''}`}
              title="Underline"
              style={{textDecoration: 'underline'}}
            >
              <Underline size={16} />
            </button>
          </div>
          
          <div className="tool-section">
            <button
              onClick={() => handleTextAlign('left')}
              className={`tool-btn ${textAlign === 'left' ? 'active' : ''}`}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            <button
              onClick={() => handleTextAlign('center')}
              className={`tool-btn ${textAlign === 'center' ? 'active' : ''}`}
              title="Center"
            >
              <AlignCenter size={16} />
            </button>
            <button
              onClick={() => handleTextAlign('right')}
              className={`tool-btn ${textAlign === 'right' ? 'active' : ''}`}
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
          </div>
          
          {/* Image insertion */}
          <div className="tool-section">
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setShowImageMenu(!showImageMenu)}
                className={`tool-btn ${showImageMenu ? 'active' : ''}`}
                title="Insert Image"
              >
                <Image size={16} />
              </button>
              {showImageMenu && (
                <div className="dropdown">
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="dropdown-item"
                  >
                    📁 Upload Image
                  </button>
                  <button
                    onClick={insertImageURL}
                    className="dropdown-item"
                  >
                    🔗 Image URL
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Font Controls */}
          <div className="tool-section">
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setShowFontMenu(!showFontMenu)}
                className="tool-btn"
                title="Font Settings"
              >
                <Type size={16} />
                <span style={{fontSize: '12px', marginLeft: '4px'}}>{fontSize}px</span>
              </button>
              {showFontMenu && (
                <div className="dropdown">
                  <div style={{padding: '12px 16px', borderBottom: '1px solid #e5e7eb'}}>
                    <div style={{marginBottom: '8px', fontSize: '12px', fontWeight: '600'}}>Font Size</div>
                    <input
                      type="range"
                      min="10"
                      max="32"
                      value={fontSize}
                      onChange={(e) => {
                        setFontSize(parseInt(e.target.value));
                        applyStyleToEditor('fontSize', e.target.value + 'px');
                      }}
                      className="range-slider"
                    />
                    <div style={{textAlign: 'center', marginTop: '4px'}}>{fontSize}px</div>
                  </div>
                  <div style={{padding: '8px 0'}}>
                    <div style={{padding: '0 16px', fontSize: '12px', fontWeight: '600', marginBottom: '8px'}}>Font Family</div>
                    {fonts.map(font => (
                      <button
                        key={font}
                        onClick={() => {
                          setFontFamily(font);
                          applyStyleToEditor('fontFamily', font);
                          setShowFontMenu(false);
                        }}
                        className="dropdown-item"
                        style={{
                          fontFamily: font,
                          backgroundColor: fontFamily === font ? '#e0f2fe' : 'transparent'
                        }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setShowColorMenu(!showColorMenu)}
                className="tool-btn"
                style={{
                  backgroundColor: textColor,
                  color: textColor === '#000000' ? '#ffffff' : '#000000'
                }}
                title="Text Color"
              >
                <Palette size={16} />
              </button>
              {showColorMenu && (
                <div className="dropdown">
                  <div style={{padding: '8px 16px', borderBottom: '1px solid #e5e7eb', fontSize: '12px', fontWeight: '600'}}>
                    Text Color
                  </div>
                  <div className="color-grid">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          document.execCommand('foreColor', false, color);
                          setTextColor(color);
                          setShowColorMenu(false);
                        }}
                        className={`color-swatch ${textColor === color ? 'selected' : ''}`}
                        style={{backgroundColor: color}}
                        title={color}
                      />
                    ))}
                  </div>
                  <div style={{padding: '12px 16px', borderTop: '1px solid #e5e7eb'}}>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => {
                        document.execCommand('foreColor', false, e.target.value);
                        setTextColor(e.target.value);
                      }}
                      className="color-input"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Language & Direction Controls */}
          <div className="tool-section">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="form-select"
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '13px',
                padding: '8px'
              }}
            >
              {Object.entries(languages).map(([code, lang]) => (
                <option key={code} value={code}>{lang.name}</option>
              ))}
            </select>
            
            <button
              onClick={toggleTextDirection}
              className={`tool-btn ${textDirection === 'rtl' ? 'active' : ''}`}
              title={`Switch to ${textDirection === 'ltr' ? 'RTL' : 'LTR'}`}
            >
              <Languages size={16} />
              <span style={{fontSize: '11px', marginLeft: '4px'}}>{textDirection.toUpperCase()}</span>
            </button>
          </div>
          
          {/* Search */}
          <div className="tool-section">
            <button
              onClick={() => setSearchVisible(!searchVisible)}
              className={`tool-btn ${searchVisible ? 'active' : ''}`}
              title="Search"
            >
              <Search size={16} />
            </button>
          </div>
          
          {/* Zoom */}
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <button
              onClick={() => setZoom(Math.max(50, zoom - 25))}
              className="tool-btn"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span style={{fontSize: '13px', minWidth: '50px', textAlign: 'center'}}>{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="tool-btn"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Action Bar */}
      <div className="action-bar">
        {/* Insert Menu */}
        <div style={{position: 'relative'}}>
          <button
            onClick={() => setShowInsertMenu(!showInsertMenu)}
            className={`action-btn ${showInsertMenu ? 'active' : ''}`}
          >
            <Plus size={16} />
            Insert
          </button>
          {showInsertMenu && (
            <div className="dropdown" style={{minWidth: '220px'}}>
              <button
                onClick={() => {
                  const bullet = textDirection === 'rtl' ? '• ' : '• ';
                  document.execCommand('insertText', false, bullet);
                  setShowInsertMenu(false);
                }}
                className="dropdown-item"
              >
                <List size={14} style={{marginRight: '8px'}} />
                Bullet Point
              </button>
              <button
                onClick={() => {
                  document.execCommand('insertText', false, '1. ');
                  setShowInsertMenu(false);
                }}
                className="dropdown-item"
              >
                <Hash size={14} style={{marginRight: '8px'}} />
                Number
              </button>
              <button
                onClick={() => {
                  document.execCommand('insertText', false, '□ ');
                  setShowInsertMenu(false);
                }}
                className="dropdown-item"
              >
                <Square size={14} style={{marginRight: '8px'}} />
                Checkbox
              </button>
              <button
                onClick={() => {
                  const separator = '\n-----------------------------------\n';
                  document.execCommand('insertText', false, separator);
                  setShowInsertMenu(false);
                }}
                className="dropdown-item"
              >
                <Minus size={14} style={{marginRight: '8px'}} />
                Separator Line
              </button>
              <button
                onClick={() => {
                  const table = `
┌─────────────┬─────────────┬─────────────┐
│   Header 1  │   Header 2  │   Header 3  │
├─────────────┼─────────────┼─────────────┤
│   Data 1    │   Data 2    │   Data 3    │
│   Data 4    │   Data 5    │   Data 6    │
└─────────────┴─────────────┴─────────────┘
`;
                  document.execCommand('insertText', false, table);
                  setShowInsertMenu(false);
                }}
                className="dropdown-item"
              >
                <FileText size={14} style={{marginRight: '8px'}} />
                Simple Table
              </button>
              <button
                onClick={() => {
                  const url = prompt('Enter URL:');
                  const text = prompt('Enter link text (optional):') || url;
                  if (url) {
                    insertHTMLAtCursor(`<a href="${url}">${text}</a>`);
                  }
                  setShowInsertMenu(false);
                }}
                className="dropdown-item"
              >
                <Link size={14} style={{marginRight: '8px'}} />
                Link
              </button>
              <button
                onClick={() => {
                  const timestamp = new Date().toLocaleString(language);
                  document.execCommand('insertText', false, `\n\n[${timestamp}]\n`);
                  setShowInsertMenu(false);
                }}
                className="dropdown-item"
              >
                <Clock size={14} style={{marginRight: '8px'}} />
                Timestamp
              </button>
            </div>
          )}
        </div>

        {/* Tools Menu */}
        <div style={{position: 'relative'}}>
          <button
            onClick={() => setShowToolsMenu(!showToolsMenu)}
            className={`action-btn ${showToolsMenu ? 'active' : ''}`}
          >
            <Wrench size={16} />
            Tools
          </button>
          {showToolsMenu && (
            <div className="dropdown" style={{minWidth: '240px'}}>
              <button
                onClick={() => {
                  const wordFreq = {};
                  const words = editorRef.current.innerText.toLowerCase().match(/\b\w+\b/g) || [];
                  words.forEach(word => {
                    wordFreq[word] = (wordFreq[word] || 0) + 1;
                  });
                  const sorted = Object.entries(wordFreq)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10);
                  
                  const report = sorted.map(([word, count], index) => 
                    `${index + 1}. "${word}" - ${count} times`
                  ).join('\n');
                  
                  alert(`📊 Top 10 Most Used Words:\n\n${report}`);
                  setShowToolsMenu(false);
                }}
                className="dropdown-item"
              >
                <BarChart3 size={14} style={{marginRight: '8px'}} />
                Word Frequency
              </button>
              <button
                onClick={() => {
                  const sentences = editorRef.current.innerText.split(/[.!?]+/).filter(s => s.trim());
                  const avgLength = sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / sentences.length;
                  const readabilityScore = Math.max(0, Math.min(100, 100 - (avgLength - 15) * 2));
                  
                  alert(`📖 Readability Analysis:\n\n📑 Sentences: ${sentences.length}\n📏 Avg words per sentence: ${avgLength.toFixed(1)}\n🎯 Readability score: ${readabilityScore.toFixed(0)}/100\n\n${readabilityScore > 70 ? '✅ Easy to read' : readabilityScore > 50 ? '⚠️ Moderate difficulty' : '❌ Difficult to read'}`);
                  setShowToolsMenu(false);
                }}
                className="dropdown-item"
              >
                <BookOpen size={14} style={{marginRight: '8px'}} />
                Readability Check
              </button>
              <button
                onClick={() => {
                  const duplicates = [];
                  const words = editorRef.current.innerText.toLowerCase().match(/\b\w{4,}\b/g) || [];
                  const wordCount = {};
                  
                  words.forEach(word => {
                    wordCount[word] = (wordCount[word] || 0) + 1;
                  });
                  
                  Object.entries(wordCount).forEach(([word, count]) => {
                    if (count > 3) duplicates.push(`"${word}" appears ${count} times`);
                  });
                  
                  if (duplicates.length > 0) {
                    alert(`🔍 Potential Overused Words:\n\n${duplicates.slice(0, 10).join('\n')}\n\n💡 Consider using synonyms for variety.`);
                  } else {
                    alert('✅ No significantly overused words detected!');
                  }
                  setShowToolsMenu(false);
                }}
                className="dropdown-item"
              >
                <SearchCheck size={14} style={{marginRight: '8px'}} />
                Duplicate Checker
              </button>
              <button
                onClick={() => {
                  const upperText = editorRef.current.innerText.toUpperCase();
                  editorRef.current.innerHTML = upperText.replace(/\n/g, '<br>');
                  setContent(editorRef.current.innerHTML);
                  setShowToolsMenu(false);
                }}
                className="dropdown-item"
              >
                <Type size={14} style={{marginRight: '8px'}} />
                Convert to UPPERCASE
              </button>
              <button
                onClick={() => {
                  const lowerText = editorRef.current.innerText.toLowerCase();
                  editorRef.current.innerHTML = lowerText.replace(/\n/g, '<br>');
                  setContent(editorRef.current.innerHTML);
                  setShowToolsMenu(false);
                }}
                className="dropdown-item"
              >
                <Type size={14} style={{marginRight: '8px'}} />
                Convert to lowercase
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button
            onClick={() => {
              const lines = editorRef.current.innerText.split('\n').length;
              const paragraphs = editorRef.current.innerText.split('\n\n').filter(p => p.trim()).length;
              const readingTime = Math.ceil(wordCount / 200);
              const sentences = editorRef.current.innerText.split(/[.!?]+/).filter(s => s.trim()).length;
              alert(`📊 Document Statistics:\n\n📝 Words: ${wordCount}\n🔤 Characters: ${charCount}\n📄 Lines: ${lines}\n📋 Paragraphs: ${paragraphs}\n📑 Sentences: ${sentences}\n⏱️ Reading time: ~${readingTime} min\n🌍 Language: ${languages[language].name}\n↔️ Direction: ${textDirection.toUpperCase()}`);
            }}
            className="quick-action-btn"
            title="Document Statistics"
          >
            <BarChart3 size={14} />
          </button>

          <button
            onClick={() => window.print()}
            className="quick-action-btn"
            title="Print Document"
          >
            <Printer size={14} />
          </button>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(editorRef.current.innerText);
                alert('📋 Document copied to clipboard!');
              } else {
                if (editorRef.current) {
                  const range = document.createRange();
                  range.selectNodeContents(editorRef.current);
                  const sel = window.getSelection();
                  sel.removeAllRanges();
                  sel.addRange(range);
                  document.execCommand('copy');
                  alert('📋 Document copied to clipboard!');
                }
              }
            }}
            className="quick-action-btn"
            title="Copy All Text"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h3 className="sidebar-title">Document Tools</h3>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="tool-btn"
            >
              {sidebarOpen ? <RotateCcw size={16} /> : <RotateCw size={16} />}
            </button>
          </div>
          
          {/* Document Name at Top */}
          <div className="sidebar-section">
            <div className="section-title">Document Info</div>
            <div className="document-info-card">
              <div className="document-info-title">
                📄 {fileName}
              </div>
              <div className="document-info-stats">
                {wordCount} words • {languages[language].name}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="form-label">
                Document Name
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="form-input"
                placeholder="Enter document name..."
              />
            </div>
          </div>
          
          {/* Enhanced Quick Actions */}
          <div className="sidebar-section">
            <div className="section-title">Quick Actions</div>
            <button
              onClick={() => {
                const lines = editorRef.current.innerText.split('\n').length;
                const paragraphs = editorRef.current.innerText.split('\n\n').filter(p => p.trim()).length;
                const readingTime = Math.ceil(wordCount / 200);
                const sentences = editorRef.current.innerText.split(/[.!?]+/).filter(s => s.trim()).length;
                alert(`📊 Document Statistics:\n\n📝 Words: ${wordCount}\n🔤 Characters: ${charCount}\n📄 Lines: ${lines}\n📋 Paragraphs: ${paragraphs}\n📑 Sentences: ${sentences}\n⏱️ Reading time: ~${readingTime} min\n🌍 Language: ${languages[language].name}\n↔️ Direction: ${textDirection.toUpperCase()}`);
              }}
              className="sidebar-btn"
            >
              <Hash size={16} />
              <span>Document Statistics</span>
            </button>
            
            <button
              onClick={() => {
                const timestamp = new Date().toLocaleString(language);
                document.execCommand('insertText', false, `\n\n[${timestamp}]\n`);
              }}
              className="sidebar-btn"
            >
              📅 Insert Timestamp
            </button>
            
            <button
              onClick={() => {
                const signature = prompt('Enter your signature:');
                if (signature) {
                  document.execCommand('insertText', false, `\n\n---\n${signature}\n${new Date().toLocaleDateString(language)}`);
                }
              }}
              className="sidebar-btn"
            >
              ✍️ Insert Signature
            </button>
            
            <button
              onClick={() => {
                // Count words by language type
                const arabicWords = (editorRef.current.innerText.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g) || []).length;
                const hebrewWords = (editorRef.current.innerText.match(/[\u0590-\u05FF]+/g) || []).length;
                const englishWords = (editorRef.current.innerText.match(/[a-zA-Z]+/g) || []).length;
                
                alert(`🔍 Language Analysis:\n\n🇺🇸 English words: ${englishWords}\n🇸🇦 Arabic words: ${arabicWords}\n🇮🇱 Hebrew words: ${hebrewWords}\n\n📊 Total: ${englishWords + arabicWords + hebrewWords} language words`);
              }}
              className="sidebar-btn"
            >
              🌍 Language Analysis
            </button>
            
            <button
              onClick={() => window.print()}
              className="sidebar-btn"
            >
              <Printer size={16} />
              <span>Print Document</span>
            </button>
            
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(editorRef.current.innerText);
                  alert('📋 Document copied to clipboard!');
                } else {
                  if (editorRef.current) {
                    const range = document.createRange();
                    range.selectNodeContents(editorRef.current);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    document.execCommand('copy');
                    alert('📋 Document copied to clipboard!');
                  }
                }
              }}
              className="sidebar-btn"
            >
              📋 Copy All Text
            </button>
            
            <button
              onClick={() => {
                if (confirm('🗑️ Clear all content? This action cannot be undone.')) {
                  editorRef.current.innerHTML = '';
                  setContent('');
                  // Reset formatting
                  setIsBold(false);
                  setIsUnderline(false);
                  setTextAlign('left');
                }
              }}
              className="sidebar-btn danger"
            >
              <span className="text-danger">🗑️ Clear Document</span>
            </button>
          </div>
          
          {/* Enhanced Templates */}
          <div className="sidebar-section">
            <div className="section-title">Document Templates</div>
            <button
              onClick={() => insertTemplate('letter')}
              className="sidebar-btn"
            >
              <FileText size={16} />
              <span>Business Letter</span>
            </button>
            <button
              onClick={() => insertTemplate('memo')}
              className="sidebar-btn"
            >
              <FileText size={16} />
              <span>Memorandum</span>
            </button>
            <button
              onClick={() => insertTemplate('report')}
              className="sidebar-btn"
            >
              <FileText size={16} />
              <span>Report Structure</span>
            </button>
            <button
              onClick={() => insertTemplate('meeting')}
              className="sidebar-btn"
            >
              📋 Meeting Notes
            </button>
            <button
              onClick={() => insertTemplate('invoice')}
              className="sidebar-btn"
            >
              💰 Invoice Template
            </button>
            <button
              onClick={() => insertTemplate('todo')}
              className="sidebar-btn"
            >
              ✅ To-Do List
            </button>
          </div>
          
          {/* Settings */}
          <div className="sidebar-section">
            <div className="section-title">Document Settings</div>
            
            <div className="mb-4">
              <label className="form-label">
                Line Height: {lineHeight}
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={lineHeight}
                onChange={(e) => {
                  setLineHeight(parseFloat(e.target.value));
                  applyStyleToEditor('lineHeight', e.target.value);
                }}
                className="range-slider"
              />
            </div>
            
            <div>
              <label className="form-label">
                Background Color
              </label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => {
                  setBackgroundColor(e.target.value);
                  applyStyleToEditor('backgroundColor', e.target.value);
                }}
                className="color-input"
              />
            </div>
          </div>
        </div>
        
        {/* Editor Area */}
        <div className="editor-area">
          {/* Search Panel */}
          {searchVisible && (
            <div className="search-panel">
              <div className="panel-header">
                <h4 className="panel-title">Find & Replace</h4>
                <button
                  onClick={() => setSearchVisible(false)}
                  className="panel-close-btn"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="mb-4">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              {replaceMode && (
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Replace with..."
                    value={replaceTerm}
                    onChange={(e) => setReplaceTerm(e.target.value)}
                    className="form-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleReplace()}
                  />
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  className="btn btn-primary"
                  style={{fontSize: '12px', padding: '6px 12px'}}
                >
                  Find
                </button>
                <button
                  onClick={() => setReplaceMode(!replaceMode)}
                  className="btn btn-gray"
                  style={{fontSize: '12px', padding: '6px 12px'}}
                >
                  {replaceMode ? 'Hide' : 'Replace'}
                </button>
                {replaceMode && (
                  <button
                    onClick={handleReplace}
                    className="btn btn-success"
                    style={{fontSize: '12px', padding: '6px 12px'}}
                  >
                    Replace All
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Image Control Panel */}
          {showImageControls && selectedImage && (
            <div className="image-control-panel">
              <div className="panel-header">
                <h4 className="panel-title">🖼️ Image Controls</h4>
                <button
                  onClick={() => {
                    setShowImageControls(false);
                    setSelectedImage(null);
                    // Remove selection border from all images
                    document.querySelectorAll('.editable-image').forEach(img => {
                      img.style.border = '2px solid transparent';
                    });
                  }}
                  className="panel-close-btn"
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* Width Control */}
              <div className="image-control-group">
                <label className="form-label">
                  Width: {imageSettings.width}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={imageSettings.width}
                  onChange={(e) => {
                    setImageSettings(prev => ({...prev, width: parseInt(e.target.value)}));
                    applyImageSettings();
                  }}
                  className="range-slider"
                />
                <div className="control-buttons">
                  <button
                    onClick={() => {
                      setImageSettings(prev => ({...prev, width: 25}));
                      applyImageSettings();
                    }}
                    className="control-btn"
                  >
                    25%
                  </button>
                  <button
                    onClick={() => {
                      setImageSettings(prev => ({...prev, width: 50}));
                      applyImageSettings();
                    }}
                    className="control-btn"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => {
                      setImageSettings(prev => ({...prev, width: 100}));
                      applyImageSettings();
                    }}
                    className="control-btn"
                  >
                    100%
                  </button>
                </div>
              </div>

              {/* Rotation Control */}
              <div className="image-control-group">
                <label className="form-label">
                  Rotation: {imageSettings.rotation}°
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={imageSettings.rotation}
                  onChange={(e) => {
                    setImageSettings(prev => ({...prev, rotation: parseInt(e.target.value)}));
                    applyImageSettings();
                  }}
                  className="range-slider"
                />
                <div className="control-buttons">
                  <button
                    onClick={() => {
                      setImageSettings(prev => ({...prev, rotation: -90}));
                      applyImageSettings();
                    }}
                    className="control-btn"
                  >
                    <RotateCw size={12} style={{transform: 'rotate(-90deg)'}} />
                  </button>
                  <button
                    onClick={() => {
                      setImageSettings(prev => ({...prev, rotation: 0}));
                      applyImageSettings();
                    }}
                    className="control-btn"
                  >
                    0°
                  </button>
                  <button
                    onClick={() => {
                      setImageSettings(prev => ({...prev, rotation: 90}));
                      applyImageSettings();
                    }}
                    className="control-btn"
                  >
                    <RotateCw size={12} />
                  </button>
                </div>
              </div>

              {/* Opacity Control */}
              <div className="image-control-group">
                <label className="form-label">
                  Opacity: {imageSettings.opacity}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={imageSettings.opacity}
                  onChange={(e) => {
                    setImageSettings(prev => ({...prev, opacity: parseInt(e.target.value)}));
                    applyImageSettings();
                  }}
                  className="range-slider"
                />
              </div>

              {/* Border Radius Control */}
              <div className="image-control-group">
                <label className="form-label">
                  Border Radius: {imageSettings.borderRadius}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={imageSettings.borderRadius}
                  onChange={(e) => {
                    setImageSettings(prev => ({...prev, borderRadius: parseInt(e.target.value)}));
                    applyImageSettings();
                  }}
                  className="range-slider"
                />
              </div>

              {/* Margin Control */}
              <div className="image-control-group">
                <label className="form-label">
                  Margin: {imageSettings.margin}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={imageSettings.margin}
                  onChange={(e) => {
                    setImageSettings(prev => ({...prev, margin: parseInt(e.target.value)}));
                    applyImageSettings();
                  }}
                  className="range-slider"
                />
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  onClick={() => {
                    setImageSettings({
                      width: 100,
                      height: 'auto',
                      rotation: 0,
                      opacity: 100,
                      borderRadius: 0,
                      margin: 10
                    });
                    applyImageSettings();
                  }}
                  className="btn btn-reset"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
                <button
                  onClick={removeSelectedImage}
                  className="btn btn-remove"
                >
                  <Trash2 size={12} />
                  Remove
                </button>
              </div>
            </div>
          )}
          
          {/* Editor Container */}
          <div className="editor-container">
            <div style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              width: `${100 / (zoom / 100)}%`
            }}>
              <div
                ref={editorRef}
                contentEditable={true}
                onInput={handleContentChange}
                onSelect={handleSelect}
                onClick={(e) => {
                  // Handle image click if it's an image
                  if (e.target.tagName === 'IMG' && e.target.classList.contains('editable-image')) {
                    handleImageClick(e.target.id);
                  } else {
                    // Deselect images if clicking elsewhere
                    setSelectedImage(null);
                    setShowImageControls(false);
                    document.querySelectorAll('.editable-image').forEach(img => {
                      img.style.border = '2px solid transparent';
                    });
                  }
                }}
                className="editor"
                style={getEditorStyles()}
                dir={textDirection}
                lang={language}
                placeholder={`Start typing your document here...

🌍 Language Test:
English: Hello World!
Arabic: مرحبا بالعالم!
Hebrew: שלום עולם!

✨ Use the toolbar to format your text
🔄 Change language to test RTL/LTR
🖼️ Use Image button to insert images
📐 Click on images to resize and control them`}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span>📝 Words: {wordCount}</span>
          <span>🔤 Characters: {charCount}</span>
          <span>🌍 {languages[language].name}</span>
          <span>↔️ {textDirection.toUpperCase()}</span>
          <span>📄 RICH TEXT</span>
          {selectedImage && <span>🖼️ Image Selected</span>}
        </div>
        <div className="status-right">
          <span>🔍 Zoom: {zoom}%</span>
          <span>📏 {fontSize}px {fontFamily}</span>
          <span>{isBold ? '🅱️ Bold' : ''} {isUnderline ? '🔤 Underline' : ''}</span>
          <span>✅ Ready to type</span>
        </div>
      </div>
      
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.html,.json,.md"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default DocumentEditorPage;