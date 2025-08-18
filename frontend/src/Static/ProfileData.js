// Static/ProfileData.js
// Sample Schedule Data Format for Testing
// Add this to your ProfileData.js or use as reference

// Static/ProfileData.js - Lecturer Schedule and Evaluations Data

// Lecturer Schedule Data
export const lecturerSchedule = [
  // Dr. Sarah Johnson (ID: 1) - AI Specialist
  {
    id: 1,
    lecturerId: 1,
    courseCode: "CS401",
    courseName: "Artificial Intelligence",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:30",
    room: "Room A301",
    building: "Computer Science Building",
    semester: "Fall 2024",
    students: 42,
    type: "Lecture"
  },
  {
    id: 2,
    lecturerId: 1,
    courseCode: "CS401",
    courseName: "AI Lab",
    day: "Wednesday",
    startTime: "14:00",
    endTime: "16:00",
    room: "Lab C205",
    building: "Computer Science Building",
    semester: "Fall 2024",
    students: 20,
    type: "Lab"
  },
  {
    id: 3,
    lecturerId: 1,
    courseCode: "CS501",
    courseName: "Machine Learning",
    day: "Friday",
    startTime: "11:00",
    endTime: "12:30",
    room: "Room A301",
    building: "Computer Science Building",
    semester: "Fall 2024",
    students: 35,
    type: "Lecture"
  },

  // Prof. Michael Chen (ID: 2) - Power Systems
  {
    id: 4,
    lecturerId: 2,
    courseCode: "EE301",
    courseName: "Power Systems Analysis",
    day: "Tuesday",
    startTime: "10:00",
    endTime: "11:30",
    room: "Room B101",
    building: "Electrical Engineering Building",
    semester: "Fall 2024",
    students: 38,
    type: "Lecture"
  },
  {
    id: 5,
    lecturerId: 2,
    courseCode: "EE301",
    courseName: "Power Systems Analysis",
    day: "Thursday",
    startTime: "10:00",
    endTime: "11:30",
    room: "Room B101",
    building: "Electrical Engineering Building",
    semester: "Fall 2024",
    students: 38,
    type: "Lecture"
  },
  {
    id: 6,
    lecturerId: 2,
    courseCode: "EE401",
    courseName: "Advanced Power Electronics",
    day: "Monday",
    startTime: "13:00",
    endTime: "14:30",
    room: "Room B203",
    building: "Electrical Engineering Building",
    semester: "Fall 2024",
    students: 25,
    type: "Lecture"
  },
  {
    id: 7,
    lecturerId: 2,
    courseCode: "EE402",
    courseName: "Power Systems Lab",
    day: "Friday",
    startTime: "14:00",
    endTime: "17:00",
    room: "Lab B301",
    building: "Electrical Engineering Building",
    semester: "Fall 2024",
    students: 15,
    type: "Lab"
  },

  // Dr. Emily Rodriguez (ID: 3) - Thermodynamics
  {
    id: 8,
    lecturerId: 3,
    courseCode: "ME201",
    courseName: "Thermodynamics I",
    day: "Tuesday",
    startTime: "14:00",
    endTime: "15:30",
    room: "Room C102",
    building: "Mechanical Engineering Building",
    semester: "Fall 2024",
    students: 45,
    type: "Lecture"
  },
  {
    id: 9,
    lecturerId: 3,
    courseCode: "ME301",
    courseName: "Heat Transfer",
    day: "Thursday",
    startTime: "09:00",
    endTime: "10:30",
    room: "Room C102",
    building: "Mechanical Engineering Building",
    semester: "Fall 2024",
    students: 32,
    type: "Lecture"
  },

  // Dr. Lisa Thompson (ID: 5) - Cybersecurity
  {
    id: 10,
    lecturerId: 5,
    courseCode: "IT301",
    courseName: "Network Security",
    day: "Monday",
    startTime: "11:00",
    endTime: "12:30",
    room: "Room D201",
    building: "Information Technology Building",
    semester: "Fall 2024",
    students: 40,
    type: "Lecture"
  },
  {
    id: 11,
    lecturerId: 5,
    courseCode: "IT401",
    courseName: "Ethical Hacking",
    day: "Wednesday",
    startTime: "10:00",
    endTime: "11:30",
    room: "Room D201",
    building: "Information Technology Building",
    semester: "Fall 2024",
    students: 28,
    type: "Lecture"
  },
  {
    id: 12,
    lecturerId: 5,
    courseCode: "IT402",
    courseName: "Cybersecurity Lab",
    day: "Friday",
    startTime: "13:00",
    endTime: "16:00",
    room: "Lab D301",
    building: "Information Technology Building",
    semester: "Fall 2024",
    students: 20,
    type: "Lab"
  },

  // Prof. Robert Martinez (ID: 6) - Software Engineering
  {
    id: 13,
    lecturerId: 6,
    courseCode: "CS201",
    courseName: "Software Engineering",
    day: "Monday",
    startTime: "08:00",
    endTime: "09:30",
    room: "Room A101",
    building: "Computer Science Building",
    semester: "Fall 2024",
    students: 50,
    type: "Lecture"
  },
  {
    id: 14,
    lecturerId: 6,
    courseCode: "CS201",
    courseName: "Software Engineering",
    day: "Wednesday",
    startTime: "08:00",
    endTime: "09:30",
    room: "Room A101",
    building: "Computer Science Building",
    semester: "Fall 2024",
    students: 50,
    type: "Lecture"
  },
  {
    id: 15,
    lecturerId: 6,
    courseCode: "CS301",
    courseName: "Advanced Programming",
    day: "Tuesday",
    startTime: "13:00",
    endTime: "14:30",
    room: "Room A201",
    building: "Computer Science Building",
    semester: "Fall 2024",
    students: 35,
    type: "Lecture"
  },
  {
    id: 16,
    lecturerId: 6,
    courseCode: "CS302",
    courseName: "Software Testing",
    day: "Thursday",
    startTime: "15:00",
    endTime: "16:30",
    room: "Room A201",
    building: "Computer Science Building",
    semester: "Fall 2024",
    students: 28,
    type: "Lecture"
  },
  {
    id: 17,
    lecturerId: 6,
    courseCode: "CS303",
    courseName: "Project Management",
    day: "Friday",
    startTime: "10:00",
    endTime: "11:30",
    room: "Room A101",
    building: "Computer Science Building",
    semester: "Fall 2024",
    students: 22,
    type: "Seminar"
  },

  // Dr. Amanda Foster (ID: 7) - Electronics
  {
    id: 18,
    lecturerId: 7,
    courseCode: "EE201",
    courseName: "Digital Electronics",
    day: "Tuesday",
    startTime: "15:00",
    endTime: "16:30",
    room: "Room B102",
    building: "Electrical Engineering Building",
    semester: "Fall 2024",
    students: 33,
    type: "Lecture"
  },
  {
    id: 19,
    lecturerId: 7,
    courseCode: "EE202",
    courseName: "Analog Circuits",
    day: "Thursday",
    startTime: "13:00",
    endTime: "14:30",
    room: "Room B102",
    building: "Electrical Engineering Building",
    semester: "Fall 2024",
    students: 29,
    type: "Lecture"
  },

  // Dr. David Kim (ID: 8) - Robotics
  {
    id: 20,
    lecturerId: 8,
    courseCode: "ME401",
    courseName: "Robotics and Automation",
    day: "Monday",
    startTime: "15:00",
    endTime: "16:30",
    room: "Room C201",
    building: "Mechanical Engineering Building",
    semester: "Fall 2024",
    students: 30,
    type: "Lecture"
  },
  {
    id: 21,
    lecturerId: 8,
    courseCode: "ME402",
    courseName: "Control Systems",
    day: "Wednesday",
    startTime: "11:00",
    endTime: "12:30",
    room: "Room C201",
    building: "Mechanical Engineering Building",
    semester: "Fall 2024",
    students: 27,
    type: "Lecture"
  },
  {
    id: 22,
    lecturerId: 8,
    courseCode: "ME403",
    courseName: "Robotics Lab",
    day: "Friday",
    startTime: "09:00",
    endTime: "12:00",
    room: "Lab C301",
    building: "Mechanical Engineering Building",
    semester: "Fall 2024",
    students: 18,
    type: "Lab"
  },

  // Prof. Mark Johnson (ID: 10) - Database Systems
  {
    id: 23,
    lecturerId: 10,
    courseCode: "IT201",
    courseName: "Database Systems",
    day: "Tuesday",
    startTime: "11:00",
    endTime: "12:30",
    room: "Room D101",
    building: "Information Technology Building",
    semester: "Fall 2024",
    students: 44,
    type: "Lecture"
  },
  {
    id: 24,
    lecturerId: 10,
    courseCode: "IT301",
    courseName: "Advanced Database Design",
    day: "Thursday",
    startTime: "14:00",
    endTime: "15:30",
    room: "Room D101",
    building: "Information Technology Building",
    semester: "Fall 2024",
    students: 26,
    type: "Lecture"
  }
];

// Lecturer Evaluations Data
export const lecturerEvaluations = [
  // Dr. Sarah Johnson (ID: 1) - AI Specialist
  {
    id: 1,
    lecturerId: 1,
    courseCode: "CS401",
    courseName: "Artificial Intelligence",
    semester: "Fall 2024",
    overallRating: 4.8,
    teachingEffectiveness: 4.9,
    courseMaterial: 4.7,
    accessibility: 4.8,
    responseCount: 40,
    totalStudents: 42,
    comments: [
      "Dr. Johnson explains AI concepts brilliantly and makes complex topics accessible",
      "Outstanding lecturer with real-world industry experience",
      "The practical examples and hands-on projects were exceptional"
    ]
  },
  {
    id: 2,
    lecturerId: 1,
    courseCode: "CS501",
    courseName: "Machine Learning",
    semester: "Fall 2024",
    overallRating: 4.7,
    teachingEffectiveness: 4.8,
    courseMaterial: 4.6,
    accessibility: 4.7,
    responseCount: 33,
    totalStudents: 35,
    comments: [
      "Challenging course but excellent teaching methodology",
      "Great balance between theory and practical implementation",
      "Very responsive to student questions and concerns"
    ]
  },

  // Prof. Michael Chen (ID: 2) - Power Systems
  {
    id: 3,
    lecturerId: 2,
    courseCode: "EE301",
    courseName: "Power Systems Analysis",
    semester: "Fall 2024",
    overallRating: 4.6,
    teachingEffectiveness: 4.7,
    courseMaterial: 4.5,
    accessibility: 4.6,
    responseCount: 36,
    totalStudents: 38,
    comments: [
      "Prof. Chen has extensive industry knowledge in power systems",
      "Well-structured lectures with clear explanations",
      "Could benefit from more interactive demonstrations"
    ]
  },
  {
    id: 4,
    lecturerId: 2,
    courseCode: "EE401",
    courseName: "Advanced Power Electronics",
    semester: "Fall 2024",
    overallRating: 4.5,
    teachingEffectiveness: 4.6,
    courseMaterial: 4.4,
    accessibility: 4.5,
    responseCount: 23,
    totalStudents: 25,
    comments: [
      "Advanced material handled with expertise",
      "Good use of simulation tools and software",
      "Very knowledgeable about current industry trends"
    ]
  },

  // Dr. Emily Rodriguez (ID: 3) - Thermodynamics
  {
    id: 5,
    lecturerId: 3,
    courseCode: "ME201",
    courseName: "Thermodynamics I",
    semester: "Fall 2024",
    overallRating: 4.7,
    teachingEffectiveness: 4.8,
    courseMaterial: 4.6,
    accessibility: 4.7,
    responseCount: 43,
    totalStudents: 45,
    comments: [
      "Dr. Rodriguez makes thermodynamics concepts easy to understand",
      "Excellent problem-solving approach and clear examples",
      "Very patient and helpful during office hours"
    ]
  },
  {
    id: 6,
    lecturerId: 3,
    courseCode: "ME301",
    courseName: "Heat Transfer",
    semester: "Fall 2024",
    overallRating: 4.6,
    teachingEffectiveness: 4.7,
    courseMaterial: 4.5,
    accessibility: 4.6,
    responseCount: 30,
    totalStudents: 32,
    comments: [
      "Good use of real-world applications in heat transfer",
      "Clear explanations of complex mathematical concepts",
      "Fair grading and constructive feedback"
    ]
  },

  // Dr. Lisa Thompson (ID: 5) - Cybersecurity
  {
    id: 7,
    lecturerId: 5,
    courseCode: "IT301",
    courseName: "Network Security",
    semester: "Fall 2024",
    overallRating: 4.9,
    teachingEffectiveness: 4.9,
    courseMaterial: 4.8,
    accessibility: 4.9,
    responseCount: 39,
    totalStudents: 40,
    comments: [
      "Dr. Thompson is absolutely phenomenal - cutting-edge cybersecurity knowledge",
      "Hands-on labs are incredibly valuable and current with industry practices",
      "Most engaging lecturer I've had - makes security concepts fascinating"
    ]
  },
  {
    id: 8,
    lecturerId: 5,
    courseCode: "IT401",
    courseName: "Ethical Hacking",
    semester: "Fall 2024",
    overallRating: 4.8,
    teachingEffectiveness: 4.9,
    courseMaterial: 4.7,
    accessibility: 4.8,
    responseCount: 27,
    totalStudents: 28,
    comments: [
      "Amazing practical experience in ethical hacking techniques",
      "Very current with the latest security vulnerabilities and tools",
      "Excellent balance of ethical considerations and technical skills"
    ]
  },

  // Prof. Robert Martinez (ID: 6) - Software Engineering
  {
    id: 9,
    lecturerId: 6,
    courseCode: "CS201",
    courseName: "Software Engineering",
    semester: "Fall 2024",
    overallRating: 4.4,
    teachingEffectiveness: 4.5,
    courseMaterial: 4.3,
    accessibility: 4.4,
    responseCount: 47,
    totalStudents: 50,
    comments: [
      "Prof. Martinez has solid industry experience in software development",
      "Good coverage of software engineering principles and methodologies",
      "Could use more modern development tools and frameworks"
    ]
  },
  {
    id: 10,
    lecturerId: 6,
    courseCode: "CS301",
    courseName: "Advanced Programming",
    semester: "Fall 2024",
    overallRating: 4.3,
    teachingEffectiveness: 4.4,
    courseMaterial: 4.2,
    accessibility: 4.3,
    responseCount: 32,
    totalStudents: 35,
    comments: [
      "Comprehensive coverage of advanced programming concepts",
      "Good assignments that challenge students appropriately",
      "Would benefit from more contemporary programming languages"
    ]
  },
  {
    id: 11,
    lecturerId: 6,
    courseCode: "CS302",
    courseName: "Software Testing",
    semester: "Fall 2024",
    overallRating: 4.2,
    teachingEffectiveness: 4.3,
    courseMaterial: 4.1,
    accessibility: 4.2,
    responseCount: 25,
    totalStudents: 28,
    comments: [
      "Thorough introduction to software testing methodologies",
      "Practical examples help understand testing concepts",
      "Course material could be updated with newer testing tools"
    ]
  },

  // Dr. Amanda Foster (ID: 7) - Electronics
  {
    id: 12,
    lecturerId: 7,
    courseCode: "EE201",
    courseName: "Digital Electronics",
    semester: "Fall 2024",
    overallRating: 4.3,
    teachingEffectiveness: 4.4,
    courseMaterial: 4.2,
    accessibility: 4.3,
    responseCount: 31,
    totalStudents: 33,
    comments: [
      "Dr. Foster has good knowledge of digital circuit design",
      "Clear explanations of logic gates and digital systems",
      "Lab exercises are well-designed and educational"
    ]
  },
  {
    id: 13,
    lecturerId: 7,
    courseCode: "EE202",
    courseName: "Analog Circuits",
    semester: "Fall 2024",
    overallRating: 4.2,
    teachingEffectiveness: 4.3,
    courseMaterial: 4.1,
    accessibility: 4.2,
    responseCount: 27,
    totalStudents: 29,
    comments: [
      "Good foundation in analog circuit analysis",
      "Helpful office hours for circuit design problems",
      "Could use more practical circuit building exercises"
    ]
  },

  // Dr. David Kim (ID: 8) - Robotics
  {
    id: 14,
    lecturerId: 8,
    courseCode: "ME401",
    courseName: "Robotics and Automation",
    semester: "Fall 2024",
    overallRating: 4.7,
    teachingEffectiveness: 4.8,
    courseMaterial: 4.6,
    accessibility: 4.7,
    responseCount: 28,
    totalStudents: 30,
    comments: [
      "Dr. Kim brings incredible expertise in robotics and automation",
      "Hands-on projects with real robots are outstanding",
      "Very inspiring and encourages innovative thinking"
    ]
  },
  {
    id: 15,
    lecturerId: 8,
    courseCode: "ME402",
    courseName: "Control Systems",
    semester: "Fall 2024",
    overallRating: 4.6,
    teachingEffectiveness: 4.7,
    courseMaterial: 4.5,
    accessibility: 4.6,
    responseCount: 25,
    totalStudents: 27,
    comments: [
      "Excellent understanding of control theory and applications",
      "Good use of MATLAB and simulation tools",
      "Clear explanations of complex mathematical concepts"
    ]
  },

  // Prof. Mark Johnson (ID: 10) - Database Systems
  {
    id: 16,
    lecturerId: 10,
    courseCode: "IT201",
    courseName: "Database Systems",
    semester: "Fall 2024",
    overallRating: 4.6,
    teachingEffectiveness: 4.7,
    courseMaterial: 4.5,
    accessibility: 4.6,
    responseCount: 41,
    totalStudents: 44,
    comments: [
      "Prof. Johnson has excellent practical knowledge of database design",
      "Good balance of theory and hands-on SQL practice",
      "Very helpful with database project guidance"
    ]
  },
  {
    id: 17,
    lecturerId: 10,
    courseCode: "IT301",
    courseName: "Advanced Database Design",
    semester: "Fall 2024",
    overallRating: 4.5,
    teachingEffectiveness: 4.6,
    courseMaterial: 4.4,
    accessibility: 4.5,
    responseCount: 24,
    totalStudents: 26,
    comments: [
      "Advanced concepts in database optimization and design",
      "Good real-world examples from industry experience",
      "Could include more NoSQL database technologies"
    ]
  }
];

// Sample data with potential issues (for testing error handling)
export const problematicScheduleData = [
  {
    id: 7,
    lecturerId: 1,
    courseName: "Test Course",
    // Missing startTime - should default to 09:00
    endTime: undefined, // Undefined endTime - should be calculated
    duration: 60,
    location: "Test Room",
    type: "lecture"
  },
  {
    id: 8,
    lecturerId: 1,
    courseName: "Another Test",
    startTime: "invalid-time", // Invalid time format
    endTime: "also-invalid",
    duration: 90,
    location: "Test Room 2",
    type: "lab"
  },
  {
    id: 9,
    lecturerId: 1,
    courseName: "Edge Case Test",
    startTime: "25:00", // Invalid hour
    endTime: "26:30",
    duration: null, // Null duration
    location: "Test Room 3",
    type: "seminar"
  }
];

// Data structure that the calendar expects:
/*
Expected Event Format:
{
  id: string | number,
  title: string,
  date: string (YYYY-MM-DD),
  startTime: string (HH:MM),
  endTime: string (HH:MM),
  location: string,
  type: string,
  description: string,
  color: string (optional, will be auto-generated),
  recurring: boolean (optional)
}
*/
// Student-related data
export const studentGrades = [
  {
    id: 1,
    studentId: 1,
    courseCode: "CS101",
    courseName: "Introduction to Programming",
    grade: "A",
    credits: 3,
    semester: "Fall 2023",
    gpa: 4.0
  },
  {
    id: 2,
    studentId: 1,
    courseCode: "MATH201",
    courseName: "Calculus II",
    grade: "B+",
    credits: 4,
    semester: "Fall 2023",
    gpa: 3.3
  },
  {
    id: 3,
    studentId: 1,
    courseCode: "PHYS101",
    courseName: "Physics I",
    grade: "A-",
    credits: 3,
    semester: "Spring 2024",
    gpa: 3.7
  },
  {
    id: 4,
    studentId: 2,
    courseCode: "CS102",
    courseName: "Data Structures",
    grade: "A",
    credits: 3,
    semester: "Fall 2023",
    gpa: 4.0
  },
  {
    id: 5,
    studentId: 3,
    courseCode: "IT201",
    courseName: "Database Systems",
    grade: "B",
    credits: 3,
    semester: "Spring 2024",
    gpa: 3.0
  }
];

export const studentRequests = [
  {
    id: 1,
    studentId: 1,
    type: "Course Drop",
    course: "MATH301",
    reason: "Schedule conflict",
    status: "pending",
    dateSubmitted: "2024-01-15",
    priority: "medium"
  },
  {
    id: 2,
    studentId: 1,
    type: "Grade Appeal",
    course: "CS201",
    reason: "Calculation error in final grade",
    status: "approved",
    dateSubmitted: "2024-01-10",
    priority: "high"
  },
  {
    id: 3,
    studentId: 2,
    type: "Course Add",
    course: "ENG102",
    reason: "Needed for graduation requirements",
    status: "pending",
    dateSubmitted: "2024-01-20",
    priority: "low"
  },
  {
    id: 4,
    studentId: 3,
    type: "Transfer Credit",
    course: "IT301",
    reason: "Credit from previous institution",
    status: "approved",
    dateSubmitted: "2024-01-12",
    priority: "medium"
  }
];

export const studentEnrollments = [
  {
    id: 1,
    studentId: 1,
    courseCode: "CS301",
    courseName: "Software Engineering",
    instructor: "Dr. Smith",
    credits: 3,
    schedule: "MWF 10:00-11:00",
    room: "CS-201",
    status: "enrolled"
  },
  {
    id: 2,
    studentId: 1,
    courseCode: "MATH301",
    courseName: "Linear Algebra",
    instructor: "Prof. Johnson",
    credits: 3,
    schedule: "TTH 14:00-15:30",
    room: "MATH-105",
    status: "enrolled"
  },
  {
    id: 3,
    studentId: 2,
    courseCode: "CS202",
    courseName: "Algorithms",
    instructor: "Dr. Brown",
    credits: 4,
    schedule: "MWF 09:00-10:00",
    room: "CS-301",
    status: "enrolled"
  },
  {
    id: 4,
    studentId: 3,
    courseCode: "IT401",
    courseName: "Cybersecurity",
    instructor: "Dr. Lisa Thompson",
    credits: 3,
    schedule: "TTH 16:00-17:30",
    room: "IT-201",
    status: "enrolled"
  }
];

// Lecturer-related data
export const lecturerCourses = [
  {
    id: 1,
    lecturerId: 1,
    courseCode: "CS101",
    courseName: "Introduction to Programming",
    semester: "Fall 2024",
    enrolledStudents: 35,
    maxCapacity: 40,
    schedule: "MWF 09:00-10:00",
    room: "CS-101",
    status: "active"
  },
  {
    id: 2,
    lecturerId: 1,
    courseCode: "CS301",
    courseName: "Software Engineering",
    semester: "Fall 2024", 
    enrolledStudents: 28,
    maxCapacity: 30,
    schedule: "TTH 14:00-15:30",
    room: "CS-201",
    status: "active"
  },
  {
    id: 3,
    lecturerId: 1,
    courseCode: "CS401",
    courseName: "Senior Project",
    semester: "Fall 2024",
    enrolledStudents: 15,
    maxCapacity: 20,
    schedule: "W 16:00-18:00",
    room: "CS-Lab1",
    status: "active"
  },
  {
    id: 4,
    lecturerId: 2,
    courseCode: "EE201",
    courseName: "Circuit Analysis",
    semester: "Fall 2024",
    enrolledStudents: 42,
    maxCapacity: 45,
    schedule: "MWF 11:00-12:00",
    room: "EE-301",
    status: "active"
  },
  {
    id: 5,
    lecturerId: 5,
    courseCode: "IT401",
    courseName: "Cybersecurity",
    semester: "Fall 2024",
    enrolledStudents: 25,
    maxCapacity: 30,
    schedule: "TTH 16:00-17:30",
    room: "IT-201",
    status: "active"
  }
];

// export const lecturerSchedule = [
//   {
//     id: 1,
//     lecturerId: 1,
//     day: "Monday",
//     timeSlot: "09:00-10:00",
//     activity: "CS101 - Introduction to Programming",
//     room: "CS-101",
//     type: "lecture",
//     duration: 1
//   },
//   {
//     id: 2,
//     lecturerId: 1,
//     day: "Monday",
//     timeSlot: "14:00-15:00",
//     activity: "Office Hours",
//     room: "CS-205",
//     type: "office_hours",
//     duration: 1
//   },
//   {
//     id: 3,
//     lecturerId: 1,
//     day: "Tuesday",
//     timeSlot: "14:00-15:30",
//     activity: "CS301 - Software Engineering",
//     room: "CS-201",
//     type: "lecture",
//     duration: 1.5
//   },
//   {
//     id: 4,
//     lecturerId: 1,
//     day: "Wednesday",
//     timeSlot: "09:00-10:00",
//     activity: "CS101 - Introduction to Programming",
//     room: "CS-101",
//     type: "lecture",
//     duration: 1
//   },
//   {
//     id: 5,
//     lecturerId: 1,
//     day: "Wednesday",
//     timeSlot: "16:00-18:00",
//     activity: "CS401 - Senior Project",
//     room: "CS-Lab1",
//     type: "lab",
//     duration: 2
//   },
//   {
//     id: 6,
//     lecturerId: 1,
//     day: "Thursday",
//     timeSlot: "14:00-15:30",
//     activity: "CS301 - Software Engineering",
//     room: "CS-201",
//     type: "lecture",
//     duration: 1.5
//   },
//   {
//     id: 7,
//     lecturerId: 1,
//     day: "Friday",
//     timeSlot: "09:00-10:00",
//     activity: "CS101 - Introduction to Programming",
//     room: "CS-101",
//     type: "lecture",
//     duration: 1
//   },
//   {
//     id: 8,
//     lecturerId: 2,
//     day: "Monday",
//     timeSlot: "11:00-12:00",
//     activity: "EE201 - Circuit Analysis",
//     room: "EE-301",
//     type: "lecture",
//     duration: 1
//   },
//   {
//     id: 9,
//     lecturerId: 2,
//     day: "Wednesday",
//     timeSlot: "11:00-12:00",
//     activity: "EE201 - Circuit Analysis",
//     room: "EE-301",
//     type: "lecture",
//     duration: 1
//   },
//   {
//     id: 10,
//     lecturerId: 2,
//     day: "Friday",
//     timeSlot: "11:00-12:00",
//     activity: "EE201 - Circuit Analysis",
//     room: "EE-301",
//     type: "lecture",
//     duration: 1
//   }
// ];

