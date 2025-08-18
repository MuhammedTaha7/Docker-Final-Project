// src/Api/messagesPageApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Use axios instance with credentials for cookie-based authentication
const api = axios.create({
  withCredentials: true,
  baseURL: API_BASE_URL,
});

// --- User Endpoints ---
export const fetchAdmins = async () => {
  const response = await api.get('/users/role/1100');
  return response.data;
};

export const fetchLecturers = async () => {
  const response = await api.get('/users/role/1200');
  return response.data;
};

// 🆕 NEW: API function to fetch users by role
export const fetchUsersByRole = async (roleCode) => {
    const response = await api.get(`/users/role/${roleCode}`);
    return response.data;
};

// --- Messages Endpoints ---

export const fetchReceivedMessages = async () => {
  const response = await api.get('/messages/received');
  return response.data;
};

export const fetchSentMessages = async () => {
  const response = await api.get('/messages/sent');
  return response.data;
};

export const fetchMessageById = async (messageId) => {
  const response = await api.get(`/messages/${messageId}`);
  return response.data;
};

export const createMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

export const sendMessageReply = async (messageId, replyData) => {
  const response = await api.post(`/messages/${messageId}/reply`, replyData);
  return response.data;
};

// --- Announcements Endpoints ---

export const fetchAnnouncements = async () => {
  const response = await api.get('/announcements');
  return response.data;
};

export const fetchAnnouncementById = async (announcementId) => {
  const response = await api.get(`/announcements/${announcementId}`);
  return response.data;
};

export const createAnnouncement = async (announcementData) => {
  const response = await api.post('/announcements', announcementData);
  return response.data;
};

export const updateAnnouncement = async (announcementId, announcementData) => {
  const response = await api.put(`/announcements/${announcementId}`, announcementData);
  return response.data;
};

export const duplicateAnnouncement = async (announcementId, announcementData) => {
  const response = await api.post(`/announcements/${announcementId}/duplicate`, announcementData);
  return response.data;
};

export const deleteAnnouncement = async (announcementId) => {
  const response = await api.delete(`/announcements/${announcementId}`);
  return response.data;
};

// --- Templates Endpoints ---

export const fetchTemplates = async () => {
  const response = await api.get('/templates');
  return response.data;
};

export const fetchTemplateById = async (templateId) => {
  const response = await api.get(`/templates/${templateId}`);
  return response.data;
};

export const createTemplate = async (templateData) => {
  const response = await api.post('/templates', templateData);
  return response.data;
};

export const updateTemplate = async (templateId, templateData) => {
  const response = await api.put(`/templates/${templateId}`, templateData);
  return response.data;
};

export const useTemplate = async (templateId, templateData) => {
  const response = await api.post(`/templates/${templateId}/use`, templateData);
  return response.data;
};

export const deleteTemplate = async (templateId) => {
  const response = await api.delete(`/templates/${templateId}`);
  return response.data;
};

// --- Files Endpoints ---

export const fetchFiles = async () => {
  const response = await api.get('/files');
  return response.data;
};

export const fetchFileById = async (fileId) => {
  const response = await api.get(`/files/${fileId}`);
  return response.data;
};

export const uploadFile = async (file, fileMetadata) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Append other metadata fields from your form
  for (const key in fileMetadata) {
    if (Object.prototype.hasOwnProperty.call(fileMetadata, key)) {
      formData.append(key, fileMetadata[key]);
    }
  }

  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteFile = async (fileId) => {
  const response = await api.delete(`/files/${fileId}`);
  return response.data;
};