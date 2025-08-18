// src/Api/CommunityAPIs/chatApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/chat';

// Set default axios configuration
axios.defaults.withCredentials = true;

/**
 * Fetches chat messages between two users in the community context.
 * @param {string} user1Id - The ID of the first user.
 * @param {string} user2Id - The ID of the second user (contact).
 * @returns {Promise<Array>} Array of chat messages.
 */
export const fetchChatMessages = async (user1Id, user2Id) => {
  try {
    const response = await axios.get(`${BASE_URL}/community/${user1Id}/${user2Id}`, {
      withCredentials: true
    });
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch community chat messages:', error);
    return [];
  }
};

/**
 * Gets the unread message count for a user in the community context.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<number>} The unread message count.
 */
export const getUnreadCount = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/unread/${userId}?context=community`, {
      withCredentials: true
    });
    return response.data || 0;
  } catch (error) {
    console.error('Failed to get community unread count:', error);
    return 0;
  }
};

/**
 * Marks messages as read between two users in the community context.
 * @param {string} receiverId - The ID of the receiver (current user).
 * @param {string} senderId - The ID of the sender (contact).
 * @returns {Promise<Object>} Response data from the server.
 */
export const markMessagesAsRead = async (receiverId, senderId) => {
  try {
    const response = await axios.put(`${BASE_URL}/mark-read`, {
      receiverId,
      senderId,
      context: 'community'
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Failed to mark community messages as read:', error);
    throw error;
  }
};

/**
 * Sends a chat message.
 * @param {Object} message - Message object with senderId, receiverId, content, and context.
 * @returns {Promise<Object>} Response data.
 */
export const sendChatMessage = async (message) => {
  try {
    const response = await axios.post(`${BASE_URL}/send`, message, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send chat message:', error);
    throw error;
  }
};

/**
 * Get chat history for a user in the community context.
 * @param {string} userId - User ID.
 * @returns {Promise<Array>} Array of chat conversations.
 */
export const getChatHistory = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/conversations/${userId}?context=community`, {
      withCredentials: true
    });
    return response.data || [];
  } catch (error) {
    console.error('Failed to get chat history:', error);
    return [];
  }
};

/**
 * Delete a chat message.
 * @param {string} messageId - Message ID to delete.
 * @returns {Promise<Object>} Response data.
 */
export const deleteChatMessage = async (messageId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/message/${messageId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete chat message:', error);
    throw error;
  }
};

// Test connection to backend
export const testChatApiConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/test`);
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  fetchChatMessages,
  getUnreadCount,
  markMessagesAsRead,
  sendChatMessage,
  getChatHistory,
  deleteChatMessage,
  testChatApiConnection
};