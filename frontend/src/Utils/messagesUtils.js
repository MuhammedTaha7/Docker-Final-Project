// src/Utils/messagesUtils.js

/**
 * Get full message details by ID
 * @param {number} id - Message ID
 * @param {Array} messages - Array of messages to search in
 * @returns {Object|null} Full message object or null if not found
 */
export const getFullMessageById = (id, messages = []) => {
  try {
    if (!messages || !Array.isArray(messages)) {
      console.warn("getFullMessageById: Messages array is invalid", messages);
      return null;
    }
    
    const message = messages.find((msg) => msg.id === parseInt(id));
    if (!message) {
      console.warn(`getFullMessageById: Message with ID ${id} not found`);
      return null;
    }
    
    return message;
  } catch (error) {
    console.error("getFullMessageById: Error finding message", error);
    return null;
  }
};

/**
 * Get full announcement details by ID
 * @param {number} id - Announcement ID
 * @param {Array} announcements - Array of announcements to search in
 * @returns {Object|null} Full announcement object or null if not found
 */
export const getFullAnnouncementById = (id, announcements = []) => {
  try {
    if (!announcements || !Array.isArray(announcements)) {
      console.warn("getFullAnnouncementById: Announcements array is invalid", announcements);
      return null;
    }
    
    const announcement = announcements.find((ann) => ann.id === parseInt(id));
    if (!announcement) {
      console.warn(`getFullAnnouncementById: Announcement with ID ${id} not found`);
      return null;
    }
    
    return announcement;
  } catch (error) {
    console.error("getFullAnnouncementById: Error finding announcement", error);
    return null;
  }
};

/**
 * Get full template details by ID
 * @param {number} id - Template ID
 * @param {Array} templates - Array of templates to search in
 * @returns {Object|null} Full template object or null if not found
 */
export const getFullTemplateById = (id, templates = []) => {
  try {
    if (!templates || !Array.isArray(templates)) {
      console.warn("getFullTemplateById: Templates array is invalid", templates);
      return null;
    }
    
    const template = templates.find((tpl) => tpl.id === parseInt(id));
    if (!template) {
      console.warn(`getFullTemplateById: Template with ID ${id} not found`);
      return null;
    }
    
    return template;
  } catch (error) {
    console.error("getFullTemplateById: Error finding template", error);
    return null;
  }
};

/**
 * Get file details by ID
 * @param {number} id - File ID
 * @param {Array} files - Array of files to search in
 * @returns {Object|null} Full file object or null if not found
 */
export const getFullFileById = (id, files = []) => {
  try {
    if (!files || !Array.isArray(files)) {
      console.warn("getFullFileById: Files array is invalid", files);
      return null;
    }
    
    const file = files.find((f) => f.id === parseInt(id));
    if (!file) {
      console.warn(`getFullFileById: File with ID ${id} not found`);
      return null;
    }
    
    return file;
  } catch (error) {
    console.error("getFullFileById: Error finding file", error);
    return null;
  }
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, includeTime = false) => {
  try {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error("formatDate: Error formatting date", error);
    return "Invalid Date";
  }
};

/**
 * Extract variables from template content
 * @param {string} content - Template content with {variable} placeholders
 * @returns {Array} Array of unique variable names
 */
export const extractTemplateVariables = (content = "") => {
  try {
    if (!content || typeof content !== 'string') {
      return [];
    }
    
    const variableMatches = content.match(/\{([^}]+)\}/g) || [];
    const uniqueVariables = [...new Set(
      variableMatches.map((v) => v.replace(/[{}]/g, "").trim())
    )].filter(v => v); // Remove empty strings
    
    return uniqueVariables;
  } catch (error) {
    console.error("extractTemplateVariables: Error extracting variables", error);
    return [];
  }
};

/**
 * Replace template variables with actual values
 * @param {string} template - Template content with {variable} placeholders
 * @param {Object} values - Object with variable values
 * @returns {string} Template with variables replaced
 */
export const replaceTemplateVariables = (template = "", values = {}) => {
  try {
    if (!template || typeof template !== 'string') {
      return "";
    }
    
    let result = template;
    Object.entries(values).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      result = result.replace(regex, value || `{${key}}`);
    });
    
    return result;
  } catch (error) {
    console.error("replaceTemplateVariables: Error replacing variables", error);
    return template;
  }
};

/**
 * Validate form data for completeness
 * @param {Object} formData - Form data object
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateFormData = (formData = {}, requiredFields = []) => {
  try {
    const errors = [];
    
    requiredFields.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
        errors.push(`${field} is required`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  } catch (error) {
    console.error("validateFormData: Error validating form data", error);
    return {
      isValid: false,
      errors: ['Validation error occurred']
    };
  }
};

/**
 * Generate unique ID for new items
 * @param {Array} items - Array of items with ID property
 * @returns {number} New unique ID
 */
export const generateNewId = (items = []) => {
  try {
    if (!Array.isArray(items) || items.length === 0) {
      return 1;
    }
    
    const maxId = Math.max(...items.map(item => item.id || 0));
    return maxId + 1;
  } catch (error) {
    console.error("generateNewId: Error generating ID", error);
    return 1;
  }
};

/**
 * Get current date and time in required format
 * @returns {Object} Object with date and time strings
 */
export const getCurrentDateTime = () => {
  try {
    const now = new Date();
    return {
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().split(" ")[0].substring(0, 5)
    };
  } catch (error) {
    console.error("getCurrentDateTime: Error getting current date/time", error);
    return {
      date: "1970-01-01",
      time: "00:00"
    };
  }
};

/**
 * Sanitize text content for safe display
 * @param {string} text - Text content to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text = "") => {
  try {
    if (!text || typeof text !== 'string') {
      return "";
    }
    
    // Basic sanitization - remove script tags and other potentially harmful content
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  } catch (error) {
    console.error("sanitizeText: Error sanitizing text", error);
    return "";
  }
};

/**
 * Check if an item is active based on various status indicators
 * @param {Object} item - Item to check
 * @returns {boolean} True if item is considered active
 */
export const isItemActive = (item = {}) => {
  try {
    if (!item || typeof item !== 'object') {
      return false;
    }
    
    // Check various status indicators
    const status = (item.status || "").toLowerCase();
    const isActive = status === 'active' || status === 'published' || status === 'enabled';
    
    // Check expiry date if exists
    if (item.expiryDate) {
      const now = new Date();
      const expiry = new Date(item.expiryDate);
      if (expiry < now) {
        return false;
      }
    }
    
    return isActive;
  } catch (error) {
    console.error("isItemActive: Error checking item status", error);
    return false;
  }
};

/**
 * Filter items based on search query
 * @param {Array} items - Items to filter
 * @param {string} searchQuery - Search query string
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} Filtered items
 */
export const filterItemsBySearch = (items = [], searchQuery = "", searchFields = []) => {
  try {
    if (!Array.isArray(items) || !searchQuery || !searchQuery.trim()) {
      return items;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query);
        } else if (typeof value === 'number') {
          return value.toString().includes(query);
        }
        return false;
      });
    });
  } catch (error) {
    console.error("filterItemsBySearch: Error filtering items", error);
    return items;
  }
};