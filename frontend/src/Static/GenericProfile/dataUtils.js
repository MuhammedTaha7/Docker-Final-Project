
export const generateScheduleData = (profileData) => {
  // Backend placeholder
  /*
  const response = await fetch(`/api/schedule/${profileData.lecturer.id}`);
  if (!response.ok) throw new Error('Failed to fetch schedule');
  const schedule = await response.json();
  */
  const schedule = profileData?.schedule?.length > 0 ? profileData.schedule : [
    {
      id: 1, courseCode: "CS101", courseName: "Introduction to Programming",
      day: "Monday", startTime: "09:00", endTime: "10:30",
      room: "Room A101", building: "Computer Science Building",
      semester: "Fall 2024", students: 45, type: "Lecture"
    },
    {
      id: 2, courseCode: "CS101", courseName: "Introduction to Programming Lab",
      day: "Wednesday", startTime: "14:00", endTime: "16:00",
      room: "Lab B205", building: "Computer Science Building",
      semester: "Fall 2024", students: 25, type: "Lab"
    },
    {
      id: 3, courseCode: "CS301", courseName: "Data Structures & Algorithms",
      day: "Tuesday", startTime: "11:00", endTime: "12:30",
      room: "Room A203", building: "Computer Science Building",
      semester: "Fall 2024", students: 38, type: "Lecture"
    },
    {
      id: 4, courseCode: "CS301", courseName: "Data Structures & Algorithms",
      day: "Thursday", startTime: "11:00", endTime: "12:30",
      room: "Room A203", building: "Computer Science Building",
      semester: "Fall 2024", students: 38, type: "Lecture"
    },
    {
      id: 5, courseCode: "CS450", courseName: "Advanced Machine Learning",
      day: "Friday", startTime: "10:00", endTime: "11:30",
      room: "Room C301", building: "Research Building",
      semester: "Fall 2024", students: 22, type: "Seminar"
    }
  ];

  const weeklyHours = schedule.reduce((total, item) => {
    const start = new Date(`2024-01-01 ${item.startTime}`);
    const end = new Date(`2024-01-01 ${item.endTime}`);
    return total + (end - start) / (1000 * 60 * 60);
  }, 0);

  const totalStudents = schedule.reduce((total, item) => total + (item.students || 0), 0);

  return {
    schedule,
    summary: {
      weeklyHours,
      totalStudents,
      totalClasses: schedule.length,
      uniqueCourses: [...new Set(schedule.map(item => item.courseCode))].length
    }
  };
};

export const generateResourcesData = () => {
  // Backend placeholder
  /*
  const response = await fetch('/api/resources');
  if (!response.ok) throw new Error('Failed to fetch resources');
  const resources = await response.json();
  return resources;
  */
  return {
    courseMaterials: [
      {
        id: 1, courseCode: "CS401", courseName: "Artificial Intelligence",
        fileName: "AI_Lecture_Notes_Week1-5.pdf", fileType: "PDF",
        fileSize: "2.4 MB", uploadDate: "2024-01-15",
        category: "Lecture Notes", downloads: 127, status: "Active"
      },
      {
        id: 2, courseCode: "CS401", courseName: "Artificial Intelligence",
        fileName: "Machine_Learning_Tutorial.mp4", fileType: "Video",
        fileSize: "156 MB", uploadDate: "2024-01-20",
        category: "Video Lectures", downloads: 89, status: "Active"
      },
      {
        id: 3, courseCode: "CS501", courseName: "Machine Learning",
        fileName: "Python_Programming_Assignment.zip", fileType: "ZIP",
        fileSize: "512 KB", uploadDate: "2024-01-25",
        category: "Assignments", downloads: 156, status: "Active"
      }
    ]
  };
};
