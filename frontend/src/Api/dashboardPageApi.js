import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/dashboard';
const COURSES_URL = 'http://localhost:8080/api/courses';
const USERS_URL = 'http://localhost:8080/api/users';

// Set default axios configuration to send cookies with requests
axios.defaults.withCredentials = true;

/* ==================================================================
                      PRIMARY DASHBOARD LOADER
   ================================================================== */

export const getDashboardData = async (userRole) => {
  try {
    const response = await axios.get(`${BASE_URL}/complete/${userRole}`);
    return response.data || {
      stats: {},
      charts: {},
      assignments: [],
    };
  } catch (error) {
    console.error(`Error fetching complete dashboard data for role ${userRole}:`, error);
    return {
      stats: { userCount: 0, departmentCount: 0, systemLoad: '0%' },
      charts: { departmentEnrollment: [], systemUsage: [], annualEnrollment: [] },
      assignments: [],
    };
  }
};


/* ==================================================================
                        ASSIGNMENTS (CRUD)
   ================================================================== */

export const addAssignment = async (assignmentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/assignments`, assignmentData);
    return response.data;
  } catch (error) {
    console.error("Error adding assignment:", error);
    throw error;
  }
};

export const updateAssignment = async (assignmentId, assignmentData) => {
  try {
    const response = await axios.put(`${BASE_URL}/assignments/${assignmentId}`, assignmentData);
    return response.data;
  } catch (error) {
    console.error("Error updating assignment:", error);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId) => {
  try {
    await axios.delete(`${BASE_URL}/assignments/${assignmentId}`);
  } catch (error) {
    console.error("Error deleting assignment:", error);
    throw error;
  }
};


/* ==================================================================
                            FORM DATA
   ================================================================== */

export const getAllCourses = async () => {
    try {
        const response = await axios.get(COURSES_URL);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
}

/**
 * --- NEW ---
 * Fetches the list of all available lecturers (users with role '1200').
 * This will be used to populate the 'Instructor' dropdown in the assignment form.
 * @returns {Promise<Array>} An array of lecturer user objects.
 */
export const getAllLecturers = async () => {
    try {
        // Assuming '1200' is the role code for lecturers
        const response = await axios.get(`${USERS_URL}/role/1200`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching lecturers:", error);
        return [];
    }
}

/**
 * Fetches all data needed for the assignment form's select/dropdown fields.
 * @returns {Promise<Object>} An object containing arrays for 'courses' and 'instructors'.
 */
export const getAssignmentFormOptions = async () => {
    try {
        // We can fetch both lists in parallel for better performance
        const [coursesResponse, lecturersResponse] = await Promise.all([
            getAllCourses(),
            getAllLecturers()
        ]);
        
        return {
            courses: coursesResponse,
            instructors: lecturersResponse
        };
    } catch (error) {
        console.error("Error fetching form options:", error);
        return { courses: [], instructors: [] };
    }
}
