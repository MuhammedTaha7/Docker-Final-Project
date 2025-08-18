// 📁 src/components/Modal/Modal.jsx
import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium', // small, medium, large, fullscreen
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer = null,
  variant = 'default' // default, glass, dark, colorful
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const modalClasses = [
    styles.modalContent,
    styles[`modal${size.charAt(0).toUpperCase() + size.slice(1)}`],
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`]
  ].join(' ');

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={modalClasses}>
        {/* Decorative gradient border */}
        <div className={styles.gradientBorder}></div>
        
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.titleContainer}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <div className={styles.titleUnderline}></div>
          </div>
          {showCloseButton && (
            <button className={styles.modalCloseBtn} onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <div className={styles.bodyContent}>
            {children}
          </div>
        </div>

        {/* Footer */}
        {footer && (
          <div className={styles.modalFooter}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;