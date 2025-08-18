import { useState, useEffect, useCallback } from 'react';
import { 
  getAllDepartments,
  getStudentsByDepartment,
  getLecturersByDepartment,
  getCoursesByDepartment,
  createStudent,
  createLecturer,
  createCourse,
  generateSemester,
  getSemesterPreview,
  validateSemesterConfig
} from '../Api/GenerateSemesterApi';

export const useGenerateSemester = () => {
  // Data state
  const [departments, setDepartments] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredLecturers, setFilteredLecturers] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  
  // Form state
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showAddLecturerForm, setShowAddLecturerForm] = useState(false);
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    departments: false,
    students: false,
    lecturers: false,
    courses: false,
    generating: false
  });
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [isConfigValid, setIsConfigValid] = useState(false);

  // Computed values
  const currentDepartment = departments.find(dept => dept.id === parseInt(selectedDepartment));

  // Load departments on component mount
  useEffect(() => {
    loadDepartments();
  }, []);

  // Load departments function
  const loadDepartments = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, departments: true }));
      setError(null);
      
      const departmentsData = await getAllDepartments();
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Error loading departments:', error);
      setError('Failed to load departments. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, departments: false }));
    }
  }, []);

  // Load filtered data when selections change
  useEffect(() => {
    if (selectedDepartment && selectedAcademicYear && selectedSemester) {
      loadFilteredData();
    } else {
      clearFilteredData();
    }
  }, [selectedDepartment, selectedAcademicYear, selectedSemester, selectedDivision]);

  // Load filtered data function
  const loadFilteredData = useCallback(async () => {
    if (!selectedDepartment || !selectedAcademicYear || !selectedSemester) return;

    try {
      setLoadingStates(prev => ({ 
        ...prev, 
        students: true, 
        lecturers: true, 
        courses: true 
      }));
      setError(null);

      // Load students, lecturers, and courses in parallel
      const [studentsData, lecturersData, coursesData] = await Promise.all([
        getStudentsByDepartment(selectedDepartment, selectedAcademicYear, selectedDivision),
        getLecturersByDepartment(selectedDepartment),
        getCoursesByDepartment(selectedDepartment, selectedAcademicYear, selectedSemester)
      ]);

      setFilteredStudents(studentsData);
      setFilteredLecturers(lecturersData);
      setFilteredCourses(coursesData);
    } catch (error) {
      console.error('Error loading filtered data:', error);
      setError('Failed to load data. Please try again.');
      clearFilteredData();
    } finally {
      setLoadingStates(prev => ({ 
        ...prev, 
        students: false, 
        lecturers: false, 
        courses: false 
      }));
    }
  }, [selectedDepartment, selectedAcademicYear, selectedSemester, selectedDivision]);

  // Clear filtered data
  const clearFilteredData = useCallback(() => {
    setFilteredStudents([]);
    setFilteredLecturers([]);
    setFilteredCourses([]);
  }, []);

  // Validate semester configuration
  const validateConfiguration = useCallback(async () => {
    if (!selectedDepartment || !selectedSemester || !selectedAcademicYear || !startDate || !endDate) {
      setIsConfigValid(false);
      return false;
    }

    try {
      const config = {
        departmentId: selectedDepartment,
        academicYear: selectedAcademicYear,
        semester: selectedSemester,
        division: selectedDivision,
        startDate,
        endDate
      };

      const validation = await validateSemesterConfig(config);
      setValidationErrors(validation.errors || {});
      setIsConfigValid(validation.isValid);
      
      return validation.isValid;
    } catch (error) {
      console.error('Error validating configuration:', error);
      setValidationErrors({ general: 'Failed to validate configuration' });
      setIsConfigValid(false);
      return false;
    }
  }, [selectedDepartment, selectedSemester, selectedAcademicYear, selectedDivision, startDate, endDate]);

  // Get semester preview
  const getPreviewData = useCallback(async () => {
    if (!isConfigValid) return null;

    try {
      const config = {
        departmentId: selectedDepartment,
        academicYear: selectedAcademicYear,
        semester: selectedSemester,
        division: selectedDivision,
        startDate,
        endDate
      };

      const preview = await getSemesterPreview(config);
      return preview;
    } catch (error) {
      console.error('Error getting preview data:', error);
      setError('Failed to generate preview. Please try again.');
      return null;
    }
  }, [selectedDepartment, selectedAcademicYear, selectedSemester, selectedDivision, startDate, endDate, isConfigValid]);

  // Generate semester
  const handleGenerateSemester = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadingStates(prev => ({ ...prev, generating: true }));
      setError(null);

      // Validate configuration first
      const isValid = await validateConfiguration();
      if (!isValid) {
        throw new Error('Invalid semester configuration. Please check your settings.');
      }

      const semesterConfig = {
        departmentId: parseInt(selectedDepartment),
        academicYear: selectedAcademicYear,
        semester: selectedSemester,
        division: selectedDivision || null,
        startDate,
        endDate,
        preferences: {
          groupSize: 'auto', // Let backend determine optimal group size
          scheduleConflictResolution: 'auto',
          lecturerWorkloadBalancing: true,
          optimizeForMinimalGaps: true
        }
      };

      const result = await generateSemester(semesterConfig);
      
      if (result.success) {
        // Show success message with details
        const message = `
          Semester generated successfully!
          
          Details:
          - ${result.groups?.length || 0} student groups created
          - ${result.schedules?.length || 0} schedule entries generated
          - ${result.conflicts?.length || 0} conflicts resolved
          
          Semester ID: ${result.semesterId}
        `;
        alert(message);
        
        // Optionally redirect to semester view or reset form
        resetForm();
      } else {
        throw new Error(result.message || 'Failed to generate semester');
      }
    } catch (error) {
      console.error('Error generating semester:', error);
      setError(error.message || 'Failed to generate semester. Please try again.');
      alert(`Error: ${error.message || 'Failed to generate semester. Please try again.'}`);
    } finally {
      setIsLoading(false);
      setLoadingStates(prev => ({ ...prev, generating: false }));
    }
  }, [selectedDepartment, selectedAcademicYear, selectedSemester, selectedDivision, startDate, endDate, validateConfiguration]);

  // Reset form
  const resetForm = useCallback(() => {
    setSelectedDepartment('');
    setSelectedSemester('');
    setSelectedAcademicYear('');
    setSelectedDivision('');
    setStartDate('');
    setEndDate('');
    setActiveTab('overview');
    setShowPreview(false);
    setError(null);
    setValidationErrors({});
    setIsConfigValid(false);
    clearFilteredData();
  }, [clearFilteredData]);

  // Add student
  const handleAddStudent = useCallback(async (studentData) => {
    try {
      setLoadingStates(prev => ({ ...prev, students: true }));
      
      const newStudentData = {
        ...studentData,
        departmentId: parseInt(selectedDepartment),
        academicYear: selectedAcademicYear,
        status: 'active'
      };

      const createdStudent = await createStudent(newStudentData);
      
      // Refresh students list
      await loadFilteredData();
      
      setShowAddStudentForm(false);
      alert('Student added successfully!');
      
      return createdStudent;
    } catch (error) {
      console.error('Error adding student:', error);
      alert(`Error adding student: ${error.message || 'Please try again.'}`);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, students: false }));
    }
  }, [selectedDepartment, selectedAcademicYear, loadFilteredData]);

  // Add lecturer
  const handleAddLecturer = useCallback(async (lecturerData) => {
    try {
      setLoadingStates(prev => ({ ...prev, lecturers: true }));
      
      const newLecturerData = {
        ...lecturerData,
        departmentId: parseInt(selectedDepartment),
        status: 'active'
      };

      const createdLecturer = await createLecturer(newLecturerData);
      
      // Refresh lecturers list
      await loadFilteredData();
      
      setShowAddLecturerForm(false);
      alert('Lecturer added successfully!');
      
      return createdLecturer;
    } catch (error) {
      console.error('Error adding lecturer:', error);
      alert(`Error adding lecturer: ${error.message || 'Please try again.'}`);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, lecturers: false }));
    }
  }, [selectedDepartment, loadFilteredData]);

  // Add course
  const handleAddCourse = useCallback(async (courseData) => {
    try {
      setLoadingStates(prev => ({ ...prev, courses: true }));
      
      const newCourseData = {
        ...courseData,
        departmentId: parseInt(selectedDepartment),
        academicYear: selectedAcademicYear,
        semester: selectedSemester
      };

      const createdCourse = await createCourse(newCourseData);
      
      // Refresh courses list
      await loadFilteredData();
      
      setShowAddCourseForm(false);
      alert('Course added successfully!');
      
      return createdCourse;
    } catch (error) {
      console.error('Error adding course:', error);
      alert(`Error adding course: ${error.message || 'Please try again.'}`);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, courses: false }));
    }
  }, [selectedDepartment, selectedAcademicYear, selectedSemester, loadFilteredData]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadDepartments(),
      loadFilteredData()
    ]);
  }, [loadDepartments, loadFilteredData]);

  // Auto-validate when configuration changes
  useEffect(() => {
    if (selectedDepartment && selectedSemester && selectedAcademicYear && startDate && endDate) {
      validateConfiguration();
    } else {
      setIsConfigValid(false);
      setValidationErrors({});
    }
  }, [selectedDepartment, selectedSemester, selectedAcademicYear, startDate, endDate, validateConfiguration]);

  return {
    // Data
    mockDepartments: departments, // Keep legacy name for compatibility
    departments,
    currentDepartment,
    filteredStudents,
    filteredLecturers,
    filteredCourses,
    
    // Form state
    selectedDepartment,
    setSelectedDepartment,
    selectedSemester,
    setSelectedSemester,
    selectedAcademicYear,
    setSelectedAcademicYear,
    selectedDivision,
    setSelectedDivision,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    
    // UI state
    activeTab,
    setActiveTab,
    isLoading,
    showPreview,
    setShowPreview,
    showAddStudentForm,
    setShowAddStudentForm,
    showAddLecturerForm,
    setShowAddLecturerForm,
    showAddCourseForm,
    setShowAddCourseForm,
    
    // Error and validation state
    error,
    setError,
    loadingStates,
    validationErrors,
    isConfigValid,
    
    // Actions
    handleGenerateSemester,
    resetForm,
    handleAddStudent,
    handleAddLecturer,
    handleAddCourse,
    refreshData,
    loadDepartments,
    loadFilteredData,
    validateConfiguration,
    getPreviewData,
    
    // Utility functions
    clearError: () => setError(null),
    isDataLoading: Object.values(loadingStates).some(Boolean)
  };
};