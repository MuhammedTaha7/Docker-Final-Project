import React from "react";
import Math from "../../Assets/Courses/math.jpg";
import DataStructure from "../../Assets/Courses/datastructure.jpg";
import Physics from "../../Assets/Courses/physics.png";
import Economy from "../../Assets/Courses/economy.jpg";

// =============================================================================
// PROGRAM CONFIGURATION
// =============================================================================

/**
 * Program configurations - defines the structure of each academic program
 * Each program has: name, duration (years), available years, and description
 */
export const programConfig = {
  "Certificate IT": {
    name: "Certificate IT",
    duration: 1,
    years: ["1"],
    description: "1-year Certificate Program in Basic IT Skills"
  },
  "Business Diploma": {
    name: "Business Diploma",
    duration: 2,
    years: ["1", "2"],
    description: "2-year Diploma Program in Business Administration"
  },
  "Information Systems": {
    name: "Information Systems",
    duration: 3,
    years: ["1", "2", "3"],
    description: "3-year Bachelor Program in Information Systems"
  },
  "Nursing": {
    name: "Nursing",
    duration: 4,
    years: ["1", "2", "3", "4"],
    description: "4-year Bachelor Program in Nursing"
  }
};

// =============================================================================
// SEMESTER CONFIGURATION
// =============================================================================

/**
 * Available semesters for all programs
 */
export const semesterOptions = ["1", "2", "3"];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get year options for a specific program (for Academic Year field in form)
 * @param {string} groupName - The program/group name
 * @returns {Array<string>} Array of year options
 */
export const getYearOptionsForGroup = (groupName) => {
  const program = programConfig[groupName];
  if (!program) return [];
  return program.years;
};

/**
 * Get all available program groups
 * @returns {Array<string>} Array of program names
 */
export const getAllGroups = () => {
  return Object.keys(programConfig);
};

/**
 * Get academic year options for a specific group
 * @param {string} groupName - The program/group name
 * @returns {Array<string>} Array of academic year options
 */
export const getAcademicYearOptionsForGroup = (groupName) => {
  return ["2023-24", "2024-25", "2025-26"];
};

// =============================================================================
// CONTENT CONFIGURATION FUNCTIONS
// =============================================================================

/**
 * Get content configuration for course pages
 * @param {string|number} courseId - The course ID
 * @returns {Object} Course configuration object
 */
export const getContentConfig = (courseId) => {
  try {
    const numericId = parseInt(courseId);
    if (courseSpecificData[numericId]) {
      console.log(`Content config found for course ID: ${courseId}`);
      console.log(courseSpecificData[numericId]);
      return courseSpecificData[numericId];
    }
    console.warn(`No course data found for ID: ${courseId}, using default configuration`);
    return courseSpecificData.default;
  } catch (error) {
    console.error(`Error getting content config for course ID: ${courseId}`, error);
    return courseSpecificData.default;
  }
};

/**
 * Get course chart data by ID
 * @param {string|number} courseId - The course ID
 * @returns {Object} Chart data configuration
 */
export const getCourseChartData = (courseId) => {
  try {
    const numericId = parseInt(courseId);
    return courseSpecificData[numericId]?.chartData || courseSpecificData.default.chartData;
  } catch (error) {
    console.error(`Error getting chart data for course ID: ${courseId}`, error);
    return courseSpecificData.default.chartData;
  }
};

/**
 * Get course materials by ID
 * @param {string|number} courseId - The course ID
 * @returns {Array} Array of course materials
 */
export const getCourseMaterials = (courseId) => {
  try {
    const numericId = parseInt(courseId);
    return courseSpecificData[numericId]?.materials || [];
  } catch (error) {
    console.error(`Error getting materials for course ID: ${courseId}`, error);
    return [];
  }
};

/**
 * Get course announcements by ID
 * @param {string|number} courseId - The course ID
 * @returns {Array} Array of course announcements
 */
export const getCourseAnnouncements = (courseId) => {
  try {
    const numericId = parseInt(courseId);
    return courseSpecificData[numericId]?.announcements || [];
  } catch (error) {
    console.error(`Error getting announcements for course ID: ${courseId}`, error);
    return [];
  }
};

// =============================================================================
// MOCK DATA
// =============================================================================

/**
 * Mock course categories for file management
 */
export const mockCourseCategories = [
  {
    id: 1,
    name: "Presentations",
    description: "Lecture slides and presentation materials",
    color: "#3b82f6",
    files: [
      {
        id: 1,
        name: "Week 1 - Introduction.pptx",
        size: "2.5 MB",
        uploadDate: "2024-01-15",
        type: "presentation",
        url: "/files/presentations/week1-introduction.pptx",
      },
      {
        id: 2,
        name: "Week 2 - Fundamentals.pptx",
        size: "3.2 MB",
        uploadDate: "2024-01-22",
        type: "presentation",
        url: "/files/presentations/week2-fundamentals.pptx",
      },
    ],
  },
  {
    id: 2,
    name: "Syllabus",
    description: "Course syllabus and curriculum",
    color: "#10b981",
    files: [
      {
        id: 3,
        name: "Course Syllabus 2024.pdf",
        size: "1.2 MB",
        uploadDate: "2024-01-10",
        type: "document",
        url: "/files/syllabus/course-syllabus-2024.pdf",
      },
    ],
  },
  {
    id: 3,
    name: "Assignments",
    description: "Homework and assignment files",
    color: "#f59e0b",
    files: [
      {
        id: 4,
        name: "Assignment 1 - Research Paper.pdf",
        size: "800 KB",
        uploadDate: "2024-01-20",
        type: "document",
        url: "/files/assignments/assignment1-research-paper.pdf",
      },
      {
        id: 5,
        name: "Assignment Template.docx",
        size: "150 KB",
        uploadDate: "2024-01-18",
        type: "document",
        url: "/files/assignments/assignment-template.docx",
      },
    ],
  },
];

// =============================================================================
// COURSE SPECIFIC DATA
// =============================================================================

/**
 * Course-specific data for individual course pages
 * Contains detailed information for each course including:
 * - Course details
 * - Chart data for analytics
 * - Progress tracking
 * - Statistics
 * - Materials and announcements
 */
export const courseSpecificData = {
  // Certificate IT - Computer Fundamentals (Year 1, Semester 1)
  101: {
    courseDetails: {
      id: 101,
      courseCode: "CERT101",
      courseType: "Lecture",
      courseTitle: "Computer Fundamentals",
      instructor: "Dr. Ahmad Hassan",
      minPassingGrade: "50",
      enrolledStudents: 30,
      classTiming: "Monday 09:00 - 11:00",
      location: "Room 101, IT Building",
      faculty: "Certificate Program",
      language: "English",
      assignments: 4,
      practicalType: "Computer Lab",
      finalExam: "Included",
      prerequisite: "None",
      academicYear: "1",
      semester: "1",
      group: "Certificate IT",
      year: "2025",
      credits: 3,
      description: "Introduction to computer systems and hardware basics",
      students: 30,
      rating: 4.2,
      lessons: 12,
      img: DataStructure,
      selectable: "yes",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 85 },
        { id: "Missed", label: "Missed", value: 15 },
      ],
      progress: [
        { id: "attendant", value: 45 },
        { id: "not attendant", value: 35 },
        { id: "approved", value: 20 },
      ],
      gradeDistribution: [
        { Group: "A (90-100)", "First year": 5, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 8, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 10, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 4, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 3, "Second year": 0, "Third year": 0 },
      ],
      assignmentProgress: [
        { id: "Completed", color: "hsl(167, 70%, 50%)", data: [
          { x: "Assignment 1", y: 25 },
          { x: "Assignment 2", y: 23 },
          { x: "Assignment 3", y: 24 },
          { x: "Assignment 4", y: 22 },
        ]},
        { id: "On Time", color: "hsl(210, 70%, 50%)", data: [
          { x: "Assignment 1", y: 22 },
          { x: "Assignment 2", y: 20 },
          { x: "Assignment 3", y: 21 },
          { x: "Assignment 4", y: 20 },
        ]},
      ],
      barChartData: [
        { Group: "Week 1", Attended: 28, AttendedColor: "hsl(167, 70%, 50%)", Missed: 2, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 2", Attended: 26, AttendedColor: "hsl(167, 70%, 50%)", Missed: 4, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 3", Attended: 29, AttendedColor: "hsl(167, 70%, 50%)", Missed: 1, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 4", Attended: 27, AttendedColor: "hsl(167, 70%, 50%)", Missed: 3, MissedColor: "hsl(0, 70%, 50%)" },
      ],
    },
    progressData: [
      { id: "attendant", label: "Attendant", value: 45 },
      { id: "not attendant", label: "Not Attendant", value: 35 },
      { id: "approved", label: "Approved", value: 20 },
    ],
    stats: {
      overallProgress: 65,
      progressStatus: "On Track",
      attendanceRate: 85,
      nextAssignmentDays: 7,
      completedTasks: { completed: 2, total: 4 },
      currentGPA: 3.2,
    },
    materials: [
      { title: "Course Readings", files: [
        { title: "Introduction to Computers", link: "/files/intro-computers.pdf" },
        { title: "Hardware Basics", link: "/files/hardware-basics.pdf" },
      ]},
      { title: "Lecture Files", files: [
        { title: "Lecture 1 - Computer History", link: "/files/lecture1-history.pdf" },
        { title: "Lecture 2 - Operating Systems", link: "/files/lecture2-os.pdf" },
      ]},
    ],
    announcements: [
      { title: "Computer Assembly Lab - March 25, 2025", content: "Hands-on computer assembly session scheduled. Please bring your lab notebooks." },
      { title: "Mid-term Exam - April 5, 2025", content: "Mid-term examination covers chapters 1-6. Review sessions available on request." },
    ],
  },
  // Certificate IT - Microsoft Office Suite (Year 1, Semester 1)
  102: {
    courseDetails: {
      id: 102,
      courseCode: "CERT102",
      courseType: "Lecture + Lab",
      courseTitle: "Microsoft Office Suite",
      instructor: "Ms. Layla Mahmoud",
      minPassingGrade: "50",
      enrolledStudents: 30,
      classTiming: "Tuesday 10:00 - 12:00",
      location: "Room 102, IT Building",
      faculty: "Certificate Program",
      language: "English",
      assignments: 5,
      practicalType: "Computer Lab",
      finalExam: "Practical Assessment",
      prerequisite: "Computer Fundamentals",
      academicYear: "1",
      semester: "1",
      group: "Certificate IT",
      year: "2025",
      credits: 3,
      description: "Mastering Microsoft Office tools for professional use",
      students: 30,
      rating: 4.5,
      lessons: 10,
      img: DataStructure,
      selectable: "yes",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 88 },
        { id: "Missed", label: "Missed", value: 12 },
      ],
      progress: [
        { id: "attendant", value: 52 },
        { id: "not attendant", value: 28 },
        { id: "approved", value: 20 },
      ],
      gradeDistribution: [
        { Group: "A (90-100)", "First year": 6, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 9, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 10, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 3, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 2, "Second year": 0, "Third year": 0 },
      ],
      assignmentProgress: [
        { id: "Completed", color: "hsl(167, 70%, 50%)", data: [
          { x: "Assignment 1", y: 28 },
          { x: "Assignment 2", y: 27 },
          { x: "Assignment 3", y: 26 },
          { x: "Assignment 4", y: 25 },
          { x: "Assignment 5", y: 24 },
        ]},
        { id: "On Time", color: "hsl(210, 70%, 50%)", data: [
          { x: "Assignment 1", y: 25 },
          { x: "Assignment 2", y: 24 },
          { x: "Assignment 3", y: 23 },
          { x: "Assignment 4", y: 22 },
          { x: "Assignment 5", y: 21 },
        ]},
      ],
      barChartData: [
        { Group: "Week 1", Attended: 27, AttendedColor: "hsl(167, 70%, 50%)", Missed: 3, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 2", Attended: 29, AttendedColor: "hsl(167, 70%, 50%)", Missed: 1, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 3", Attended: 28, AttendedColor: "hsl(167, 70%, 50%)", Missed: 2, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 4", Attended: 27, AttendedColor: "hsl(167, 70%, 50%)", Missed: 3, MissedColor: "hsl(0, 70%, 50%)" },
      ],
    },
    progressData: [
      { id: "attendant", label: "Attendant", value: 52 },
      { id: "not attendant", label: "Not Attendant", value: 28 },
      { id: "approved", label: "Approved", value: 20 },
    ],
    stats: {
      overallProgress: 72,
      progressStatus: "On Track",
      attendanceRate: 88,
      nextAssignmentDays: 6,
      completedTasks: { completed: 3, total: 5 },
      currentGPA: 3.5,
    },
    materials: [
      { title: "Course Materials", files: [
        { title: "Word Processing Basics", link: "/files/word-basics.pdf" },
        { title: "Excel Fundamentals", link: "/files/excel-basics.pdf" },
        { title: "PowerPoint Essentials", link: "/files/powerpoint-basics.pdf" },
      ]},
      { title: "Lab Materials", files: [
        { title: "Lab 1 - Word Document", link: "/files/lab1-word.pdf" },
        { title: "Lab 2 - Excel Spreadsheet", link: "/files/lab2-excel.pdf" },
      ]},
    ],
    announcements: [
      { title: "Practical Exam - April 10, 2025", content: "Hands-on exam covering Word, Excel, and PowerPoint skills." },
      { title: "Office Workshop - April 3, 2025", content: "Advanced Excel workshop. Attendance mandatory." },
    ],
  },
  // Business Diploma - Introduction to Business (Year 1, Semester 1)
  201: {
    courseDetails: {
      id: 201,
      courseCode: "DIP101",
      courseType: "Lecture",
      courseTitle: "Introduction to Business",
      instructor: "Prof. Sarah Al-Mahmoud",
      minPassingGrade: "55",
      enrolledStudents: 60,
      classTiming: "Tuesday 10:00 - 12:00",
      location: "Room 205, Business Hall",
      faculty: "Business Administration",
      language: "English",
      assignments: 6,
      practicalType: "Case Study Analysis",
      finalExam: "Included",
      prerequisite: "None",
      academicYear: "1",
      semester: "1",
      group: "Business Diploma",
      year: "2025",
      credits: 4,
      description: "Overview of business concepts and practices",
      students: 60,
      rating: 4.0,
      lessons: 14,
      img: Economy,
      selectable: "yes",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 78 },
        { id: "Missed", label: "Missed", value: 22 },
      ],
      progress: [
        { id: "attendant", value: 40 },
        { id: "not attendant", value: 30 },
        { id: "approved", value: 30 },
      ],
      gradeDistribution: [
        { Group: "A (90-100)", "First year": 5, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 10, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 15, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 20, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 10, "Second year": 0, "Third year": 0 },
      ],
      assignmentProgress: [
        { id: "Completed", color: "hsl(167, 70%, 50%)", data: [
          { x: "Assignment 1", y: 50 },
          { x: "Assignment 2", y: 48 },
          { x: "Assignment 3", y: 45 },
          { x: "Assignment 4", y: 47 },
          { x: "Assignment 5", y: 46 },
          { x: "Assignment 6", y: 44 },
        ]},
        { id: "On Time", color: "hsl(210, 70%, 50%)", data: [
          { x: "Assignment 1", y: 45 },
          { x: "Assignment 2", y: 43 },
          { x: "Assignment 3", y: 40 },
          { x: "Assignment 4", y: 42 },
          { x: "Assignment 5", y: 41 },
          { x: "Assignment 6", y: 39 },
        ]},
      ],
      barChartData: [
        { Group: "Week 1", Attended: 55, AttendedColor: "hsl(167, 70%, 50%)", Missed: 5, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 2", Attended: 48, AttendedColor: "hsl(167, 70%, 50%)", Missed: 12, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 3", Attended: 52, AttendedColor: "hsl(167, 70%, 50%)", Missed: 8, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 4", Attended: 47, AttendedColor: "hsl(167, 70%, 50%)", Missed: 13, MissedColor: "hsl(0, 70%, 50%)" },
      ],
    },
    progressData: [
      { id: "attendant", label: "Attendant", value: 40 },
      { id: "not attendant", label: "Not Attendant", value: 30 },
      { id: "approved", label: "Approved", value: 30 },
    ],
    stats: {
      overallProgress: 60,
      progressStatus: "Needs Improvement",
      attendanceRate: 78,
      nextAssignmentDays: 8,
      completedTasks: { completed: 3, total: 6 },
      currentGPA: 2.8,
    },
    materials: [
      { title: "Course Readings", files: [
        { title: "Business Environment", link: "/files/business-env.pdf" },
        { title: "Types of Business Organizations", link: "/files/business-types.pdf" },
      ]},
      { title: "Case Studies", files: [
        { title: "Case Study 1 - Startup Analysis", link: "/files/case1-startup.pdf" },
        { title: "Case Study 2 - Market Entry", link: "/files/case2-market.pdf" },
      ]},
    ],
    announcements: [
      { title: "Business Plan Presentation - April 15, 2025", content: "Students will present their business plan projects. Each presentation should be 10-15 minutes." },
      { title: "Guest Speaker - Entrepreneur Session", content: "Local entrepreneur will share insights on starting a business. Don't miss this opportunity!" },
    ],
  },
  // Business Diploma - Marketing Fundamentals (Year 1, Semester 2)
  205: {
    courseDetails: {
      id: 205,
      courseCode: "DIP105",
      courseType: "Lecture + Workshop",
      courseTitle: "Marketing Fundamentals",
      instructor: "Dr. Mahmoud Saleh",
      minPassingGrade: "55",
      enrolledStudents: 55,
      classTiming: "Monday 14:00 - 16:00",
      location: "Room 210, Business Hall",
      faculty: "Business Administration",
      language: "English",
      assignments: 5,
      practicalType: "Marketing Campaign Project",
      finalExam: "Included + Presentation",
      prerequisite: "Introduction to Business",
      academicYear: "1",
      semester: "2",
      group: "Business Diploma",
      year: "2025",
      credits: 3,
      description: "Core concepts of marketing and campaign design",
      students: 55,
      rating: 4.1,
      lessons: 12,
      img: Economy,
      selectable: "yes",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 82 },
        { id: "Missed", label: "Missed", value: 18 },
      ],
      progress: [
        { id: "attendant", value: 48 },
        { id: "not attendant", value: 32 },
        { id: "approved", value: 20 },
      ],
      gradeDistribution: [
        { Group: "A (90-100)", "First year": 6, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 10, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 15, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 14, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 10, "Second year": 0, "Third year": 0 },
      ],
      assignmentProgress: [
        { id: "Completed", color: "hsl(167, 70%, 50%)", data: [
          { x: "Assignment 1", y: 45 },
          { x: "Assignment 2", y: 43 },
          { x: "Assignment 3", y: 44 },
          { x: "Assignment 4", y: 42 },
          { x: "Assignment 5", y: 41 },
        ]},
        { id: "On Time", color: "hsl(210, 70%, 50%)", data: [
          { x: "Assignment 1", y: 40 },
          { x: "Assignment 2", y: 38 },
          { x: "Assignment 3", y: 39 },
          { x: "Assignment 4", y: 37 },
          { x: "Assignment 5", y: 36 },
        ]},
      ],
      barChartData: [
        { Group: "Week 1", Attended: 52, AttendedColor: "hsl(167, 70%, 50%)", Missed: 3, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 2", Attended: 49, AttendedColor: "hsl(167, 70%, 50%)", Missed: 6, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 3", Attended: 51, AttendedColor: "hsl(167, 70%, 50%)", Missed: 4, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 4", Attended: 50, AttendedColor: "hsl(167, 70%, 50%)", Missed: 5, MissedColor: "hsl(0, 70%, 50%)" },
      ],
    },
    progressData: [
      { id: "attendant", label: "Attendant", value: 48 },
      { id: "not attendant", label: "Not Attendant", value: 32 },
      { id: "approved", label: "Approved", value: 20 },
    ],
    stats: {
      overallProgress: 68,
      progressStatus: "On Track",
      attendanceRate: 82,
      nextAssignmentDays: 5,
      completedTasks: { completed: 3, total: 5 },
      currentGPA: 3.0,
    },
    materials: [
      { title: "Course Materials", files: [
        { title: "Marketing Principles", link: "/files/marketing-principles.pdf" },
        { title: "Consumer Behavior", link: "/files/consumer-behavior.pdf" },
      ]},
      { title: "Workshop Materials", files: [
        { title: "Campaign Design Guide", link: "/files/campaign-design.pdf" },
        { title: "Market Analysis Template", link: "/files/market-analysis.pdf" },
      ]},
    ],
    announcements: [
      { title: "Marketing Campaign Presentations - May 15, 2025", content: "Final marketing campaign presentations. Each team has 20 minutes." },
      { title: "Guest Lecture - Marketing Expert", content: "Industry expert to discuss modern marketing trends on April 20, 2025." },
    ],
  },
  // Information Systems - Programming Fundamentals (Year 1, Semester 1)
  302: {
    courseDetails: {
      id: 302,
      courseCode: "CS101",
      courseType: "Lecture + Lab",
      courseTitle: "Programming Fundamentals",
      instructor: "Dr. Omar Khalil",
      minPassingGrade: "60",
      enrolledStudents: 45,
      classTiming: "Wednesday 14:00 - 17:00",
      location: "Room 301, Computer Science Building",
      faculty: "Information Systems",
      language: "English",
      assignments: 8,
      practicalType: "Programming Lab",
      finalExam: "Included + Project",
      prerequisite: "Mathematics for IT",
      academicYear: "1",
      semester: "1",
      group: "Information Systems",
      year: "2025",
      credits: 4,
      description: "Introduction to programming concepts using Python",
      students: 45,
      rating: 4.3,
      lessons: 16,
      img: DataStructure,
      selectable: "yes",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 89 },
        { id: "Missed", label: "Missed", value: 11 },
      ],
      progress: [
        { id: "attendant", value: 65 },
        { id: "not attendant", value: 20 },
        { id: "approved", value: 15 },
      ],
      gradeDistribution: [
        { Group: "A (90-100)", "First year": 8, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 12, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 15, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 7, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 3, "Second year": 0, "Third year": 0 },
      ],
      assignmentProgress: [
        { id: "Completed", color: "hsl(167, 70%, 50%)", data: [
          { x: "Assignment 1", y: 40 },
          { x: "Assignment 2", y: 38 },
          { x: "Assignment 3", y: 39 },
          { x: "Assignment 4", y: 37 },
          { x: "Assignment 5", y: 36 },
          { x: "Assignment 6", y: 35 },
          { x: "Assignment 7", y: 34 },
          { x: "Assignment 8", y: 33 },
        ]},
        { id: "On Time", color: "hsl(210, 70%, 50%)", data: [
          { x: "Assignment 1", y: 35 },
          { x: "Assignment 2", y: 33 },
          { x: "Assignment 3", y: 34 },
          { x: "Assignment 4", y: 32 },
          { x: "Assignment 5", y: 31 },
          { x: "Assignment 6", y: 30 },
          { x: "Assignment 7", y: 29 },
          { x: "Assignment 8", y: 28 },
        ]},
      ],
      barChartData: [
        { Group: "Week 1", Attended: 42, AttendedColor: "hsl(167, 70%, 50%)", Missed: 3, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 2", Attended: 40, AttendedColor: "hsl(167, 70%, 50%)", Missed: 5, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 3", Attended: 43, AttendedColor: "hsl(167, 70%, 50%)", Missed: 2, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 4", Attended: 41, AttendedColor: "hsl(167, 70%, 50%)", Missed: 4, MissedColor: "hsl(0, 70%, 50%)" },
      ],
    },
    progressData: [
      { id: "attendant", label: "Attendant", value: 65 },
      { id: "not attendant", label: "Not Attendant", value: 20 },
      { id: "approved", label: "Approved", value: 15 },
    ],
    stats: {
      overallProgress: 80,
      progressStatus: "On Track",
      attendanceRate: 89,
      nextAssignmentDays: 4,
      completedTasks: { completed: 5, total: 8 },
      currentGPA: 3.6,
    },
    materials: [
      { title: "Course Readings", files: [
        { title: "Python Programming Basics", link: "/files/python-basics.pdf" },
        { title: "Algorithm Design", link: "/files/algorithm-design.pdf" },
      ]},
      { title: "Lab Materials", files: [
        { title: "Lab 1 - Variables and Data Types", link: "/files/lab1-variables.pdf" },
        { title: "Lab 2 - Control Structures", link: "/files/lab2-control.pdf" },
        { title: "Programming Examples", link: "/files/code-examples.zip" },
      ]},
    ],
    announcements: [
      { title: "Programming Contest - April 20, 2025", content: "Annual programming contest open to all students. Prizes for top 3 winners!" },
      { title: "Final Project Guidelines Released", content: "Final project requirements are now available. Projects must be submitted by May 10, 2025." },
    ],
  },
  // Information Systems - Data Structures & Algorithms (Year 2, Semester 1)
  311: {
    courseDetails: {
      id: 311,
      courseCode: "CS201",
      courseType: "Lecture + Lab",
      courseTitle: "Data Structures & Algorithms",
      instructor: "Dr. Rashid Al-Khatib",
      minPassingGrade: "60",
      enrolledStudents: 38,
      classTiming: "Monday 10:00 - 13:00",
      location: "Room 205, Computer Science Building",
      faculty: "Information Systems",
      language: "English",
      assignments: 6,
      practicalType: "Algorithm Implementation Lab",
      finalExam: "Included + Project",
      prerequisite: "Programming Fundamentals",
      academicYear: "2",
      semester: "1",
      group: "Information Systems",
      year: "2025",
      credits: 4,
      description: "Study of data structures and algorithm design",
      students: 38,
      rating: 4.4,
      lessons: 15,
      img: DataStructure,
      selectable: "yes",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 87 },
        { id: "Missed", label: "Missed", value: 13 },
      ],
      progress: [
        { id: "attendant", value: 58 },
        { id: "not attendant", value: 25 },
        { id: "approved", value: 17 },
      ],
      gradeDistribution: [
        { Group: "A (90-100)", "First year": 0, "Second year": 8, "Third year": 0 },
        { Group: "B (80-89)", "First year": 0, "Second year": 12, "Third year": 0 },
        { Group: "C (70-79)", "First year": 0, "Second year": 10, "Third year": 0 },
        { Group: "D (60-69)", "First year": 0, "Second year": 6, "Third year": 0 },
        { Group: "F (<60)", "First year": 0, "Second year": 2, "Third year": 0 },
      ],
      assignmentProgress: [
        { id: "Completed", color: "hsl(167, 70%, 50%)", data: [
          { x: "Assignment 1", y: 35 },
          { x: "Assignment 2", y: 33 },
          { x: "Assignment 3", y: 36 },
          { x: "Assignment 4", y: 34 },
          { x: "Assignment 5", y: 32 },
          { x: "Assignment 6", y: 30 },
        ]},
        { id: "On Time", color: "hsl(210, 70%, 50%)", data: [
          { x: "Assignment 1", y: 32 },
          { x: "Assignment 2", y: 30 },
          { x: "Assignment 3", y: 34 },
          { x: "Assignment 4", y: 33 },
          { x: "Assignment 5", y: 29 },
          { x: "Assignment 6", y: 28 },
        ]},
      ],
      barChartData: [
        { Group: "Week 1", Attended: 35, AttendedColor: "hsl(167, 70%, 50%)", Missed: 3, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 2", Attended: 33, AttendedColor: "hsl(167, 70%, 50%)", Missed: 5, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 3", Attended: 36, AttendedColor: "hsl(167, 70%, 50%)", Missed: 2, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 4", Attended: 34, AttendedColor: "hsl(167, 70%, 50%)", Missed: 4, MissedColor: "hsl(0, 70%, 50%)" },
      ],
    },
    progressData: [
      { id: "attendant", label: "Attendant", value: 58 },
      { id: "not attendant", label: "Not Attendant", value: 25 },
      { id: "approved", label: "Approved", value: 17 },
    ],
    stats: {
      overallProgress: 75,
      progressStatus: "On Track",
      attendanceRate: 87,
      nextAssignmentDays: 5,
      completedTasks: { completed: 4, total: 6 },
      currentGPA: 3.6,
    },
    materials: [
      { title: "Course Readings", files: [
        { title: "Data Structures Fundamentals", link: "/files/data-structures.pdf" },
        { title: "Algorithm Analysis", link: "/files/algorithm-analysis.pdf" },
      ]},
      { title: "Lab Materials", files: [
        { title: "Lab 1 - Arrays and Linked Lists", link: "/files/lab1-arrays.pdf" },
        { title: "Lab 2 - Stacks and Queues", link: "/files/lab2-stacks.pdf" },
        { title: "Algorithm Implementation Examples", link: "/files/algo-examples.zip" },
      ]},
    ],
    announcements: [
      { title: "Algorithm Competition - May 1, 2025", content: "Inter-university algorithm competition. Registration deadline: April 15, 2025." },
      { title: "Mid-term Project Submission", content: "Implement sorting algorithms project due April 12, 2025. Include time complexity analysis." },
    ],
  },
  // Nursing - Fundamentals of Nursing (Year 1, Semester 1)
  401: {
    courseDetails: {
      id: 401,
      courseCode: "NUR101",
      courseType: "Lecture + Clinical",
      courseTitle: "Fundamentals of Nursing",
      instructor: "Prof. Dr. Fatima Al-Zahra",
      minPassingGrade: "65",
      enrolledStudents: 65,
      classTiming: "Thursday 08:00 - 12:00",
      location: "Room 401, Nursing Building + Clinical Sites",
      faculty: "Nursing",
      language: "English",
      assignments: 5,
      practicalType: "Clinical Practice",
      finalExam: "Theory + Practical",
      prerequisite: "None",
      academicYear: "1",
      semester: "1",
      group: "Nursing",
      year: "2025",
      credits: 5,
      description: "Core principles and practices of nursing care",
      students: 65,
      rating: 4.7,
      lessons: 20,
      img: Physics,
      selectable: "yes",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 92 },
        { id: "Missed", label: "Missed", value: 8 },
      ],
      progress: [
        { id: "attendant", value: 70 },
        { id: "not attendant", value: 20 },
        { id: "approved", value: 10 },
      ],
      gradeDistribution: [
        { Group: "A (90-100)", "First year": 15, "Second year": 0, "Third year": 0 },
        { Group: "B (80-89)", "First year": 20, "Second year": 0, "Third year": 0 },
        { Group: "C (70-79)", "First year": 20, "Second year": 0, "Third year": 0 },
        { Group: "D (60-69)", "First year": 8, "Second year": 0, "Third year": 0 },
        { Group: "F (<60)", "First year": 2, "Second year": 0, "Third year": 0 },
      ],
      assignmentProgress: [
        { id: "Completed", color: "hsl(167, 70%, 50%)", data: [
          { x: "Assignment 1", y: 60 },
          { x: "Assignment 2", y: 58 },
          { x: "Assignment 3", y: 59 },
          { x: "Assignment 4", y: 57 },
          { x: "Assignment 5", y: 56 },
        ]},
        { id: "On Time", color: "hsl(210, 70%, 50%)", data: [
          { x: "Assignment 1", y: 55 },
          { x: "Assignment 2", y: 53 },
          { x: "Assignment 3", y: 54 },
          { x: "Assignment 4", y: 52 },
          { x: "Assignment 5", y: 51 },
        ]},
      ],
      barChartData: [
        { Group: "Week 1", Attended: 63, AttendedColor: "hsl(167, 70%, 50%)", Missed: 2, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 2", Attended: 61, AttendedColor: "hsl(167, 70%, 50%)", Missed: 4, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 3", Attended: 64, AttendedColor: "hsl(167, 70%, 50%)", Missed: 1, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 4", Attended: 62, AttendedColor: "hsl(167, 70%, 50%)", Missed: 3, MissedColor: "hsl(0, 70%, 50%)" },
      ],
    },
    progressData: [
      { id: "attendant", label: "Attendant", value: 70 },
      { id: "not attendant", label: "Not Attendant", value: 20 },
      { id: "approved", label: "Approved", value: 10 },
    ],
    stats: {
      overallProgress: 85,
      progressStatus: "On Track",
      attendanceRate: 92,
      nextAssignmentDays: 6,
      completedTasks: { completed: 3, total: 5 },
      currentGPA: 3.8,
    },
    materials: [
      { title: "Course Readings", files: [
        { title: "Nursing Fundamentals Textbook Ch.1-5", link: "/files/nursing-fund-1-5.pdf" },
        { title: "Patient Care Guidelines", link: "/files/patient-care.pdf" },
      ]},
      { title: "Clinical Materials", files: [
        { title: "Clinical Skills Checklist", link: "/files/skills-checklist.pdf" },
        { title: "Medication Administration Guide", link: "/files/medication-guide.pdf" },
        { title: "Infection Control Protocols", link: "/files/infection-control.pdf" },
      ]},
    ],
    announcements: [
      { title: "Clinical Rotation Schedule - Week of March 28, 2025", content: "Clinical rotations will be at City General Hospital. Please arrive by 7:30 AM in proper uniform." },
      { title: "Skills Lab Assessment - April 8, 2025", content: "Practical skills assessment covering vital signs, patient positioning, and basic care procedures." },
    ],
  },
  // Nursing - Advanced Nursing Care (Year 2, Semester 1)
  411: {
    courseDetails: {
      id: 411,
      courseCode: "NUR201",
      courseType: "Lecture + Clinical",
      courseTitle: "Advanced Nursing Care",
      instructor: "Prof. Amina Hassan",
      minPassingGrade: "65",
      enrolledStudents: 58,
      classTiming: "Tuesday 08:00 - 14:00",
      location: "Room 402, Nursing Building + Advanced Clinical Sites",
      faculty: "Nursing",
      language: "English",
      assignments: 6,
      practicalType: "Advanced Clinical Practice",
      finalExam: "Theory + Advanced Practical",
      prerequisite: "Fundamentals of Nursing",
      academicYear: "2",
      semester: "1",
      group: "Nursing",
      year: "2025",
      credits: 6,
      description: "Advanced techniques in critical and specialized nursing care",
      students: 58,
      rating: 4.8,
      lessons: 22,
      img: Physics,
      selectable: "yes",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 94 },
        { id: "Missed", label: "Missed", value: 6 },
      ],
      progress: [
        { id: "attendant", value: 72 },
        { id: "not attendant", value: 18 },
        { id: "approved", value: 10 },
      ],
      gradeDistribution: [
        { Group: "A (90-100)", "First year": 0, "Second year": 15, "Third year": 0 },
        { Group: "B (80-89)", "First year": 20, "Second year": 20, "Third year": 0 },
        { Group: "C (70-79)", "First year": 15, "Second year": 15, "Third year": 0 },
        { Group: "D (60-69)", "First year": 6, "Second year": 6, "Third year": 0 },
        { Group: "F (<60)", "First year": 2, "Second year": 2, "Third year": 0 },
      ],
      assignmentProgress: [
        { id: "Completed", color: "hsl(167, 70%, 50%)", data: [
          { x: "Assignment 1", y: 55 },
          { x: "Assignment 2", y: 54 },
          { x: "Assignment 3", y: 56 },
          { x: "Assignment 4", y: 53 },
          { x: "Assignment 5", y: 52 },
          { x: "Assignment 6", y: 51 },
        ]},
        { id: "On Time", color: "hsl(210, 70%, 50%)", data: [
          { x: "Assignment 1", y: 50 },
          { x: "Assignment 2", y: 49 },
          { x: "Assignment 3", y: 51 },
          { x: "Assignment 4", y: 48 },
          { x: "Assignment 5", y: 47 },
          { x: "Assignment 6", y: 46 },
        ]},
      ],
      barChartData: [
        { Group: "Week 1", Attended: 56, AttendedColor: "hsl(167, 70%, 50%)", Missed: 2, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 2", Attended: 55, AttendedColor: "hsl(167, 70%, 50%)", Missed: 3, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 3", Attended: 57, AttendedColor: "hsl(167, 70%, 50%)", Missed: 1, MissedColor: "hsl(0, 70%, 50%)" },
        { Group: "Week 4", Attended: 56, AttendedColor: "hsl(167, 70%, 50%)", Missed: 2, MissedColor: "hsl(0, 70%, 50%)" },
      ],
    },
    progressData: [
      { id: "attendant", label: "Attendant", value: 72 },
      { id: "not attendant", label: "Not Attendant", value: 18 },
      { id: "approved", label: "Approved", value: 10 },
    ],
    stats: {
      overallProgress: 90,
      progressStatus: "On Track",
      attendanceRate: 94,
      nextAssignmentDays: 4,
      completedTasks: { completed: 4, total: 6 },
      currentGPA: 3.9,
    },
    materials: [
      { title: "Course Readings", files: [
        { title: "Advanced Nursing Techniques", link: "/files/advanced-nursing.pdf" },
        { title: "Critical Care Protocols", link: "/files/critical-care.pdf" },
      ]},
      { title: "Clinical Materials", files: [
        { title: "Advanced Skills Checklist", link: "/files/advanced-skills.pdf" },
        { title: "Emergency Procedures", link: "/files/emergency-procedures.pdf" },
      ]},
    ],
    announcements: [
      { title: "Advanced Clinical Rotation - April 1, 2025", content: "Rotations at Regional Medical Center. Ensure all certifications are up to date." },
      { title: "Practical Exam - April 15, 2025", content: "Assessment on advanced clinical skills. Review critical care protocols." },
    ],
  },
  // Default fallback for courses without specific data
  default: {
    courseDetails: {
      id: 0,
      courseCode: "DEFAULT",
      courseType: "Lecture",
      courseTitle: "Course Details",
      instructor: "TBA",
      minPassingGrade: "50",
      enrolledStudents: 0,
      classTiming: "TBA",
      location: "TBA",
      faculty: "TBA",
      language: "English",
      assignments: 0,
      practicalType: "None",
      finalExam: "TBA",
      prerequisite: "None",
      academicYear: "1",
      semester: "1",
      group: "Unknown",
      year: "2025",
      credits: 0,
      description: "Course description not available",
      students: 0,
      rating: 0,
      lessons: 0,
      img: DataStructure,
      selectable: "no",
    },
    chartData: {
      attendance: [
        { id: "Attended", label: "Attended", value: 0 },
        { id: "Missed", label: "Missed", value: 0 },
      ],
      progress: [
        { id: "attendant", value: 0 },
        { id: "not attendant", value: 0 },
        { id: "approved", value: 0 },
      ],
      gradeDistribution: [],
      assignmentProgress: [],
      barChartData: [],
    },
    progressData: [
      { id: "attendant", label: "Attendant", value: 0 },
      { id: "not attendant", label: "Not Attendant", value: 0 },
      { id: "approved", label: "Approved", value: 0 },
    ],
    stats: {
      overallProgress: 0,
      progressStatus: "N/A",
      attendanceRate: 0,
      nextAssignmentDays: 0,
      completedTasks: { completed: 0, total: 0 },
      currentGPA: 0,
    },
    materials: [],
    announcements: [
      { title: "Course Information", content: "Course details will be updated soon." },
    ],
  },
};

// =============================================================================
// COURSES LIST - ALL AVAILABLE COURSES
// =============================================================================

/**
 * Complete list of all courses available in the system
 * Organized by program with all course information
 */
const coursesList = [
  // Certificate Program (1 Year) - Basic IT Skills
  { id: 101, code: "CERT101", title: "Computer Fundamentals", students: 30, lessons: 12, year: "2025", semester: "1", group: "Certificate IT", img: DataStructure, academicYear: "1" },
  { id: 102, code: "CERT102", title: "Microsoft Office Suite", students: 30, lessons: 12, year: "2025", semester: "1", group: "Certificate IT", img: DataStructure, academicYear: "1" },
  { id: 103, code: "CERT103", title: "Internet & Email Basics", students: 30, lessons: 10, year: "2025", semester: "1", group: "Certificate IT", img: DataStructure, academicYear: "1" },
  { id: 104, code: "CERT201", title: "Basic Web Design", students: 28, lessons: 12, year: "2025", semester: "2", group: "Certificate IT", img: DataStructure, academicYear: "1" },
  { id: 105, code: "CERT202", title: "Digital Marketing Basics", students: 28, lessons: 12, year: "2025", semester: "2", group: "Certificate IT", img: Economy, academicYear: "1" },
  { id: 106, code: "CERT203", title: "IT Support Fundamentals", students: 28, lessons: 10, year: "2025", semester: "2", group: "Certificate IT", img: DataStructure, academicYear: "1" },
  
  // Diploma Program (2 Years) - Business Administration
  { id: 201, code: "DIP101", title: "Introduction to Business", students: 60, lessons: 14, year: "2025", semester: "1", group: "Business Diploma", img: Economy, academicYear: "1" },
  { id: 202, code: "DIP102", title: "Principles of Accounting", students: 60, lessons: 14, year: "2025", semester: "1", group: "Business Diploma", img: Economy, academicYear: "1" },
  { id: 203, code: "DIP103", title: "Business Mathematics", students: 60, lessons: 14, year: "2025", semester: "1", group: "Business Diploma", img: Math, academicYear: "1" },
  { id: 204, code: "DIP104", title: "Business Communication", students: 60, lessons: 12, year: "2025", semester: "1", group: "Business Diploma", img: Economy, academicYear: "1" },
  { id: 205, code: "DIP105", title: "Marketing Fundamentals", students: 55, lessons: 14, year: "2025", semester: "2", group: "Business Diploma", img: Economy, academicYear: "1" },
  { id: 206, code: "DIP106", title: "Human Resource Management", students: 55, lessons: 14, year: "2025", semester: "2", group: "Business Diploma", img: Economy, academicYear: "1" },
  { id: 207, code: "DIP107", title: "Business Statistics", students: 55, lessons: 13, year: "2025", semester: "2", group: "Business Diploma", img: Math, academicYear: "1" },
  { id: 208, code: "DIP108", title: "Customer Service", students: 55, lessons: 12, year: "2025", semester: "2", group: "Business Diploma", img: Economy, academicYear: "1" },
  { id: 209, code: "DIP201", title: "Advanced Accounting", students: 50, lessons: 14, year: "2025", semester: "1", group: "Business Diploma", img: Economy, academicYear: "2" },
  { id: 210, code: "DIP202", title: "Project Management", students: 50, lessons: 14, year: "2025", semester: "1", group: "Business Diploma", img: Economy, academicYear: "2" },
  { id: 211, code: "DIP203", title: "Business Law", students: 50, lessons: 13, year: "2025", semester: "1", group: "Business Diploma", img: Economy, academicYear: "2" },
  { id: 212, code: "DIP204", title: "Strategic Management", students: 48, lessons: 14, year: "2025", semester: "2", group: "Business Diploma", img: Economy, academicYear: "2" },
  { id: 213, code: "DIP205", title: "Business Internship", students: 48, lessons: 12, year: "2025", semester: "2", group: "Business Diploma", img: Economy, academicYear: "2" },
  
  // Bachelor Program (3 Years) - Information Systems
  { id: 301, code: "IS101", title: "Introduction to Information Systems", students: 45, lessons: 14, year: "2025", semester: "1", group: "Information Systems", img: DataStructure, academicYear: "1" },
  { id: 302, code: "CS101", title: "Programming Fundamentals", students: 45, lessons: 14, year: "2025", semester: "1", group: "Information Systems", img: DataStructure, academicYear: "1" },
  { id: 303, code: "MATH101", title: "Mathematics for IT", students: 45, lessons: 14, year: "2025", semester: "1", group: "Information Systems", img: Math, academicYear: "1" },
  { id: 304, code: "ENG101", title: "Technical English", students: 45, lessons: 12, year: "2025", semester: "1", group: "Information Systems", img: Math, academicYear: "1" },
  { id: 305, code: "IT101", title: "Computer Basics", students: 45, lessons: 12, year: "2025", semester: "1", group: "Information Systems", img: DataStructure, academicYear: "1" },
  { id: 306, code: "CS102", title: "Object Oriented Programming", students: 42, lessons: 14, year: "2025", semester: "2", group: "Information Systems", img: DataStructure, academicYear: "1" },
  { id: 307, code: "DB101", title: "Database Management", students: 42, lessons: 14, year: "2025", semester: "2", group: "Information Systems", img: DataStructure, academicYear: "1" },
  { id: 308, code: "MATH102", title: "Statistics for IT", students: 42, lessons: 14, year: "2025", semester: "2", group: "Information Systems", img: Math, academicYear: "1" },
  { id: 309, code: "IS102", title: "Systems Analysis", students: 42, lessons: 13, year: "2025", semester: "2", group: "Information Systems", img: DataStructure, academicYear: "1" },
  { id: 310, code: "NET101", title: "Computer Networks", students: 42, lessons: 13, year: "2025", semester: "2", group: "Information Systems", img: DataStructure, academicYear: "1" },
  { id: 311, code: "CS201", title: "Data Structures & Algorithms", students: 38, lessons: 14, year: "2025", semester: "1", group: "Information Systems", img: DataStructure, academicYear: "2" },
  { id: 312, code: "IS201", title: "Information Systems Design", students: 38, lessons: 14, year: "2025", semester: "1", group: "Information Systems", img: DataStructure, academicYear: "2" },
  { id: 313, code: "WEB201", title: "Web Development", students: 38, lessons: 13, year: "2025", semester: "1", group: "Information Systems", img: DataStructure, academicYear: "2" },
  { id: 314, code: "DB201", title: "Advanced Database Systems", students: 38, lessons: 13, year: "2025", semester: "1", group: "Information Systems", img: DataStructure, academicYear: "2" },
  { id: 315, code: "IS202", title: "Enterprise Systems", students: 35, lessons: 14, year: "2025", semester: "2", group: "Information Systems", img: DataStructure, academicYear: "2" },
  { id: 316, code: "SEC201", title: "Information Security", students: 35, lessons: 13, year: "2025", semester: "2", group: "Information Systems", img: DataStructure, academicYear: "2" },
  { id: 317, code: "MOB201", title: "Mobile App Development", students: 35, lessons: 14, year: "2025", semester: "2", group: "Information Systems", img: DataStructure, academicYear: "2" },
  { id: 318, code: "IS301", title: "System Integration", students: 32, lessons: 14, year: "2025", semester: "1", group: "Information Systems", img: DataStructure, academicYear: "3" },
  { id: 319, code: "AI301", title: "Artificial Intelligence Basics", students: 32, lessons: 14, year: "2025", semester: "1", group: "Information Systems", img: DataStructure, academicYear: "3" },
  { id: 320, code: "PROJ301", title: "Capstone Project I", students: 32, lessons: 12, year: "2025", semester: "1", group: "Information Systems", img: DataStructure, academicYear: "3" },
  { id: 321, code: "IS302", title: "IT Management", students: 30, lessons: 13, year: "2025", semester: "2", group: "Information Systems", img: DataStructure, academicYear: "3" },
  { id: 322, code: "PROJ302", title: "Capstone Project II", students: 30, lessons: 14, year: "2025", semester: "2", group: "Information Systems", img: DataStructure, academicYear: "3" },
  
  // Bachelor Program (4 Years) - Nursing
  { id: 401, code: "NUR101", title: "Fundamentals of Nursing", students: 65, lessons: 14, year: "2025", semester: "1", group: "Nursing", img: Physics, academicYear: "1" },
  { id: 402, code: "ANAT101", title: "Human Anatomy", students: 65, lessons: 14, year: "2025", semester: "1", group: "Nursing", img: Physics, academicYear: "1" },
  { id: 403, code: "PHYS101", title: "Human Physiology", students: 65, lessons: 14, year: "2025", semester: "1", group: "Nursing", img: Physics, academicYear: "1" },
  { id: 404, code: "MED101", title: "Medical Terminology", students: 65, lessons: 12, year: "2025", semester: "1", group: "Nursing", img: Physics, academicYear: "1" },
  { id: 405, code: "PSY101", title: "Psychology in Healthcare", students: 65, lessons: 12, year: "2025", semester: "1", group: "Nursing", img: Math, academicYear: "1" },
  { id: 406, code: "NUR102", title: "Nursing Practice", students: 62, lessons: 14, year: "2025", semester: "2", group: "Nursing", img: Physics, academicYear: "1" },
  { id: 407, code: "PHARM101", title: "Pharmacology Basics", students: 62, lessons: 14, year: "2025", semester: "2", group: "Nursing", img: Physics, academicYear: "1" },
  { id: 408, code: "MIC101", title: "Microbiology", students: 62, lessons: 13, year: "2025", semester: "2", group: "Nursing", img: Physics, academicYear: "1" },
  { id: 409, code: "COMM101", title: "Healthcare Communication", students: 62, lessons: 12, year: "2025", semester: "2", group: "Nursing", img: Math, academicYear: "1" },
  { id: 410, code: "ETH101", title: "Medical Ethics", students: 62, lessons: 12, year: "2025", semester: "2", group: "Nursing", img: Math, academicYear: "1" },
  { id: 411, code: "NUR201", title: "Advanced Nursing Care", students: 58, lessons: 14, year: "2025", semester: "1", group: "Nursing", img: Physics, academicYear: "2" },
  { id: 412, code: "CLIN201", title: "Clinical Assessment", students: 58, lessons: 13, year: "2025", semester: "1", group: "Nursing", img: Physics, academicYear: "2" },
  { id: 413, code: "PATH201", title: "Pathophysiology", students: 58, lessons: 13, year: "2025", semester: "1", group: "Nursing", img: Physics, academicYear: "2" },
  { id: 414, code: "PHARM201", title: "Advanced Pharmacology", students: 58, lessons: 14, year: "2025", semester: "1", group: "Nursing", img: Physics, academicYear: "2" },
  { id: 415, code: "NUR202", title: "Pediatric Nursing", students: 55, lessons: 14, year: "2025", semester: "2", group: "Nursing", img: Physics, academicYear: "2" },
  { id: 416, code: "SURG201", title: "Surgical Nursing", students: 55, lessons: 14, year: "2025", semester: "2", group: "Nursing", img: Physics, academicYear: "2" },
  { id: 417, code: "MENT201", title: "Mental Health Nursing", students: 55, lessons: 13, year: "2025", semester: "2", group: "Nursing", img: Physics, academicYear: "2" },
  { id: 418, code: "NUR301", title: "Critical Care Nursing", students: 52, lessons: 14, year: "2025", semester: "1", group: "Nursing", img: Physics, academicYear: "3" },
  { id: 419, code: "COMM301", title: "Community Health Nursing", students: 52, lessons: 14, year: "2025", semester: "1", group: "Nursing", img: Physics, academicYear: "3" },
  { id: 420, code: "RES301", title: "Nursing Research", students: 52, lessons: 13, year: "2025", semester: "1", group: "Nursing", img: Math, academicYear: "3" },
  { id: 421, code: "NUR302", title: "Leadership in Nursing", students: 50, lessons: 13, year: "2025", semester: "2", group: "Nursing", img: Physics, academicYear: "3" },
  { id: 422, code: "CLIN301", title: "Clinical Practicum", students: 50, lessons: 14, year: "2025", semester: "2", group: "Nursing", img: Physics, academicYear: "3" },
  { id: 423, code: "NUR401", title: "Advanced Clinical Practice", students: 48, lessons: 14, year: "2025", semester: "1", group: "Nursing", img: Physics, academicYear: "4" },
  { id: 424, code: "CAPSTONE401", title: "Nursing Capstone Project", students: 48, lessons: 12, year: "2025", semester: "1", group: "Nursing", img: Physics, academicYear: "4" },
  { id: 425, code: "INTERN401", title: "Professional Internship", students: 45, lessons: 14, year: "2025", semester: "2", group: "Nursing", img: Physics, academicYear: "4" },
  { id: 426, code: "PREP401", title: "NCLEX-RN Preparation", students: 45, lessons: 12, year: "2025", semester: "2", group: "Nursing", img: Physics, academicYear: "4" }
];

export default coursesList;