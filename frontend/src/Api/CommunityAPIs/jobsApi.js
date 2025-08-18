// src/Api/CommunityAPIs/jobsApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/jobs';

// Set default axios configuration
axios.defaults.withCredentials = true;

/**
 * Get all available jobs
 * @returns {Promise<Array>} Array of all jobs
 */
export const getAllJobs = async () => {
  try {
    const response = await axios.get(BASE_URL, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Get jobs posted by the current user
 * @returns {Promise<Array>} Array of user's posted jobs
 */
export const getMyPostedJobs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/my-posts`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Get jobs the user has applied to
 * @returns {Promise<Array>} Array of applied jobs
 */
export const getAppliedJobs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/applied`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Get saved jobs
 * @returns {Promise<Array>} Array of saved jobs
 */
export const getSavedJobs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/saved`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Create a new job posting
 * @param {Object} jobData - Job data (title, company, description, etc.)
 * @returns {Promise<Object>} Created job
 */
export const createJob = async (jobData) => {
  try {
    const response = await axios.post(BASE_URL, jobData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a job posting
 * @param {string} jobId - ID of the job to update
 * @param {Object} jobData - Updated job data
 * @returns {Promise<Object>} Updated job
 */
export const updateJob = async (jobId, jobData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${jobId}`, jobData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a job posting
 * @param {string} jobId - ID of the job to delete
 * @returns {Promise<Object>} Delete response
 */
export const deleteJob = async (jobId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${jobId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Apply to a job
 * @param {string} jobId - ID of the job to apply to
 * @param {Object} applicationData - Application data (message, applicationLink, cvData)
 * @returns {Promise<Object>} Application response
 */
export const applyToJob = async (jobId, applicationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/${jobId}/apply`, applicationData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Save a job
 * @param {string} jobId - ID of the job to save
 * @returns {Promise<Object>} Save response
 */
export const saveJob = async (jobId) => {
  try {
    const response = await axios.post(`${BASE_URL}/${jobId}/save`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Unsave a job
 * @param {string} jobId - ID of the job to unsave
 * @returns {Promise<Object>} Unsave response
 */
export const unsaveJob = async (jobId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${jobId}/save`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get applications for a specific job (for job posters)
 * @param {string} jobId - ID of the job
 * @returns {Promise<Array>} Array of job applications
 */
export const getJobApplications = async (jobId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${jobId}/applications`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Accept a job application
 * @param {string} applicationId - ID of the application to accept
 * @returns {Promise<Object>} Accept response
 */
export const acceptApplication = async (applicationId) => {
  try {
    const response = await axios.put(`${BASE_URL}/applications/${applicationId}/accept`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject a job application
 * @param {string} applicationId - ID of the application to reject
 * @returns {Promise<Object>} Reject response
 */
export const rejectApplication = async (applicationId) => {
  try {
    const response = await axios.put(`${BASE_URL}/applications/${applicationId}/reject`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Download applicant's CV (for job applications viewing)
 * Note: This function is also available in cvApi.js as downloadApplicantCV
 * @param {string} applicantId - ID of the applicant
 * @returns {Promise<Blob>} CV file blob
 */
export const downloadJobApplicantCV = async (applicantId) => {
  try {
    const response = await axios.get(`${BASE_URL}/cv/download/${applicantId}`, {
      withCredentials: true,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search jobs with filters
 * @param {string} searchTerm - Search query
 * @param {Object} filters - Search filters (type, location, salary, etc.)
 * @returns {Promise<Array>} Array of matching jobs
 */
export const searchJobs = async (searchTerm = '', filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('q', searchTerm.trim());
    if (filters.type) params.append('type', filters.type);
    if (filters.location) params.append('location', filters.location);
    if (filters.remote) params.append('remote', filters.remote);
    if (filters.experience) params.append('experience', filters.experience);
    if (filters.salary) params.append('salary', filters.salary);
    if (filters.page) params.append('page', filters.page);
    if (filters.size) params.append('size', filters.size);

    const response = await axios.get(`${BASE_URL}/search?${params.toString()}`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Get job statistics
 * @returns {Promise<Object>} Job statistics
 */
export const getJobStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/stats`, { withCredentials: true });
    return response.data || {};
  } catch (error) {
    return {};
  }
};

/**
 * Get featured/recommended jobs
 * @returns {Promise<Array>} Array of featured jobs
 */
export const getFeaturedJobs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/featured`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Report a job posting
 * @param {string} jobId - ID of the job to report
 * @param {Object} reportData - Report details (reason, description)
 * @returns {Promise<Object>} Report response
 */
export const reportJob = async (jobId, reportData) => {
  try {
    const response = await axios.post(`${BASE_URL}/${jobId}/report`, reportData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Test connection to jobs API
 * @returns {Promise<boolean>} True if connection successful
 */
export const testJobsApiConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/test`, { withCredentials: true });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Helper function to handle jobs API errors consistently
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 */
export const handleJobsApiError = (error, operation) => {
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
        throw new Error('Job not found');
      case 409:
        throw new Error('You have already applied to this job');
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
  getAllJobs,
  getMyPostedJobs,
  getAppliedJobs,
  getSavedJobs,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  saveJob,
  unsaveJob,
  getJobApplications,
  acceptApplication,
  rejectApplication,
  downloadJobApplicantCV,
  searchJobs,
  getJobStats,
  getFeaturedJobs,
  reportJob,
  testJobsApiConnection,
  handleJobsApiError
};