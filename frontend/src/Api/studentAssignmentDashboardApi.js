// api/studentAssignmentDashboardApi.js - Fixed to match backend endpoints
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Try to get token from cookies first (since you're using react-cookie)
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('jwtToken='))
      ?.split('=')[1];
    
    // Also try localStorage as fallback
    const authToken = cookieToken || localStorage.getItem('authToken');
    
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    // Handle auth errors
    if (error.response?.status === 401) {
      // Clear both cookie and localStorage
      document.cookie = 'jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const studentApi = {
  // ====================================
  // ASSIGNMENTS API (Tasks for Students)
  // ====================================
  
  // Get assignments for a course (Students access tasks)
  getAssignmentsByCourse: async (courseId, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.priority) params.append('priority', filters.priority);
    
    const url = `/courses/${courseId}/tasks${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get assignments for a specific student (uses backend endpoint)
  getAssignmentsForStudent: async (studentId, courseId, status = null) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    
    const url = `/tasks/student/${studentId}/course/${courseId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single assignment (task)
  getAssignment: async (assignmentId) => {
    const response = await apiClient.get(`/tasks/${assignmentId}`);
    return response.data;
  },

  // Get upcoming assignments for student
  getUpcomingAssignments: async (studentId, courseId = null, daysAhead = 7) => {
    const params = new URLSearchParams();
    if (courseId) params.append('courseId', courseId);
    params.append('daysAhead', daysAhead);
    
    const url = `/tasks/student/${studentId}/upcoming${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get overdue assignments for student
  getOverdueAssignments: async (studentId, courseId = null) => {
    const params = new URLSearchParams();
    if (courseId) params.append('courseId', courseId);
    
    const url = `/tasks/student/${studentId}/overdue${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Search assignments
  searchAssignments: async (courseId, query) => {
    const response = await apiClient.get(`/tasks/search?courseId=${courseId}&query=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Download assignment file
  downloadAssignmentFile: async (assignmentId) => {
    try {
      const response = await apiClient.get(`/tasks/${assignmentId}/download`, {
        responseType: 'blob'
      });
      
      if (response.data instanceof Blob) {
        return response.data;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },

  // ====================================
  // SUBMISSIONS API
  // ====================================

  // Create new submission (simple version for students)
  createSubmission: async (submissionData) => {
    const response = await apiClient.post('/tasksubmissions/simple', submissionData);
    return response.data;
  },

  // Submit assignment with file (Enhanced for students)
  submitAssignment: async (assignmentId, submissionData) => {
    const formData = new FormData();
    
    // Add basic submission data
    formData.append('taskId', assignmentId);
    formData.append('content', submissionData.content || '');
    formData.append('notes', submissionData.notes || '');
    
    // Add files if present
    if (submissionData.files && submissionData.files.length > 0) {
      submissionData.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await apiClient.post('/tasksubmissions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update submission by student (before grading)
  updateSubmission: async (submissionId, updates) => {
    const response = await apiClient.put(`/tasksubmissions/${submissionId}/student`, updates);
    return response.data;
  },

  // Delete submission by student
  deleteSubmission: async (submissionId) => {
    try {
      console.log('🗑️ Deleting submission:', submissionId);
      const response = await apiClient.delete(`/tasksubmissions/${submissionId}`);
      console.log('✅ Submission deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Delete submission error:', error);
      throw error;
    }
  },

  // Check if student can delete their submission
  canDeleteSubmission: async (submissionId) => {
    try {
      const response = await apiClient.get(`/tasksubmissions/${submissionId}/can-delete`);
      return response.data;
    } catch (error) {
      console.error('❌ Error checking delete permission:', error);
      return { canDelete: false, reason: 'Unknown error' };
    }
  },

  // Get submission by ID
  getSubmission: async (submissionId) => {
    const response = await apiClient.get(`/tasksubmissions/${submissionId}`);
    return response.data;
  },

  // Get student's submissions for a course
  getStudentSubmissions: async (studentId, courseId) => {
    const url = courseId 
      ? `/tasksubmissions/student/${studentId}?courseId=${courseId}`
      : `/tasksubmissions/student/${studentId}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get specific student's submission for a task
  getStudentSubmissionForTask: async (studentId, taskId) => {
    const response = await apiClient.get(`/tasksubmissions/student/${studentId}/task/${taskId}`);
    return response.data;
  },

  // Get submissions for a task
  getSubmissionsByTask: async (taskId) => {
    const response = await apiClient.get(`/tasksubmissions/task/${taskId}`);
    return response.data;
  },

  // Check if student can submit
  canStudentSubmit: async (taskId, studentId) => {
    const response = await apiClient.get(`/tasks/${taskId}/can-submit/${studentId}`);
    return response.data;
  },

  // Get student submission statistics
  getStudentSubmissionStats: async (studentId, courseId = null) => {
    const url = courseId 
      ? `/tasksubmissions/student/${studentId}/stats?courseId=${courseId}`
      : `/tasksubmissions/student/${studentId}/stats`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // ====================================
  // COURSES API
  // ====================================

  // Get student's enrolled courses
  getEnrolledCourses: async (studentId) => {
    try {
      const response = await apiClient.get('/courses');
      return response.data;
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      return [];
    }
  },

  // Get course details
  getCourse: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching course:', err);
      return null;
    }
  },

  // ====================================
  // GRADES API - FIXED TO MATCH BACKEND
  // ====================================

  // Get student grades for a course
  getCourseGrades: async (courseId) => {
    try {
      console.log('📊 Fetching course grades for:', courseId);
      const response = await apiClient.get(`/courses/${courseId}/grades`);
      console.log('✅ Course grades fetched:', response.data?.length || 0);
      return response.data || [];
    } catch (err) {
      console.error('❌ Error fetching course grades:', err);
      return [];
    }
  },

  // Get grade columns for a course
  getGradeColumns: async (courseId) => {
    try {
      console.log('📋 Fetching grade columns for:', courseId);
      const response = await apiClient.get(`/courses/${courseId}/grade-columns`);
      console.log('✅ Grade columns fetched:', response.data?.length || 0);
      return response.data || [];
    } catch (err) {
      console.error('❌ Error fetching grade columns:', err);
      return [];
    }
  },

  // Get student's final grade for a course
  getFinalGrade: async (studentId, courseId) => {
    try {
      console.log('🎯 Fetching final grade for student:', studentId, 'course:', courseId);
      const response = await apiClient.get(`/students/${studentId}/final-grade/${courseId}`);
      console.log('✅ Final grade fetched:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching final grade:', err);
      return null;
    }
  },

  // Get all grades for current student (student-accessible endpoint)
  getMyGrades: async (courseId = null) => {
    try {
      const url = courseId ? `/grades/course/${courseId}` : '/grades';
      console.log('📊 Fetching my grades from:', url);
      const response = await apiClient.get(url);
      console.log('✅ My grades fetched:', response.data?.length || 0);
      return response.data || [];
    } catch (err) {
      console.error('❌ Error fetching my grades:', err);
      return [];
    }
  },

  // Get my grade columns for a course
  getMyGradeColumns: async (courseId) => {
    try {
      console.log('📋 Fetching my grade columns for:', courseId);
      const response = await apiClient.get(`/gradecolumns/course/${courseId}`);
      console.log('✅ My grade columns fetched:', response.data?.length || 0);
      return response.data || [];
    } catch (err) {
      console.error('❌ Error fetching my grade columns:', err);
      return [];
    }
  },

  // ====================================
  // STUDENT EXAM API - FIXED TO MATCH BACKEND
  // ====================================

  // Get available exams for student in a course
  getExamsByCourse: async (courseId) => {
    try {
      console.log('📚 Fetching exams for course:', courseId);
      const response = await apiClient.get(`/student/courses/${courseId}/exams`);
      console.log('✅ Exams fetched:', response.data?.length || 0);
      return response.data || [];
    } catch (err) {
      console.error('❌ Error fetching exams:', err);
      return [];
    }
  },

  // Get exam details for student (student-specific view)
  getExam: async (examId) => {
    try {
      console.log('📄 Fetching exam details:', examId);
      const response = await apiClient.get(`/student/exams/${examId}`);
      console.log('✅ Exam details fetched');
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching exam:', err);
      throw err;
    }
  },

  // Check exam eligibility for student
  checkExamEligibility: async (examId) => {
    try {
      console.log('🔍 Checking exam eligibility:', examId);
      const response = await apiClient.get(`/student/exams/${examId}/eligibility`);
      console.log('✅ Eligibility check completed:', response.data);
      return response.data;
    } catch (err) {
      console.error('❌ Error checking exam eligibility:', err);
      return { canTake: false, reason: 'Error checking eligibility' };
    }
  },

  // Start exam attempt
  startExam: async (examId) => {
    try {
      console.log('🎯 Starting exam attempt:', examId);
      const response = await apiClient.post(`/student/exams/${examId}/start`);
      console.log('✅ Exam attempt started:', response.data?.responseId);
      return response.data;
    } catch (err) {
      console.error('❌ Error starting exam:', err);
      throw err;
    }
  },

  // Save exam progress (auto-save and manual save)
  saveExamProgress: async (progressData) => {
    try {
      console.log('💾 Saving exam progress for exam:', progressData.examId);
      const response = await apiClient.put(`/student/exams/${progressData.examId}/save-progress`, progressData);
      console.log('✅ Progress saved successfully');
      return response.data;
    } catch (err) {
      console.error('❌ Error saving progress:', err);
      throw err;
    }
  },

  // Submit exam (final submission)
  submitExam: async (submissionData) => {
    try {
      console.log('📤 Submitting exam:', submissionData.examId);
      const response = await apiClient.post(`/student/exams/${submissionData.examId}/submit`, submissionData);
      console.log('✅ Exam submitted successfully');
      return response.data;
    } catch (err) {
      console.error('❌ Error submitting exam:', err);
      throw err;
    }
  },

  // Resume exam attempt
  resumeExamAttempt: async (examId) => {
    try {
      console.log('🔄 Resuming exam attempt:', examId);
      const response = await apiClient.post(`/student/exams/${examId}/resume`);
      console.log('✅ Exam attempt resumed');
      return response.data;
    } catch (err) {
      console.error('❌ Error resuming exam:', err);
      throw err;
    }
  },

  // Get exam attempt history for student
  getExamAttemptHistory: async (examId) => {
    try {
      console.log('📚 Fetching exam attempt history:', examId);
      const response = await apiClient.get(`/student/exams/${examId}/attempts`);
      console.log('✅ Attempt history fetched:', response.data?.length || 0);
      return response.data || [];
    } catch (err) {
      console.error('❌ Error fetching attempt history:', err);
      return [];
    }
  },

  // Check for active exam attempt
  checkActiveAttempt: async (examId) => {
    try {
      console.log('🔍 Checking active attempt for exam:', examId);
      const response = await apiClient.get(`/student/exams/${examId}/active-attempt`);
      console.log('✅ Active attempt check completed');
      return response.data;
    } catch (err) {
      console.error('❌ Error checking active attempt:', err);
      return { hasActiveAttempt: false };
    }
  },

  // Get exam results for student
  getStudentExamResults: async (responseId) => {
    try {
      console.log('📊 Fetching exam results:', responseId);
      const response = await apiClient.get(`/student/exam-responses/${responseId}/results`);
      console.log('✅ Exam results fetched');
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching exam results:', err);
      throw err;
    }
  },

  // Get detailed exam results for student
  getDetailedExamResults: async (responseId) => {
    try {
      console.log('📊 Fetching detailed exam results:', responseId);
      const response = await apiClient.get(`/student/exam-responses/${responseId}/detailed`);
      console.log('✅ Detailed exam results fetched');
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching detailed exam results:', err);
      throw err;
    }
  },

  // Get student exam statistics for course
  getStudentExamStats: async (courseId) => {
    try {
      console.log('📈 Fetching student exam stats for course:', courseId);
      const response = await apiClient.get(`/student/courses/${courseId}/exam-stats`);
      console.log('✅ Exam stats fetched');
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching exam stats:', err);
      return null;
    }
  },

  // Get exam dashboard summary for student
  getExamDashboardSummary: async () => {
    try {
      console.log('📊 Fetching exam dashboard summary');
      const response = await apiClient.get('/student/dashboard/exam-summary');
      console.log('✅ Dashboard summary fetched');
      return response.data;
    } catch (err) {
      console.error('❌ Error fetching dashboard summary:', err);
      return {
        inProgressExams: 0,
        completedExams: 0,
        gradedExams: 0,
        passedExams: 0,
        overallAverage: 0,
        overallPassRate: 0,
        hasActiveAttempts: false
      };
    }
  },

  // Legacy method aliases for backward compatibility
  getExamResponse: async (responseId) => {
    return studentApi.getStudentExamResults(responseId);
  },

  getDetailedExamResponse: async (responseId) => {
    return studentApi.getDetailedExamResults(responseId);
  },

  canTakeExam: async (examId) => {
    return studentApi.checkExamEligibility(examId);
  },

  getExamResponseHistory: async (examId, studentId) => {
    return studentApi.getExamAttemptHistory(examId);
  },

  hasActiveExamAttempt: async (examId, studentId) => {
    return studentApi.checkActiveAttempt(examId);
  },

  getExamAttemptCount: async (examId, studentId) => {
    const history = await studentApi.getExamAttemptHistory(examId);
    return { attemptCount: history.length };
  },

  // ====================================
  // DASHBOARD ANALYTICS (Enhanced implementations)
  // ====================================

  // Get dashboard analytics for student
  getDashboardAnalytics: async (studentId, courseId) => {
    try {
      const [submissions, upcomingTasks, overdueTasks] = await Promise.all([
        studentApi.getStudentSubmissions(studentId, courseId).catch(() => []),
        studentApi.getUpcomingAssignments(studentId, courseId, 7).catch(() => []),
        studentApi.getOverdueAssignments(studentId, courseId).catch(() => [])
      ]);

      const totalAssignments = submissions.length + upcomingTasks.length + overdueTasks.length;
      const completedAssignments = submissions.filter(sub => sub.grade !== null).length;
      const averageGrade = submissions.length > 0 
        ? submissions.reduce((sum, sub) => sum + (sub.grade || 0), 0) / submissions.length 
        : 0;

      return {
        totalAssignments,
        completedAssignments,
        pendingAssignments: totalAssignments - completedAssignments,
        averageGrade: Math.round(averageGrade * 100) / 100,
        upcomingDeadlines: upcomingTasks.length,
        overdueAssignments: overdueTasks.length
      };
    } catch (err) {
      console.error('Error fetching dashboard analytics:', err);
      return {
        totalAssignments: 0,
        completedAssignments: 0,
        pendingAssignments: 0,
        averageGrade: 0,
        upcomingDeadlines: 0,
        overdueAssignments: 0
      };
    }
  },

  // Get recent activity (enhanced)
  getRecentActivity: async (studentId, limit = 10) => {
    try {
      const submissions = await studentApi.getStudentSubmissions(studentId);
      
      // Sort by most recent and limit
      const recentSubmissions = submissions
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, limit);

      return recentSubmissions.map(submission => ({
        id: submission.id,
        type: 'submission',
        title: `Submitted assignment`,
        description: submission.notes || 'Assignment submitted',
        date: submission.submittedAt,
        status: submission.grade ? 'graded' : 'pending'
      }));
    } catch (err) {
      console.error('Error fetching recent activity:', err);
      return [];
    }
  },

  // Get upcoming deadlines (enhanced)
  getUpcomingDeadlines: async (studentId, days = 7) => {
    try {
      const upcomingTasks = await studentApi.getUpcomingAssignments(studentId, null, days);
      
      return upcomingTasks.map(task => ({
        id: task.id,
        title: task.title,
        dueDate: task.dueDateTime || task.dueDate,
        course: task.courseName,
        priority: task.priority,
        hasSubmission: task.hasSubmission || false
      }));
    } catch (err) {
      console.error('Error fetching upcoming deadlines:', err);
      return [];
    }
  },

  // ====================================
  // FILE MANAGEMENT
  // ====================================

  // Upload file with proper FormData handling
  uploadFile: async (file, context = 'submission') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('context', context);

    try {
      const response = await apiClient.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      console.error('File upload failed:', err);
      throw new Error('File upload failed: ' + err.message);
    }
  },

  // Download file
  downloadFile: async (fileId) => {
    try {
      const response = await apiClient.get(`/files/${fileId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (err) {
      console.error('File download failed:', err);
      throw new Error('File download failed: ' + err.message);
    }
  },

  // Add file to submission
  addFileToSubmission: async (submissionId, fileData) => {
    const response = await apiClient.post(`/tasksubmissions/${submissionId}/add-file`, fileData);
    return response.data;
  },

  // Remove file from submission
  removeFileFromSubmission: async (submissionId, fileIndex) => {
    const response = await apiClient.delete(`/tasksubmissions/${submissionId}/file/${fileIndex}`);
    return response.data;
  },

  // ====================================
  // NOTIFICATIONS
  // ====================================

  // Get student notifications
  getNotifications: async (studentId, unreadOnly = false) => {
    try {
      const params = unreadOnly ? '?unread=true' : '';
      const response = await apiClient.get(`/notifications/user/${studentId}${params}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching notifications:', err);
      return [];
    }
  },

  // Mark notification as read
  markNotificationRead: async (notificationId) => {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return { success: false };
    }
  },

  // Mark all notifications as read
  markAllNotificationsRead: async (studentId) => {
    try {
      const response = await apiClient.put(`/notifications/user/${studentId}/read-all`);
      return response.data;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return { success: false };
    }
  },

  // ====================================
  // ADDITIONAL UTILITY METHODS
  // ====================================

  // Get submission statistics for course
  getSubmissionStats: async (courseId) => {
    try {
      const response = await apiClient.get(`/tasksubmissions/course/${courseId}/stats`);
      return response.data;
    } catch (err) {
      console.error('Error fetching submission stats:', err);
      return null;
    }
  },

  // Get all assignments needing grading (for instructors)
  getAssignmentsNeedingGrading: async (courseId) => {
    try {
      const response = await apiClient.get(`/tasksubmissions/course/${courseId}/needing-grading`);
      return response.data;
    } catch (err) {
      console.error('Error fetching assignments needing grading:', err);
      return [];
    }
  }
};

export default studentApi;