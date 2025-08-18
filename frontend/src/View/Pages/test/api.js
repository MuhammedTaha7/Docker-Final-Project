/**
 * Complete API Client for Lecturer Dashboard - Enhanced with Full Exam Support
 * File: src/Api/AssignmentsDashboardAPI.js
 */

// Configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000
};

/**
 * Cookie utility functions
 */
const cookieUtils = {
  getCookie: (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
};

/**
 * Enhanced HTTP Client
 */
class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  getToken() {
    return cookieUtils.getCookie('jwtToken');
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Accept': 'application/json',
      ...customHeaders
    };

    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (!customHeaders.isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    const requestOptions = {
      method: 'GET',
      headers: this.getHeaders(options.headers),
      credentials: 'include',
      signal: controller.signal,
      ...options
    };

    // Handle FormData
    if (options.body instanceof FormData) {
      delete requestOptions.headers['Content-Type']; // Let browser set it
    } else if (requestOptions.body && typeof requestOptions.body === 'object') {
      requestOptions.body = JSON.stringify(requestOptions.body);
    }

    try {
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.details = errorData;
        throw error;
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.formatError(error);
    }
  }

  formatError(error) {
    return {
      error: true,
      status: error.status || 0,
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    };
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, { method: 'POST', body: data });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, { method: 'PUT', body: data });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  async postFormData(endpoint, formData) {
    return this.request(endpoint, { 
      method: 'POST', 
      body: formData,
      headers: { isFormData: true }
    });
  }
}

const apiClient = new ApiClient();

/**
 * Enhanced File Operations - Now using backend endpoints
 */
export const uploadFile = async (file, context = 'assignment', additionalData = {}) => {
  try {
    console.log('📁 Starting backend file upload:', file.name);
    
    // Validate file
    validateFileForUpload(file);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', additionalData.assignmentId || '');
    formData.append('courseId', additionalData.courseId || '');
    if (additionalData.description) {
      formData.append('description', additionalData.description);
    }

    const response = await apiClient.postFormData('/assignment-files/upload', formData);
    
    console.log('✅ File uploaded to backend successfully:', response);
    return {
      id: response.id,
      url: response.fileUrl,
      name: response.originalFilename,
      size: response.fileSize,
      type: response.contentType,
      formattedSize: response.formattedSize,
      fileIcon: response.fileIcon
    };
  } catch (error) {
    console.error('❌ Backend file upload failed:', error);
    throw new Error(error.message || 'Failed to upload file to server');
  }
};

export const viewFile = async (fileUrl, fileName = null) => {
  try {
    console.log('👁️ Viewing file:', fileName, 'URL:', fileUrl);
    
    if (!fileUrl) {
      throw new Error('No file URL provided');
    }
    
    // Extract file ID from URL
    const fileId = extractFileIdFromUrl(fileUrl);
    if (fileId) {
      // Use backend view endpoint
      const viewUrl = `${API_CONFIG.baseURL}/assignment-files/${fileId}/view`;
      window.open(viewUrl, '_blank', 'noopener,noreferrer');
      return { success: true, method: 'backend_view' };
    }
    
    // Fallback to direct URL
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
    return { success: true, method: 'direct_url' };
  } catch (error) {
    console.error('❌ File view failed:', error);
    throw new Error(`Failed to view file: ${error.message}`);
  }
};

export const downloadFile = async (fileUrl, fileName = null) => {
  try {
    console.log('📥 Downloading file:', fileName);
    
    if (!fileUrl) {
      throw new Error('No file URL provided');
    }
    
    // Extract file ID from URL
    const fileId = extractFileIdFromUrl(fileUrl);
    if (fileId) {
      // Use backend download endpoint
      const downloadUrl = `${API_CONFIG.baseURL}/assignment-files/${fileId}/download`;
      
      // Create temporary link for download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName || 'download';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true, method: 'backend_download' };
    }
    
    // Fallback for external URLs
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return { success: true, method: 'direct_download' };
  } catch (error) {
    console.error('❌ Download failed:', error);
    throw new Error(`Failed to download file: ${error.message}`);
  }
};

export const deleteFile = async (fileUrl) => {
  try {
    console.log('🗑️ Deleting file:', fileUrl);
    
    const fileId = extractFileIdFromUrl(fileUrl);
    if (fileId) {
      await apiClient.delete(`/assignment-files/${fileId}`);
      console.log('✅ File deleted from backend successfully');
      return { success: true };
    }
    
    throw new Error('Cannot delete file: Invalid file URL');
  } catch (error) {
    console.error('❌ File deletion failed:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

export const getFileInfo = async (fileId) => {
  try {
    const response = await apiClient.get(`/assignment-files/${fileId}/info`);
    return response;
  } catch (error) {
    console.error('❌ Failed to get file info:', error);
    throw error;
  }
};

export const getFilesByAssignment = async (assignmentId) => {
  try {
    const response = await apiClient.get(`/assignment-files/assignment/${assignmentId}`);
    return response;
  } catch (error) {
    console.error('❌ Failed to get assignment files:', error);
    return [];
  }
};

const validateFileForUpload = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.zip', '.jpg', '.jpeg', '.png', '.gif', '.ppt', '.pptx', '.xls', '.xlsx'];
  
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (file.size > maxSize) {
    const fileSizeMB = Math.round(file.size / 1024 / 1024 * 100) / 100;
    throw new Error(`File size exceeds 10MB limit (${fileSizeMB}MB)`);
  }
  
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error(`File type ${fileExtension} not allowed. Allowed: ${allowedExtensions.join(', ')}`);
  }
  
  return true;
};

const extractFileIdFromUrl = (url) => {
  if (!url) return null;
  
  // Pattern: /api/assignment-files/{fileId}/download or /api/assignment-files/{fileId}/view
  const match = url.match(/\/assignment-files\/([^\/]+)\/(?:download|view)$/);
  if (match) {
    return match[1];
  }
  
  // Pattern: file://{fileId} (legacy format)
  if (url.startsWith('file://')) {
    return url.replace('file://', '');
  }
  
  return null;
};

// File utilities
export const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes) || bytes === 0) return '0 Bytes';
  if (bytes < 0) return 'Invalid size';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  if (i >= sizes.length) return 'File too large';
  if (i < 0) return '0 Bytes';
  
  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${sizes[i]}`;
};

export const getFileTypeIcon = (fileName) => {
  if (!fileName) return '📄';
  
  const extension = fileName.split('.').pop().toLowerCase();
  const iconMap = {
    'pdf': '📕',
    'doc': '📘',
    'docx': '📘',
    'txt': '📄',
    'zip': '📦',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'ppt': '📽️',
    'pptx': '📽️',
    'xls': '📊',
    'xlsx': '📊'
  };
  
  return iconMap[extension] || '📄';
};

/**
 * API Endpoints
 */

// Courses
export const fetchCourses = async (params = {}) => {
  try {
    console.log('🔍 Fetching courses...');
    const courses = await apiClient.get('/courses', params);
    
    const transformedCourses = Array.isArray(courses) ? courses.map(course => ({
      id: course.id,
      name: course.name,
      code: course.code,
      description: course.description,
      lecturerId: course.lecturerId,
      department: course.department,
      credits: course.credits,
      enrollments: course.enrollments || [],
      imageUrl: course.imageUrl,
      academicYear: course.academicYear,
      semester: course.semester,
      year: course.year,
      language: course.language,
      progress: course.progress,
      prerequisites: course.prerequisites,
      finalExam: course.finalExam
    })) : [];
    
    console.log(`✅ Transformed ${transformedCourses.length} courses`);
    return transformedCourses;
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    throw error;
  }
};

// Students
export const fetchStudents = async (courseId, params = {}) => {
  try {
    console.log(`🔍 Fetching students for course: ${courseId}`);
    
    const course = await apiClient.get(`/courses/${courseId}`);
    
    if (!course.enrollments || course.enrollments.length === 0) {
      console.log('📭 No enrollments found for this course');
      return [];
    }
    
    const currentYear = 2024;
    const currentEnrollment = course.enrollments.find(e => e.academicYear === currentYear);
    
    if (!currentEnrollment || !currentEnrollment.studentIds || currentEnrollment.studentIds.length === 0) {
      console.log(`📭 No student enrollments found for year ${currentYear}`);
      return [];
    }
    
    const studentDetails = await apiClient.post('/users/by-ids', currentEnrollment.studentIds);
    
    let existingGrades = [];
    try {
      existingGrades = await apiClient.get(`/courses/${courseId}/grades`);
    } catch (error) {
      console.warn('⚠️ No existing grades found:', error.message);
      existingGrades = [];
    }
    
    const studentsWithGrades = studentDetails.map(student => {
      const studentGrade = existingGrades.find(g => g.studentId === student.id);
      
      return {
        id: student.id,
        name: student.name,
        email: student.email,
        username: student.username,
        courseId: courseId,
        grades: studentGrade?.grades || {},
        finalGrade: studentGrade?.finalGrade || 0,
        finalLetterGrade: studentGrade?.finalLetterGrade || 'N/A'
      };
    });
    
    console.log(`✅ Successfully processed ${studentsWithGrades.length} students`);
    return studentsWithGrades;
    
  } catch (error) {
    console.error('❌ Error fetching students:', error);
    if (error.status === 404) {
      throw new Error(`Course with ID ${courseId} not found`);
    }
    if (error.status === 403) {
      throw new Error('You do not have permission to view students for this course');
    }
    return [];
  }
};

// Assignments with Enhanced File Handling
export const fetchAssignments = async (courseId, params = {}) => {
  try {
    console.log(`🔍 Fetching assignments for course: ${courseId}`);
    const assignments = await apiClient.get(`/tasks/course/${courseId}`, params);
    
    const transformedAssignments = Array.isArray(assignments) ? await Promise.all(
      assignments.map(async (task) => {
        const transformed = {
          id: task.id,
          title: task.title,
          description: task.description,
          courseId: task.courseId,
          courseName: task.courseName,
          type: task.type,
          dueDate: task.dueDate,
          dueTime: task.dueTime,
          dueDateTime: task.dueDateTime,
          maxPoints: task.maxPoints,
          status: task.status,
          priority: task.priority,
          difficulty: task.difficulty,
          category: task.category,
          instructions: task.instructions,
          estimatedDuration: task.estimatedDuration,
          allowSubmissions: task.allowSubmissions,
          allowLateSubmissions: task.allowLateSubmissions,
          latePenaltyPerDay: task.latePenaltyPerDay,
          visibleToStudents: task.visibleToStudents,
          requiresSubmission: task.requiresSubmission,
          maxAttempts: task.maxAttempts,
          publishDate: task.publishDate,
          submissionCount: task.submissionCount,
          gradedCount: task.gradedCount,
          averageGrade: task.averageGrade,
          enrolledStudents: task.enrolledStudents,
          completionRate: task.completionRate,
          isOverdue: task.isOverdue,
          isPublished: task.isPublished,
          acceptsSubmissions: task.acceptsSubmissions,
          instructorId: task.instructorId,
          instructorName: task.instructorName,
          tags: task.tags,
          prerequisiteTasks: task.prerequisiteTasks,
          progress: task.progress,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          hasAttachment: false,
          fileUrl: null,
          fileName: null,
          fileSize: null
        };

        // Fetch assignment files from backend
        try {
          const assignmentFiles = await getFilesByAssignment(task.id);
          if (assignmentFiles && assignmentFiles.length > 0) {
            const primaryFile = assignmentFiles[0]; // Use first file as primary
            transformed.hasAttachment = true;
            transformed.fileUrl = primaryFile.fileUrl;
            transformed.fileName = primaryFile.originalFilename;
            transformed.fileSize = primaryFile.fileSize;
          }
        } catch (error) {
          console.warn(`⚠️ Could not fetch files for assignment ${task.id}:`, error.message);
        }

        return transformed;
      })
    ) : [];
    
    console.log(`✅ Transformed ${transformedAssignments.length} assignments`);
    return transformedAssignments;
  } catch (error) {
    console.error('❌ Error fetching assignments:', error);
    return [];
  }
};

export const createAssignment = async (assignmentData) => {
  try {
    console.log('➕ Creating assignment with data:', assignmentData);
    
    const taskCreateRequest = {
      title: assignmentData.title,
      description: assignmentData.description,
      courseId: assignmentData.courseId,
      type: assignmentData.type,
      dueDate: assignmentData.dueDate,
      dueTime: assignmentData.dueTime,
      maxPoints: assignmentData.maxPoints,
      instructions: assignmentData.instructions,
      priority: assignmentData.priority,
      difficulty: assignmentData.difficulty,
      category: assignmentData.category,
      allowSubmissions: assignmentData.allowSubmissions,
      allowLateSubmissions: assignmentData.allowLateSubmissions,
      latePenaltyPerDay: assignmentData.latePenaltyPerDay,
      visibleToStudents: assignmentData.visibleToStudents,
      requiresSubmission: assignmentData.requiresSubmission,
      maxAttempts: assignmentData.maxAttempts,
      estimatedDuration: assignmentData.estimatedDuration,
      tags: assignmentData.tags,
      prerequisiteTasks: assignmentData.prerequisiteTasks
    };
    
    const createdTask = await apiClient.post('/tasks', taskCreateRequest);
    console.log('✅ Assignment created successfully:', createdTask);
    
    // Upload file if provided
    if (assignmentData.file) {
      try {
        console.log('📁 Uploading file for assignment:', createdTask.id);
        const fileResponse = await uploadFile(assignmentData.file, 'assignment', {
          assignmentId: createdTask.id,
          courseId: assignmentData.courseId,
          description: `Attachment for ${createdTask.title}`
        });
        
        console.log('✅ File uploaded for assignment:', fileResponse);
        
        // Return assignment with file info
        return {
          ...convertTaskToAssignment(createdTask),
          hasAttachment: true,
          fileUrl: fileResponse.url,
          fileName: fileResponse.name,
          fileSize: fileResponse.size
        };
      } catch (fileError) {
        console.warn('⚠️ Assignment created but file upload failed:', fileError.message);
        // Return assignment without file attachment
        return convertTaskToAssignment(createdTask);
      }
    }
    
    return convertTaskToAssignment(createdTask);
  } catch (error) {
    console.error('❌ Error creating assignment:', error);
    throw error;
  }
};

export const updateAssignment = async (assignmentId, updates) => {
  try {
    console.log('🔄 Updating assignment:', assignmentId, updates);
    
    const taskUpdateRequest = {
      title: updates.title,
      description: updates.description,
      type: updates.type,
      dueDate: updates.dueDate,
      dueTime: updates.dueTime,
      maxPoints: updates.maxPoints,
      instructions: updates.instructions,
      status: updates.status,
      priority: updates.priority,
      difficulty: updates.difficulty,
      category: updates.category,
      allowSubmissions: updates.allowSubmissions,
      allowLateSubmissions: updates.allowLateSubmissions,
      latePenaltyPerDay: updates.latePenaltyPerDay,
      visibleToStudents: updates.visibleToStudents,
      requiresSubmission: updates.requiresSubmission,
      maxAttempts: updates.maxAttempts,
      estimatedDuration: updates.estimatedDuration,
      tags: updates.tags,
      prerequisiteTasks: updates.prerequisiteTasks
    };
    
    const updatedTask = await apiClient.put(`/tasks/${assignmentId}`, taskUpdateRequest);
    console.log('✅ Assignment updated successfully:', updatedTask);
    
    return convertTaskToAssignment(updatedTask);
  } catch (error) {
    console.error('❌ Error updating assignment:', error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId) => {
  try {
    console.log('🗑️ Deleting assignment:', assignmentId);
    
    // Delete assignment files first
    try {
      const assignmentFiles = await getFilesByAssignment(assignmentId);
      for (const file of assignmentFiles) {
        await deleteFile(file.fileUrl);
      }
      console.log('✅ Assignment files deleted');
    } catch (error) {
      console.warn('⚠️ Could not delete assignment files:', error.message);
    }
    
    await apiClient.delete(`/tasks/${assignmentId}`);
    console.log('✅ Assignment deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting assignment:', error);
    throw error;
  }
};

// Helper function to convert Task to Assignment format
const convertTaskToAssignment = (task) => {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    courseId: task.courseId,
    type: task.type,
    dueDate: task.dueDate,
    dueTime: task.dueTime,
    maxPoints: task.maxPoints,
    status: task.status,
    priority: task.priority,
    difficulty: task.difficulty,
    category: task.category,
    instructions: task.instructions,
    hasAttachment: false,
    submissionCount: task.submissionCount || 0,
    gradedCount: task.gradedCount || 0,
    averageGrade: task.averageGrade || 0,
    isOverdue: task.isOverdue,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
};

// FULL EXAM API IMPLEMENTATION
export const fetchExams = async (courseId, params = {}) => {
  try {
    console.log(`🔍 Fetching exams for course: ${courseId}`);
    const exams = await apiClient.get(`/courses/${courseId}/exams`, params);
    
    const transformedExams = Array.isArray(exams) ? exams.map(exam => ({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      instructions: exam.instructions,
      courseId: exam.courseId,
      instructorId: exam.instructorId,
      duration: exam.duration,
      startTime: exam.startTime,
      endTime: exam.endTime,
      publishTime: exam.publishTime,
      maxAttempts: exam.maxAttempts,
      showResults: exam.showResults,
      shuffleQuestions: exam.shuffleQuestions,
      shuffleOptions: exam.shuffleOptions,
      allowNavigation: exam.allowNavigation,
      showTimer: exam.showTimer,
      autoSubmit: exam.autoSubmit,
      requireSafeBrowser: exam.requireSafeBrowser,
      visibleToStudents: exam.visibleToStudents,
      totalPoints: exam.totalPoints,
      passPercentage: exam.passPercentage,
      status: exam.status,
      questions: exam.questions || [],
      isActive: exam.isActive,
      isUpcoming: exam.isUpcoming,
      isCompleted: exam.isCompleted,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt
    })) : [];
    
    console.log(`✅ Transformed ${transformedExams.length} exams`);
    return transformedExams;
  } catch (error) {
    console.error('❌ Error fetching exams:', error);
    return [];
  }
};

export const createExam = async (examData) => {
  try {
    console.log('➕ Creating exam with data:', examData);
    
    const examCreateRequest = {
      title: examData.title,
      description: examData.description,
      instructions: examData.instructions,
      courseId: examData.courseId,
      duration: examData.duration,
      startTime: examData.startTime,
      endTime: examData.endTime,
      publishTime: examData.publishTime,
      maxAttempts: examData.maxAttempts,
      showResults: examData.showResults,
      shuffleQuestions: examData.shuffleQuestions,
      shuffleOptions: examData.shuffleOptions,
      allowNavigation: examData.allowNavigation,
      showTimer: examData.showTimer,
      autoSubmit: examData.autoSubmit,
      requireSafeBrowser: examData.requireSafeBrowser,
      visibleToStudents: examData.visibleToStudents,
      passPercentage: examData.passPercentage
    };
    
    const createdExam = await apiClient.post('/exams', examCreateRequest);
    console.log('✅ Exam created successfully:', createdExam);
    return createdExam;
  } catch (error) {
    console.error('❌ Error creating exam:', error);
    throw error;
  }
};

export const updateExam = async (examId, updates) => {
  try {
    console.log('🔄 Updating exam:', examId, updates);
    
    const examUpdateRequest = {
      title: updates.title,
      description: updates.description,
      instructions: updates.instructions,
      duration: updates.duration,
      startTime: updates.startTime,
      endTime: updates.endTime,
      publishTime: updates.publishTime,
      maxAttempts: updates.maxAttempts,
      showResults: updates.showResults,
      shuffleQuestions: updates.shuffleQuestions,
      shuffleOptions: updates.shuffleOptions,
      allowNavigation: updates.allowNavigation,
      showTimer: updates.showTimer,
      autoSubmit: updates.autoSubmit,
      requireSafeBrowser: updates.requireSafeBrowser,
      visibleToStudents: updates.visibleToStudents,
      passPercentage: updates.passPercentage,
      status: updates.status
    };
    
    const updatedExam = await apiClient.put(`/exams/${examId}`, examUpdateRequest);
    console.log('✅ Exam updated successfully:', updatedExam);
    return updatedExam;
  } catch (error) {
    console.error('❌ Error updating exam:', error);
    throw error;
  }
};

export const deleteExam = async (examId) => {
  try {
    console.log('🗑️ Deleting exam:', examId);
    await apiClient.delete(`/exams/${examId}`);
    console.log('✅ Exam deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting exam:', error);
    throw error;
  }
};

export const publishExam = async (examId) => {
  try {
    console.log('📢 Publishing exam:', examId);
    const publishedExam = await apiClient.post(`/exams/${examId}/publish`);
    console.log('✅ Exam published successfully:', publishedExam);
    return publishedExam;
  } catch (error) {
    console.error('❌ Error publishing exam:', error);
    throw error;
  }
};

export const unpublishExam = async (examId) => {
  try {
    console.log('📝 Unpublishing exam:', examId);
    const unpublishedExam = await apiClient.post(`/exams/${examId}/unpublish`);
    console.log('✅ Exam unpublished successfully:', unpublishedExam);
    return unpublishedExam;
  } catch (error) {
    console.error('❌ Error unpublishing exam:', error);
    throw error;
  }
};

export const updateExamStatus = async (examId, status) => {
  try {
    console.log('🔄 Updating exam status:', examId, status);
    const updatedExam = await apiClient.put(`/exams/${examId}/status`, { status });
    console.log('✅ Exam status updated successfully:', updatedExam);
    return updatedExam;
  } catch (error) {
    console.error('❌ Error updating exam status:', error);
    throw error;
  }
};

export const addQuestionToExam = async (examId, questionData) => {
  try {
    console.log('➕ Adding question to exam:', examId, questionData);
    
    const questionRequest = {
      type: questionData.type,
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      correctAnswerIndex: questionData.correctAnswerIndex,
      points: questionData.points,
      explanation: questionData.explanation,
      required: questionData.required,
      timeLimit: questionData.timeLimit,
      caseSensitive: questionData.caseSensitive,
      maxLength: questionData.maxLength,
      acceptableAnswers: questionData.acceptableAnswers
    };
    
    const result = await apiClient.post(`/exams/${examId}/questions`, questionRequest);
    console.log('✅ Question added successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Error adding question:', error);
    throw error;
  }
};

export const updateQuestion = async (examId, questionId, updates) => {
  try {
    console.log('🔄 Updating question:', examId, questionId, updates);
    
    const questionRequest = {
      type: updates.type,
      question: updates.question,
      options: updates.options,
      correctAnswer: updates.correctAnswer,
      correctAnswerIndex: updates.correctAnswerIndex,
      points: updates.points,
      explanation: updates.explanation,
      required: updates.required,
      timeLimit: updates.timeLimit,
      caseSensitive: updates.caseSensitive,
      maxLength: updates.maxLength,
      acceptableAnswers: updates.acceptableAnswers
    };
    
    const updatedQuestion = await apiClient.put(`/exams/${examId}/questions/${questionId}`, questionRequest);
    console.log('✅ Question updated successfully:', updatedQuestion);
    return updatedQuestion;
  } catch (error) {
    console.error('❌ Error updating question:', error);
    throw error;
  }
};

export const deleteQuestionFromExam = async (examId, questionId) => {
  try {
    console.log('🗑️ Deleting question:', examId, questionId);
    await apiClient.delete(`/exams/${examId}/questions/${questionId}`);
    console.log('✅ Question deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting question:', error);
    throw error;
  }
};

export const reorderQuestions = async (examId, questionIds) => {
  try {
    console.log('🔄 Reordering questions:', examId, questionIds);
    await apiClient.put(`/exams/${examId}/questions/reorder`, { questionIds });
    console.log('✅ Questions reordered successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error reordering questions:', error);
    throw error;
  }
};

export const fetchExamResponses = async (courseId, params = {}) => {
  try {
    console.log(`🔍 Fetching exam responses for course: ${courseId}`);
    
    // First get all exams for the course
    const exams = await fetchExams(courseId);
    
    // Then get responses for each exam
    const allResponses = [];
    for (const exam of exams) {
      try {
        const examResponses = await apiClient.get(`/exams/${exam.id}/responses`);
        
        // Transform responses to include exam info
        const transformedResponses = examResponses.map(response => ({
          id: response.id,
          examId: response.examId,
          examTitle: exam.title,
          studentId: response.studentId,
          courseId: response.courseId,
          answers: response.answers,
          questionScores: response.questionScores,
          startedAt: response.startedAt,
          submittedAt: response.submittedAt,
          timeSpent: response.timeSpent,
          status: response.status,
          totalScore: response.totalScore,
          maxScore: response.maxScore,
          percentage: response.percentage,
          passed: response.passed,
          graded: response.graded,
          autoGraded: response.autoGraded,
          attemptNumber: response.attemptNumber,
          instructorFeedback: response.instructorFeedback,
          gradedBy: response.gradedBy,
          gradedAt: response.gradedAt,
          flaggedForReview: response.flaggedForReview,
          lateSubmission: response.lateSubmission,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt
        }));
        
        allResponses.push(...transformedResponses);
      } catch (error) {
        console.warn(`⚠️ Could not fetch responses for exam ${exam.id}:`, error.message);
      }
    }
    
    console.log(`✅ Fetched ${allResponses.length} exam responses`);
    return allResponses;
  } catch (error) {
    console.error('❌ Error fetching exam responses:', error);
    return [];
  }
};

export const getExamResponse = async (responseId) => {
  try {
    console.log('🔍 Fetching exam response:', responseId);
    const response = await apiClient.get(`/exam-responses/${responseId}`);
    console.log('✅ Exam response fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error fetching exam response:', error);
    throw error;
  }
};

export const updateExamResponseScore = async (responseId, questionId, points) => {
  try {
    console.log('🔄 Updating exam response score:', responseId, questionId, points);
    
    // Get current response to build complete grade request
    const currentResponse = await getExamResponse(responseId);
    
    const gradeRequest = {
      responseId: responseId,
      questionScores: {
        ...currentResponse.questionScores,
        [questionId]: parseInt(points) || 0
      },
      instructorFeedback: currentResponse.instructorFeedback || '',
      flaggedForReview: currentResponse.flaggedForReview || false
    };
    
    const gradedResponse = await apiClient.put('/exam-responses/grade', gradeRequest);
    console.log('✅ Exam response score updated successfully:', gradedResponse);
    return gradedResponse;
  } catch (error) {
    console.error('❌ Error updating exam response score:', error);
    throw error;
  }
};

export const autoGradeExamResponse = async (responseId) => {
  try {
    console.log('🤖 Auto-grading exam response:', responseId);
    const gradedResponse = await apiClient.post(`/exam-responses/${responseId}/auto-grade`);
    console.log('✅ Exam response auto-graded successfully:', gradedResponse);
    return gradedResponse;
  } catch (error) {
    console.error('❌ Error auto-grading exam response:', error);
    throw error;
  }
};

export const autoGradeAllExamResponses = async (examId) => {
  try {
    console.log('🤖 Auto-grading all responses for exam:', examId);
    const result = await apiClient.post(`/exams/${examId}/auto-grade-all`);
    console.log('✅ All exam responses auto-graded successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Error auto-grading all exam responses:', error);
    throw error;
  }
};

export const getExamStats = async (examId) => {
  try {
    console.log('📊 Fetching exam statistics:', examId);
    const stats = await apiClient.get(`/exams/${examId}/stats`);
    console.log('✅ Exam statistics fetched successfully:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error fetching exam statistics:', error);
    throw error;
  }
};

export const getCourseExamStats = async (courseId) => {
  try {
    console.log('📊 Fetching course exam statistics:', courseId);
    const stats = await apiClient.get(`/courses/${courseId}/exam-stats`);
    console.log('✅ Course exam statistics fetched successfully:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error fetching course exam statistics:', error);
    throw error;
  }
};

export const canStudentTakeExam = async (examId) => {
  try {
    console.log('🔍 Checking if student can take exam:', examId);
    const result = await apiClient.get(`/exams/${examId}/can-take`);
    console.log('✅ Exam eligibility checked:', result);
    return result;
  } catch (error) {
    console.error('❌ Error checking exam eligibility:', error);
    throw error;
  }
};

export const getStudentAttemptCount = async (examId, studentId) => {
  try {
    console.log('🔍 Getting student attempt count:', examId, studentId);
    const result = await apiClient.get(`/exams/${examId}/attempt-count/${studentId}`);
    console.log('✅ Student attempt count fetched:', result);
    return result;
  } catch (error) {
    console.error('❌ Error getting student attempt count:', error);
    throw error;
  }
};

// Grade Columns
export const fetchGradeColumns = async (courseId, params = {}) => {
  try {
    const columns = await apiClient.get(`/courses/${courseId}/grade-columns`, params);
    return Array.isArray(columns) ? columns : [];
  } catch (error) {
    console.error('Error fetching grade columns:', error);
    return [];
  }
};

export const createGradeColumn = async (columnData) => {
  try {
    return await apiClient.post('/grade-columns', columnData);
  } catch (error) {
    throw error;
  }
};

export const updateGradeColumn = async (columnId, updates) => {
  try {
    return await apiClient.put(`/grade-columns/${columnId}`, updates);
  } catch (error) {
    throw error;
  }
};

export const deleteGradeColumn = async (columnId) => {
  try {
    return await apiClient.delete(`/grade-columns/${columnId}`);
  } catch (error) {
    throw error;
  }
};

// Grades
export const updateGrade = async (studentId, columnId, grade) => {
  try {
    return await apiClient.put(`/students/${studentId}/grades/${columnId}`, { grade });
  } catch (error) {
    throw error;
  }
};

// Students management
export const addStudent = async (courseId, studentData) => {
  try {
    const enrollmentRequest = {
      studentId: studentData.id || studentData.studentId,
      academicYear: new Date().getFullYear()
    };
    return await apiClient.post(`/courses/${courseId}/enroll`, enrollmentRequest);
  } catch (error) {
    throw error;
  }
};

export const removeStudent = async (courseId, studentId) => {
  try {
    const unenrollmentRequest = {
      studentIds: [studentId]
    };
    return await apiClient.delete(`/courses/${courseId}/enrollments`, {
      body: unenrollmentRequest
    });
  } catch (error) {
    throw error;
  }
};

export const updateStudent = async (studentId, updates) => {
  try {
    return await apiClient.put(`/users/${studentId}`, updates);
  } catch (error) {
    throw error;
  }
};

// Submissions
export const fetchSubmissions = async (courseId, params = {}) => {
  try {
    const submissions = await apiClient.get(`/submissions/course/${courseId}`, params);
    return Array.isArray(submissions) ? submissions.map(submission => ({
      ...submission,
      submittedAt: submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'N/A',
      fileName: submission.fileUrl ? submission.fileUrl.split('/').pop() : 'No file'
    })) : [];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
};

export const updateSubmissionGrade = async (submissionId, grade, feedback = '') => {
  try {
    return await apiClient.put(`/submissions/${submissionId}`, {
      grade: grade,
      feedback: feedback
    });
  } catch (error) {
    throw error;
  }
};

export const downloadSubmission = async (submissionId) => {
  try {
    const submission = await apiClient.get(`/submissions/${submissionId}`);
    if (submission.fileUrl) {
      return await downloadFile(submission.fileUrl, submission.fileName);
    }
    throw new Error('No file available for download');
  } catch (error) {
    throw error;
  }
};

// Export functionality
export const exportGrades = async (courseId, format = 'csv', options = {}) => {
  try {
    console.warn('Export grades endpoint not implemented yet');
    
    const students = await fetchStudents(courseId);
    const columns = await fetchGradeColumns(courseId);
    
    let csvContent = 'Student Name,';
    csvContent += columns.map(col => `${col.name} (${col.percentage}%)`).join(',');
    csvContent += ',Final Grade\n';
    
    students.forEach(student => {
      csvContent += `${student.name},`;
      csvContent += columns.map(col => student.grades[col.id] || '').join(',');
      csvContent += `,${student.finalGrade}%\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const filename = `grades_course_${courseId}_${new Date().toISOString().split('T')[0]}.csv`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return { success: true, filename };
  } catch (error) {
    throw error;
  }
};

// Analytics
export const fetchDashboardAnalytics = async (courseId) => {
  try {
    console.warn('Analytics endpoint not implemented yet');
    return {
      totalStudents: 0,
      averageGrade: 0,
      assignmentsCompleted: 0,
      upcomingDeadlines: []
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};

// Batch operations
export const batchGradeSubmissions = async (submissionIds, grade, feedback = '') => {
  try {
    const promises = submissionIds.map(id => 
      updateSubmissionGrade(id, grade, feedback)
    );
    return await Promise.all(promises);
  } catch (error) {
    throw error;
  }
};

// Helper functions
export const checkUserEnrollment = async (courseId, userId) => {
  try {
    const course = await apiClient.get(`/courses/${courseId}`);
    
    if (!course.enrollments) return false;
    
    return course.enrollments.some(enrollment => 
      enrollment.studentIds && enrollment.studentIds.includes(userId)
    );
  } catch (error) {
    console.error('Error checking user enrollment:', error);
    return false;
  }
};

export const getCourseEnrollmentCount = async (courseId, academicYear = 2024) => {
  try {
    const course = await apiClient.get(`/courses/${courseId}`);
    
    if (!course.enrollments) return 0;
    
    const enrollment = course.enrollments.find(e => e.academicYear === academicYear);
    return enrollment ? enrollment.studentIds.length : 0;
  } catch (error) {
    console.error('Error getting enrollment count:', error);
    return 0;
  }
};

// Error handling utility
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.error && error.status !== undefined) {
    return error;
  }
  
  return {
    error: true,
    status: error.status || 0,
    message: error.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    details: error.details || null
  };
};

// Export the apiClient for direct use if needed
export { apiClient, validateFileForUpload };