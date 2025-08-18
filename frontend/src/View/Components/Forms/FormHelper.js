export const createTextField = (name, label, options = {}) => ({
  name,
  label,
  type: 'text',
  required: false,
  ...options
});

export const createSelectField = (name, label, options, fieldOptions = {}) => ({
  name,
  label,
  type: 'select',
  required: false,
  options,
  ...fieldOptions
});

export const createRadioField = (name, label, options, fieldOptions = {}) => ({
  name,
  label,
  type: 'radio',
  required: false,
  options,
  ...fieldOptions
});

export const createCheckboxField = (name, label, placeholder, options = {}) => ({
  name,
  label,
  type: 'checkbox',
  placeholder,
  required: false,
  ...options
});

export const createDateField = (name, label, options = {}) => ({
  name,
  label,
  type: 'date',
  required: false,
  ...options
});

export const createEmailField = (name, label = 'Email', options = {}) => ({
  name,
  label,
  type: 'email',
  placeholder: 'Enter email address...',
  required: false,
  ...options
});

export const createTextareaField = (name, label, options = {}) => ({
  name,
  label,
  type: 'textarea',
  rows: 4,
  required: false,
  ...options
});

// Common validation rules
export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  
  phone: {
    pattern: /^\+?[\d\s-()]+$/,
    message: 'Please enter a valid phone number'
  },
  
  required: (fieldName) => (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  },
  
  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return null;
  },
  
  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return null;
  },
  
  passwordStrength: (value) => {
    if (!value) return null;
    
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;
    
    if (!isLongEnough) return 'Password must be at least 8 characters long';
    if (!hasUpper) return 'Password must contain at least one uppercase letter';
    if (!hasLower) return 'Password must contain at least one lowercase letter';
    if (!hasNumber) return 'Password must contain at least one number';
    if (!hasSpecial) return 'Password must contain at least one special character';
    
    return null;
  }
};

// Pre-configured field sets
export const commonFieldSets = {
  contactInfo: [
    createTextField('name', 'Full Name', { required: true }),
    createEmailField('email', 'Email Address', { required: true }),
    createTextField('phone', 'Phone Number', { type: 'tel' })
  ],
  
  assignment: [
    createTextField('title', 'Title', { required: true, placeholder: 'Enter assignment title...' }),
    createSelectField('course', 'Course', [
      { value: '', label: 'Select course' },
      { value: 'math', label: 'Mathematics' },
      { value: 'science', label: 'Science' },
      { value: 'history', label: 'History' },
      { value: 'english', label: 'English' }
    ], { required: true }),
    createDateField('dueDate', 'Due Date', { required: true }),
    createRadioField('priority', 'Priority', [
      { value: 'low', label: 'Low', color: '#10b981' },
      { value: 'medium', label: 'Medium', color: '#f59e0b' },
      { value: 'high', label: 'High', color: '#ef4444' }
    ], { required: true })
  ],
  
  userRegistration: [
    createTextField('username', 'Username', { required: true }),
    createEmailField('email', 'Email Address', { required: true }),
    createTextField('password', 'Password', { type: 'password', required: true }),
    createTextField('confirmPassword', 'Confirm Password', { type: 'password', required: true }),
    createCheckboxField('agreeToTerms', 'Terms & Conditions', 'I agree to the terms and conditions', { required: true })
  ]
};