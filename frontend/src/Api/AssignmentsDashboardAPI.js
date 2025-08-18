/**
 * Complete API Client for Lecturer Dashboard - FULLY FIXED WITH EXAM RESPONSES
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
      console.log(`🔗 Making request toooooooooooo: ${url}`, requestOptions);
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
 * Helper Functions for TaskSubmission Objects
 */
const TaskSubmissionHelpers = {
  hasFiles: (submission) => {
    return submission.fileUrls && Array.isArray(submission.fileUrls) && submission.fileUrls.length > 0;
  },
  
  getFileCount: (submission) => {
    return submission.fileUrls && Array.isArray(submission.fileUrls) ? submission.fileUrls.length : 0;
  },
  
  isGraded: (submission) => {
    return submission.grade !== null && submission.grade !== undefined;
  },
  
  needsGrading: (submission) => {
    return submission.status === 'submitted' && (submission.grade === null || submission.grade === undefined);
  },
  
  getFinalGrade: (submission) => {
    if (submission.grade === null || submission.grade === undefined) return 0.0;

    let finalGrade = parseFloat(submission.grade);

    // Apply late penalty if applicable
    if (submission.isLate && submission.latePenaltyApplied && submission.latePenaltyApplied > 0) {
      finalGrade = finalGrade * (1.0 - (submission.latePenaltyApplied / 100.0));
    }

    return Math.max(0.0, finalGrade); // Ensure grade doesn't go below 0
  }
};

/**
 * Helper Functions for ExamResponse Objects
 */
const ExamResponseHelpers = {
  isCompleted: (response) => {
    return response.status === 'SUBMITTED' || response.status === 'GRADED';
  },
  
  isGraded: (response) => {
    return response.graded === true || response.status === 'GRADED';
  },
  
  needsManualGrading: (response) => {
    return response.status === 'SUBMITTED' && !response.graded && !response.autoGraded;
  },
  
  canAutoGrade: (response) => {
    return response.status === 'SUBMITTED' && !response.graded;
  },
  
  getGradingStatus: (response) => {
    if (response.flaggedForReview) return 'flagged';
    if (response.status === 'IN_PROGRESS') return 'in-progress';
    if (response.graded && response.autoGraded) return 'auto-graded';
    if (response.graded && !response.autoGraded) return 'manually-graded';
    if (response.status === 'SUBMITTED' && !response.graded) return 'needs-grading';
    return 'unknown';
  },
  
  formatTimeSpent: (timeSpentSeconds) => {
    if (!timeSpentSeconds || timeSpentSeconds === 0) return 'N/A';
    const minutes = Math.floor(timeSpentSeconds / 60);
    const seconds = timeSpentSeconds % 60;
    return `${minutes}m ${seconds}s`;
  },
  
  calculatePercentage: (response) => {
    if (!response.maxScore || response.maxScore === 0) return 0;
    return Math.round((response.totalScore || 0) / response.maxScore * 100);
  }
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
 * ENHANCED FILE UPLOAD API - Using Task Controller
 */
export const uploadFile = async (file, context = 'assignment', additionalData = {}) => {
  try {
    console.log('📁 Starting file upload:', file.name, 'Size:', file.size);
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/zip',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported. Please use PDF, DOC, DOCX, TXT, ZIP, JPG, PNG, or GIF files.');
    }
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('context', context);
    
    // Add additional data
    if (additionalData.assignmentId) {
      formData.append('assignmentId', additionalData.assignmentId);
    }
    if (additionalData.courseId) {
      formData.append('courseId', additionalData.courseId);
    }
    if (additionalData.description) {
      formData.append('description', additionalData.description);
    }
    
    // Upload file using task controller endpoint
    const response = await apiClient.postFormData('/tasks/upload-file', formData);
    
    console.log('✅ File upload successful:', response);
    
    return {
      id: response.id || 'file_' + Date.now(),
      url: response.url || response.fileUrl || `/uploads/${file.name}`,
      name: response.fileName || file.name,
      size: response.fileSize || file.size,
      type: file.type,
      uploadedAt: response.uploadedAt || new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ File upload failed:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};

/**
 * ENHANCED FILE VIEWING - Properly handles URL construction and encoding
 */
export const viewFile = async (fileUrl, fileName = null) => {
  try {
    console.log('👁️ Viewing file:', fileName, 'URL:', fileUrl);
    
    if (!fileUrl) {
      throw new Error('No file URL provided');
    }

    // Proper URL construction with base URL and encoding
    let fullUrl;
    
    if (fileUrl.startsWith('http')) {
      // Already a full URL
      fullUrl = fileUrl;
    } else if (fileUrl.startsWith('/api/')) {
      // API endpoint URL - construct with base URL
      // FIXED: Remove /api prefix to avoid duplication
      const apiPath = fileUrl.substring(4); // Remove '/api' prefix
      fullUrl = `${API_CONFIG.baseURL}${apiPath}`;
    } else if (fileUrl.startsWith('/uploads/')) {
      // Direct upload path - needs to go through the API endpoint
      const filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
      // Properly encode the filename for Hebrew and special characters
      const encodedFilename = encodeURIComponent(filename);
      fullUrl = `${API_CONFIG.baseURL}/tasks/files/${encodedFilename}`;
    } else {
      // Assume it's just a filename
      const encodedFilename = encodeURIComponent(fileUrl);
      fullUrl = `${API_CONFIG.baseURL}/tasks/files/${encodedFilename}`;
    }

    console.log('🔗 Opening URL:', fullUrl);
    
    try {
      // FIXED: Use window.open with '_blank' and NO window features to open in new tab
      // Removing windowFeatures parameter makes it open as a new tab instead of popup
      const newTab = window.open(fullUrl, '_blank');
      
      if (newTab) {
        // Handle authentication if needed
        try {
          const token = apiClient.getToken();
          if (token) {
            // For authenticated requests, we can try to validate access
            const response = await fetch(fullUrl, {
              method: 'HEAD', // Just check if accessible
              headers: {
                'Authorization': `Bearer ${token}`
              },
              credentials: 'include'
            });
            
            if (!response.ok && response.status === 401) {
              // If unauthorized, try to redirect the new tab with token
              const tokenUrl = `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
              newTab.location.href = tokenUrl;
            }
          }
        } catch (fetchError) {
          console.warn('⚠️ Could not validate file access, proceeding with direct open');
        }
        
        // Focus the new tab (optional - browser may still block this)
        try {
          newTab.focus();
        } catch (e) {
          console.log('ℹ️ Could not focus new tab (browser security)');
        }
        
        console.log('✅ File opened in new tab');
        return { 
          success: true, 
          method: 'new_tab',
          url: fullUrl,
          fileName: fileName
        };
      } else {
        throw new Error('Tab blocked by browser popup blocker');
      }
    } catch (windowError) {
      console.warn('⚠️ window.open failed, trying fallback method:', windowError.message);
      return fallbackFileOpen(fullUrl, fileName);
    }
    
  } catch (error) {
    console.error('❌ Error viewing file:', error);
    throw new Error(`Failed to open file: ${error.message}`);
  }
};

/**
 * Fallback method for opening files when window.open fails
 */
const fallbackFileOpen = (fullUrl, fileName) => {
  try {
    // Method 2: Create and click a download link
    const link = document.createElement('a');
    link.href = fullUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Add download attribute if filename is provided
    if (fileName) {
      link.download = fileName;
    }
    
    // Style the link to be invisible
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    
    return { 
      success: true, 
      method: 'link_click',
      url: fullUrl,
      fileName: fileName
    };
  } catch (error) {
    // Method 3: Last resort - navigate in current window
    console.warn('⚠️ Link click failed, navigating in current window');
    window.location.href = fullUrl;
    
    return { 
      success: true, 
      method: 'current_window',
      url: fullUrl,
      fileName: fileName
    };
  }
};

export const deleteFile = async (fileUrl) => {
  try {
    console.log('🗑️ Deleting file:', fileUrl);
    
    if (!fileUrl) {
      return { success: true, message: 'No file to delete' };
    }
    
    // Extract filename from URL and use task controller delete endpoint
    const filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    const encodedFilename = encodeURIComponent(filename);
    
    // Call delete endpoint
    await apiClient.delete(`/tasks/files/${encodedFilename}`);
    
    console.log('✅ File deleted successfully');
    return { success: true, message: 'File deleted successfully' };
    
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
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
    
    const allStudentIds = course.enrollments.flatMap(enrollment => 
      enrollment.studentIds || []
    );
    
    if (allStudentIds.length === 0) {
      console.log('📭 No student IDs found in enrollments');
      return [];
    }
    
    console.log(`👥 Found ${allStudentIds.length} student IDs:`, allStudentIds);
    
    // Fetch student details
    const studentDetails = await apiClient.post('/users/by-ids', allStudentIds);
    
    // Fetch existing grades
    let existingGrades = [];
    try {
      existingGrades = await apiClient.get(`/courses/${courseId}/grades`);
    } catch (error) {
      console.warn('⚠️ No existing grades found:', error.message);
      existingGrades = [];
    }
    
    // Combine student details with grades
    const studentsWithGrades = studentDetails.map(student => {
      const studentGrade = existingGrades.find(g => g.studentId === student.id);
      
      // Find which academic year this student is enrolled in
      const studentEnrollment = course.enrollments.find(enrollment => 
        enrollment.studentIds?.includes(student.id)
      );
      
      return {
        id: student.id,
        name: student.name,
        email: student.email,
        username: student.username,
        courseId: courseId,
        academicYear: studentEnrollment?.academicYear || null,
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

// ASSIGNMENTS using Tasks API with file handling
export const fetchAssignments = async (courseId, params = {}) => {
  try {
    console.log(`🔍 Fetching assignments for course: ${courseId}`);
    const tasks = await apiClient.get(`/tasks/course/${courseId}`, params);
    
    const transformedAssignments = Array.isArray(tasks) ? tasks.map((task) => ({
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
      // File attachment info
      hasAttachment: task.hasAttachment || (task.fileUrl && task.fileUrl.trim() !== ''),
      fileUrl: task.fileUrl,
      fileName: task.fileName,
      fileSize: task.fileSize
    })) : [];
    
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
    
    // Prepare task creation request
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
    
    // Handle file attachment
    if (assignmentData.file) {
      console.log('📁 Assignment has file attachment, uploading...');
      
      try {
        const fileData = await uploadFile(assignmentData.file, 'assignment', {
          courseId: assignmentData.courseId,
          description: `Attachment for assignment: ${assignmentData.title}`
        });
        
        // Add file information to task request
        taskCreateRequest.fileUrl = fileData.url;
        taskCreateRequest.fileName = fileData.name;
        taskCreateRequest.fileSize = fileData.size;
        
        console.log('✅ File uploaded successfully:', fileData);
      } catch (fileError) {
        console.error('❌ File upload failed:', fileError);
        throw new Error(`Failed to upload file: ${fileError.message}`);
      }
    } else if (assignmentData.fileUrl) {
      // Use existing file data
      taskCreateRequest.fileUrl = assignmentData.fileUrl;
      taskCreateRequest.fileName = assignmentData.fileName;
      taskCreateRequest.fileSize = assignmentData.fileSize;
    }
    
    // Create the task
    const createdTask = await apiClient.post('/tasks', taskCreateRequest);
    console.log('✅ Assignment created successfully:', createdTask);
    
    return {
      id: createdTask.id,
      title: createdTask.title,
      description: createdTask.description,
      courseId: createdTask.courseId,
      type: createdTask.type,
      dueDate: createdTask.dueDate,
      dueTime: createdTask.dueTime,
      maxPoints: createdTask.maxPoints,
      status: createdTask.status,
      priority: createdTask.priority,
      difficulty: createdTask.difficulty,
      category: createdTask.category,
      instructions: createdTask.instructions,
      hasAttachment: !!(createdTask.fileUrl && createdTask.fileUrl.trim() !== ''),
      fileUrl: createdTask.fileUrl,
      fileName: createdTask.fileName,
      fileSize: createdTask.fileSize,
      submissionCount: createdTask.submissionCount || 0,
      gradedCount: createdTask.gradedCount || 0,
      averageGrade: createdTask.averageGrade || 0,
      isOverdue: createdTask.isOverdue,
      createdAt: createdTask.createdAt,
      updatedAt: createdTask.updatedAt
    };
  } catch (error) {
    console.error('❌ Error creating assignment:', error);
    throw error;
  }
};

export const updateAssignment = async (assignmentId, updates) => {
  try {
    console.log('🔄 Updating assignment:', assignmentId, updates);
    
    // Prepare task update request
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
    
    // Handle file attachment updates
    if (updates.file) {
      console.log('📁 Assignment update has new file attachment, uploading...');
      
      try {
        // Delete old file if exists
        if (updates.fileUrl) {
          await deleteFile(updates.fileUrl);
        }
        
        const fileData = await uploadFile(updates.file, 'assignment', {
          assignmentId: assignmentId,
          description: `Updated attachment for assignment: ${updates.title}`
        });
        
        // Add new file information to task request
        taskUpdateRequest.fileUrl = fileData.url;
        taskUpdateRequest.fileName = fileData.name;
        taskUpdateRequest.fileSize = fileData.size;
        
        console.log('✅ New file uploaded successfully:', fileData);
      } catch (fileError) {
        console.error('❌ File upload failed:', fileError);
        throw new Error(`Failed to upload file: ${fileError.message}`);
      }
    } else if (updates.fileUrl && updates.fileUrl !== '') {
      // Keep existing file data
      taskUpdateRequest.fileUrl = updates.fileUrl;
      taskUpdateRequest.fileName = updates.fileName;
      taskUpdateRequest.fileSize = updates.fileSize;
    } else if (updates.hasAttachment === false) {
      // Remove file attachment
      if (updates.fileUrl) {
        try {
          await deleteFile(updates.fileUrl);
        } catch (deleteError) {
          console.warn('⚠️ Could not delete old file:', deleteError.message);
        }
      }
      taskUpdateRequest.fileUrl = null;
      taskUpdateRequest.fileName = null;
      taskUpdateRequest.fileSize = null;
    }
    
    // Update the task
    const updatedTask = await apiClient.put(`/tasks/${assignmentId}`, taskUpdateRequest);
    console.log('✅ Assignment updated successfully:', updatedTask);
    
    return {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      courseId: updatedTask.courseId,
      type: updatedTask.type,
      dueDate: updatedTask.dueDate,
      dueTime: updatedTask.dueTime,
      maxPoints: updatedTask.maxPoints,
      status: updatedTask.status,
      priority: updatedTask.priority,
      difficulty: updatedTask.difficulty,
      category: updatedTask.category,
      instructions: updatedTask.instructions,
      hasAttachment: !!(updatedTask.fileUrl && updatedTask.fileUrl.trim() !== ''),
      fileUrl: updatedTask.fileUrl,
      fileName: updatedTask.fileName,
      fileSize: updatedTask.fileSize,
      submissionCount: updatedTask.submissionCount || 0,
      gradedCount: updatedTask.gradedCount || 0,
      averageGrade: updatedTask.averageGrade || 0,
      isOverdue: updatedTask.isOverdue,
      createdAt: updatedTask.createdAt,
      updatedAt: updatedTask.updatedAt
    };
  } catch (error) {
    console.error('❌ Error updating assignment:', error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId) => {
  try {
    console.log('🗑️ Deleting assignment:', assignmentId);
    
    // First, get the assignment to check for file attachments
    try {
      const assignment = await apiClient.get(`/tasks/${assignmentId}`);
      if (assignment.fileUrl) {
        await deleteFile(assignment.fileUrl);
        console.log('✅ Assignment file deleted');
      }
    } catch (error) {
      console.warn('⚠️ Could not delete assignment file:', error.message);
    }
    
    // Delete the task
    await apiClient.delete(`/tasks/${assignmentId}`);
    console.log('✅ Assignment deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting assignment:', error);
    throw error;
  }
};

// ENHANCED submissions API to match TaskSubmission backend
export const fetchSubmissions = async (courseId, params = {}) => {
  try {
    console.log(`📄 Fetching submissions for course: ${courseId}`);
    
    const submissions = await apiClient.get(`/tasksubmissions/course/${courseId}`, params);
    
    // Transform TaskSubmissions to match frontend expectations
    const transformedSubmissions = Array.isArray(submissions) ? submissions.map(submission => {
      return {
        id: submission.id,
        courseId: submission.courseId,
        taskId: submission.taskId,
        assignmentId: submission.taskId, // Map taskId to assignmentId for compatibility
        studentId: submission.studentId,
        content: submission.content,
        notes: submission.notes,
        
        // File handling - TaskSubmission supports multiple files
        hasFiles: TaskSubmissionHelpers.hasFiles(submission),
        fileUrls: submission.fileUrls || [],
        fileNames: submission.fileNames || [],
        fileSizes: submission.fileSizes || [],
        fileCount: TaskSubmissionHelpers.getFileCount(submission),
        
        // For backward compatibility, use first file as primary
        fileUrl: submission.fileUrls && submission.fileUrls.length > 0 ? submission.fileUrls[0] : null,
        fileName: submission.fileNames && submission.fileNames.length > 0 ? submission.fileNames[0] : null,
        fileSize: submission.fileSizes && submission.fileSizes.length > 0 ? submission.fileSizes[0] : null,
        
        // Grading information
        grade: submission.grade,
        feedback: submission.feedback,
        status: submission.status || 'submitted',
        isGraded: TaskSubmissionHelpers.isGraded(submission),
        needsGrading: TaskSubmissionHelpers.needsGrading(submission),
        
        // Submission metadata
        attemptNumber: submission.attemptNumber || 1,
        isLate: submission.isLate || false,
        latePenaltyApplied: submission.latePenaltyApplied || 0,
        originalDueDate: submission.originalDueDate,
        
        // Auto-grading
        autoGraded: submission.autoGraded || false,
        autoGradeScore: submission.autoGradeScore,
        manualOverride: submission.manualOverride || false,
        
        // Group submission
        isGroupSubmission: submission.isGroupSubmission || false,
        groupMembers: submission.groupMembers || [],
        
        // Plagiarism
        plagiarismScore: submission.plagiarismScore,
        plagiarismChecked: submission.plagiarismChecked || false,
        
        // Timestamps
        submittedAt: submission.submittedAt,
        gradedAt: submission.gradedAt,
        updatedAt: submission.updatedAt,
        timeSpent: submission.timeSpent,
        
        // Final grade calculation using helper function
        finalGrade: TaskSubmissionHelpers.getFinalGrade(submission)
      };
    }) : [];
    
    console.log(`✅ Transformed ${transformedSubmissions.length} task submissions`);
    return transformedSubmissions;
  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    return [];
  }
};

// ENHANCED submission grading with sync support
export const updateSubmissionGrade = async (submissionId, grade, feedback = '') => {
  try {
    console.log('📊 Updating submission grade with sync:', submissionId, 'Grade:', grade);
    
    // Use the specific grading endpoint that syncs with grade columns
    const gradeData = {
      grade: grade,
      feedback: feedback
    };
    
    const response = await apiClient.put(`/tasksubmissions/${submissionId}/grade`, gradeData);
    console.log('✅ Submission grade updated and synced successfully:', response);
    return response.submission || response;
  } catch (error) {
    console.error('❌ Error updating submission grade:', error);
    throw error;
  }
};

export const downloadSubmission = async (submissionId) => {
  try {
    console.log('📥 Downloading submission:', submissionId);
    
    const submission = await apiClient.get(`/tasksubmissions/${submissionId}`);
    
    if (submission.fileUrls && submission.fileUrls.length > 0) {
      // Download all files if multiple
      for (let i = 0; i < submission.fileUrls.length; i++) {
        const fileUrl = submission.fileUrls[i];
        const fileName = submission.fileNames && submission.fileNames[i] 
          ? submission.fileNames[i] 
          : `submission_file_${i + 1}`;
        
        // Use our viewFile function to open/download the file
        await viewFile(fileUrl, fileName);
      }
      return { success: true, message: `Downloaded ${submission.fileUrls.length} files` };
    } else if (submission.fileUrl) {
      // Legacy single file support
      await viewFile(submission.fileUrl, submission.fileName);
      return { success: true, message: 'File download initiated' };
    } else {
      throw new Error('No files available for download');
    }
  } catch (error) {
    console.error('❌ Error downloading submission:', error);
    throw error;
  }
};

export const createSubmission = async (submissionData) => {
  try {
    console.log('➕ Creating submission:', submissionData);
    
    const response = await apiClient.post('/tasksubmissions/simple', submissionData);
    console.log('✅ Submission created successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error creating submission:', error);
    throw error;
  }
};

export const deleteSubmission = async (submissionId) => {
  try {
    console.log('🗑️ Deleting submission:', submissionId);
    
    await apiClient.delete(`/tasksubmissions/${submissionId}`);
    console.log('✅ Submission deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting submission:', error);
    throw error;
  }
};

// ENHANCED batch grading with sync support
export const batchGradeSubmissions = async (submissionIds, grade, feedback = '') => {
  try {
    console.log('📊 Batch grading submissions with sync:', submissionIds, 'Grade:', grade);
    
    // Grade each submission individually to ensure proper sync
    const results = [];
    for (const submissionId of submissionIds) {
      try {
        const result = await updateSubmissionGrade(submissionId, grade, feedback);
        results.push(result);
      } catch (error) {
        console.error(`❌ Error grading submission ${submissionId}:`, error);
        // Continue with other submissions
      }
    }
    
    console.log('✅ Batch grading completed:', results.length, 'successful');
    return { gradedSubmissions: results, successCount: results.length };
  } catch (error) {
    console.error('❌ Error batch grading submissions:', error);
    throw error;
  }
};

// ===================================
// EXAMS API - FULLY IMPLEMENTED
// ===================================

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
      passPercentage: exam.passPercentage,
      status: exam.status,
      questions: exam.questions || [],
      totalPoints: exam.totalPoints || 0,
      questionCount: exam.questions?.length || 0,
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

export const fetchExamById = async (examId) => {
  try {
    console.log(`🔍 Fetching exam by ID: ${examId}`);
    const exam = await apiClient.get(`/exams/${examId}`);
    console.log('✅ Retrieved exam:', exam.title);
    return exam;
  } catch (error) {
    console.error('❌ Error fetching exam by ID:', error);
    throw error;
  }
};

export const fetchExamForGrading = async (examId) => {
  try {
    console.log(`🔍 Fetching exam for grading: ${examId}`);
    const exam = await apiClient.get(`/exams/${examId}/for-grading`);
    console.log('✅ Retrieved exam for grading:', exam.title);
    return exam;
  } catch (error) {
    console.error('❌ Error fetching exam for grading:', error);
    throw error;
  }
};

export const createExam = async (examData) => {
  try {
    console.log('➕ Creating exam:', examData);
    const response = await apiClient.post('/exams', examData);
    console.log('✅ Exam created successfully:', response);
    return response.exam || response;
  } catch (error) {
    console.error('❌ Error creating exam:', error);
    throw error;
  }
};

export const updateExam = async (examId, updates) => {
  try {
    console.log('🔄 Updating exam:', examId, updates);
    const response = await apiClient.put(`/exams/${examId}`, updates);
    console.log('✅ Exam updated successfully:', response);
    return response.exam || response;
  } catch (error) {
    console.error('❌ Error updating exam:', error);
    throw error;
  }
};

export const deleteExam = async (examId) => {
  try {
    console.log('🗑️ Deleting exam:', examId);
    const response = await apiClient.delete(`/exams/${examId}`);
    console.log('✅ Exam deleted successfully');
    return response;
  } catch (error) {
    console.error('❌ Error deleting exam:', error);
    throw error;
  }
};

export const publishExam = async (examId) => {
  try {
    console.log('📢 Publishing exam:', examId);
    const response = await apiClient.post(`/exams/${examId}/publish`);
    console.log('✅ Exam published successfully');
    return response.exam || response;
  } catch (error) {
    console.error('❌ Error publishing exam:', error);
    throw error;
  }
};

export const unpublishExam = async (examId) => {
  try {
    console.log('📝 Unpublishing exam:', examId);
    const response = await apiClient.post(`/exams/${examId}/unpublish`);
    console.log('✅ Exam unpublished successfully');
    return response;
  } catch (error) {
    console.error('❌ Error unpublishing exam:', error);
    throw error;
  }
};

export const updateExamStatus = async (examId, status) => {
  try {
    console.log('🔄 Updating exam status:', examId, status);
    const response = await apiClient.put(`/exams/${examId}/status`, { status });
    console.log('✅ Exam status updated successfully');
    return response;
  } catch (error) {
    console.error('❌ Error updating exam status:', error);
    throw error;
  }
};

// ===================================
// EXAM QUESTIONS API
// ===================================

export const addQuestionToExam = async (examId, questionData) => {
  try {
    console.log('➕ Adding question to exam:', examId, questionData);
    const response = await apiClient.post(`/exams/${examId}/questions`, questionData);
    console.log('✅ Question added successfully');
    return response.question || response;
  } catch (error) {
    console.error('❌ Error adding question:', error);
    throw error;
  }
};

export const updateQuestion = async (examId, questionId, updates) => {
  try {
    console.log('🔄 Updating question:', examId, questionId, updates);
    const response = await apiClient.put(`/exams/${examId}/questions/${questionId}`, updates);
    console.log('✅ Question updated successfully');
    return response.question || response;
  } catch (error) {
    console.error('❌ Error updating question:', error);
    throw error;
  }
};

export const deleteQuestion = async (examId, questionId) => {
  try {
    console.log('🗑️ Deleting question:', examId, questionId);
    const response = await apiClient.delete(`/exams/${examId}/questions/${questionId}`);
    console.log('✅ Question deleted successfully');
    return response;
  } catch (error) {
    console.error('❌ Error deleting question:', error);
    throw error;
  }
};

export const reorderQuestions = async (examId, questionIds) => {
  try {
    console.log('🔄 Reordering questions:', examId, questionIds);
    const response = await apiClient.put(`/exams/${examId}/questions/reorder`, { questionIds });
    console.log('✅ Questions reordered successfully');
    return response;
  } catch (error) {
    console.error('❌ Error reordering questions:', error);
    throw error;
  }
};

// ===================================
// EXAM RESPONSES API - FULLY FIXED
// ===================================

/**
 * FIXED: Uses existing endpoints - gets exams first, then responses for each exam
 */
export const fetchExamResponses = async (courseId, params = {}) => {
  try {
    console.log(`📊 Fetching exam responses for course: ${courseId}`);
    
    if (!courseId) {
      console.warn('⚠️ No courseId provided to fetchExamResponses');
      return [];
    }
    
    // Step 1: Get all exams for the course using existing endpoint
    console.log(`📝 Step 1: Fetching exams for course ${courseId}`);
    const exams = await apiClient.get(`/courses/${courseId}/exams`);
    
    if (!Array.isArray(exams) || exams.length === 0) {
      console.log('📭 No exams found for this course');
      return [];
    }
    
    console.log(`📝 Found ${exams.length} exams, fetching responses...`);
    
    // Step 2: Get responses for each exam in parallel using existing endpoints
    const responsePromises = exams.map(async (exam) => {
      try {
        console.log(`📊 Fetching responses for exam: ${exam.id} (${exam.title})`);
        const examResponses = await apiClient.get(`/exams/${exam.id}/responses`);
        
        // Ensure each response has courseId set for consistency
        return Array.isArray(examResponses) ? examResponses.map(response => ({
          ...response,
          courseId: response.courseId || courseId, // Ensure courseId is set
          examTitle: exam.title, // Add exam title for reference
          examId: response.examId || exam.id // Ensure examId is set
        })) : [];
        
      } catch (error) {
        console.warn(`⚠️ Failed to fetch responses for exam ${exam.id}:`, error.message);
        return []; // Return empty array on error, don't fail entire operation
      }
    });
    
    // Wait for all response fetches to complete
    const responseArrays = await Promise.all(responsePromises);
    
    // Flatten all responses into single array
    const allResponses = responseArrays.flat();
    
    console.log(`📊 Retrieved ${allResponses.length} total responses from ${exams.length} exams`);
    
    if (allResponses.length === 0) {
      console.log('📭 No exam responses found for any exams in this course');
      return [];
    }
    
    // Transform ExamResponses to match frontend expectations
    const transformedResponses = allResponses.map(response => {
      // Handle the MongoDB _id field if present
      const id = response.id || response._id?.$oid || response._id;
      
      return {
        id: id,
        examId: response.examId,
        studentId: response.studentId,
        courseId: response.courseId || courseId,
        answers: response.answers || {},
        questionScores: response.questionScores || {},
        startedAt: response.startedAt,
        submittedAt: response.submittedAt,
        timeSpent: response.timeSpent,
        status: response.status,
        totalScore: response.totalScore || 0,
        maxScore: response.maxScore || 0,
        percentage: response.percentage || ExamResponseHelpers.calculatePercentage(response),
        passed: response.passed || false,
        graded: response.graded || (response.status === 'GRADED'),
        autoGraded: response.autoGraded || false,
        attemptNumber: response.attemptNumber || 1,
        instructorFeedback: response.instructorFeedback || '',
        gradedBy: response.gradedBy,
        gradedAt: response.gradedAt,
        flaggedForReview: response.flaggedForReview || false,
        lateSubmission: response.lateSubmission || false,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        
        // Additional fields for frontend use
        examTitle: response.examTitle,
        
        // Computed properties using helper functions
        isCompleted: ExamResponseHelpers.isCompleted(response),
        needsManualGrading: ExamResponseHelpers.needsManualGrading(response),
        gradingStatus: ExamResponseHelpers.getGradingStatus(response),
        timeSpentFormatted: ExamResponseHelpers.formatTimeSpent(response.timeSpent)
      };
    });
    
    // Sort by submission date (newest first)
    transformedResponses.sort((a, b) => {
      const dateA = new Date(a.submittedAt || a.updatedAt || 0);
      const dateB = new Date(b.submittedAt || b.updatedAt || 0);
      return dateB - dateA;
    });
    
    console.log(`✅ Successfully transformed ${transformedResponses.length} exam responses for course ${courseId}`);
    return transformedResponses;
    
  } catch (error) {
    console.error('❌ Error fetching exam responses:', error);
    
    // Enhanced error handling
    if (error.status === 404) {
      console.log('📊 No exam responses found for course');
      return [];
    } else if (error.status === 403) {
      console.error('❌ Permission denied for exam responses');
      throw new Error('You do not have permission to view exam responses for this course');
    } else if (error.status === 500) {
      console.error('❌ Server error fetching exam responses');
      throw new Error('Server error while fetching exam responses. Please try again.');
    } else {
      console.error('❌ Unexpected error fetching exam responses');
      throw new Error(`Failed to fetch exam responses: ${error.message}`);
    }
  }
};

export const fetchExamResponsesForExam = async (examId) => {
  try {
    console.log(`📊 Fetching responses for exam: ${examId}`);
    const responses = await apiClient.get(`/exams/${examId}/responses`);
    
    const transformedResponses = Array.isArray(responses) ? responses.map(response => ({
      id: response.id,
      examId: response.examId,
      studentId: response.studentId,
      courseId: response.courseId,
      answers: response.answers || {},
      questionScores: response.questionScores || {},
      startedAt: response.startedAt,
      submittedAt: response.submittedAt,
      timeSpent: response.timeSpent,
      status: response.status,
      totalScore: response.totalScore || 0,
      maxScore: response.maxScore || 0,
      percentage: response.percentage || ExamResponseHelpers.calculatePercentage(response),
      passed: response.passed || false,
      graded: response.graded || false,
      autoGraded: response.autoGraded || false,
      attemptNumber: response.attemptNumber || 1,
      instructorFeedback: response.instructorFeedback || '',
      gradedBy: response.gradedBy,
      gradedAt: response.gradedAt,
      flaggedForReview: response.flaggedForReview || false,
      lateSubmission: response.lateSubmission || false,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      
      // Computed properties
      isCompleted: ExamResponseHelpers.isCompleted(response),
      needsManualGrading: ExamResponseHelpers.needsManualGrading(response),
      gradingStatus: ExamResponseHelpers.getGradingStatus(response),
      timeSpentFormatted: ExamResponseHelpers.formatTimeSpent(response.timeSpent)
    })) : [];
    
    console.log(`✅ Found ${transformedResponses.length} responses for exam`);
    return transformedResponses;
  } catch (error) {
    console.error('❌ Error fetching exam responses for exam:', error);
    return [];
  }
};

export const fetchExamResponseById = async (responseId) => {
  try {
    console.log(`📋 Fetching exam response: ${responseId}`);
    const response = await apiClient.get(`/exam-responses/${responseId}`);
    console.log('✅ Retrieved exam response successfully');
    return response;
  } catch (error) {
    console.error('❌ Error fetching exam response:', error);
    throw error;
  }
};

export const fetchDetailedExamResponse = async (responseId) => {
  try {
    console.log(`📋 Fetching detailed exam response: ${responseId}`);
    const response = await apiClient.get(`/exam-responses/${responseId}/detailed`);
    console.log('✅ Retrieved detailed exam response successfully');
    return response;
  } catch (error) {
    console.error('❌ Error fetching detailed exam response:', error);
    throw error;
  }
};

export const fetchStudentExamResponses = async (studentId, courseId) => {
  try {
    console.log(`📊 Fetching student exam responses: ${studentId}, course: ${courseId}`);
    const responses = await apiClient.get(`/students/${studentId}/courses/${courseId}/exam-responses`);
    
    const transformedResponses = Array.isArray(responses) ? responses.map(response => ({
      id: response.id,
      examId: response.examId,
      studentId: response.studentId,
      courseId: response.courseId,
      status: response.status,
      startedAt: response.startedAt,
      submittedAt: response.submittedAt,
      timeSpent: response.timeSpent,
      totalScore: response.totalScore || 0,
      maxScore: response.maxScore || 0,
      percentage: response.percentage || ExamResponseHelpers.calculatePercentage(response),
      passed: response.passed || false,
      graded: response.graded || false,
      attemptNumber: response.attemptNumber || 1,
      
      // Computed properties
      isCompleted: ExamResponseHelpers.isCompleted(response),
      timeSpentFormatted: ExamResponseHelpers.formatTimeSpent(response.timeSpent)
    })) : [];
    
    console.log(`✅ Found ${transformedResponses.length} student responses`);
    return transformedResponses;
  } catch (error) {
    console.error('❌ Error fetching student exam responses:', error);
    return [];
  }
};

export const fetchExamResponseHistory = async (examId, studentId) => {
  try {
    console.log(`📚 Fetching exam response history: exam ${examId}, student ${studentId}`);
    const responses = await apiClient.get(`/exams/${examId}/responses/student/${studentId}`);
    console.log(`✅ Found ${responses.length} response history entries`);
    return responses;
  } catch (error) {
    console.error('❌ Error fetching exam response history:', error);
    return [];
  }
};

// ===================================
// EXAM GRADING API
// ===================================

export const gradeExamResponse = async (responseId, gradeData) => {
  try {
    console.log('📝 Grading exam response:', responseId, gradeData);
    const response = await apiClient.put('/exam-responses/grade', {
      responseId,
      ...gradeData
    });
    console.log('✅ Exam response graded successfully');
    return response;
  } catch (error) {
    console.error('❌ Error grading exam response:', error);
    throw error;
  }
};

export const manualGradeExamResponse = async (responseId, questionScores, instructorFeedback = '', flaggedForReview = false) => {
  try {
    console.log('📝 Manual grading exam response:', responseId);
    
    // FIXED: Create the correct request structure to match backend expectations
    const requestData = {
      responseId: responseId,
      questionScores: questionScores,
      instructorFeedback: instructorFeedback,
      flaggedForReview: flaggedForReview
    };
    
    console.log('📝 Sending request data:', requestData);
    
    const response = await apiClient.put('/exam-responses/manual-grade', requestData);
    console.log('✅ Manual grading completed successfully');
    return response.response || response;
  } catch (error) {
    console.error('❌ Error manual grading exam response:', error);
    console.error('❌ Error details:', error.details);
    throw error;
  }
};

export const updateQuestionScore = async (responseId, questionId, score, feedback = '') => {
  try {
    console.log('📊 Updating question score:', responseId, questionId, score);
    const response = await apiClient.put(`/exam-responses/${responseId}/question-score`, {
      questionId,
      score,
      feedback
    });
    console.log('✅ Question score updated successfully');
    return response.response || response;
  } catch (error) {
    console.error('❌ Error updating question score:', error);
    throw error;
  }
};

export const autoGradeResponse = async (responseId) => {
  try {
    console.log('🤖 Auto-grading response:', responseId);
    const response = await apiClient.post(`/exam-responses/${responseId}/auto-grade`);
    console.log('✅ Auto-grading completed successfully');
    return response;
  } catch (error) {
    console.error('❌ Error auto-grading response:', error);
    throw error;
  }
};

export const autoGradeAllResponses = async (examId) => {
  try {
    console.log('🤖 Auto-grading all responses for exam:', examId);
    const response = await apiClient.post(`/exams/${examId}/auto-grade-all`);
    console.log('✅ Auto-grading all responses completed');
    return response;
  } catch (error) {
    console.error('❌ Error auto-grading all responses:', error);
    throw error;
  }
};

export const flagResponseForReview = async (responseId, flagReason = '', flagPriority = 'medium') => {
  try {
    console.log('🚩 Flagging response for review:', responseId);
    const response = await apiClient.put(`/exam-responses/${responseId}/flag`, {
      flagReason,
      flagPriority
    });
    console.log('✅ Response flagged for review successfully');
    return response.response || response;
  } catch (error) {
    console.error('❌ Error flagging response:', error);
    throw error;
  }
};

export const unflagResponse = async (responseId) => {
  try {
    console.log('🚩 Unflagging response:', responseId);
    const response = await apiClient.put(`/exam-responses/${responseId}/unflag`);
    console.log('✅ Response unflagged successfully');
    return response.response || response;
  } catch (error) {
    console.error('❌ Error unflagging response:', error);
    throw error;
  }
};

export const batchGradeExamResponses = async (responseIds, instructorFeedback = '', flagForReview = false) => {
  try {
    console.log('📦 Batch grading exam responses:', responseIds.length, 'responses');
    const response = await apiClient.post('/exam-responses/batch-grade', {
      responseIds,
      instructorFeedback,
      flagForReview
    });
    console.log('✅ Batch grading completed successfully');
    return response;
  } catch (error) {
    console.error('❌ Error batch grading exam responses:', error);
    throw error;
  }
};

// ===================================
// EXAM STATISTICS API
// ===================================

export const fetchExamStats = async (examId) => {
  try {
    console.log(`📊 Fetching exam statistics: ${examId}`);
    const stats = await apiClient.get(`/exams/${examId}/stats`);
    console.log('✅ Retrieved exam statistics');
    return stats;
  } catch (error) {
    console.error('❌ Error fetching exam statistics:', error);
    return null;
  }
};

export const fetchExamGradingStats = async (examId) => {
  try {
    console.log(`📊 Fetching exam grading statistics: ${examId}`);
    const stats = await apiClient.get(`/exams/${examId}/grading-stats`);
    console.log('✅ Retrieved exam grading statistics');
    return stats;
  } catch (error) {
    console.error('❌ Error fetching exam grading statistics:', error);
    return null;
  }
};

export const fetchCourseExamStats = async (courseId) => {
  try {
    console.log(`📊 Fetching course exam statistics: ${courseId}`);
    const stats = await apiClient.get(`/courses/${courseId}/exam-stats`);
    console.log('✅ Retrieved course exam statistics');
    return stats;
  } catch (error) {
    console.error('❌ Error fetching course exam statistics:', error);
    return [];
  }
};

// ===================================
// REMAINING APIs (Grade Columns, Students, etc.)
// ===================================

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

// Export functionality
export const exportGrades = async (courseId, format = 'csv', options = {}) => {
  try {
    console.warn('Export grades endpoint not implemented yet');
    return { success: true, message: 'Export simulated' };
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

// ===================================
// EXAM VALIDATION API
// ===================================

export const canStudentTakeExam = async (examId, studentId) => {
  try {
    console.log(`🔍 Checking if student can take exam: ${examId}, student: ${studentId}`);
    const response = await apiClient.get(`/exams/${examId}/can-take`);
    console.log('✅ Exam eligibility checked');
    return response.canTake || false;
  } catch (error) {
    console.error('❌ Error checking exam eligibility:', error);
    return false;
  }
};

export const getStudentAttemptCount = async (examId, studentId) => {
  try {
    console.log(`📊 Getting attempt count: exam ${examId}, student ${studentId}`);
    const response = await apiClient.get(`/exams/${examId}/attempt-count/${studentId}`);
    console.log('✅ Attempt count retrieved');
    return response.attemptCount || 0;
  } catch (error) {
    console.error('❌ Error getting attempt count:', error);
    return 0;
  }
};

export const hasActiveAttempt = async (examId, studentId) => {
  try {
    // Check if student has an active (in-progress) attempt
    const responses = await fetchExamResponseHistory(examId, studentId);
    const activeAttempt = responses.find(response => response.status === 'IN_PROGRESS');
    return !!activeAttempt;
  } catch (error) {
    console.error('❌ Error checking active attempt:', error);
    return false;
  }
};

// ===================================
// STUDENT EXAM TAKING API
// ===================================

export const startExam = async (examId) => {
  try {
    console.log(`🎯 Starting exam: ${examId}`);
    const response = await apiClient.post(`/exams/${examId}/start`);
    console.log('✅ Exam started successfully');
    return response;
  } catch (error) {
    console.error('❌ Error starting exam:', error);
    throw error;
  }
};

export const saveExamProgress = async (progressData) => {
  try {
    console.log('💾 Saving exam progress');
    const response = await apiClient.put('/exams/save-progress', progressData);
    console.log('✅ Progress saved successfully');
    return response;
  } catch (error) {
    console.error('❌ Error saving progress:', error);
    throw error;
  }
};

export const submitExam = async (submissionData) => {
  try {
    console.log('📤 Submitting exam');
    const response = await apiClient.post('/exams/submit', submissionData);
    console.log('✅ Exam submitted successfully');
    return response;
  } catch (error) {
    console.error('❌ Error submitting exam:', error);
    throw error;
  }
};

// ===================================
// EXPORT FUNCTIONALITY
// ===================================

export const exportDetailedExamResponses = async (examId, format = 'csv') => {
  try {
    console.log(`📤 Exporting detailed exam responses: ${examId}`);
    const response = await apiClient.post('/exam-responses/export-detailed', {
      examId,
      format
    });
    console.log('✅ Export initiated successfully');
    return response;
  } catch (error) {
    console.error('❌ Error exporting exam responses:', error);
    throw error;
  }
};

// ===================================
// HELPER FUNCTIONS
// ===================================

/**
 * Helper function to get exam response grading status
 */
export const getResponseGradingStatus = (response) => {
  return ExamResponseHelpers.getGradingStatus(response);
};

/**
 * Helper function to check if response can be auto-graded
 */
export const canResponseBeAutoGraded = (response) => {
  return ExamResponseHelpers.canAutoGrade(response);
};

/**
 * Helper function to check if response needs manual grading
 */
export const needsManualGrading = (response) => {
  return ExamResponseHelpers.needsManualGrading(response);
};

/**
 * Helper function to check if response is completed
 */
export const isResponseCompleted = (response) => {
  return ExamResponseHelpers.isCompleted(response);
};

/**
 * Helper function to format time spent
 */
export const formatTimeSpent = (timeSpentSeconds) => {
  return ExamResponseHelpers.formatTimeSpent(timeSpentSeconds);
};

/**
 * Helper function to calculate percentage
 */
export const calculateResponsePercentage = (response) => {
  return ExamResponseHelpers.calculatePercentage(response);
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
export { apiClient, ExamResponseHelpers, TaskSubmissionHelpers };