import axios from 'axios';

const API_URL = 'http://localhost:8080/api/submissions';

axios.defaults.withCredentials = true;

/**
 * Fetches all submissions for a specific course.
 * @param {string} courseId The ID of the course.
 * @returns {Promise<Array>} A list of submission objects for the course.
 */
export const getSubmissionsByCourse = async (courseId) => {
    if (!courseId) return [];
    try {
        const response = await axios.get(`${API_URL}/course/${courseId}`);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching submissions for course:", error);
        return [];
    }
};

/**
 * Creates a new submission (e.g., a student submits homework).
 * @param {Object} submissionData The data for the new submission.
 * @returns {Promise<Object>} The newly created submission object.
 */
export const createSubmission = async (submissionData) => {
    try {
        const response = await axios.post(API_URL, submissionData);
        return response.data;
    } catch (error) {
        console.error("Error creating submission:", error);
        throw error;
    }
};