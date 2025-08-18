import studentsData from "../Static/students";
import lecturersData from "../Static/lecturers";
import { Book, Users, Award, TrendingUp } from "lucide-react";

export const availableCourses = [
  { value: "CS101", label: "CS101 - Introduction to Computer Science" },
  { value: "CS201", label: "CS201 - Data Structures" },
  { value: "CS301", label: "CS301 - Algorithms" },
  { value: "MATH101", label: "MATH101 - Calculus I" },
  { value: "MATH201", label: "MATH201 - Calculus II" },
  { value: "PHYS101", label: "PHYS101 - Physics I" },
  { value: "ENG101", label: "ENG101 - English Composition" },
];

export const lecturerResources = [
  {
    id: 1,
    type: "cv",
    title: "Academic CV",
    description: "Complete academic curriculum vitae",
    date: "2024-01-15",
    institution: "University",
    url: "/cv/academic-cv.pdf",
    tags: "cv, academic, professional",
    uploadDate: "2024-01-15",
    downloads: 45,
    rating: 4.8,
    size: "2.3 MB",
  },
  {
    id: 2,
    type: "research",
    title: "Machine Learning Research",
    description: "Current research on deep learning applications",
    date: "2024-02-01",
    institution: "Research Lab",
    url: "/research/ml-research.pdf",
    tags: "research, machine learning, AI",
    uploadDate: "2024-02-01",
    downloads: 78,
    rating: 4.9,
    size: "5.1 MB",
  },
  {
    id: 3,
    type: "publication",
    title: "Neural Networks Paper",
    description: "Published paper on neural network optimization",
    date: "2023-12-15",
    institution: "IEEE Conference",
    url: "/publications/neural-networks.pdf",
    tags: "publication, neural networks, optimization",
    uploadDate: "2023-12-15",
    downloads: 156,
    rating: 4.7,
    size: "3.8 MB",
  },
];

export const workingHoursData = [
  {
    id: 1,
    day: "Monday",
    startTime: "09:00",
    endTime: "17:00",
    availability: "available",
    notes: "Regular office hours",
  },
  {
    id: 2,
    day: "Tuesday",
    startTime: "10:00",
    endTime: "16:00",
    availability: "preferred",
    notes: "Preferred teaching hours",
  },
  {
    id: 3,
    day: "Wednesday",
    startTime: "09:00",
    endTime: "15:00",
    availability: "busy",
    notes: "Research time",
  },
  {
    id: 4,
    day: "Thursday",
    startTime: "10:00",
    endTime: "17:00",
    availability: "available",
    notes: "Teaching and consultations",
  },
  {
    id: 5,
    day: "Friday",
    startTime: "09:00",
    endTime: "14:00",
    availability: "preferred",
    notes: "Lectures only",
  },
];

export const generateScheduleData = (profileData) => {
  const schedule = profileData?.enrollments?.map((enrollment, index) => ({
    id: index + 1,
    courseCode: enrollment.courseCode,
    day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][index % 5],
    time: `${9 + index}:00 - ${10 + index}:00`,
    room: `Room ${100 + index}`,
    students: Math.floor(Math.random() * 30) + 10,
  })) || [];

  const summary = {
    weeklyHours: schedule.length * 2,
    totalStudents: schedule.reduce((sum, item) => sum + item.students, 0),
    uniqueCourses: new Set(schedule.map((item) => item.courseCode)).size,
    totalClasses: schedule.length,
  };

  return { schedule, summary };
};

export const generateResourcesData = () => {
  const courseMaterials = [
    {
      id: 1,
      title: "CS101 Lecture Notes",
      type: "notes",
      course: "CS101",
      uploadDate: "2024-01-10",
      size: "1.5 MB",
      downloads: 50,
      rating: 4.5,
      url: "/resources/cs101-notes.pdf",
      description: "Comprehensive lecture notes for CS101",
    },
    {
      id: 2,
      title: "CS201 Assignment 1",
      type: "assignment",
      course: "CS201",
      uploadDate: "2024-02-15",
      size: "800 KB",
      downloads: 30,
      rating: 4.2,
      url: "/resources/cs201-assignment1.pdf",
      description: "First assignment for Data Structures",
    },
    {
      id: 3,
      title: "MATH101 Study Guide",
      type: "study-guide",
      course: "MATH101",
      uploadDate: "2024-03-01",
      size: "2.0 MB",
      downloads: 45,
      rating: 4.8,
      url: "/resources/math101-guide.pdf",
      description: "Study guide for Calculus I",
    },
  ];

  return { courseMaterials };
};

export const profileConfigs = {
  student: {
    dataSource: studentsData,
    sections: ["overview", "grades", "courses", "enrollments", "schedule", "resources", "requests"],
    sectionLabels: {
      overview: "Overview",
      grades: "Grades",
      courses: "Courses",
      enrollments: "Enrollments",
      schedule: "Schedule",
      resources: "Resources",
      requests: "Requests",
    },
    getProfileData: (id) => {
      const student = studentsData.find((s) => s.id === id);
      if (!student) return null;
      return {
        student: {
          ...student,
          enrollments: [
            { id: 1, courseCode: "CS101", courseName: "Introduction to Computer Science", credits: 3, semester: "Fall 2024", instructor: "Dr. Smith", status: "enrolled" },
            { id: 2, courseCode: "MATH101", courseName: "Calculus I", credits: 4, semester: "Fall 2024", instructor: "Dr. Jones", status: "enrolled" },
          ],
          grades: [
            { id: 1, courseCode: "CS101", courseName: "Introduction to Computer Science", grade: 85, letterGrade: "B", credits: 3, semester: "Fall 2024" },
            { id: 2, courseCode: "MATH101", courseName: "Calculus I", grade: 92, letterGrade: "A-", credits: 4, semester: "Fall 2024" },
          ],
          requests: [
            { id: 1, student: "John Doe", type: "grade_review", subject: "CS101 Grade Review", date: "2024-10-01", time: "14:00", priority: "High", status: "pending", message: "Requesting review of final exam" },
          ],
        },
      };
    },
    getStats: (data) => ({
      completedCourses: data.student?.enrollments?.filter((e) => e.status === "enrolled").length || 0,
      currentEnrollments: data.student?.enrollments?.length || 0,
      pendingRequests: data.student?.requests?.filter((r) => r.status === "pending").length || 0,
      gpa: data.student?.grades?.length ? (data.student.grades.reduce((sum, g) => sum + g.grade, 0) / data.student.grades.length).toFixed(2) : "N/A",
    }),
    getStatCards: (stats) => [
      {
        id: "completed-courses",
        title: "Completed Courses",
        value: stats.completedCourses.toString(),
        icon: <Book />,
        trend: { value: "2", isPositive: true },
        description: "Total completed courses",
        backgroundColor: "#3b82f6",
      },
      {
        id: "current-enrollments",
        title: "Current Enrollments",
        value: stats.currentEnrollments.toString(),
        icon: <Users />,
        trend: { value: "1", isPositive: true },
        description: "Active course enrollments",
        backgroundColor: "#10b981",
      },
      {
        id: "pending-requests",
        title: "Pending Requests",
        value: stats.pendingRequests.toString(),
        icon: <Award />,
        trend: { value: "0", isPositive: false },
        description: "Pending student requests",
        backgroundColor: "#f59e0b",
      },
      {
        id: "gpa",
        title: "Current GPA",
        value: stats.gpa,
        icon: <TrendingUp />,
        trend: { value: "0.2", isPositive: true },
        description: "Cumulative GPA",
        backgroundColor: "#8b5cf6",
      },
    ],
  },
  lecturer: {
    dataSource: lecturersData,
    sections: ["overview", "courses", "schedule", "resources", "requests"],
    sectionLabels: {
      overview: "Overview",
      courses: "Courses",
      schedule: "Schedule",
      resources: "Resources",
      requests: "Requests",
    },
    getProfileData: (id) => {
      const lecturer = lecturersData.find((l) => l.id === id);
      if (!lecturer) return null;
      return {
        lecturer: {
          ...lecturer,
          courses: [
            { id: 1, courseCode: "CS101", courseName: "Introduction to Computer Science", semester: "Fall 2024", classSize: 30, notes: "", status: "active" },
          ],
          requests: [
            { id: 1, student: "John Doe", type: "grade_review", subject: "CS101 Grade Review", date: "2024-10-01", time: "14:00", priority: "High", status: "pending", message: "Requesting review of final exam" },
          ],
        },
      };
    },
    getStats: (data) => ({
      totalStudents: data.lecturer?.courses?.reduce((sum, c) => sum + (c.classSize || 0), 0) || 0,
      avgRating: data.lecturer?.rating ? data.lecturer.rating.toFixed(1) : "N/A",
      activeCourses: data.lecturer?.courses?.filter((c) => c.status === "active").length || 0,
      pendingRequests: data.lecturer?.requests?.filter((r) => r.status === "pending").length || 0,
    }),
    getStatCards: (stats) => [
      {
        id: "total-students",
        title: "Total Students",
        value: stats.totalStudents.toString(),
        icon: <Users />,
        trend: { value: "10", isPositive: true },
        description: "Students across all courses",
        backgroundColor: "#3b82f6",
      },
      {
        id: "avg-rating",
        title: "Average Rating",
        value: stats.avgRating,
        icon: <Award />,
        trend: { value: "0.1", isPositive: true },
        description: "Average course rating",
        backgroundColor: "#10b981",
      },
      {
        id: "active-courses",
        title: "Active Courses",
        value: stats.activeCourses.toString(),
        icon: <Book />,
        trend: { value: "1", isPositive: true },
        description: "Currently taught courses",
        backgroundColor: "#f59e0b",
      },
      {
        id: "pending-requests",
        title: "Pending Requests",
        value: stats.pendingRequests.toString(),
        icon: <TrendingUp />,
        trend: { value: "0", isPositive: false },
        description: "Pending student requests",
        backgroundColor: "#8b5cf6",
      },
    ],
  },
};