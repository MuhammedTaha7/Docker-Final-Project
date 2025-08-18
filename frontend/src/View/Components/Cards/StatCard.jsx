import React from 'react';
import styles from '../../../CSS/Components/Cards/StatCard.module.css';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  gradient,
  backgroundColor,
  className = '',
  size = 'default',
  onClick,
  ...props 
}) => {
  const cardStyle = {
    background: gradient || backgroundColor || '#3b82f6',
    ...props.style
  };

  // Build className using CSS modules
  const cardClasses = [
    styles.statCard,
    styles[size], // styles.compact, styles.default, styles.large, styles.xl
    onClick ? styles.statCardClickable : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      style={cardStyle}
      onClick={onClick}
      {...props}
    >
      <div className={styles.statCardContent}>
        <div className={styles.statCardInfo}>
          <p className={styles.statCardTitle}>{title}</p>
          <h2 className={styles.statCardValue}>{value}</h2>
        </div>
        <div className={styles.statCardIcon}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;