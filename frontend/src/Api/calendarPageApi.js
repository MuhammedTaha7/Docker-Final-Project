import axios from 'axios';

// Define the base URLs for our different calendar-related endpoints
const USERS_API_URL = 'http://localhost:8080/api/users';
const CALENDAR_API_URL = 'http://localhost:8080/api/calendar';
const ASSIGNMENT_API_URL = 'http://localhost:8080/api/dashboard/assignments';
const COURSES_API_URL = 'http://localhost:8080/api/courses';

// Ensure cookies (like the JWT auth) are sent with every request
axios.defaults.withCredentials = true;

/**
 * ✅ UPDATED
 * Fetches calendar items, now with optional filtering.
 * @param {Date} weekStartDate - The start date of the week.
 * @param {Object} filters - An object containing filter criteria (e.g., { courseId, instructorId }).
 * @returns {Promise<Array>}
 */
export const getCalendarEvents = async (weekStartDate, filters = {}) => {
    const dateString = weekStartDate.toISOString().split('T')[0];
    try {
        const response = await axios.get(`${CALENDAR_API_URL}/events`, {
            params: { 
                weekStartDate: dateString,
                ...filters // Pass the filter object to the backend
            }
        });
        return response.data || [];
    } catch (error) {
        console.error("Error fetching calendar events:", error);
        return [];
    }
};

/**
 * ✅ NEW
 * Fetches all courses to populate the filter dropdown.
 * @returns {Promise<Array>} A promise that resolves to an array of course objects.
 */
export const getAllCourses = async () => {
    try {
        const response = await axios.get(COURSES_API_URL);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};

export const getAllLecturers = async () => {
    try {
        const response = await axios.get(`${USERS_API_URL}/role/1200`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching lecturers:", error);
        return [];
    }
};

export const addEvent = async (eventData) => {
    try {
        const response = await axios.post(`${CALENDAR_API_URL}/events`, eventData);
        return response.data;
    } catch (error) {
        console.error("Error adding event:", error);
        throw error;
    }
};

export const deleteEvent = async (eventId) => {
    try {
        await axios.delete(`${CALENDAR_API_URL}/events/${eventId}`);
    } catch (error) {
        console.error("Error deleting scheduled event:", error);
        throw error;
    }
};

export const getEventRuleById = async (eventId) => {
    try {
        const response = await axios.get(`${CALENDAR_API_URL}/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching event rule:", error);
        throw error;
    }
};

export const updateEvent = async (eventId, eventData) => {
    try {
        const response = await axios.put(`${CALENDAR_API_URL}/events/${eventId}`, eventData);
        return response.data;
    } catch (error) {
        console.error("Error updating event:", error);
        throw error;
    }
};

export const addAssignment = async (assignmentData) => {
    try {
        const response = await axios.post(ASSIGNMENT_API_URL, assignmentData);
        return response.data;
    } catch (error) {
        console.error("Error adding assignment:", error);
        throw error;
    }
};

export const updateAssignment = async (assignmentId, assignmentData) => {
    try {
        const response = await axios.put(`${ASSIGNMENT_API_URL}/${assignmentId}`, assignmentData);
        return response.data;
    } catch (error) {
        console.error("Error updating assignment:", error);
        throw error;
    }
};

export const deleteAssignment = async (assignmentId) => {
    try {
        await axios.delete(`${ASSIGNMENT_API_URL}/${assignmentId}`);
    } catch (error) {
        console.error("Error deleting assignment:", error);
        throw error;
    }
};