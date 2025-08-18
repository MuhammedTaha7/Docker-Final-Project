// src/Api/Common/fileUploadApi.js (renamed from imageUploadApi.js)
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/files';

/**
 * Upload an image file to the server
 * @param {File} file - The image file to upload
 * @param {string} context - Context: 'community' or 'edusphere'
 * @returns {Promise<Object>} Upload response with URL
 */
export const uploadImage = async (file, context = 'community') => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${BASE_URL}/upload/${context}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    return response.data; // { url: "http://localhost:8080/api/files/community/images/filename.jpg", filename: "filename.jpg", ... }
  } catch (error) {
    console.error('Failed to upload image:', error);
    throw error;
  }
};

/**
 * Upload a document file to the server
 * @param {File} file - The document file to upload
 * @param {string} context - Context: 'community' or 'edusphere'
 * @returns {Promise<Object>} Upload response with URL
 */
export const uploadFile = async (file, context = 'community') => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${BASE_URL}/upload/${context}/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    return response.data; // { url: "http://localhost:8080/api/files/community/files/filename.pdf", filename: "filename.pdf", ... }
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
};

/**
 * Convert blob URL to File and upload to server
 * @param {string} blobUrl - Blob URL from file input
 * @param {string} context - Context: 'community' or 'edusphere'
 * @param {string} filename - Desired filename (optional)
 * @returns {Promise<Object>} Upload response
 */
export const uploadBlobAsImage = async (blobUrl, context = 'community', filename = 'image.jpg') => {
  try {
    // Fetch the blob data
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    
    // Create a File object
    const file = new File([blob], filename, { 
      type: blob.type || 'image/jpeg' 
    });
    
    // Upload the file
    return await uploadImage(file, context);
  } catch (error) {
    console.error('Failed to upload blob as image:', error);
    throw error;
  }
};

/**
 * Delete an uploaded file
 * @param {string} context - Context: 'community' or 'edusphere'
 * @param {string} type - Type: 'image' or 'file'
 * @param {string} filename - Filename to delete
 * @returns {Promise<Object>} Delete response
 */
export const deleteUploadedFile = async (context, type, filename) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${context}/${type}s/${filename}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
};

/**
 * Check if a URL is a blob URL that needs to be uploaded
 * @param {string} url - URL to check
 * @returns {boolean} True if it's a blob URL
 */
export const isBlobUrl = (url) => {
  return url && url.startsWith('blob:');
};

/**
 * Process image before creating post - upload if it's a blob URL
 * @param {string} imageUrl - Image URL (could be blob or server URL)
 * @param {string} context - Context: 'community' or 'edusphere'
 * @returns {Promise<string>} Server URL
 */
export const processImageForPost = async (imageUrl, context = 'community') => {
  if (!imageUrl) return null;
  
  // If it's already a server URL, return as is
  if (!isBlobUrl(imageUrl)) {
    return imageUrl;
  }
  
  // If it's a blob URL, upload it first
  try {
    const uploadResult = await uploadBlobAsImage(imageUrl, context);
    return uploadResult.url;
  } catch (error) {
    console.error('Failed to process image for post:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Process file for post - upload and return file info
 * @param {File} file - File object
 * @param {string} context - Context: 'community' or 'edusphere'
 * @returns {Promise<Object>} File info with server URL
 */
export const processFileForPost = async (file, context = 'community') => {
  if (!file) return null;
  
  try {
    const uploadResult = await uploadFile(file, context);
    return {
      name: uploadResult.originalName || file.name,
      url: uploadResult.url,
      size: uploadResult.size,
      type: file.type
    };
  } catch (error) {
    console.error('Failed to process file for post:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Get file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Human readable file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate file type for uploads
 * @param {File} file - File to validate
 * @param {string} type - Expected type: 'image' or 'file'
 * @returns {boolean} True if file type is valid
 */
export const validateFileType = (file, type) => {
  if (type === 'image') {
    return file.type.startsWith('image/');
  } else if (type === 'file') {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];
    return allowedTypes.includes(file.type);
  }
  return false;
};

export default {
  uploadImage,
  uploadFile,
  uploadBlobAsImage,
  deleteUploadedFile,
  isBlobUrl,
  processImageForPost,
  processFileForPost,
  formatFileSize,
  validateFileType,
};