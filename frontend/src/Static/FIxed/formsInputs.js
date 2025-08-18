import { getAllGroups, semesterOptions, getYearOptionsForGroup } from "./coursePageData.js";
import { lecturersList } from "./coursesData.js";


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

}





// community form fields

// Add these to your formsInputs.js file

// CREATE GROUP FORM FIELDS
export const createGroupFields = [
  {
    name: 'name',
    label: 'Group Name',
    type: 'text',
    placeholder: 'Enter a catchy group name',
    required: true,
    helperText: 'Choose a name that describes your group\'s purpose'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'What\'s this group about? Who should join?',
    required: true,
    rows: 4,
    helperText: 'Help people understand what your group is for'
  },
  {
    name: 'type',
    label: 'Privacy Setting',
    type: 'radio',
    required: true,
    options: [
      { 
        value: 'Public', 
        label: 'Public - Anyone can join and see content' 
      },
      { 
        value: 'Private', 
        label: 'Private - Only invited members can join' 
      }
    ]
  },
  {
    name: 'img',
    label: 'Group Image (Optional)',
    type: 'file',
    accept: 'image/*',
    helperText: 'Upload a cover image for your group (max 5MB)'
  }
];

// CREATE GROUP VALIDATION RULES
export const createGroupValidation = {
  name: (value) => {
    if (value.length < 3) return 'Group name must be at least 3 characters';
    if (value.length > 100) return 'Group name must be less than 100 characters';
    return null;
  },
  description: (value) => {
    if (value.length < 10) return 'Description must be at least 10 characters';
    if (value.length > 500) return 'Description must be less than 500 characters';
    return null;
  },
  img: (file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }
    if (file && !file.type.startsWith('image/')) {
      return 'Please select an image file';
    }
    return null;
  }
};

// INVITE FRIENDS FORM FIELDS
export const inviteFriendsFields = [
  {
    name: 'message',
    label: 'Invitation Message (Optional)',
    type: 'textarea',
    placeholder: 'Hey! You should join this group. I think you\'ll like it!',
    rows: 3,
    helperText: 'Add a personal message to your invitation'
  }
];

// INVITE FRIENDS VALIDATION RULES
export const inviteFriendsValidation = {
  message: (value) => {
    if (value && value.length > 500) {
      return 'Message must be less than 500 characters';
    }
    return null;
  }
};

// UPDATE GROUP FORM FIELDS
export const updateGroupFields = [
  {
    name: 'name',
    label: 'Group Name',
    type: 'text',
    placeholder: 'Enter group name',
    required: true
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Describe your group',
    required: true,
    rows: 4
  },
  {
    name: 'type',
    label: 'Privacy Setting',
    type: 'select',
    required: true,
    options: [
      { value: 'Public', label: 'Public' },
      { value: 'Private', label: 'Private' }
    ]
  },
  {
    name: 'img',
    label: 'Group Image URL (Optional)',
    type: 'url',
    placeholder: 'https://example.com/image.jpg'
  }
];

// UPDATE GROUP VALIDATION RULES
export const updateGroupValidation = {
  name: (value) => {
    if (value.length < 3) return 'Group name must be at least 3 characters';
    if (value.length > 100) return 'Group name must be less than 100 characters';
    return null;
  },
  description: (value) => {
    if (value.length < 10) return 'Description must be at least 10 characters';
    if (value.length > 500) return 'Description must be less than 500 characters';
    return null;
  }
};

// GROUP SEARCH FILTERS
export const groupSearchFields = [
  {
    name: 'searchTerm',
    label: 'Search Groups',
    type: 'search',
    placeholder: 'Search by name or description...'
  },
  {
    name: 'type',
    label: 'Group Type',
    type: 'select',
    options: [
      { value: 'all', label: 'All Types' },
      { value: 'Public', label: 'Public Groups' },
      { value: 'Private', label: 'Private Groups' }
    ]
  },
  {
    name: 'sortBy',
    label: 'Sort By',
    type: 'select',
    options: [
      { value: 'activity', label: 'Most Active' },
      { value: 'members', label: 'Most Members' },
      { value: 'newest', label: 'Newest First' }
    ]
  }
];

// GROUP SETTINGS FORM FIELDS
export const groupSettingsFields = [
  {
    name: 'allowMemberInvites',
    label: 'Allow members to invite friends',
    type: 'checkbox'
  },
  {
    name: 'requireApproval',
    label: 'Require admin approval for new posts',
    type: 'checkbox'
  },
  {
    name: 'allowMemberPromote',
    label: 'Allow members to promote content',
    type: 'checkbox'
  },
  {
    name: 'category',
    label: 'Group Category',
    type: 'select',
    options: [
      { value: 'study', label: 'Study Groups' },
      { value: 'social', label: 'Social & Networking' },
      { value: 'professional', label: 'Professional Development' },
      { value: 'hobby', label: 'Hobbies & Interests' },
      { value: 'sports', label: 'Sports & Fitness' },
      { value: 'tech', label: 'Technology' },
      { value: 'other', label: 'Other' }
    ]
  }
];

// REPORT GROUP FORM FIELDS
export const reportGroupFields = [
  {
    name: 'reason',
    label: 'Reason for Reporting',
    type: 'select',
    required: true,
    options: [
      { value: 'spam', label: 'Spam or Scam' },
      { value: 'harassment', label: 'Harassment or Bullying' },
      { value: 'inappropriate', label: 'Inappropriate Content' },
      { value: 'fake', label: 'Fake Information' },
      { value: 'violence', label: 'Violence or Threats' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    name: 'details',
    label: 'Additional Details',
    type: 'textarea',
    placeholder: 'Please provide more information about why you\'re reporting this group...',
    rows: 4,
    required: true
  }
];

// REPORT GROUP VALIDATION RULES
export const reportGroupValidation = {
  details: (value) => {
    if (value.length < 10) return 'Please provide more details (at least 10 characters)';
    if (value.length > 1000) return 'Details must be less than 1000 characters';
    return null;
  }
};

// PROMOTE MEMBER FORM FIELDS
export const promoteMemberFields = [
  {
    name: 'role',
    label: 'New Role',
    type: 'select',
    required: true,
    options: [
      { value: 'Member', label: 'Member' },
      { value: 'Co-founder', label: 'Co-founder (Admin)' }
    ]
  },
  {
    name: 'reason',
    label: 'Reason for Promotion (Optional)',
    type: 'textarea',
    placeholder: 'Why are you promoting this member?',
    rows: 2
  }
];

// TRANSFER OWNERSHIP FORM FIELDS
export const transferOwnershipFields = [
  {
    name: 'confirmation',
    label: 'Type "TRANSFER" to confirm',
    type: 'text',
    placeholder: 'TRANSFER',
    required: true,
    helperText: 'This action cannot be undone. You will lose founder privileges.'
  },
  {
    name: 'reason',
    label: 'Reason for Transfer',
    type: 'textarea',
    placeholder: 'Why are you transferring ownership?',
    rows: 3,
    required: true
  }
];

// TRANSFER OWNERSHIP VALIDATION
export const transferOwnershipValidation = {
  confirmation: (value) => {
    if (value !== 'TRANSFER') return 'Please type "TRANSFER" to confirm';
    return null;
  },
  reason: (value) => {
    if (value.length < 10) return 'Please provide a reason (at least 10 characters)';
    return null;
  }
};