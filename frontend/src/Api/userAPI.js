import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

axios.defaults.withCredentials = true;

/**
 * Fetches users based on their role.
 * @param {string} role - The role to fetch (e.g., '1300' for students, '1200' for lecturers).
 * @returns {Promise<Array>} A list of user objects.
 */
const getUsersByRole = async (role) => {
  try {
    const res = await axios.get(`${API_URL}/role/${role}`);
    return res.data || [];
  } catch (error) {
    console.error(`Error fetching users with role ${role}:`, error);
    return [];
  }
};

/**
 * Fetches all users with the 'student' role.
 */
export const fetchStudents = () => {
  return getUsersByRole("1300"); // Assuming '1300' is the role for students
};

/**
 * Fetches all users with the 'lecturer' role.
 */
export const fetchLecturers = () => {
  return getUsersByRole("1200"); // Assuming '1200' is the role for lecturers
};

/**
 * Fetches all users with the 'admin' role.
 */
export const fetchAdmins = () => {
  return getUsersByRole("1100"); // Assuming '1100' is the role for admins
};

/**
 * Fetches the full details for a list of users by their IDs.
 * @param {Array<string>} userIds - An array of user ID strings.
 * @returns {Promise<Array>} A list of user objects.
 */
export const getUsersByIds = async (userIds) => {
    // If the list of IDs is empty or not provided, return an empty array immediately.
    if (!userIds || userIds.length === 0) {
        return [];
    }
    
    try {
        // We use a POST request to send the list of IDs in the body.
        const response = await axios.post(`${API_URL}/by-ids`, userIds);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching users by IDs:", error);
        return [];
    }
};
