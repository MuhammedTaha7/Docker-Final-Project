// src/Api/CommunityAPIs/communityUserApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/users';

// Set default axios configuration
axios.defaults.withCredentials = true;

/**
 * Get user profile by user ID
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/profile/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated profile response
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axios.put(`${BASE_URL}/profile`, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search users by query
 * @param {string} query - Search query
 * @param {Object} filters - Optional filters (page, size, etc.)
 * @returns {Promise<Array>} Array of users matching the search
 */
export const searchUsers = async (query, filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (query) params.append('q', query);
    if (filters.page) params.append('page', filters.page);
    if (filters.size) params.append('size', filters.size);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    
    const response = await axios.get(`${BASE_URL}/search?${params.toString()}`);
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Upload user avatar
 * @param {File} avatarFile - The avatar file to upload
 * @returns {Promise<Object>} Upload response with avatar URL
 */
export const uploadAvatar = async (avatarFile) => {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    const response = await axios.post(`${BASE_URL}/upload-avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Report a user
 * @param {string} userId - The ID of the user to report
 * @param {Object} reportData - Report details (reason, description, etc.)
 * @returns {Promise<Object>} Report submission response
 */
export const reportUser = async (userId, reportData) => {
  try {
    const response = await axios.post(`${BASE_URL}/report/${userId}`, reportData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user's own profile
 * @returns {Promise<Object>} Current user's profile data
 */
export const getCurrentUserProfile = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Test connection to user API
 * @returns {Promise<boolean>} True if connection successful
 */
export const testUserApiConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/test`);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Helper function to handle API errors consistently
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 */
export const handleUserApiError = (error, operation) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        throw new Error(data.message || 'Bad request - please check your input');
      case 401:
        throw new Error('Unauthorized - please log in again');
      case 403:
        throw new Error('Forbidden - you do not have permission');
      case 404:
        throw new Error('User not found');
      case 500:
        throw new Error('Server error - please try again later');
      default:
        throw new Error(data.message || 'An unexpected error occurred');
    }
  } else if (error.request) {
    throw new Error('Network error - please check your connection');
  } else {
    throw new Error('Request failed - please try again');
  }
};

/**
 * Build query parameters for user search
 * @param {Object} params - Parameters object
 * @returns {string} Query string
 */
export const buildUserSearchParams = (params) => {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      urlParams.append(key, value);
    }
  });
  return urlParams.toString();
};

// Export all functions as default for easy importing
export default {
  getUserProfile,
  updateUserProfile,
  searchUsers,
  uploadAvatar,
  reportUser,
  getCurrentUserProfile,
  testUserApiConnection,
  handleUserApiError,
  buildUserSearchParams
};