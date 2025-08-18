import React from 'react';
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  FileText, 
  GraduationCap,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import styles from './inputField.module.css';

const InputField = ({ 
  label, 
  type = 'text',
  name, 
  value, 
  checked, 
  onChange, 
  placeholder, 
  required = false,
  error, 
  disabled = false,
  accept, 
  options = [],
  rows = 4,
  className = '',
  ...props
}) => {
  const inputId = `input-${name}`;
  
  // Get field-specific icons
  const getFieldIcon = (fieldName, fieldType) => {
    const iconMap = {
      'title': FileText,
      'name': Users,
      'course': BookOpen,
      'instructor': Users,
      'teacher': Users,
      'dueDate': Calendar,
      'dueTime': Clock,
      'date': Calendar,
      'time': Clock,
      'priority': AlertCircle,
      'type': GraduationCap,
      'email': Mail,
      'phone': Phone,
      'address': MapPin,
      'location': MapPin,
      'message': FileText,
      'description': FileText,
      'notes': FileText,
      'content': FileText
    };
    
    // Type-based icons
    if (fieldType === 'date') return Calendar;
    if (fieldType === 'time') return Clock;
    if (fieldType === 'email') return Mail;
    if (fieldType === 'tel' || fieldType === 'phone') return Phone;
    
    // Name-based icons
    return iconMap[fieldName?.toLowerCase()] || FileText;
  };

  const FieldIcon = getFieldIcon(name, type);

  const renderInput = () => {
    const baseClasses = error ? 
      `${styles.input} ${styles.inputError}` : 
      styles.input;

    switch (type) {
      case 'select':
        return (
          <select
            id={inputId}
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={error ? `${styles.select} ${styles.selectError}` : styles.select}
            {...props}
          >
            {/* Add default option */}
            <option value="">
              {placeholder || `Select ${label}...`}
            </option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className={styles.radioContainer}>
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ 
                  target: { name, value: option.value, type: 'radio' }
                })}
                className={`${styles.radioButton} ${
                  value === option.value ? styles.radioButtonSelected : ''
                }`}
                style={{
                  backgroundColor: value === option.value ? 
                    (option.color || '#4f46e5') : 'white',
                  borderColor: value === option.value ? 
                    (option.color || '#4f46e5') : '#e5e7eb',
                  color: value === option.value ? 'white' : '#6b7280'
                }}
                disabled={disabled}
              >
                {option.label}
              </button>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className={styles.checkboxContainer}>
            <input
              id={inputId}
              type="checkbox"
              name={name}
              checked={checked || false}
              onChange={onChange}
              required={required}
              disabled={disabled}
              className={styles.checkbox}
              {...props}
            />
            <label htmlFor={inputId} className={styles.checkboxLabel}>
              {placeholder}
            </label>
          </div>
        );

      case 'textarea':
        return (
          <textarea
            id={inputId}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={error ? `${styles.textarea} ${styles.textareaError}` : styles.textarea}
            {...props}
          />
        );

      case 'file':
        return (
          <input
            id={inputId}
            type="file"
            name={name}
            onChange={onChange}
            required={required}
            disabled={disabled}
            accept={accept}
            className={baseClasses}
            {...props}
          />
        );

      default:
        return (
          <input
            id={inputId}
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={baseClasses}
            {...props}
          />
        );
    }
  };

  return (
    <div className={`${styles.fieldContainer} ${className}`}>
      <label htmlFor={inputId} className={styles.fieldLabel}>
        <FieldIcon style={{ width: '16px', height: '16px', color: '#6b7280' }} />
        {label} 
        {required && <span className={styles.requiredMark}>*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle style={{ width: '14px', height: '14px', color: '#ef4444' }} />
          <span className={styles.errorText}>{error}</span>
        </div>
      )}
    </div>
  );
};

export default InputField;