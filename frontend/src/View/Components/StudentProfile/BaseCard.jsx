import React from 'react';
import './BaseCard.css';

const BaseCard = ({ 
  children, 
  title, 
  icon, 
  variant = 'default', 
  gradient, 
  className = '',
  ...props 
}) => {
  const cardStyle = gradient ? { background: gradient } : {};
  
  return (
    <div 
      className={`base-card ${variant} ${className}`} 
      style={cardStyle}
      {...props}
    >
      {(title || icon) && (
        <div className="base-card-header">
          {icon && <div className="base-card-header-icon">{icon}</div>}
          {title && <h3 className="base-card-title">{title}</h3>}
        </div>
      )}
      <div className="base-card-content">
        {children}
      </div>
    </div>
  );
};

export default BaseCard;