// This is your existing array for the assignment form
export const assignmentFields = [
    {
        label: "Title",
        name: "title",
        type: "text",
        required: true,
    },
    {
        label: "Type",
        name: "type",
        type: "select",
        options: ["assignment", "test", "exam", "presentation", "project"],
        required: true,
    },
    {
        label: "Due Date",
        name: "dueDate",
        type: "date",
        required: true,
    },
    {
        label: "Due Time",
        name: "dueTime",
        type: "time",
    },
    {
        label: "Description",
        name: "description",
        type: "textarea",
    },
    {
        label: "Progress",
        name: "progress",
        type: "number",
        min: 0,
        max: 100,
    },
];

// ✅ ADD THIS NEW ARRAY for the recurring event form
export const eventFields = [
    { 
        label: "Title", 
        name: "title", 
        type: "text", 
        required: true 
    },
    { 
        label: "Type", 
        name: "type", 
        type: "select", 
        options: ["LECTURE", "LAB", "SEMINAR", "PRACTICE", "MEETING"], 
        required: true 
    },
    { 
        label: "Start Date", 
        name: "startDate", 
        type: "date", 
        required: true 
    },
    { 
        label: "End Date", 
        name: "endDate", 
        type: "date", 
        required: true 
    },
    {
        label: "Day of the Week",
        name: "dayOfWeek",
        type: "select",
        required: true,
        options: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
    },
    { 
        label: "Start Time", 
        name: "startTime", 
        type: "time", 
        required: true 
    },
    { 
        label: "End Time", 
        name: "endTime", 
        type: "time", 
        required: true 
    },
    { 
        label: "Location", 
        name: "location", 
        type: "text" 
    },
    {
        label: "Lecturer",
        name: "instructorId",
        type: "select",
        required: true,
        placeholder: "Select a lecturer"
    }
    // Note: You would later add dropdowns here to select the
    // Course, Instructor, and Learning Group for the event.
];