import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Settings, 
  User,
  Plus,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Hash,
  Mail,
  Phone,
  X,
  Clock
} from 'lucide-react';

// StatCardsContainer Component
export const StatCardsContainer = ({ cards, size = "default", columns, gap, onCardClick, className = "" }) => {
  const getColumnsForSize = (size) => {
    switch(size) {
      case 'compact': return 2;
      case 'large': return 3;
      case 'xl': return 4;
      default: return 4;
    }
  };

  const getGapForSize = (size) => {
    switch(size) {
      case 'compact': return '0.75rem';
      case 'large': return '2rem';
      case 'xl': return '3rem';
      default: return '1.5rem';
    }
  };

  const colCount = columns ?? getColumnsForSize(size);
  const gridGap = gap ?? getGapForSize(size);

  return (
    <div
      style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${colCount}, 1fr)`,
        gap: gridGap,
        width: '100%',
        marginBottom: '25px'
      }}
      className={className}
    >
      {cards.map((card, idx) => (
        <StatCard
          key={card.id ?? idx}
          {...card}
          size={size}
          onClick={() => onCardClick?.(card, idx)}
        />
      ))}
    </div>
  );
};

// StatCard Component
export const StatCard = ({ 
  title, 
  value, 
  icon, 
  gradient,
  backgroundColor,
  className = '',
  size = 'default',
  onClick,
  subtitle,
  ...props 
}) => {
  const cardStyle = {
    background: gradient || backgroundColor || '#3b82f6',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    color: 'white',
    ...props.style
  };

  return (
    <div 
      style={cardStyle}
      onClick={onClick}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseOut={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
      }}
      className={className}
      {...props}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px 0', fontWeight: '500' }}>
            {title}
          </p>
          <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'white', margin: '0 0 4px 0' }}>
            {value}
          </h3>
          {subtitle && (
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          {React.isValidElement(icon) ? icon : null}
        </div>
      </div>
    </div>
  );
};

// MidPageNavbar Component
export const MidPageNavbar = ({ 
  activeSection, 
  setActiveSection, 
  selectedYear, 
  setSelectedYear, 
  sections, 
  showYear = true
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  // Icon mapping for sections
  const sectionIcons = {
    overview: Settings,
    students: Users,
    lecturers: User,
    courses: BookOpen
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: '32px',
      width: '100%'
    }}>
      <nav style={{
        backgroundColor: 'white',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
        borderRadius: '50px',
        padding: '12px 32px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        width: 'fit-content',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        {sections.map((section) => {
          const IconComponent = sectionIcons[section] || FileText;
          return (
            <button
              key={section}
              style={{
                background: activeSection === section 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'transparent',
                border: 'none',
                fontSize: '15px',
                color: activeSection === section ? '#ffffff' : '#6b7280',
                padding: '12px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: activeSection === section ? '600' : '500',
                boxShadow: activeSection === section 
                  ? '0 4px 12px rgba(102, 126, 234, 0.4)' 
                  : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => setActiveSection(section)}
              onMouseOver={(e) => {
                if (activeSection !== section) {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.color = '#4f46e5';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                if (activeSection !== section) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <IconComponent size={16} />
              {section.charAt(0).toUpperCase() + section.slice(1)}
              {activeSection === section && (
                <div style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '2px',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '1px'
                }} />
              )}
            </button>
          );
        })}

        {showYear && (
          <div style={{ marginLeft: '16px', paddingLeft: '16px', borderLeft: '1px solid #e5e7eb' }}>
            <select
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                color: '#374151',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
              value={selectedYear}
              onChange={handleYearChange}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#4f46e5';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
      </nav>
    </div>
  );
};

// Data Table Component
export const DataTable = ({ data, columns, onView, onEdit, onDelete, emptyMessage }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(prev => 
      prev.length === data.length ? [] : data.map(row => row.id)
    );
  };

  if (data.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        textAlign: 'center',
        border: '2px dashed #e5e7eb'
      }}>
        <FileText size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
        <h3 style={{ color: '#6b7280', margin: '0 0 8px 0' }}>No Data Available</h3>
        <p style={{ color: '#9ca3af', margin: 0 }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px', textAlign: 'left', width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length}
                  onChange={toggleAllRows}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              {columns.map(column => (
                <th key={column.key} style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {column.title}
                </th>
              ))}
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id} style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                <td style={{ padding: '16px' }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => toggleRow(row.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                {columns.map(column => (
                  <td key={column.key} style={{
                    padding: '16px',
                    fontSize: '14px',
                    color: '#374151'
                  }}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {onView && (
                      <button
                        onClick={() => onView(row)}
                        style={{
                          padding: '8px',
                          background: 'none',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#6b7280',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#3b82f6';
                          e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#6b7280';
                        }}
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        style={{
                          padding: '8px',
                          background: 'none',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#6b7280',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#10b981';
                          e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#6b7280';
                        }}
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        style={{
                          padding: '8px',
                          background: 'none',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          color: '#6b7280',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#ef4444';
                          e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#6b7280';
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// PopUp Component
export const PopUp = ({ isOpen, onClose, title, children, showCloseButton = true, closeOnOverlay = true, size = 'medium' }) => {
  const [isVisible, setIsVisible] = useState(false);

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

  const sizeStyles = {
    small: { minWidth: '320px', maxWidth: '400px' },
    medium: { minWidth: '550px', maxWidth: '600px' },
    large: { minWidth: '800px', maxWidth: '1000px' },
    auto: { minWidth: '480px', width: 'fit-content' }
  };

  return (
    <div 
      style={{
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
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease, visibility 0.3s ease',
        backdropFilter: 'blur(4px)'
      }}
      onClick={handleOverlayClick}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        position: 'relative',
        maxWidth: '95vw',
        maxHeight: '95vh',
        overflow: 'auto',
        transform: isOpen ? 'scale(1) translateY(0px)' : 'scale(0.9) translateY(20px)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...sizeStyles[size]
      }}>
        {showCloseButton && (
          <button
            onClick={onClose}
            style={{
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
            }}
          >
            <X size={20} />
          </button>
        )}
        
        {title && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 28px 0 28px',
            borderBottom: '1px solid #f1f5f9',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '1.375rem',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0,
              letterSpacing: '-0.025em'
            }}>
              {title}
            </h2>
          </div>
        )}
        
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// DynamicForm Component
export const DynamicForm = ({
  title = 'Form',
  subtitle,
  fields = [],
  onSubmit,
  onCancel,
  submitText = "Submit",
  cancelText = "Cancel",
  showCancel = true,
  showHeader = true,
  showFooter = true,
  loading = false,
  className = "",
  initialData = {},
  validationRules = {},
  icon: CustomIcon,
  onFieldChange,
  getAcademicYearOptions,
  errors: externalErrors = {},
  ...props
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [dynamicFieldOptions, setDynamicFieldOptions] = useState({});

  // Initialize form data when initialData changes or component mounts
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else {
      const defaultData = {};
      fields.forEach(field => {
        if (field.type === 'checkbox') {
          defaultData[field.name] = false;
        } else {
          defaultData[field.name] = '';
        }
      });
      setFormData(defaultData);
    }
    setErrors({});
  }, [initialData, fields]);

  // Form field component
  const FormField = ({ field, value, error, onChange, disabled }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const fieldId = `field-${field.name}`;
    const hasError = Boolean(error);
    const isDisabled = disabled || field.disabled;

    const baseInputStyles = {
      width: '100%',
      padding: '12px 16px',
      border: `2px solid ${hasError ? '#ef4444' : isFocused ? '#3b82f6' : '#e2e8f0'}`,
      borderRadius: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      transition: 'all 0.3s ease',
      backgroundColor: isDisabled ? '#f8fafc' : 'white',
      outline: 'none',
      boxSizing: 'border-box',
      color: isDisabled ? '#9ca3af' : '#1f2937'
    };

    const renderField = () => {
      switch (field.type) {
        case 'textarea':
          return (
            <textarea
              id={fieldId}
              name={field.name}
              value={value || ''}
              onChange={onChange}
              onFocus={() => !isDisabled && setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={isDisabled}
              rows={field.rows || 4}
              style={{
                ...baseInputStyles,
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
          );

        case 'select':
          return (
            <select
              id={fieldId}
              name={field.name}
              value={value || ''}
              onChange={onChange}
              onFocus={() => !isDisabled && setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              required={field.required}
              disabled={isDisabled}
              style={{
                ...baseInputStyles,
                cursor: isDisabled ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {(field.options || []).map((option, index) => {
                const optionValue = typeof option === 'object' ? option.value : option;
                const optionLabel = typeof option === 'object' ? option.label : option;
                return (
                  <option key={index} value={optionValue}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
          );

        case 'number':
          return (
            <input
              type="number"
              id={fieldId}
              name={field.name}
              value={value || ''}
              onChange={onChange}
              onFocus={() => !isDisabled && setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={isDisabled}
              min={field.min}
              max={field.max}
              step={field.step}
              style={baseInputStyles}
            />
          );

        default:
          return (
            <input
              type={field.type || 'text'}
              id={fieldId}
              name={field.name}
              value={value || ''}
              onChange={onChange}
              onFocus={() => !isDisabled && setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={isDisabled}
              style={baseInputStyles}
            />
          );
      }
    };

    return (
      <div style={{ marginBottom: '20px' }}>
        <label 
          htmlFor={fieldId}
          style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: hasError ? '#ef4444' : '#374151'
          }}
        >
          {field.label}
          {field.required && (
            <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
          )}
        </label>
        
        {renderField()}
        
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '8px',
            color: '#dc2626',
            fontSize: '13px'
          }}>
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    
    let finalValue;
    if (type === "checkbox") {
      finalValue = checked;
    } else {
      finalValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach((field) => {
      if (field.disabled) return;
      
      const value = formData[field.name];
      
      if (field.required) {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[field.name] = `${field.label} is required`;
        }
      }
      
      if (field.type === "email" && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          newErrors[field.name] = "Please enter a valid email address";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setErrors({});
    onCancel?.();
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      {showHeader && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '24px',
          color: 'white',
          margin: '-24px -24px 24px -24px',
          borderRadius: '16px 16px 0 0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: subtitle ? '8px' : '0'
          }}>
            {CustomIcon && <CustomIcon size={24} />}
            <h2 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700'
            }}>
              {title}
            </h2>
          </div>
          {subtitle && (
            <p style={{
              margin: 0,
              fontSize: '14px',
              opacity: 0.9
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {fields.map((field, index) => (
          <FormField
            key={`${field.name}-${index}`}
            field={field}
            value={formData[field.name]}
            error={errors[field.name]}
            onChange={handleInputChange}
            disabled={loading}
          />
        ))}
      </form>

      {/* Footer */}
      {showFooter && (
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          paddingTop: '20px',
          borderTop: '1px solid #e5e7eb',
          marginTop: '20px'
        }}>
          {showCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                color: '#6b7280',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Loading...' : submitText}
          </button>
        </div>
      )}
    </div>
  );
};

// Form field configurations
export const getFormFieldConfigs = (currentDepartment, filteredLecturers) => {
  const studentFormFields = [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'studentId', label: 'Student ID', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { 
      name: 'division', 
      label: 'Division', 
      type: 'select', 
      required: true,
      options: currentDepartment?.divisions.map(div => ({ value: div, label: `Division ${div}` })) || []
    }
  ];

  const lecturerFormFields = [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'specialization', label: 'Specialization', type: 'text', required: true }
  ];

  const courseFormFields = [
    { name: 'title', label: 'Course Title', type: 'text', required: true },
    { name: 'code', label: 'Course Code', type: 'text', required: true },
    { name: 'credits', label: 'Credits', type: 'number', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { 
      name: 'instructor', 
      label: 'Instructor', 
      type: 'select', 
      required: true,
      options: filteredLecturers.map(lecturer => ({ value: lecturer.name, label: lecturer.name }))
    }
  ];

  return { studentFormFields, lecturerFormFields, courseFormFields };
};

// Tab configuration
export const tabs = [
  { key: 'overview', label: 'Overview', icon: Settings },
  { key: 'students', label: 'Students', icon: Users },
  { key: 'lecturers', label: 'Lecturers', icon: User },
  { key: 'courses', label: 'Courses', icon: BookOpen }
];

// Table column configurations
export const getTableColumns = () => {
  const studentColumns = [
    { 
      key: 'studentId', 
      title: 'Student ID',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Hash size={12} style={{ color: 'white' }} />
          </div>
          <span style={{ fontWeight: '600', color: '#1f2937' }}>{value}</span>
        </div>
      )
    },
    { 
      key: 'name', 
      title: 'Student Name',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={16} style={{ color: '#6b7280' }} />
          <span style={{ fontWeight: '500' }}>{value}</span>
        </div>
      )
    },
    { 
      key: 'division', 
      title: 'Division',
      render: (value) => (
        <span style={{
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: '#f3f4f6',
          color: '#374151',
          border: '1px solid #d1d5db'
        }}>
          Div {value}
        </span>
      )
    },
    { 
      key: 'email', 
      title: 'Email',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={16} style={{ color: '#6b7280' }} />
          <span style={{ color: '#3b82f6', fontSize: '14px' }}>{value}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (status) => (
        <span style={{
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: status === 'active' ? '#dcfce7' : '#fef3c7',
          color: status === 'active' ? '#166534' : '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          width: 'fit-content'
        }}>
          {status === 'active' ? (
            <CheckCircle2 size={12} />
          ) : (
            <AlertCircle size={12} />
          )}
          {status}
        </span>
      )
    }
  ];

  const lecturerColumns = [
    { 
      key: 'name', 
      title: 'Lecturer Name',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={16} style={{ color: '#6b7280' }} />
          </div>
          <span style={{ fontWeight: '600', color: '#1f2937' }}>{value}</span>
        </div>
      )
    },
    { 
      key: 'specialization', 
      title: 'Specialization',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={16} style={{ color: '#10b981' }} />
          <span style={{ 
            fontSize: '14px',
            color: '#374151',
            fontWeight: '500'
          }}>
            {value}
          </span>
        </div>
      )
    },
    { 
      key: 'email', 
      title: 'Email',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={16} style={{ color: '#6b7280' }} />
          <span style={{ color: '#3b82f6', fontSize: '14px' }}>{value}</span>
        </div>
      )
    },
    { 
      key: 'phone', 
      title: 'Contact',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Phone size={16} style={{ color: '#6b7280' }} />
          <span style={{ fontSize: '14px', color: '#374151' }}>{value}</span>
        </div>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (status) => (
        <span style={{
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: status === 'active' ? '#dcfce7' : '#fef3c7',
          color: status === 'active' ? '#166534' : '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          width: 'fit-content'
        }}>
          {status === 'active' ? (
            <CheckCircle2 size={12} />
          ) : (
            <AlertCircle size={12} />
          )}
          {status}
        </span>
      )
    }
  ];

  const courseColumns = [
    { 
      key: 'code', 
      title: 'Course Code',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Hash size={12} style={{ color: 'white' }} />
          </div>
          <span style={{ 
            fontWeight: '700', 
            color: '#1f2937',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}>
            {value}
          </span>
        </div>
      )
    },
    { 
      key: 'title', 
      title: 'Course Title',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={16} style={{ color: '#6b7280' }} />
          <span style={{ fontWeight: '600', color: '#1f2937' }}>{value}</span>
        </div>
      )
    },
    { 
      key: 'credits', 
      title: 'Credits',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GraduationCap size={16} style={{ color: '#8b5cf6' }} />
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '700',
            backgroundColor: '#f3f4f6',
            color: '#374151'
          }}>
            {value} CR
          </span>
        </div>
      )
    },
    { 
      key: 'instructor', 
      title: 'Instructor',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={12} style={{ color: 'white' }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            {value}
          </span>
        </div>
      )
    },
    { 
      key: 'description', 
      title: 'Description',
      render: (value) => (
        <div style={{ 
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '13px',
          color: '#6b7280'
        }}>
          {value}
        </div>
      )
    }
  ];

  return { studentColumns, lecturerColumns, courseColumns };
};