// Components/Forms/assignmentFields.js
const assignmentFields = [
  /* Internal ID – hidden or generated automatically */
  {
    name: 'id',
    type: 'hidden',
  },

  /* Assignment title */
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'e.g., Calculus Integration Project',
    required: true,
  },

  /* Detailed description */
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    rows: 4,
    placeholder: 'Describe the assignment requirements…',
  },

  /* Course / category */
  {
    name: 'course',
    label: 'Course',
    type: 'select',
    options: [
      { value: 'math',        label: 'Mathematics' }, 
      { value: 'science',     label: 'Science' },
      { value: 'history',     label: 'History' },
      { value: 'literature',  label: 'Literature' },
      { value: 'programming', label: 'Programming' },
      { value: 'art',         label: 'Art' },
      { value: 'other',       label: 'Other' },]
    
  },

  /* Assignment type */
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'assignment',   label: 'Assignment' },
      { value: 'test',         label: 'Test' },
      { value: 'exam',         label: 'Exam' },
      { value: 'presentation', label: 'Presentation' },
      { value: 'project',      label: 'Project' },
    ],
    required: true,
  },

  /* Due date & time */
  {
    name: 'dueDate',
    label: 'Due Date',
    type: 'date',
    required: true,
  },
  {
    name: 'dueTime',
    label: 'Due Time',
    type: 'time',
  },

  /* Progress % (0-100) */
  {
    name: 'progress',
    label: 'Progress',
    type: 'number',
    placeholder: '0-100',
    props: { min: 0, max: 100 },
  },

  /* Assignment status */
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'pending',     label: 'Pending' },
      { value: 'in-progress', label: 'In-Progress' },
      { value: 'completed',   label: 'Completed' },
    ],
    required: true,
  },

  /* Priority */
  {
    name: 'priority',
    label: 'Priority',
    type: 'select',
    options: [
      { value: 'low',    label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high',   label: 'High' },
      { value: 'urgent', label: 'Urgent' },
    ],
  },

  /* Instructor / owner */
  {
    name: 'instructor',
    label: 'Instructor',
     type: 'select',
    options: [
      { value: 'john_doe', label: 'John Doe' },
      { value: 'jane_smith', label: 'Jane Smith' },
      { value: 'mike_jones', label: 'Mike Jones' },
      { value: 'susan_brown', label: 'Susan Brown' },
      { value: 'other', label: 'Other' },
    ],
  },

  /* Difficulty level */
  {
    name: 'difficulty',
    label: 'Difficulty',
    type: 'select',
    options: [
      { value: 'Beginner',     label: 'Beginner' },
      { value: 'Intermediate', label: 'Intermediate' },
      { value: 'Advanced',     label: 'Advanced' },
    ],
  },

  

  /* Semester */
  {
    name: 'semester',
    label: 'Semester',
    type: 'text',
    placeholder: 'Fall 2024, Spring 2025…',
  },
];

export default assignmentFields;
