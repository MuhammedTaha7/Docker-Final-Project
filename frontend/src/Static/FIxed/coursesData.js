import DataStructure from "../../Assets/Courses/datastructure.jpg";
import Economy from "../../Assets/Courses/economy.jpg";
import Math from "../../Assets/Courses/math.jpg";
import Physics from "../../Assets/Courses/physics.png";



// staticFixedData.js
export const lecturersList = [
  "Dr. Ahmad Hassan",
  "Ms. Layla Mahmoud",
  "Mr. Khalil Ahmed",
  "Ms. Nour Al-Rashid",
  "Mr. Hassan Mubarak",
  "Prof. Sarah Al-Mahmoud",
  "Dr. Mahmoud Saleh",
  "Ms. Fatima Al-Sharif",
  "Mr. Omar Al-Zahra",
  "Dr. Amina Hassan",
  "Prof. Khalid Al-Mansour",
  "Ms. Zahra Al-Khatib",
  "Dr. Mariam Al-Sabah",
  "Dr. Omar Khalil",
  "Dr. Rashid Al-Khatib",
  "Prof. Nadia Al-Mahmoud",
  "Dr. Samir Al-Hassan",
  "Ms. Rania Al-Zahra",
  "Dr. Yusuf Al-Sharif",
  "Prof. Laila Al-Mansour",
  "Dr. Ibrahim Al-Sabah",
  "Prof. Dr. Fatima Al-Zahra",
  "Prof. Amina Hassan",
  "Dr. Khadija Al-Mahmoud",
  "Prof. Maryam Al-Sharif",
  "Dr. Aisha Al-Khatib",
  "Prof. Samira Al-Hassan",
  "Dr. Nour Al-Mansour",
  "Prof. Zeinab Al-Sabah",
  "Dr. Hala Al-Rashid",
  "Prof. Dina Al-Zahra",
];

export const coursesList = [
  { id: 101, code: "CERT101", title: "Computer Fundamentals", students: 30, lessons: 12, year: "2023", semester: "1", group: "Certificate IT", img: DataStructure, academicYear: "1",credits:3 },
  { id: 102, code: "CERT102", title: "Microsoft Office Suite", students: 30, lessons: 12, year: "2023", semester: "1", group: "Certificate IT", img: DataStructure, academicYear: "1" },
  { id: 103, code: "CERT103", title: "Internet & Email Basics", students: 30, lessons: 10, year: "2023", semester: "1", group: "Certificate IT", img: DataStructure, academicYear: "1" },
  { id: 104, code: "CERT201", title: "Basic Web Design", students: 28, lessons: 12, year: "2023", semester: "2", group: "Certificate IT", img: DataStructure, academicYear: "1" },
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

export const courseSpecificData = {
  101: {
    courseDetails: { title: "Computer Fundamentals", code: "CERT101" },
    progressData: [
      { id: "attendant", value: 45, color: "#8b5cf6" },
      { id: "grade", value: 70, color: "#10b981" },
    ],
    stats: { overallProgress: 65, attendanceRate: 85, nextAssignmentDays: 7, completedTasks: { completed: 2, total: 4 }, currentGPA: 3.2, progressStatus: "On Track" },
    materials: [
      { title: "Course Readings", files: [{ title: "Chapter 1.pdf", url: "/files/ch1.pdf" }, { title: "Chapter 2.pdf", url: "/files/ch2.pdf" }] },
      { title: "Assignments", files: [{ title: "Assignment 1.docx", url: "/files/ass1.docx" }] },
    ],
    announcements: [
      { id: 1, title: "Welcome to CERT101", date: "2025-07-01", message: "Class starts next week. Please review Chapter 1." },
      { id: 2, title: "Assignment Due", date: "2025-07-08", message: "Submit Assignment 1 by next Friday." },
    ],
  },
  102: {
    courseDetails: { title: "Microsoft Office Suite", code: "CERT102" },
    progressData: [
      { id: "attendant", value: 50, color: "#8b5cf6" },
      { id: "grade", value: 75, color: "#10b981" },
    ],
    stats: { overallProgress: 70, attendanceRate: 90, nextAssignmentDays: 5, completedTasks: { completed: 3, total: 5 }, currentGPA: 3.5, progressStatus: "On Track" },
    materials: [
      { title: "Tutorials", files: [{ title: "Excel Tutorial.pdf", url: "/files/excel.pdf" }, { title: "Word Tutorial.pdf", url: "/files/word.pdf" }] },
    ],
    announcements: [
      { id: 1, title: "New Schedule", date: "2025-07-01", message: "Updated class schedule is now available." },
    ],
  },
  201: {
    courseDetails: { title: "Introduction to Business", code: "DIP101" },
    progressData: [
      { id: "attendant", value: 55, color: "#8b5cf6" },
      { id: "grade", value: 68, color: "#10b981" },
    ],
    stats: { overallProgress: 60, attendanceRate: 80, nextAssignmentDays: 10, completedTasks: { completed: 1, total: 3 }, currentGPA: 3.0, progressStatus: "Needs Improvement" },
    materials: [
      { title: "Readings", files: [{ title: "Business Basics.pdf", url: "/files/business.pdf" }] },
    ],
    announcements: [
      { id: 1, title: "Guest Lecture", date: "2025-07-03", message: "Join us for a guest lecture on business ethics." },
    ],
  },
  202: {
    courseDetails: { title: "Financial Accounting", code: "DIP102" },
    progressData: [
      { id: "attendant", value: 60, color: "#8b5cf6" },
      { id: "grade", value: 72, color: "#10b981" },
    ],
    stats: { overallProgress: 65, attendanceRate: 85, nextAssignmentDays: 8, completedTasks: { completed: 2, total: 4 }, currentGPA: 3.3, progressStatus: "On Track" },
    materials: [
      { title: "Exercises", files: [{ title: "Accounting Exercise.pdf", url: "/files/accounting.pdf" }] },
    ],
    announcements: [
      { id: 1, title: "Quiz Reminder", date: "2025-07-05", message: "Quiz on Chapter 3 next Monday." },
    ],
  },
  301: {
    courseDetails: { title: "Programming Fundamentals", code: "CS101" },
    progressData: [
      { id: "attendant", value: 40, color: "#8b5cf6" },
      { id: "grade", value: 65, color: "#10b981" },
    ],
    stats: { overallProgress: 55, attendanceRate: 75, nextAssignmentDays: 6, completedTasks: { completed: 2, total: 5 }, currentGPA: 2.8, progressStatus: "Needs Improvement" },
    materials: [
      { title: "Code Examples", files: [{ title: "Code1.py", url: "/files/code1.py" }] },
    ],
    announcements: [
      { id: 1, title: "Lab Session", date: "2025-07-02", message: "Lab session rescheduled to Thursday." },
    ],
  },
  302: {
    courseDetails: { title: "Database Management", code: "CS102" },
    progressData: [
      { id: "attendant", value: 45, color: "#8b5cf6" },
      { id: "grade", value: 70, color: "#10b981" },
    ],
    stats: { overallProgress: 60, attendanceRate: 80, nextAssignmentDays: 4, completedTasks: { completed: 3, total: 6 }, currentGPA: 3.1, progressStatus: "On Track" },
    materials: [
      { title: "Slides", files: [{ title: "DB Slides.pdf", url: "/files/db.pdf" }] },
    ],
    announcements: [
      { id: 1, title: "Project Deadline", date: "2025-07-07", message: "Database project due next Friday." },
    ],
  },
  401: {
    courseDetails: { title: "Fundamentals of Nursing", code: "NUR101" },
    progressData: [
      { id: "attendant", value: 50, color: "#8b5cf6" },
      { id: "grade", value: 75, color: "#10b981" },
    ],
    stats: { overallProgress: 70, attendanceRate: 90, nextAssignmentDays: 9, completedTasks: { completed: 2, total: 4 }, currentGPA: 3.4, progressStatus: "On Track" },
    materials: [
      { title: "Manuals", files: [{ title: "Nursing Manual.pdf", url: "/files/nursing.pdf" }] },
    ],
    announcements: [
      { id: 1, title: "Clinical Practice", date: "2025-07-04", message: "Clinical practice starts next week." },
    ],
  },
  402: {
    courseDetails: { title: "Patient Care Techniques", code: "NUR102" },
    progressData: [
      { id: "attendant", value: 55, color: "#8b5cf6" },
      { id: "grade", value: 78, color: "#10b981" },
    ],
    stats: { overallProgress: 75, attendanceRate: 92, nextAssignmentDays: 7, completedTasks: { completed: 3, total: 5 }, currentGPA: 3.6, progressStatus: "On Track" },
    materials: [
      { title: "Guides", files: [{ title: "Care Guide.pdf", url: "/files/care.pdf" }] },
    ],
    announcements: [
      { id: 1, title: "Workshop", date: "2025-07-06", message: "Attend the patient care workshop tomorrow." },
    ],
  },
  501: {
    courseDetails: { title: "English Composition", code: "ENG101" },
    progressData: [
      { id: "attendant", value: 45, color: "#8b5cf6" },
      { id: "grade", value: 68, color: "#10b981" },
    ],
    stats: { overallProgress: 60, attendanceRate: 80, nextAssignmentDays: 6, completedTasks: { completed: 1, total: 3 }, currentGPA: 3.0, progressStatus: "Needs Improvement" },
    materials: [
      { title: "Essays", files: [{ title: "Essay Sample.pdf", url: "/files/essay.pdf" }] },
    ],
    announcements: [
      { id: 1, title: "Essay Submission", date: "2025-07-03", message: "First essay due next Wednesday." },
    ],
  },
  502: {
    courseDetails: { title: "Public Speaking", code: "ENG102" },
    progressData: [
      { id: "attendant", value: 50, color: "#8b5cf6" },
      { id: "grade", value: 72, color: "#10b981" },
    ],
    stats: { overallProgress: 65, attendanceRate: 85, nextAssignmentDays: 5, completedTasks: { completed: 2, total: 4 }, currentGPA: 3.2, progressStatus: "On Track" },
    materials: [
      { title: "Presentations", files: [{ title: "Speech Guide.pdf", url: "/files/speech.pdf" }] },
    ],
    announcements: [
      { id: 1, title: "Practice Session", date: "2025-07-05", message: "Practice session scheduled for Friday." },
    ],
  },
  default: {
    courseDetails: { title: "Unknown Course", code: "N/A" },
    progressData: [],
    stats: { overallProgress: 0, attendanceRate: 0, nextAssignmentDays: 0, completedTasks: { completed: 0, total: 0 }, currentGPA: 0.0, progressStatus: "N/A" },
    materials: [],
    announcements: [],
  },
};

export const semesterOptions = ["1", "2", "Summer"];