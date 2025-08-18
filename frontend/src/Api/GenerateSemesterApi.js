import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// API Endpoints
const STUDENTS_URL = `${API_BASE_URL}/students`;
const LECTURERS_URL = `${API_BASE_URL}/lecturers`;
const COURSES_URL = `${API_BASE_URL}/courses`;
const DEPARTMENTS_URL = `${API_BASE_URL}/departments`;
const SEMESTERS_URL = `${API_BASE_URL}/semesters`;
const SCHEDULES_URL = `${API_BASE_URL}/schedules`;
const ANALYTICS_URL = `${API_BASE_URL}/analytics`;
const CATEGORIES_URL = `${API_BASE_URL}/categories`;
const FILES_URL = `${API_BASE_URL}/files`;

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

// Add request interceptor for error handling
axios.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Response error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

/* ==================================================================
                            STUDENTS
   ================================================================== */

export const getAllStudents = async (filters = {}) => {
    try {
        const response = await axios.get(STUDENTS_URL, { params: filters });
        return response.data || [];
    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
};

export const getStudentById = async (studentId) => {
    try {
        const response = await axios.get(`${STUDENTS_URL}/${studentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching student with id ${studentId}:`, error);
        throw error;
    }
};

export const getStudentsByDepartment = async (departmentId, academicYear = null, division = null) => {
    try {
        const params = { departmentId };
        if (academicYear) params.academicYear = academicYear;
        if (division) params.division = division;
        
        const response = await axios.get(`${STUDENTS_URL}/by-department`, { params });
        return response.data || [];
    } catch (error) {
        console.error("Error fetching students by department:", error);
        return [];
    }
};

export const createStudent = async (studentData) => {
    try {
        const response = await axios.post(STUDENTS_URL, studentData);
        return response.data;
    } catch (error) {
        console.error("Error creating student:", error);
        throw error;
    }
};

export const updateStudent = async (studentId, studentData) => {
    try {
        const response = await axios.put(`${STUDENTS_URL}/${studentId}`, studentData);
        return response.data;
    } catch (error) {
        console.error("Error updating student:", error);
        throw error;
    }
};

export const deleteStudent = async (studentId) => {
    try {
        await axios.delete(`${STUDENTS_URL}/${studentId}`);
        return true;
    } catch (error) {
        console.error("Error deleting student:", error);
        throw error;
    }
};

export const getStudentEnrollments = async (studentId) => {
    try {
        const response = await axios.get(`${STUDENTS_URL}/${studentId}/enrollments`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching student enrollments:", error);
        return [];
    }
};

/* ==================================================================
                            LECTURERS
   ================================================================== */

export const getAllLecturers = async (filters = {}) => {
    try {
        const response = await axios.get(LECTURERS_URL, { params: filters });
        return response.data || [];
    } catch (error) {
        console.error("Error fetching lecturers:", error);
        return [];
    }
};

export const getLecturerById = async (lecturerId) => {
    try {
        const response = await axios.get(`${LECTURERS_URL}/${lecturerId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching lecturer with id ${lecturerId}:`, error);
        throw error;
    }
};

export const getLecturersByDepartment = async (departmentId) => {
    try {
        const response = await axios.get(`${LECTURERS_URL}/by-department/${departmentId}`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching lecturers by department:", error);
        return [];
    }
};

export const createLecturer = async (lecturerData) => {
    try {
        const response = await axios.post(LECTURERS_URL, lecturerData);
        return response.data;
    } catch (error) {
        console.error("Error creating lecturer:", error);
        throw error;
    }
};

export const updateLecturer = async (lecturerId, lecturerData) => {
    try {
        const response = await axios.put(`${LECTURERS_URL}/${lecturerId}`, lecturerData);
        return response.data;
    } catch (error) {
        console.error("Error updating lecturer:", error);
        throw error;
    }
};

export const deleteLecturer = async (lecturerId) => {
    try {
        await axios.delete(`${LECTURERS_URL}/${lecturerId}`);
        return true;
    } catch (error) {
        console.error("Error deleting lecturer:", error);
        throw error;
    }
};

export const getLecturerSchedule = async (lecturerId, startDate, endDate) => {
    try {
        const params = { startDate, endDate };
        const response = await axios.get(`${LECTURERS_URL}/${lecturerId}/schedule`, { params });
        return response.data || [];
    } catch (error) {
        console.error("Error fetching lecturer schedule:", error);
        return [];
    }
};

export const getLecturerAvailability = async (lecturerId, date) => {
    try {
        const response = await axios.get(`${LECTURERS_URL}/${lecturerId}/availability`, {
            params: { date }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching lecturer availability:", error);
        throw error;
    }
};

/* ==================================================================
                            COURSES
   ================================================================== */

export const getAllCourses = async (filters = {}) => {
    try {
        const response = await axios.get(COURSES_URL, { params: filters });
        return response.data || [];
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};

export const getCourseById = async (courseId) => {
    try {
        const response = await axios.get(`${COURSES_URL}/${courseId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching course with id ${courseId}:`, error);
        throw error;
    }
};

export const getCoursesByDepartment = async (departmentId, academicYear = null, semester = null) => {
    try {
        const params = { departmentId };
        if (academicYear) params.academicYear = academicYear;
        if (semester) params.semester = semester;
        
        const response = await axios.get(`${COURSES_URL}/by-department`, { params });
        return response.data || [];
    } catch (error) {
        console.error("Error fetching courses by department:", error);
        return [];
    }
};

export const createCourse = async (courseData) => {
    try {
        const response = await axios.post(COURSES_URL, courseData);
        return response.data;
    } catch (error) {
        console.error("Error creating course:", error);
        throw error;
    }
};

export const updateCourse = async (courseId, courseData) => {
    try {
        const response = await axios.put(`${COURSES_URL}/${courseId}`, courseData);
        return response.data;
    } catch (error) {
        console.error("Error updating course:", error);
        throw error;
    }
};

export const deleteCourse = async (courseId) => {
    try {
        await axios.delete(`${COURSES_URL}/${courseId}`);
        return true;
    } catch (error) {
        console.error("Error deleting course:", error);
        throw error;
    }
};

export const enrollStudentInCourse = async (courseId, enrollmentData) => {
    try {
        const response = await axios.post(`${COURSES_URL}/${courseId}/enroll`, enrollmentData);
        return response.data;
    } catch (error) {
        console.error("Error enrolling student:", error);
        throw error;
    }
};

export const getCourseEnrollments = async (courseId) => {
    try {
        const response = await axios.get(`${COURSES_URL}/${courseId}/enrollments`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching course enrollments:", error);
        return [];
    }
};

/* ==================================================================
                            DEPARTMENTS
   ================================================================== */

export const getAllDepartments = async () => {
    try {
        const response = await axios.get(DEPARTMENTS_URL);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching departments:", error);
        return [];
    }
};

export const getDepartmentById = async (departmentId) => {
    try {
        const response = await axios.get(`${DEPARTMENTS_URL}/${departmentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching department with id ${departmentId}:`, error);
        throw error;
    }
};

export const createDepartment = async (departmentData) => {
    try {
        const response = await axios.post(DEPARTMENTS_URL, departmentData);
        return response.data;
    } catch (error) {
        console.error("Error creating department:", error);
        throw error;
    }
};

export const updateDepartment = async (departmentId, departmentData) => {
    try {
        const response = await axios.put(`${DEPARTMENTS_URL}/${departmentId}`, departmentData);
        return response.data;
    } catch (error) {
        console.error("Error updating department:", error);
        throw error;
    }
};

export const deleteDepartment = async (departmentId) => {
    try {
        await axios.delete(`${DEPARTMENTS_URL}/${departmentId}`);
        return true;
    } catch (error) {
        console.error("Error deleting department:", error);
        throw error;
    }
};

export const getDepartmentStatistics = async (departmentId, academicYear = null) => {
    try {
        const params = academicYear ? { academicYear } : {};
        const response = await axios.get(`${DEPARTMENTS_URL}/${departmentId}/statistics`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching department statistics:", error);
        throw error;
    }
};

/* ==================================================================
                        SEMESTER MANAGEMENT
   ================================================================== */

export const getAllSemesters = async (filters = {}) => {
    try {
        const response = await axios.get(SEMESTERS_URL, { params: filters });
        return response.data || [];
    } catch (error) {
        console.error("Error fetching semesters:", error);
        return [];
    }
};

export const getSemesterById = async (semesterId) => {
    try {
        const response = await axios.get(`${SEMESTERS_URL}/${semesterId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching semester with id ${semesterId}:`, error);
        throw error;
    }
};

export const createSemester = async (semesterData) => {
    try {
        const response = await axios.post(SEMESTERS_URL, semesterData);
        return response.data;
    } catch (error) {
        console.error("Error creating semester:", error);
        throw error;
    }
};

export const updateSemester = async (semesterId, semesterData) => {
    try {
        const response = await axios.put(`${SEMESTERS_URL}/${semesterId}`, semesterData);
        return response.data;
    } catch (error) {
        console.error("Error updating semester:", error);
        throw error;
    }
};

export const deleteSemester = async (semesterId) => {
    try {
        await axios.delete(`${SEMESTERS_URL}/${semesterId}`);
        return true;
    } catch (error) {
        console.error("Error deleting semester:", error);
        throw error;
    }
};

// Main semester generation function
export const generateSemester = async (semesterConfig) => {
    try {
        const response = await axios.post(`${SEMESTERS_URL}/generate`, semesterConfig);
        return response.data;
    } catch (error) {
        console.error("Error generating semester:", error);
        throw error;
    }
};

export const getSemesterPreview = async (semesterConfig) => {
    try {
        const response = await axios.post(`${SEMESTERS_URL}/preview`, semesterConfig);
        return response.data;
    } catch (error) {
        console.error("Error getting semester preview:", error);
        throw error;
    }
};

export const validateSemesterConfig = async (semesterConfig) => {
    try {
        const response = await axios.post(`${SEMESTERS_URL}/validate`, semesterConfig);
        return response.data;
    } catch (error) {
        console.error("Error validating semester config:", error);
        throw error;
    }
};

export const getSemesterStatistics = async (semesterId) => {
    try {
        const response = await axios.get(`${SEMESTERS_URL}/${semesterId}/statistics`);
        return response.data;
    } catch (error) {
        console.error("Error fetching semester statistics:", error);
        throw error;
    }
};

/* ==================================================================
                            SCHEDULES
   ================================================================== */

export const getSchedulesBySemester = async (semesterId) => {
    try {
        const response = await axios.get(`${SCHEDULES_URL}/by-semester/${semesterId}`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching schedules by semester:", error);
        return [];
    }
};

export const getSchedulesByGroup = async (groupId) => {
    try {
        const response = await axios.get(`${SCHEDULES_URL}/by-group/${groupId}`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching schedules by group:", error);
        return [];
    }
};

export const getSchedulesByLecturer = async (lecturerId, startDate, endDate) => {
    try {
        const params = { startDate, endDate };
        const response = await axios.get(`${SCHEDULES_URL}/by-lecturer/${lecturerId}`, { params });
        return response.data || [];
    } catch (error) {
        console.error("Error fetching schedules by lecturer:", error);
        return [];
    }
};

export const createSchedule = async (scheduleData) => {
    try {
        const response = await axios.post(SCHEDULES_URL, scheduleData);
        return response.data;
    } catch (error) {
        console.error("Error creating schedule:", error);
        throw error;
    }
};

export const updateSchedule = async (scheduleId, scheduleData) => {
    try {
        const response = await axios.put(`${SCHEDULES_URL}/${scheduleId}`, scheduleData);
        return response.data;
    } catch (error) {
        console.error("Error updating schedule:", error);
        throw error;
    }
};

export const deleteSchedule = async (scheduleId) => {
    try {
        await axios.delete(`${SCHEDULES_URL}/${scheduleId}`);
        return true;
    } catch (error) {
        console.error("Error deleting schedule:", error);
        throw error;
    }
};

export const checkScheduleConflicts = async (scheduleData) => {
    try {
        const response = await axios.post(`${SCHEDULES_URL}/check-conflicts`, scheduleData);
        return response.data;
    } catch (error) {
        console.error("Error checking schedule conflicts:", error);
        throw error;
    }
};

export const optimizeSchedule = async (semesterId, preferences = {}) => {
    try {
        const response = await axios.post(`${SCHEDULES_URL}/optimize/${semesterId}`, preferences);
        return response.data;
    } catch (error) {
        console.error("Error optimizing schedule:", error);
        throw error;
    }
};

/* ==================================================================
                            ANALYTICS
   ================================================================== */

export const getCourseAnalytics = async (courseId, year) => {
    try {
        const response = await axios.get(`${ANALYTICS_URL}/course/${courseId}`, {
            params: { year }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching course analytics:", error);
        throw error;
    }
};

export const getDepartmentAnalytics = async (departmentId, year) => {
    try {
        const response = await axios.get(`${ANALYTICS_URL}/department/${departmentId}`, {
            params: { year }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching department analytics:", error);
        throw error;
    }
};

export const getSemesterAnalytics = async (semesterId) => {
    try {
        const response = await axios.get(`${ANALYTICS_URL}/semester/${semesterId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching semester analytics:", error);
        throw error;
    }
};

export const getSystemAnalytics = async (startDate, endDate) => {
    try {
        const params = { startDate, endDate };
        const response = await axios.get(`${ANALYTICS_URL}/system`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching system analytics:", error);
        throw error;
    }
};

export const getUtilizationReports = async (departmentId, startDate, endDate) => {
    try {
        const params = { departmentId, startDate, endDate };
        const response = await axios.get(`${ANALYTICS_URL}/utilization`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching utilization reports:", error);
        throw error;
    }
};

/* ==================================================================
                            CATEGORIES
   ================================================================== */

export const getCategoriesByCourse = async (courseId, year) => {
    try {
        const response = await axios.get(`${CATEGORIES_URL}/by-course/${courseId}`, {
            params: { year }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching categories by course:", error);
        throw error;
    }
};

export const createCategory = async (courseId, year, categoryData) => {
    try {
        const response = await axios.post(CATEGORIES_URL, categoryData, {
            params: { courseId, year }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await axios.put(`${CATEGORIES_URL}/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        await axios.delete(`${CATEGORIES_URL}/${categoryId}`);
        return true;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};

/* ==================================================================
                              FILES
   ================================================================== */

export const uploadFile = async (categoryId, file, metadata = {}) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        Object.keys(metadata).forEach(key => {
            formData.append(key, metadata[key]);
        });
        
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
        return true;
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
        console.error("Error fetching files for category:", error);
        return [];
    }
};

export const downloadFile = async (fileId) => {
    try {
        const response = await axios.get(`${FILES_URL}/download/${fileId}`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error("Error downloading file:", error);
        throw error;
    }
};

export const getFileMetadata = async (fileId) => {
    try {
        const response = await axios.get(`${FILES_URL}/${fileId}/metadata`);
        return response.data;
    } catch (error) {
        console.error("Error fetching file metadata:", error);
        throw error;
    }
};

/* ==================================================================
                        UTILITY FUNCTIONS
   ================================================================== */

export const checkServerHealth = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/health`);
        return response.data;
    } catch (error) {
        console.error("Error checking server health:", error);
        return { status: 'error', message: 'Server unreachable' };
    }
};

export const getSystemInfo = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/system/info`);
        return response.data;
    } catch (error) {
        console.error("Error fetching system info:", error);
        throw error;
    }
};

// Export all API functions as a grouped object for easier imports
export const API = {
    // Students
    students: {
        getAll: getAllStudents,
        getById: getStudentById,
        getByDepartment: getStudentsByDepartment,
        create: createStudent,
        update: updateStudent,
        delete: deleteStudent,
        getEnrollments: getStudentEnrollments,
    },
    
    // Lecturers
    lecturers: {
        getAll: getAllLecturers,
        getById: getLecturerById,
        getByDepartment: getLecturersByDepartment,
        create: createLecturer,
        update: updateLecturer,
        delete: deleteLecturer,
        getSchedule: getLecturerSchedule,
        getAvailability: getLecturerAvailability,
    },
    
    // Courses
    courses: {
        getAll: getAllCourses,
        getById: getCourseById,
        getByDepartment: getCoursesByDepartment,
        create: createCourse,
        update: updateCourse,
        delete: deleteCourse,
        enrollStudent: enrollStudentInCourse,
        getEnrollments: getCourseEnrollments,
    },
    
    // Departments
    departments: {
        getAll: getAllDepartments,
        getById: getDepartmentById,
        create: createDepartment,
        update: updateDepartment,
        delete: deleteDepartment,
        getStatistics: getDepartmentStatistics,
    },
    
    // Semesters
    semesters: {
        getAll: getAllSemesters,
        getById: getSemesterById,
        create: createSemester,
        update: updateSemester,
        delete: deleteSemester,
        generate: generateSemester,
        getPreview: getSemesterPreview,
        validate: validateSemesterConfig,
        getStatistics: getSemesterStatistics,
    },
    
    // Schedules
    schedules: {
        getBySemester: getSchedulesBySemester,
        getByGroup: getSchedulesByGroup,
        getByLecturer: getSchedulesByLecturer,
        create: createSchedule,
        update: updateSchedule,
        delete: deleteSchedule,
        checkConflicts: checkScheduleConflicts,
        optimize: optimizeSchedule,
    },
    
    // Analytics
    analytics: {
        getCourse: getCourseAnalytics,
        getDepartment: getDepartmentAnalytics,
        getSemester: getSemesterAnalytics,
        getSystem: getSystemAnalytics,
        getUtilization: getUtilizationReports,
    },
    
    // Categories
    categories: {
        getByCourse: getCategoriesByCourse,
        create: createCategory,
        update: updateCategory,
        delete: deleteCategory,
    },
    
    // Files
    files: {
        upload: uploadFile,
        delete: deleteFile,
        getByCategory: getFilesByCategory,
        download: downloadFile,
        getMetadata: getFileMetadata,
    },
    
    // System
    system: {
        checkHealth: checkServerHealth,
        getInfo: getSystemInfo,
    }
};

export default API;