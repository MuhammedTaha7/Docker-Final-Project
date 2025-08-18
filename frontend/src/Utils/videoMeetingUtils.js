/**
 * Video Meeting Utilities - FIXED VERSION
 * Enhanced with better error handling and debugging
 */

import { format, isToday, isTomorrow, isYesterday, parseISO, isValid } from 'date-fns';

// Meeting constants
export const MEETING_CONSTANTS = {
  MEETING_TYPES: {
    INSTANT: 'instant',
    LECTURE: 'lecture',
    OFFICE_HOURS: 'office_hours',
    SCHEDULED: 'scheduled'
  },
  
  MEETING_STATUS: {
    SCHEDULED: 'scheduled',
    ACTIVE: 'active',
    ENDED: 'ended',
    CANCELLED: 'cancelled'
  },

  DURATION_OPTIONS: [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' }
  ],

  MAX_USERS: {
    INSTANT: 50,
    COURSE: 100,
    DEFAULT: 100
  }
};

/**
 * Generate a unique room ID for meetings
 */
export const generateRoomId = (options = {}) => {
  const { type = 'instant', courseId } = options;
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  let prefix = 'meet';
  if (type === 'lecture') prefix = 'lecture';
  if (type === 'office_hours') prefix = 'office';
  
  let roomId = `${prefix}_${timestamp}_${random}`;
  
  if (courseId) {
    roomId = `${prefix}_${courseId.substring(0, 8)}_${timestamp}_${random}`;
  }
  
  console.log('DEBUG: Generated room ID:', roomId);
  return roomId;
};

/**
 * Parse invitation link to extract meeting information
 */
export const parseInvitationLink = (invitationLink) => {
  try {
    console.log('DEBUG: Parsing invitation link:', invitationLink);
    
    if (!invitationLink || typeof invitationLink !== 'string') {
      throw new Error('Invalid invitation link');
    }

    const url = new URL(invitationLink);
    const params = new URLSearchParams(url.search);
    
    const meetingInfo = {
      roomId: params.get('room'),
      title: params.get('title') || 'Video Meeting',
      courseId: params.get('courseId'),
      meetingId: params.get('meetingId'),
      userName: params.get('name') || 'Guest User'
    };
    
    console.log('DEBUG: Parsed meeting info:', meetingInfo);
    
    if (!meetingInfo.roomId) {
      throw new Error('Room ID not found in invitation link');
    }
    
    return meetingInfo;
  } catch (error) {
    console.error('ERROR: Failed to parse invitation link:', error);
    return null;
  }
};

/**
 * Generate invitation link for a meeting
 */
export const generateInvitationLink = (options = {}) => {
  const { roomId, title, courseId, meetingId, baseUrl = window.location.origin } = options;
  
  if (!roomId) {
    console.error('ERROR: Cannot generate invitation link without room ID');
    return null;
  }
  
  try {
    const url = new URL('/meeting', baseUrl);
    url.searchParams.set('room', roomId);
    
    if (title) {
      url.searchParams.set('title', title);
    }
    
    if (courseId) {
      url.searchParams.set('courseId', courseId);
    }
    
    if (meetingId) {
      url.searchParams.set('meetingId', meetingId);
    }
    
    // Placeholder for user name - will be replaced when user joins
    url.searchParams.set('name', 'Guest User');
    
    const invitationLink = url.toString();
    console.log('DEBUG: Generated invitation link:', invitationLink);
    
    return invitationLink;
  } catch (error) {
    console.error('ERROR: Failed to generate invitation link:', error);
    return null;
  }
};

/**
 * Open meeting in new tab/window
 */
export const openMeetingInNewTab = (options = {}) => {
  const { roomId, userId, userName, title, courseId, meetingId } = options;
  
  if (!roomId || !userId || !userName) {
    console.error('ERROR: Missing required parameters for opening meeting');
    throw new Error('Missing required parameters: roomId, userId, and userName are required');
  }
  
  try {
    const url = new URL('/meeting', window.location.origin);
    url.searchParams.set('room', roomId);
    url.searchParams.set('userId', userId);
    url.searchParams.set('name', encodeURIComponent(userName));
    
    if (title) {
      url.searchParams.set('title', encodeURIComponent(title));
    }
    
    if (courseId) {
      url.searchParams.set('courseId', courseId);
    }
    
    if (meetingId) {
      url.searchParams.set('meetingId', meetingId);
    }
    
    const meetingUrl = url.toString();
    console.log('DEBUG: Opening meeting in new tab:', meetingUrl);
    
    window.open(
      meetingUrl,
      '_blank',
      'width=1200,height=800,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=yes'
    );
  } catch (error) {
    console.error('ERROR: Failed to open meeting in new tab:', error);
    throw error;
  }
};

/**
 * Format meeting time for display
 */
export const formatMeetingTime = (datetime) => {
  try {
    if (!datetime) {
      console.warn('WARN: No datetime provided to formatMeetingTime');
      return {
        time: 'Unknown time',
        date: 'Unknown date',
        dayRelative: 'Unknown day',
        full: 'Unknown time'
      };
    }
    
    let date;
    if (typeof datetime === 'string') {
      date = parseISO(datetime);
    } else if (datetime instanceof Date) {
      date = datetime;
    } else {
      date = new Date(datetime);
    }
    
    if (!isValid(date)) {
      console.warn('WARN: Invalid date in formatMeetingTime:', datetime);
      return {
        time: 'Invalid time',
        date: 'Invalid date',
        dayRelative: 'Invalid day',
        full: 'Invalid time'
      };
    }
    
    const time = format(date, 'h:mm a');
    const dateStr = format(date, 'MMM d, yyyy');
    
    let dayRelative;
    if (isToday(date)) {
      dayRelative = 'Today';
    } else if (isTomorrow(date)) {
      dayRelative = 'Tomorrow';
    } else if (isYesterday(date)) {
      dayRelative = 'Yesterday';
    } else {
      dayRelative = format(date, 'EEE, MMM d');
    }
    
    const full = `${dayRelative} at ${time}`;
    
    return {
      time,
      date: dateStr,
      dayRelative,
      full
    };
  } catch (error) {
    console.error('ERROR: Failed to format meeting time:', error);
    return {
      time: 'Error',
      date: 'Error',
      dayRelative: 'Error',
      full: 'Error'
    };
  }
};

/**
 * Format duration for display
 */
export const formatDuration = (minutes) => {
  try {
    if (!minutes || minutes <= 0) {
      return '0 min';
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes} min`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${remainingMinutes}m`;
    }
  } catch (error) {
    console.error('ERROR: Failed to format duration:', error);
    return 'Unknown';
  }
};

/**
 * Get meeting type configuration (colors, icons, etc.)
 */
export const getMeetingTypeConfig = (type, index = 0) => {
  const configs = {
    lecture: {
      color: '#4f46e5',
      label: 'Lecture',
      icon: 'GraduationCap'
    },
    office_hours: {
      color: '#059669',
      label: 'Office Hours',
      icon: 'Users'
    },
    instant: {
      color: '#dc2626',
      label: 'Instant Meeting',
      icon: 'Video'
    },
    scheduled: {
      color: '#7c3aed',
      label: 'Scheduled Meeting',
      icon: 'Calendar'
    }
  };
  
  // Fallback colors for unknown types
  const fallbackColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
  
  const config = configs[type] || {
    color: fallbackColors[index % fallbackColors.length],
    label: 'Meeting',
    icon: 'Video'
  };
  
  return config;
};

/**
 * Validate meeting form data
 */
export const validateMeetingForm = (formData, requiredFields = []) => {
  const errors = {};
  let isValid = true;
  
  console.log('DEBUG: Validating form data:', formData);
  console.log('DEBUG: Required fields:', requiredFields);
  
  // Check required fields
  requiredFields.forEach(field => {
    if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
      errors[field] = `${field} is required`;
      isValid = false;
    }
  });
  
  // Validate specific fields
  if (formData.title && formData.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
    isValid = false;
  }
  
  if (formData.datetime) {
    const meetingDate = new Date(formData.datetime);
    const now = new Date();
    
    if (meetingDate <= now) {
      errors.datetime = 'Meeting time must be in the future';
      isValid = false;
    }
    
    // Check if more than 1 year in future
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    if (meetingDate > oneYearFromNow) {
      errors.datetime = 'Meeting time cannot be more than 1 year in the future';
      isValid = false;
    }
  }
  
  if (formData.duration) {
    const duration = parseInt(formData.duration);
    if (isNaN(duration) || duration < 15 || duration > 480) {
      errors.duration = 'Duration must be between 15 minutes and 8 hours';
      isValid = false;
    }
  }
  
  if (formData.invitationLink && !isValidInvitationLink(formData.invitationLink)) {
    errors.invitationLink = 'Invalid invitation link format';
    isValid = false;
  }
  
  console.log('DEBUG: Validation result:', { isValid, errors });
  
  return { isValid, errors };
};

/**
 * Check if invitation link is valid
 */
export const isValidInvitationLink = (link) => {
  try {
    const url = new URL(link);
    const params = new URLSearchParams(url.search);
    
    // Must have room parameter
    return params.has('room') && params.get('room').trim() !== '';
  } catch (error) {
    return false;
  }
};

/**
 * Calculate attendance percentage
 */
export const calculateAttendancePercentage = (attendedMinutes, totalMinutes) => {
  try {
    if (!totalMinutes || totalMinutes <= 0) return 0;
    if (!attendedMinutes || attendedMinutes <= 0) return 0;
    
    const percentage = (attendedMinutes / totalMinutes) * 100;
    return Math.min(100, Math.round(percentage));
  } catch (error) {
    console.error('ERROR: Failed to calculate attendance percentage:', error);
    return 0;
  }
};

/**
 * Calculate total attendance time from sessions
 */
export const calculateTotalAttendanceTime = (sessions) => {
  try {
    if (!sessions || !Array.isArray(sessions)) return 0;
    
    return sessions.reduce((total, session) => {
      const duration = session.durationMinutes || session.duration || 0;
      return total + (typeof duration === 'number' ? duration : 0);
    }, 0);
  } catch (error) {
    console.error('ERROR: Failed to calculate total attendance time:', error);
    return 0;
  }
};

/**
 * Get user's timezone
 */
export const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('WARN: Could not determine user timezone, using UTC');
    return 'UTC';
  }
};

/**
 * Convert UTC time to user's local time
 */
export const convertToLocalTime = (utcTime) => {
  try {
    if (!utcTime) return null;
    
    let date;
    if (typeof utcTime === 'string') {
      date = parseISO(utcTime);
    } else {
      date = new Date(utcTime);
    }
    
    if (!isValid(date)) {
      console.warn('WARN: Invalid date in convertToLocalTime:', utcTime);
      return null;
    }
    
    return date;
  } catch (error) {
    console.error('ERROR: Failed to convert to local time:', error);
    return null;
  }
};

/**
 * Check if user is online
 */
export const isUserOnline = () => {
  return navigator.onLine;
};

/**
 * Debounce function for API calls
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for frequent events
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get meeting status display text
 */
export const getMeetingStatusDisplay = (status) => {
  const statusMap = {
    scheduled: 'Scheduled',
    active: 'Active',
    ended: 'Ended',
    cancelled: 'Cancelled'
  };
  
  return statusMap[status] || 'Unknown';
};

/**
 * Check if meeting can be joined
 */
export const canJoinMeeting = (meeting) => {
  if (!meeting) return false;
  
  // Can join if meeting is active
  if (meeting.status === 'active') return true;
  
  // Can join if meeting is scheduled and within 15 minutes of start time
  if (meeting.status === 'scheduled' && meeting.datetime) {
    const meetingTime = new Date(meeting.datetime);
    const now = new Date();
    const fifteenMinutesBefore = new Date(meetingTime.getTime() - (15 * 60 * 1000));
    
    return now >= fifteenMinutesBefore;
  }
  
  return false;
};

/**
 * Get time until meeting starts
 */
export const getTimeUntilMeeting = (datetime) => {
  try {
    if (!datetime) return null;
    
    const meetingTime = new Date(datetime);
    const now = new Date();
    const diff = meetingTime.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  } catch (error) {
    console.error('ERROR: Failed to calculate time until meeting:', error);
    return null;
  }
};

/**
 * Generate meeting summary
 */
export const generateMeetingSummary = (meeting, attendanceData = []) => {
  try {
    const summary = {
      id: meeting.id,
      title: meeting.title,
      datetime: meeting.datetime,
      duration: meeting.duration,
      status: meeting.status,
      courseInfo: {
        id: meeting.courseId,
        name: meeting.courseName,
        code: meeting.courseCode
      },
      attendance: {
        totalSessions: attendanceData.length,
        uniqueAttendees: [...new Set(attendanceData.map(s => s.userId))].length,
        averageDuration: calculateTotalAttendanceTime(attendanceData) / Math.max(1, attendanceData.length)
      }
    };
    
    return summary;
  } catch (error) {
    console.error('ERROR: Failed to generate meeting summary:', error);
    return null;
  }
};

export default {
  MEETING_CONSTANTS,
  generateRoomId,
  parseInvitationLink,
  generateInvitationLink,
  openMeetingInNewTab,
  formatMeetingTime,
  formatDuration,
  getMeetingTypeConfig,
  validateMeetingForm,
  isValidInvitationLink,
  calculateAttendancePercentage,
  calculateTotalAttendanceTime,
  getUserTimezone,
  convertToLocalTime,
  isUserOnline,
  debounce,
  throttle,
  formatFileSize,
  getMeetingStatusDisplay,
  canJoinMeeting,
  getTimeUntilMeeting,
  generateMeetingSummary
};