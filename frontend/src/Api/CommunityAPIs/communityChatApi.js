// src/Api/communityChatApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/chat';

// Set default axios configuration for chat API
axios.defaults.withCredentials = true;

export const fetchCommunityChatMessages = async (user1Id, user2Id) => {
  try {
    const response = await axios.get(`${BASE_URL}/community/${user1Id}/${user2Id}`);
    return response.data || [];
  } catch (error) {
    return [];
  }
};

export const fetchCommunityConversations = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/conversations/${userId}?context=community`);
    return response.data || [];
  } catch (error) {
    return [];
  }
};

export const getCommunityUnreadCount = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/unread/${userId}?context=community`);
    return response.data.unreadCount || 0;
  } catch (error) {
    return 0;
  }
};

export const markCommunityMessagesAsRead = async (receiverId, senderId) => {
  try {
    const response = await axios.put(`${BASE_URL}/mark-read`, {
      receiverId,
      senderId,
      context: 'community'
    });
    return response.data;
  } catch (error) {
    return { success: false };
  }
};

// Test connection to backend
export const testCommunityApiConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/test`);
    return true;
  } catch (error) {
    return false;
  }
};