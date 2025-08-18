/**
 * Enhanced utility functions for the lecturer dashboard with better error handling and validation
 * File: src/Utils/AssignmentsDashboardUtils.js
 */

/**
 * Formats date and time for display with enhanced error handling
 * @param {string} date - Date string
 * @param {string} time - Time string
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date, time) => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date + (time ? `T${time}` : ''));
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided:', date, time);
      return date;
    }
    
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: time ? '2-digit' : undefined,
      minute: time ? '2-digit' : undefined,
      hour12: time ? true : undefined
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return date;
  }
};

/**
 * Enhanced grade percentage calculation with robust error handling
 * @param {Object} student - Student object with grades
 * @param {Array} gradeColumns - Array of grade column configurations
 * @returns {number} Final grade percentage
 */
export const calculateGradePercentage = (student, gradeColumns) => {
  // Input validation
  if (!student || !student.grades || !Array.isArray(gradeColumns) || gradeColumns.length === 0) {
    console.warn('Invalid input for grade calculation:', { student: !!student, gradeColumns: Array.isArray(gradeColumns) });
    return 0;
  }

  let totalWeightedScore = 0;
  let totalPercentage = 0;

  try {
    gradeColumns.forEach(column => {
      if (!column || typeof column.id === 'undefined' || typeof column.percentage !== 'number') {
        console.warn('Invalid grade column:', column);
        return;
      }

      const grade = student.grades[column.id];
      if (grade !== undefined && grade !== null && grade !== '' && !isNaN(grade)) {
        const numericGrade = parseFloat(grade);
        const percentage = parseFloat(column.percentage);
        
        if (!isNaN(numericGrade) && !isNaN(percentage) && percentage > 0) {
          totalWeightedScore += (numericGrade * percentage / 100);
          totalPercentage += percentage;
        }
      }
    });

    return totalPercentage > 0 ? Math.round((totalWeightedScore / totalPercentage) * 100) : 0;
  } catch (error) {
    console.error('Error calculating grade percentage:', error);
    return 0;
  }
};

/**
 * Enhanced grade column validation
 * @param {Object} column - Grade column object
 * @returns {boolean} Whether the column is valid
 */
export const validateGradeColumn = (column) => {
  if (!column || typeof column !== 'object') {
    return false;
  }
  
  // Check name
  if (!column.name || typeof column.name !== 'string' || column.name.trim() === '') {
    return false;
  }
  
  // Validate name length
  if (column.name.trim().length > 50) {
    return false;
  }
  
  // Check type
  const validTypes = ['assignment', 'exam', 'quiz', 'project'];
  if (!column.type || !validTypes.includes(column.type)) {
    return false;
  }
  
  // Check percentage
  const percentage = parseFloat(column.percentage);
  if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
    return false;
  }
  
  return true;
};

/**
 * Enhanced assignment validation
 * @param {Object} assignment - Assignment object
 * @returns {Object} Validation result with errors
 */
export const validateAssignment = (assignment) => {
  const errors = [];
  
  if (!assignment || typeof assignment !== 'object') {
    return { isValid: false, errors: ['Invalid assignment data'] };
  }
  
  // Check title
  if (!assignment.title || typeof assignment.title !== 'string' || assignment.title.trim() === '') {
    errors.push('Assignment title is required');
  } else if (assignment.title.trim().length > 100) {
    errors.push('Assignment title must be less than 100 characters');
  }
  
  // Check due date
  if (!assignment.dueDate || typeof assignment.dueDate !== 'string') {
    errors.push('Due date is required');
  } else {
    try {
      const dateObj = new Date(assignment.dueDate);
      if (isNaN(dateObj.getTime())) {
        errors.push('Invalid due date format');
      } else {
        // Check if date is not in the past (allow today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dateObj < today) {
          errors.push('Due date cannot be in the past');
        }
      }
    } catch (error) {
      errors.push('Invalid due date');
    }
  }
  
  // Check due time
  if (!assignment.dueTime || typeof assignment.dueTime !== 'string') {
    errors.push('Due time is required');
  } else {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(assignment.dueTime)) {
      errors.push('Due time must be in HH:MM format');
    }
  }
  
  // Check max points
  if (assignment.maxPoints !== undefined) {
    const maxPoints = parseFloat(assignment.maxPoints);
    if (isNaN(maxPoints) || maxPoints <= 0 || maxPoints > 1000) {
      errors.push('Max points must be between 1 and 1000');
    }
  }
  
  // Check description length
  if (assignment.description && assignment.description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Enhanced exam validation
 * @param {Object} exam - Exam object
 * @returns {Object} Validation result with errors
 */
export const validateExam = (exam) => {
  const errors = [];
  
  if (!exam || typeof exam !== 'object') {
    return { isValid: false, errors: ['Invalid exam data'] };
  }
  
  // Check title
  if (!exam.title || typeof exam.title !== 'string' || exam.title.trim() === '') {
    errors.push('Exam title is required');
  } else if (exam.title.trim().length > 100) {
    errors.push('Exam title must be less than 100 characters');
  }
  
  // Check times
  if (!exam.startTime || !exam.endTime) {
    errors.push('Start time and end time are required');
  } else {
    try {
      const startDate = new Date(exam.startTime);
      const endDate = new Date(exam.endTime);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        errors.push('Invalid start or end time format');
      } else {
        if (endDate <= startDate) {
          errors.push('End time must be after start time');
        }
        
        // Check if start time is not in the past (allow within 1 hour)
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        if (startDate < oneHourAgo) {
          errors.push('Start time cannot be more than 1 hour in the past');
        }
      }
    } catch (error) {
      errors.push('Invalid date/time format');
    }
  }
  
  // Check duration
  const duration = parseInt(exam.duration);
  if (isNaN(duration) || duration < 5 || duration > 480) {
    errors.push('Duration must be between 5 and 480 minutes (8 hours)');
  }
  
  // Check attempts
  const attempts = parseInt(exam.attempts);
  if (isNaN(attempts) || attempts < 1 || attempts > 10) {
    errors.push('Attempts must be between 1 and 10');
  }
  
  // Check description length
  if (exam.description && exam.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  
  // Check instructions length
  if (exam.instructions && exam.instructions.length > 1000) {
    errors.push('Instructions must be less than 1000 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Enhanced question validation
 * @param {Object} question - Question object
 * @returns {Object} Validation result with errors
 */
export const validateQuestion = (question) => {
  const errors = [];
  
  if (!question || typeof question !== 'object') {
    return { isValid: false, errors: ['Invalid question data'] };
  }
  
  // Check question text
  if (!question.question || typeof question.question !== 'string' || question.question.trim() === '') {
    errors.push('Question text is required');
  } else if (question.question.trim().length > 1000) {
    errors.push('Question text must be less than 1000 characters');
  }
  
  // Check points
  const points = parseInt(question.points);
  if (isNaN(points) || points < 1 || points > 100) {
    errors.push('Points must be between 1 and 100');
  }
  
  // Check type-specific validation
  if (question.type === 'multiple-choice') {
    if (!Array.isArray(question.options)) {
      errors.push('Multiple choice questions must have options array');
    } else {
      const validOptions = question.options.filter(opt => opt && typeof opt === 'string' && opt.trim() !== '');
      if (validOptions.length < 2) {
        errors.push('Multiple choice questions need at least 2 valid options');
      } else if (validOptions.length > 6) {
        errors.push('Multiple choice questions cannot have more than 6 options');
      }
      
      // Check option lengths
      const longOptions = validOptions.filter(opt => opt.length > 200);
      if (longOptions.length > 0) {
        errors.push('Each option must be less than 200 characters');
      }
      
      const correctAnswer = parseInt(question.correctAnswer);
      if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer >= validOptions.length) {
        errors.push('Please select a valid correct answer');
      }
    }
  }
  
  if (question.type === 'true-false') {
    const validAnswers = ['true', 'false'];
    if (!validAnswers.includes(question.correctAnswer)) {
      errors.push('True/False questions must have "true" or "false" as correct answer');
    }
  }
  
  if (question.type === 'text') {
    // Text questions are flexible, minimal validation needed
    if (question.correctAnswer && question.correctAnswer.length > 500) {
      errors.push('Sample answer must be less than 500 characters');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Enhanced student validation
 * @param {Object} student - Student object
 * @returns {Object} Validation result with errors
 */
export const validateStudent = (student) => {
  const errors = [];
  
  if (!student || typeof student !== 'object') {
    return { isValid: false, errors: ['Invalid student data'] };
  }
  
  // Check name
  if (!student.name || typeof student.name !== 'string' || student.name.trim() === '') {
    errors.push('Student name is required');
  } else if (student.name.trim().length > 50) {
    errors.push('Student name must be less than 50 characters');
  }
  
  // Check email
  if (!student.email || typeof student.email !== 'string' || student.email.trim() === '') {
    errors.push('Student email is required');
  } else if (!validateEmail(student.email.trim())) {
    errors.push('Please enter a valid email address');
  }
  
  // Check student ID (optional)
  if (student.studentId && student.studentId.length > 20) {
    errors.push('Student ID must be less than 20 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calculates grade letter based on percentage
 * @param {number} percentage - Grade percentage
 * @returns {string} Letter grade
 */
export const getLetterGrade = (percentage) => {
  const grade = parseFloat(percentage);
  if (isNaN(grade)) return 'F';
  
  if (grade >= 97) return 'A+';
  if (grade >= 93) return 'A';
  if (grade >= 90) return 'A-';
  if (grade >= 87) return 'B+';
  if (grade >= 83) return 'B';
  if (grade >= 80) return 'B-';
  if (grade >= 77) return 'C+';
  if (grade >= 73) return 'C';
  if (grade >= 70) return 'C-';
  if (grade >= 67) return 'D+';
  if (grade >= 63) return 'D';
  if (grade >= 60) return 'D-';
  return 'F';
};

/**
 * Gets grade color class based on percentage
 * @param {number} percentage - Grade percentage
 * @returns {string} CSS class name
 */
export const getGradeColorClass = (percentage) => {
  const grade = parseFloat(percentage);
  if (isNaN(grade)) return 'grade-f';
  
  if (grade >= 90) return 'grade-a';
  if (grade >= 80) return 'grade-b';
  if (grade >= 70) return 'grade-c';
  if (grade >= 60) return 'grade-d';
  return 'grade-f';
};

/**
 * Formats file size for display with enhanced handling
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes) || bytes === 0) return '0 Bytes';
  if (bytes < 0) return 'Invalid size';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  if (i >= sizes.length) return 'File too large';
  if (i < 0) return '0 Bytes';
  
  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${sizes[i]}`;
};

/**
 * Generates a unique ID with better entropy
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const counter = generateId.counter = (generateId.counter || 0) + 1;
  return `${timestamp}_${random}_${counter}`;
};

/**
 * Enhanced email validation
 * @param {string} email - Email address
 * @returns {boolean} Whether email is valid
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const trimmedEmail = email.trim();
  
  if (trimmedEmail.length > 254) return false; // RFC 5321 limit
  if (trimmedEmail.length < 3) return false; // Minimum realistic email
  
  return emailRegex.test(trimmedEmail);
};

/**
 * Enhanced array sorting with error handling
 * @param {Array} array - Array to sort
 * @param {string} field - Field to sort by
 * @param {string} direction - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export const sortByField = (array, field, direction = 'asc') => {
  if (!Array.isArray(array) || !field) {
    console.warn('Invalid input for sorting:', { array: Array.isArray(array), field });
    return array || [];
  }
  
  try {
    return [...array].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      
      // Handle nested field access (e.g., 'user.name')
      if (field.includes('.')) {
        const fields = field.split('.');
        aVal = fields.reduce((obj, key) => obj?.[key], a);
        bVal = fields.reduce((obj, key) => obj?.[key], b);
      }
      
      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return direction === 'asc' ? 1 : -1;
      if (bVal == null) return direction === 'asc' ? -1 : 1;
      
      // Handle string comparison (case-insensitive)
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      // Handle number comparison
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      // Handle date comparison
      if (aVal instanceof Date && bVal instanceof Date) {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      // Generic comparison
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  } catch (error) {
    console.error('Error sorting array:', error);
    return array;
  }
};

/**
 * Enhanced API error handler
 * @param {Error} error - Error object
 * @returns {Object} Formatted error information
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Default error structure
  const errorInfo = {
    error: true,
    status: 0,
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  };
  
  if (!error) {
    return errorInfo;
  }
  
  // Extract status code from error
  const status = error.status || error.statusCode || 0;
  
  const errorMessages = {
    400: 'Bad request. Please check your input and try again.',
    401: 'Authentication required. Please log in again.',
    403: 'Access forbidden. You don\'t have permission for this action.',
    404: 'Resource not found. The requested item may have been deleted.',
    409: 'Conflict. The resource already exists or is in use.',
    422: 'Invalid data provided. Please check your input.',
    429: 'Too many requests. Please wait a moment and try again.',
    500: 'Server error. Please try again later.',
    502: 'Service unavailable. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.',
    504: 'Request timeout. Please try again.'
  };
  
  return {
    ...errorInfo,
    status,
    message: errorMessages[status] || error.message || errorInfo.message
  };
};

/**
 * Format percentage for display
 * @param {number} value - Percentage value
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value) => {
  if (isNaN(value) || value === null || value === undefined) return '0%';
  return `${Math.round(value)}%`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
};