// src/Api/CommunityAPIs/friendsApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/friends';

// Set default axios configuration
axios.defaults.withCredentials = true;

/**
 * Get user's friend list
 * @param {string} status - Optional status filter ('online', etc.)
 * @returns {Promise<Array>} Array of friends
 */
export const getFriends = async (status = null) => {
  try {
    const url = status ? `${BASE_URL}?status=${status}` : BASE_URL;
    const response = await axios.get(url, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Get friend suggestions for the current user
 * @returns {Promise<Array>} Array of suggested users
 */
export const getFriendSuggestions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/suggestions`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Get incoming friend requests
 * @returns {Promise<Array>} Array of friend requests
 */
export const getFriendRequests = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/requests`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Send a friend request to a user
 * @param {string} userId - ID of user to send request to
 * @returns {Promise<Object>} Request response
 */
export const sendFriendRequest = async (userId) => {
  try {
    const response = await axios.post(`${BASE_URL}/request/${userId}`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Accept a friend request
 * @param {string} userId - ID of user who sent the request
 * @returns {Promise<Object>} Accept response
 */
export const acceptFriendRequest = async (userId) => {
  try {
    const response = await axios.put(`${BASE_URL}/accept/${userId}`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject a friend request
 * @param {string} userId - ID of user who sent the request
 * @returns {Promise<Object>} Reject response
 */
export const rejectFriendRequest = async (userId) => {
  try {
    const response = await axios.put(`${BASE_URL}/reject/${userId}`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Remove a friend from friends list
 * @param {string} userId - ID of friend to remove
 * @returns {Promise<Object>} Remove response
 */
export const removeFriend = async (userId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/remove/${userId}`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get friendship status with a specific user
 * @param {string} userId - ID of user to check status with
 * @returns {Promise<Object>} Friendship status object
 */
export const getFriendshipStatus = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/status/${userId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return { status: 'none' }; // Default fallback
  }
};

/**
 * Get friends' activities/timeline
 * @returns {Promise<Array>} Array of friend activities
 */
export const getFriendsActivities = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/activities`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Dismiss a friend suggestion
 * @param {string} userId - ID of user to dismiss from suggestions
 * @returns {Promise<Object>} Dismiss response
 */
export const dismissSuggestion = async (userId) => {
  try {
    const response = await axios.post(`${BASE_URL}/dismiss-suggestion/${userId}`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Test connection to friends API
 * @returns {Promise<boolean>} True if connection successful
 */
export const testFriendsApiConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/test`, { withCredentials: true });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Helper function to handle friends API errors consistently
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 */
export const handleFriendsApiError = (error, operation) => {
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
      case 409:
        throw new Error('Friend request already exists or user is already a friend');
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

// Export all functions as default for easy importing
export default {
  getFriends,
  getFriendSuggestions,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriendshipStatus,
  getFriendsActivities,
  dismissSuggestion,
  testFriendsApiConnection,
  handleFriendsApiError
};