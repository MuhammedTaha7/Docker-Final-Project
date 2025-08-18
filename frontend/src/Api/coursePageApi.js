// src/Api/coursePageApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const COURSES_URL = `${API_BASE_URL}/courses`;
const DEPARTMENTS_URL = `${API_BASE_URL}/departments`;
const ANALYTICS_URL = `${API_BASE_URL}/analytics`;
const CATEGORIES_URL = `${API_BASE_URL}/course-content/categories`;
const FILES_URL = `${API_BASE_URL}/course-content/files`;


axios.defaults.withCredentials = true;

/* ==================================================================
                            COURSES
   ================================================================== */

export const getAllCourses = async () => {
    try {
        const response = await axios.get(COURSES_URL);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};

export const getCourseById = async (courseId) => {
    try {
        const response = await axios.get(`${COURSES_URL}/${courseId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching course with id ${courseId}:`, error);
        throw error;
    }
};

export const createCourse = async (courseData) => {
    try {
        const response = await axios.post(COURSES_URL, courseData);
        return response.data;
    } catch (error) {
        console.error("Error creating course:", error);
        throw error;
    }
};

export const updateCourse = async (courseId, courseData) => {
    try {
        const response = await axios.put(`${COURSES_URL}/${courseId}`, courseData);
        return response.data;
    } catch (error) {
        console.error("Error updating course:", error);
        throw error;
    }
};

export const deleteCourse = async (courseId) => {
    try {
        await axios.delete(`${COURSES_URL}/${courseId}`);
    } catch (error) {
        console.error("Error deleting course:", error);
        throw error;
    }
};

export const enrollStudent = async (courseId, enrollmentData) => {
    try {
        const response = await axios.post(`${COURSES_URL}/${courseId}/enroll`, enrollmentData);
        return response.data;
    } catch (error) {
        console.error("Error enrolling student:", error);
        throw error;
    }
};


export const unenrollStudents = async (courseId, studentIds) => {
  try {
    const response = await axios.delete(`${COURSES_URL}/${courseId}/enrollments`, {
      data: { studentIds }
    });
    return response.data;
  } catch (error) {
    console.error("Error unenrolling students:", error);
    throw error;
  }
};




/* ==================================================================
                            DEPARTMENTS
   ================================================================== */

export const getAllDepartments = async () => {
    try {
        const response = await axios.get(DEPARTMENTS_URL);
        return response.data || [];
    } catch (error) {
        console.error("Error fetching departments:", error);
        return [];
    }
};

export const createDepartment = async (departmentData) => {
    try {
        const response = await axios.post(DEPARTMENTS_URL, departmentData);
        return response.data;
    } catch (error) {
        console.error("Error creating department:", error);
        throw error;
    }
};

/* ==================================================================
                            ANALYTICS
   ================================================================== */

export const getCourseAnalytics = async (courseId, year) => {
    try {
        const response = await axios.get(`${ANALYTICS_URL}/course/${courseId}`, {
            params: { year }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching course analytics:", error);
        throw error;
    }
};

export const getAssignmentTimeline = async (courseId, year) => {
    try {
        const response = await axios.get(`${ANALYTICS_URL}/assignment-timeline/${courseId}`, {
            params: { year }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching assignment timeline:", error);
        throw error;
    }
};

/* ==================================================================
                            CATEGORIES - FIXED
   ================================================================== */

export const getCategoriesByCourse = async (courseId, year) => {
    try {
        const response = await axios.get(`${CATEGORIES_URL}/by-course/${courseId}`, {
            params: { year },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching categories by course:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 401) {
                throw new Error("You need to be logged in to view categories.");
            } else if (status === 404) {
                throw new Error("Course not found.");
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        } else if (error.request) {
            throw new Error("Network error: Could not connect to server.");
        } else {
            throw new Error(`Request error: ${error.message}`);
        }
    }
};

export const createCategory = async (courseId, year, categoryData) => {
    try {
        console.log(`Creating category for course: ${courseId}, year: ${year}`, categoryData);
        const response = await axios.post(CATEGORIES_URL, categoryData, {
            params: { courseId, year },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 400) {
                throw new Error(`Invalid data: ${errorMessage}`);
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to create category.");
    }
};

export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await axios.put(`${CATEGORIES_URL}/${categoryId}`, categoryData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 400) {
                throw new Error(`Invalid data: ${errorMessage}`);
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to update category.");
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        await axios.delete(`${CATEGORIES_URL}/${categoryId}`, {
            withCredentials: true
        });
        return true;
    } catch (error) {
        console.error("Error deleting category:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to delete category.");
    }
};

/* ==================================================================
                            FILES - FIXED
   ================================================================== */

export const uploadFile = async (categoryId, file, metadata = {}) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        if (metadata.description) {
            formData.append('description', metadata.description);
        }
        
        console.log(`Uploading file to category: ${categoryId}`);
        console.log(`Upload URL: ${FILES_URL}/upload/${categoryId}`);
        
        const response = await axios.post(`${FILES_URL}/upload/${categoryId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 400) {
                throw new Error(`Upload error: ${errorMessage}`);
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to upload file.");
    }
};

export const deleteFile = async (fileId) => {
    try {
        console.log(`🗑️ Attempting to delete file: ${fileId}`);
        console.log(`🔗 DELETE URL: ${FILES_URL}/${fileId}`);
        
        // FIXED: Updated endpoint to match your backend: /{fileId}
        await axios.delete(`${FILES_URL}/${fileId}`, {
            withCredentials: true
        });
        
        console.log("✅ Delete successful");
        return true;
    } catch (error) {
        console.error("❌ Delete failed:", error);
        console.error("❌ Response data:", error.response?.data);
        console.error("❌ Response status:", error.response?.status);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 404) {
                throw new Error("File not found.");
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to delete file.");
    }
};

// FIXED: Updated to match backend endpoints
export const getFilesByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${FILES_URL}/by-category/${categoryId}/simple`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching files by category:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 401) {
                throw new Error("You need to be logged in to view files.");
            } else if (status === 404) {
                throw new Error("Category not found.");
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        } else if (error.request) {
            throw new Error("Network error: Could not connect to server.");
        } else {
            throw new Error(`Request error: ${error.message}`);
        }
    }
};

// ADDITIONAL: Paginated file fetching
export const getFilesByCategoryPaginated = async (categoryId, page = 0, size = 20, sortBy = 'uploadDate', sortDir = 'desc') => {
    try {
        const response = await axios.get(`${FILES_URL}/by-category/${categoryId}`, {
            params: { page, size, sortBy, sortDir },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching paginated files:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to fetch files for category.");
    }
};

// FIXED: Download file with proper error handling
export const downloadFile = async (fileId, fileName) => {
    try {
        console.log(`⬇️ Downloading file: ${fileId} - ${fileName}`);
        console.log(`🔗 Download URL: ${FILES_URL}/${fileId}/download`);
        
        const response = await axios.get(`${FILES_URL}/${fileId}/download`, {
            responseType: 'blob',
            withCredentials: true
        });
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        console.log("✅ Download successful");
        return true;
    } catch (error) {
        console.error("❌ Download failed:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 404) {
                throw new Error("File not found.");
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to download file.");
    }
};

// ADDITIONAL: Get file info
export const getFileInfo = async (fileId) => {
    try {
        const response = await axios.get(`${FILES_URL}/${fileId}/info`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching file info:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else if (status === 404) {
                throw new Error("File not found.");
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to fetch file info.");
    }
};

// ADDITIONAL: Get file count for category
export const getFilesCountByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${FILES_URL}/category/${categoryId}/count`, {
            withCredentials: true
        });
        return response.data.count;
    } catch (error) {
        console.error("Error fetching file count:", error);
        
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || 'Unknown error';
            
            if (status === 403) {
                throw new Error(`Access denied: ${errorMessage}`);
            } else {
                throw new Error(`Server error (${status}): ${errorMessage}`);
            }
        }
        throw new Error("Failed to fetch file count.");
    }
};