// src/Api/CommunityAPIs/notificationsApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/notifications';

// Set default axios configuration
axios.defaults.withCredentials = true;

/**
 * Get user's notifications
 * @param {Object} filters - Optional filters (type, isRead, page, size)
 * @returns {Promise<Array>} Array of notifications
 */
export const getNotifications = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.isRead !== undefined) params.append('isRead', filters.isRead);
    if (filters.page) params.append('page', filters.page);
    if (filters.size) params.append('size', filters.size);

    const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;
    const response = await axios.get(url, { withCredentials: true });
    
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Send a notification (for system/admin use)
 * @param {Object} notificationData - Notification data (recipientId, type, title, message, etc.)
 * @returns {Promise<Object>} Send response
 */
export const sendNotification = async (notificationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/send`, notificationData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark a specific notification as read
 * @param {string} notificationId - ID of the notification
 * @returns {Promise<Object>} Mark read response
 */
export const markNotificationRead = async (notificationId) => {
  try {
    const response = await axios.put(`${BASE_URL}/${notificationId}/read`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Mark all read response
 */
export const markAllNotificationsRead = async () => {
  try {
    const response = await axios.put(`${BASE_URL}/mark-all-read`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get unread notification count
 * @returns {Promise<Object>} Unread count response
 */
export const getNotificationCount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/count`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return { unreadCount: 0 };
  }
};

/**
 * Delete a notification
 * @param {string} notificationId - ID of the notification to delete
 * @returns {Promise<Object>} Delete response
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${notificationId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete all notifications
 * @param {Object} filters - Optional filters (type, isRead) to delete specific notifications
 * @returns {Promise<Object>} Delete all response
 */
export const deleteAllNotifications = async (filters = {}) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete-all`, {
      data: filters,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get notification preferences/settings
 * @returns {Promise<Object>} Notification preferences
 */
export const getNotificationPreferences = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/preferences`, { withCredentials: true });
    return response.data || {};
  } catch (error) {
    return {};
  }
};

/**
 * Update notification preferences/settings
 * @param {Object} preferences - Notification preference settings
 * @returns {Promise<Object>} Updated preferences response
 */
export const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await axios.put(`${BASE_URL}/preferences`, preferences, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get notification types/categories
 * @returns {Promise<Array>} Array of notification types
 */
export const getNotificationTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/types`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Send bulk notifications (for admin use)
 * @param {Object} bulkData - Bulk notification data (userIds, type, title, message)
 * @returns {Promise<Object>} Bulk send response
 */
export const sendBulkNotifications = async (bulkData) => {
  try {
    const response = await axios.post(`${BASE_URL}/send-bulk`, bulkData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Subscribe to push notifications
 * @param {Object} subscriptionData - Push subscription data
 * @returns {Promise<Object>} Subscription response
 */
export const subscribeToPushNotifications = async (subscriptionData) => {
  try {
    const response = await axios.post(`${BASE_URL}/push/subscribe`, subscriptionData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Unsubscribe from push notifications
 * @returns {Promise<Object>} Unsubscribe response
 */
export const unsubscribeFromPushNotifications = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/push/unsubscribe`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get notification history/archive
 * @param {Object} filters - Optional filters (dateFrom, dateTo, type, page, size)
 * @returns {Promise<Array>} Array of archived notifications
 */
export const getNotificationHistory = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page);
    if (filters.size) params.append('size', filters.size);

    const response = await axios.get(`${BASE_URL}/history?${params.toString()}`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Test connection to notifications API
 * @returns {Promise<boolean>} True if connection successful
 */
export const testNotificationsApiConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/test`, { withCredentials: true });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Helper function to handle notifications API errors consistently
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 */
export const handleNotificationsApiError = (error, operation) => {
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
        throw new Error('Notification not found');
      case 429:
        throw new Error('Too many requests - please wait and try again');
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
 * Helper function to format notification data
 * @param {Object} notification - Raw notification object
 * @returns {Object} Formatted notification
 */
export const formatNotification = (notification) => {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead || false,
    createdAt: notification.createdAt,
    data: notification.data || {},
    sender: notification.sender || null,
    priority: notification.priority || 'normal',
    actionUrl: notification.actionUrl || null
  };
};

/**
 * Helper function to group notifications by type
 * @param {Array} notifications - Array of notifications
 * @returns {Object} Notifications grouped by type
 */
export const groupNotificationsByType = (notifications) => {
  return notifications.reduce((groups, notification) => {
    const type = notification.type || 'general';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(notification);
    return groups;
  }, {});
};

/**
 * Helper function to get unread notifications
 * @param {Array} notifications - Array of notifications
 * @returns {Array} Array of unread notifications
 */
export const getUnreadNotifications = (notifications) => {
  return notifications.filter(notification => !notification.isRead);
};

// Export all functions as default for easy importing
export default {
  getNotifications,
  sendNotification,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationCount,
  deleteNotification,
  deleteAllNotifications,
  getNotificationPreferences,
  updateNotificationPreferences,
  getNotificationTypes,
  sendBulkNotifications,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getNotificationHistory,
  testNotificationsApiConnection,
  handleNotificationsApiError,
  formatNotification,
  groupNotificationsByType,
  getUnreadNotifications
};