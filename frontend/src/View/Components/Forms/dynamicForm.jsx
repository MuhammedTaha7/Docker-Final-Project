// Components/Forms/dynamicForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  FileText, 
  Type, 
  Hash, 
  ToggleLeft,
  Upload,
  ChevronDown,
  AlertCircle,
  Eye,
  EyeOff,
  BookOpen,
  Users,
  GraduationCap,
  MapPin,
  File
} from 'lucide-react';

// Enhanced field icon mapping with more specific icons
export const getFieldIcon = (fieldName, fieldType) => {
  // Name-based icon mapping (more specific)
  const nameIconMap = {
    'title': FileText,
    'coursetitle': BookOpen,
    'name': User,
    'fullname': User,
    'firstname': User,
    'lastname': User,
    'course': BookOpen,
    'subject': BookOpen,
    'instructor': Users,
    'teacher': Users,
    'professor': Users,
    'lecturer': Users,
    'program': GraduationCap,
    'group': GraduationCap,
    'department': GraduationCap,
    'academicyear': GraduationCap,
    'programyear': GraduationCap,
    'year': Calendar,
    'semester': Calendar,
    'duedate': Calendar,
    'duetime': Clock,
    'startdate': Calendar,
    'enddate': Calendar,
    'starttime': Clock,
    'endtime': Clock,
    'priority': AlertCircle,
    'type': GraduationCap,
    'category': GraduationCap,
    'email': Mail,
    'phone': Phone,
    'tel': Phone,
    'address': MapPin,
    'location': MapPin,
    'city': MapPin,
    'message': FileText,
    'description': FileText,
    'notes': FileText,
    'content': FileText,
    'details': FileText,
    'password': Eye,
    'url': Type,
    'website': Type,
    'grade': Hash,
    'score': Hash,
    'points': Hash,
    'students': Users,
    'lessons': BookOpen,
    'credits': Hash,
    'coursecode': Type
  };
  
  // Type-based icon mapping
  const typeIconMap = {
    'text': Type,
    'email': Mail,
    'tel': Phone,
    'phone': Phone,
    'number': Hash,
    'date': Calendar,
    'time': Clock,
    'datetime-local': Calendar,
    'textarea': FileText,
    'select': ChevronDown,
    'checkbox': ToggleLeft,
    'radio': ToggleLeft,
    'file': Upload,
    'password': Eye,
    'url': Type,
    'search': Type
  };
  
  // First check field name, then field type, then default
  const fieldNameKey = fieldName?.toLowerCase().replace(/[^a-z]/g, '');
  return nameIconMap[fieldNameKey] || typeIconMap[fieldType] || FileText;
};

// Enhanced File Upload Component
const EnhancedFileUpload = ({ 
  field, 
  value, 
  error, 
  onChange, 
  disabled 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(value || null);
  const fileInputRef = useRef(null);
  
  const fieldId = `field-${field.name}`;
  const hasError = Boolean(error);
  const isDisabled = disabled || field.disabled;

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDisabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isDisabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    
    // Check file type if accept attribute is specified
    if (field.accept) {
      const acceptedTypes = field.accept.split(',').map(type => type.trim());
      const fileType = file.type;
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return type === fileExtension;
        }
        return fileType.match(new RegExp(type.replace('*', '.*')));
      });
      
      if (!isAccepted) {
        alert(`File type not accepted. Accepted types: ${field.accept}`);
        return;
      }
    }
    
    setUploadedFile(file);
    
    // Create a synthetic event to match the expected onChange signature
    const syntheticEvent = {
      target: {
        name: field.name,
        type: 'file',
        files: [file]
      }
    };
    
    onChange(syntheticEvent);
  };

  const handleBrowseClick = () => {
    if (!isDisabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Create a synthetic event with no files
    const syntheticEvent = {
      target: {
        name: field.name,
        type: 'file',
        files: []
      }
    };
    
    onChange(syntheticEvent);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📈';
      case 'zip':
      case 'rar':
      case '7z':
        return '🗜️';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return '🖼️';
      case 'mp4':
      case 'avi':
      case 'mov':
        return '🎥';
      case 'mp3':
      case 'wav':
      case 'flac':
        return '🎵';
      default:
        return '📄';
    }
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Label */}
      <label 
        htmlFor={fieldId}
        style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '15px',
          fontWeight: '600',
          color: hasError ? '#ef4444' : isDisabled ? '#9ca3af' : '#374151',
          letterSpacing: '-0.025em'
        }}
      >
        {field.label}
        {field.required && (
          <span style={{ color: '#ef4444', marginLeft: '4px', fontSize: '16px' }}>*</span>
        )}
        {isDisabled && (
          <span style={{ 
            color: '#9ca3af', 
            marginLeft: '8px', 
            fontSize: '12px',
            fontWeight: '400',
            fontStyle: 'italic'
          }}>
            (Disabled)
          </span>
        )}
      </label>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        style={{
          border: `2px dashed ${
            hasError ? '#ef4444' : 
            isDragging ? '#3b82f6' : 
            uploadedFile ? '#10b981' : '#cbd5e1'
          }`,
          borderRadius: '16px',
          padding: '40px 20px',
          textAlign: 'center',
          backgroundColor: isDisabled ? '#f8fafc' : 
                          isDragging ? '#eff6ff' : 
                          uploadedFile ? '#f0fdf4' : '#fafafa',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          opacity: isDisabled ? 0.6 : 1
        }}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          id={fieldId}
          name={field.name}
          onChange={handleFileInputChange}
          required={field.required}
          disabled={isDisabled}
          accept={field.accept}
          style={{ display: 'none' }}
        />

        {uploadedFile ? (
          // Uploaded file display
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              width: '100%',
              maxWidth: '300px',
              position: 'relative'
            }}>
              <div style={{ fontSize: '24px' }}>
                {getFileIcon(uploadedFile.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {uploadedFile.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '2px'
                }}>
                  {formatFileSize(uploadedFile.size)}
                </div>
              </div>
              {!isDisabled && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    color: '#6b7280',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#fee2e2';
                    e.target.style.color = '#dc2626';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#6b7280';
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#059669',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <CheckCircle2 size={20} />
              <span>File uploaded successfully</span>
            </div>
          </div>
        ) : (
          // Upload prompt
          <>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: isDragging ? '#3b82f6' : '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}>
              <Upload size={28} style={{ 
                color: isDragging ? 'white' : '#6b7280'
              }} />
            </div>
            
            <div>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                {isDragging ? 'Drop your file here' : 'Drag your file(s) to start uploading'}
              </div>
              
              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '20px'
              }}>
                OR
              </div>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
                disabled={isDisabled}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isDisabled ? 0.6 : 1
                }}
                onMouseOver={(e) => !isDisabled && (e.target.style.backgroundColor = '#4338ca')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#4f46e5')}
              >
                Browse files
              </button>
            </div>
            
            {field.accept && (
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                fontStyle: 'italic',
                marginTop: '16px'
              }}>
                Accepted file types: {field.accept}
              </div>
            )}
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '12px',
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          color: '#dc2626',
          fontSize: '13px',
          fontWeight: '500'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      {/* Helper Text */}
      {field.helperText && !error && (
        <div style={{
          marginTop: '8px',
          fontSize: '13px',
          color: '#6b7280',
          fontStyle: 'italic',
          lineHeight: '1.4'
        }}>
          {field.helperText}
        </div>
      )}
    </div>
  );
};

// Individual Field Component
const FormField = ({ field, value, error, onChange, disabled, dynamicOptions, customRenderSelect }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const IconComponent = getFieldIcon(field.name, field.type);
  
  const fieldId = `field-${field.name}`;
  const hasError = Boolean(error);
  const isDisabled = disabled || field.disabled;

  const fieldOptions = (dynamicOptions || field.options || []);
  const safeOptions = Array.isArray(fieldOptions) ? fieldOptions : [];

  const baseInputStyles = {
    width: '100%',
    padding: '16px 20px 16px 52px',
    border: `2px solid ${hasError ? '#ef4444' : isFocused ? '#3b82f6' : '#e2e8f0'}`,
    borderRadius: '16px',
    fontSize: '15px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    backgroundColor: isDisabled ? '#f8fafc' : 'white',
    outline: 'none',
    boxSizing: 'border-box',
    color: isDisabled ? '#9ca3af' : '#1f2937',
    lineHeight: '1.5',
    boxShadow: isFocused && !isDisabled ? `0 0 0 4px ${hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}` : 'none',
    cursor: isDisabled ? 'not-allowed' : 'auto'
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: hasError ? '#ef4444' : isDisabled ? '#9ca3af' : '#374151',
    letterSpacing: '-0.025em'
  };

  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 2,
              color: hasError ? '#ef4444' : isFocused && !isDisabled ? '#3b82f6' : '#9ca3af',
              transition: 'color 0.2s ease'
            }}>
              <IconComponent size={20} />
            </div>
            <textarea
              id={fieldId}
              name={field.name}
              value={value || ''}
              onChange={onChange}
              onFocus={() => !isDisabled && setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isDisabled ? (field.placeholder || value || 'Disabled') : field.placeholder}
              required={field.required}
              disabled={isDisabled}
              rows={field.rows || 4}
              style={{
                ...baseInputStyles,
                paddingTop: '20px',
                paddingBottom: '20px',
                resize: 'vertical',
                minHeight: '140px',
                lineHeight: '1.6'
              }}
            />
          </div>
        );

      case 'select':
        if (customRenderSelect && typeof customRenderSelect === 'function') {
          return customRenderSelect({
            field,
            value,
            onChange,
            isDisabled,
            isFocused,
            setIsFocused,
            hasError,
            fieldId,
            baseInputStyles,
            safeOptions
          });
        }
        return (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              zIndex: 2,
              color: hasError ? '#ef4444' : isFocused && !isDisabled ? '#3b82f6' : '#9ca3af',
              transition: 'color 0.2s ease'
            }}>
              <IconComponent size={20} />
            </div>
            
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
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${isFocused && !isDisabled ? '%233b82f6' : '%236b7280'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 20px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '20px',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                paddingRight: '56px'
              }}
            >
              <option value="" disabled>{field.placeholder || `Select ${field.label || 'an option'}`}</option>
              {safeOptions.map((option, index) => {
                const optionValue = typeof option === 'object' ? option.value || option.name : option;
                const optionLabel = typeof option === 'object' ? option.label || option.name : option;          
                
                return (
                  <option key={`${field.name}-${index}-${optionValue}`} value={optionValue}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
          </div>
        );

      case 'radio':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {safeOptions.map((option, index) => {
              const optionValue = typeof option === 'object' ? option.value : option;
              const optionLabel = typeof option === 'object' ? option.label : option;
              
              return (
                <label 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    border: `2px solid ${value === optionValue ? '#3b82f6' : '#e2e8f0'}`,
                    borderRadius: '16px',
                    backgroundColor: value === optionValue ? '#eff6ff' : 'white',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: value === optionValue ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
                    opacity: isDisabled ? 0.6 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!isDisabled && value !== optionValue) {
                      e.target.style.backgroundColor = '#f8fafc';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (value !== optionValue) {
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${value === optionValue ? '#3b82f6' : '#d1d5db'}`,
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}>
                    {value === optionValue && (
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6'
                      }} />
                    )}
                  </div>
                  <input
                    type="radio"
                    name={field.name}
                    value={optionValue}
                    checked={value === optionValue}
                    onChange={onChange}
                    disabled={isDisabled}
                    style={{ display: 'none' }}
                  />
                  <span style={{ 
                    fontSize: '15px', 
                    color: isDisabled ? '#9ca3af' : '#374151',
                    fontWeight: value === optionValue ? '600' : '400'
                  }}>
                    {optionLabel}
                  </span>
                </label>
              );
            })}
          </div>
        );

      case 'checkbox':
        return (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            padding: '20px',
            border: `2px solid ${hasError ? '#ef4444' : value ? '#3b82f6' : '#e2e8f0'}`,
            borderRadius: '16px',
            backgroundColor: isDisabled ? '#f8fafc' : value ? '#eff6ff' : 'white',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: value ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
            opacity: isDisabled ? 0.6 : 1
          }}>
            <div style={{
              position: 'relative',
              width: '24px',
              height: '24px'
            }}>
              <input
                type="checkbox"
                id={fieldId}
                name={field.name}
                checked={value || false}
                onChange={onChange}
                disabled={isDisabled}
                style={{
                  position: 'absolute',
                  width: '24px',
                  height: '24px',
                  margin: 0,
                  opacity: 0,
                  cursor: isDisabled ? 'not-allowed' : 'pointer'
                }}
              />
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '8px',
                border: `2px solid ${value ? '#3b82f6' : '#d1d5db'}`,
                backgroundColor: value ? '#3b82f6' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}>
                {value && (
                  <CheckCircle2 size={14} style={{ color: 'white' }} />
                )}
              </div>
            </div>
            <label 
              htmlFor={fieldId}
              style={{
                fontSize: '15px',
                color: isDisabled ? '#9ca3af' : '#374151',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                userSelect: 'none',
                fontWeight: '500'
              }}
            >
              {field.label}
            </label>
          </div>
        );

      case 'file':
        return (
          <EnhancedFileUpload 
            field={field}
            value={value}
            error={error}
            onChange={onChange}
            disabled={isDisabled}
          />
        );

      case 'password':
        return (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              zIndex: 2,
              color: hasError ? '#ef4444' : isFocused && !isDisabled ? '#3b82f6' : '#9ca3af',
              transition: 'color 0.2s ease'
            }}>
              <IconComponent size={20} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id={fieldId}
              name={field.name}
              value={value || ''}
              onChange={onChange}
              onFocus={() => !isDisabled && setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isDisabled ? (field.placeholder || value || 'Disabled') : field.placeholder}
              required={field.required}
              disabled={isDisabled}
              style={{
                ...baseInputStyles,
                paddingRight: '56px'
              }}
            />
            {!isDisabled && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '20px',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#6b7280';
                  e.target.style.backgroundColor = '#f3f4f6';
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#9ca3af';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
        );

      case 'hidden': 
        return null;

      default:  
        return (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              zIndex: 2,
              color: hasError ? '#ef4444' : isFocused && !isDisabled ? '#3b82f6' : '#9ca3af',
              transition: 'color 0.2s ease'
            }}>
              <IconComponent size={20} />
            </div>
            <input
              type={field.type || 'text'}
              id={fieldId}
              name={field.name}
              value={value || ''}
              onChange={onChange}
              onFocus={() => !isDisabled && setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isDisabled ? (field.placeholder || value || 'Disabled') : field.placeholder}
              required={field.required}
              disabled={isDisabled}
              style={baseInputStyles}
            />
          </div>
        );
    }
  };

  if (field.type === 'file') {
    return renderField();
  }

  return (
    <div style={{ marginBottom: '28px' }}>
      {field.type !== 'checkbox' && field.type !== 'hidden' && (
        <label 
          htmlFor={fieldId}
          style={labelStyles}
        >
          {field.label}
          {field.required && (
            <span style={{ color: '#ef4444', marginLeft: '4px', fontSize: '16px' }}>*</span>
          )}
          {isDisabled && (
            <span style={{ 
              color: '#9ca3af', 
              marginLeft: '8px', 
              fontSize: '12px',
              fontWeight: '400',
              fontStyle: 'italic'
            }}>
              (Disabled)
            </span>
          )}
        </label>
      )}
      
      {renderField()}
      
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '12px',
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          color: '#dc2626',
          fontSize: '13px',
          fontWeight: '500'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      {field.helperText && !error && (
        <div style={{
          marginTop: '8px',
          fontSize: '13px',
          color: '#6b7280',
          fontStyle: 'italic',
          lineHeight: '1.4'
        }}>
          {field.helperText}
        </div>
      )}
    </div>
  );
};

// Main Dynamic Form Component
const DynamicForm = ({
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
  customRenderSelect = null,
  ...props
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [dynamicFields, setDynamicFields] = useState(fields);
  const [dynamicFieldOptions, setDynamicFieldOptions] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else {
      const defaultData = {};
      fields.forEach(field => {
        if (field.disabled && field.name === 'year') {
          defaultData[field.name] = new Date().getFullYear().toString();
        } else if (field.type === 'checkbox') {
          defaultData[field.name] = false;
        } else {
          defaultData[field.name] = '';
        }
      });
      setFormData(defaultData);
    }
    
    setErrors({});
  }, [initialData, fields, getAcademicYearOptions]);

  useEffect(() => {
    setDynamicFields(fields);
    const initialOptions = {};
    fields.forEach(field => {
      if (field.options) {
        initialOptions[field.name] = field.options;
      }
    });
    setDynamicFieldOptions(initialOptions);
  }, [fields]);

  useEffect(() => {
    if (getAcademicYearOptions && formData.department) {
      const academicYearOptions = getAcademicYearOptions(formData.department);
      
      setDynamicFieldOptions(prev => ({
        ...prev,
        academicYear: academicYearOptions
      }));
    } else {
      setDynamicFieldOptions(prev => ({
        ...prev,
        academicYear: []
      }));
    }
  }, [formData.department, getAcademicYearOptions]);

  useEffect(() => {
    if (externalErrors && Object.keys(externalErrors).length > 0) {
      setErrors(externalErrors);
    }
  }, [externalErrors]);

  const handleInputChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    const field = fields.find(f => f.name === name);
    
    if (field && field.disabled) {
      return;
    }

    let finalValue;
    if (type === "checkbox") {
      finalValue = checked;
    } else if (type === "radio") {
      finalValue = value;
    } else if (type === "file") {
      finalValue = files?.[0] ?? null;
    } else {
      finalValue = value;
    }

    const newFormData = {
      ...formData,
      [name]: finalValue,
    };
    
    if (name === 'department') {
      newFormData.academicYear = '';
    }
    
    setFormData(newFormData);
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (onFieldChange) {
      const updatedFields = onFieldChange(name, finalValue);
      if (updatedFields) {
        setDynamicFields(updatedFields);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    dynamicFields.forEach((field) => {
      if (field.disabled) {
        return;
      }
      const value = formData[field.name];
      if (field.required) {
        let isEmpty = false;
        if (field.type === "file") {
          isEmpty = !value;
        } else if (field.type === "checkbox") {
          isEmpty = !value;
        } else if (field.type === "select") {
          isEmpty = !value || value === "";
        } else if (field.type === "radio") {
          isEmpty = !value || value === "";
        } else {
          isEmpty = !value || (typeof value === "string" && value.trim() === "");
        }
        if (isEmpty) {
          newErrors[field.name] = `${field.label || field.name} is required`;
        }
      }
      if (value && validationRules[field.name]) {
        const rule = validationRules[field.name];
        if (typeof rule === "function") {
          const error = rule(value, formData);
          if (error) {
            newErrors[field.name] = error;
          }
        } else if (rule.pattern && !rule.pattern.test(value)) {
          newErrors[field.name] = rule.message || `Invalid ${field.label || field.name}`;
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
      const currentYear = new Date().getFullYear();
      const finalFormData = {
        ...formData,
        year: formData.year || currentYear.toString()
      };
      onSubmit?.(finalFormData);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setErrors({});
    setDynamicFields(fields);
    onCancel?.();
  };

  return (
    <div className={className} style={{ padding: '20px' }} {...props}>
      {showHeader && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px',
          color: 'white',
          margin: '-24px -24px 0 -24px',
          borderRadius: '16px 16px 0 0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: subtitle ? '12px' : '0'
          }}>
            {CustomIcon ? (
              <CustomIcon size={28} />
            ) : (
              <Plus size={28} />
            )}
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '-0.025em'
            }}>
              {title}
            </h2>
          </div>
          {subtitle && (
            <p style={{
              margin: 0,
              fontSize: '16px',
              opacity: 0.9,
              fontWeight: '400',
              lineHeight: '1.5'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div style={{ 
        padding: showHeader ? '32px 0 0 0' : '0'
      }}>
        <form onSubmit={handleSubmit}>
          {dynamicFields.map((field, index) => (
            <FormField
              key={`${field.name}-${index}`}
              field={field}
              value={formData[field.name]}
              error={errors[field.name]}
              onChange={handleInputChange}
              disabled={loading}
              dynamicOptions={dynamicFieldOptions[field.name]}
              customRenderSelect={customRenderSelect}
            />
          ))}
        </form>
      </div>

      {showFooter && (
        <div style={{
          padding: '32px 0 0 0',
          marginTop: '16px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-end'
        }}>
          {showCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              style={{
                padding: '14px 28px',
                backgroundColor: 'white',
                color: '#6b7280',
                border: '2px solid #e5e7eb',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                opacity: loading ? 0.6 : 1
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#f9fafb')}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'white')}
            >
              <X size={18} />
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '14px 32px',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '140px',
              justifyContent: 'center',
              boxShadow: loading ? 'none' : '0 8px 20px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Loading...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                {submitText}
              </>
            )}
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default DynamicForm;