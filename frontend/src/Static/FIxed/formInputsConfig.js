// =============================================================================
// FORM INPUT CONFIGURATIONS
// =============================================================================

// Import course-specific form configurations
export { 
  courseFields, 
  courseValidationRules, 
  transformCourseForForm, 
  transformFormToCourse, 
  handleFieldDependencies, 
  getUpdatedCourseFields 
} from "./courseFormConfig.js";

// =============================================================================
// ANNOUNCEMENT FORM CONFIGURATION
// =============================================================================

/**
 * Announcement form field configurations
 */
export const announcementFormFields = [
  {
    name: "title",
    label: "Announcement Title",
    type: "text",
    placeholder: "Enter announcement title",
    required: true,
  },
  {
    name: "content",
    label: "Announcement Content",
    type: "textarea",
    placeholder: "Enter announcement details",
    required: true,
    rows: 4,
  },
];

// =============================================================================
// TEMPLATE FORM CONFIGURATION
// =============================================================================

/**
 * Template form field configurations
 */
export const templateFormFields = [
  {
    name: "title",
    label: "Template Title",
    type: "text",
    placeholder: "Enter template title",
    required: true,
  },
  {
    name: "content",
    label: "Template Content",
    type: "textarea",
    placeholder: "Enter template content",
    required: true,
    rows: 4,
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: ["general", "exam", "event", "reminder"],
    required: true,
  },
];

// =============================================================================
// CV FORM CONFIGURATION
// =============================================================================

/**
 * CV form field configurations
 */
export const cvFormFields = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    name: "title",
    label: "Professional Title",
    type: "text",
    placeholder: "e.g., Software Engineer, Marketing Manager",
    required: true,
  },
  {
    name: "summary",
    label: "Professional Summary",
    type: "textarea",
    placeholder: "Write a brief professional summary about yourself",
    required: false,
  },
  {
    name: "education",
    label: "Education",
    type: "textarea",
    placeholder: "List your educational background",
    required: false,
  },
  {
    name: "experience",
    label: "Work Experience",
    type: "textarea",
    placeholder: "Describe your work experience",
    required: false,
  },
  {
    name: "skills",
    label: "Skills",
    type: "textarea",
    placeholder: "List your skills (comma separated)",
    required: false,
  },
  {
    name: "links",
    label: "Links",
    type: "text",
    placeholder: "LinkedIn, Portfolio, etc.",
    required: false,
  },
];

// =============================================================================
// CATEGORY FORM CONFIGURATION
// =============================================================================

/**
 * Category form field configurations for file management
 */
export const categoryFields = [
  {
    name: "name",
    label: "Category Name",
    placeholder: "e.g., Presentations, Assignments...",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Brief description of this category...",
    rows: 3,
  },
  {
    name: "color",
    label: "Color",
    type: "radio",
    options: [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#06b6d4",
    ],
    required: true,
  },
];

// =============================================================================
// FILE UPLOAD FORM CONFIGURATION
// =============================================================================

/**
 * File upload form field configurations
 * @param {Array} categories - Available categories for file upload
 * @returns {Array} Form field configurations
 */
export const uploadFileFields = (categories) => [
  {
    name: "categoryId",
    label: "Select Category",
    type: "select",
    placeholder: "Choose a category...",
    options: categories.map((cat) => cat.id),
    required: true,
  },
  {
    name: "file",
    label: "Choose File",
    type: "file",
    accept: ".pdf,.docx,.pptx,.txt",
    required: true,
  },
];

// =============================================================================
// STUDENT FORM CONFIGURATION
// =============================================================================

/**
 * Student form field configurations
 */
export const studentFormFields = [
  {
    name: "photo",
    label: "Profile Photo URL",
    type: "url",
    placeholder: "https://example.com/photo.jpg",
    required: false,
  },
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter student full name",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "student@example.com",
    required: true,
  },
  {
    name: "division",
    label: "Division",
    type: "select",
    required: true,
    options: [
      "computer-science",
      "engineering",
      "mathematics",
      "physics",
      "chemistry",
    ],
  },
  {
    name: "academicYear",
    label: "Academic Year",
    type: "select",
    required: true,
    options: [
      "2023-24",
      "2024-25",
      "2025-26",
    ],
  },
  {
    name: "learningGroup",
    label: "Learning Group",
    type: "select",
    required: true,
    options: [
      "group-a",
      "group-b",
      "group-c",
    ],
  },
  {
    name: "graduationYear",
    label: "Graduation Year",
    type: "select",
    required: true,
    options: [
      "2024",
      "2025",
      "2026",
      "2027",
    ],
  },
  {
    name: "yearGroup",
    label: "Year Group",
    type: "select",
    required: true,
    options: [
      "First Year",
      "Second Year",
      "Third Year",
      "Fourth Year",
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      "Active",
      "Inactive",
      "Graduated",
      "Suspended",
    ],
  },
];

// =============================================================================
// STUDENT FORM VALIDATION RULES
// =============================================================================

/**
 * Student form validation rules
 */
export const studentValidationRules = {
  // photo: {
  //   pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i,
  //   message: "Please enter a valid image URL (jpg, jpeg, png, or gif)",
  // },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  name: {
    pattern: /^[A-Za-z\s]{2,50}$/,
    message: "Please enter a valid name (2-50 characters, letters and spaces only)",
  },
  division: {
    pattern: /^(computer-science|engineering|mathematics|physics|chemistry)$/,
    message: "Please select a valid division",
  },
  academicYear: {
    pattern: /^(2023-24|2024-25|2025-26)$/,
    message: "Please select a valid academic year",
  },
  learningGroup: {
    pattern: /^(group-a|group-b|group-c)$/,
    message: "Please select a valid learning group",
  },
  graduationYear: {
    pattern: /^(2024|2025|2026|2027)$/,
    message: "Please select a valid graduation year",
  },
  yearGroup: {
    pattern: /^(First Year|Second Year|Third Year|Fourth Year)$/,
    message: "Please select a valid year group",
  },
  status: {
    pattern: /^(Active|Inactive|Graduated|Suspended)$/,
    message: "Please select a valid status",
  },
};

// =============================================================================
// COMMON FORM UTILITIES
// =============================================================================

/**
 * Validate form field value against validation rules
 * @param {string} fieldName - Name of the field to validate
 * @param {any} value - Value to validate
 * @param {Object} validationRules - Validation rules object
 * @returns {Object} Validation result with isValid and message
 */
export const validateField = (fieldName, value, validationRules) => {
  const rule = validationRules[fieldName];
  if (!rule) {
    return { isValid: true, message: "" };
  }

  if (rule.pattern && !rule.pattern.test(value)) {
    return { isValid: false, message: rule.message };
  }

  if (rule.maxLength && value.length > rule.maxLength) {
    return { isValid: false, message: rule.message };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate entire form data
 * @param {Object} formData - Form data to validate
 * @param {Object} validationRules - Validation rules object
 * @returns {Object} Validation result with errors object
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(formData).forEach(fieldName => {
    const result = validateField(fieldName, formData[fieldName], validationRules);
    if (!result.isValid) {
      errors[fieldName] = result.message;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// =============================================================================
// FORM FIELD UTILITIES
// =============================================================================

/**
 * Get field configuration by name
 * @param {string} fieldName - Name of the field
 * @param {Array} fields - Array of field configurations
 * @returns {Object|null} Field configuration or null if not found
 */
export const getFieldConfig = (fieldName, fields) => {
  return fields.find(field => field.name === fieldName) || null;
};

/**
 * Get required fields from field configurations
 * @param {Array} fields - Array of field configurations
 * @returns {Array} Array of required field names
 */
export const getRequiredFields = (fields) => {
  return fields.filter(field => field.required).map(field => field.name);
};

/**
 * Check if all required fields are filled
 * @param {Object} formData - Form data to check
 * @param {Array} fields - Array of field configurations
 * @returns {boolean} True if all required fields are filled
 */
export const areRequiredFieldsFilled = (formData, fields) => {
  const requiredFields = getRequiredFields(fields);
  return requiredFields.every(fieldName => {
    const value = formData[fieldName];
    return value !== undefined && value !== null && value !== '';
  });
};