// src/Api/genericProfilePageApi.js
import axios from 'axios';
import { fetchReceivedMessages, fetchSentMessages } from './messagesPageApi.js';


const API_BASE_URL = 'http://localhost:8080/api';
const STUDENTS_URL = `${API_BASE_URL}/students`;
const LECTURERS_URL = `${API_BASE_URL}/lecturers`;
const GRADES_URL = `${API_BASE_URL}/grades`;
const COURSES_URL = `${API_BASE_URL}/courses`;
const ENROLLMENTS_URL = `${API_BASE_URL}/enrollments`;
const SCHEDULES_URL = `${API_BASE_URL}/schedules`;
const RESOURCES_URL = `${API_BASE_URL}/resources`;
const REQUESTS_URL = `${API_BASE_URL}/requests`;

// const ANALYTICS_URL = `${API_BASE_URL}/analytics`;
const FILES_URL = `${API_BASE_URL}/files`;
const ANALYTICS_URL = `${API_BASE_URL}/profile-analytics`;

axios.defaults.withCredentials = true;

const generateStudentStatCards = (stats) => {
  return [
    {
      id: "gpa",
      title: "Current GPA",
      value: stats.gpa || 0,
      subtitle: "Academic Performance",
      icon: "award",
      color: "#3b82f6",
      trend: "up"
    },
    {
      id: "total-credits",
      title: "Total Credits",
      value: stats.totalCredits || 0,
      subtitle: "Credits Earned",
      icon: "book-open",
      color: "#10b981",
      trend: "up"
    },
    {
      id: "completed-courses",
      title: "Completed Courses",
      value: stats.completedCourses || 0,
      subtitle: `${stats.totalCourses || 0} Total`,
      icon: "check-circle",
      color: "#f59e0b",
      trend: "up"
    },
    {
      id: "enrollment-status",
      title: "Status",
      value: stats.enrollmentStatus || "Unknown",
      subtitle: "Current Status",
      icon: "user-check",
      color: stats.enrollmentStatus === "Active" ? "#10b981" : "#6b7280",
      trend: "stable"
    }
  ];
};

// ✅ New: Generate lecturer stat cards from stats data
const generateLecturerStatCards = (stats) => {
  return [
    {
      id: "active-courses",
      title: "Active Courses",
      value: stats.activeCourses || 0,
      subtitle: "Currently Teaching",
      icon: "book",
      color: "#3b82f6",
      trend: "up"
    },
    {
      id: "total-students",
      title: "Total Students",
      value: stats.totalStudents || 0,
      subtitle: "Across All Courses",
      icon: "users",
      color: "#10b981",
      trend: "up"
    },
    {
      id: "average-rating",
      title: "Avg Rating",
      value: stats.averageRating || 0,
      subtitle: "Student Feedback",
      icon: "star",
      color: "#f59e0b",
      trend: "up"
    },
    {
      id: "total-publications",
      title: "Publications",
      value: stats.totalPublications || 0,
      subtitle: "Research Output",
      icon: "file-text",
      color: "#8b5cf6",
      trend: "up"
    }
  ];
};

/* ==================================================================
                            PROFILE DATA
   ================================================================== */

export const getProfileData = async (entityType, id) => {
  try {
    const baseUrl = entityType === 'student' ? STUDENTS_URL : LECTURERS_URL;
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityType} profile:`, error);
    throw error;
  }
};

// export const getProfileStats = async (entityType, id) => {
//   try {
//     const response = await axios.get(`${ANALYTICS_URL}/${entityType}/${id}/stats`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching ${entityType} stats:`, error);
//     throw error;
//   }
// };

export const getStudentEnrollments = async (studentId) => {
  try {
    // This endpoint should return all courses where the student is enrolled
    const response = await axios.get(`${COURSES_URL}/student-enrollments/${studentId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching student enrollments:", error);
    return [];
  }
};

export const getProfileStats = async (entityType, id) => {
  try {
    // ✅ Fixed: Change to GET request to match backend
    const response = await axios.get(`${ANALYTICS_URL}/${entityType}/${id}/stats`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityType} stats:`, error);
    throw error;
  }
};

export const getStatCards = async (entityType, stats) => {
  try {
    // Process stats into card format based on entity type
    if (entityType === 'student') {
      return generateStudentStatCards(stats);
    } else if (entityType === 'lecturer') {
      return generateLecturerStatCards(stats);
    }
    return [];
  } catch (error) {
    console.error(`Error generating ${entityType} stat cards:`, error);
    return [];
  }
};

export const getEntityProfile = async (entityType, id) => {
  try {
    const baseUrl = entityType === 'student' ? STUDENTS_URL : LECTURERS_URL;
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityType} entity profile:`, error);
    throw error;
  }
};

export const updateEntityProfile = async (entityType, id, profileData) => {
  try {
    const baseUrl = entityType === 'student' ? STUDENTS_URL : LECTURERS_URL;
    const response = await axios.put(`${baseUrl}/${id}`, profileData);
    return response.data;
  } catch (error) {
    console.error(`Error updating ${entityType} profile:`, error);
    throw error;
  }
};

/* ==================================================================
                            GRADES
   ================================================================== */

export const getGrades = async (entityType, id) => {
  try {
    const response = await axios.get(`${GRADES_URL}/by-${entityType}/${id}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching grades for ${entityType}:`, error);
    return [];
  }
};

export const updateFinalGrade = async (studentId, courseId, finalGrade) => {
    try {
        const response = await axios.put(`${GRADES_URL}/students/${studentId}/courses/${courseId}/final-grade`, {
            finalGrade: finalGrade
        });
        return response.data;
    } catch (error) {
        console.error("Error updating final grade:", error);
        throw error;
    }
};

export const addGrade = async (entityType, id, gradeData) => {
  try {
    const response = await axios.post(GRADES_URL, {
      ...gradeData,
      [`${entityType}Id`]: id
    });
    return response.data;
  } catch (error) {
    console.error("Error adding grade:", error);
    throw error;
  }
};

export const updateGrade = async (entityType, id, gradeId, gradeData) => {
  try {
    const response = await axios.put(`${GRADES_URL}/${gradeId}`, {
      ...gradeData,
      [`${entityType}Id`]: id
    });
    return response.data;
  } catch (error) {
    console.error("Error updating grade:", error);
    throw error;
  }
};

export const deleteGrade = async (entityType, id, gradeId) => {
  try {
    await axios.delete(`${GRADES_URL}/${gradeId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting grade:", error);
    throw error;
  }
};

/* ==================================================================
                            COURSES
   ================================================================== */

export const getCourses = async (entityType, id) => {
  try {
    const response = await axios.get(`${COURSES_URL}/by-${entityType}/${id}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching courses for ${entityType}:`, error);
    return [];
  }
};

export const getAvailableCourses = async () => {
  try {
    const response = await axios.get(`${COURSES_URL}/available`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching available courses:", error);
    return [];
  }
};

export const addCourse = async (entityType, id, courseData) => {
  try {
    if (entityType === 'lecturer') {
      // For lecturers, assign existing course
      const response = await axios.post(`${COURSES_URL}/assign`, {
        lecturerId: id,
        ...courseData
      });
      return response.data;
    } else {
      // For students, create new course
      const response = await axios.post(COURSES_URL, {
        ...courseData,
        createdBy: id
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};

export const updateCourse = async (entityType, id, courseId, courseData) => {
  try {
    const response = await axios.put(`${COURSES_URL}/${courseId}`, courseData);
    return response.data;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

export const deleteCourse = async (entityType, id, courseId) => {
  try {
    if (entityType === 'lecturer') {
      // For lecturers, unassign course
      await axios.delete(`${COURSES_URL}/unassign/${courseId}/${id}`);
    } else {
      // For students, delete course
      await axios.delete(`${COURSES_URL}/${courseId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

/* ==================================================================
                            ENROLLMENTS
   ================================================================== */

export const getEnrollments = async (entityType, id) => {
  try {
    // ✅ FIXED: Use correct endpoint from CourseController
    const response = await axios.get(`${COURSES_URL}/enrollments/by-${entityType}/${id}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching enrollments for ${entityType}:`, error);
    return [];
  }
};

export const addEnrollment = async (entityType, id, enrollmentData) => {
  try {
    const response = await axios.post(ENROLLMENTS_URL, {
      ...enrollmentData,
      [`${entityType}Id`]: id
    });
    return response.data;
  } catch (error) {
    console.error("Error adding enrollment:", error);
    throw error;
  }
};

export const updateEnrollment = async (entityType, id, enrollmentId, enrollmentData) => {
  try {
    const response = await axios.put(`${ENROLLMENTS_URL}/${enrollmentId}`, {
      ...enrollmentData,
      [`${entityType}Id`]: id
    });
    return response.data;
  } catch (error) {
    console.error("Error updating enrollment:", error);
    throw error;
  }
};

export const deleteEnrollment = async (entityType, id, enrollmentId) => {
  try {
    await axios.delete(`${ENROLLMENTS_URL}/${enrollmentId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    throw error;
  }
};

/* ==================================================================
                            SCHEDULES
   ================================================================== */

export const getSchedule = async (entityType, id) => {
  try {
    const response = await axios.get(`${SCHEDULES_URL}/by-${entityType}/${id}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching schedule for ${entityType}:`, error);
    return [];
  }
};

export const addSchedule = async (entityType, id, scheduleData) => {
  try {
    const response = await axios.post(SCHEDULES_URL, {
      ...scheduleData,
      [`${entityType}Id`]: id
    });
    return response.data;
  } catch (error) {
    console.error("Error adding schedule:", error);
    throw error;
  }
};

export const updateSchedule = async (entityType, id, scheduleId, scheduleData) => {
  try {
    const response = await axios.put(`${SCHEDULES_URL}/${scheduleId}`, {
      ...scheduleData,
      [`${entityType}Id`]: id
    });
    return response.data;
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw error;
  }
};

export const deleteSchedule = async (entityType, id, scheduleId) => {
  try {
    await axios.delete(`${SCHEDULES_URL}/${scheduleId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
};

/* ==================================================================
                            RESOURCES
   ================================================================== */

export const getResources = async (entityType, id) => {
  try {
    const response = await axios.get(`${RESOURCES_URL}/by-${entityType}/${id}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching resources for ${entityType}:`, error);
    return [];
  }
};

export const addResource = async (entityType, id, resourceData) => {
  try {
    // Handle file upload
    if (resourceData.file) {
      const formData = new FormData();
      formData.append('file', resourceData.file);
      
      // Append other form fields
      Object.keys(resourceData).forEach(key => {
        if (key !== 'file' && resourceData[key] !== undefined && resourceData[key] !== null) {
          formData.append(key, resourceData[key]);
        }
      });
      
      formData.append(`${entityType}Id`, id);
      
      const response = await axios.post(`${RESOURCES_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Regular resource without file
      const response = await axios.post(RESOURCES_URL, {
        ...resourceData,
        [`${entityType}Id`]: id
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error adding resource:", error);
    throw error;
  }
};

// Updated downloadResource function in genericProfilePageApi.js
export const downloadResource = async (entityType, id, resourceId) => {
  try {
    // Simplified approach - just open the download URL directly
    // This matches the working approach from your files manager
    window.open(`http://localhost:8080/api/resources/${resourceId}/download`, '_blank');
    return { success: true };
  } catch (error) {
    console.error("Error downloading resource:", error);
    throw error;
  }
};

// Updated deleteResource function
export const deleteResource = async (entityType, id, resourceId) => {
  try {
    await axios.delete(`${RESOURCES_URL}/${resourceId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw error;
  }
};



/* ==================================================================
                            SEARCH & UTILITIES
   ================================================================== */

export const searchEntities = async (entityType, searchTerm) => {
  try {
    const baseUrl = entityType === 'student' ? STUDENTS_URL : LECTURERS_URL;
    const response = await axios.get(`${baseUrl}/search`, {
      params: { q: searchTerm }
    });
    return response.data || [];
  } catch (error) {
    console.error(`Error searching ${entityType}s:`, error);
    return [];
  }
};

/* ==================================================================
                            ANALYTICS
   ================================================================== */

export const getAnalytics = async (entityType, id, timeframe = '30d') => {
  try {
    const response = await axios.get(`${ANALYTICS_URL}/${entityType}/${id}`, {
      params: { timeframe }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching analytics for ${entityType}:`, error);
    throw error;
  }
};

export const getPerformanceMetrics = async (entityType, id) => {
  try {
    const response = await axios.get(`${ANALYTICS_URL}/${entityType}/${id}/metrics`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching performance metrics for ${entityType}:`, error);
    throw error;
  }
};



/* ==================================================================
                            NOTIFICATIONS
   ================================================================== */

export const getNotifications = async (entityType, id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications/by-${entityType}/${id}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching notifications for ${entityType}:`, error);
    return [];
  }
};

export const markNotificationRead = async (entityType, id, notificationId) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/* ==================================================================
                            FILES (Additional)
   ================================================================== */

export const uploadFile = async (categoryId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${FILES_URL}/upload/${categoryId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteFile = async (fileId) => {
  try {
    await axios.delete(`${FILES_URL}/${fileId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const getFilesByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${FILES_URL}/by-category/${categoryId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching files by category:", error);
    return [];
  }
};

export const getMessages = async (entityType, id) => {
  try {
    // Get both sent and received messages for the user
    const [receivedMessages, sentMessages] = await Promise.all([
      fetchReceivedMessages(),
      fetchSentMessages()
    ]);
    
    // Filter messages where the user is either sender or recipient
    const userMessages = [...receivedMessages, ...sentMessages].filter(message => 
      message.senderId === id || message.recipientId === id
    );
    
    return userMessages || [];
  } catch (error) {
    console.error(`Error fetching messages for ${entityType}:`, error);
    return [];
  }
};

export const sendMessageReply = async (messageId, replyData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/messages/${messageId}/reply`, replyData);
    return response.data;
  } catch (error) {
    console.error("Error sending message reply:", error);
    throw error;
  }
};

export const getLecturerCourses = async (lecturerId) => {
  try {
    const response = await axios.get(`${COURSES_URL}/by-lecturer/${lecturerId}`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching courses for lecturer:", error);
    return [];
  }
};


// Export all API functions
export default {
  // Profile
  getProfileData,
  getProfileStats,
  getStatCards,
  getEntityProfile,
  updateEntityProfile,
  
  // Grades
  getGrades,
  addGrade,
  updateGrade,
  deleteGrade,
  
  // Courses
  getCourses,
  getAvailableCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  
  // Enrollments
  getEnrollments,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment,
  
  // Schedule
  getSchedule,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  
  // Resources
  getResources,
  addResource,
  deleteResource,
  downloadResource,
  
  // Utilities
  searchEntities,
  getAnalytics,
  getPerformanceMetrics,
  getNotifications,
  markNotificationRead,
  
  // Files
  uploadFile,
  deleteFile,
  getFilesByCategory,
};