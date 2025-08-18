// src/Api/CommunityAPIs/storiesApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/community/stories';

// Set default axios configuration
axios.defaults.withCredentials = true;

/**
 * Get stories feed (current user + friends)
 * @param {string} userId - Current user ID
 * @param {Array} friendIds - Array of friend IDs
 * @returns {Promise<Object>} Stories feed response
 */
export const getStoriesFeed = async (userId, friendIds = []) => {
  try {
    const params = new URLSearchParams();
    params.append("userId", userId);
    friendIds.forEach((id) => params.append("friendIds", id));

    const response = await axios.get(`${BASE_URL}/feed?${params.toString()}`, {
      withCredentials: true,
    });
    
    return response.data;
  } catch (error) {
    return { stories: [] };
  }
};

/**
 * Create a new story
 * @param {Object} storyData - Story data (name, profilePic, text, img file)
 * @returns {Promise<Object>} Created story response
 */
export const createStory = async (storyData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add text fields
    formData.append("name", storyData.name);
    formData.append("profilePic", storyData.profilePic || "");
    formData.append("text", storyData.text || "");
    
    // Add image file if provided
    if (storyData.img) {
      formData.append("img", storyData.img);
    }
    
    const response = await axios.post(BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get stories by a specific user
 * @param {string} userId - ID of the user
 * @returns {Promise<Array>} Array of user's stories
 */
export const getUserStories = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${userId}`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Delete a story
 * @param {string} storyId - ID of the story to delete
 * @returns {Promise<Object>} Delete response
 */
export const deleteStory = async (storyId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${storyId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * View/increment view count for a story
 * @param {string} storyId - ID of the story viewed
 * @returns {Promise<Object>} View response
 */
export const viewStory = async (storyId) => {
  try {
    const response = await axios.post(`${BASE_URL}/${storyId}/view`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    return { success: false };
  }
};

/**
 * Get story viewers (who viewed a specific story)
 * @param {string} storyId - ID of the story
 * @returns {Promise<Array>} Array of viewers
 */
export const getStoryViewers = async (storyId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${storyId}/viewers`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Upload story media (image/video)
 * @param {File} mediaFile - Media file to upload
 * @returns {Promise<Object>} Upload response with media URL
 */
export const uploadStoryMedia = async (mediaFile) => {
  try {
    const formData = new FormData();
    formData.append('media', mediaFile);
    
    const response = await axios.post(`${BASE_URL}/upload-media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Report a story
 * @param {string} storyId - ID of the story to report
 * @param {Object} reportData - Report details (reason, description)
 * @returns {Promise<Object>} Report response
 */
export const reportStory = async (storyId, reportData) => {
  try {
    const response = await axios.post(`${BASE_URL}/${storyId}/report`, reportData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get trending/popular stories
 * @param {number} limit - Number of stories to fetch (default: 10)
 * @returns {Promise<Array>} Array of trending stories
 */
export const getTrendingStories = async (limit = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/trending?limit=${limit}`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Test connection to stories API
 * @returns {Promise<boolean>} True if connection successful
 */
export const testStoriesApiConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/test`, { withCredentials: true });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Helper function to handle stories API errors consistently
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 */
export const handleStoriesApiError = (error, operation) => {
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
        throw new Error('Story not found');
      case 413:
        throw new Error('File too large - please choose a smaller file');
      case 415:
        throw new Error('Unsupported file type - please use images or videos');
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
  getStoriesFeed,
  createStory,
  getUserStories,
  deleteStory,
  viewStory,
  getStoryViewers,
  uploadStoryMedia,
  reportStory,
  getTrendingStories,
  testStoriesApiConnection,
  handleStoriesApiError
};