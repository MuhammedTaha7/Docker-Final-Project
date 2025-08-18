import React from 'react';
import '../../../CSS/Components/BigCalendar/BaseCard.css';

const BaseCard = ({ 
  title, 
  children, 
  className = '', 
  headerClassName = '', 
  bodyClassName = '',
  headerActions = null,
  onClick = null,
  gradient = null,
  icon = null,
  variant = 'default' // 'default', 'gradient', 'outline'
}) => {
  const cardClasses = `base-card ${variant} ${className}`;
  const headerClasses = `base-card-header ${headerClassName}`;
  const bodyClasses = `base-card-body ${bodyClassName}`;

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      style={gradient ? { background: gradient } : {}}
    >
      {(title || headerActions || icon) && (
        <div className={headerClasses}>
          <div className="base-card-title-section">
            {icon && <div className="base-card-icon">{icon}</div>}
            {title && <h3 className="base-card-title">{title}</h3>}
          </div>
          {headerActions && (
            <div className="base-card-actions">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className={bodyClasses}>
        {children}
      </div>
    </div>
  );
};

export default BaseCard;
