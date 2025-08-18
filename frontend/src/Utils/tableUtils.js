// tableUtils.js - Table Utility Functions
import { 
  Users, GraduationCap, BookOpen, Building, Calendar, Settings, 
  UserCheck, FileText, Mail, Phone, Database,
  // Additional icons for new categories
  MessageSquare, Megaphone, FolderOpen,
  CalendarDays, UserPlus, ScrollText, Layout, Archive,
} from 'lucide-react';

/**
 * Format header names from camelCase or snake_case to proper display names
 */
export const formatHeaderName = (name) => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/_/g, ' ')
    .trim();
};

/**
 * Get the appropriate icon component based on entity type or icon prop
 */
export const getIconComponent = (icon, entityType) => {
  
  const iconMap = {
    // Core icons
    students: Users,
    lecturers: GraduationCap,
    courses: BookOpen,
    departments: Building,
    schedules: Calendar,
    settings: Settings,
    users: UserCheck,
    documents: FileText,
    contacts: Mail,
    phones: Phone,
    default: Database,
    
    // Extended icons for additional categories
    messages: MessageSquare,
    announcements: Megaphone,
    templates: Layout,
    files: FolderOpen,
    'weekly-schedule': CalendarDays,
    'student-requests': UserPlus,
    'academic-records': ScrollText,
    
    // Additional entity types
    requests: MessageSquare,        // For "requests" section in Messages
    announcement: Megaphone,        // For "announcement" section  
    records: Database,              // Generic records entity type
  };

  // Handle string icons
  if (typeof icon === "string") {

    return iconMap[entityType] || iconMap.default;

  }
  
  // Return icon component or fallback to entity type or default
  return icon || iconMap[entityType] || iconMap.default;
};

/**
 * Configure table headers with display names, sortability, and types
 */
export const getConfiguredHeaders = (data, columnConfig = {}, hiddenColumns = []) => {
  if (data.length === 0) return [];
  
  const allHeaders = Object.keys(data[0]);
  const visibleHeaders = allHeaders.filter(header => !hiddenColumns.includes(header));
  
  return visibleHeaders.map(header => ({
    key: header,
    displayName: columnConfig[header]?.displayName || formatHeaderName(header),
    sortable: columnConfig[header]?.sortable !== false,
    searchable: columnConfig[header]?.searchable !== false,
    type: columnConfig[header]?.type || "text"
  }));
};

/**
 * Get searchable columns based on configuration
 */
export const getSearchableColumns = (headers, searchableColumns = []) => {
  if (searchableColumns.length > 0) return searchableColumns;
  return headers.filter(h => h.searchable).map(h => h.key);
};

/**
 * Generate a unique key for table rows
 */
export const getRowKey = (row, headers) => {
  return row.id || row._id || headers.map(h => row[h.key]).join("|");
};

/**
 * Filter data based on search term and searchable columns
 */
export const filterData = (data, searchTerm, searchableColumns) => {
  if (!searchTerm) return data;
  
  return data.filter((row) =>
    searchableColumns.some(col => 
      row[col]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
};

/**
 * Sort data based on sort configuration
 */
export const sortData = (data, sortConfig, headers) => {
  if (!sortConfig.key) return data;

  return [...data].sort((a, b) => {
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    const header = headers.find(h => h.key === sortConfig.key);

    if (header?.type === "number") {
      const numA = parseFloat(valA) || 0;
      const numB = parseFloat(valB) || 0;
      return sortConfig.direction === "asc" ? numA - numB : numB - numA;
    } else if (header?.type === "date") {
      const dateA = new Date(valA);
      const dateB = new Date(valB);
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      const strA = valA?.toString() || "";
      const strB = valB?.toString() || "";
      return sortConfig.direction === "asc"
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    }
  });
};

/**
 * Calculate pagination data
 */
export const getPaginationData = (filteredData, currentPage, rowsPerPage) => {
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage, 
    currentPage * rowsPerPage
  );
  return {
    totalPages,
    currentData,
    startItem: ((currentPage - 1) * rowsPerPage) + 1,
    endItem: Math.min(currentPage * rowsPerPage, filteredData.length),
    totalItems: filteredData.length
  };
};

/**
 * Render cell content based on column type and configuration
 */
export const renderCellContent = (row, header, columnConfig = {}) => {
  const value = row[header.key];
  const config = columnConfig[header.key] || {};

  // Handle null/undefined values
  if (value == null) {
    return <span className="cell-content">-</span>;
  }

  switch (config.type) {
    case "image":
      return <img src={value} alt="avatar" className="avatar" />;
    
    case "email":
      return <a href={`mailto:${value}`} className="cell-link">{value}</a>;
    
    case "phone":
      return <a href={`tel:${value}`} className="cell-link">{value}</a>;
    
    case "url":
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="cell-link">
          {value}
        </a>
      );
    
    case "date":
      return (
        <span className="cell-content">
          {new Date(value).toLocaleDateString()}
        </span>
      );
    
    case "currency":
      return (
        <span className="cell-content">
          ${parseFloat(value || 0).toFixed(2)}
        </span>
      );
    
    case "boolean":
      return (
        <span className={`status-badge ${value ? 'status-active' : 'status-inactive'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      );
    
    case "status":
      return (
        <span className={`status-badge status-${value?.toLowerCase()}`}>
          {value}
        </span>
      );
    
    case "number":
      return (
        <span className="cell-content">
          {parseFloat(value || 0).toFixed(1)}
        </span>
      );
    
    case "custom":
      return config.render ? config.render(value, row) : (
        <span className="cell-content">{String(value)}</span>
      );
    
    default:
      // Auto-detect images
      if (header.key.toLowerCase().includes("photo") || 
          header.key.toLowerCase().includes("image")) {
        return <img src={value} alt="avatar" className="avatar" />;
      }
      
      // Handle different value types safely
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          // Handle arrays - join them or show count
          return (
            <span className="cell-content">
              {value.length > 0 ? value.join(', ') : 'Empty'}
            </span>
          );
        } else {
          // Handle objects - show specific properties or indicate it's an object
          return (
            <span className="cell-content">
              {Object.keys(value).length} properties
            </span>
          );
        }
      }
      
      // Handle primitives (string, number, boolean)
      return <span className="cell-content">{String(value)}</span>;
  }
};