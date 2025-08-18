import React from 'react';
import './BaseList.css';

const BaseList = ({ 
  title,
  items = [],
  renderItem,
  headerActions = null,
  className = '',
  itemClassName = '',
  emptyMessage = "No items to display",
  showHeader = true,
  variant = 'default' // 'default', 'compact', 'cards'
}) => {
  const listClasses = `base-list ${variant} ${className}`;

  return (
    <div className={listClasses}>
      {showHeader && (title || headerActions) && (
        <div className="base-list-header">
          {title && <h3 className="base-list-title">{title}</h3>}
          {headerActions && (
            <div className="base-list-actions">
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      <div className="base-list-container">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className={`base-list-item ${itemClassName}`}>
              {renderItem(item, index)}
            </div>
          ))
        ) : (
          <div className="base-list-empty">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseList;