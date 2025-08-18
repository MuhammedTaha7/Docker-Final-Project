import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// CSS Module styles
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
    backdropFilter: 'blur(4px)'
  },
  overlayOpen: {
    opacity: 1,
    visibility: 'visible'
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    position: 'relative',
    maxWidth: '95vw',
    maxHeight: '95vh',
    overflow: 'hidden auto' ,
    transform: 'scale(0.9) translateY(20px)',
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    minWidth: '550px',
    width: 'fit-content',
    height: 'fit-content'
  },
  popupOpen: {
    transform: 'scale(1) translateY(0px)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 28px 0 28px',
    borderBottom: '1px solid #f1f5f9',
    marginBottom: '24px'
  },
  title: {
    fontSize: '1.375rem',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
    letterSpacing: '-0.025em'
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '12px',
    color: '#6b7280',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(8px)'
  },
  closeButtonHover: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    transform: 'scale(1.05)'
  },
  content: {
    padding: '24px',
    width: '100%',
    position: 'relative'
  },
  contentNoHeader: {
    width: '100%',
    position: 'relative'
  },
  contentWithForm: {
    padding: '0',
    width: '100%',
    position: 'relative'
  }
};

const PopUp = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  showCloseButton = true,
  closeOnOverlay = true,
  size = 'medium' // 'small', 'medium', 'large', 'auto'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [closeButtonHover, setCloseButtonHover] = useState(false);

  // Check if children contains DynamicForm
  const isDynamicForm = React.Children.toArray(children).some(child => 
    child?.type?.name === 'DynamicForm' || 
    child?.props?.fields || 
    child?.props?.title
  );

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose();
    }
  };

  if (!isVisible) return null;

  // Size configurations
  const sizeStyles = {
    small: { minWidth: '320px', maxWidth: '400px' },
    medium: { minWidth: '550px', maxWidth: '600px' },
    large: { minWidth: '600px', maxWidth: '800px' },
    auto: { minWidth: '480px', width: 'fit-content' }
  };

  const popupStyle = {
    ...styles.popup,
    ...sizeStyles[size],
    ...(isOpen ? styles.popupOpen : {})
  };

  // Determine content styling based on content type
  const getContentStyle = () => {
    if (isDynamicForm) {
      return styles.contentWithForm;
    }
    if (title || showCloseButton) {
      return styles.content;
    }
    return styles.contentNoHeader;
  };

  return (
    <div 
      style={{
        
        ...styles.overlay,
        ...(isOpen ? styles.overlayOpen : {})
      }}
      onClick={handleOverlayClick}
    >
      <div style={popupStyle}>
        {/* Close button - always visible for forms */}
        {(showCloseButton || isDynamicForm) && (
          <button
            onClick={onClose}
            style={{
              ...styles.closeButton,
              ...(closeButtonHover ? styles.closeButtonHover : {})
            }}
            onMouseEnter={() => setCloseButtonHover(true)}
            onMouseLeave={() => setCloseButtonHover(false)}
            aria-label="Close popup"
          >
            <X size={20} />
          </button>
        )}

        {/* Header - only show if not a form and has title */}
        {!isDynamicForm && (title || showCloseButton) && (
          <div style={styles.header}>
            {title && <h2 style={styles.title}>{title}</h2>}
          </div>
        )}

        {/* Content */}
        <div style={getContentStyle()}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PopUp;