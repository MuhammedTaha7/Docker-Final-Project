// DynamicTable.jsx - Main Table Component
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search
} from "lucide-react";
import { useTable } from "../../../Hooks/useTable";
import { getIconComponent, renderCellContent } from "../../../Utils/tableUtils";
import "../../../CSS/Components/Tables/Table.css";

const DynamicTable = ({
  data = [],
  actionButtons = [],
  showAddButton = true,
  onAddClick,
  title = "Data Management",
  entityType = "records",
  searchPlaceholder = "Search records...",
  addButtonText = "Add Record",
  icon = "default",
  columnConfig = {},
  hiddenColumns = [],
  searchableColumns = [],
  rowsPerPage = 10,
  tableHeight = "auto",
  compact = false,
  onRowSelect,
  onSort,
  onSearch,
  onDelete,
  isSelectable = true,
}) => {
  // Use the custom table hook
  const {
    filteredData,
    headers,
    currentPage,
    totalPages,
    currentData,
    startItem,
    endItem,
    totalItems,
    selectedRows,
    toggleRow,
    selectAllRows,
    deleteSelected,
    isRowSelected,
    isAllSelected,
    hasSelectedRows,
    sortConfig,
    handleSort,
    getSortIcon,
    searchTerm,
    handleSearch,
    goToPage,
    nextPage,
    prevPage,
    getRowKey
  } = useTable({
    initialData: data,
    columnConfig,
    hiddenColumns,
    searchableColumns,
    rowsPerPage,
    onRowSelect,
    onSort,
    onSearch,
    onDelete
  });

  // Get the icon component
  const IconComponent = getIconComponent(icon, entityType);

  // Render sort icon
  const renderSortIcon = (key) => {
    const direction = getSortIcon(key);
    if (!direction) return null;
    return direction === "asc" ? 
      <ChevronUp className="sort-icon" /> : 
      <ChevronDown className="sort-icon" />;
  };

  return (
    <div className="t-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="table-title">
          <IconComponent className="title-icon" />
          <h3>{title}</h3>
          <span className="record-count">
            {filteredData.length} {entityType}
          </span>
        </div>
        
        <div className="table-controls">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="actions">
            {/* --- FIX: Conditionally render the delete button --- */}
            {isSelectable && hasSelectedRows() && (
              <button className="delete-button" onClick={deleteSelected}>
                <Trash2 className="button-icon" />
                Delete ({selectedRows.length})
              </button>
            )}
            {showAddButton && (
              <button className="add-button" onClick={onAddClick}>
                <Plus className="button-icon" />
                {addButtonText}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className={`table-container ${compact ? 'compact' : ''}`}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {isSelectable && (
                  <th className="checkbox-header">
                    <input
                      type="checkbox"
                      checked={isAllSelected()}
                      onChange={selectAllRows}
                      className="header-checkbox"
                    />
                  </th>
                )}
                {headers.map((header, i) => (
                  <th
                    key={i}
                    onClick={() => handleSort(header.key)}
                    className={`sortable-header ${header.sortable ? 'clickable' : ''}`}
                  >
                    <div className="header-content">
                      <span>{header.displayName}</span>
                      {header.sortable && renderSortIcon(header.key)}
                    </div>
                  </th>
                ))}
                {actionButtons.length > 0 && <th>Actions</th>}
              </tr>
            </thead>
            
            <tbody>
              {currentData.map((row) => {
                const rowKey = getRowKey(row);
                return (
                  <tr 
                    key={rowKey} 
                    className={isRowSelected(row) ? "selected-row" : ""}
                  >
                    {isSelectable && (
                      <td>
                        <input
                          type="checkbox"
                          checked={isRowSelected(row)}
                          onChange={() => toggleRow(rowKey)}
                          className="row-checkbox"
                        />
                      </td>
                    )}
                    {headers.map((header, j) => (
                      <td key={j}>
                        {renderCellContent(row, header, columnConfig)}
                      </td>
                    ))}
                    {actionButtons.length > 0 && (
                      <td className="action-buttons">
                        {actionButtons.map((ActionComponent, index) => (
                          <React.Fragment key={index}>
                            {ActionComponent(row)}
                          </React.Fragment>
                        ))}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {currentData.length === 0 && filteredData.length === 0 && (
          <div className="empty-state">
            <IconComponent className="empty-icon" />
            <p>No {entityType} found</p>
            <span>Try adjusting your search or add new {entityType}</span>
          </div>
        )}
      </div>

      {/* Footer with Pagination */}
      {totalPages > 1 && (
        <div className="footer">
          <div className="pagination-info">
            Showing {startItem} to {endItem} of {totalItems} {entityType}
          </div>
          
          <div className="pagination">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1} 
              className="pagination-btn"
            >
              <ChevronLeft className="pagination-icon" />
            </button>
            
            <span className="page-info">
              {currentPage} of {totalPages}
            </span>
            
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages} 
              className="pagination-btn"
            >
              <ChevronRight className="pagination-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;