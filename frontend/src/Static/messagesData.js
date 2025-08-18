// 📁 src/Static/messagesData.js
export const fullMessagesData = [
  {
    id: 1,
    sender: "Ahmed Mohamed",
    senderType: "Student",
    email: "ahmed.mohamed@university.edu",
    subject: "Question about Assignment 2",
    message: "Dear Professor, I have a question regarding Assignment 2. The requirements mention that we need to implement a database connection, but I'm not sure which database system we should use. Could you please clarify? Also, is there a specific framework we should follow? I've been working on this for a few days but want to make sure I'm on the right track before proceeding further. Thank you for your time.",
    date: "2025-06-20",
    time: "14:30",
    priority: "medium"
  },
  {
    id: 2,
    sender: "Dr. Sarah Wilson",
    senderType: "Lecturer",
    email: "sarah.wilson@university.edu",
    subject: "Course Material Update",
    message: "Hello, I wanted to inform you that there has been an update to the course material for week 8. Please review the new slides and reading materials that I've uploaded to the course portal. There will be additional exercises that students need to complete before the next lecture. If you have any questions about implementing these changes, please let me know.",
    date: "2025-06-20",
    time: "10:15",
    priority: "high"
  },
  {
    id: 3,
    sender: "Fatma Ali",
    senderType: "Student",
    email: "fatma.ali@university.edu",
    subject: "Request for Extension",
    message: "Dear Professor, I am writing to request an extension for the final project submission. Due to unexpected family circumstances, I haven't been able to dedicate the necessary time to complete the project to the standard I would like. I understand this is short notice, but would it be possible to have an additional week? I can provide documentation if needed.",
    date: "2025-06-19",
    time: "16:45",
    priority: "high"
  },
  {
    id: 4,
    sender: "Omar Hassan",
    senderType: "Student",
    email: "omar.hassan@university.edu",
    subject: "Lab Session Clarification",
    message: "Hi, I missed the lab session on Tuesday due to illness. Could you please let me know what was covered and if there are any specific tasks I need to catch up on? I've reviewed the materials online but want to make sure I haven't missed anything important. When would be a good time to discuss this?",
    date: "2025-06-19",
    time: "09:20",
    priority: "medium"
  },
  {
    id: 5,
    sender: "Prof. Michael Brown",
    senderType: "Lecturer",
    email: "michael.brown@university.edu",
    subject: "Collaboration Request",
    message: "Hello colleague, I hope this message finds you well. I'm reaching out regarding a potential collaboration opportunity for the upcoming research project. Our departments have similar interests, and I believe combining our expertise could lead to significant outcomes. Would you be available for a meeting next week to discuss this further? I have some initial ideas I'd like to share.",
    date: "2025-06-18",
    time: "13:00",
    priority: "medium"
  },
  {
    id: 6,
    sender: "Layla Ibrahim",
    senderType: "Student",
    email: "layla.ibrahim@university.edu",
    subject: "Grade Inquiry",
    message: "Dear Professor, I received my grade for the midterm exam and I'm a bit confused about the scoring. I believe there might be an error in the calculation. Could we schedule a time to go over the exam together? I want to understand where I may have gone wrong and learn from my mistakes. Thank you for your consideration.",
    date: "2025-06-18",
    time: "11:30",
    priority: "medium"
  },
  {
    id: 7,
    sender: "Yusuf Khaled",
    senderType: "Student",
    email: "yusuf.khaled@university.edu",
    subject: "Technical Issue with Portal",
    message: "Hello, I'm experiencing technical difficulties accessing the course portal. Whenever I try to log in, I get an error message saying 'authentication failed' even though I'm using the correct credentials. I've tried resetting my password but the issue persists. This is preventing me from accessing important course materials and submitting assignments. Could you please help resolve this issue?",
    date: "2025-06-17",
    time: "15:20",
    priority: "high"
  },
  {
    id: 8,
    sender: "Dr. Amina Farouk",
    senderType: "Lecturer",
    email: "amina.farouk@university.edu",
    subject: "Student Performance Discussion",
    message: "Dear colleague, I wanted to discuss the performance of some students who are enrolled in both our courses. I've noticed some concerning patterns in their attendance and assignment submissions. Perhaps we could coordinate our approach to help these students get back on track. Would you be available for a brief meeting this week?",
    date: "2025-06-17",
    time: "08:45",
    priority: "medium"
  }
];

// Optimized data for table display (without full message and email)
export const messagesData = fullMessagesData.map(msg => ({
  id: msg.id,
  sender: msg.sender,
  senderType: msg.senderType,
  subject: msg.subject,
  date: msg.date,
  priority: msg.priority
}));

// Helper function to get full message by ID
export const getFullMessageById = (id) => {
  return fullMessagesData.find(msg => msg.id === id);
};


// 📁 src/Static/announcementsData.js

// Full data with all details (for view/edit functionality)
export const fullAnnouncementsData = [
  {
    id: 1,
    title: "Mid-Term Examination Schedule Released",
    content: "Dear Students, The mid-term examination schedule for all courses has been finalized and is now available on the student portal. Please check your individual timetables carefully and note any potential conflicts. The examination period will run from July 15th to July 22nd, 2025. All exams will be held in the main examination halls. Students are required to bring their student ID cards and approved writing materials only. Mobile phones and electronic devices are strictly prohibited in the examination halls. If you have any scheduling conflicts or special accommodation needs, please contact the academic office immediately.",
    targetAudience: "All Students",
    targetAudienceType: "all_students",
    priority: "high",
    status: "active",
    createdDate: "2025-06-21",
    expiryDate: "2025-07-25",
    scheduledDate: null,
  },
  {
    id: 2,
    title: "Library Extended Hours During Exam Period",
    content: "To support students during the upcoming examination period, the university library will extend its operating hours. From July 10th to July 25th, the library will be open 24/7. Additional study spaces have been arranged in the conference rooms on the second floor. Silent study zones will be strictly enforced. Group study rooms can be booked in advance through the library portal. Please remember to bring your student ID for after-hours access. Security personnel will be present throughout the night for your safety.",
    targetAudience: "All Students",
    targetAudienceType: "all_students",
    priority: "medium",
    status: "active",
    createdDate: "2025-06-20",
    expiryDate: "2025-07-26",
    scheduledDate: null,
  },
  {
    id: 3,
    title: "Computer Science Department Workshop",
    content: "The Computer Science Department is organizing a special workshop on 'Modern Web Development Technologies' on July 5th, 2025, from 2:00 PM to 5:00 PM in Lab A-203. This workshop will cover React.js, Node.js, and database integration techniques. Industry experts from leading tech companies will be conducting hands-on sessions. This is an excellent opportunity to enhance your practical skills and network with professionals. Registration is mandatory and limited to 50 participants. Please register through the department portal by June 30th. Light refreshments will be provided.",
    targetAudience: "Computer Science Students",
    targetAudienceType: "specific_department",
    priority: "medium",
    status: "active",
    createdDate: "2025-06-19",
    expiryDate: "2025-07-06",
    scheduledDate: null,
  },
  {
    id: 4,
    title: "Important: Graduation Ceremony Details",
    content: "Congratulations to all graduating students! The graduation ceremony is scheduled for August 15th, 2025, at 10:00 AM in the main auditorium. All graduates must confirm their attendance by July 20th through the graduation portal. Academic regalia (caps and gowns) will be distributed on August 10th-12th from the student services office. Each graduate is allowed up to 4 guests. Guest registration is required for security purposes. Parking will be available in lots B and C. Professional photography services will be available on-site. For any queries regarding the ceremony, please contact the graduation committee.",
    targetAudience: "Final Year Students",
    targetAudienceType: "specific_year",
    priority: "high",
    status: "active",
    createdDate: "2025-06-18",
    expiryDate: "2025-08-16",
    scheduledDate: null,
  },
  {
    id: 5,
    title: "Faculty Meeting - Curriculum Review",
    content: "All faculty members are required to attend the curriculum review meeting scheduled for June 28th, 2025, at 2:00 PM in Conference Room 301. We will be discussing proposed changes to the academic curriculum for the upcoming academic year. Please review the attached documents prior to the meeting and come prepared with your feedback and suggestions. The meeting agenda includes: 1) Review of current curriculum effectiveness, 2) Proposed new courses and modifications, 3) Resource allocation discussions, 4) Timeline for implementation. Your attendance and input are crucial for this important decision-making process.",
    targetAudience: "All Faculty",
    targetAudienceType: "all_faculty",
    priority: "high",
    status: "active",
    createdDate: "2025-06-17",
    expiryDate: "2025-06-29",
    scheduledDate: null,
  },
  {
    id: 6,
    title: "Summer Internship Opportunities",
    content: "Exciting internship opportunities are now available for students interested in gaining practical experience during the summer break. We have partnerships with over 30 companies across various industries including technology, finance, healthcare, and engineering. Internships range from 6-12 weeks with competitive stipends. Some positions may lead to full-time job offers upon graduation. Application deadline is July 1st, 2025. Required documents include: updated resume, cover letter, transcript, and two letters of recommendation. Career counseling sessions are available to help you prepare your applications. Visit the career services office or check the student portal for detailed information about available positions.",
    targetAudience: "All Students",
    targetAudienceType: "all_students",
    priority: "medium",
    status: "active",
    createdDate: "2025-06-16",
    expiryDate: "2025-07-02",
    scheduledDate: null,
  },
  {
    id: 7,
    title: "Network Maintenance Scheduled",
    content: "The IT department will be performing scheduled network maintenance on Sunday, June 29th, 2025, from 12:00 AM to 6:00 AM. During this time, internet access, email services, and the student portal will be temporarily unavailable. This maintenance is necessary to upgrade our network infrastructure and improve overall system performance. We apologize for any inconvenience this may cause. If you have urgent technical issues during this period, please contact the IT help desk emergency line. All services are expected to be fully restored by 6:00 AM. Thank you for your patience and cooperation.",
    targetAudience: "All Users",
    targetAudienceType: "all_users",
    priority: "high",
    status: "scheduled",
    createdDate: "2025-06-15",
    expiryDate: "2025-06-30",
    scheduledDate: "2025-06-29",
  },
  {
    id: 8,
    title: "Research Symposium Call for Papers",
    content: "The annual university research symposium will be held on September 20th, 2025. We invite faculty members and graduate students to submit their research papers for presentation. This year's theme is 'Innovation in Education and Technology.' Submission deadline is August 1st, 2025. Papers should be original research work and must follow the symposium guidelines available on the research office website. Selected papers will be published in the university's research journal. Awards will be given for the best papers in each category. Registration for the symposium is free for university members. External participants are welcome with a nominal registration fee.",
    targetAudience: "Faculty & Graduate Students",
    targetAudienceType: "faculty_graduates",
    priority: "medium",
    status: "active",
    createdDate: "2025-06-14",
    expiryDate: "2025-08-02",
    scheduledDate: null,
  }
];

// Optimized data for table display
export const announcementsData = fullAnnouncementsData.map(announcement => ({
  id: announcement.id,
  title: announcement.title,
  targetAudience: announcement.targetAudience,
  priority: announcement.priority,
  status: announcement.status,
  createdDate: announcement.createdDate,
}));

// Helper function to get full announcement by ID
export const getFullAnnouncementById = (id) => {
  return fullAnnouncementsData.find(announcement => announcement.id === id);
};

// Target audience options for forms
export const targetAudienceOptions = [
  { value: "all_students", label: "All Students" },
  { value: "all_faculty", label: "All Faculty" },
  { value: "all_users", label: "All Users" },
  { value: "specific_year", label: "Specific Year" },
  { value: "specific_department", label: "Specific Department" },
  { value: "specific_course", label: "Specific Course" },
  { value: "faculty_graduates", label: "Faculty & Graduate Students" }
];

// Priority options for forms
export const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

// Status options for forms
export const statusOptions = [
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "expired", label: "Expired" },
  { value: "draft", label: "Draft" }
];

// Full template data with all details
export const fullTemplatesData = [
  {
    id: 1,
    name: "Assignment Submission Reminder",
    category: "Academic",
    subject: "Reminder: Assignment Due Tomorrow",
    content: "Dear {studentName}, This is a friendly reminder that your assignment for {courseName} is due tomorrow ({dueDate}) at {dueTime}. Please ensure you submit your work through the course portal before the deadline. If you have any questions or need assistance, please don't hesitate to contact me. Best regards, {professorName}",
    variables: ["studentName", "courseName", "dueDate", "dueTime", "professorName"],
    targetAudience: "Students",
    createdDate: "2025-06-20",
    lastModified: "2025-06-20",
    status: "active"
  },
  {
    id: 2,
    name: "Grade Released Notification",
    category: "Academic", 
    subject: "Your Grade for {courseName} is Now Available",
    content: "Dear {studentName}, Your grade for {assessmentName} in {courseName} has been released and is now available on the student portal. You received a score of {grade}. If you have any questions about your grade or would like to schedule a meeting to discuss your performance, please feel free to contact me during office hours. Keep up the good work! Best regards, {professorName}",
    variables: ["studentName", "courseName", "assessmentName", "grade", "professorName"],
    targetAudience: "Students",
    createdDate: "2025-06-19",
    lastModified: "2025-06-21",
    status: "active"
  },
  {
    id: 3,
    name: "Class Cancellation Notice",
    category: "Administrative",
    subject: "Class Cancelled: {courseName} - {date}",
    content: "Dear Students, I regret to inform you that the {courseName} class scheduled for {date} at {time} has been cancelled due to {reason}. The class will be rescheduled for {rescheduleDate} at {rescheduleTime} in {location}. Please make note of this change in your schedules. Any assignments or deadlines remain unchanged unless otherwise specified. Thank you for your understanding. Best regards, {professorName}",
    variables: ["courseName", "date", "time", "reason", "rescheduleDate", "rescheduleTime", "location", "professorName"],
    targetAudience: "Students",
    createdDate: "2025-06-18",
    lastModified: "2025-06-18",
    status: "active"
  },
  {
    id: 4,
    name: "Office Hours Appointment Confirmation",
    category: "Administrative",
    subject: "Office Hours Appointment Confirmed - {date}",
    content: "Dear {studentName}, This email confirms your appointment during my office hours on {date} at {time}. The meeting will take place in {location}. Please bring any relevant materials or questions you'd like to discuss. If you need to reschedule or cancel, please let me know at least 24 hours in advance. Looking forward to our meeting. Best regards, {professorName}",
    variables: ["studentName", "date", "time", "location", "professorName"],
    targetAudience: "Students",
    createdDate: "2025-06-17",
    lastModified: "2025-06-19",
    status: "active"
  },
  {
    id: 5,
    name: "Exam Schedule Notification",
    category: "Academic",
    subject: "Exam Schedule: {courseName}",
    content: "Dear {studentName}, This is to inform you about the upcoming exam for {courseName}. Exam Details: Date: {examDate}, Time: {examTime}, Duration: {duration}, Location: {examLocation}, Topics Covered: {topics}. Please arrive 15 minutes early and bring your student ID and approved materials only. Electronic devices are not permitted. Good luck with your preparation! Best regards, {professorName}",
    variables: ["studentName", "courseName", "examDate", "examTime", "duration", "examLocation", "topics", "professorName"],
    targetAudience: "Students",
    createdDate: "2025-06-16",
    lastModified: "2025-06-16",
    status: "active"
  },
  {
    id: 6,
    name: "Welcome New Student",
    category: "Welcome",
    subject: "Welcome to {courseName}!",
    content: "Dear {studentName}, Welcome to {courseName}! I'm excited to have you in our class this semester. Course Information: Meeting Times: {classTimes}, Location: {classLocation}, Office Hours: {officeHours}. Please review the syllabus attached and don't hesitate to reach out if you have any questions. I look forward to working with you this semester! Best regards, {professorName}",
    variables: ["studentName", "courseName", "classTimes", "classLocation", "officeHours", "professorName"],
    targetAudience: "Students",
    createdDate: "2025-06-15",
    lastModified: "2025-06-15",
    status: "active"
  },
  {
    id: 7,
    name: "Research Opportunity Invitation",
    category: "Research",
    subject: "Research Opportunity in {researchArea}",
    content: "Dear {studentName}, I hope this email finds you well. I am writing to invite you to participate in a research project in {researchArea}. Based on your academic performance and interest, I believe you would be a valuable addition to our research team. Project Details: Duration: {duration}, Time Commitment: {timeCommitment}, Compensation: {compensation}. If you're interested, please reply by {deadline} and we can schedule a meeting to discuss further. Best regards, {professorName}",
    variables: ["studentName", "researchArea", "duration", "timeCommitment", "compensation", "deadline", "professorName"],
    targetAudience: "Students",
    createdDate: "2025-06-14",
    lastModified: "2025-06-14",
    status: "active"
  },
  {
    id: 8,
    name: "Meeting Request - Faculty",
    category: "Faculty Communication",
    subject: "Meeting Request: {meetingTopic}",
    content: "Dear {colleagueName}, I hope you're doing well. I would like to schedule a meeting to discuss {meetingTopic}. I believe this discussion would be beneficial for {reason}. Would you be available for a meeting on {proposedDate} at {proposedTime}? The meeting should take approximately {duration}. Please let me know if this time works for you, or suggest alternative times that might be better. Thank you for your time. Best regards, {professorName}",
    variables: ["colleagueName", "meetingTopic", "reason", "proposedDate", "proposedTime", "duration", "professorName"],
    targetAudience: "Faculty",
    createdDate: "2025-06-13",
    lastModified: "2025-06-13",
    status: "draft"
  }
];

// Optimized data for table display
export const templatesData = fullTemplatesData.map(template => ({
  id: template.id,
  name: template.name,
  category: template.category,
  targetAudience: template.targetAudience,
  status: template.status,
  lastModified: template.lastModified
}));

// Helper function to get full template by ID
export const getFullTemplateById = (id) => {
  return fullTemplatesData.find(template => template.id === id);
};

// Template categories for forms
export const templateCategoryOptions = [
  { value: "Academic", label: "Academic" },
  { value: "Administrative", label: "Administrative" },
  { value: "Welcome", label: "Welcome" },
  { value: "Research", label: "Research" },
  { value: "Faculty Communication", label: "Faculty Communication" },
  { value: "Event", label: "Event" },
  { value: "Reminder", label: "Reminder" }
];

// Template target audience options
export const templateTargetAudienceOptions = [
  { value: "Students", label: "Students" },
  { value: "Faculty", label: "Faculty" },
  { value: "Staff", label: "Staff" },
  { value: "All", label: "All" }
];

// Template status options
export const templateStatusOptions = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" }
];