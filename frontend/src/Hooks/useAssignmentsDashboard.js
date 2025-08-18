/**
 * Complete Enhanced Custom Hook for Lecturer Dashboard - WITH ENHANCED EXAM RESPONSE GRADING
 * File: src/Hooks/useAssignmentsDashboard.js
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import * as api from '../Api/AssignmentsDashboardAPI';

// Utility functions
const calculateGradePercentage = (student, columns) => {
  if (!student.grades || !Array.isArray(columns) || columns.length === 0) {
    return 0;
  }

  let totalWeightedScore = 0;
  let totalPercentage = 0;

  columns.forEach(column => {
    const grade = student.grades[column.id];
    const percentage = column.percentage || 0;
    
    if (grade !== null && grade !== undefined && !isNaN(grade)) {
      totalWeightedScore += (parseFloat(grade) * percentage) / 100;
      totalPercentage += percentage;
    }
  });

  if (totalPercentage === 0) return 0;
  return Math.round((totalWeightedScore / totalPercentage) * 100 * 100) / 100;
};

const validateGradeColumn = (columnData) => {
  return columnData.name && 
         columnData.name.trim() !== '' && 
         columnData.type && 
         typeof columnData.percentage === 'number' && 
         columnData.percentage >= 0 && 
         columnData.percentage <= 100;
};

export const useLecturerDashboard = () => {
  // Navigation state
  const [activeTab, setActiveTab] = useState('grades');
  const [selectedCourse, setSelectedCourseState] = useState(null);
  const [selectedAssignmentForSubmissions, setSelectedAssignmentForSubmissions] = useState(null);
  const [selectedExamForPreview, setSelectedExamForPreview] = useState(null);
  const [selectedExamForResponses, setSelectedExamForResponses] = useState(null);
  const [selectedExamForGrading, setSelectedExamForGrading] = useState(null);
  const [editingExam, setEditingExam] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  
  // UI state
  const [showColumnForm, setShowColumnForm] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [examResponsesLoading, setExamResponsesLoading] = useState(false);
  const [examLoading, setExamLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Data state
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [exams, setExams] = useState([]);
  const [examResponses, setExamResponses] = useState([]);
  const [gradeColumns, setGradeColumns] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // ENHANCED Form state for assignments with comprehensive file handling
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    type: 'homework',
    dueDate: '',
    dueTime: '',
    maxPoints: 100,
    instructions: '',
    priority: 'medium',
    difficulty: 'medium',
    category: 'individual',
    allowSubmissions: true,
    allowLateSubmissions: false,
    latePenaltyPerDay: 0,
    visibleToStudents: true,
    requiresSubmission: true,
    maxAttempts: 1,
    estimatedDuration: null,
    tags: [],
    prerequisiteTasks: [],
    // ENHANCED file handling with complete state management
    file: null,
    fileUrl: '',
    fileName: '',
    fileSize: 0,
    hasAttachment: false,
    fileType: '',
    uploadProgress: 0,
    isUploading: false
  });

  // ENHANCED Form state for exams
  const [newExam, setNewExam] = useState({
    title: '',
    description: '',
    instructions: '',
    duration: 60,
    startTime: '',
    endTime: '',
    publishTime: '',
    maxAttempts: 1,
    showResults: true,
    shuffleQuestions: false,
    shuffleOptions: false,
    allowNavigation: true,
    showTimer: true,
    autoSubmit: true,
    requireSafeBrowser: false,
    visibleToStudents: false,
    passPercentage: 60.0,
    questions: []
  });

  // Other form states
  const [newColumn, setNewColumn] = useState({
    name: '',
    type: 'assignment',
    percentage: '',
    maxPoints: 100
  });

  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    studentId: ''
  });

  // Editing states
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);

  // Batch operation states
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]);
  const [selectedExamResponses, setSelectedExamResponses] = useState(new Set());
  const [bulkGrade, setBulkGrade] = useState('');
  const [bulkFeedback, setBulkFeedback] = useState('');

  // ENHANCED: Manual grading modal state
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [selectedResponseForGrading, setSelectedResponseForGrading] = useState(null);
  const [gradingModalMode, setGradingModalMode] = useState('view');
  const [gradingLoading, setGradingLoading] = useState(false);

  // ENHANCED: File management state
  const [fileOperationInProgress, setFileOperationInProgress] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState({});

  // Enhanced error handling with stable callback
  const handleApiErrorCallback = useCallback((error) => {
    console.error('API Error:', error);
    
    if (error.status === 401) {
      setError('Session expired. Please log in again.');
    } else if (error.status === 403) {
      setError('You don\'t have permission to perform this action.');
    } else if (error.status === 404) {
      setError('The requested resource was not found.');
    } else if (error.status >= 500) {
      setError('Server error. Please try again later.');
    } else {
      setError(error.message || 'An unexpected error occurred.');
    }
  }, []);

  // Enhanced course selection with proper dependencies
  const setSelectedCourse = useCallback((courseId) => {
    let courseIdProcessed = courseId;
    if (typeof courseId === 'string' && courseId.trim() !== '') {
      courseIdProcessed = courseId.trim();
    } else if (courseId === '' || courseId === null || courseId === undefined) {
      courseIdProcessed = null;
    }
    
    if (courseIdProcessed !== selectedCourse) {
      console.log(`🎯 Course selection changed from "${selectedCourse}" to "${courseIdProcessed}"`);
      setSelectedCourseState(courseIdProcessed);
      
      // Reset dependent selections when course changes
      setSelectedAssignmentForSubmissions(null);
      setSelectedExamForResponses(null);
      setSelectedExamForPreview(null);
      setSelectedExamForGrading(null);
      setEditingExam(null);
      setEditingAssignment(null);
      
      // Clear submissions and exam responses when course changes
      setSubmissions([]);
      setExamResponses([]);
      
      // Clear any existing error messages
      setError(null);
    }
  }, [selectedCourse]);

  // ENHANCED: Fetch course data with improved error handling
  const fetchCourseData = useCallback(async (courseId) => {
    if (!courseId) {
      console.log('❌ No courseId provided to fetchCourseData');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Fetching data for course ${courseId}...`);
      
      // Fetch submissions with detailed logging and courseId validation
      console.log('📄 === FETCHING SUBMISSIONS SPECIFICALLY ===');
      try {
        console.log('📄 About to call fetchSubmissions with courseId:', courseId);
        setSubmissionsLoading(true);
        const submissionsResult = await api.fetchSubmissions(courseId);
        console.log('📄 fetchSubmissions returned:', submissionsResult);
        console.log('📄 Submissions count:', submissionsResult?.length || 0);
        
        // Enhanced logging for debugging
        if (submissionsResult && submissionsResult.length > 0) {
          console.log('📄 Sample submission structure:', {
            id: submissionsResult[0].id,
            taskId: submissionsResult[0].taskId,
            assignmentId: submissionsResult[0].assignmentId,
            courseId: submissionsResult[0].courseId,
            studentId: submissionsResult[0].studentId,
            hasFiles: submissionsResult[0].hasFiles
          });
          
          // Validate course IDs
          const submissionsWithCourseId = submissionsResult.filter(sub => sub.courseId === courseId);
          const submissionsWithoutCourseId = submissionsResult.filter(sub => !sub.courseId);
          
          console.log(`📄 Submissions with correct courseId: ${submissionsWithCourseId.length}`);
          console.log(`📄 Submissions without courseId: ${submissionsWithoutCourseId.length}`);
          
          if (submissionsWithoutCourseId.length > 0) {
            console.warn('⚠️ Found submissions without courseId - backend should fix these');
          }
        }
        
        setSubmissions(submissionsResult || []);
      } catch (submissionsError) {
        console.error('❌ SUBMISSIONS FETCH FAILED:', submissionsError);
        setSubmissions([]);
      } finally {
        setSubmissionsLoading(false);
      }

      // ENHANCED: Fetch exam responses
      console.log('📊 === FETCHING EXAM RESPONSES SPECIFICALLY ===');
      try {
        console.log('📊 About to call fetchExamResponses with courseId:', courseId);
        setExamResponsesLoading(true);
        const examResponsesResult = await api.fetchExamResponses(courseId);
        console.log('📊 fetchExamResponses returned:', examResponsesResult);
        console.log('📊 Exam responses count:', examResponsesResult?.length || 0);
        
        // Enhanced logging for exam responses
        if (examResponsesResult && examResponsesResult.length > 0) {
          console.log('📊 Sample exam response structure:', {
            id: examResponsesResult[0].id,
            examId: examResponsesResult[0].examId,
            studentId: examResponsesResult[0].studentId,
            courseId: examResponsesResult[0].courseId,
            status: examResponsesResult[0].status,
            graded: examResponsesResult[0].graded,
            needsManualGrading: examResponsesResult[0].needsManualGrading
          });
        }
        
        setExamResponses(examResponsesResult || []);
      } catch (examResponsesError) {
        console.error('❌ EXAM RESPONSES FETCH FAILED:', examResponsesError);
        setExamResponses([]);
      } finally {
        setExamResponsesLoading(false);
      }
      
      // Fetch other data in parallel
      const [studentsData, assignmentsData, examsData, gradeColumnsData] = 
        await Promise.allSettled([
          api.fetchStudents(courseId),
          api.fetchAssignments(courseId),
          api.fetchExams(courseId),
          api.fetchGradeColumns(courseId)
        ]);
      
      // Handle students
      if (studentsData.status === 'fulfilled') {
        console.log(`✅ Students loaded: ${studentsData.value.length} students`);
        setStudents(studentsData.value);
      } else {
        console.error('❌ Failed to fetch students:', studentsData.reason);
        setStudents([]);
      }
      
      // Handle assignments
      if (assignmentsData.status === 'fulfilled') {
        console.log(`✅ Assignments loaded: ${assignmentsData.value.length} assignments`);
        setAssignments(assignmentsData.value);
      } else {
        console.error('❌ Failed to fetch assignments:', assignmentsData.reason);
        setAssignments([]);
      }
      
      // Handle exams
      if (examsData.status === 'fulfilled') {
        console.log(`✅ Exams loaded: ${examsData.value.length} exams`);
        setExams(examsData.value);
      } else {
        console.error('❌ Failed to fetch exams:', examsData.reason);
        setExams([]);
      }
      
      // Handle grade columns
      if (gradeColumnsData.status === 'fulfilled') {
        console.log(`✅ Grade columns loaded: ${gradeColumnsData.value.length} columns`);
        setGradeColumns(gradeColumnsData.value);
      } else {
        console.error('❌ Failed to fetch grade columns:', gradeColumnsData.reason);
        setGradeColumns([]);
      }
      
      console.log('✅ Course data fetched successfully');
      
    } catch (err) {
      console.error('❌ Error fetching course data:', err);
      handleApiErrorCallback(err);
    } finally {
      setLoading(false);
    }
  }, [handleApiErrorCallback]);

  // Refetch functions
  const refetchSubmissions = useCallback(async () => {
    if (!selectedCourse) {
      console.log('❌ Cannot refetch submissions: no course selected');
      return;
    }
    
    try {
      setSubmissionsLoading(true);
      setError(null);
      console.log(`🔄 Refetching submissions for course ${selectedCourse}...`);
      
      const submissionsData = await api.fetchSubmissions(selectedCourse);
      setSubmissions(submissionsData);
      console.log(`✅ Refetched ${submissionsData.length} submissions`);
      
      // Log course ID validation after refetch
      const withCourseId = submissionsData.filter(sub => sub.courseId === selectedCourse);
      console.log(`✅ Submissions with matching courseId after refetch: ${withCourseId.length}`);
      
    } catch (error) {
      console.error('❌ Error refetching submissions:', error);
      handleApiErrorCallback(error);
    } finally {
      setSubmissionsLoading(false);
    }
  }, [selectedCourse, handleApiErrorCallback]);

  const refetchExamResponses = useCallback(async () => {
    if (!selectedCourse) {
      console.log('❌ Cannot refetch exam responses: no course selected');
      return;
    }
    
    try {
      setExamResponsesLoading(true);
      setError(null);
      console.log(`🔄 Refetching exam responses for course ${selectedCourse}...`);
      
      const examResponsesData = await api.fetchExamResponses(selectedCourse);
      setExamResponses(examResponsesData);
      console.log(`✅ Refetched ${examResponsesData.length} exam responses`);
    } catch (error) {
      console.error('❌ Error refetching exam responses:', error);
      handleApiErrorCallback(error);
    } finally {
      setExamResponsesLoading(false);
    }
  }, [selectedCourse, handleApiErrorCallback]);

  const refetchAssignments = useCallback(async () => {
    if (!selectedCourse) {
      console.log('❌ Cannot refetch assignments: no course selected');
      return;
    }
    
    try {
      setLoading(true);
      const assignmentsData = await api.fetchAssignments(selectedCourse);
      setAssignments(assignmentsData);
      console.log(`✅ Refetched ${assignmentsData.length} assignments`);
    } catch (error) {
      console.error('❌ Error refetching assignments:', error);
      handleApiErrorCallback(error);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse, handleApiErrorCallback]);

  const refetchExams = useCallback(async () => {
    if (!selectedCourse) {
      console.log('❌ Cannot refetch exams: no course selected');
      return;
    }
    
    try {
      setExamLoading(true);
      const examsData = await api.fetchExams(selectedCourse);
      setExams(examsData);
      console.log(`✅ Refetched ${examsData.length} exams`);
    } catch (error) {
      console.error('❌ Error refetching exams:', error);
      handleApiErrorCallback(error);
    } finally {
      setExamLoading(false);
    }
  }, [selectedCourse, handleApiErrorCallback]);

  const refetchStudentsAndGrades = useCallback(async () => {
    if (!selectedCourse) {
      console.log('❌ Cannot refetch students: no course selected');
      return;
    }
    
    try {
      setLoading(true);
      const studentsData = await api.fetchStudents(selectedCourse);
      setStudents(studentsData);
      console.log(`✅ Refetched ${studentsData.length} students with updated grades`);
    } catch (error) {
      console.error('❌ Error refetching students:', error);
      handleApiErrorCallback(error);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse, handleApiErrorCallback]);

  // Computed values with better filtering
  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students) || !selectedCourse) {
      console.log(`👥 No students: students array valid? ${Array.isArray(students)}, selectedCourse: ${selectedCourse}`);
      return [];
    }
    
    console.log(`👥 Returning ${students.length} students for course ${selectedCourse}`);
    return students;
  }, [students, selectedCourse]);

  const filteredAssignments = useMemo(() => {
    if (!Array.isArray(assignments) || !selectedCourse) {
      console.log(`📋 No assignments: assignments array valid? ${Array.isArray(assignments)}, selectedCourse: ${selectedCourse}`);
      return [];
    }
    
    const result = assignments.filter(assignment => 
      assignment.courseId === selectedCourse || assignment.course === selectedCourse
    );
    console.log(`📋 Filtered ${result.length} assignments for course ${selectedCourse}`);
    return result;
  }, [assignments, selectedCourse]);

  const filteredColumns = useMemo(() => {
    if (!Array.isArray(gradeColumns) || !selectedCourse) {
      console.log(`📊 No grade columns: columns array valid? ${Array.isArray(gradeColumns)}, selectedCourse: ${selectedCourse}`);
      return [];
    }
    
    const result = gradeColumns.filter(col => col.courseId === selectedCourse);
    console.log(`📊 Filtered ${result.length} grade columns for course ${selectedCourse}`);
    return result;
  }, [gradeColumns, selectedCourse]);

  const filteredExams = useMemo(() => {
    if (!Array.isArray(exams) || !selectedCourse) {
      console.log(`📝 No exams: exams array valid? ${Array.isArray(exams)}, selectedCourse: ${selectedCourse}`);
      return [];
    }
    
    const result = exams.filter(exam => exam.courseId === selectedCourse);
    console.log(`📝 Filtered ${result.length} exams for course ${selectedCourse}`);
    return result;
  }, [exams, selectedCourse]);

  const filteredExamResponses = useMemo(() => {
    if (!Array.isArray(examResponses) || !selectedCourse) {
      console.log(`📊 No exam responses: responses array valid? ${Array.isArray(examResponses)}, selectedCourse: ${selectedCourse}`);
      return [];
    }
    
    const result = examResponses.filter(response => response.courseId === selectedCourse);
    console.log(`📊 Filtered ${result.length} exam responses for course ${selectedCourse}`);
    return result;
  }, [examResponses, selectedCourse]);

  // Enhanced filtered submissions with robust courseId handling
  const filteredSubmissions = useMemo(() => {
    if (!Array.isArray(submissions) || !selectedCourse) {
      console.log(`📄 No submissions: submissions array valid? ${Array.isArray(submissions)}, selectedCourse: ${selectedCourse}`);
      return [];
    }
    
    console.log(`📄 Processing ${submissions.length} total submissions for course filter`);
    
    const result = submissions.filter(submission => {
      // Primary filter: Direct courseId match
      const directMatch = submission.courseId === selectedCourse;
      
      // Fallback: If no courseId, check if taskId belongs to this course
      let fallbackMatch = false;
      if (!submission.courseId && submission.taskId) {
        fallbackMatch = filteredAssignments.some(assignment => 
          assignment.id === submission.taskId
        );
      }
      
      const courseMatches = directMatch || fallbackMatch;
      
      // Debug logging for first few submissions
      if (submissions.indexOf(submission) < 3) {
        console.log(`📄 Submission ${submission.id}: courseId="${submission.courseId}", taskId="${submission.taskId}", selectedCourse="${selectedCourse}", directMatch=${directMatch}, fallbackMatch=${fallbackMatch}, finalMatch=${courseMatches}`);
      }
      
      return courseMatches;
    });
    
    console.log(`📄 Filtered ${result.length} submissions for course ${selectedCourse} from total ${submissions.length}`);
    
    if (result.length > 0) {
      console.log('📄 Sample filtered submission:', {
        id: result[0].id,
        courseId: result[0].courseId,
        taskId: result[0].taskId,
        assignmentId: result[0].assignmentId,
        studentId: result[0].studentId,
        hasFiles: result[0].hasFiles
      });
    } else if (submissions.length > 0) {
      console.log('📄 ⚠️ No submissions matched - debug info:');
      console.log('📄 Available courseIds in submissions:', [...new Set(submissions.map(s => s.courseId))]);
      console.log('📄 Available taskIds in submissions:', [...new Set(submissions.map(s => s.taskId))]);
      console.log('📄 Available assignmentIds in filteredAssignments:', filteredAssignments.map(a => a.id));
    }
    
    return result;
  }, [submissions, selectedCourse, filteredAssignments]);

  const selectedCourseData = useMemo(() => {
    if (!Array.isArray(courses) || !selectedCourse) {
      console.log(`🎯 No course data: courses array valid? ${Array.isArray(courses)}, selectedCourse: ${selectedCourse}`);
      return null;
    }
    
    const result = courses.find(course => course.id === selectedCourse);
    console.log(`🎯 Selected course data:`, result);
    return result;
  }, [courses, selectedCourse]);

  // Clear messages after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🚀 Starting initial data fetch...');
        
        const coursesData = await api.fetchCourses();
        console.log('✅ Courses loaded:', coursesData);
        setCourses(coursesData);
        
        if (coursesData.length > 0) {
          const firstCourseId = coursesData[0].id;
          console.log(`🎯 Setting initial course to: ${firstCourseId}`);
          setSelectedCourseState(firstCourseId);
        }
        
      } catch (err) {
        console.error('❌ Failed to load initial data:', err);
        handleApiErrorCallback(err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [handleApiErrorCallback]);

  // Fetch data when course changes with proper dependencies
  useEffect(() => {
    if (selectedCourse && courses.length > 0) {
      console.log(`🔄 Course changed to ${selectedCourse}, fetching data...`);
      fetchCourseData(selectedCourse);
    }
  }, [selectedCourse, courses.length, fetchCourseData]);

  // Fetch analytics when course data changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (selectedCourse && filteredStudents.length > 0) {
        try {
          const analyticsData = await api.fetchDashboardAnalytics(selectedCourse);
          setAnalytics(analyticsData);
        } catch (err) {
          console.error('❌ Error fetching analytics:', err);
        }
      }
    };

    fetchAnalytics();
  }, [selectedCourse, filteredStudents.length]);

  // ===================================
  // FILE UPLOAD HANDLERS
  // ===================================

  const handleFileUpload = useCallback(async (event, assignmentId = null) => {
    const file = event.target.files[0];
    if (!file) return;

    const operationId = `upload_${Date.now()}`;

    try {
      setError(null);
      setFileOperationInProgress(true);
      setFileUploadProgress(prev => ({ ...prev, [operationId]: 0 }));
      
      console.log('📁 Processing file upload:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      // Validate file before upload
      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('File size exceeds 10MB limit');
      }
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFileUploadProgress(prev => {
          const currentProgress = prev[operationId] || 0;
          if (currentProgress < 90) {
            return { ...prev, [operationId]: currentProgress + 10 };
          }
          return prev;
        });
      }, 200);
      
      // Upload file using the enhanced API with better error handling
      const fileData = await api.uploadFile(file, 'assignment', {
        assignmentId: assignmentId,
        courseId: selectedCourse,
        description: `Attachment for assignment ${assignmentId || 'new'}`
      });
      
      clearInterval(progressInterval);
      setFileUploadProgress(prev => ({ ...prev, [operationId]: 100 }));
      
      console.log('📁 File upload successful:', fileData);
      
      if (assignmentId) {
        // Update existing assignment in state
        setAssignments(prev => prev.map(assignment => 
          assignment.id === assignmentId 
            ? { 
                ...assignment, 
                fileUrl: fileData.url, 
                fileName: fileData.name, 
                fileSize: fileData.size,
                hasAttachment: true,
                fileType: fileData.type
              }
            : assignment
        ));
        
        setSuccess('File uploaded and attached successfully!');
      } else {
        // Update new assignment form state
        setNewAssignment(prev => ({ 
          ...prev, 
          file: file,
          fileUrl: fileData.url,
          fileName: fileData.name,
          fileSize: fileData.size,
          hasAttachment: true,
          fileType: fileData.type || file.type,
          uploadProgress: 100,
          isUploading: false
        }));
        setSuccess('File attached to new assignment!');
      }
      
      // Clear progress after delay
      setTimeout(() => {
        setFileUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[operationId];
          return newProgress;
        });
      }, 2000);
      
    } catch (err) {
      clearInterval(progressInterval);
      setFileUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[operationId];
        return newProgress;
      });
      
      setError(`File upload failed: ${err.message}`);
      console.error('File upload error:', err);
      event.target.value = '';
    } finally {
      setFileOperationInProgress(false);
    }
  }, [selectedCourse]);

  // Enhanced file viewing with comprehensive error handling
  const handleViewFile = useCallback(async (fileUrl, fileName) => {
    try {
      setFileOperationInProgress(true);
      console.log('👁️ Viewing file:', fileName, 'URL:', fileUrl);
      
      if (!fileUrl) {
        throw new Error('No file URL provided');
      }

      const result = await api.viewFile(fileUrl, fileName);
      
      if (result.success) {
        console.log('✅ File viewed successfully using method:', result.method);
        setSuccess(`File "${fileName || 'Unknown'}" opened successfully`);
      }
    } catch (error) {
      console.error('❌ Error viewing file:', error);
      setError(`Failed to open file: ${error.message}`);
    } finally {
      setFileOperationInProgress(false);
    }
  }, []);

  // Enhanced file removal with comprehensive cleanup
  const handleRemoveFile = useCallback(async (fileUrl) => {
    try {
      setFileOperationInProgress(true);
      console.log('🗑️ Removing file:', fileUrl);
      
      if (fileUrl) {
        await api.deleteFile(fileUrl);
      }
      
      // Reset new assignment file state comprehensively
      setNewAssignment(prev => ({
        ...prev,
        file: null,
        fileUrl: '',
        fileName: '',
        fileSize: 0,
        hasAttachment: false,
        fileType: '',
        uploadProgress: 0,
        isUploading: false
      }));
      
      setSuccess('File removed successfully!');
    } catch (error) {
      console.error('❌ Error removing file:', error);
      setError(`Failed to remove file: ${error.message}`);
    } finally {
      setFileOperationInProgress(false);
    }
  }, []);

  // ===================================
  // ASSIGNMENT MANAGEMENT
  // ===================================

  const addAssignment = useCallback(async () => {
    if (!newAssignment.title?.trim()) {
      setError('Assignment title is required');
      return;
    }
    if (!newAssignment.dueDate) {
      setError('Due date is required');
      return;
    }
    if (!newAssignment.dueTime) {
      setError('Due time is required');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const assignmentData = {
        ...newAssignment,
        title: newAssignment.title.trim(),
        courseId: selectedCourse,
        hasAttachment: !!newAssignment.file || !!newAssignment.fileUrl
      };

      console.log('📝 Creating assignment with data:', assignmentData);

      const createdAssignment = await api.createAssignment(assignmentData);
      setAssignments(prev => [...prev, createdAssignment]);
      
      // Reset form comprehensively
      setNewAssignment({
        title: '',
        description: '',
        type: 'homework',
        dueDate: '',
        dueTime: '',
        maxPoints: 100,
        instructions: '',
        priority: 'medium',
        difficulty: 'medium',
        category: 'individual',
        allowSubmissions: true,
        allowLateSubmissions: false,
        latePenaltyPerDay: 0,
        visibleToStudents: true,
        requiresSubmission: true,
        maxAttempts: 1,
        estimatedDuration: null,
        tags: [],
        prerequisiteTasks: [],
        file: null,
        fileUrl: '',
        fileName: '',
        fileSize: 0,
        hasAttachment: false,
        fileType: '',
        uploadProgress: 0,
        isUploading: false
      });
      
      setShowAssignmentForm(false);
      setSuccess('Assignment created successfully!');
      console.log('✅ Assignment created successfully:', createdAssignment);
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error creating assignment:', err);
    } finally {
      setLoading(false);
    }
  }, [newAssignment, selectedCourse, handleApiErrorCallback]);

  const updateAssignment = useCallback(async (assignmentId, updates) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('🔄 Updating assignment with data:', updates);
      
      const updatedAssignment = await api.updateAssignment(assignmentId, updates);
      
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId ? { ...assignment, ...updatedAssignment } : assignment
      ));
      
      setEditingAssignment(null);
      setSuccess('Assignment updated successfully!');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error updating assignment:', err);
    } finally {
      setLoading(false);
    }
  }, [handleApiErrorCallback]);

  const deleteAssignment = useCallback(async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment? This will also remove all related submissions and grades.')) {
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      await api.deleteAssignment(assignmentId);
      
      setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
      setSubmissions(prev => prev.filter(sub => sub.assignmentId !== assignmentId && sub.taskId !== assignmentId));
      
      setSuccess('Assignment deleted successfully!');
      console.log('✅ Assignment deleted successfully');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error deleting assignment:', err);
    } finally {
      setLoading(false);
    }
  }, [handleApiErrorCallback]);

  // ===================================
  // EXAM MANAGEMENT - FULLY IMPLEMENTED
  // ===================================

  const createExam = useCallback(async () => {
    if (!newExam.title?.trim()) {
      setError('Exam title is required');
      return;
    }
    if (!newExam.duration || newExam.duration <= 0) {
      setError('Valid exam duration is required');
      return;
    }

    try {
      setError(null);
      setExamLoading(true);
      
      const examData = {
        ...newExam,
        title: newExam.title.trim(),
        courseId: selectedCourse
      };

      console.log('📝 Creating exam with data:', examData);

      const createdExam = await api.createExam(examData);
      setExams(prev => [...prev, createdExam]);
      
      // Reset form
      setNewExam({
        title: '',
        description: '',
        instructions: '',
        duration: 60,
        startTime: '',
        endTime: '',
        publishTime: '',
        maxAttempts: 1,
        showResults: true,
        shuffleQuestions: false,
        shuffleOptions: false,
        allowNavigation: true,
        showTimer: true,
        autoSubmit: true,
        requireSafeBrowser: false,
        visibleToStudents: false,
        passPercentage: 60.0,
        questions: []
      });
      
      setShowExamForm(false);
      setSuccess('Exam created successfully!');
      console.log('✅ Exam created successfully:', createdExam);
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error creating exam:', err);
    } finally {
      setExamLoading(false);
    }
  }, [newExam, selectedCourse, handleApiErrorCallback]);

  const updateExam = useCallback(async (examId, updates) => {
    try {
      setError(null);
      setExamLoading(true);
      
      console.log('🔄 Updating exam with data:', updates);
      
      const updatedExam = await api.updateExam(examId, updates);
      
      setExams(prev => prev.map(exam => 
        exam.id === examId ? { ...exam, ...updatedExam } : exam
      ));
      
      setEditingExam(null);
      setSuccess('Exam updated successfully!');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error updating exam:', err);
    } finally {
      setExamLoading(false);
    }
  }, [handleApiErrorCallback]);

  const deleteExam = useCallback(async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam? This will also remove all related responses and grades.')) {
      return;
    }

    try {
      setError(null);
      setExamLoading(true);
      
      await api.deleteExam(examId);
      
      setExams(prev => prev.filter(exam => exam.id !== examId));
      setExamResponses(prev => prev.filter(resp => resp.examId !== examId));
      
      setSuccess('Exam deleted successfully!');
      console.log('✅ Exam deleted successfully');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error deleting exam:', err);
    } finally {
      setExamLoading(false);
    }
  }, [handleApiErrorCallback]);

  const publishExam = useCallback(async (examId) => {
    try {
      setError(null);
      setExamLoading(true);
      
      const publishedExam = await api.publishExam(examId);
      
      setExams(prev => prev.map(exam => 
        exam.id === examId ? { ...exam, ...publishedExam, status: 'PUBLISHED' } : exam
      ));
      
      setSuccess('Exam published successfully!');
      console.log('✅ Exam published successfully');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error publishing exam:', err);
    } finally {
      setExamLoading(false);
    }
  }, [handleApiErrorCallback]);

  const unpublishExam = useCallback(async (examId) => {
    try {
      setError(null);
      setExamLoading(true);
      
      const unpublishedExam = await api.unpublishExam(examId);
      
      setExams(prev => prev.map(exam => 
        exam.id === examId ? { ...exam, ...unpublishedExam, status: 'DRAFT' } : exam
      ));
      
      setSuccess('Exam unpublished successfully!');
      console.log('✅ Exam unpublished successfully');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error unpublishing exam:', err);
    } finally {
      setExamLoading(false);
    }
  }, [handleApiErrorCallback]);

  // ===================================
  // QUESTION MANAGEMENT
  // ===================================

  const addQuestionToExam = useCallback(async (examId, questionData) => {
    try {
      setError(null);
      setExamLoading(true);
      
      console.log('➕ Adding question to exam:', examId, questionData);
      
      const createdQuestion = await api.addQuestionToExam(examId, questionData);
      
      // Update exam in state with new question
      setExams(prev => prev.map(exam => {
        if (exam.id === examId) {
          return {
            ...exam,
            questions: [...(exam.questions || []), createdQuestion],
            questionCount: (exam.questions || []).length + 1
          };
        }
        return exam;
      }));
      
      setSuccess('Question added successfully!');
      console.log('✅ Question added successfully:', createdQuestion);
      return createdQuestion;
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error adding question:', err);
      throw err;
    } finally {
      setExamLoading(false);
    }
  }, [handleApiErrorCallback]);

  const updateQuestion = useCallback(async (examId, questionId, updates) => {
    try {
      setError(null);
      setExamLoading(true);
      
      console.log('🔄 Updating question:', examId, questionId, updates);
      
      const updatedQuestion = await api.updateQuestion(examId, questionId, updates);
      
      // Update question in exam state
      setExams(prev => prev.map(exam => {
        if (exam.id === examId) {
          return {
            ...exam,
            questions: exam.questions?.map(q => 
              q.id === questionId ? { ...q, ...updatedQuestion } : q
            ) || []
          };
        }
        return exam;
      }));
      
      setSuccess('Question updated successfully!');
      console.log('✅ Question updated successfully');
      return updatedQuestion;
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error updating question:', err);
      throw err;
    } finally {
      setExamLoading(false);
    }
  }, [handleApiErrorCallback]);

  const deleteQuestion = useCallback(async (examId, questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      setError(null);
      setExamLoading(true);
      
      await api.deleteQuestion(examId, questionId);
      
      // Remove question from exam state
      setExams(prev => prev.map(exam => {
        if (exam.id === examId) {
          const updatedQuestions = exam.questions?.filter(q => q.id !== questionId) || [];
          return {
            ...exam,
            questions: updatedQuestions,
            questionCount: updatedQuestions.length
          };
        }
        return exam;
      }));
      
      setSuccess('Question deleted successfully!');
      console.log('✅ Question deleted successfully');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error deleting question:', err);
    } finally {
      setExamLoading(false);
    }
  }, [handleApiErrorCallback]);

  const reorderQuestions = useCallback(async (examId, questionIds) => {
    try {
      setError(null);
      
      await api.reorderQuestions(examId, questionIds);
      
      // Update question order in exam state
      setExams(prev => prev.map(exam => {
        if (exam.id === examId) {
          const reorderedQuestions = questionIds.map(questionId => 
            exam.questions?.find(q => q.id === questionId)
          ).filter(Boolean);
          
          return {
            ...exam,
            questions: reorderedQuestions
          };
        }
        return exam;
      }));
      
      setSuccess('Questions reordered successfully!');
      console.log('✅ Questions reordered successfully');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error reordering questions:', err);
    }
  }, [handleApiErrorCallback]);

  // ===================================
  // ENHANCED EXAM RESPONSE GRADING
  // ===================================

  const autoGradeResponse = useCallback(async (responseId) => {
    try {
      setGradingLoading(true);
      setError(null);
      
      console.log('🤖 Auto-grading response:', responseId);
      
      const gradedResponse = await api.autoGradeResponse(responseId);
      
      // Update response in state
      setExamResponses(prev => prev.map(response => 
        response.id === responseId 
          ? { 
              ...response, 
              ...gradedResponse,
              graded: true,
              autoGraded: true,
              gradingStatus: 'auto_graded',
              needsManualGrading: false
            }
          : response
      ));
      
      // Refresh students grades as exam responses might sync to grade columns
      await refetchStudentsAndGrades();
      
      setSuccess('Response auto-graded successfully!');
      console.log('✅ Response auto-graded successfully');
      return gradedResponse;
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error auto-grading response:', err);
      throw err;
    } finally {
      setGradingLoading(false);
    }
  }, [handleApiErrorCallback, refetchStudentsAndGrades]);

  const autoGradeAllResponses = useCallback(async (examId) => {
    try {
      setGradingLoading(true);
      setError(null);
      
      console.log('🤖 Auto-grading all responses for exam:', examId);
      
      const result = await api.autoGradeAllResponses(examId);
      
      // Refresh exam responses to get updated data
      await refetchExamResponses();
      await refetchStudentsAndGrades();
      
      setSuccess(`Auto-graded ${result.gradedCount || 0} responses successfully!`);
      console.log('✅ Auto-graded all responses successfully');
      return result;
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error auto-grading all responses:', err);
      throw err;
    } finally {
      setGradingLoading(false);
    }
  }, [handleApiErrorCallback, refetchExamResponses, refetchStudentsAndGrades]);

  const handleManualGrading = useCallback(async (gradeData) => {
  try {
    setGradingLoading(true);
    setError(null);
    
    console.log('📝 Manual grading response:', gradeData.responseId);
    console.log('📝 Question scores:', gradeData.questionScores);
    console.log('📝 Feedback:', gradeData.instructorFeedback);
    
    // FIXED: Call the API function with the correctly structured data
    const gradedResponse = await api.manualGradeExamResponse(
      gradeData.responseId, 
      gradeData.questionScores, 
      gradeData.instructorFeedback || '', 
      gradeData.flaggedForReview || false
    );
    
    // Update response in state
    setExamResponses(prev => prev.map(response => 
      response.id === gradeData.responseId 
        ? { 
            ...response, 
            ...gradedResponse,
            graded: true,
            autoGraded: false,
            gradingStatus: 'graded',
            needsManualGrading: false,
            questionScores: gradeData.questionScores,
            instructorFeedback: gradeData.instructorFeedback,
            flaggedForReview: gradeData.flaggedForReview
          }
        : response
    ));
    
    // Refresh students grades as exam responses might sync to grade columns
    await refetchStudentsAndGrades();
    
    // Close the grading modal
    setShowGradingModal(false);
    setSelectedResponseForGrading(null);
    setSelectedExamForGrading(null);
    
    setSuccess('Response graded manually successfully!');
    console.log('✅ Response graded manually successfully');
    return gradedResponse;
  } catch (err) {
    handleApiErrorCallback(err);
    console.error('Error manual grading response:', err);
    throw err;
  } finally {
    setGradingLoading(false);
  }
}, [handleApiErrorCallback, refetchStudentsAndGrades]);

  const flagResponseForReview = useCallback(async (responseId, flagReason = '', flagPriority = 'medium') => {
    try {
      setError(null);
      
      const flaggedResponse = await api.flagResponseForReview(responseId, flagReason, flagPriority);
      
      // Update response in state
      setExamResponses(prev => prev.map(response => 
        response.id === responseId 
          ? { 
              ...response, 
              ...flaggedResponse,
              flaggedForReview: true
            }
          : response
      ));
      
      setSuccess('Response flagged for review successfully!');
      console.log('✅ Response flagged for review');
      return flaggedResponse;
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error flagging response:', err);
      throw err;
    }
  }, [handleApiErrorCallback]);

  const unflagResponse = useCallback(async (responseId) => {
    try {
      setError(null);
      
      const unflaggedResponse = await api.unflagResponse(responseId);
      
      // Update response in state
      setExamResponses(prev => prev.map(response => 
        response.id === responseId 
          ? { 
              ...response, 
              ...unflaggedResponse,
              flaggedForReview: false
            }
          : response
      ));
      
      setSuccess('Response unflagged successfully!');
      console.log('✅ Response unflagged');
      return unflaggedResponse;
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error unflagging response:', err);
      throw err;
    }
  }, [handleApiErrorCallback]);

  const batchGradeExamResponses = useCallback(async (responseIds, instructorFeedback = '', flagForReview = false) => {
    if (responseIds.length === 0) {
      setError('Please select responses to grade');
      return;
    }

    try {
      setError(null);
      setGradingLoading(true);
      
      console.log('📦 Batch grading exam responses:', responseIds.length, 'responses');
      
      const result = await api.batchGradeExamResponses(responseIds, instructorFeedback, flagForReview);
      
      // Refresh exam responses to get updated data
      await refetchExamResponses();
      await refetchStudentsAndGrades();
      
      setSelectedExamResponses(new Set());
      setSuccess(`${result.gradedCount || responseIds.length} responses graded successfully!`);
      console.log('✅ Batch grading completed');
      return result;
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error batch grading exam responses:', err);
      throw err;
    } finally {
      setGradingLoading(false);
    }
  }, [handleApiErrorCallback, refetchExamResponses, refetchStudentsAndGrades]);

  // ===================================
  // GRADE COLUMN MANAGEMENT
  // ===================================

  const addGradeColumn = useCallback(async () => {
    const columnData = {
      ...newColumn,
      percentage: parseInt(newColumn.percentage) || 0
    };

    if (!validateGradeColumn(columnData)) {
      setError('Please provide valid grade column data');
      return;
    }

    const currentTotal = filteredColumns.reduce((sum, col) => sum + col.percentage, 0);
    if (currentTotal + columnData.percentage > 100) {
      setError(`Cannot add grade component. Total would exceed 100% (current: ${currentTotal}%)`);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      columnData.courseId = selectedCourse;

      const createdColumn = await api.createGradeColumn(columnData);
      setGradeColumns(prev => [...prev, createdColumn]);
      
      setNewColumn({ name: '', type: 'assignment', percentage: '', maxPoints: 100 });
      setShowColumnForm(false);
      setSuccess('Grade column created successfully!');
      console.log('✅ Grade column created successfully:', createdColumn);
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error creating grade column:', err);
    } finally {
      setLoading(false);
    }
  }, [newColumn, selectedCourse, filteredColumns, handleApiErrorCallback]);

  const updateColumn = useCallback(async (columnId, field, value) => {
    try {
      setError(null);
      let processedValue = value;
      
      if (field === 'percentage') {
        const percentageValue = parseInt(value) || 0;
        if (percentageValue < 0 || percentageValue > 100) {
          setError('Percentage must be between 0 and 100');
          return;
        }
        
        const otherColumns = filteredColumns.filter(col => col.id !== columnId);
        const otherTotal = otherColumns.reduce((sum, col) => sum + col.percentage, 0);
        if (otherTotal + percentageValue > 100) {
          setError(`Total percentage cannot exceed 100% (other columns: ${otherTotal}%)`);
          return;
        }
        
        processedValue = percentageValue;
      }

      const updates = { [field]: processedValue };
      await api.updateGradeColumn(columnId, updates);
      
      setGradeColumns(prev => prev.map(col => 
        col.id === columnId ? { ...col, ...updates } : col
      ));
      
      if (field === 'percentage') {
        setSuccess('Grade percentage updated successfully!');
      }
      console.log('✅ Grade column updated successfully');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error updating grade column:', err);
    }
  }, [filteredColumns, handleApiErrorCallback]);

  const deleteColumn = useCallback(async (columnId) => {
    if (!window.confirm('Are you sure you want to delete this grade component? All related grades will be removed.')) {
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      await api.deleteGradeColumn(columnId);
      
      setGradeColumns(prev => prev.filter(col => col.id !== columnId));
      setStudents(prev => prev.map(student => {
        const newGrades = { ...student.grades };
        delete newGrades[columnId];
        return { ...student, grades: newGrades };
      }));
      
      setSuccess('Grade column deleted successfully!');
      console.log('✅ Grade column deleted successfully');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error deleting grade column:', err);
    } finally {
      setLoading(false);
    }
  }, [handleApiErrorCallback]);

  // Grade management
  const updateGrade = useCallback(async (studentId, columnId, value) => {
    const originalStudents = [...students];
    
    try {
      setError(null);
      const gradeValue = value === '' || value === null ? null : (parseFloat(value) || 0);
      
      if (gradeValue !== null && (gradeValue < 0 || gradeValue > 100)) {
        setError('Grade must be between 0 and 100');
        return;
      }
      
      // Optimistic update
      setStudents(prev => prev.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            grades: { ...student.grades, [columnId]: gradeValue }
          };
        }
        return student;
      }));

      await api.updateGrade(studentId, columnId, gradeValue);
      console.log('✅ Grade updated successfully');
      
      // Refresh students to get updated final grades
      await refetchStudentsAndGrades();
      
    } catch (err) {
      // Rollback on error
      setStudents(originalStudents);
      handleApiErrorCallback(err);
      console.error('Error updating grade:', err);
    }
  }, [students, handleApiErrorCallback, refetchStudentsAndGrades]);

  // ===================================
  // SUBMISSION MANAGEMENT
  // ===================================

  const updateSubmissionGrade = useCallback(async (submissionId, grade, feedback = '') => {
    try {
      setError(null);
      setSubmissionsLoading(true);
      
      const gradeValue = grade === '' || grade === null ? null : (parseFloat(grade) || 0);
      
      if (gradeValue !== null && (gradeValue < 0 || gradeValue > 100)) {
        setError('Grade must be between 0 and 100');
        return;
      }
      
      console.log('📊 Updating submission grade with sync:', submissionId, 'Grade:', gradeValue);
      
      const updatedSubmission = await api.updateSubmissionGrade(submissionId, gradeValue, feedback);
      
      setSubmissions(prev => prev.map(submission => 
        submission.id === submissionId 
          ? { 
              ...submission, 
              ...updatedSubmission,
              grade: gradeValue, 
              feedback: feedback, 
              isGraded: gradeValue !== null && gradeValue !== undefined, 
              needsGrading: gradeValue === null || gradeValue === undefined,
              gradedAt: new Date().toISOString(),
              status: gradeValue !== null ? 'graded' : 'submitted',
              // Ensure courseId is preserved
              courseId: submission.courseId || selectedCourse
            }
          : submission
      ));
      
      await refetchStudentsAndGrades();
      
      setSuccess('Submission graded and synced to grade column successfully!');
      console.log('✅ Submission grade updated and synced successfully');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error updating submission grade:', err);
      throw err;
    } finally {
      setSubmissionsLoading(false);
    }
  }, [handleApiErrorCallback, refetchStudentsAndGrades, selectedCourse]);

  const downloadSubmission = useCallback(async (submissionId) => {
    try {
      setError(null);
      setFileOperationInProgress(true);
      const result = await api.downloadSubmission(submissionId);
      setSuccess(result.message || 'Download started!');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error downloading submission:', err);
    } finally {
      setFileOperationInProgress(false);
    }
  }, [handleApiErrorCallback]);

  // Batch operations for submissions
  const batchGradeSubmissions = useCallback(async () => {
    if (selectedSubmissions.length === 0) {
      setError('Please select submissions to grade');
      return;
    }
    
    if (!bulkGrade || isNaN(parseInt(bulkGrade))) {
      setError('Please enter a valid grade');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const grade = parseInt(bulkGrade);
      
      const result = await api.batchGradeSubmissions(selectedSubmissions, grade, bulkFeedback);
      
      setSubmissions(prev => prev.map(submission => 
        selectedSubmissions.includes(submission.id)
          ? { 
              ...submission, 
              grade, 
              feedback: bulkFeedback, 
              status: 'graded', 
              isGraded: true, 
              needsGrading: false,
              // Preserve courseId
              courseId: submission.courseId || selectedCourse
            }
          : submission
      ));
      
      await refetchStudentsAndGrades();
      
      setSelectedSubmissions([]);
      setBulkGrade('');
      setBulkFeedback('');
      setSuccess(`${selectedSubmissions.length} submissions graded and synced successfully!`);
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error batch grading submissions:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedSubmissions, bulkGrade, bulkFeedback, handleApiErrorCallback, refetchStudentsAndGrades, selectedCourse]);

  // ===================================
  // STUDENT MANAGEMENT
  // ===================================

  const addStudent = useCallback(async () => {
    if (!newStudent.name?.trim()) {
      setError('Student name is required');
      return;
    }
    if (!newStudent.email?.trim()) {
      setError('Student email is required');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const studentData = {
        ...newStudent,
        name: newStudent.name.trim(),
        email: newStudent.email.trim()
      };

      const createdStudent = await api.addStudent(selectedCourse, studentData);
      setStudents(prev => [...prev, createdStudent]);
      
      setNewStudent({ name: '', email: '', studentId: '' });
      setShowStudentForm(false);
      setSuccess('Student added successfully!');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error adding student:', err);
    } finally {
      setLoading(false);
    }
  }, [newStudent, selectedCourse, handleApiErrorCallback]);

  const updateStudent = useCallback(async (studentId, updates) => {
    try {
      setError(null);
      
      await api.updateStudent(studentId, updates);
      
      setStudents(prev => prev.map(student => 
        student.id === studentId ? { ...student, ...updates } : student
      ));
      
      setEditingStudent(null);
      setSuccess('Student updated successfully!');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error updating student:', err);
    }
  }, [handleApiErrorCallback]);

  const removeStudent = useCallback(async (studentId) => {
    if (!window.confirm('Are you sure you want to remove this student? This will also remove all their submissions and grades.')) {
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      await api.removeStudent(selectedCourse, studentId);
      
      setStudents(prev => prev.filter(student => student.id !== studentId));
      setSubmissions(prev => prev.filter(sub => sub.studentId !== studentId));
      setExamResponses(prev => prev.filter(resp => resp.studentId !== studentId));
      setSuccess('Student removed successfully!');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error removing student:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse, handleApiErrorCallback]);

  // ===================================
  // EXPORT FUNCTIONALITY
  // ===================================

  const exportGrades = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      await api.exportGrades(selectedCourse, 'csv');
      setSuccess('Grades exported successfully!');
    } catch (err) {
      handleApiErrorCallback(err);
      console.error('Error exporting grades:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse, handleApiErrorCallback]);

  // ===================================
  // MANUAL GRADING MODAL MANAGEMENT
  // ===================================

  const openGradingModal = useCallback(async (response, exam, mode = 'view') => {
    try {
      console.log('🔓 Opening grading modal:', { responseId: response.id, examId: exam.id, mode });
      setSelectedResponseForGrading(response);
      setSelectedExamForGrading(exam);
      setGradingModalMode(mode);
      setShowGradingModal(true);
    } catch (error) {
      console.error('❌ Error opening grading modal:', error);
      setError('Failed to open grading modal');
    }
  }, []);

  const closeGradingModal = useCallback(() => {
    console.log('🔒 Closing grading modal');
    setShowGradingModal(false);
    setSelectedResponseForGrading(null);
    setSelectedExamForGrading(null);
    setGradingModalMode('view');
  }, []);

  // ===================================
  // HELPER FUNCTIONS
  // ===================================

  const calculateFinalGrade = useCallback((student) => {
    try {
      return calculateGradePercentage(student, filteredColumns);
    } catch (err) {
      console.error('Error calculating final grade:', err);
      return 0;
    }
  }, [filteredColumns]);

  const getTotalPercentage = useCallback(() => {
    try {
      return filteredColumns.reduce((sum, col) => sum + (col.percentage || 0), 0);
    } catch (err) {
      console.error('Error calculating total percentage:', err);
      return 0;
    }
  }, [filteredColumns]);

  const getStudentName = useCallback((studentId) => {
    try {
      const student = students.find(s => s.id === studentId);
      return student ? student.name : 'Unknown Student';
    } catch (err) {
      console.error('Error getting student name:', err);
      return 'Unknown Student';
    }
  }, [students]);

  // Enhanced getSubmissionsForAssignment with improved matching logic
  const getSubmissionsForAssignment = useCallback((assignmentId) => {
    try {
      console.log(`📄 === GETTING SUBMISSIONS FOR ASSIGNMENT ===`);
      console.log(`📄 Looking for assignmentId/taskId: ${assignmentId}`);
      console.log(`📄 Total filteredSubmissions: ${filteredSubmissions.length}`);
      
      // Enhanced debugging
      if (filteredSubmissions.length > 0) {
        console.log('📄 Sample filteredSubmission structure:', {
          id: filteredSubmissions[0].id,
          taskId: filteredSubmissions[0].taskId,
          assignmentId: filteredSubmissions[0].assignmentId,
          courseId: filteredSubmissions[0].courseId,
          studentId: filteredSubmissions[0].studentId
        });
        
        console.log('📄 All taskIds in filteredSubmissions:', 
          filteredSubmissions.map(s => s.taskId).slice(0, 10) // Show first 10
        );
      }
      
      const result = filteredSubmissions.filter(sub => {
        // Enhanced matching: Backend uses taskId, mapped to assignmentId for compatibility
        const matches = sub.taskId === assignmentId || sub.assignmentId === assignmentId;
        
        if (matches) {
          console.log(`📄 ✅ Found matching submission: ${sub.id} (taskId: ${sub.taskId}, assignmentId: ${sub.assignmentId})`);
        }
        
        return matches;
      });
      
      console.log(`📄 Final result: Found ${result.length} submissions for assignment ${assignmentId}`);
      
      if (result.length === 0 && filteredSubmissions.length > 0) {
        console.log('📄 ⚠️ No matches found. Assignment ID might not match any taskId/assignmentId');
        console.log('📄 Available taskIds:', [...new Set(filteredSubmissions.map(s => s.taskId))]);
        console.log('📄 Looking for assignmentId:', assignmentId);
        
        // Double-check if this assignment exists in our filtered assignments
        const assignmentExists = filteredAssignments.some(a => a.id === assignmentId);
        console.log('📄 Assignment exists in filteredAssignments:', assignmentExists);
      }
      
      return result;
    } catch (err) {
      console.error('Error getting submissions for assignment:', err);
      return [];
    }
  }, [filteredSubmissions, filteredAssignments]);

  const getExamResponses = useCallback((examId) => {
    try {
      const result = filteredExamResponses.filter(response => response.examId === examId) || [];
      console.log(`📊 Found ${result.length} responses for exam ${examId}`);
      return result;
    } catch (err) {
      console.error('Error getting exam responses:', err);
      return [];
    }
  }, [filteredExamResponses]);

  const getResponsesForExam = useCallback((examId) => {
    try {
      const result = filteredExamResponses.filter(response => response.examId === examId) || [];
      console.log(`📊 Found ${result.length} responses for exam ${examId}`);
      return result;
    } catch (err) {
      console.error('Error getting responses for exam:', err);
      return [];
    }
  }, [filteredExamResponses]);

  const getExamById = useCallback((examId) => {
    try {
      const exam = exams.find(e => e.id === examId);
      return exam || null;
    } catch (err) {
      console.error('Error getting exam by ID:', err);
      return null;
    }
  }, [exams]);

  // ===================================
  // EXAM RESPONSE HELPER FUNCTIONS
  // ===================================

  const getResponseGradingStatus = useCallback((response) => {
    return api.getResponseGradingStatus(response);
  }, []);

  const canResponseBeGraded = useCallback((response) => {
    return api.canResponseBeAutoGraded(response);
  }, []);

  const needsManualGrading = useCallback((response) => {
    return api.needsManualGrading(response);
  }, []);

  // Enhanced debug logging for submissions
  useEffect(() => {
    if (filteredSubmissions.length > 0 && selectedAssignmentForSubmissions) {
      console.log('🔍 === DEBUGGING SUBMISSIONS FLOW ===');
      console.log('🔍 Selected assignment for submissions:', selectedAssignmentForSubmissions);
      console.log('🔍 Total filtered submissions:', filteredSubmissions.length);
      console.log('🔍 Sample submission taskIds:', filteredSubmissions.slice(0, 5).map(s => ({ id: s.id, taskId: s.taskId, assignmentId: s.assignmentId, courseId: s.courseId })));
      
      const matchingSubmissions = getSubmissionsForAssignment(selectedAssignmentForSubmissions);
      console.log('🔍 Matching submissions count:', matchingSubmissions.length);
      
      if (matchingSubmissions.length === 0) {
        console.log('🔍 ❌ No submissions found for selected assignment');
        console.log('🔍 All available taskIds:', [...new Set(filteredSubmissions.map(s => s.taskId))]);
        console.log('🔍 Selected assignment ID:', selectedAssignmentForSubmissions);
        console.log('🔍 All filtered submissions courseIds:', [...new Set(filteredSubmissions.map(s => s.courseId))]);
        console.log('🔍 Current selected course:', selectedCourse);
      }
    }
  }, [filteredSubmissions, selectedAssignmentForSubmissions, getSubmissionsForAssignment, selectedCourse]);

  return {
    // ===================================
    // STATE
    // ===================================
    activeTab,
    setActiveTab,
    selectedCourse,
    setSelectedCourse,
    selectedAssignmentForSubmissions,
    setSelectedAssignmentForSubmissions,
    selectedExamForPreview,
    setSelectedExamForPreview,
    selectedExamForResponses,
    setSelectedExamForResponses,
    selectedExamForGrading,
    setSelectedExamForGrading,
    editingExam,
    setEditingExam,
    editingAssignment,
    setEditingAssignment,
    editingStudent,
    setEditingStudent,
    editingColumn,
    setEditingColumn,
    showColumnForm,
    setShowColumnForm,
    showExamForm,
    setShowExamForm,
    showAssignmentForm,
    setShowAssignmentForm,
    showStudentForm,
    setShowStudentForm,
    loading,
    submissionsLoading,
    examResponsesLoading,
    examLoading,
    error,
    setError,
    success,
    setSuccess,
    
    // File operation states
    fileOperationInProgress,
    fileUploadProgress,
    
    // ===================================
    // DATA
    // ===================================
    courses,
    students,
    assignments,
    submissions,
    exams,
    examResponses,
    gradeColumns,
    analytics,
    
    // ===================================
    // FORMS
    // ===================================
    newAssignment,
    setNewAssignment,
    newColumn,
    setNewColumn,
    newExam,
    setNewExam,
    newStudent,
    setNewStudent,
    
    // ===================================
    // BATCH OPERATIONS
    // ===================================
    selectedSubmissions,
    setSelectedSubmissions,
    selectedExams,
    setSelectedExams,
    selectedExamResponses,
    setSelectedExamResponses,
    bulkGrade,
    setBulkGrade,
    bulkFeedback,
    setBulkFeedback,
    batchGradeSubmissions,
    batchGradeExamResponses,
    
    // ===================================
    // FILE HANDLING
    // ===================================
    handleFileUpload,
    handleViewFile,
    handleRemoveFile,
    
    // ===================================
    // ASSIGNMENT ACTIONS
    // ===================================
    addAssignment,
    updateAssignment,
    deleteAssignment,
    
    // ===================================
    // EXAM ACTIONS
    // ===================================
    createExam,
    updateExam,
    deleteExam,
    publishExam,
    unpublishExam,
    addQuestionToExam,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    
    // ===================================
    // EXAM GRADING ACTIONS
    // ===================================
    autoGradeResponse,
    autoGradeAllResponses,
    handleManualGrading,
    flagResponseForReview,
    unflagResponse,
    
    // ===================================
    // STUDENT ACTIONS
    // ===================================
    addStudent,
    updateStudent,
    removeStudent,
    
    // ===================================
    // GRADE COLUMN ACTIONS
    // ===================================
    addGradeColumn,
    updateColumn,
    deleteColumn,
    updateGrade,
    exportGrades,
    
    // ===================================
    // SUBMISSION ACTIONS
    // ===================================
    updateSubmissionGrade,
    downloadSubmission,
    
    // ===================================
    // COMPUTED VALUES
    // ===================================
    filteredStudents,
    filteredAssignments,
    filteredColumns,
    filteredExams,
    filteredExamResponses,
    filteredSubmissions,
    selectedCourseData,
    calculateFinalGrade,
    getTotalPercentage,
    getStudentName,
    getSubmissionsForAssignment,
    getExamResponses,
    getResponsesForExam,
    getExamById,
    
    // ===================================
    // REFETCH METHODS
    // ===================================
    refetchSubmissions,
    refetchAssignments,
    refetchExams,
    refetchStudentsAndGrades,
    refetchExamResponses,
    
    // ===================================
    // MANUAL GRADING MODAL
    // ===================================
    showGradingModal,
    openGradingModal,
    closeGradingModal,
    selectedResponseForGrading,
    gradingModalMode,
    setGradingModalMode,
    gradingLoading,
    
    // ===================================
    // HELPER FUNCTIONS
    // ===================================
    getResponseGradingStatus,
    canResponseBeGraded,
    needsManualGrading,
    
    // ===================================
    // UTILITIES
    // ===================================
    handleApiError: handleApiErrorCallback
  };
};