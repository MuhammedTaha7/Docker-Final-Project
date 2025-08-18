// src/Utils/genericProfileUtils.js
import {
  Book,
  Users,
  Award,
  TrendingUp,
  Clock,
  Star,
  FileText,
  GraduationCap,
  BookOpen,
  Calendar,
  User,
} from "lucide-react";

// Profile configurations for different entity types
export const profileConfigs = {
  student: {
    sections: ["overview", "enrollments", "grades", "requests"],
    sectionLabels: {
      overview: "Overview",
      enrollments: "Enrollments",
      grades: "Academic Records",
      messages: "Messages", // Changed from "Requests"
    },
  },
  lecturer: {
    sections: ["overview", "courses", "requests", "schedule", "resources"],
    sectionLabels: {
      overview: "Overview",
      courses: "Courses",
      requests: "Requests", // Changed from "Requests"
      schedule: "Schedule",
      resources: "Profile",
    },
  },
};

// Helper functions for file management
export const getFileInfo = (file) => {
  if (!file) return { extension: "", mimeType: "", category: "unknown" };

  const extension = file.name.split(".").pop().toLowerCase();
  const mimeType = file.type;

  let category = "document";
  if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) {
    category = "image";
  } else if (["pdf"].includes(extension)) {
    category = "pdf";
  } else if (["doc", "docx"].includes(extension)) {
    category = "word";
  } else if (["ppt", "pptx"].includes(extension)) {
    category = "presentation";
  }

  return { extension, mimeType, category };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper function to convert numerical grade to letter grade
export const getLetterGrade = (numericGrade) => {
  if (numericGrade >= 97) return "A+";
  if (numericGrade >= 93) return "A";
  if (numericGrade >= 90) return "A-";
  if (numericGrade >= 87) return "B+";
  if (numericGrade >= 83) return "B";
  if (numericGrade >= 80) return "B-";
  if (numericGrade >= 77) return "C+";
  if (numericGrade >= 73) return "C";
  if (numericGrade >= 70) return "C-";
  if (numericGrade >= 67) return "D+";
  if (numericGrade >= 60) return "D";
  return "F";
};

// ✅ FIXED: This will be replaced with API call to get student's enrolled courses
export const getStudentEnrolledCoursesOptions = async (studentId) => {
  // This should call the API to get enrolled courses for this specific student
  // For now, return empty array - will be implemented in the component
  return [];
};

// Available courses for dropdowns (this should be fetched from API)
export const getAvailableCoursesOptions = () => [
  { value: "CS101", label: "CS101 - Introduction to Computer Science" },
  { value: "CS201", label: "CS201 - Data Structures" },
  { value: "CS301", label: "CS301 - Algorithms" },
  { value: "MATH101", label: "MATH101 - Calculus I" },
  { value: "MATH201", label: "MATH201 - Calculus II" },
  { value: "PHYS101", label: "PHYS101 - Physics I" },
  { value: "ENG101", label: "ENG101 - English Composition" },
];

// ✅ FIXED: Updated grade form fields - removed semester, will use enrolled courses
export const getGradeFormFields = (enrolledCourses = []) => [
  {
    name: "courseId",
    label: "Course",
    type: "select",
    required: true,
    options: enrolledCourses,
    placeholder: "Select a course",
  },
  {
    name: "finalGrade",
    label: "Final Grade (0-100)",
    type: "number",
    required: true,
    min: 0,
    max: 100,
    step: 0.1,
    placeholder: "Enter final grade between 0 and 100",
  },
];

// ✅ FIXED: Updated edit grade form fields - removed semester
export const getEditGradeFormFields = () => [
  {
    name: "courseId",
    label: "Course",
    type: "text",
    required: true,
    disabled: true,
  },
  {
    name: "courseName",
    label: "Course Name",
    type: "text",
    required: true,
    disabled: true,
  },
  {
    name: "finalGrade",
    label: "Final Grade (0-100)",
    type: "number",
    required: true,
    min: 0,
    max: 100,
    step: 0.1,
    placeholder: "Enter final grade between 0 and 100",
  },
  {
    name: "credits",
    label: "Credits",
    type: "number",
    required: true,
    min: 1,
    max: 6,
  },
  // ✅ REMOVED: semester field as it's in course entity
];

export const getLecturerCourseFormFields = () => [
  {
    name: "courseCode",
    label: "Course to Assign",
    type: "select",
    required: true,
    options: getAvailableCoursesOptions(),
  },
  {
    name: "semester",
    label: "Semester",
    type: "select",
    required: true,
    options: getSemesterOptions(),
  },
  {
    name: "classSize",
    label: "Expected Class Size",
    type: "number",
    required: true,
    min: 1,
    max: 200,
  },
  {
    name: "notes",
    label: "Additional Notes",
    type: "textarea",
    required: false,
  },
];

export const getCourseFormFields = () => [
  {
    name: "courseCode",
    label: "Course Code",
    type: "text",
    required: true,
    pattern: "[A-Z]{2,4}[0-9]{3}",
    placeholder: "e.g., CS101",
  },
  { name: "courseName", label: "Course Name", type: "text", required: true },
  {
    name: "credits",
    label: "Credits",
    type: "number",
    required: true,
    min: 1,
    max: 6,
  },
  {
    name: "semester",
    label: "Semester",
    type: "select",
    required: true,
    options: getSemesterOptions(),
  },
  { name: "department", label: "Department", type: "text", required: true },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: false,
  },
];

export const getEnrollmentFormFields = () => [
  {
    name: "courseCode",
    label: "Course Code",
    type: "text",
    required: true,
    disabled: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "active", label: "Active" },
      { value: "dropped", label: "Dropped" },
      { value: "completed", label: "Completed" },
    ],
  },
  {
    name: "enrollmentDate",
    label: "Enrollment Date",
    type: "date",
    required: true,
  },
];

export const getScheduleFormFields = () => [
  {
    name: "day",
    label: "Day",
    type: "select",
    required: true,
    options: [
      { value: "Monday", label: "Monday" },
      { value: "Tuesday", label: "Tuesday" },
      { value: "Wednesday", label: "Wednesday" },
      { value: "Thursday", label: "Thursday" },
      { value: "Friday", label: "Friday" },
      { value: "Saturday", label: "Saturday" },
    ],
  },
  { name: "startTime", label: "Start Time", type: "time", required: true },
  { name: "endTime", label: "End Time", type: "time", required: true },
  {
    name: "availability",
    label: "Availability Status",
    type: "select",
    required: true,
    options: [
      { value: "available", label: "Available" },
      { value: "busy", label: "Busy" },
      { value: "preferred", label: "Preferred Hours" },
    ],
  },
  { name: "notes", label: "Notes", type: "textarea", required: false },
];

export const getResourceFormFields = (isEdit = false) => [
  {
    name: "type",
    label: "Document Type",
    type: "select",
    required: true,
    options: [
      { value: "cv", label: "CV/Resume" },
      { value: "education", label: "Educational Background" },
      { value: "research", label: "Research Work" },
      { value: "milestone", label: "Career Milestone" },
      { value: "publication", label: "Publication" },
      { value: "award", label: "Award/Recognition" },
    ],
  },
  {
    name: "title",
    label: "Document Title",
    type: "text",
    required: true,
    placeholder: "Enter a descriptive title for your document",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    placeholder: "Provide a detailed description of the document content",
    rows: 4,
  },
  {
    name: "file",
    label: "Upload File",
    type: "file",
    required: !isEdit,
    accept: ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.ppt,.pptx",
    helperText:
      "Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, PPT, PPTX (Max 10MB)",
  },
  {
    name: "date",
    label: "Document Date",
    type: "date",
    required: false,
    helperText: "Date when this document was created or published",
  },
  {
    name: "institution",
    label: "Institution/Organization",
    type: "text",
    required: false,
    placeholder: "Associated institution or organization",
  },
  {
    name: "url",
    label: "External URL/Link",
    type: "url",
    required: false,
    placeholder: "https://example.com/document-link",
  },
  {
    name: "tags",
    label: "Tags",
    type: "text",
    required: false,
    placeholder: "research, machine learning, AI (comma separated)",
    helperText: "Add relevant tags separated by commas",
  },
];

// Helper function to get semester options
export const getSemesterOptions = () => [
  { value: "Fall 2024", label: "Fall 2024" },
  { value: "Spring 2025", label: "Spring 2025" },
  { value: "Summer 2025", label: "Summer 2025" },
  { value: "Fall 2025", label: "Fall 2025" },
];

// Generate stat cards functions
export const generateWorkingHoursCards = (schedules = []) => {
  // Count available days
  const availableDaysSet = new Set(
    schedules
      .filter(
        (s) => s.availability === "available" || s.availability === "preferred"
      )
      .map((s) => s.day)
  );
  const availableDays = availableDaysSet.size;

  // Total weekly hours
  const totalHours = schedules.reduce((total, item) => {
    const start = new Date(`2024-01-01 ${item.startTime}`); // dummy date
    const end = new Date(`2024-01-01 ${item.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60); // diff in hours
    return total + (hours > 0 ? hours : 0);
  }, 0);

  // Office hours (assume all entries are office hours)
  const officeHours = Math.round(totalHours * 100) / 100; // round to 2 decimals

  // Preferred slots
  const preferredSlots = schedules.filter(
    (s) => s.availability === "preferred"
  ).length;

  return [
    {
      id: "weekly-hours",
      title: "Weekly Hours",
      value: `${Math.round(totalHours)}h`,
      icon: <Clock />,
      trend: null,
      description: "Total teaching & office hours",
      backgroundColor: "#6366f1",
    },
    {
      id: "available-days",
      title: "Available Days",
      value: availableDays,
      icon: <Calendar />,
      trend: null,
      description: "Days available for teaching",
      backgroundColor: "#ec4899",
    },
    {
      id: "office-hours",
      title: "Office Hours",
      value: `${Math.round(officeHours)}h`,
      icon: <Users />,
      trend: null,
      description: "Weekly consultation hours",
      backgroundColor: "#06b6d4",
    },
    {
      id: "preferred-slots",
      title: "Preferred Slots",
      value: preferredSlots,
      icon: <Star />,
      trend: null,
      description: "Preferred teaching times",
      backgroundColor: "#10b981",
    },
  ];
};

export const generateProfileCards = (resources = []) => {
  // CV Status
  const cv = resources.find((r) => r.type === "cv");
  const cvStatus = cv ? "Updated" : "Missing";
  const lastUpdate = cv ? new Date(cv.uploadDate).toLocaleDateString() : "—";

  // Education records
  const educationCount = resources.filter((r) => r.type === "education").length;

  // Research projects
  const researchCount = resources.filter((r) =>
    ["research", "publication"].includes(r.type)
  ).length;

  // Career milestones
  const milestoneCount = resources.filter((r) =>
    ["milestone", "award"].includes(r.type)
  ).length;

  return [
    {
      id: "cv-status",
      title: "CV Status",
      value: cvStatus,
      icon: <FileText />,
      trend: { value: lastUpdate, isPositive: true },
      description: "Last CV update",
      backgroundColor: "#f59e0b",
    },
    {
      id: "education-records",
      title: "Education",
      value: educationCount,
      icon: <GraduationCap />,
      trend: { value: "Degrees", isPositive: true },
      description: "Educational qualifications",
      backgroundColor: "#8b5cf6",
    },
    {
      id: "research-projects",
      title: "Research",
      value: researchCount,
      icon: <BookOpen />,
      trend: { value: "Projects", isPositive: true },
      description: "Research & publications",
      backgroundColor: "#3b82f6",
    },
    {
      id: "career-milestones",
      title: "Milestones",
      value: milestoneCount,
      icon: <Award />,
      trend: { value: "Achievements", isPositive: true },
      description: "Career achievements",
      backgroundColor: "#ef4444",
    },
  ];
};

// Column configurations for different table types
export const getColumnConfigs = (tableType) => {
  const configs = {
    "academic-records": {
      courseCode: { displayName: "Course Code", sortable: true },
      courseName: { displayName: "Course Name", sortable: true },
      finalGrade: {
        displayName: "Final Grade (%)",
        sortable: true,
        type: "number",
      },
      finalLetterGrade: {
        displayName: "Letter Grade",
        sortable: true,
        type: "status",
        statusMap: { S: "success", F: "Failure" },
      },
    },
    courses: {
      courseCode: { displayName: "Course Code", sortable: true },
      courseName: { displayName: "Course Name", sortable: true },
      credits: { displayName: "Credits", sortable: true, type: "number" },
      semester: { displayName: "Semester", sortable: true },
      department: { displayName: "Department", sortable: true },
      classSize: { displayName: "Class Size", sortable: true, type: "number" },
      status: { displayName: "Status", sortable: true, type: "status" },
    },
    messages: {
      senderName: { displayName: "From", sortable: true },
      subject: { displayName: "Subject", sortable: true },
      createdAt: { displayName: "Date", sortable: true, type: "date" },
      priority: {
        displayName: "Priority",
        sortable: true,
        type: "status",
        statusMap: {
          high: "error",
          medium: "warning",
          low: "success",
        },
      },
      status: {
        // Only include if you need status
        displayName: "Status",
        sortable: true,
        type: "status",
        statusMap: {
          read: "success",
          unread: "warning",
        },
      },
    },
    enrollments: {
      courseCode: { displayName: "Course Code", sortable: true },
      courseName: { displayName: "Course Name", sortable: true },
      credits: { displayName: "Credits", sortable: true, type: "number" },
      semester: { displayName: "Semester", sortable: true },
      instructor: { displayName: "Lecturer", sortable: true },
      status: { displayName: "Status", sortable: true, type: "status" },
    },
    "weekly-schedule": {
      day: { displayName: "Day", sortable: true },
      startTime: { displayName: "Start Time", sortable: true },
      endTime: { displayName: "End Time", sortable: true },
      availability: { displayName: "Status", sortable: true, type: "status" },
      notes: { displayName: "Notes", sortable: false },
    },
    schedules: {
      courseCode: { displayName: "Course", sortable: true },
      day: { displayName: "Day", sortable: true },
      time: { displayName: "Time", sortable: true },
    },
    documents: {
      title: { displayName: "Document Title", sortable: true },
      type: { displayName: "Type", sortable: true, type: "status" },
      institution: { displayName: "Institution", sortable: true },
      date: { displayName: "Date", sortable: true, type: "date" },
      downloads: { displayName: "Downloads", sortable: true, type: "number" },
      rating: { displayName: "Rating", sortable: true, type: "number" },
      size: { displayName: "Size", sortable: true },
    },
    files: {
      title: { displayName: "Resource Title", sortable: true },
      type: { displayName: "Type", sortable: true },
      course: { displayName: "Course", sortable: true },
      uploadDate: { displayName: "Upload Date", sortable: true, type: "date" },
      size: { displayName: "Size", sortable: true },
      downloads: { displayName: "Downloads", sortable: true, type: "number" },
      rating: { displayName: "Rating", sortable: true, type: "number" },
    },
  };

  return configs[tableType] || {};
};

// Get hidden columns for different table types
export const getHiddenColumns = (tableType) => {
  const hiddenColumns = {
    "academic-records": ["id"],
    courses: ["id", "notes"],
    enrollments: ["id"],
    "weekly-schedule": ["id"],
    schedules: ["id", "courseCode"],
    documents: ["id", "description", "url", "tags", "uploadDate"],
    files: ["id", "url", "description"],
    messages: ["id", "content", "recipientId", "senderId"],
  };

  return hiddenColumns[tableType] || ["id"];
};

// Utility functions for data processing
export const processScheduleData = (enrollments = []) => {
  const schedule = enrollments.map((enrollment, index) => ({
    id: index + 1,
    courseCode: enrollment.courseCode,
    day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][index % 5],
    time: `${9 + index}:00 - ${10 + index}:00`,
    students: Math.floor(Math.random() * 30) + 15,
  }));

  const summary = {
    weeklyHours: schedule.length,
    totalStudents: schedule.reduce((sum, item) => sum + item.students, 0),
    uniqueCourses: new Set(schedule.map((item) => item.courseCode)).size,
    totalClasses: schedule.length,
  };

  return { schedule, summary };
};

export const processResourcesData = (enrollments = []) => {
  const courseMaterials = enrollments.map((enrollment, index) => ({
    id: index + 1,
    title: `${enrollment.courseName} - Course Materials`,
    type: "Course Material",
    course: enrollment.courseCode,
    uploadDate: "2024-01-15",
    size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
    downloads: Math.floor(Math.random() * 50) + 10,
    rating: (Math.random() * 1 + 4).toFixed(1),
    url: "#",
  }));

  return { courseMaterials };
};

// Error handling utilities
export const handleAPIError = (error, defaultMessage = "An error occurred") => {
  console.error("API Error:", error);

  if (error.message) {
    return error.message;
  }

  if (error.response) {
    return error.response.data?.message || defaultMessage;
  }

  return defaultMessage;
};

// Validation utilities
export const validateGrade = (grade) => {
  const numericGrade = parseFloat(grade);
  return !isNaN(numericGrade) && numericGrade >= 0 && numericGrade <= 100;
};

export const validateTimeRange = (startTime, endTime) => {
  return startTime < endTime;
};

export const validateFileSize = (file, maxSizeMB = 10) => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

export const validateFileType = (
  file,
  allowedTypes = [
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".jpg",
    ".jpeg",
    ".png",
    ".ppt",
    ".pptx",
  ]
) => {
  const extension = "." + file.name.split(".").pop().toLowerCase();
  return allowedTypes.includes(extension);
};

/**
 * Generate dynamic stat cards for student and lecturer based on real data
 * @param {string} entityType - "student" or "lecturer"
 * @param {Object} stats - Computed stats (can be empty, we'll compute)
 * @param {Object} profileData - Full profile data from backend
 * @returns {Array} - Array of card objects for StatCardsContainer
 */
export const getStatCards = (entityType, stats = {}, profileData = {}) => {
  if (entityType === "student") {
    const grades = profileData.grades || [];
    const enrollments = profileData.enrollments || [];

    // GPA: from profileData if exists, else 0
    const gpa = profileData.gpa || 0;

    // Completed Courses: based on grades
    const completedCourses = grades.length;

    // Total Credits: sum of credits from grades
    const totalCredits = grades.reduce((sum, g) => sum + (g.credits || 0), 0);

    // Status: from profileData
    const status = profileData.status || "Unknown";

    return [
      {
        id: "gpa",
        title: "GPA",
        value: gpa,
        icon: <Award />,
        trend: { value: "Current", isPositive: true },
        description: "Grade Point Average",
        backgroundColor: "#3b82f6",
      },
      {
        id: "completed-courses",
        title: "Completed Courses",
        value: completedCourses,
        icon: <Book />,
        trend: { value: "Finished", isPositive: true },
        description: "Total completed courses",
        backgroundColor: "#10b981",
      },
      {
        id: "total-credits",
        title: "Total Credits",
        value: totalCredits,
        icon: <GraduationCap />,
        trend: { value: "Earned", isPositive: true },
        description: "Credits completed",
        backgroundColor: "#f59e0b",
      },
      {
        id: "status",
        title: "Status",
        value: status,
        icon: <User />,
        trend: null,
        description: "Academic status",
        backgroundColor:
          status.toLowerCase() === "graduated"
            ? "#059669"
            : status.toLowerCase() === "active"
            ? "#0ea5e9"
            : "#dc2626",
      },
    ];
  }

if (entityType === "lecturer") {
  // 1. Average Rating
  const avgRating = profileData.rating || 0;

  // 2. Active Courses Count - SAFE array check
  const courses = profileData.courses;
  const activeCourses = Array.isArray(courses) ? courses.length : 0;

  // 3. Employment Status
  const employmentStatus = profileData.employmentType?.split('-')[0] || "Part-time";

  // 4. Years of Experience
  const experience = profileData.experience || 0;

    return [
      {
        id: "avg-rating",
        title: "Rating",
        value: avgRating.toFixed(1),
        icon: <Star />,
        description: "Average student rating",
        backgroundColor: "#f59e0b", // amber
        trend: {
          value: `${avgRating >= 3 ? "Positive" : "Needs Review"}`,
          isPositive: avgRating >= 3,
        },
      },
      {
        id: "active-courses",
        title: "Teaching Load",
        value: activeCourses,
        icon: <Book />,
        description: `${
          activeCourses === 0
            ? "No courses assigned"
            : activeCourses === 1
            ? "1 course"
            : `${activeCourses} courses`
        }`,
        backgroundColor: "#3b82f6", // blue
        trend: {
          value: activeCourses > 0 ? "Assigned" : "Pending",
          isPositive: activeCourses > 0,
        },
      },
      {
        id: "employment-status",
        title: "Employment",
        value: employmentStatus,
        icon: <User />,
        description: profileData.employmentType || "N/A",
        backgroundColor: profileData.employmentType
          ?.toLowerCase()
          .includes("full")
          ? "#10b981" // green
          : "#f59e0b", // amber
        trend: null,
      },
      {
        id: "experience",
        title: "Experience",
        value: `${experience} yr`,
        icon: <Award />,
        description: "Years in teaching",
        backgroundColor: "#8b5cf6", // purple
        trend: {
          value: parseInt(experience) >= 5 ? "Senior" : "Early Career",
          isPositive: true,
        },
      },
    ];
  }

  return [];
};

// Export default object with all utilities
export default {
  profileConfigs,
  getFileInfo,
  formatFileSize,
  getLetterGrade,
  getAvailableCoursesOptions,
  getStudentEnrolledCoursesOptions,
  getGradeFormFields,
  getEditGradeFormFields,
  getLecturerCourseFormFields,
  getCourseFormFields,
  getEnrollmentFormFields,
  getScheduleFormFields,
  getResourceFormFields,
  getSemesterOptions,
  generateWorkingHoursCards,
  generateProfileCards,
  getColumnConfigs,
  getHiddenColumns,
  processScheduleData,
  processResourcesData,
  handleAPIError,
  validateGrade,
  validateTimeRange,
  validateFileSize,
  validateFileType,
};
