// =============================================================================
// COURSE FORM FIELD CONFIGURATIONS
// =============================================================================

import { getAllGroups, semesterOptions, getYearOptionsForGroup } from "./coursePageData.js";
import { lecturersList } from "./coursesData.js";

/**
 * Course form field configurations
 * Defines all form fields for course creation and editing
 */
export const courseFields = [
  {
    name: "courseTitle",
    label: "Course Title",
    type: "text",
    placeholder: "Enter course title",
    required: true,
  },
  {
    name: "courseCode",
    label: "Course Code",
    type: "text",
    placeholder: "e.g., CS101",
    required: true,
  },
  {
    name: "group",
    label: "Program Group",
    type: "select",
    options: getAllGroups(), // Returns array of strings
    required: true,
  },
  {
    name: "academicYear",
    label: "Academic Year",
    type: "select",
    options: [], // Will be populated dynamically based on group selection
    required: true,
    dependsOn: "group",
    getDynamicOptions: (formData) => getYearOptionsForGroup(formData.group || "Certificate IT"),
  },
  {
    name: "semester",
    label: "Semester", 
    type: "select",
    options: semesterOptions, // Returns array of strings
    required: true,
  },
  {
    name: "year",
    label: "Year",
    type: "text",
    value: new Date().getFullYear().toString(),
    required: true,
    disabled: true,
  },
  {
    name: "students",
    label: "Maximum Students",
    type: "number",
    placeholder: "e.g., 30",
    required: false,
  },
  {
    name: "lessons",
    label: "Number of Lessons",
    type: "number",
    placeholder: "e.g., 12",
    required: false,
  },
  {
    name: "credits",
    label: "Credits",
    type: "number",
    placeholder: "e.g., 3",
    required: false,
  },
  {
    name: "lecturer",
    label: "Lecturer",
    type: "select",
    options: lecturersList, // Use the comprehensive lecturers list
    required: true,
    placeholder: "Select a lecturer",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter course description",
    required: false,
    rows: 3,
  },
  {
    name: "img",
    label: "Image URL",
    type: "text",
    placeholder: "Enter image URL",
    required: false,
  },
  {
    name: "selectable",
    label: "Elective Course",
    type: "checkbox",
    required: false,
    value: "no",
  },
];

// =============================================================================
// COURSE FORM VALIDATION RULES
// =============================================================================

/**
 * Validation rules for course form fields
 */
export const courseValidationRules = {
  courseTitle: {
    pattern: /^[A-Za-z0-9\s&-]{2,100}$/,
    message: "Course title must be 2-100 characters and contain only letters, numbers, spaces, &, and -",
  },
  courseCode: {
    pattern: /^[A-Z]{2,4}[0-9]{2,3}$/,
    message: "Course code must be in format like CS101, MATH201, etc.",
  },
  students: {
    pattern: /^[1-9][0-9]*$/,
    message: "Number of students must be a positive number",
  },
  lessons: {
    pattern: /^[1-9][0-9]*$/,
    message: "Number of lessons must be a positive number",
  },
  credits: {
    pattern: /^[0-9]+$/,
    message: "Credits must be a non-negative number",
  },
  description: {
    maxLength: 500,
    message: "Description must not exceed 500 characters",
  },
};

// =============================================================================
// FORM FIELD TRANSFORMATION HELPERS
// =============================================================================

/**
 * Transform course data for form editing
 * Maps course object properties to form field names
 * @param {Object} course - Course object to transform
 * @returns {Object} Transformed course data for form
 */
export const transformCourseForForm = (course) => {
  return {
    courseTitle: course.title || course.courseTitle || '',
    courseCode: course.code || course.courseCode || '',
    group: course.group || '',
    academicYear: course.academicYear || '',
    semester: course.semester || '',
    year: course.year || new Date().getFullYear().toString(),
    students: course.students ? course.students.toString() : '',
    lessons: course.lessons ? course.lessons.toString() : '',
    credits: course.credits ? course.credits.toString() : '',
    lecturer: course.lecturer || course.instructor || '',
    description: course.description || '',
    img: course.img || '',
    selectable: course.selectable === "yes" || course.selectable === true
  };
};

/**
 * Transform form data to course object
 * Maps form field values to course object properties
 * @param {Object} formData - Form data to transform
 * @param {Object} existingCourse - Existing course data (for updates)
 * @returns {Object} Course object
 */
export const transformFormToCourse = (formData, existingCourse = null) => {
  return {
    id: existingCourse ? existingCourse.id : Date.now(),
    code: formData.courseCode,
    title: formData.courseTitle,
    group: formData.group,
    academicYear: formData.academicYear,
    semester: formData.semester,
    year: new Date().getFullYear().toString(),
    students: parseInt(formData.students) || 0,
    lessons: parseInt(formData.lessons) || 0,
    credits: parseInt(formData.credits) || 0,
    lecturer: formData.lecturer,
    description: formData.description || '',
    img: formData.img || '',
    selectable: formData.selectable ? "yes" : "no",
    createdAt: existingCourse ? existingCourse.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// =============================================================================
// FORM FIELD DEPENDENCIES
// =============================================================================

/**
 * Handle field dependencies and dynamic updates
 * @param {string} fieldName - The field that changed
 * @param {any} value - The new value
 * @param {Object} allValues - All current form values
 * @returns {Object} Updated form values
 */
export const handleFieldDependencies = (fieldName, value, allValues) => {
  const updatedValues = { ...allValues, [fieldName]: value };
  
  // When group changes, reset academic year selection
  if (fieldName === 'group') {
    if (updatedValues.academicYear) {
      delete updatedValues.academicYear;
    }
  }
  
  // Ensure year field always stays as current year
  if (fieldName === 'year') {
    updatedValues.year = new Date().getFullYear().toString();
  }
  
  return updatedValues;
};

// =============================================================================
// FORM UTILITIES
// =============================================================================

/**
 * Get updated form fields with current year and dynamic options
 * @returns {Array} Updated form field configurations
 */
export const getUpdatedCourseFields = () => {
  const currentYear = new Date().getFullYear();
  
  return courseFields.map(field => {
    // Ensure year field is disabled and set to current year
    if (field.name === 'year') {
      return {
        ...field,
        type: 'text',
        disabled: true,
        value: currentYear.toString(),
        placeholder: currentYear.toString()
      };
    }
    
    return field;
  });
};