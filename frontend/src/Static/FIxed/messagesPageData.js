// src/Static/FIxed/messagesPageData.js
/* ============================
   DROPDOWN OPTIONS
============================ */
export const targetAudienceOptions = [
  { value: "student", label: "Students" },
  { value: "instructor", label: "Instructors" },
  { value: "all", label: "All" },
];

export const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const templateCategoryOptions = [
  { value: "welcome", label: "Welcome" },
  { value: "notice", label: "Notice" },
  { value: "reminder", label: "Reminder" },
  { value: "other", label: "Other" },
];

export const templateTargetAudienceOptions = [
  { value: "student", label: "Students" },
  { value: "lecturer", label: "Lecturers" },
];

export const templateStatusOptions = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
];

/* ============================
   SAMPLE DATA
============================ */
// Messages (summary only)
export const messagesData = [
  {
    id: 1,
    sender: "John Doe",
    subject: "Course Inquiry",
    date: "2025-07-01",
    priority: "high",
  },
  {
    id: 2,
    sender: "Jane Smith",
    subject: "Assignment 3 question",
    date: "2025-07-02",
    priority: "medium",
  },
  {
    id: 3,
    sender: "Alex Johnson",
    subject: "Feedback on lecture",
    date: "2025-07-03",
    priority: "low",
  },
];

// Full Message Details
export const fullMessagesData = [
  {
    id: 1,
    sender: "John Doe",
    senderType: "Student",
    email: "john.doe@example.edu",
    subject: "Course Inquiry",
    date: "2025-07-01",
    time: "10:30",
    priority: "high",
    message: "I have a question about the final project requirements for the CS101 course. Can you please provide more details on the submission format?",
  },
  {
    id: 2,
    sender: "Jane Smith",
    senderType: "Student",
    email: "jane.smith@example.edu",
    subject: "Assignment 3 question",
    date: "2025-07-02",
    time: "14:45",
    priority: "medium",
    message: "I am having trouble with question 5 on Assignment 3. The code is not compiling. Could you help me debug it?",
  },
  {
    id: 3,
    sender: "Alex Johnson",
    senderType: "Instructor",
    email: "alex.johnson@example.edu",
    subject: "Feedback on lecture",
    date: "2025-07-03",
    time: "09:00",
    priority: "low",
    message: "Just wanted to provide some feedback on the last lecture. The pace was a bit fast, and I think some students might have missed key concepts.",
  },
];

export const getFullMessageById = (id) => {
  return fullMessagesData.find((message) => message.id === id);
};

// Announcements - Summary
export const announcementsData = [
  {
    id: 1,
    title: "Course Schedule Update",
    targetAudience: "Students",
    priority: "high",
    status: "active",
    createdDate: "2025-07-01",
  },
  {
    id: 2,
    title: "Holiday Notice",
    targetAudience: "All",
    priority: "medium",
    status: "active",
    createdDate: "2025-07-05",
  },
];

// Announcements - Full Detail
export const fullAnnouncementsData = [
  {
    id: 1,
    title: "Course Schedule Update",
    content: "The schedule for CS101 has been updated. Please check the new times on the course page.",
    targetAudience: "Students",
    targetAudienceType: "student",
    priority: "high",
    status: "active",
    createdDate: "2025-07-01",
    createdTime: "10:00",
    expiryDate: "2025-07-31",
    scheduledDate: null,
  },
  {
    id: 2,
    title: "Holiday Notice",
    content: "The university will be closed on July 10th in observance of the national holiday.",
    targetAudience: "All",
    targetAudienceType: "all",
    priority: "medium",
    status: "active",
    createdDate: "2025-07-05",
    createdTime: "12:00",
    expiryDate: "2025-07-09",
    scheduledDate: null,
  },
];

export const getFullAnnouncementById = (id) => {
  return fullAnnouncementsData.find((announcement) => announcement.id === id);
};

// Templates - Summary
export const templatesData = [
  {
    id: 1,
    name: "Welcome Email",
    category: "welcome", // lowercase to match category options
    targetAudience: "student", // lowercase to match audience options
    status: "active",
    lastModified: "2025-07-01",
  },
  {
    id: 2,
    name: "Assignment Due Reminder",
    category: "reminder",
    targetAudience: "student",
    status: "active",
    lastModified: "2025-07-15",
  },
];

// Templates - Full Detail
export const fullTemplatesData = [
  {
    id: 1,
    name: "Welcome Email",
    category: "welcome",
    subject: "Welcome to the Course",
    content: "Dear {name},\n\nWelcome to {course}! We're excited to have you join us. This is a reminder of the first class on {date} at {time} in {location}.\n\nBest regards,\nYour instructor, {instructor}.",
    variables: ["name", "course", "date", "time", "location", "instructor"],
    targetAudience: "student",
    createdDate: "2025-07-01",
    lastModified: "2025-07-01",
    status: "active",
  },
  {
    id: 2,
    name: "Assignment Due Reminder",
    category: "reminder",
    subject: "Reminder: Assignment {assignmentNumber} Due Soon",
    content: "Hi {name},\n\nJust a friendly reminder that Assignment {assignmentNumber} for {course} is due on {dueDate}. Please make sure to submit your work on time to avoid any penalties.\n\nGood luck,\nYour instructor.",
    variables: ["name", "assignmentNumber", "course", "dueDate"],
    targetAudience: "student",
    createdDate: "2025-07-15",
    lastModified: "2025-07-15",
    status: "active",
  },
];

export const getFullTemplateById = (id) => {
  return fullTemplatesData.find((template) => template.id === id);
};

/* ============================
   FORM FIELDS
============================ */
// Announcement Form Fields
export const announcementFormFields = [
  {
    name: "title",
    label: "Title",
    type: "text",
    required: true,
    placeholder: "Enter announcement title",
  },
  {
    name: "content",
    label: "Content",
    type: "textarea",
    required: true,
    placeholder: "Write your announcement content...",
  },
  {
    name: "targetAudienceType",
    label: "Target Audience",
    type: "select",
    options: targetAudienceOptions,
    required: true,
  },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    options: priorityOptions,
    required: true,
  },
  {
    name: "expiryDate",
    label: "Expiry Date",
    type: "date",
    required: true,
  },
  {
    name: "scheduledDate",
    label: "Scheduled Date (Optional)",
    type: "date",
  },
];

// Template Form Fields
export const templateFormFields = [
  {
    name: "name",
    label: "Template Name",
    type: "text",
    required: true,
    placeholder: "Enter template name",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: templateCategoryOptions,
    required: true,
  },
  {
    name: "targetAudience",
    label: "Target Audience",
    type: "select",
    options: templateTargetAudienceOptions,
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: templateStatusOptions,
    required: true,
  },
  {
    name: "subject",
    label: "Subject",
    type: "text",
    required: true,
    placeholder: "Enter email subject",
  },
  {
    name: "content",
    label: "Content",
    type: "textarea",
    required: true,
    placeholder: "Write your email content here...",
  },
  {
    name: "variables",
    label: "Variables (e.g., name, course)",
    type: "text",
    placeholder: "name, course",
  },
];