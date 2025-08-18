import { useState, useEffect, useCallback, useRef } from 'react';
import studentApi from '../Api/studentAssignmentDashboardApi';

// ====================================
// TIME UTILITY FUNCTIONS - FIXED FOR TIMEZONE HANDLING
// ====================================

const timeUtils = {
  /**
   * Get proper due date time combining date and time fields
   * @param {string|Date} dueDate - The due date (UTC midnight)
   * @param {string} dueTime - The due time in HH:mm format (local time)
   * @returns {Date} Combined date-time object in local timezone
   */
  getDueDateTime: (dueDate, dueTime) => {
    if (!dueDate) return null;

    try {
      // Create a date object from the due date (UTC)
      const date = new Date(dueDate);

      // If no specific time provided, use end of day (23:59)
      if (!dueTime) {
        // Set to end of day in local timezone
        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        return localDate;
      }

      // Parse the time string (HH:mm format)
      const [hours, minutes] = dueTime.split(':').map(num => parseInt(num, 10));

      // Create date in local timezone with proper time
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0);

      return localDate;
    } catch (error) {
      console.error('Error parsing due date/time:', error);
      return null;
    }
  },

  /**
   * Check if assignment is overdue
   * @param {string|Date} dueDate - The due date
   * @param {string} dueTime - The due time
   * @returns {boolean} True if overdue
   */
  isOverdue: (dueDate, dueTime) => {
    const dueDateTime = timeUtils.getDueDateTime(dueDate, dueTime);
    if (!dueDateTime) return false;

    const now = new Date();
    return now > dueDateTime;
  },

  /**
   * Get current local time for API requests
   * @returns {Date} Current local time
   */
  getCurrentLocalTime: () => {
    return new Date();
  },

  /**
   * Convert to ISO string maintaining local timezone for backend
   * @param {Date} date - Date to convert
   * @returns {string} ISO string with timezone
   */
  toLocalISOString: (date) => {
    if (!date) return null;
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localTime = new Date(date.getTime() - timezoneOffset);
    return localTime.toISOString();
  }
};

// ====================================
// GRADE UTILITY FUNCTIONS - NEW ADDITION
// ====================================

const gradeUtils = {
  /**
   * Calculate letter grade from percentage
   * @param {number} percentage - Grade percentage
   * @returns {string} Letter grade
   */
  calculateLetterGrade: (percentage) => {
    if (percentage == null || percentage < 0) return 'F';
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  },

  /**
   * Get grade color class based on percentage
   * @param {number} percentage - Grade percentage
   * @returns {string} CSS class name
   */
  getGradeColorClass: (percentage) => {
    if (percentage >= 90) return 'gradeA';
    if (percentage >= 80) return 'gradeB';
    if (percentage >= 70) return 'gradeC';
    if (percentage >= 60) return 'gradeD';
    return 'gradeF';
  },

  /**
   * Get grade status description
   * @param {number} percentage - Grade percentage
   * @returns {string} Status description
   */
  getGradeStatus: (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Good';
    if (percentage >= 70) return 'Satisfactory';
    if (percentage >= 60) return 'Needs Improvement';
    return 'Poor';
  },

  /**
   * Calculate GPA on 4.0 scale
   * @param {number} percentage - Grade percentage
   * @returns {number} GPA value
   */
  calculateGPA: (percentage) => {
    if (percentage >= 97) return 4.0;
    if (percentage >= 93) return 4.0;
    if (percentage >= 90) return 3.7;
    if (percentage >= 87) return 3.3;
    if (percentage >= 83) return 3.0;
    if (percentage >= 80) return 2.7;
    if (percentage >= 77) return 2.3;
    if (percentage >= 73) return 2.0;
    if (percentage >= 70) return 1.7;
    if (percentage >= 67) return 1.3;
    if (percentage >= 63) return 1.0;
    if (percentage >= 60) return 0.7;
    return 0.0;
  }
};

// ====================================
// ASSIGNMENTS HOOKS - FIXED TO MATCH BACKEND
// ====================================

export const useAssignments = (courseId, studentId, filters = {}) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignments = useCallback(async () => {
    if (!courseId || !studentId) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use the student-specific endpoint that includes submission info
      const data = await studentApi.getAssignmentsForStudent(studentId, courseId, filters.status);

      // FIXED: Process assignments with proper time handling
      const processedAssignments = (data || []).map(assignment => {
        // Ensure we have proper time fields
        const processedAssignment = {
          ...assignment,
          // Add computed properties for easier access
          dueDateTime: assignment.dueDateTime || timeUtils.getDueDateTime(assignment.dueDate, assignment.dueTime),
          isOverdue: timeUtils.isOverdue(assignment.dueDate || assignment.dueDateTime, assignment.dueTime)
        };

        return processedAssignment;
      });

      setAssignments(processedAssignments);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch assignments');
      console.error('Error fetching assignments:', err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [courseId, studentId, JSON.stringify(filters)]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return {
    assignments,
    loading,
    error,
    refetch: fetchAssignments
  };
};

export const useAssignment = (assignmentId) => {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!assignmentId) {
        setAssignment(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await studentApi.getAssignment(assignmentId);

        // FIXED: Process assignment with proper time handling
        const processedAssignment = {
          ...data,
          dueDateTime: data.dueDateTime || timeUtils.getDueDateTime(data.dueDate, data.dueTime),
          isOverdue: timeUtils.isOverdue(data.dueDate || data.dueDateTime, data.dueTime)
        };

        setAssignment(processedAssignment);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch assignment');
        console.error('Error fetching assignment:', err);
        setAssignment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  return { assignment, loading, error };
};

export const useUpcomingAssignments = (studentId, courseId, daysAhead = 7) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      if (!studentId) {
        setAssignments([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await studentApi.getUpcomingAssignments(studentId, courseId, daysAhead);

        // FIXED: Filter and process assignments with proper time handling
        const now = timeUtils.getCurrentLocalTime();
        const futureDate = new Date(now.getTime() + (daysAhead * 24 * 60 * 60 * 1000));

        const processedAssignments = (data || []).map(assignment => {
          const dueDateTime = assignment.dueDateTime || timeUtils.getDueDateTime(assignment.dueDate, assignment.dueTime);
          return {
            ...assignment,
            dueDateTime,
            isOverdue: timeUtils.isOverdue(assignment.dueDate || assignment.dueDateTime, assignment.dueTime)
          };
        }).filter(assignment => {
          const dueDateTime = assignment.dueDateTime;
          return dueDateTime && dueDateTime > now && dueDateTime <= futureDate;
        });

        setAssignments(processedAssignments);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch upcoming assignments');
        console.error('Error fetching upcoming assignments:', err);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, [studentId, courseId, daysAhead]);

  return { assignments, loading, error };
};

export const useOverdueAssignments = (studentId, courseId) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverdue = async () => {
      if (!studentId) {
        setAssignments([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await studentApi.getOverdueAssignments(studentId, courseId);

        // FIXED: Filter and process assignments with proper time handling
        const now = timeUtils.getCurrentLocalTime();

        const processedAssignments = (data || []).map(assignment => {
          const dueDateTime = assignment.dueDateTime || timeUtils.getDueDateTime(assignment.dueDate, assignment.dueTime);
          return {
            ...assignment,
            dueDateTime,
            isOverdue: timeUtils.isOverdue(assignment.dueDate || assignment.dueDateTime, assignment.dueTime)
          };
        }).filter(assignment => {
          const dueDateTime = assignment.dueDateTime;
          return dueDateTime && dueDateTime < now;
        });

        setAssignments(processedAssignments);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch overdue assignments');
        console.error('Error fetching overdue assignments:', err);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOverdue();
  }, [studentId, courseId]);

  return { assignments, loading, error };
};

// ====================================
// SUBMISSIONS HOOKS
// ====================================

export const useSubmitAssignment = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitAssignment = useCallback(async (assignmentId, submissionData) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      console.log('Submitting assignment:', assignmentId, submissionData);

      const result = await studentApi.submitAssignment(assignmentId, submissionData);
      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to submit assignment';
      setError(errorMessage);
      console.error('Error submitting assignment:', err);
      throw new Error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    submitAssignment,
    submitting,
    error,
    success,
    reset
  };
};

export const useUpdateSubmission = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateSubmission = useCallback(async (submissionId, updates) => {
    try {
      setUpdating(true);
      setError(null);
      setSuccess(false);

      const result = await studentApi.updateSubmission(submissionId, updates);
      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update submission';
      setError(errorMessage);
      console.error('Error updating submission:', err);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    updateSubmission,
    updating,
    error,
    success,
    reset
  };
};

// ====================================
// ENHANCED DELETE SUBMISSION HOOK
// ====================================

export const useDeleteSubmission = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteSubmission = useCallback(async (submissionId) => {
    try {
      setDeleting(true);
      setError(null);
      setSuccess(false);

      // First check if deletion is allowed
      const permissionCheck = await studentApi.canDeleteSubmission(submissionId);
      if (!permissionCheck.canDelete) {
        throw new Error(permissionCheck.reason || 'Cannot delete this submission');
      }

      // Proceed with deletion
      await studentApi.deleteSubmission(submissionId);
      setSuccess(true);

      console.log('✅ Submission deleted successfully');

    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete submission';
      setError(errorMessage);
      console.error('❌ Error deleting submission:', err);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    deleteSubmission,
    deleting,
    error,
    success,
    reset
  };
};

// ====================================
// DELETE PERMISSION CHECK HOOK
// ====================================

export const useCanDeleteSubmission = (submissionId) => {
  const [canDelete, setCanDelete] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [loading, setLoading] = useState(false);

  const checkDeletePermission = useCallback(async () => {
    if (!submissionId) {
      setCanDelete(false);
      setDeleteReason('No submission ID provided');
      return;
    }

    try {
      setLoading(true);
      const result = await studentApi.canDeleteSubmission(submissionId);
      setCanDelete(result.canDelete);
      setDeleteReason(result.reason || '');
    } catch (error) {
      console.error('Error checking delete permission:', error);
      setCanDelete(false);
      setDeleteReason('Error checking permission');
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    checkDeletePermission();
  }, [checkDeletePermission]);

  return {
    canDelete,
    deleteReason,
    loading,
    recheckPermission: checkDeletePermission
  };
};

export const useStudentSubmissions = (studentId, courseId) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    if (!studentId) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getStudentSubmissions(studentId, courseId);
      setSubmissions(data || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch submissions');
      console.error('Error fetching submissions:', err);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [studentId, courseId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    submissions,
    loading,
    error,
    refetch: fetchSubmissions
  };
};

export const useSubmissionForTask = (studentId, taskId) => {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmission = useCallback(async () => {
    if (!studentId || !taskId) {
      setSubmission(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getStudentSubmissionForTask(studentId, taskId);

      // Handle case where no submission exists
      if (data && data.hasSubmission === false) {
        setSubmission(null);
      } else {
        setSubmission(data);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch submission');
      console.error('Error fetching submission:', err);
      setSubmission(null);
    } finally {
      setLoading(false);
    }
  }, [studentId, taskId]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  return {
    submission,
    loading,
    error,
    refetch: fetchSubmission
  };
};

// ====================================
// SUBMISSION ELIGIBILITY HOOKS
// ====================================

export const useCanSubmit = (taskId, studentId) => {
  const [canSubmit, setCanSubmit] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!taskId || !studentId) {
        setCanSubmit(false);
        setHasSubmitted(false);
        setAttemptCount(0);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await studentApi.canStudentSubmit(taskId, studentId);

        setCanSubmit(data.canSubmit || false);
        setHasSubmitted(data.hasSubmitted || false);
        setAttemptCount(data.attemptCount || 0);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to check submission eligibility');
        console.error('Error checking submission eligibility:', err);
        setCanSubmit(false);
        setHasSubmitted(false);
        setAttemptCount(0);
      } finally {
        setLoading(false);
      }
    };

    checkEligibility();
  }, [taskId, studentId]);

  return {
    canSubmit,
    hasSubmitted,
    attemptCount,
    loading,
    error
  };
};

// ====================================
// COMPREHENSIVE EXAM HOOKS - FIXED TO MATCH BACKEND
// ====================================

export const useExams = (courseId) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExams = useCallback(async () => {
    if (!courseId) {
      setExams([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getExamsByCourse(courseId);
      setExams(data || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch exams');
      console.error('Error fetching exams:', err);
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  return {
    exams,
    loading,
    error,
    refetch: fetchExams
  };
};

export const useExam = (examId) => {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canTake, setCanTake] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) {
        setExam(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch exam details
        const examData = await studentApi.getExam(examId);
        setExam(examData);

        // Check if student can take exam
        const eligibility = await studentApi.checkExamEligibility(examId);
        setCanTake(eligibility.canTake);
        setAttemptCount(eligibility.attemptCount || 0);

      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch exam');
        console.error('Error fetching exam:', err);
        setExam(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  return {
    exam,
    loading,
    error,
    canTake,
    attemptCount
  };
};

// ====================================
// COMPREHENSIVE EXAM ATTEMPT HOOK - FIXED FOR SHUFFLED OPTIONS
// ====================================

export const useExamAttempt = () => {
  // Exam state
  const [exam, setExam] = useState(null);
  const [examResponse, setExamResponse] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examInProgress, setExamInProgress] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResults, setExamResults] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  
  // FIXED: Store shuffled options mapping properly
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState({});

  // Navigation state
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  // Refs for timers and auto-save
  const timerRef = useRef(null);
  const autoSaveRef = useRef(null);
  const lastSaveRef = useRef(Date.now());
  const examStartTimeRef = useRef(null);

  // ====================================
  // TIMER FUNCTIONS
  // ====================================

  const startTimer = useCallback((durationMinutes) => {
    const totalSeconds = durationMinutes * 60;
    setTimeRemaining(totalSeconds);
    examStartTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit when time expires
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // ====================================
  // FIXED SHUFFLE FUNCTIONS - PROPER MAPPING
  // ====================================

  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const prepareExamQuestions = useCallback((examData) => {
    console.log('🔀 === PREPARING EXAM QUESTIONS ===');
    console.log('Original exam data:', examData);
    
    let questions = [...(examData.questions || [])];
    const optionsMapping = {};

    // Shuffle questions if enabled
    if (examData.shuffleQuestions) {
      questions = shuffleArray(questions);
      console.log('🔀 Questions shuffled');
    }

    // FIXED: Shuffle options with proper mapping
    if (examData.shuffleOptions) {
      questions.forEach(question => {
        if (question.type === 'multiple-choice' && question.options && question.options.length > 0) {
          console.log(`🔀 Processing question ${question.id} options:`, question.options);
          
          // Create array of option objects with original indices
          const originalOptions = question.options.map((option, index) => ({
            text: option,
            originalIndex: index
          }));
          
          // Shuffle the option objects
          const shuffledOptionObjects = shuffleArray(originalOptions);
          
          // Extract just the text for display
          const shuffledOptions = shuffledOptionObjects.map(opt => opt.text);
          
          // Create mapping from shuffled index to original index
          const indexMapping = {};
          const reverseMapping = {};
          
          shuffledOptionObjects.forEach((optionObj, shuffledIndex) => {
            indexMapping[shuffledIndex] = optionObj.originalIndex;
            reverseMapping[optionObj.originalIndex] = shuffledIndex;
          });
          
          optionsMapping[question.id] = {
            shuffledOptions,
            indexMapping, // shuffled index -> original index
            reverseMapping, // original index -> shuffled index
            originalOptions: question.options,
            originalCorrectIndex: question.correctAnswerIndex
          };
          
          console.log(`🔀 Question ${question.id} shuffled mapping:`, optionsMapping[question.id]);
        }
      });
    }

    setShuffledQuestions(questions);
    setShuffledOptionsMap(optionsMapping);
    
    console.log('✅ Questions prepared. Shuffled options map:', optionsMapping);
    return questions;
  }, [shuffleArray]);

  // ====================================
  // BROWSER SECURITY (SAFE BROWSER MODE)
  // ====================================

  const enterFullscreen = useCallback(async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        console.log('📱 Entered fullscreen mode');
      }
    } catch (err) {
      console.warn('⚠️ Could not enter fullscreen:', err);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
        console.log('📱 Exited fullscreen mode');
      }
    } catch (err) {
      console.warn('⚠️ Could not exit fullscreen:', err);
    }
  }, []);

  // Monitor for fullscreen exit (security check)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);

      if (exam?.requireSafeBrowser && examInProgress && !isCurrentlyFullscreen) {
        console.warn('⚠️ Fullscreen exited during secure exam');
        // Could implement warning or auto-submit here
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [exam, examInProgress]);

  // ====================================
  // AUTO-SAVE FUNCTIONALITY
  // ====================================

  const saveProgress = useCallback(async (force = false) => {
    if (!examInProgress || !examResponse) return;

    const now = Date.now();
    const timeSinceLastSave = now - lastSaveRef.current;

    // Only save if forced or enough time has passed
    if (!force && timeSinceLastSave < 10000) return; // 10 seconds minimum

    try {
      const timeSpent = Math.floor((now - examStartTimeRef.current) / 1000);

      // FIXED: Send original indices to backend
      const answersToSave = {};
      Object.entries(answers).forEach(([questionId, answer]) => {
        const mapping = shuffledOptionsMap[questionId];
        if (mapping && typeof answer === 'number') {
          // Convert shuffled index back to original index
          answersToSave[questionId] = mapping.indexMapping[answer];
          console.log(`💾 Converting answer for ${questionId}: shuffled ${answer} -> original ${mapping.indexMapping[answer]}`);
        } else {
          // For non-shuffled questions or text answers
          answersToSave[questionId] = answer;
        }
      });

      await studentApi.saveExamProgress({
        examId: exam.id,
        answers: answersToSave,
        timeSpent
      });

      lastSaveRef.current = now;
      console.log('💾 Progress saved automatically with answers:', answersToSave);
    } catch (err) {
      console.error('❌ Auto-save failed:', err);
    }
  }, [examInProgress, examResponse, answers, exam, shuffledOptionsMap]);

  // Auto-save timer
  useEffect(() => {
    if (autoSaveEnabled && examInProgress) {
      autoSaveRef.current = setInterval(() => {
        saveProgress();
      }, 30000); // Save every 30 seconds

      return () => {
        if (autoSaveRef.current) {
          clearInterval(autoSaveRef.current);
        }
      };
    }
  }, [autoSaveEnabled, examInProgress, saveProgress]);

  // ====================================
  // EXAM LIFECYCLE FUNCTIONS - FIXED FOR SHUFFLED OPTIONS
  // ====================================

  const startExam = useCallback(async (examId) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🎯 Starting exam:', examId);

      // Get exam details first
      const examData = await studentApi.getExam(examId);

      // Check if exam requires safe browser mode
      if (examData.requireSafeBrowser) {
        await enterFullscreen();
      }

      // Start the exam attempt
      const response = await studentApi.startExam(examId);

      // Extract exam data from response
      const examFromResponse = response.exam || examData;

      // FIXED: Prepare questions with proper shuffling
      const preparedQuestions = prepareExamQuestions(examFromResponse);

      setExam({ ...examFromResponse, questions: preparedQuestions });
      setExamResponse(response);
      setExamInProgress(true);
      setExamSubmitted(false);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setVisitedQuestions(new Set([0]));
      setFlaggedQuestions(new Set());

      // Start timer if exam has duration limit
      if (examFromResponse.duration && examFromResponse.showTimer !== false) {
        startTimer(examFromResponse.duration);
      }

      console.log('✅ Exam started successfully');

    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to start exam');
      console.error('❌ Failed to start exam:', err);
    } finally {
      setLoading(false);
    }
  }, [enterFullscreen, prepareExamQuestions, startTimer]);

  const submitExam = useCallback(async (showAlert = true) => {
    if (!examInProgress || !examResponse) {
      throw new Error('No active exam to submit');
    }

    if (showAlert && !window.confirm('Are you sure you want to submit your exam? You cannot change your answers after submission.')) {
      return null;
    }

    try {
      setLoading(true);
      stopTimer();

      const timeSpent = Math.floor((Date.now() - examStartTimeRef.current) / 1000);

      // FIXED: Convert shuffled answers back to original indices before submission
      const answersToSubmit = {};
      Object.entries(answers).forEach(([questionId, answer]) => {
        const mapping = shuffledOptionsMap[questionId];
        if (mapping && typeof answer === 'number') {
          // Convert shuffled index back to original index
          answersToSubmit[questionId] = mapping.indexMapping[answer];
          console.log(`📤 Converting final answer for ${questionId}: shuffled ${answer} -> original ${mapping.indexMapping[answer]}`);
        } else {
          // For non-shuffled questions or text answers
          answersToSubmit[questionId] = answer;
        }
      });

      console.log('📤 Submitting exam with converted answers:', answersToSubmit);

      const result = await studentApi.submitExam({
        examId: exam.id,
        answers: answersToSubmit,
        timeSpent
      });

      setExamSubmitted(true);
      setExamInProgress(false);

      // Exit fullscreen if was in safe browser mode
      if (exam.requireSafeBrowser) {
        await exitFullscreen();
      }

      // Show results immediately if exam allows it
      if (exam.showResults && result.graded && result.results) {
        setExamResults(result.results);
        setShowResults(true);
        console.log('📊 Showing exam results immediately');
      }

      console.log('✅ Exam submitted successfully');
      return result;

    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to submit exam');
      console.error('❌ Failed to submit exam:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [examInProgress, examResponse, answers, exam, stopTimer, exitFullscreen, shuffledOptionsMap]);

  const handleAutoSubmit = useCallback(async () => {
    if (!exam?.autoSubmit || !examInProgress) return;

    console.log('⏰ Auto-submitting exam due to time expiry');
    try {
      await submitExam(false); // Don't show confirmation for auto-submit
    } catch (err) {
      console.error('❌ Auto-submit failed:', err);
    }
  }, [exam, examInProgress, submitExam]);

  // ====================================
  // FIXED ANSWER MANAGEMENT - PROPER SHUFFLED HANDLING
  // ====================================

  const updateAnswer = useCallback((questionId, answer) => {
    setAnswers(prev => {
      const updated = { ...prev, [questionId]: answer };
      console.log(`✏️ Updated answer for question ${questionId}:`, answer);
      
      // Log shuffling info for debugging
      const mapping = shuffledOptionsMap[questionId];
      if (mapping && typeof answer === 'number') {
        console.log(`🔀 Shuffled answer ${answer} maps to original ${mapping.indexMapping[answer]}`);
      }

      // Trigger auto-save after answer change
      setTimeout(() => saveProgress(), 1000);

      return updated;
    });
  }, [saveProgress, shuffledOptionsMap]);

  const clearAnswer = useCallback((questionId) => {
    setAnswers(prev => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  }, []);

  // ====================================
  // NAVIGATION FUNCTIONS
  // ====================================

  const goToQuestion = useCallback((index) => {
    if (!exam?.allowNavigation && index !== currentQuestionIndex + 1) {
      console.warn('⚠️ Navigation restricted by exam settings');
      return;
    }

    if (index >= 0 && index < shuffledQuestions.length) {
      setCurrentQuestionIndex(index);
      setVisitedQuestions(prev => new Set([...prev, index]));
    }
  }, [exam, currentQuestionIndex, shuffledQuestions.length]);

  const goToNextQuestion = useCallback(() => {
    goToQuestion(currentQuestionIndex + 1);
  }, [currentQuestionIndex, goToQuestion]);

  const goToPreviousQuestion = useCallback(() => {
    goToQuestion(currentQuestionIndex - 1);
  }, [currentQuestionIndex, goToQuestion]);

  const flagQuestion = useCallback((questionIndex) => {
    setFlaggedQuestions(prev => {
      const updated = new Set(prev);
      if (updated.has(questionIndex)) {
        updated.delete(questionIndex);
      } else {
        updated.add(questionIndex);
      }
      return updated;
    });
  }, []);

  // ====================================
  // EXAM PROGRESS CALCULATIONS - FIXED FOR INDEX 0
  // ====================================

  const getProgress = useCallback(() => {
    const totalQuestions = shuffledQuestions.length;
    
    // FIXED: Properly count answered questions including index 0
    const answeredQuestions = Object.keys(answers).filter(questionId => {
      const answer = answers[questionId];
      // Consider answered if value exists and is not null/undefined/empty string
      return answer !== undefined && answer !== null && answer !== '';
    }).length;
    
    const visitedCount = visitedQuestions.size;

    return {
      totalQuestions,
      answeredQuestions,
      visitedQuestions: visitedCount,
      percentage: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
      visitedPercentage: totalQuestions > 0 ? Math.round((visitedCount / totalQuestions) * 100) : 0
    };
  }, [shuffledQuestions.length, answers, visitedQuestions]);

  const getQuestionStatus = useCallback((questionIndex) => {
    const question = shuffledQuestions[questionIndex];
    if (!question) return 'unavailable';

    // FIXED: Properly check if question is answered including index 0
    const answer = answers[question.id];
    const isAnswered = answer !== undefined && answer !== null && answer !== '';
    
    const isVisited = visitedQuestions.has(questionIndex);
    const isFlagged = flaggedQuestions.has(questionIndex);
    const isCurrent = questionIndex === currentQuestionIndex;

    if (isCurrent) return 'current';
    if (isFlagged) return 'flagged';
    if (isAnswered) return 'answered';
    if (isVisited) return 'visited';
    return 'unvisited';
  }, [shuffledQuestions, answers, visitedQuestions, flaggedQuestions, currentQuestionIndex]);

  // ====================================
  // RESULTS AND GRADING - FIXED FOR SHUFFLED OPTIONS
  // ====================================

  const getExamResults = useCallback(async (responseId) => {
    try {
      const results = await studentApi.getStudentExamResults(responseId);
      setExamResults(results);
      return results;
    } catch (err) {
      console.error('❌ Failed to fetch exam results:', err);
      throw err;
    }
  }, []);

  const getDetailedResults = useCallback(() => {
    if (!examResults || !exam) return null;

    // If we already have detailed results from backend, return them
    if (examResults.questionResults) {
      return examResults;
    }

    // Otherwise, construct detailed results from available data
    const questionResults = shuffledQuestions.map((question, index) => {
      const studentAnswer = answers[question.id];
      const questionScore = examResults.questionScores?.[question.id] || 0;
      const maxPoints = question.points || 0;

      let isCorrect = false;
      let correctAnswer = null;
      let displayAnswer = studentAnswer;

      // FIXED: Handle shuffled options in results display
      if (question.type === 'multiple-choice') {
        const mapping = shuffledOptionsMap[question.id];
        
        if (mapping) {
          // Convert student's shuffled answer to display text
          if (typeof studentAnswer === 'number') {
            displayAnswer = mapping.shuffledOptions[studentAnswer];
          }
          
          // Show original correct answer
          if (question.correctAnswerIndex !== undefined && question.options) {
            correctAnswer = question.options[question.correctAnswerIndex];
          }
          
          // Check correctness using original mapping
          if (typeof studentAnswer === 'number') {
            const originalIndex = mapping.indexMapping[studentAnswer];
            isCorrect = originalIndex === question.correctAnswerIndex;
          }
        } else {
          // Non-shuffled question
          if (typeof studentAnswer === 'number') {
            displayAnswer = question.options?.[studentAnswer];
            correctAnswer = question.options?.[question.correctAnswerIndex];
            isCorrect = studentAnswer === question.correctAnswerIndex;
          }
        }
      } else if (question.type === 'true-false') {
        correctAnswer = question.correctAnswer;
        isCorrect = studentAnswer?.toLowerCase() === correctAnswer?.toLowerCase();
      } else if (question.type === 'short-answer' || question.type === 'text') {
        isCorrect = questionScore > 0;
        correctAnswer = question.acceptableAnswers?.[0] || question.correctAnswer;
      }

      return {
        questionNumber: index + 1,
        question,
        studentAnswer: displayAnswer,
        correctAnswer,
        isCorrect,
        points: questionScore,
        maxPoints,
        percentage: maxPoints > 0 ? Math.round((questionScore / maxPoints) * 100) : 0
      };
    });

    return {
      questionResults,
      totalScore: examResults.totalScore || 0,
      maxScore: examResults.maxScore || 0,
      percentage: examResults.percentage || 0,
      passed: examResults.passed || false,
      timeSpent: examResults.timeSpent || 0,
      submittedAt: examResults.submittedAt
    };
  }, [examResults, exam, shuffledQuestions, answers, shuffledOptionsMap]);

  // ====================================
  // CLEANUP EFFECTS
  // ====================================

  useEffect(() => {
    return () => {
      stopTimer();
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, [stopTimer]);

  // ====================================
  // RETURN OBJECT - FIXED TO INCLUDE PROPER SHUFFLE MAPPING
  // ====================================

  return {
    // Exam state
    exam,
    examResponse,
    examInProgress,
    examSubmitted,
    examResults,
    showResults,

    // Current question and navigation
    currentQuestionIndex,
    shuffledQuestions,
    shuffledOptions: shuffledOptionsMap, // FIXED: Return the proper mapping
    visitedQuestions,
    flaggedQuestions,

    // Answers and progress
    answers,
    updateAnswer,
    clearAnswer,
    getProgress,
    getQuestionStatus,

    // Timer
    timeRemaining,
    formatTime,

    // Navigation
    goToQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    flagQuestion,

    // Exam actions
    startExam,
    submitExam,
    saveProgress,

    // Results
    getExamResults,
    getDetailedResults,

    // UI state
    loading,
    error,
    autoSaveEnabled,
    setAutoSaveEnabled,
    isFullscreen,

    // Security
    enterFullscreen,
    exitFullscreen,

    // Utility
    setError
  };
};

// ====================================
// EXAM HISTORY HOOK - FIXED TO USE BACKEND
// ====================================

export const useExamHistory = (examId, studentId) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!examId || !studentId) {
      setHistory([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await studentApi.getExamAttemptHistory(examId);
      setHistory(data || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch exam history');
      console.error('Error fetching exam history:', err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [examId, studentId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory
  };
};

// ====================================
// EXAM VALIDATION HOOK - FIXED FOR INDEX 0
// ====================================

export const useExamValidation = (exam, answers) => {
  const [validation, setValidation] = useState({
    canSubmit: false,
    requiredQuestionsAnswered: true,
    warnings: []
  });

  useEffect(() => {
    if (!exam || !exam.questions) {
      setValidation({
        canSubmit: false,
        requiredQuestionsAnswered: false,
        warnings: ['No exam data available']
      });
      return;
    }

    const warnings = [];
    let requiredQuestionsAnswered = true;

    // FIXED: Check required questions with proper answer validation including index 0
    const requiredQuestions = exam.questions.filter(q => q.required !== false);
    const unansweredRequired = requiredQuestions.filter(q => {
      const answer = answers[q.id];
      // Consider unanswered if value is undefined, null, or empty string
      return answer === undefined || answer === null || answer === '';
    });

    if (unansweredRequired.length > 0) {
      requiredQuestionsAnswered = false;
      warnings.push(`${unansweredRequired.length} required questions not answered`);
    }

    // FIXED: Check answer completeness with proper validation including index 0
    const totalQuestions = exam.questions.length;
    const answeredQuestions = exam.questions.filter(q => {
      const answer = answers[q.id];
      return answer !== undefined && answer !== null && answer !== '';
    }).length;
    
    const completionRate = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

    if (completionRate < 100) {
      warnings.push(`${totalQuestions - answeredQuestions} questions not answered`);
    }

    setValidation({
      canSubmit: requiredQuestionsAnswered,
      requiredQuestionsAnswered,
      warnings,
      completionRate,
      answeredQuestions,
      totalQuestions
    });
  }, [exam, answers]);

  return validation;
};

// ====================================
// COMPREHENSIVE GRADES HOOKS - COMPLETE IMPLEMENTATION
// ====================================

export const useGrades = (courseId) => {
  const [grades, setGrades] = useState([]);
  const [gradeColumns, setGradeColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGrades = useCallback(async () => {
    if (!courseId) {
      setGrades([]);
      setGradeColumns([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🎯 Fetching grades for course:', courseId);

      const [gradesData, columnsData] = await Promise.all([
        studentApi.getCourseGrades(courseId).catch((err) => {
          console.warn('Failed to fetch course grades:', err);
          return [];
        }),
        studentApi.getGradeColumns(courseId).catch((err) => {
          console.warn('Failed to fetch grade columns:', err);
          return [];
        })
      ]);

      console.log('📊 Fetched grades:', gradesData?.length || 0);
      console.log('📋 Fetched grade columns:', columnsData?.length || 0);

      setGrades(gradesData || []);
      setGradeColumns(columnsData || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch grades');
      console.error('Error fetching grades:', err);
      setGrades([]);
      setGradeColumns([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  return {
    grades,
    gradeColumns,
    loading,
    error,
    refetch: fetchGrades
  };
};

export const useFinalGrade = (studentId, courseId) => {
  const [finalGrade, setFinalGrade] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinalGrade = async () => {
      if (!studentId || !courseId) {
        setFinalGrade(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await studentApi.getFinalGrade(studentId, courseId);
        setFinalGrade(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch final grade');
        console.error('Error fetching final grade:', err);
        setFinalGrade(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFinalGrade();
  }, [studentId, courseId]);

  return { finalGrade, loading, error };
};

// ====================================
// FIXED GRADE CALCULATION HOOKS - MATCHES BACKEND LOGIC
// ====================================

export const useGradeCalculations = (studentId, grades, gradeColumns) => {
  const [calculations, setCalculations] = useState({
    courseGPAs: {},
    overallGPA: 0,
    letterGrades: {},
    completionRates: {},
    weightedAverages: {},
    gradePoints: {}
  });

  const calculateCourseGPA = useCallback((courseId) => {
    if (!grades || !gradeColumns || !studentId) return 0;

    // Find student's grade record for this course
    const studentGrade = grades.find(g => g.studentId === studentId && g.courseId === courseId);
    if (!studentGrade || !studentGrade.grades) return 0;

    // Get grade columns for this course
    const courseColumns = gradeColumns.filter(col => col.courseId === courseId && col.isActive);
    if (courseColumns.length === 0) return 0;

    // FIXED: Calculate total percentage and normalize if > 100%
    const totalPercentageOfAllColumns = courseColumns.reduce((sum, col) => sum + col.percentage, 0);
    
    console.log(`📐 Course ${courseId} total percentage: ${totalPercentageOfAllColumns}%`);

    let totalWeightedScore = 0;
    let totalPercentageOfGradedItems = 0;
    let gradedItemsCount = 0;

    courseColumns.forEach(column => {
      const grade = studentGrade.grades[column.id];
      if (grade != null && grade >= 0) {
        // FIXED: Normalize weight if total > 100%
        const normalizedWeight = totalPercentageOfAllColumns > 100 
          ? (column.percentage / totalPercentageOfAllColumns) * 100
          : column.percentage;

        const weightContribution = (grade * normalizedWeight) / 100;

        totalWeightedScore += weightContribution;
        totalPercentageOfGradedItems += normalizedWeight;
        gradedItemsCount++;

        console.log(`📊 ${column.name}: ${grade}% × ${normalizedWeight.toFixed(2)}% = ${weightContribution.toFixed(2)} points`);
      }
    });

    if (totalPercentageOfGradedItems === 0) return 0;

    // FIXED: Final grade calculation
    const finalGrade = totalWeightedScore;

    // Ensure grade is within valid bounds and round to 2 decimal places
    const boundedGrade = Math.max(0, Math.min(100, finalGrade));
    const roundedGrade = Math.round(boundedGrade * 100) / 100;

    console.log(`🎯 Course ${courseId} final grade: ${roundedGrade}%`);
    return roundedGrade;
  }, [studentId, grades, gradeColumns]);

  const calculateOverallGPA = useCallback((courseGPAs) => {
    const gpas = Object.values(courseGPAs).filter(gpa => gpa > 0);
    if (gpas.length === 0) return 0;
    return Math.round(gpas.reduce((sum, gpa) => sum + gpa, 0) / gpas.length);
  }, []);

  const calculateCompletionRate = useCallback((courseId) => {
    if (!grades || !gradeColumns || !studentId) return 0;

    const studentGrade = grades.find(g => g.studentId === studentId && g.courseId === courseId);
    if (!studentGrade || !studentGrade.grades) return 0;

    const courseColumns = gradeColumns.filter(col => col.courseId === courseId && col.isActive);
    if (courseColumns.length === 0) return 0;

    const completedItems = courseColumns.filter(column => {
      const grade = studentGrade.grades[column.id];
      return grade != null && grade >= 0;
    }).length;

    return Math.round((completedItems / courseColumns.length) * 100);
  }, [studentId, grades, gradeColumns]);

  const calculateWeightedAverage = useCallback((courseId) => {
    if (!grades || !gradeColumns || !studentId) return 0;

    const studentGrade = grades.find(g => g.studentId === studentId && g.courseId === courseId);
    if (!studentGrade || !studentGrade.grades) return 0;

    const courseColumns = gradeColumns.filter(col => col.courseId === courseId && col.isActive);
    if (courseColumns.length === 0) return 0;

    // FIXED: Use the same normalization logic as calculateCourseGPA
    const totalPercentageOfAllColumns = courseColumns.reduce((sum, col) => sum + col.percentage, 0);

    let totalScore = 0;
    let totalWeight = 0;

    courseColumns.forEach(column => {
      const grade = studentGrade.grades[column.id];
      if (grade != null && grade >= 0) {
        // FIXED: Normalize weight if total > 100%
        const normalizedWeight = totalPercentageOfAllColumns > 100 
          ? (column.percentage / totalPercentageOfAllColumns) * 100
          : column.percentage;

        totalScore += grade * (normalizedWeight / 100);
        totalWeight += normalizedWeight / 100;
      }
    });

    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) / 100 : 0;
  }, [studentId, grades, gradeColumns]);

  const calculateGradePoints = useCallback((courseId) => {
    const percentage = calculateCourseGPA(courseId);
    return gradeUtils.calculateGPA(percentage);
  }, [calculateCourseGPA]);

  // Recalculate when dependencies change
  useEffect(() => {
    if (!grades || !gradeColumns || !studentId) {
      setCalculations({
        courseGPAs: {},
        overallGPA: 0,
        letterGrades: {},
        completionRates: {},
        weightedAverages: {},
        gradePoints: {}
      });
      return;
    }

    const uniqueCourseIds = [...new Set(gradeColumns.map(col => col.courseId))];
    const courseGPAs = {};
    const letterGrades = {};
    const completionRates = {};
    const weightedAverages = {};
    const gradePoints = {};

    uniqueCourseIds.forEach(courseId => {
      const gpa = calculateCourseGPA(courseId);
      courseGPAs[courseId] = gpa;
      letterGrades[courseId] = gradeUtils.calculateLetterGrade(gpa);
      completionRates[courseId] = calculateCompletionRate(courseId);
      weightedAverages[courseId] = calculateWeightedAverage(courseId);
      gradePoints[courseId] = calculateGradePoints(courseId);
    });

    const overallGPA = calculateOverallGPA(courseGPAs);

    setCalculations({
      courseGPAs,
      overallGPA,
      letterGrades,
      completionRates,
      weightedAverages,
      gradePoints
    });
  }, [studentId, grades, gradeColumns, calculateCourseGPA, calculateOverallGPA, calculateCompletionRate, calculateWeightedAverage, calculateGradePoints]);

  return {
    ...calculations,
    calculateCourseGPA,
    calculateOverallGPA,
    calculateCompletionRate,
    calculateWeightedAverage,
    calculateGradePoints
  };
};

// ====================================
// GRADE STATISTICS HOOK - NEW ADDITION
// ====================================

export const useGradeStatistics = (studentId, courses, grades, gradeColumns) => {
  const [statistics, setStatistics] = useState({
    totalCourses: 0,
    coursesWithGrades: 0,
    averageCompletion: 0,
    gradeDistribution: {
      A: 0, B: 0, C: 0, D: 0, F: 0
    },
    trends: [],
    gpaStatistics: {
      highest: 0,
      lowest: 100,
      average: 0,
      median: 0
    },
    performanceMetrics: {
      improvingCourses: 0,
      decliningCourses: 0,
      stableCourses: 0
    }
  });

  const { courseGPAs, completionRates } = useGradeCalculations(studentId, grades, gradeColumns);

  useEffect(() => {
    if (!courses || !courseGPAs) return;

    const totalCourses = courses.length;
    const coursesWithGrades = Object.values(courseGPAs).filter(gpa => gpa > 0).length;
    
    const completionValues = Object.values(completionRates);
    const averageCompletion = completionValues.length > 0 
      ? Math.round(completionValues.reduce((sum, rate) => sum + rate, 0) / completionValues.length)
      : 0;

    // Calculate grade distribution
    const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    Object.values(courseGPAs).forEach(gpa => {
      if (gpa >= 90) gradeDistribution.A++;
      else if (gpa >= 80) gradeDistribution.B++;
      else if (gpa >= 70) gradeDistribution.C++;
      else if (gpa >= 60) gradeDistribution.D++;
      else if (gpa > 0) gradeDistribution.F++;
    });

    // Calculate GPA statistics
    const gpas = Object.values(courseGPAs).filter(gpa => gpa > 0);
    const gpaStatistics = {
      highest: gpas.length > 0 ? Math.max(...gpas) : 0,
      lowest: gpas.length > 0 ? Math.min(...gpas) : 0,
      average: gpas.length > 0 ? Math.round(gpas.reduce((sum, gpa) => sum + gpa, 0) / gpas.length) : 0,
      median: gpas.length > 0 ? gpas.sort((a, b) => a - b)[Math.floor(gpas.length / 2)] : 0
    };

    // Performance metrics (placeholder - could be enhanced with historical data)
    const performanceMetrics = {
      improvingCourses: Math.floor(coursesWithGrades * 0.3),
      decliningCourses: Math.floor(coursesWithGrades * 0.1),
      stableCourses: coursesWithGrades - Math.floor(coursesWithGrades * 0.4)
    };

    setStatistics({
      totalCourses,
      coursesWithGrades,
      averageCompletion,
      gradeDistribution,
      trends: [], // Could be implemented with historical data
      gpaStatistics,
      performanceMetrics
    });
  }, [courses, courseGPAs, completionRates]);

  return statistics;
};

// ====================================
// GRADE TRENDS HOOK - NEW ADDITION
// ====================================

export const useGradeTrends = (studentId, courseId, timeframe = '6months') => {
  const [trends, setTrends] = useState({
    gradeHistory: [],
    trendDirection: 'stable', // 'improving', 'declining', 'stable'
    averageImprovement: 0,
    consistency: 0,
    predictions: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculateTrends = async () => {
      if (!studentId) return;

      try {
        setLoading(true);
        // This would fetch historical grade data from the API
        // For now, we'll simulate trend data
        const mockTrendData = {
          gradeHistory: [
            { date: '2024-01-01', grade: 75, assignment: 'Assignment 1' },
            { date: '2024-02-01', grade: 78, assignment: 'Midterm' },
            { date: '2024-03-01', grade: 82, assignment: 'Assignment 2' },
            { date: '2024-04-01', grade: 85, assignment: 'Final Project' }
          ],
          trendDirection: 'improving',
          averageImprovement: 3.3,
          consistency: 85,
          predictions: [
            { nextAssignment: 'Final Exam', predictedGrade: 87 }
          ]
        };

        setTrends(mockTrendData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    calculateTrends();
  }, [studentId, courseId, timeframe]);

  return { trends, loading, error };
};

// ====================================
// GRADE ANALYTICS HOOK - NEW ADDITION
// ====================================

export const useGradeAnalytics = (studentId, grades, gradeColumns) => {
  const [analytics, setAnalytics] = useState({
    strengthAreas: [],
    improvementAreas: [],
    recommendations: [],
    comparisons: {
      classAverage: 0,
      percentile: 0
    },
    riskAssessment: {
      atRiskCourses: [],
      riskLevel: 'low' // 'low', 'medium', 'high'
    }
  });

  const { courseGPAs } = useGradeCalculations(studentId, grades, gradeColumns);

  useEffect(() => {
    if (!courseGPAs || Object.keys(courseGPAs).length === 0) return;

    // Analyze performance by category
    const categoryPerformance = {};
    
    if (gradeColumns) {
      gradeColumns.forEach(column => {
        if (!categoryPerformance[column.type]) {
          categoryPerformance[column.type] = [];
        }
        
        const grade = grades?.find(g => g.studentId === studentId)?.grades[column.id];
        if (grade != null) {
          categoryPerformance[column.type].push(grade);
        }
      });
    }

    // Calculate averages by category
    const categoryAverages = {};
    Object.keys(categoryPerformance).forEach(category => {
      const scores = categoryPerformance[category];
      if (scores.length > 0) {
        categoryAverages[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      }
    });

    // Identify strengths and improvement areas
    const strengthAreas = Object.entries(categoryAverages)
      .filter(([_, avg]) => avg >= 85)
      .map(([category, avg]) => ({ category, average: Math.round(avg) }))
      .sort((a, b) => b.average - a.average);

    const improvementAreas = Object.entries(categoryAverages)
      .filter(([_, avg]) => avg < 75)
      .map(([category, avg]) => ({ category, average: Math.round(avg) }))
      .sort((a, b) => a.average - b.average);

    // Generate recommendations
    const recommendations = [];
    if (improvementAreas.length > 0) {
      recommendations.push({
        type: 'improvement',
        message: `Focus on improving ${improvementAreas[0].category} performance`,
        priority: 'high'
      });
    }
    
    if (strengthAreas.length > 0) {
      recommendations.push({
        type: 'strength',
        message: `Continue excelling in ${strengthAreas[0].category}`,
        priority: 'medium'
      });
    }

    // Risk assessment
    const atRiskCourses = Object.entries(courseGPAs)
      .filter(([_, gpa]) => gpa < 70)
      .map(([courseId, gpa]) => ({ courseId, gpa }));

    const riskLevel = atRiskCourses.length === 0 ? 'low' : 
                     atRiskCourses.length <= 2 ? 'medium' : 'high';

    setAnalytics({
      strengthAreas,
      improvementAreas,
      recommendations,
      comparisons: {
        classAverage: 78, // Mock data - would come from API
        percentile: 75 // Mock data - would come from API
      },
      riskAssessment: {
        atRiskCourses,
        riskLevel
      }
    });
  }, [studentId, courseGPAs, grades, gradeColumns]);

  return analytics;
};

// ====================================
// COURSE PERFORMANCE HOOK - NEW ADDITION
// ====================================

export const useCoursePerformance = (studentId, courseId) => {
  const [performance, setPerformance] = useState({
    currentGrade: 0,
    letterGrade: 'F',
    rank: 0,
    improvement: 0,
    categoryBreakdown: [],
    upcomingAssignments: [],
    recommendations: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoursePerformance = async () => {
      if (!studentId || !courseId) return;

      try {
        setLoading(true);
        
        // This would typically fetch from multiple API endpoints
        const [gradeData, assignmentData] = await Promise.all([
          studentApi.getFinalGrade(studentId, courseId).catch(() => null),
          studentApi.getUpcomingAssignments(studentId, courseId, 14).catch(() => [])
        ]);

        const currentGrade = gradeData?.finalGrade || 0;
        const letterGrade = gradeUtils.calculateLetterGrade(currentGrade);

        setPerformance({
          currentGrade: Math.round(currentGrade),
          letterGrade,
          rank: Math.floor(Math.random() * 50) + 1, // Mock rank
          improvement: Math.floor(Math.random() * 10) - 5, // Mock improvement
          categoryBreakdown: [], // Would be calculated from grade columns
          upcomingAssignments: assignmentData.slice(0, 5),
          recommendations: [
            {
              type: 'study',
              message: 'Review recent lecture materials',
              priority: 'medium'
            }
          ]
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursePerformance();
  }, [studentId, courseId]);

  return { performance, loading, error };
};

// ====================================
// COURSES HOOKS - FIXED TO USE BACKEND
// ====================================

export const useEnrolledCourses = (studentId) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!studentId) {
        setCourses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('🎓 Fetching enrolled courses for student:', studentId);
        const data = await studentApi.getEnrolledCourses(studentId);
        console.log('✅ Enrolled courses fetched:', data?.length || 0);
        setCourses(data || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch enrolled courses');
        console.error('Error fetching enrolled courses:', err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [studentId]);

  return { courses, loading, error };
};

export const useCourse = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setCourse(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await studentApi.getCourse(courseId);
        setCourse(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch course');
        console.error('Error fetching course:', err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  return { course, loading, error };
};

// ====================================
// DASHBOARD HOOKS (Enhanced implementations)
// ====================================

export const useDashboardData = (studentId, courseId) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!studentId) {
      setDashboardData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch multiple dashboard data sources
      const [analytics, recentActivity, upcomingDeadlines, examSummary] = await Promise.all([
        studentApi.getDashboardAnalytics(studentId, courseId).catch(() => null),
        studentApi.getRecentActivity(studentId, 10).catch(() => []),
        studentApi.getUpcomingDeadlines(studentId, 7).catch(() => []),
        studentApi.getExamDashboardSummary().catch(() => null)
      ]);

      setDashboardData({
        analytics,
        recentActivity: recentActivity || [],
        upcomingDeadlines: upcomingDeadlines || [],
        examSummary: examSummary || {}
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  }, [studentId, courseId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboardData
  };
};

// ====================================
// FILE MANAGEMENT HOOKS
// ====================================

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = useCallback(async (file, context = 'submission') => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      // Simulate progress for demo (replace with actual progress tracking)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await studentApi.uploadFile(file, context);

      clearInterval(progressInterval);
      setUploadProgress(100);

      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to upload file';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, []);

  return {
    uploadFile,
    uploading,
    error,
    uploadProgress
  };
};

// ====================================
// NOTIFICATIONS HOOKS - FIXED TO USE BACKEND
// ====================================

export const useNotifications = (studentId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!studentId) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [allNotifications, unreadNotifications] = await Promise.all([
        studentApi.getNotifications(studentId, false).catch(() => []),
        studentApi.getNotifications(studentId, true).catch(() => [])
      ]);

      setNotifications(allNotifications || []);
      setUnreadCount((unreadNotifications || []).length);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await studentApi.markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await studentApi.markAllNotificationsRead(studentId);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, [studentId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};

// ====================================
// UTILITY HOOKS
// ====================================

// Debounce hook for search functionality
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ====================================
// COMBINED DASHBOARD HOOK - COMPLETE WITH GRADES AND ALL NEW FUNCTIONS
// ====================================

export const useStudentDashboard = (studentId, selectedCourse) => {
  const { courses, loading: coursesLoading, error: coursesError } = useEnrolledCourses(studentId);
  const { assignments, loading: assignmentsLoading, error: assignmentsError } = useAssignments(selectedCourse, studentId, {});
  const { exams, loading: examsLoading, error: examsError } = useExams(selectedCourse);
  const { grades, gradeColumns, loading: gradesLoading, error: gradesError } = useGrades(selectedCourse);
  const { dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboardData(studentId, selectedCourse);
  const { notifications, unreadCount, loading: notificationsLoading, error: notificationsError } = useNotifications(studentId);

  // Grade calculations and analytics
  const gradeCalculations = useGradeCalculations(studentId, grades, gradeColumns);
  const gradeStatistics = useGradeStatistics(studentId, courses, grades, gradeColumns);
  const gradeAnalytics = useGradeAnalytics(studentId, grades, gradeColumns);
  const gradeTrends = useGradeTrends(studentId, selectedCourse);
  const coursePerformance = useCoursePerformance(studentId, selectedCourse);

  // Combine loading states
  const loading = coursesLoading || assignmentsLoading || examsLoading || gradesLoading || dashboardLoading || notificationsLoading;

  // Combine errors (show first non-null error)
  const error = coursesError || assignmentsError || examsError || gradesError || dashboardError || notificationsError;

  return {
    // Data
    courses: courses || [],
    assignments: assignments || [],
    exams: exams || [],
    grades: grades || [],
    gradeColumns: gradeColumns || [],
    dashboardData,
    notifications: notifications || [],
    unreadCount: unreadCount || 0,

    // Grade calculations and analytics
    gradeCalculations,
    gradeStatistics,
    gradeAnalytics,
    gradeTrends,
    coursePerformance,

    // State
    loading,
    error,

    // Helper functions
    selectedCourse,
    studentId,

    // Utility functions
    timeUtils,
    gradeUtils
  };
};

// ====================================
// EXPORT ALL HOOKS AND UTILITIES
// ====================================

export default {
  // Assignment hooks
  useAssignments,
  useAssignment,
  useUpcomingAssignments,
  useOverdueAssignments,
  
  // Submission hooks
  useSubmitAssignment,
  useUpdateSubmission,
  useDeleteSubmission,
  useCanDeleteSubmission,
  useStudentSubmissions,
  useSubmissionForTask,
  useCanSubmit,
  
  // Exam hooks
  useExams,
  useExam,
  useExamAttempt,
  useExamHistory,
  useExamValidation,
  
  // Grade hooks
  useGrades,
  useFinalGrade,
  useGradeCalculations,
  useGradeStatistics,
  useGradeAnalytics,
  useGradeTrends,
  useCoursePerformance,
  
  // Course hooks
  useEnrolledCourses,
  useCourse,
  
  // Dashboard hooks
  useDashboardData,
  useStudentDashboard,
  
  // File and notification hooks
  useFileUpload,
  useNotifications,
  
  // Utility hooks
  useDebounce,
  
  // Utility functions
  timeUtils,
  gradeUtils
};