// src/Api/CommunityAPIs/cvApi.js - Updated for unified backend
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/cv';
const AI_BASE_URL = 'http://localhost:8080/api/cv/ai';

// Set default axios configuration
axios.defaults.withCredentials = true;

/**
 * Get user's CV data
 * @returns {Promise<Object>} CV data
 */
export const getCV = async () => {
  try {
    const response = await axios.get(BASE_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching CV:', error);
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Save/Update CV data (unified approach)
 * @param {Object} cvData - CV form data (name, title, summary, education, etc.)
 * @returns {Promise<Object>} Saved CV data
 */
export const saveCV = async (cvData) => {
  try {
    const response = await axios.post(BASE_URL, cvData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error saving CV:', error);
    throw error;
  }
};

/**
 * Delete CV data
 * @returns {Promise<Object>} Delete response
 */
export const deleteCV = async () => {
  try {
    const response = await axios.delete(BASE_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error deleting CV:', error);
    throw error;
  }
};

/**
 * Upload CV file (PDF)
 * @param {File} cvFile - CV file to upload
 * @returns {Promise<Object>} Upload response
 */
export const uploadCV = async (cvFile) => {
  try {
    const formData = new FormData();
    formData.append('cv', cvFile);
    
    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading CV:', error);
    throw error;
  }
};

/**
 * Download CV file
 * @returns {Promise<Blob>} CV file blob
 */
export const downloadCV = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/download`, {
      withCredentials: true,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading CV:', error);
    throw error;
  }
};

/**
 * Enhanced AI CV generation using your unified backend
 * @param {string} type - Type of generation ('full', 'summary', 'experience', etc.)
 * @param {string} input - Input text for AI processing
 * @returns {Promise<Object>} AI generated CV data
 */
export const generateCVWithAI = async (type, input) => {
  try {    
    const response = await axios.post(`${AI_BASE_URL}/generate`, {
      type: type,
      input: input
    }, { withCredentials: true });
    
    return response.data;
  } catch (error) {
    console.error('Error generating CV with AI:', error);
    throw error;
  }
};

/**
 * Legacy AI extract CV data from text (kept for compatibility)
 * @param {string} text - Text to extract CV data from
 * @returns {Promise<Object>} Extracted CV data
 */
export const aiExtractCV = async (text) => {
  try {
    const response = await axios.post(`${BASE_URL}/ai-extract`, {
      text: text
    }, { withCredentials: true });
    
    return response.data;
  } catch (error) {
    console.error('Error in AI CV extraction:', error);
    throw error;
  }
};

/**
 * Get CV for specific user (for job applications viewing)
 * @param {string} userId - User ID whose CV to fetch
 * @returns {Promise<Object>} User's CV data
 */
export const getUserCV = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${userId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching user CV:', error);
    throw error;
  }
};

/**
 * Download CV for specific applicant (for employers)
 * @param {string} applicantId - ID of the applicant
 * @returns {Promise<Blob>} CV file blob
 */
export const downloadApplicantCV = async (applicantId) => {
  try {
    const response = await axios.get(`${BASE_URL}/download/${applicantId}`, {
      withCredentials: true,
      responseType: 'blob'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error downloading applicant CV:', error);
    throw error;
  }
};

/**
 * Generate CV PDF from data
 * @param {Object} cvData - CV data
 * @param {string} template - Template style (optional)
 * @returns {Promise<Blob>} Generated PDF blob
 */
export const generateCVPDF = async (cvData, template = 'professional') => {
  try {
    const response = await axios.post(`${BASE_URL}/generate-pdf`, {
      ...cvData,
      template
    }, {
      withCredentials: true,
      responseType: 'blob'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating CV PDF:', error);
    throw error;
  }
};

/**
 * Parse CV file to extract data
 * @param {File} cvFile - CV file to parse
 * @returns {Promise<Object>} Extracted CV data
 */
export const parseCVFile = async (cvFile) => {
  try {
    const formData = new FormData();
    formData.append('cv', cvFile);
    
    const response = await axios.post(`${BASE_URL}/parse`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error parsing CV file:', error);
    throw error;
  }
};

/**
 * Improve existing CV section with AI
 * @param {string} section - Section to improve ('summary', 'experience', etc.)
 * @param {string} currentContent - Current content of the section
 * @returns {Promise<Object>} Improved content
 */
export const improveCVSection = async (section, currentContent) => {
  try {
    const response = await axios.post(`${AI_BASE_URL}/generate`, {
      type: section,
      input: `Improve this ${section} section: ${currentContent}`
    }, { withCredentials: true });
    
    return response.data;
  } catch (error) {
    console.error('Error improving CV section:', error);
    throw error;
  }
};

/**
 * Test connection to CV API
 * @returns {Promise<boolean>} True if connection successful
 */
export const testCVApiConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/test`, { withCredentials: true });
    return true;
  } catch (error) {
    console.error('CV API connection test failed:', error);
    return false;
  }
};

/**
 * Helper function to handle CV API errors consistently
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 */
export const handleCVApiError = (error, operation) => {
  console.error(`Error during ${operation}:`, error);
  
  if (error.response) {
    const { status, data } = error.response;
    console.error(`HTTP ${status}:`, data);
    
    switch (status) {
      case 400:
        throw new Error(data.message || 'Bad request - please check your CV data');
      case 401:
        throw new Error('Unauthorized - please log in again');
      case 403:
        throw new Error('Forbidden - you do not have permission');
      case 404:
        throw new Error('CV not found');
      case 413:
        throw new Error('File too large - please choose a smaller CV file');
      case 415:
        throw new Error('Unsupported file type - please upload a PDF file');
      case 422:
        throw new Error('Invalid CV data - please check your information');
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
 * Helper function to create download link for CV file
 * @param {Blob} blob - CV file blob
 * @param {string} filename - Filename for download
 */
export const downloadCVFile = (blob, filename = 'cv.pdf') => {
  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CV file:', error);
    throw new Error('Failed to download CV file');
  }
};

/**
 * Helper function to format CV data for display
 * @param {Object} cvData - Raw CV data
 * @returns {Object} Formatted CV data
 */
export const formatCVData = (cvData) => {
  if (!cvData) return null;
  
  return {
    name: cvData.name || '',
    title: cvData.title || '',
    summary: cvData.summary || '',
    education: cvData.education || '',
    experience: cvData.experience || '',
    skills: cvData.skills || '',
    links: cvData.links || '',
    fileName: cvData.fileName || null,
    fileUrl: cvData.fileUrl || null,
    createdAt: cvData.createdAt || null,
    updatedAt: cvData.updatedAt || null
  };
};

// Export all functions as default for easy importing
export default {
  getCV,
  saveCV,
  deleteCV,
  uploadCV,
  downloadCV,
  generateCVWithAI,
  aiExtractCV,
  getUserCV,
  downloadApplicantCV,
  generateCVPDF,
  parseCVFile,
  improveCVSection,
  testCVApiConnection,
  handleCVApiError,
  downloadCVFile,
  formatCVData
};