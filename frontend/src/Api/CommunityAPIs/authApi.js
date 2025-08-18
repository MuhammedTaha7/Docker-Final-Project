// src/Api/CommunityAPIs/authApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Set default axios configuration
axios.defaults.withCredentials = true;

/**
 * User login
 * @param {Object} credentials - Login credentials (email, password)
 * @returns {Promise<Object>} Login response with user data and token
 */
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, credentials, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * User logout
 * @returns {Promise<Object>} Logout response
 */
export const logout = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * User registration
 * @param {Object} userData - Registration data (name, email, password, etc.)
 * @returns {Promise<Object>} Registration response
 */
export const register = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify current authentication status
 * @returns {Promise<Object>} Current user data if authenticated
 */
export const verifyAuth = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/verify`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Refresh authentication token
 * @returns {Promise<Object>} Refreshed token response
 */
export const refreshToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email - Email address for password reset
 * @returns {Promise<Object>} Password reset request response
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password with token
 * @param {Object} resetData - Reset data (token, newPassword)
 * @returns {Promise<Object>} Password reset response
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/reset-password`, resetData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Change password (authenticated user)
 * @param {Object} passwordData - Password change data (currentPassword, newPassword)
 * @returns {Promise<Object>} Password change response
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await axios.put(`${BASE_URL}/auth/change-password`, passwordData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify email address
 * @param {string} verificationToken - Email verification token
 * @returns {Promise<Object>} Email verification response
 */
export const verifyEmail = async (verificationToken) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/verify-email`, { token: verificationToken });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Resend email verification
 * @returns {Promise<Object>} Resend verification response
 */
export const resendEmailVerification = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/resend-verification`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} Current user profile data
 */
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/me`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update current user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated profile response
 */
export const updateCurrentUser = async (profileData) => {
  try {
    const response = await axios.put(`${BASE_URL}/auth/me`, profileData, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete current user account
 * @param {Object} confirmationData - Account deletion confirmation (password)
 * @returns {Promise<Object>} Account deletion response
 */
export const deleteAccount = async (confirmationData) => {
  try {
    const response = await axios.delete(`${BASE_URL}/auth/delete-account`, {
      data: confirmationData,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if email is available for registration
 * @param {string} email - Email to check
 * @returns {Promise<Object>} Email availability response
 */
export const checkEmailAvailability = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/check-email`, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Enable two-factor authentication
 * @returns {Promise<Object>} 2FA setup response with QR code
 */
export const enableTwoFactorAuth = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/2fa/enable`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify two-factor authentication code
 * @param {string} code - 2FA verification code
 * @returns {Promise<Object>} 2FA verification response
 */
export const verifyTwoFactorAuth = async (code) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/2fa/verify`, { code }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Disable two-factor authentication
 * @param {string} code - 2FA verification code
 * @returns {Promise<Object>} 2FA disable response
 */
export const disableTwoFactorAuth = async (code) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/2fa/disable`, { code }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user sessions (active logins)
 * @returns {Promise<Array>} Array of active sessions
 */
export const getUserSessions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/sessions`, { withCredentials: true });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Revoke a specific session
 * @param {string} sessionId - ID of the session to revoke
 * @returns {Promise<Object>} Session revoke response
 */
export const revokeSession = async (sessionId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/auth/sessions/${sessionId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Revoke all sessions except current
 * @returns {Promise<Object>} Revoke all sessions response
 */
export const revokeAllSessions = async () => {
  try {
    const response = await axios.delete(`${BASE_URL}/auth/sessions/all`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Test connection to auth API
 * @returns {Promise<boolean>} True if connection successful
 */
export const testAuthApiConnection = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/test`);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Helper function to handle auth API errors consistently
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 */
export const handleAuthApiError = (error, operation) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        throw new Error(data.message || 'Bad request - please check your input');
      case 401:
        throw new Error(data.message || 'Invalid credentials - please check your email and password');
      case 403:
        throw new Error('Account access denied - your account may be suspended');
      case 404:
        throw new Error('Account not found');
      case 409:
        throw new Error('Email already exists - please use a different email');
      case 422:
        throw new Error('Validation failed - please check your information');
      case 429:
        throw new Error('Too many attempts - please wait and try again');
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
 * Helper function to validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Helper function to validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength score and requirements
 */
export const validatePasswordStrength = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const score = Object.values(requirements).filter(Boolean).length;
  const strength = score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong';
  
  return {
    score,
    strength,
    requirements,
    isValid: score >= 3
  };
};

// Export all functions as default for easy importing
export default {
  login,
  logout,
  register,
  verifyAuth,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  changePassword,
  verifyEmail,
  resendEmailVerification,
  getCurrentUser,
  updateCurrentUser,
  deleteAccount,
  checkEmailAvailability,
  enableTwoFactorAuth,
  verifyTwoFactorAuth,
  disableTwoFactorAuth,
  getUserSessions,
  revokeSession,
  revokeAllSessions,
  testAuthApiConnection,
  handleAuthApiError,
  isValidEmail,
  validatePasswordStrength
};