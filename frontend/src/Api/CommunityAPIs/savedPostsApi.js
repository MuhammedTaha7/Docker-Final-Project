// src/Api/CommunityAPIs/savedPostsApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/community/posts';

// Set default axios configuration
axios.defaults.withCredentials = true;

/**
 * Get all saved posts for the current user
 * @returns {Promise<Array>} Array of saved posts
 */
export const getSavedPosts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/saved`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    console.error('Failed to get saved posts:', error);
    return [];
  }
};

/**
 * Save a post
 * @param {string} postId - ID of the post to save
 * @returns {Promise<Object>} Response data
 */
export const savePost = async (postId) => {
  try {
    const response = await axios.post(`${BASE_URL}/${postId}/save`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Failed to save post:', error);
    throw error;
  }
};

/**
 * Unsave a post
 * @param {string} postId - ID of the post to unsave
 * @returns {Promise<Object>} Response data
 */
export const unsavePost = async (postId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${postId}/save`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Failed to unsave post:', error);
    throw error;
  }
};

/**
 * Check if a post is saved
 * @param {string} postId - ID of the post to check
 * @returns {Promise<boolean>} True if post is saved
 */
export const isPostSaved = async (postId) => {
  try {
    const response = await axios.get(`${BASE_URL}/check/${postId}`, { withCredentials: true });
    return response.data.saved || false;
  } catch (error) {
    console.error('Failed to check if post is saved:', error);
    return false;
  }
};

/**
 * Get saved posts count
 * @returns {Promise<number>} Number of saved posts
 */
export const getSavedPostsCount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/count`, { withCredentials: true });
    return response.data.count || 0;
  } catch (error) {
    console.error('Failed to get saved posts count:', error);
    return 0;
  }
};

/**
 * Clear all saved posts
 * @returns {Promise<Object>} Response data
 */
export const clearAllSavedPosts = async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/clear`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Failed to clear saved posts:', error);
    throw error;
  }
};

export default {
  getSavedPosts,
  savePost,
  unsavePost,
  isPostSaved,
  getSavedPostsCount,
  clearAllSavedPosts
};