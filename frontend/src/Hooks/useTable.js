// useTable.js - Custom Table Hook
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getConfiguredHeaders,
  getSearchableColumns,
  getRowKey,
  filterData,
  sortData,
  getPaginationData
} from "../Utils/tableUtils";

/**
 * Custom hook for table functionality
 * Handles state management, filtering, sorting, pagination, and row selection
 */
export const useTable = ({
  initialData = [],
  columnConfig = {},
  hiddenColumns = [],
  searchableColumns = [],
  rowsPerPage = 10,
  onRowSelect,
  onSort,
  onSearch,
  onDelete
}) => {
  // State management
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  // Get configured headers (memoize to prevent infinite loops)
  const headers = useMemo(() => 
    getConfiguredHeaders(data, columnConfig, hiddenColumns), 
    [data, columnConfig, hiddenColumns]
  );
  
  const searchCols = useMemo(() => 
    getSearchableColumns(headers, searchableColumns), 
    [headers, searchableColumns]
  );

  // Update data when initialData changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Handle filtering and sorting (use useCallback to stabilize the effect)
  useEffect(() => {
    let temp = [...data];

    // Apply search filter
    if (searchTerm) {
      temp = filterData(temp, searchTerm, searchCols);
      onSearch?.(searchTerm, temp);
    }

    // Apply sorting
    if (sortConfig.key) {
      temp = sortData(temp, sortConfig, headers);
      onSort?.(sortConfig.key, sortConfig.direction, temp);
    }

    setFilteredData(temp);
    setCurrentPage(1); // Reset to first page when data changes
  }, [data, sortConfig, searchTerm]);

  // Pagination data (memoize to prevent recalculation)
  const paginationData = useMemo(() => 
    getPaginationData(filteredData, currentPage, rowsPerPage),
    [filteredData, currentPage, rowsPerPage]
  );

  // Row selection handlers (use useCallback to prevent recreation)
  const toggleRow = useCallback((key) => {
    setSelectedRows(prev => {
      const next = prev.includes(key) 
        ? prev.filter(i => i !== key) 
        : [...prev, key];
      
      // Call callback with selected row keys and actual row data
      const selectedRowData = data.filter(row => 
        next.includes(getRowKey(row, headers))
      );
      onRowSelect?.(next, selectedRowData);
      
      return next;
    });
  }, [data, headers, onRowSelect]);

  const selectAllRows = useCallback(() => {
    const currentRowKeys = paginationData.currentData.map(row => getRowKey(row, headers));
    const newSelected = selectedRows.length === currentRowKeys.length ? [] : currentRowKeys;
    
    setSelectedRows(newSelected);
    
    const selectedRowData = data.filter(row => 
      newSelected.includes(getRowKey(row, headers))
    );
    onRowSelect?.(newSelected, selectedRowData);
  }, [paginationData.currentData, selectedRows.length, headers, data, onRowSelect]);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
    onRowSelect?.([], []);
  }, [onRowSelect]);

  // Delete selected rows
  const deleteSelected = useCallback(() => {
    const toDelete = data.filter(row => 
      selectedRows.includes(getRowKey(row, headers))
    );
    
    if (onDelete) {
      onDelete(toDelete, selectedRows);
    } else {
      // Default behavior: remove from local state
      setData(prev => prev.filter(row => 
        !selectedRows.includes(getRowKey(row, headers))
      ));
    }
    
    clearSelection();
  }, [data, selectedRows, headers, onDelete, clearSelection]);

  // Sorting handlers
  const handleSort = useCallback((key) => {
    const header = headers.find(h => h.key === key);
    if (!header?.sortable) return;

    const direction = (sortConfig.key === key && sortConfig.direction === "asc") 
      ? "desc" 
      : "asc";
    
    setSortConfig({ key, direction });
  }, [headers, sortConfig.key, sortConfig.direction]);

  const getSortIcon = useCallback((key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction;
  }, [sortConfig.key, sortConfig.direction]);

  // Search handler
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Pagination handlers
  const goToPage = useCallback((page) => {
    const validPage = Math.max(1, Math.min(page, paginationData.totalPages));
    setCurrentPage(validPage);
  }, [paginationData.totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [goToPage, currentPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [goToPage, currentPage]);

  // Selection state helpers
  const isRowSelected = useCallback((row) => {
    return selectedRows.includes(getRowKey(row, headers));
  }, [selectedRows, headers]);

  const isAllSelected = useCallback(() => {
    return paginationData.currentData.length > 0 && 
           selectedRows.length === paginationData.currentData.length;
  }, [paginationData.currentData.length, selectedRows.length]);

  const hasSelectedRows = useCallback(() => {
    return selectedRows.length > 0;
  }, [selectedRows.length]);

  // Memoize getRowKey function
  const getRowKeyMemo = useCallback((row) => getRowKey(row, headers), [headers]);

  // Return all state and handlers
  return {
    // Data
    data,
    setData,
    filteredData,
    headers,
    
    // Pagination
    currentPage,
    ...paginationData,
    goToPage,
    nextPage,
    prevPage,
    
    // Selection
    selectedRows,
    toggleRow,
    selectAllRows,
    clearSelection,
    deleteSelected,
    isRowSelected,
    isAllSelected,
    hasSelectedRows,
    
    // Sorting
    sortConfig,
    handleSort,
    getSortIcon,
    
    // Search
    searchTerm,
    handleSearch,
    
    // Utilities
    getRowKey: getRowKeyMemo
  };
};