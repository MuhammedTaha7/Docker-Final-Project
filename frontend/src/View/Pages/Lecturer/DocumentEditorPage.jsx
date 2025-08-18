import React, { useState, useRef, useEffect } from 'react';
import {
  FileText, Upload, Download, Save, Printer, Share2,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Search, ZoomIn, ZoomOut, Type, Palette, Hash,
  RotateCcw, RotateCw, Languages, Globe, Image, X,
  Plus, List, Square, Minus, Link, Clock, Settings,
  BarChart3, BookOpen, SearchCheck, Copy, Maximize2,
  Minimize2, Move, Trash2, FileDown, FilePlus, FileType,
  Globe2, Code, Database, CheckCircle, Table, Grid3x3,
  Columns, Rows, MoreHorizontal, Highlighter, Cloud
} from 'lucide-react';

import { 
  getCourses, 
  getCategoriesByCourse, 
  uploadFile,
  uploadDocumentAsPDF
} from '../../../Api/editDocumentAPI';

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
  const [textColor, setTextColor] = useState('#2c3e50');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [lineHeight, setLineHeight] = useState(1.6);
  const [highlightColor, setHighlightColor] = useState('#ffff00'); // Default yellow
  // Formatting states
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [isHighlight, setIsHighlight] = useState(false);
  // UI states
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceMode, setReplaceMode] = useState(false);
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showOpenMenu, setShowOpenMenu] = useState(false);
  // Server integration states
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [courseFileId, setCourseFileId] = useState(null);
  // Table states
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showTableControls, setShowTableControls] = useState(false);
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
  // Improved color palette with better readability and organization
  const colors = [
    // Basic colors
    '#000000', '#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#bdc3c7',
    '#ecf0f1', '#ffffff',
   
    // Blues
    '#3498db', '#2980b9', '#1abc9c', '#16a085', '#2ecc71', '#27ae60',
   
    // Warm colors
    '#e74c3c', '#c0392b', '#e67e22', '#d35400', '#f39c12', '#f1c40f',
   
    // Purples and pinks
    '#9b59b6', '#8e44ad', '#e91e63', '#ad1457', '#673ab7', '#512da8',
   
    // Professional colors
    '#607d8b', '#455a64', '#795548', '#5d4037', '#424242', '#212121'
  ];
  // Highlight colors - added some common highlighter colors
  const highlightColors = [
    '#ffff00', // Yellow
    '#00ff00', // Green
    '#00ffff', // Cyan
    '#ff00ff', // Magenta
    '#ff9900', // Orange
    '#ff0000', // Red
    '#ffffff', // White (remove)
    ...colors // Include other colors if needed
  ];
  // Color names for tooltips
  const colorNames = {
    '#000000': 'Black',
    '#2c3e50': 'Dark Blue Gray',
    '#34495e': 'Dark Gray',
    '#7f8c8d': 'Gray',
    '#95a5a6': 'Light Gray',
    '#bdc3c7': 'Silver',
    '#ecf0f1': 'Light Silver',
    '#ffffff': 'White',
    '#3498db': 'Blue',
    '#2980b9': 'Dark Blue',
    '#1abc9c': 'Turquoise',
    '#16a085': 'Dark Turquoise',
    '#2ecc71': 'Green',
    '#27ae60': 'Dark Green',
    '#e74c3c': 'Red',
    '#c0392b': 'Dark Red',
    '#e67e22': 'Orange',
    '#d35400': 'Dark Orange',
    '#f39c12': 'Yellow Orange',
    '#f1c40f': 'Yellow',
    '#9b59b6': 'Purple',
    '#8e44ad': 'Dark Purple',
    '#e91e63': 'Pink',
    '#ad1457': 'Dark Pink',
    '#673ab7': 'Deep Purple',
    '#512da8': 'Indigo',
    '#607d8b': 'Blue Gray',
    '#455a64': 'Dark Blue Gray',
    '#795548': 'Brown',
    '#5d4037': 'Dark Brown',
    '#424242': 'Dark Gray',
    '#212121': 'Very Dark Gray',
    '#ffff00': 'Yellow Highlight',
    '#00ff00': 'Green Highlight',
    '#00ffff': 'Cyan Highlight',
    '#ff00ff': 'Magenta Highlight',
    '#ff9900': 'Orange Highlight',
    '#ff0000': 'Red Highlight'
  };
  // Utility to convert rgb to hex
  const rgbToHex = (rgb) => {
    if (!rgb || rgb.startsWith('#')) return rgb;
    const match = rgb.match(/\d+/g);
    if (!match) return '#2c3e50'; // Better default
    const [r, g, b] = match.map(Number);
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };
  // Font size mapping functions
  const getLevelFromPx = (px) => {
    if (px < 12) return 1;
    if (px < 15) return 2;
    if (px < 18) return 3;
    if (px < 22) return 4;
    if (px < 28) return 5;
    if (px < 40) return 6;
    return 7;
  };
  const getPxFromLevel = (level) => {
    switch (parseInt(level)) {
      case 1: return 10;
      case 2: return 13;
      case 3: return 16;
      case 4: return 18;
      case 5: return 24;
      case 6: return 32;
      case 7: return 48;
      default: return 16;
    }
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
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        // Optional: Show user-friendly error message
        alert('Failed to load courses. Please refresh the page.');
      }
    };
   
    fetchCourses();
  }, []);
  // Fetch categories when course is selected
  useEffect(() => {
    const fetchCategories = async () => {
      if (selectedCourseId) {
        try {
          const data = await getCategoriesByCourse(selectedCourseId, 2025);
          setCategories(data);
        } catch (error) {
          console.error('Failed to fetch categories:', error);
          setCategories([]);
          // Optional: Show user-friendly error message
          alert('Failed to load categories for this course.');
        }
      } else {
        setCategories([]);
        setSelectedCategoryId('');
      }
    };
   
    fetchCategories();
  }, [selectedCourseId]);
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
    const currentFontSizeLevel = document.queryCommandValue('fontSize');
    setFontSize(getPxFromLevel(currentFontSizeLevel));
    const hilite = document.queryCommandValue('hiliteColor');
    if (hilite) {
      setHighlightColor(rgbToHex(hilite));
      setIsHighlight(true);
    } else {
      setIsHighlight(false);
    }
   
    // Don't update textColor state based on selection to avoid overriding current setting
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
 
  // Improved color change function that only affects new text
  const changeTextColor = (color) => {
    setTextColor(color);
   
    // Apply color to selected text or set it for new text
    if (window.getSelection().toString().length > 0) {
      // If text is selected, apply color to selection
      document.execCommand('foreColor', false, color);
    } else {
      // If no text is selected, set color for future typing
      document.execCommand('foreColor', false, color);
     
      // Also ensure the editor maintains focus
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
   
    setShowColorMenu(false);
  };
  // Highlight change
  const changeHighlightColor = (color) => {
    setHighlightColor(color);
    document.execCommand('hiliteColor', false, color);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    setShowHighlightMenu(false);
  };
  // Toggle highlight - but since it's color based, perhaps just set to current highlightColor
  const toggleHighlight = () => {
    document.execCommand('hiliteColor', false, isHighlight ? 'transparent' : highlightColor);
    setIsHighlight(!isHighlight);
    editorRef.current.focus();
  };
  // Change font size
  const changeFontSize = (newPx) => {
    setFontSize(newPx);
    const level = getLevelFromPx(newPx);
    document.execCommand('fontSize', false, level);
    if (editorRef.current) {
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
  const insertHTMLAtCursor = (html) => {
    const sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const el = document.createElement('div');
      el.innerHTML = html;
      const frag = document.createDocumentFragment();
      let lastNode;
     
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
 
  // Enhanced image insertion function
  const generateTableId = () => {
    return `table_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
  // Create table function
  const createTable = (rows = 3, cols = 3) => {
    const tableId = generateTableId();
    const colWidth = Math.floor(100 / cols);
   
    let tableHTML = `<div style="width: 100%; overflow-x: auto; margin: 20px 0;">
      <table id="${tableId}" class="editableTable" style="
        width: 100%;
        max-width: 100%;
        border-collapse: collapse;
        border: 2px solid #6366f1;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        table-layout: fixed;
        box-sizing: border-box;
      ">`;
   
    // Create header row
    tableHTML += '<thead><tr style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white;">';
    for (let j = 0; j < cols; j++) {
      tableHTML += `<th style="
        width: ${colWidth}%;
        max-width: ${colWidth}%;
        padding: 8px 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-weight: 600;
        text-align: left;
        font-size: 13px;
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-all;
        box-sizing: border-box;
        overflow: hidden;
      " contenteditable="true">Header ${j + 1}</th>`;
    }
    tableHTML += '</tr></thead>';
   
    // Create body rows
    tableHTML += '<tbody>';
    for (let i = 0; i < rows - 1; i++) {
      tableHTML += '<tr style="border-bottom: 1px solid #e2e8f0;">';
      for (let j = 0; j < cols; j++) {
        tableHTML += `<td style="
          width: ${colWidth}%;
          max-width: ${colWidth}%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          min-height: 40px;
          font-size: 13px;
          transition: background-color 0.2s ease;
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-all;
          vertical-align: top;
          box-sizing: border-box;
          overflow: hidden;
        " contenteditable="true">Cell ${i + 1}-${j + 1}</td>`;
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table></div><p></p>';
   
    insertHTMLAtCursor(tableHTML);
    setContent(editorRef.current.innerHTML);
    setShowTableMenu(false);
   
    // Add click event listener to the new table
    setTimeout(() => {
      const table = document.getElementById(tableId);
      if (table) {
        // Add right-click and ctrl+click event listeners
        table.addEventListener('mousedown', (e) => handleTableClick(tableId, e));
        table.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          handleTableClick(tableId, e);
        });
       
        // Add hover effects to cells
        const cells = table.querySelectorAll('td, th');
        cells.forEach(cell => {
          cell.addEventListener('mouseenter', () => {
            if (cell.tagName === 'TD') {
              cell.style.backgroundColor = '#f8fafc';
            }
          });
          cell.addEventListener('mouseleave', () => {
            if (cell.tagName === 'TD') {
              cell.style.backgroundColor = 'transparent';
            }
          });
        });
      }
    }, 100);
  };
  // Handle table click for selection - now only on right-click or ctrl+click
  const handleTableClick = (tableId, event) => {
    // Only show controls on right-click or ctrl+click, not regular clicks
    if (event.button === 2 || event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const table = document.getElementById(tableId);
      if (table) {
        // Remove selection from other tables
        document.querySelectorAll('.editableTable').forEach(tbl => {
          tbl.style.outline = 'none';
        });
       
        // Select current table
        table.style.outline = '3px solid #6366f1';
        setSelectedTable(tableId);
        setShowTableControls(true);
      }
    }
  };
  // Add row to table
  const addTableRow = () => {
    if (!selectedTable) return;
   
    const table = document.getElementById(selectedTable);
    if (table) {
      const tbody = table.querySelector('tbody');
      const headerCols = table.querySelectorAll('thead th').length;
      const colWidth = Math.floor(100 / headerCols);
      const newRow = document.createElement('tr');
      newRow.style.borderBottom = '1px solid #e2e8f0';
     
      for (let i = 0; i < headerCols; i++) {
        const cell = document.createElement('td');
        cell.contentEditable = true;
        cell.textContent = `New Cell ${i + 1}`;
        cell.style.cssText = `
          width: ${colWidth}%;
          max-width: ${colWidth}%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          min-height: 40px;
          font-size: 13px;
          transition: background-color 0.2s ease;
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-all;
          vertical-align: top;
          box-sizing: border-box;
          overflow: hidden;
        `;
       
        // Add hover effect
        cell.addEventListener('mouseenter', () => {
          cell.style.backgroundColor = '#f8fafc';
        });
        cell.addEventListener('mouseleave', () => {
          cell.style.backgroundColor = 'transparent';
        });
       
        newRow.appendChild(cell);
      }
     
      tbody.appendChild(newRow);
      setContent(editorRef.current.innerHTML);
    }
  };
  // Add column to table
  const addTableColumn = () => {
    if (!selectedTable) return;
   
    const table = document.getElementById(selectedTable);
    if (table) {
      const currentCols = table.querySelectorAll('thead th').length;
      const newColWidth = Math.floor(100 / (currentCols + 1));
     
      // Update existing column widths
      table.querySelectorAll('th, td').forEach(cell => {
        cell.style.width = `${newColWidth}%`;
        cell.style.maxWidth = `${newColWidth}%`;
      });
     
      // Add header cell
      const headerRow = table.querySelector('thead tr');
      const newHeader = document.createElement('th');
      newHeader.contentEditable = true;
      newHeader.textContent = 'New Header';
      newHeader.style.cssText = `
        width: ${newColWidth}%;
        max-width: ${newColWidth}%;
        padding: 8px 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-weight: 600;
        text-align: left;
        font-size: 13px;
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-all;
        box-sizing: border-box;
        overflow: hidden;
      `;
      headerRow.appendChild(newHeader);
     
      // Add cells to each row
      const bodyRows = table.querySelectorAll('tbody tr');
      bodyRows.forEach((row, index) => {
        const newCell = document.createElement('td');
        newCell.contentEditable = true;
        newCell.textContent = `Cell ${index + 1}`;
        newCell.style.cssText = `
          width: ${newColWidth}%;
          max-width: ${newColWidth}%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          min-height: 40px;
          font-size: 13px;
          transition: background-color 0.2s ease;
          word-wrap: break-word;
          overflow-wrap: break-word;
          word-break: break-all;
          vertical-align: top;
          box-sizing: border-box;
          overflow: hidden;
        `;
       
        // Add hover effect
        newCell.addEventListener('mouseenter', () => {
          newCell.style.backgroundColor = '#f8fafc';
        });
        newCell.addEventListener('mouseleave', () => {
          newCell.style.backgroundColor = 'transparent';
        });
       
        row.appendChild(newCell);
      });
     
      setContent(editorRef.current.innerHTML);
    }
  };
  // Remove table
  const removeTable = () => {
    if (!selectedTable) return;
   
    const table = document.getElementById(selectedTable);
    if (table && confirm('Remove this table?')) {
      table.remove();
      setSelectedTable(null);
      setShowTableControls(false);
      setContent(editorRef.current.innerHTML);
    }
  };
  // Table style functions
  const toggleTableBorders = () => {
    if (!selectedTable) return;
   
    const table = document.getElementById(selectedTable);
    if (table) {
      const currentBorder = table.style.border;
      if (currentBorder.includes('2px solid #6366f1')) {
        table.style.border = '1px solid #e2e8f0';
        table.querySelectorAll('td, th').forEach(cell => {
          cell.style.border = '1px solid #f3f4f6';
        });
      } else {
        table.style.border = '2px solid #6366f1';
        table.querySelectorAll('td, th').forEach(cell => {
          cell.style.border = '1px solid #e2e8f0';
        });
      }
      setContent(editorRef.current.innerHTML);
    }
  };
  const toggleTableStripes = () => {
    if (!selectedTable) return;
   
    const table = document.getElementById(selectedTable);
    if (table) {
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach((row, index) => {
        if (index % 2 === 1) {
          const currentBg = row.style.backgroundColor;
          if (currentBg === 'rgb(248, 250, 252)' || currentBg === '#f8fafc') {
            row.style.backgroundColor = 'transparent';
          } else {
            row.style.backgroundColor = '#f8fafc';
          }
        }
      });
      setContent(editorRef.current.innerHTML);
    }
  };
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
          class="editableImage"
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
      document.querySelectorAll('.editableImage').forEach(image => {
        image.style.border = '2px solid transparent';
      });
     
      // Select current image
      img.style.border = '2px solid #6366f1';
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
        class="editableImage"
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
 
  // Save to database as course file
  // Update the saveDocument function in your DocumentEditorPage.jsx
// Update the saveDocument function in your DocumentEditorPage.jsx
const saveDocument = async () => {
  if (!selectedCourseId || !selectedCategoryId || !fileName) {
    alert('Please select course, category, and enter a file name');
    return;
  }

  try {
    const htmlContent = editorRef.current.innerHTML;
    
    // Show progress
    console.log('Starting document save...');
    
    try {
      // Try simple PDF first (much smaller and faster)
      console.log('Generating simple PDF...');
      const data = await uploadDocumentAsSimplePDF(selectedCategoryId, htmlContent, fileName);
      setCourseFileId(data.id);
      alert('Document saved as PDF successfully!');
      
    } catch (pdfError) {
      console.log('Simple PDF failed, trying HTML:', pdfError.message);
      
      try {
        // Try complex PDF
        console.log('Trying complex PDF...');
        const data = await uploadDocumentAsPDF(selectedCategoryId, htmlContent, fileName);
        setCourseFileId(data.id);
        alert('Document saved as PDF successfully!');
        
      } catch (complexPdfError) {
        console.log('Complex PDF failed, using HTML:', complexPdfError.message);
        
        // Fallback to HTML
        const htmlData = await uploadDocumentAsHTML(selectedCategoryId, htmlContent, fileName);
        setCourseFileId(htmlData.id);
        alert('Document saved as HTML successfully!');
      }
    }
    
  } catch (error) {
    console.error('Error saving document:', error);
    alert('Error saving document: ' + error.message);
  }
};
  // Export functions (keep for export menu)
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
        .editableImage {
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
  // Generate PDF
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
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
                .editableImage {
                    cursor: default !important;
                    border: none !important;
                }
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    .document-header {
                        background: #6366f1 !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="document-header">
                <div class="document-title">${fileName}</div>
                <div>Professional Document</div>
                <div>${new Date().toLocaleDateString(language)} • ${languages[language].name}</div>
                <div>${wordCount} words • ${charCount} characters</div>
            </div>
           
            <div>${content}</div>
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
    } catch (error) {
      alert('PDF generation failed. Please try using your browser\'s print function and save as PDF.');
    }
  };
  // Generate DOCX
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
            body {
              font-family: ${fontFamily}, serif;
              font-size: ${fontSize}px;
              line-height: ${lineHeight};
              color: ${textColor};
              direction: ${textDirection};
              white-space: pre-wrap;
              margin: 0;
              padding: 20px;
            }
            .editableImage {
              cursor: default !important;
              border: none !important;
            }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #6366f1;">
            <div style="font-size: ${fontSize + 8}px; font-weight: bold; color: #6366f1; margin-bottom: 10px;">${fileName}</div>
            <div style="font-size: ${fontSize - 1}px; color: #666;">Document created on ${new Date().toLocaleDateString(language)}</div>
          </div>
          <div>${content}</div>
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
 
  // Editor styles - removed color from here as it should only apply to new text
  const getEditorStyles = () => ({
    lineHeight: lineHeight,
    backgroundColor: backgroundColor,
    direction: textDirection
    // Removed color from here to prevent applying to all content
  });
 
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      color: '#0f172a',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style>{`
        .editor {
          font-size: 16px;
          font-family: Arial, sans-serif;
        }
        .editor strong, .editor b {
          font-weight: 900 !important;
        }
      `}</style>
      {/* Background decorative elements */}
      <div style={{
        content: '',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: -1
      }}></div>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '20px 24px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>{fileName}</h1>
            <div style={{
              fontSize: '14px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '6px',
              fontWeight: 500
            }}>
              <Globe size={14} />
              <span>{languages[language].name}</span>
              <span>•</span>
              <span>{textDirection.toUpperCase()}</span>
              <span>•</span>
              <span>RICH TEXT</span>
            </div>
          </div>
         
          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setShowOpenMenu(!showOpenMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  transition: 'all 150ms ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: 'white'
                }}
              >
                <Upload size={16} />
                Open
              </button>
              {showOpenMenu && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  zIndex: 1000,
                  minWidth: '220px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  animation: 'dropdownSlide 0.2s ease-out'
                }}>
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowOpenMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      transition: 'all 150ms ease-in-out',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <FileText size={14} />
                    Local File
                  </button>
                  <button
                    onClick={async () => {
                      const id = prompt('Enter Document ID');
                      if (id) {
                        await loadDocument(id);
                        setShowOpenMenu(false);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      transition: 'all 150ms ease-in-out'
                    }}
                  >
                    <Cloud size={14} /> {/* Assuming lucide has Cloud, else use Globe */}
                    Cloud Document
                  </button>
                </div>
              )}
            </div>
           
            <button
              onClick={saveDocument}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 150ms ease-in-out',
                position: 'relative',
                overflow: 'hidden',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white'
              }}
            >
              <Save size={16} />
              Save
            </button>
           
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  transition: 'all 150ms ease-in-out',
                  position: 'relative',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                  color: 'white'
                }}
              >
                <Download size={16} />
                Export
              </button>
              {showExportMenu && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  zIndex: 1000,
                  minWidth: '220px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <button
                    onClick={() => handleExport('txt')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      transition: 'all 150ms ease-in-out',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <FileText size={14} />
                    Plain Text (.txt)
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      transition: 'all 150ms ease-in-out',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <FileDown size={14} />
                    PDF Document (.pdf)
                  </button>
                  <button
                    onClick={() => handleExport('docx')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      transition: 'all 150ms ease-in-out',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <FilePlus size={14} />
                    Word Document (.docx)
                  </button>
                  <button
                    onClick={() => handleExport('html')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      transition: 'all 150ms ease-in-out',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <Globe2 size={14} />
                    Web Page (.html)
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      transition: 'all 150ms ease-in-out'
                    }}
                  >
                    <Database size={14} />
                    Data Format (.json)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
       
        {/* Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
          padding: '16px 0',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          borderRadius: '8px',
          marginTop: '16px'
        }}>
          {/* Formatting */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '6px',
            background: 'transparent',
            marginRight: '8px',
            transition: 'all 150ms ease-in-out'
          }}>
            <button
              onClick={toggleBold}
              style={{
                padding: '10px 12px',
                border: 'none',
                backgroundColor: isBold ? '#6366f1' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: isBold ? 'white' : '#0f172a',
                transition: 'all 150ms ease-in-out',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
                fontSize: '13px',
                boxShadow: isBold ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none'
              }}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              onClick={toggleUnderline}
              style={{
                padding: '10px 12px',
                border: 'none',
                backgroundColor: isUnderline ? '#6366f1' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: isUnderline ? 'white' : '#0f172a',
                transition: 'all 150ms ease-in-out',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
                fontSize: '13px',
                boxShadow: isUnderline ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none'
              }}
              title="Underline"
            >
              <Underline size={16} />
            </button>
            <button
              onClick={toggleHighlight}
              style={{
                padding: '10px 12px',
                border: 'none',
                backgroundColor: isHighlight ? '#6366f1' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: isHighlight ? 'white' : '#0f172a',
                transition: 'all 150ms ease-in-out',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
                fontSize: '13px',
                boxShadow: isHighlight ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none'
              }}
              title="Highlight"
            >
              <Highlighter size={16} />
            </button>
          </div>
         
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '6px',
            background: 'transparent',
            marginRight: '8px',
            transition: 'all 150ms ease-in-out'
          }}>
            <button
              onClick={() => handleTextAlign('left')}
              style={{
                padding: '10px 12px',
                border: 'none',
                backgroundColor: textAlign === 'left' ? '#6366f1' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: textAlign === 'left' ? 'white' : '#0f172a',
                transition: 'all 150ms ease-in-out',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
                fontSize: '13px'
              }}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            <button
              onClick={() => handleTextAlign('center')}
              style={{
                padding: '10px 12px',
                border: 'none',
                backgroundColor: textAlign === 'center' ? '#6366f1' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: textAlign === 'center' ? 'white' : '#0f172a',
                transition: 'all 150ms ease-in-out',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
                fontSize: '13px'
              }}
              title="Center"
            >
              <AlignCenter size={16} />
            </button>
            <button
              onClick={() => handleTextAlign('right')}
              style={{
                padding: '10px 12px',
                border: 'none',
                backgroundColor: textAlign === 'right' ? '#6366f1' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: textAlign === 'right' ? 'white' : '#0f172a',
                transition: 'all 150ms ease-in-out',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
                fontSize: '13px'
              }}
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
          </div>
         
          {/* Table insertion */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '6px',
            background: 'transparent',
            marginRight: '8px',
            transition: 'all 150ms ease-in-out'
          }}>
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setShowTableMenu(!showTableMenu)}
                style={{
                  padding: '10px 12px',
                  border: 'none',
                  backgroundColor: showTableMenu ? '#6366f1' : 'transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: showTableMenu ? 'white' : '#0f172a',
                  transition: 'all 150ms ease-in-out',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500,
                  fontSize: '13px'
                }}
                title="Insert Table"
              >
                <Table size={16} />
              </button>
              {showTableMenu && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  zIndex: 1000,
                  minWidth: '280px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <div style={{padding: '16px'}}>
                    <div style={{marginBottom: '16px', fontSize: '14px', fontWeight: '600', color: '#374151'}}>
                      Create Table
                    </div>
                   
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                      <div>
                        <label style={{display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#6b7280'}}>
                          Rows: {tableRows}
                        </label>
                        <input
                          type="range"
                          min="2"
                          max="10"
                          value={tableRows}
                          onChange={(e) => setTableRows(parseInt(e.target.value))}
                          style={{
                            width: '100%',
                            height: '8px',
                            borderRadius: '4px',
                            background: 'linear-gradient(90deg, #f1f5f9 0%, #a5b4fc 100%)',
                            outline: 'none',
                            transition: 'all 150ms ease-in-out',
                            WebkitAppearance: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#6b7280'}}>
                          Columns: {tableCols}
                        </label>
                        <input
                          type="range"
                          min="2"
                          max="8"
                          value={tableCols}
                          onChange={(e) => setTableCols(parseInt(e.target.value))}
                          style={{
                            width: '100%',
                            height: '8px',
                            borderRadius: '4px',
                            background: 'linear-gradient(90deg, #f1f5f9 0%, #a5b4fc 100%)',
                            outline: 'none',
                            transition: 'all 150ms ease-in-out',
                            WebkitAppearance: 'none'
                          }}
                        />
                      </div>
                    </div>
                   
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px'}}>
                      <button
                        onClick={() => createTable(tableRows, tableCols)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 600,
                          fontFamily: 'inherit',
                          transition: 'all 150ms ease-in-out',
                          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                          color: 'white',
                          justifyContent: 'center'
                        }}
                      >
                        <Table size={12} />
                        Create Table
                      </button>
                      <button
                        onClick={() => createTable(2, 2)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 600,
                          fontFamily: 'inherit',
                          transition: 'all 150ms ease-in-out',
                          background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                          color: 'white',
                          justifyContent: 'center'
                        }}
                      >
                        <Grid3x3 size={12} />
                        Quick 2×2
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
         
          {/* Image insertion */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '6px',
            background: 'transparent',
            marginRight: '8px',
            transition: 'all 150ms ease-in-out'
          }}>
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setShowImageMenu(!showImageMenu)}
                style={{
                  padding: '10px 12px',
                  border: 'none',
                  backgroundColor: showImageMenu ? '#6366f1' : 'transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: showImageMenu ? 'white' : '#0f172a',
                  transition: 'all 150ms ease-in-out',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500,
                  fontSize: '13px'
                }}
                title="Insert Image"
              >
                <Image size={16} />
              </button>
              {showImageMenu && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  zIndex: 1000,
                  minWidth: '220px'
                }}>
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      transition: 'all 150ms ease-in-out',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                  >
                    <Upload size={14} />
                    Upload Image
                  </button>
                  <button
                    onClick={insertImageURL}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#0f172a',
                      transition: 'all 150ms ease-in-out'
                    }}
                  >
                    <Link size={14} />
                    Image URL
                  </button>
                </div>
              )}
            </div>
          </div>
         
          {/* Font Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '6px',
            background: 'transparent',
            marginRight: '8px',
            transition: 'all 150ms ease-in-out'
          }}>
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setShowFontMenu(!showFontMenu)}
                style={{
                  padding: '10px 12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#0f172a',
                  transition: 'all 150ms ease-in-out',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500,
                  fontSize: '13px'
                }}
                title="Font Settings"
              >
                <Type size={16} />
                <span style={{fontSize: '12px', marginLeft: '4px'}}>{fontSize}px</span>
              </button>
              {showFontMenu && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  zIndex: 1000,
                  minWidth: '220px'
                }}>
                  <div style={{padding: '12px 16px', borderBottom: '1px solid #e5e7eb'}}>
                    <div style={{marginBottom: '8px', fontSize: '12px', fontWeight: '600'}}>Font Size</div>
                    <input
                      type="range"
                      min="10"
                      max="32"
                      value={fontSize}
                      onChange={(e) => changeFontSize(parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        height: '8px',
                        borderRadius: '4px',
                        background: 'linear-gradient(90deg, #f1f5f9 0%, #a5b4fc 100%)',
                        outline: 'none',
                        transition: 'all 150ms ease-in-out',
                        WebkitAppearance: 'none'
                      }}
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
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          backgroundColor: fontFamily === font ? '#eef2ff' : 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#0f172a',
                          transition: 'all 150ms ease-in-out',
                          fontFamily: font
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
                style={{
                  padding: '10px 12px',
                  border: 'none',
                  backgroundColor: textColor,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: textColor === '#000000' || textColor === '#2c3e50' || textColor === '#34495e' ? '#ffffff' : '#000000',
                  transition: 'all 150ms ease-in-out',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500,
                  fontSize: '13px'
                }}
                title="Text Color"
              >
                <Palette size={16} />
              </button>
              {showColorMenu && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  zIndex: 1000,
                  minWidth: '320px'
                }}>
                  <div style={{padding: '8px 16px', borderBottom: '1px solid #e5e7eb', fontSize: '12px', fontWeight: '600'}}>
                    Text Color - Current: {colorNames[textColor] || textColor}
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    gap: '8px',
                    padding: '16px',
                    background: '#f8fafc',
                    margin: '8px 0'
                  }}>
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => changeTextColor(color)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          border: textColor === color ? '2px solid #6366f1' : '2px solid #e2e8f0',
                          transition: 'all 150ms ease-in-out',
                          position: 'relative',
                          backgroundColor: color,
                          boxShadow: textColor === color ? '0 0 0 2px rgba(99, 102, 241, 0.3)' : 'none'
                        }}
                        title={colorNames[color] || color}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.15)';
                          e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = textColor === color ? '0 0 0 2px rgba(99, 102, 241, 0.3)' : 'none';
                        }}
                      />
                    ))}
                  </div>
                  <div style={{padding: '12px 16px', borderTop: '1px solid #e5e7eb'}}>
                    <label style={{display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#6b7280'}}>
                      Custom Color
                    </label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => changeTextColor(e.target.value)}
                      style={{
                        width: '100%',
                        height: '44px',
                        border: '2px solid rgba(226, 232, 240, 0.8)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 150ms ease-in-out'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setShowHighlightMenu(!showHighlightMenu)}
                style={{
                  padding: '10px 12px',
                  border: 'none',
                  backgroundColor: highlightColor,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#000000',
                  transition: 'all 150ms ease-in-out',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500,
                  fontSize: '13px'
                }}
                title="Highlight Color"
              >
                <Highlighter size={16} />
              </button>
              {showHighlightMenu && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  zIndex: 1000,
                  minWidth: '320px'
                }}>
                  <div style={{padding: '8px 16px', borderBottom: '1px solid #e5e7eb', fontSize: '12px', fontWeight: '600'}}>
                    Highlight Color - Current: {colorNames[highlightColor] || highlightColor}
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    gap: '8px',
                    padding: '16px',
                    background: '#f8fafc',
                    margin: '8px 0'
                  }}>
                    {highlightColors.map(color => (
                      <button
                        key={color}
                        onClick={() => changeHighlightColor(color)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          border: highlightColor === color ? '2px solid #6366f1' : '2px solid #e2e8f0',
                          transition: 'all 150ms ease-in-out',
                          position: 'relative',
                          backgroundColor: color,
                          boxShadow: highlightColor === color ? '0 0 0 2px rgba(99, 102, 241, 0.3)' : 'none'
                        }}
                        title={colorNames[color] || color}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.15)';
                          e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = highlightColor === color ? '0 0 0 2px rgba(99, 102, 241, 0.3)' : 'none';
                        }}
                      />
                    ))}
                  </div>
                  <div style={{padding: '12px 16px', borderTop: '1px solid #e5e7eb'}}>
                    <label style={{display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#6b7280'}}>
                      Custom Highlight
                    </label>
                    <input
                      type="color"
                      value={highlightColor}
                      onChange={(e) => changeHighlightColor(e.target.value)}
                      style={{
                        width: '100%',
                        height: '44px',
                        border: '2px solid rgba(226, 232, 240, 0.8)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 150ms ease-in-out'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
         
          {/* Language & Direction Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '6px',
            background: 'transparent',
            marginRight: '8px',
            transition: 'all 150ms ease-in-out'
          }}>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '13px',
                padding: '8px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 150ms ease-in-out'
              }}
            >
              {Object.entries(languages).map(([code, lang]) => (
                <option key={code} value={code}>{lang.name}</option>
              ))}
            </select>
           
            <button
              onClick={toggleTextDirection}
              style={{
                padding: '10px 12px',
                border: 'none',
                backgroundColor: textDirection === 'rtl' ? '#6366f1' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: textDirection === 'rtl' ? 'white' : '#0f172a',
                transition: 'all 150ms ease-in-out',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
                fontSize: '13px'
              }}
              title={`Switch to ${textDirection === 'ltr' ? 'RTL' : 'LTR'}`}
            >
              <Languages size={16} />
              <span style={{fontSize: '11px', marginLeft: '4px'}}>{textDirection.toUpperCase()}</span>
            </button>
          </div>
         
          {/* Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            borderRadius: '6px',
            background: 'transparent',
            marginRight: '8px',
            transition: 'all 150ms ease-in-out'
          }}>
            <button
              onClick={() => setSearchVisible(!searchVisible)}
              style={{
                padding: '10px 12px',
                border: 'none',
                backgroundColor: searchVisible ? '#6366f1' : 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: searchVisible ? 'white' : '#0f172a',
                transition: 'all 150ms ease-in-out',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
                fontSize: '13px'
              }}
              title="Search"
            >
              <Search size={16} />
            </button>
          </div>
         
          {/* Zoom */}
          <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <button
              onClick={() => setZoom(Math.max(50, zoom - 25))}
              style={{
                padding: '10px 12px',
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#0f172a',
                transition: 'all 150ms ease-in-out',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
                fontSize: '13px'
              }}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span style={{fontSize: '13px', minWidth: '50px', textAlign: 'center'}}>{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              style={{
                padding: '10px 12px',
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#0f172a',
                transition: 'all 150ms ease-in-out',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
                fontSize: '13px'
              }}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>
      </div>
     
      {/* Main Content */}
      <div style={{display: 'flex', minHeight: 'calc(100vh - 320px)', margin: 0}}>
        {/* Sidebar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(226, 232, 240, 0.8)',
          transition: 'all 350ms ease-in-out',
          overflow: 'hidden',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          width: sidebarOpen ? '320px' : '80px',
          padding: sidebarOpen ? '24px' : '16px'
        }}>
          <div style={{
            content: '',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.04) 0%, rgba(139, 92, 246, 0.04) 100%)',
            pointerEvents: 'none'
          }}></div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid rgba(226, 232, 240, 0.6)'
          }}>
            <h3 style={{
              fontWeight: 700,
              fontSize: '18px',
              margin: 0,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: sidebarOpen ? 'block' : 'none'
            }}>Document Tools</h3>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                padding: '10px 12px',
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#0f172a',
                transition: 'all 150ms ease-in-out',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500,
                fontSize: '13px'
              }}
            >
              {sidebarOpen ? <RotateCcw size={16} /> : <RotateCw size={16} />}
            </button>
          </div>
         
          {/* Document Name at Top */}
          {sidebarOpen && (
            <div style={{marginBottom: '28px', position: 'relative'}}>
              <div style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '16px',
                paddingLeft: '8px',
                position: 'relative'
              }}>
                <div style={{
                  content: '',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '16px',
                  background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                  borderRadius: '2px'
                }}></div>
                Document Info
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '20px',
                textAlign: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={16} style={{marginRight: '8px'}} />
                  {fileName}
                </div>
                <div style={{
                  fontSize: '13px',
                  opacity: 0.9,
                  fontWeight: 500
                }}>
                  {wordCount} words • {languages[language].name}
                </div>
              </div>
             
              <div style={{marginBottom: '16px'}}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569'
                }}>
                  Document Name
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  style={{
                    width: '90%',
                    padding: '14px 16px',
                    border: '2px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 150ms ease-in-out',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder="Enter document name..."
                />
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569'
                }}>
                  Select Course
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 150ms ease-in-out',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <option value="">Choose a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div style={{marginBottom: '16px'}}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569'
                }}>
                  Select Category
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  disabled={!selectedCourseId}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 150ms ease-in-out',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <option value="">Choose a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
         
          {/* Editor Area */}
        </div>
       
        <div style={{flex: 1, padding: '32px', position: 'relative', background: 'transparent'}}>
          {/* Table Control Panel */}
          {showTableControls && selectedTable && (
            <div style={{
              position: 'absolute',
              top: '32px',
              left: '32px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              zIndex: 100,
              minWidth: '350px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '2px solid rgba(226, 232, 240, 0.6)'
              }}>
                <h4 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Table size={16} />
                  Table Controls
                  <span style={{
                    fontSize: '12px',
                    color: '#64748b',
                    fontWeight: 400,
                    marginLeft: '8px'
                  }}>
                    (Right-click or Ctrl+click table to open)
                  </span>
                </h4>
                <button
                  onClick={() => {
                    setShowTableControls(false);
                    setSelectedTable(null);
                    // Remove selection outline from all tables
                    document.querySelectorAll('.editableTable').forEach(table => {
                      table.style.outline = 'none';
                    });
                  }}
                  style={{
                    padding: '8px',
                    border: 'none',
                    background: 'rgba(248, 250, 252, 0.8)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'all 150ms ease-in-out',
                    color: '#64748b'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
             
              {/* Table Structure Controls */}
              <div style={{
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(248, 250, 252, 0.6)',
                borderRadius: '8px',
                border: '1px solid rgba(226, 232, 240, 0.6)'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Rows size={14} />
                  Table Structure
                </label>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px'}}>
                  <button
                    onClick={addTableRow}
                    style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-in-out',
                      fontWeight: 600,
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      justifyContent: 'center'
                    }}
                  >
                    <Plus size={12} />
                    Add Row
                  </button>
                  <button
                    onClick={addTableColumn}
                    style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-in-out',
                      fontWeight: 600,
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      justifyContent: 'center'
                    }}
                  >
                    <Columns size={12} />
                    Add Column
                  </button>
                </div>
              </div>
              {/* Table Style Controls */}
              <div style={{
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(248, 250, 252, 0.6)',
                borderRadius: '8px',
                border: '1px solid rgba(226, 232, 240, 0.6)'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Palette size={14} />
                  Table Styles
                </label>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px'}}>
                  <button
                    onClick={toggleTableBorders}
                    style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-in-out',
                      fontWeight: 600,
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      justifyContent: 'center'
                    }}
                  >
                    <Grid3x3 size={12} />
                    Toggle Borders
                  </button>
                  <button
                    onClick={toggleTableStripes}
                    style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-in-out',
                      fontWeight: 600,
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      justifyContent: 'center'
                    }}
                  >
                    <MoreHorizontal size={12} />
                    Toggle Stripes
                  </button>
                </div>
              </div>
              {/* Quick Format Controls */}
              <div style={{
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(248, 250, 252, 0.6)',
                borderRadius: '8px',
                border: '1px solid rgba(226, 232, 240, 0.6)'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Settings size={14} />
                  Quick Formats
                </label>
                <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '6px', marginTop: '12px'}}>
                  <button
                    onClick={() => {
                      if (!selectedTable) return;
                      const table = document.getElementById(selectedTable);
                      if (table) {
                        // Apply professional style
                        table.style.cssText = `
                          width: 100%;
                          max-width: 100%;
                          border-collapse: collapse;
                          margin: 20px 0;
                          border: 1px solid #e2e8f0;
                          background: white;
                          border-radius: 8px;
                          overflow: hidden;
                          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                          table-layout: fixed;
                        `;
                        table.querySelectorAll('thead th').forEach((th, index) => {
                          const colCount = table.querySelectorAll('thead th').length;
                          const colWidth = Math.floor(100 / colCount);
                          th.style.cssText = `
                            width: ${colWidth}%;
                            padding: 12px 16px;
                            background: #f8fafc;
                            border: 1px solid #e2e8f0;
                            font-weight: 600;
                            text-align: left;
                            font-size: 14px;
                            color: #374151;
                            word-wrap: break-word;
                            overflow-wrap: break-word;
                          `;
                        });
                        table.querySelectorAll('tbody td').forEach((td, index) => {
                          const colCount = table.querySelectorAll('thead th').length;
                          const colWidth = Math.floor(100 / colCount);
                          td.style.cssText = `
                            width: ${colWidth}%;
                            padding: 12px 16px;
                            border: 1px solid #f3f4f6;
                            font-size: 14px;
                            color: #374151;
                            word-wrap: break-word;
                            overflow-wrap: break-word;
                            vertical-align: top;
                          `;
                        });
                        setContent(editorRef.current.innerHTML);
                      }
                    }}
                    style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-in-out',
                      fontWeight: 600,
                      color: '#475569'
                    }}
                  >
                    Professional Style
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedTable) return;
                      const table = document.getElementById(selectedTable);
                      if (table) {
                        // Apply minimal style
                        table.style.cssText = `
                          width: 100%;
                          max-width: 100%;
                          border-collapse: collapse;
                          margin: 20px 0;
                          background: white;
                          table-layout: fixed;
                        `;
                        table.querySelectorAll('thead th').forEach((th, index) => {
                          const colCount = table.querySelectorAll('thead th').length;
                          const colWidth = Math.floor(100 / colCount);
                          th.style.cssText = `
                            width: ${colWidth}%;
                            padding: 8px 12px;
                            border-bottom: 2px solid #374151;
                            font-weight: 600;
                            text-align: left;
                            font-size: 14px;
                            color: #374151;
                            background: transparent;
                            word-wrap: break-word;
                            overflow-wrap: break-word;
                          `;
                        });
                        table.querySelectorAll('tbody td').forEach((td, index) => {
                          const colCount = table.querySelectorAll('thead th').length;
                          const colWidth = Math.floor(100 / colCount);
                          td.style.cssText = `
                            width: ${colWidth}%;
                            padding: 8px 12px;
                            border-bottom: 1px solid #e5e7eb;
                            font-size: 14px;
                            color: #374151;
                            word-wrap: break-word;
                            overflow-wrap: break-word;
                            vertical-align: top;
                          `;
                        });
                        setContent(editorRef.current.innerHTML);
                      }
                    }}
                    style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-in-out',
                      fontWeight: 600,
                      color: '#475569'
                    }}
                  >
                    Minimal Style
                  </button>
                </div>
              </div>
              {/* Action Buttons */}
              <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
                <button
                  onClick={() => {
                    if (!selectedTable) return;
                    const table = document.getElementById(selectedTable);
                    if (table) {
                      // Reset to default style
                      table.style.cssText = `
                        width: 100%;
                        max-width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                        border: 2px solid #6366f1;
                        background: white;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        table-layout: fixed;
                      `;
                      table.querySelectorAll('thead th').forEach((th, index) => {
                        const colCount = table.querySelectorAll('thead th').length;
                        const colWidth = Math.floor(100 / colCount);
                        th.style.cssText = `
                          width: ${colWidth}%;
                          padding: 12px 16px;
                          border: 1px solid rgba(255, 255, 255, 0.2);
                          font-weight: 600;
                          text-align: left;
                          font-size: 14px;
                          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                          color: white;
                          word-wrap: break-word;
                          overflow-wrap: break-word;
                        `;
                      });
                      table.querySelectorAll('tbody td').forEach((td, index) => {
                        const colCount = table.querySelectorAll('thead th').length;
                        const colWidth = Math.floor(100 / colCount);
                        td.style.cssText = `
                          width: ${colWidth}%;
                          padding: 12px 16px;
                          border: 1px solid #e2e8f0;
                          min-height: 40px;
                          font-size: 14px;
                          transition: background-color 0.2s ease;
                          word-wrap: break-word;
                          overflow-wrap: break-word;
                          vertical-align: top;
                        `;
                      });
                      setContent(editorRef.current.innerHTML);
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                    color: 'white',
                    fontSize: '13px',
                    padding: '12px 18px',
                    flex: 1,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 150ms ease-in-out',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center'
                  }}
                >
                  <RotateCcw size={12} />
                  Reset Style
                </button>
                <button
                  onClick={removeTable}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    fontSize: '13px',
                    padding: '12px 18px',
                    flex: 1,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 150ms ease-in-out',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={12} />
                  Remove Table
                </button>
              </div>
            </div>
          )}
          {/* Image Control Panel */}
          {showImageControls && selectedImage && (
            <div style={{
              position: 'absolute',
              top: '32px',
              left: '32px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              zIndex: 100,
              minWidth: '320px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '2px solid rgba(226, 232, 240, 0.6)'
              }}>
                <h4 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Image Controls</h4>
                <button
                  onClick={() => {
                    setShowImageControls(false);
                    setSelectedImage(null);
                    // Remove selection border from all images
                    document.querySelectorAll('.editableImage').forEach(img => {
                      img.style.border = '2px solid transparent';
                    });
                  }}
                  style={{
                    padding: '8px',
                    border: 'none',
                    background: 'rgba(248, 250, 252, 0.8)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'all 150ms ease-in-out',
                    color: '#64748b'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
             
              {/* Width Control */}
              <div style={{
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(248, 250, 252, 0.6)',
                borderRadius: '8px',
                border: '1px solid rgba(226, 232, 240, 0.6)'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569'
                }}>
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
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: 'linear-gradient(90deg, #f1f5f9 0%, #a5b4fc 100%)',
                    outline: 'none',
                    transition: 'all 150ms ease-in-out',
                    WebkitAppearance: 'none'
                  }}
                />
                <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
                  <button
                    onClick={() => {
                      setImageSettings(prev => ({...prev, width: 25}));
                      applyImageSettings();
                    }}
                    style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-in-out',
                      fontWeight: 600,
                      color: '#475569'
                    }}
                  >
                    25%
                  </button>
                  <button
                    onClick={() => {
                      setImageSettings(prev => ({...prev, width: 50}));
                      applyImageSettings();
                    }}
                    style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-in-out',
                      fontWeight: 600,
                      color: '#475569'
                    }}
                  >
                    50%
                  </button>
                  <button
                    onClick={() => {
                      setImageSettings(prev => ({...prev, width: 100}));
                      applyImageSettings();
                    }}
                    style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-in-out',
                      fontWeight: 600,
                      color: '#475569'
                    }}
                  >
                    100%
                  </button>
                </div>
              </div>
              {/* Rotation Control */}
              <div style={{
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(248, 250, 252, 0.6)',
                borderRadius: '8px',
                border: '1px solid rgba(226, 232, 240, 0.6)'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569'
                }}>
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
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: 'linear-gradient(90deg, #f1f5f9 0%, #a5b4fc 100%)',
                    outline: 'none',
                    transition: 'all 150ms ease-in-out',
                    WebkitAppearance: 'none'
                  }}
                />
                <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
                  <button
                    onClick={() => {
                      setImageSettings(prev => ({...prev, rotation: -90}));
                      applyImageSettings();
                    }}
                    style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-in-out',
                      fontWeight: 600,
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RotateCcw size={12} />
                  </button>
                  <button
                    onClick={() => {
                      setImageSettings(prev => ({...prev, rotation: 0}));
                      applyImageSettings();
                    }}
                    style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-in-out',
                      fontWeight: 600,
                      color: '#475569'
                    }}
                  >
                    0°
                  </button>
                  <button
                    onClick={() => {
                      setImageSettings(prev => ({...prev, rotation: 90}));
                      applyImageSettings();
                    }}
                    style={{
                      fontSize: '12px',
                      padding: '8px 12px',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease-in-out',
                      fontWeight: 600,
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RotateCw size={12} />
                  </button>
                </div>
              </div>
              {/* Opacity Control */}
              <div style={{
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(248, 250, 252, 0.6)',
                borderRadius: '8px',
                border: '1px solid rgba(226, 232, 240, 0.6)'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569'
                }}>
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
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: 'linear-gradient(90deg, #f1f5f9 0%, #a5b4fc 100%)',
                    outline: 'none',
                    transition: 'all 150ms ease-in-out',
                    WebkitAppearance: 'none'
                  }}
                />
              </div>
              {/* Action Buttons */}
              <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
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
                  style={{
                    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                    color: 'white',
                    fontSize: '13px',
                    padding: '12px 18px',
                    flex: 1,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 150ms ease-in-out',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center'
                  }}
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
                <button
                  onClick={removeSelectedImage}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    fontSize: '13px',
                    padding: '12px 18px',
                    flex: 1,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 150ms ease-in-out',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={12} />
                  Remove
                </button>
              </div>
            </div>
          )}
          {searchVisible && (
            <div style={{
              position: 'absolute',
              top: '32px',
              right: '32px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              zIndex: 100,
              minWidth: '320px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '2px solid rgba(226, 232, 240, 0.6)'
              }}>
                <h4 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Find & Replace</h4>
                <button
                  onClick={() => setSearchVisible(false)}
                  style={{
                    padding: '8px',
                    border: 'none',
                    background: 'rgba(248, 250, 252, 0.8)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'all 150ms ease-in-out',
                    color: '#64748b'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
             
              <div style={{marginBottom: '16px'}}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 150ms ease-in-out',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
             
              {replaceMode && (
                <div style={{marginBottom: '16px'}}>
                  <input
                    type="text"
                    placeholder="Replace with..."
                    value={replaceTerm}
                    onChange={(e) => setReplaceTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid rgba(226, 232, 240, 0.8)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      transition: 'all 150ms ease-in-out',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)'
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleReplace()}
                  />
                </div>
              )}
             
              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  onClick={handleSearch}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    transition: 'all 150ms ease-in-out',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: 'white'
                  }}
                >
                  Find
                </button>
                <button
                  onClick={() => setReplaceMode(!replaceMode)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    transition: 'all 150ms ease-in-out',
                    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                    color: 'white'
                  }}
                >
                  {replaceMode ? 'Hide' : 'Replace'}
                </button>
                {replaceMode && (
                  <button
                    onClick={handleReplace}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontFamily: 'inherit',
                      transition: 'all 150ms ease-in-out',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: 'white'
                    }}
                  >
                    Replace All
                  </button>
                )}
              </div>
            </div>
          )}
         
          {/* Editor Container */}
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              content: '',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)'
            }}></div>
            <div style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              width: `${100 / (zoom / 100)}%`
            }}>
              <div
                ref={editorRef}
                className="editor"
                contentEditable={true}
                onInput={handleContentChange}
                onSelect={handleSelect}
                onClick={(e) => {
                  // Handle table right-click or ctrl+click for controls
                  if (e.target.tagName === 'TABLE' || e.target.closest('table')) {
                    const table = e.target.tagName === 'TABLE' ? e.target : e.target.closest('table');
                    if (table && table.classList.contains('editableTable')) {
                      // Only show controls on right-click or ctrl+click, not regular clicks
                      if (e.button === 2 || e.ctrlKey || e.metaKey) {
                        handleTableClick(table.id, e);
                        return;
                      }
                    }
                  }
                 
                  // Handle image click if it's an image
                  if (e.target.tagName === 'IMG' && e.target.classList.contains('editableImage')) {
                    handleImageClick(e.target.id);
                  } else {
                    // Deselect images and tables if clicking elsewhere
                    setSelectedImage(null);
                    setShowImageControls(false);
                    setSelectedTable(null);
                    setShowTableControls(false);
                   
                    document.querySelectorAll('.editableImage').forEach(img => {
                      img.style.border = '2px solid transparent';
                    });
                    document.querySelectorAll('.editableTable').forEach(table => {
                      table.style.outline = 'none';
                    });
                  }
                }}
                onContextMenu={(e) => {
                  // Handle table right-click for controls
                  if (e.target.tagName === 'TABLE' || e.target.closest('table')) {
                    const table = e.target.tagName === 'TABLE' ? e.target : e.target.closest('table');
                    if (table && table.classList.contains('editableTable')) {
                      e.preventDefault();
                      handleTableClick(table.id, e);
                      return;
                    }
                  }
                }}
                style={{
                  width: '100%',
                  minHeight: '700px',
                  padding: '64px', // Increased padding from 48px to 64px
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  transition: 'all 250ms ease-in-out',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  fontFamily: 'inherit',
                  lineHeight: 1.7,
                  background: 'transparent',
                  ...getEditorStyles()
                }}
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
📐 Click on images to resize and control them
🎨 Change text color to see it apply only to new text!`}
              />
            </div>
          </div>
        </div>
      </div>
     
      {/* Status Bar */}
      <div style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        fontWeight: 500,
        color: '#64748b',
        boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          <span style={{
            padding: '6px 10px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontWeight: 500,
            transition: 'all 150ms ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <FileText size={12} /> Words: {wordCount}
          </span>
          <span style={{
            padding: '6px 10px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontWeight: 500,
            transition: 'all 150ms ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Type size={12} /> Characters: {charCount}
          </span>
          <span style={{
            padding: '6px 10px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontWeight: 500,
            transition: 'all 150ms ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Globe size={12} /> {languages[language].name}
          </span>
          <span style={{
            padding: '6px 10px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontWeight: 500,
            transition: 'all 150ms ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Languages size={12} /> {textDirection.toUpperCase()}
          </span>
          {selectedImage && <span style={{
            padding: '6px 10px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontWeight: 500,
            transition: 'all 150ms ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Image size={12} /> Image Selected
          </span>}
          {selectedTable && <span style={{
            padding: '6px 10px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontWeight: 500,
            transition: 'all 150ms ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Table size={12} /> Table Selected
          </span>}
        </div>
        <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          <span style={{
            padding: '6px 10px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontWeight: 500,
            transition: 'all 150ms ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <ZoomIn size={12} /> Zoom: {zoom}%
          </span>
          <span style={{
            padding: '6px 10px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontWeight: 500,
            transition: 'all 150ms ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Type size={12} /> {fontSize}px {fontFamily}
          </span>
          <span style={{
            padding: '6px 10px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontWeight: 500,
            transition: 'all 150ms ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Palette size={12} /> Color: {colorNames[textColor] || textColor}
          </span>
          <span style={{
            padding: '6px 10px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontWeight: 500,
            transition: 'all 150ms ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {isBold ? <Bold size={12} /> : ''} {isUnderline ? <Underline size={12} /> : ''}
          </span>
          <span style={{
            padding: '6px 10px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontWeight: 500,
            transition: 'all 150ms ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <CheckCircle size={12} /> Ready
          </span>
        </div>
      </div>
     
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.html,.json,.md"
        onChange={handleFileUpload}
        style={{display: 'none'}}
      />
     
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{display: 'none'}}
      />
    </div>
  );
};
export default DocumentEditorPage;