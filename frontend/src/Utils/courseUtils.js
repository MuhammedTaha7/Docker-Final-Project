// utils/coursesUtils.js
import { semesterOptions } from "../Static/FIxed/coursesData.js";
import { getAllDepartments } from "../Api/coursePageApi.js";
import { getAllLecturers } from "../Api/dashboardPageApi.js";

// Function to generate academic year options from totalAcademicYears
export const generateAcademicYearOptions = (totalAcademicYears) => {
  if (!totalAcademicYears || totalAcademicYears <= 0) {
    return [];
  }
  return Array.from({ length: totalAcademicYears }, (_, index) => String(index + 1));
};

// Function to get academic year options based on department name
export const getAcademicYearOptionsForDepartment = (departmentName, departments) => {
  if (!departmentName || !departments || departments.length === 0) {
    return [];
  }
  const selectedDepartment = departments.find(dept => dept.name === departmentName);
  if (!selectedDepartment) {
    return [];
  }
  return generateAcademicYearOptions(selectedDepartment.totalAcademicYears);
};

// Function to get all available academic years from all departments
export const getAllAcademicYearOptions = (departments) => {
  if (!departments || departments.length === 0) {
    return [];
  }
  const allYears = new Set();
  departments.forEach(dept => {
    const yearOptions = generateAcademicYearOptions(dept.totalAcademicYears);
    yearOptions.forEach(year => allYears.add(year));
  });
  return Array.from(allYears).sort((a, b) => parseInt(a) - parseInt(b));
};

// Function to get department options for select fields
export const getDepartmentOptions = (departments) => {
  return departments.map(dept => dept.name);
};

// Function to get lecturer options for select fields
export const getLecturerOptions = async () => {
  try {
    const allUsers = await getAllLecturers();
    const lecturers = allUsers.filter(user => user.role === "1200");
    return lecturers.map(lecturer => ({
      value: lecturer.id,
      label: lecturer.name || 'Unknown Lecturer',
      name: lecturer.name || 'Unknown Lecturer'
    }));
  } catch (error) {
    console.error("Failed to fetch lecturers:", error);
    return [];
  }
};

// Updated course fields with department and lecturer options
export const getCourseFields = async (departments) => {
  const departmentOptions = getDepartmentOptions(departments);
  const lecturerOptions = await getLecturerOptions();

  const fields = [
    { name: "courseTitle", label: "Course Title", type: "text", placeholder: "Enter course title", required: true },
    { name: "courseCode", label: "Course Code", type: "text", placeholder: "e.g., CS101", required: true },
    { name: "department", label: "Department", type: "select", options: departmentOptions, required: true },
    {
      name: "academicYear",
      label: "Academic Year",
      type: "select",
      options: [],
      required: true,
      dependsOn: "department",
      getDynamicOptions: (formData) => getAcademicYearOptionsForDepartment(formData.department, departments)
    },
    { name: "semester", label: "Semester", type: "select", options: semesterOptions, required: true },
    { name: "year", label: "Year", type: "text", value: new Date().getFullYear().toString(), required: true, disabled: true },
    { name: "credits", label: "Credits", type: "number", placeholder: "e.g., 3", required: true },
    { name: "lecturer", label: "Lecturer", type: "select", options: lecturerOptions, required: true, placeholder: "Select a lecturer" },
    { name: "description", label: "Description", type: "textarea", placeholder: "Enter course description", required: false, rows: 3 },
    { name: "img", label: "Image URL", type: "text", placeholder: "Enter image URL", required: false },
    { name: "selectable", label: "Elective Course", type: "checkbox", required: false, value: "no" },
    { name: "language", label: "Language", type: "text", placeholder: "e.g., English", required: false },
    { name: "prerequisites", label: "Prerequisites", type: "text", placeholder: "e.g., None or CS101", required: false },
    { name: "finalExam", label: "Final Exam Info", type: "text", placeholder: "e.g., TBD or 2025-12-20", required: false },
    { name: "progress", label: "Progress (%)", type: "number", placeholder: "e.g., 0", min: 0, max: 100, required: false },
  ];

  return fields;
};

export const courseValidationRules = {
  courseTitle: { pattern: /^[A-Za-z0-9\s&-]{2,100}$/, message: "Course title must be 2-100 characters and contain only letters, numbers, spaces, &, and -" },
  courseCode: { pattern: /^[A-Z]{2,4}[0-9]{2,3}$/, message: "Course code must be in format like CS101, MATH201, etc." },
  students: { pattern: /^[1-9][0-9]*$/, message: "Number of students must be a positive number" },
  lessons: { pattern: /^[1-9][0-9]*$/, message: "Number of lessons must be a positive number" },
  credits: { pattern: /^[0-9]+$/, message: "Credits must be a non-negative number" },
  description: { maxLength: 500, message: "Description must not exceed 500 characters" },
};

// Transform course for form editing
export const transformCourseForForm = (course, lecturers = []) => {
  const lecturer = lecturers.find(l => l.id === course.lecturerId);
  const transformed = {
    id: course.id,
    courseTitle: course.name || '',
    courseCode: course.code || '',
    department: course.department || '',
    academicYear: course.academicYear || '',
    semester: course.semester || '',
    year: course.year != null ? course.year.toString() : new Date().getFullYear().toString(),
    credits: course.credits != null ? course.credits.toString() : '',
    lecturer: course.lecturerId || '',
    description: course.description || '',
    img: course.imageUrl || '',
    selectable: course.selectable === true,
    language: course.language || 'English',
    progress: course.progress != null ? course.progress.toString() : '0',
    prerequisites: course.prerequisites || 'None',
    finalExam: course.finalExam || 'TBD',
  };
  return transformed;
};

export const transformFormToCourse = (formData, existingCourse = null) => {
  const courseData = {
    id: existingCourse ? existingCourse.id : null,
    code: formData.courseCode,
    name: formData.courseTitle,
    department: formData.department,
    academicYear: formData.academicYear,
    semester: formData.semester,
    year: parseInt(formData.year) || new Date().getFullYear(),
    credits: parseInt(formData.credits) || 0,
    lecturerId: formData.lecturer,
    description: formData.description || '',
    imageUrl: formData.img || '',
    selectable: formData.selectable === true,
    language: formData.language,
    progress: parseInt(formData.progress) || 0,
    prerequisites: formData.prerequisites,
    finalExam: formData.finalExam,
  };
  return courseData;
};

// Transform course data for display (compatible with existing CoursePageContent)
export const transformCourseForDisplay = (courseData, lecturers = []) => {
  if (!courseData) return null;

  const lecturer = lecturers.find(l => l.id === courseData.lecturerId);
  
  const transformed = {
    ...courseData,
    lecturerName: lecturer ? lecturer.name : 'Unknown Lecturer',
    lecturer: lecturer || null,
    title: courseData.name || courseData.title,
    instructorName: lecturer ? lecturer.name : 'Unknown Lecturer',
    enrollments: courseData.enrollments || []
  };

  return transformed;
};

export const handleFieldDependencies = (fieldName, value, allValues) => {
  const updatedValues = { ...allValues };
  updatedValues[fieldName] = value;
  
  if (fieldName === 'department') {
    updatedValues.academicYear = '';
  }
  
  return updatedValues;
};

export const getUpdatedCourseFields = async (departments) => {
  const currentYear = new Date().getFullYear();
  const courseFields = await getCourseFields(departments);
  
  const updatedFields = courseFields.map(field => 
    field.name === 'year' 
      ? { ...field, value: currentYear.toString(), placeholder: currentYear.toString() } 
      : field
  );
  
  return updatedFields;
};

// FIXED: Filter function with proper data type handling and debugging
export const filterCourses = (courses, filters, searchInput) => {
  console.log("🔍 Starting filterCourses with:", {
    coursesCount: courses.length,
    filters,
    searchInput,
    sampleCourse: courses[0] ? {
      name: courses[0].name,
      department: courses[0].department,
      academicYear: courses[0].academicYear,
      semester: courses[0].semester,
      year: courses[0].year,
      selectable: courses[0].selectable
    } : 'No courses'
  });

  let filtered = [...courses];
  
  // Department filter
  if (filters.department && filters.department !== "all") {
    const beforeCount = filtered.length;
    filtered = filtered.filter(c => c.department === filters.department);
    console.log(`🏢 Department filter (${filters.department}): ${beforeCount} → ${filtered.length}`);
  }
  
  // Academic Year filter
  if (filters.academicYear && filters.academicYear !== "all") {
    const beforeCount = filtered.length;
    // FIXED: Handle both string and number comparisons
    filtered = filtered.filter(c => {
      const courseAcademicYear = String(c.academicYear);
      const filterAcademicYear = String(filters.academicYear);
      return courseAcademicYear === filterAcademicYear;
    });
    console.log(`📚 Academic Year filter (${filters.academicYear}): ${beforeCount} → ${filtered.length}`);
  }
  
  // FIXED: Semester filter with proper string/number handling
  if (filters.semester && filters.semester !== "all") {
    const beforeCount = filtered.length;
    filtered = filtered.filter(c => {
      const courseSemester = String(c.semester);
      const filterSemester = String(filters.semester);
      const matches = courseSemester === filterSemester;
      
      console.log(`📅 Semester comparison: course.semester="${courseSemester}" vs filter="${filterSemester}" → ${matches}`);
      return matches;
    });
    console.log(`📅 Semester filter (${filters.semester}): ${beforeCount} → ${filtered.length}`);
  }
  
  // FIXED: Year filter with proper number comparison
  if (filters.year && filters.year !== "all" && filters.year !== "All year") {
    const beforeCount = filtered.length;
    filtered = filtered.filter(c => {
      const courseYear = parseInt(c.year);
      const filterYear = parseInt(filters.year);
      const matches = courseYear === filterYear;
      
      console.log(`📆 Year comparison: course.year=${courseYear} vs filter=${filterYear} → ${matches}`);
      return matches;
    });
    console.log(`📆 Year filter (${filters.year}): ${beforeCount} → ${filtered.length}`);
  }
  
  // FIXED: Selectable filter with proper boolean handling
  if (filters.selectable && filters.selectable !== "all") {
    const beforeCount = filtered.length;
    filtered = filtered.filter(c => {
      const courseSelectable = c.selectable === true;
      const filterSelectable = filters.selectable === "yes";
      const matches = courseSelectable === filterSelectable;
      
      console.log(`✅ Selectable comparison: course.selectable=${courseSelectable} vs filter="${filters.selectable}" (${filterSelectable}) → ${matches}`);
      return matches;
    });
    console.log(`✅ Selectable filter (${filters.selectable}): ${beforeCount} → ${filtered.length}`);
  }
  
  // Search filter
  if (searchInput && searchInput.trim()) {
    const beforeCount = filtered.length;
    const searchLower = searchInput.toLowerCase().trim();
    filtered = filtered.filter(c => 
      (c.name && c.name.toLowerCase().includes(searchLower)) || 
      (c.title && c.title.toLowerCase().includes(searchLower)) || 
      (c.code && c.code.toLowerCase().includes(searchLower))
    );
    console.log(`🔍 Search filter (${searchInput}): ${beforeCount} → ${filtered.length}`);
  }
  
  console.log(`✅ Final filtered courses: ${filtered.length}`);
  return filtered;
};

// FIXED: Filter options with "All year" removal and proper data handling
export const getFilterOptions = (courses, departments) => {
  const departmentOptions = getDepartmentOptions(departments);
  const allAcademicYears = getAllAcademicYearOptions(departments);
  
  // FIXED: Remove "All year" from year options and ensure proper number handling
  const yearOptions = [...new Set(courses.map(c => c.year))]
    .filter(year => year != null && year !== "All year" && year !== "all")
    .map(year => parseInt(year))
    .filter(year => !isNaN(year))
    .sort((a, b) => a - b);
  
  console.log("📊 Generated filter options:", {
    departments: departmentOptions,
    academicYears: allAcademicYears,
    semesters: semesterOptions,
    years: yearOptions
  });
  
  const options = {
    departments: departmentOptions,
    academicYears: allAcademicYears,
    semesters: semesterOptions,
    years: yearOptions,
    selectable: ["yes", "no"],
  };
  
  return options;
};

export const calculateCourseStats = (courses) => ({
  totalCourses: courses.length,
  totalStudents: courses.reduce((sum, c) => sum + (c.students || 0), 0),
  avgLessons: courses.length ? courses.reduce((sum, c) => sum + (c.lessons || 0), 0) / courses.length : 0,
});

export const validateCourseData = (formData) => {
  const errors = {};
  
  if (!formData.courseTitle || !formData.courseTitle.trim()) {
    errors.courseTitle = "Course title is required";
  }
  if (!formData.courseCode || !formData.courseCode.trim()) {
    errors.courseCode = "Course code is required";
  }
  if (!formData.department) {
    errors.department = "Department is required";
  }
  if (!formData.academicYear) {
    errors.academicYear = "Academic year is required";
  }
  if (!formData.semester) {
    errors.semester = "Semester is required";
  }
  if (!formData.lecturer) {
    errors.lecturer = "Lecturer is required";
  }
  
  for (const [field, rules] of Object.entries(courseValidationRules)) {
    const value = formData[field];
    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message;
    }
    if (value && rules.maxLength && value.length > rules.maxLength) {
      errors[field] = rules.message;
    }
  }
  
  return errors;
};

export const isCourseCodeExists = (code, courses, excludeId = null) => {
  return courses.some(c => c.code === code && (excludeId === null || c.id !== excludeId));
};

export const getCourseById = (id, courses) => {
  return courses.find(c => c.id === id) || null;
};

// Helper functions for course page enrollment
export const getEnrollmentFormFields = (courseData, departments) => {
  if (!courseData || !departments) return [];

  const academicYearOptions = getAcademicYearOptionsForDepartment(
    courseData.department, 
    departments
  );

  const fields = [
    {
      name: "studentName",
      label: "Student Name",
      type: "text",
      required: true,
      placeholder: "Enter student full name"
    },
    {
      name: "studentEmail",
      label: "Student Email",
      type: "email",
      required: true,
      placeholder: "Enter student email"
    },
    {
      name: "academicYear",
      label: "Academic Year",
      type: "select",
      required: true,
      options: academicYearOptions,
      placeholder: "Select academic year"
    },
    {
      name: "semester",
      label: "Semester",
      type: "select",
      required: true,
      options: semesterOptions,
      placeholder: "Select semester"
    }
  ];

  return fields;
};

export const COURSES_PER_PAGE = 12;

// FIXED: Default filters to ensure proper initial state
export const DEFAULT_FILTERS = { 
  department: "all", 
  academicYear: "all", 
  semester: "all", 
  year: "all", 
  selectable: "all" 
};