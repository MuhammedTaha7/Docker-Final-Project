import { useState, useCallback } from 'react';

export const useFormValidation = (fields, customRules = {}) => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, value, allData = {}) => {
    const field = fields.find(f => f.name === name);
    if (!field) return null;

    // Required validation
    if (field.required) {
      const isEmpty =
        (field.type === 'file' && !value) ||
        (typeof value === 'string' && value.trim() === '') ||
        (typeof value === 'undefined') ||
        (value === null) ||
        (field.type === 'checkbox' && !value);

      if (isEmpty) {
        return `${field.label || field.name} is required`;
      }
    }

    // Custom validation
    if (value && customRules[name]) {
      const rule = customRules[name];
      if (typeof rule === 'function') {
        return rule(value, allData);
      } else if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || `Invalid ${field.label || field.name}`;
      }
    }

    // Built-in validations
    if (field.type === 'email' && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    return null;
  }, [fields, customRules]);

  const validateForm = useCallback((formData) => {
    const newErrors = {};

    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name], formData);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields, validateField]);

  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateForm,
    validateField,
    clearFieldError,
    clearAllErrors,
    setErrors
  };
};