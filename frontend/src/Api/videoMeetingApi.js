/**
 * Video Meeting API Service - FIXED VERSION
 * Enhanced with session resumption and better error handling
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    // Token is handled via cookies, no need to add manually
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${message}`);
    
    // Enhanced error details for debugging
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    return Promise.reject(new Error(message));
  }
);

/**
 * ENHANCED: Meeting Management APIs with session resumption
 */
export const meetingApi = {
  /**
   * Create a new meeting
   * @param {object} meetingData - Meeting data
   * @returns {Promise<object>} - Created meeting
   */
  createMeeting: async (meetingData) => {
    try {
      console.log('DEBUG: Creating meeting with data:', meetingData);
      
      const response = await apiClient.post('/meetings', {
        ...meetingData,
        createdAt: new Date().toISOString()
      });
      
      console.log('DEBUG: Meeting created successfully:', response);
      return response;
    } catch (error) {
      console.error('ERROR: Failed to create meeting:', error);
      throw new Error(`Failed to create meeting: ${error.message}`);
    }
  },

  /**
   * Get meetings for current user
   * @param {object} filters - Optional filters
   * @returns {Promise<Array>} - User's meetings
   */
  getUserMeetings: async (filters = {}) => {
    try {      
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const endpoint = `/meetings/user${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('DEBUG: API endpoint:', endpoint);
      
      const response = await apiClient.get(endpoint);
      
      console.log('DEBUG: User meetings response:', response);
      
      // Ensure we return an array
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch user meetings:', error);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  },

  /**
   * Get meeting by ID
   * @param {string} meetingId - Meeting ID
   * @returns {Promise<object>} - Meeting details
   */
  getMeetingById: async (meetingId) => {
    try {
      console.log('DEBUG: Fetching meeting by ID:', meetingId);
      
      const response = await apiClient.get(`/meetings/${meetingId}`);
      
      console.log('DEBUG: Meeting by ID response:', response);
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch meeting:', error);
      throw new Error(`Failed to fetch meeting: ${error.message}`);
    }
  },

  /**
   * Get meeting invitation link
   * @param {string} meetingId - Meeting ID
   * @returns {Promise<object>} - Meeting invitation details
   */
  getMeetingInvitation: async (meetingId) => {
    try {
      console.log('DEBUG: Fetching meeting invitation for:', meetingId);
      
      const response = await apiClient.get(`/meetings/${meetingId}/invitation`);
      
      console.log('DEBUG: Meeting invitation response:', response);
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch meeting invitation:', error);
      throw new Error(`Failed to fetch meeting invitation: ${error.message}`);
    }
  },

  /**
   * Update meeting
   * @param {string} meetingId - Meeting ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} - Updated meeting
   */
  updateMeeting: async (meetingId, updateData) => {
    try {
      console.log('DEBUG: Updating meeting:', meetingId, 'with data:', updateData);
      
      const response = await apiClient.put(`/meetings/${meetingId}`, {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      
      console.log('DEBUG: Meeting update response:', response);
      return response;
    } catch (error) {
      console.error('ERROR: Failed to update meeting:', error);
      throw new Error(`Failed to update meeting: ${error.message}`);
    }
  },

  /**
   * Delete meeting
   * @param {string} meetingId - Meeting ID
   * @returns {Promise<void>}
   */
  deleteMeeting: async (meetingId) => {
    try {
      console.log('DEBUG: Deleting meeting:', meetingId);
      
      await apiClient.delete(`/meetings/${meetingId}`);
      
      console.log('DEBUG: Meeting deleted successfully');
    } catch (error) {
      console.error('ERROR: Failed to delete meeting:', error);
      throw new Error(`Failed to delete meeting: ${error.message}`);
    }
  },

  /**
   * FIXED: Check for recent session that can be resumed
   * @param {string} meetingId - Meeting ID
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Recent session check result
   */
  checkRecentSession: async (meetingId, userId) => {
    try {
      console.log('DEBUG: Checking recent session for meeting:', meetingId, 'user:', userId);
      
      const response = await apiClient.post(`/meetings/${meetingId}/check-recent-session`, {
        userId,
        checkTime: new Date().toISOString()
      });
      
      console.log('DEBUG: Recent session check response:', response);
      return response;
    } catch (error) {
      console.warn('WARN: Recent session check failed:', error.message);
      // Return false if check fails, we'll create new session
      return { canResume: false };
    }
  },

  /**
   * FIXED: Resume an existing session
   * @param {string} meetingId - Meeting ID
   * @param {string} sessionId - Session ID to resume
   * @returns {Promise<object>} - Resumed session
   */
  resumeSession: async (meetingId, sessionId) => {
    try {
      console.log('DEBUG: Resuming session:', sessionId, 'for meeting:', meetingId);
      
      const response = await apiClient.post(`/meetings/${meetingId}/resume-session`, {
        sessionId,
        resumeTime: new Date().toISOString()
      });
      
      console.log('DEBUG: Resume session response:', response);
      return response;
    } catch (error) {
      console.error('ERROR: Failed to resume session:', error);
      throw new Error(`Failed to resume session: ${error.message}`);
    }
  },

  /**
   * Join meeting (record attendance start)
   * @param {string} meetingId - Meeting ID
   * @param {object} joinData - Join data
   * @returns {Promise<object>} - Join response
   */
  joinMeeting: async (meetingId, joinData = {}) => {
    try {
      console.log('DEBUG: Joining meeting:', meetingId, 'with data:', joinData);
      
      const response = await apiClient.post(`/meetings/${meetingId}/join`, {
        ...joinData,
        joinTime: new Date().toISOString()
      });
      
      console.log('DEBUG: Join meeting response:', response);
      return response;
    } catch (error) {
      console.error('ERROR: Failed to join meeting:', error);
      throw new Error(`Failed to join meeting: ${error.message}`);
    }
  },

  /**
   * ENHANCED: Leave meeting with retry logic
   * @param {string} meetingId - Meeting ID
   * @param {string} sessionId - Attendance session ID
   * @returns {Promise<object>} - Leave response
   */
  leaveMeeting: async (meetingId, sessionId) => {
    const leaveData = {
      sessionId,
      leaveTime: new Date().toISOString()
    };

    console.log('DEBUG: Leaving meeting:', meetingId, 'session:', sessionId);

    // Try main API call first
    try {
      const response = await apiClient.post(`/meetings/${meetingId}/leave`, leaveData);
      console.log('DEBUG: Leave meeting success (primary):', response);
      return response;
    } catch (error) {
      console.error('ERROR: Primary leave API failed:', error.message);
      
      // Fallback: try with fetch
      try {
        console.log('DEBUG: Trying fallback fetch method');
        
        const fallbackResponse = await fetch(`${API_BASE_URL}/meetings/${meetingId}/leave`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leaveData)
        });
        
        if (fallbackResponse.ok) {
          const result = await fallbackResponse.json();
          console.log('DEBUG: Leave meeting success (fallback):', result);
          return result;
        }
        throw new Error(`Fallback failed: ${fallbackResponse.status}`);
      } catch (fetchError) {
        console.error('ERROR: Fallback leave API failed:', fetchError.message);
        
        // Final fallback: beacon (fire-and-forget)
        try {
          console.log('DEBUG: Trying beacon fallback');
          
          const beaconData = new Blob([JSON.stringify({
            ...leaveData,
            reason: 'api_fallback'
          })], { type: 'application/json' });
          
          const beaconSent = navigator.sendBeacon(
            `${API_BASE_URL}/meetings/${meetingId}/leave`,
            beaconData
          );
          
          console.log('DEBUG: Beacon fallback sent:', beaconSent ? 'success' : 'failed');
          
          if (beaconSent) {
            return { status: 'left', method: 'beacon' };
          }
        } catch (beaconError) {
          console.error('ERROR: Beacon fallback failed:', beaconError.message);
        }
        
        throw new Error(`Failed to leave meeting: ${error.message}`);
      }
    }
  },

  /**
   * Get meeting attendance
   * @param {string} meetingId - Meeting ID
   * @returns {Promise<Array>} - Attendance records
   */
  getMeetingAttendance: async (meetingId) => {
    try {
      console.log('DEBUG: Fetching meeting attendance for:', meetingId);
      
      const response = await apiClient.get(`/meetings/${meetingId}/attendance`);
      
      console.log('DEBUG: Meeting attendance response:', response);
      
      // Ensure we return an array
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch meeting attendance:', error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * Start meeting (for lecturers)
   * @param {string} meetingId - Meeting ID
   * @returns {Promise<object>} - Start response
   */
  startMeeting: async (meetingId) => {
    try {
      console.log('DEBUG: Starting meeting:', meetingId);
      
      const response = await apiClient.post(`/meetings/${meetingId}/start`, {
        startTime: new Date().toISOString()
      });
      
      console.log('DEBUG: Start meeting response:', response);
      return response;
    } catch (error) {
      console.error('ERROR: Failed to start meeting:', error);
      throw new Error(`Failed to start meeting: ${error.message}`);
    }
  },

  /**
   * End meeting (for lecturers)
   * @param {string} meetingId - Meeting ID
   * @returns {Promise<object>} - End response
   */
  endMeeting: async (meetingId) => {
    try {
      console.log('DEBUG: Ending meeting:', meetingId);
      
      const response = await apiClient.post(`/meetings/${meetingId}/end`, {
        endTime: new Date().toISOString()
      });
      
      console.log('DEBUG: End meeting response:', response);
      return response;
    } catch (error) {
      console.error('ERROR: Failed to end meeting:', error);
      throw new Error(`Failed to end meeting: ${error.message}`);
    }
  },

  /**
   * FIXED: Get active sessions for a meeting
   * @param {string} meetingId - Meeting ID
   * @returns {Promise<Array>} - Active sessions
   */
  getActiveSessions: async (meetingId) => {
    try {
      console.log('DEBUG: Fetching active sessions for meeting:', meetingId);
      
      const response = await apiClient.get(`/meetings/${meetingId}/active-sessions`);
      
      console.log('DEBUG: Active sessions response:', response);
      
      // Ensure we return an array
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch active sessions:', error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * FIXED: Heartbeat to keep session alive
   * @param {string} meetingId - Meeting ID
   * @param {string} sessionId - Session ID
   * @returns {Promise<object>} - Heartbeat response
   */
  sendHeartbeat: async (meetingId, sessionId) => {
    try {
      console.log('DEBUG: Sending heartbeat for meeting:', meetingId, 'session:', sessionId);
      
      const response = await apiClient.post(`/meetings/${meetingId}/heartbeat`, {
        sessionId,
        timestamp: new Date().toISOString()
      });
      
      console.log('DEBUG: Heartbeat response:', response);
      return response;
    } catch (error) {
      console.warn('WARN: Heartbeat failed:', error.message);
      // Don't throw error for heartbeat failures
      return { status: 'failed' };
    }
  }
};

/**
 * Course Management APIs for Meetings
 */
export const courseApi = {
  /**
   * Get lecturer's courses
   * @returns {Promise<Array>} - Lecturer's courses
   */
  getLecturerCourses: async () => {
    try {
      console.log('DEBUG: Fetching lecturer courses');
      
      const response = await apiClient.get('/courses/lecturer');
      
      console.log('DEBUG: Lecturer courses response:', response);
      
      // Ensure we return an array
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch lecturer courses:', error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * Get student's enrolled courses
   * @returns {Promise<Array>} - Student's courses
   */
  getStudentCourses: async () => {
    try {
      console.log('DEBUG: Fetching student courses');
      
      const response = await apiClient.get('/courses/student');
      
      console.log('DEBUG: Student courses response:', response);
      
      // Ensure we return an array
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch student courses:', error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * Get course meetings
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} - Course meetings
   */
  getCourseMeetings: async (courseId) => {
    try {
      console.log('DEBUG: Fetching course meetings for:', courseId);
      
      const response = await apiClient.get(`/courses/${courseId}/meetings`);
      
      console.log('DEBUG: Course meetings response:', response);
      
      // Ensure we return an array
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch course meetings:', error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * Get course students (for lecturers)
   * @param {string} courseId - Course ID
   * @returns {Promise<Array>} - Course students
   */
  getCourseStudents: async (courseId) => {
    try {
      console.log('DEBUG: Fetching course students for:', courseId);
      
      const response = await apiClient.get(`/courses/${courseId}/students`);
      
      console.log('DEBUG: Course students response:', response);
      
      // Ensure we return an array
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch course students:', error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * Get course analytics
   * @param {string} courseId - Course ID
   * @param {object} filters - Time range filters
   * @returns {Promise<object>} - Course analytics
   */
  getCourseAnalytics: async (courseId, filters = {}) => {
    try {
      console.log('DEBUG: Fetching course analytics for:', courseId, 'with filters:', filters);
      
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const endpoint = `/analytics/course/${courseId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(endpoint);
      
      console.log('DEBUG: Course analytics response:', response);
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch course analytics:', error);
      return {}; // Return empty object instead of throwing
    }
  }
};

/**
 * Attendance Management APIs
 */
export const attendanceApi = {
  /**
   * Get user's attendance summary
   * @param {object} filters - Date range and other filters
   * @returns {Promise<object>} - Attendance summary
   */
  getAttendanceSummary: async (filters = {}) => {
    try {
      console.log('DEBUG: Fetching attendance summary with filters:', filters);
      
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const endpoint = `/attendance/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(endpoint);
      
      console.log('DEBUG: Attendance summary response:', response);
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch attendance summary:', error);
      return {}; // Return empty object instead of throwing
    }
  },

  /**
   * Get detailed attendance for a course
   * @param {string} courseId - Course ID
   * @param {object} filters - Additional filters
   * @returns {Promise<Array>} - Detailed attendance records
   */
  getCourseAttendance: async (courseId, filters = {}) => {
    try {
      console.log('DEBUG: Fetching course attendance for:', courseId, 'with filters:', filters);
      
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const endpoint = `/attendance/course/${courseId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(endpoint);
      
      console.log('DEBUG: Course attendance response:', response);
      
      // Ensure we return an array
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch course attendance:', error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * Get student attendance for specific course (for lecturers)
   * @param {string} courseId - Course ID
   * @param {string} studentId - Student ID
   * @returns {Promise<Array>} - Student's attendance in course
   */
  getStudentCourseAttendance: async (courseId, studentId) => {
    try {
      console.log('DEBUG: Fetching student course attendance for course:', courseId, 'student:', studentId);
      
      const response = await apiClient.get(`/attendance/course/${courseId}/student/${studentId}`);
      
      console.log('DEBUG: Student course attendance response:', response);
      
      // Ensure we return an array
      if (!Array.isArray(response)) {
        console.warn('WARN: Expected array but got:', typeof response, response);
        return [];
      }
      
      return response;
    } catch (error) {
      console.error('ERROR: Failed to fetch student course attendance:', error);
      return []; // Return empty array instead of throwing
    }
  },

  /**
   * Update attendance record
   * @param {string} attendanceId - Attendance record ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} - Updated attendance record
   */
  updateAttendance: async (attendanceId, updateData) => {
    try {
      console.log('DEBUG: Updating attendance:', attendanceId, 'with data:', updateData);
      
      const response = await apiClient.put(`/attendance/${attendanceId}`, updateData);
      
      console.log('DEBUG: Update attendance response:', response);
      return response;
    } catch (error) {
      console.error('ERROR: Failed to update attendance:', error);
      throw new Error(`Failed to update attendance: ${error.message}`);
    }
  }
};

/**
 * Test API connectivity
 */
export const testConnection = async () => {
  try {
    console.log('DEBUG: Testing API connection');
    
    const response = await apiClient.get('/health', { timeout: 5000 });
    
    console.log('DEBUG: Connection test successful:', response);
    return true;
  } catch (error) {
    console.warn('WARN: Connection test failed:', error.message);
    return false;
  }
};

/**
 * FIXED: Enhanced error handling utility
 */
export const handleApiError = (error, fallbackMessage = 'An unexpected error occurred') => {
  console.error('API Error Details:', {
    message: error.message,
    stack: error.stack,
    response: error.response?.data,
    status: error.response?.status
  });

  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.statusText;
    return new Error(message);
  } else if (error.request) {
    // Request made but no response
    return new Error('Network error. Please check your connection.');
  } else {
    // Something else happened
    return new Error(error.message || fallbackMessage);
  }
};

/**
 * FIXED: Connection monitoring utilities
 */
export const connectionUtils = {
  /**
   * Check if user is online
   */
  isOnline: () => navigator.onLine,

  /**
   * Monitor connection status
   */
  onConnectionChange: (callback) => {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },

  /**
   * Test API connectivity
   */
  testConnection
};

export default {
  meetingApi,
  courseApi,
  attendanceApi,
  handleApiError,
  connectionUtils,
  testConnection
};