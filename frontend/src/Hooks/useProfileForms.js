// hooks/useProfileForms.js
import { useState, useCallback } from 'react';
import * as profileAPI from '../api/genericProfileAPI';

export const useProfileForms = (entityType, profileData, onSuccess) => {
  // Modal states
  const [modals, setModals] = useState({
    editGrade: false,
    addGrade: false,
    editCourse: false,
    addCourse: false,
    editEnrollment: false,
    addEnrollment: false,
    editSchedule: false,
    addSchedule: false,
    editResource: false,
    addResource: false,
    viewRequest: false,
    responseRequest: false
  });

  // Form states
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [requestResponse, setRequestResponse] = useState('');

  // File upload states
  const [uploadProgress, setUploadProgress] = useState({});

  // Modal control functions
  const openModal = useCallback((modalName, record = null) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
    setSelectedRecord(record);
    setFormData(record || {});
    setFormError(null);
  }, []);

  const closeModal = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    setSelectedRecord(null);
    setFormData({});
    setFormError(null);
    setFormLoading(false);
  }, []);

  // Grade handlers
  const handleGradeSubmit = useCallback(async (formData) => {
    if (formData.grade < 0 || formData.grade > 100) {
      setFormError('Grade must be between 0 and 100');
      return;
    }

    try {
      setFormLoading(true);
      setFormError(null);

      if (selectedRecord) {
        await profileAPI.updateGrade(selectedRecord.id, formData);
      } else {
        await profileAPI.createGrade(formData);
      }

      closeModal(selectedRecord ? 'editGrade' : 'addGrade');
      onSuccess?.('grades');
    } catch (error) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  }, [selectedRecord, closeModal, onSuccess]);

  // Course handlers
  const handleCourseSubmit = useCallback(async (formData) => {
    try {
      setFormLoading(true);
      setFormError(null);

      if (selectedRecord) {
        await profileAPI.updateCourse(selectedRecord.id, formData);
      } else {
        await profileAPI.createCourse(formData);
      }

      closeModal(selectedRecord ? 'editCourse' : 'addCourse');
      onSuccess?.('courses');
    } catch (error) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  }, [selectedRecord, closeModal, onSuccess]);

  // Enrollment handlers
  const handleEnrollmentSubmit = useCallback(async (formData) => {
    try {
      setFormLoading(true);
      setFormError(null);

      if (selectedRecord) {
        await profileAPI.updateEnrollment(selectedRecord.id, formData);
      } else {
        await profileAPI.createEnrollment(formData);
      }

      closeModal(selectedRecord ? 'editEnrollment' : 'addEnrollment');
      onSuccess?.('enrollments');
    } catch (error) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  }, [selectedRecord, closeModal, onSuccess]);

  // Schedule handlers
  const handleScheduleSubmit = useCallback(async (formData) => {
    if (formData.startTime >= formData.endTime) {
      setFormError('End time must be after start time');
      return;
    }

    try {
      setFormLoading(true);
      setFormError(null);

      if (selectedRecord) {
        await profileAPI.updateScheduleEntry(selectedRecord.id, formData);
      } else {
        await profileAPI.createScheduleEntry(formData);
      }

      closeModal(selectedRecord ? 'editSchedule' : 'addSchedule');
      onSuccess?.('schedule');
    } catch (error) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  }, [selectedRecord, closeModal, onSuccess]);

  // Resource handlers with file upload
  const handleResourceSubmit = useCallback(async (formData) => {
    try {
      setFormLoading(true);
      setFormError(null);

      // Validate file upload for new resources
      if (!selectedRecord && !formData.file) {
        setFormError('Please select a file to upload');
        return;
      }

      // Validate file size (10MB limit)
      if (formData.file && formData.file.size > 10 * 1024 * 1024) {
        setFormError('File size must be less than 10MB');
        return;
      }

      // Set upload progress
      setUploadProgress({ status: 'uploading', progress: 0 });

      // Simulate progress for demo
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev.progress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 200);

      if (selectedRecord) {
        await profileAPI.updateResource(selectedRecord.id, formData, formData.file);
      } else {
        await profileAPI.uploadResource(formData, formData.file);
      }

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress({ status: 'completed', progress: 100 });

      setTimeout(() => {
        setUploadProgress({});
        closeModal(selectedRecord ? 'editResource' : 'addResource');
        onSuccess?.('resources');
      }, 1000);

    } catch (error) {
      setUploadProgress({ status: 'error', progress: 0 });
      setFormError(error.message);
      setTimeout(() => setUploadProgress({}), 3000);
    } finally {
      setFormLoading(false);
    }
  }, [selectedRecord, closeModal, onSuccess]);

  // Request handlers
  const handleRequestResponse = useCallback(async () => {
    if (!requestResponse.trim()) {
      setFormError('Please enter a response');
      return;
    }

    try {
      setFormLoading(true);
      setFormError(null);

      await profileAPI.updateRequestStatus(
        selectedRecord.id, 
        'responded', 
        requestResponse
      );

      setRequestResponse('');
      closeModal('responseRequest');
      onSuccess?.('requests');
    } catch (error) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  }, [selectedRecord, requestResponse, closeModal, onSuccess]);

  const handleApproveRequest = useCallback(async (request) => {
    try {
      await profileAPI.updateRequestStatus(request.id, 'approved');
      onSuccess?.('requests');
    } catch (error) {
      console.error('Error approving request:', error);
    }
  }, [onSuccess]);

  const handleRejectRequest = useCallback(async (request) => {
    try {
      await profileAPI.updateRequestStatus(request.id, 'rejected');
      onSuccess?.('requests');
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  }, [onSuccess]);

  // Resource action handlers
  const handleDownloadResource = useCallback(async (resource) => {
    try {
      const blob = await profileAPI.downloadResource(resource.id);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resource.fileName || resource.title;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      // Show success message
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;
      toast.textContent = `Downloaded: ${resource.title}`;
      document.body.appendChild(toast);
      
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading file. Please try again.');
    }
  }, []);

  const handlePreviewResource = useCallback((resource) => {
    // Open preview in new window
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    previewWindow.document.write(`
      <html>
        <head>
          <title>${resource.title} - Preview</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 8px;
              max-width: 600px;
              margin: 0 auto;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #333; margin-bottom: 10px; }
            .meta { color: #666; margin-bottom: 20px; }
            .description { line-height: 1.6; color: #444; }
            .tags { 
              margin-top: 20px; 
              padding-top: 20px; 
              border-top: 1px solid #eee; 
            }
            .tag {
              display: inline-block;
              background: #e5e7eb;
              padding: 4px 8px;
              border-radius: 4px;
              margin-right: 8px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${resource.title}</h1>
            <div class="meta">
              <strong>Type:</strong> ${resource.type} | 
              <strong>Institution:</strong> ${resource.institution || 'N/A'} | 
              <strong>Date:</strong> ${resource.date || 'N/A'}
            </div>
            <div class="description">
              <h3>Description:</h3>
              <p>${resource.description || 'No description available'}</p>
            </div>
            ${resource.tags ? `
              <div class="tags">
                <strong>Tags:</strong><br>
                ${resource.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        </body>
      </html>
    `);
  }, []);

  return {
    // Modal states
    modals,
    
    // Form states
    selectedRecord,
    formData,
    formLoading,
    formError,
    requestResponse,
    uploadProgress,
    
    // Modal controls
    openModal,
    closeModal,
    
    // Form handlers
    handleGradeSubmit,
    handleCourseSubmit,
    handleEnrollmentSubmit,
    handleScheduleSubmit,
    handleResourceSubmit,
    
    // Request handlers
    handleRequestResponse,
    handleApproveRequest,
    handleRejectRequest,
    
    // Resource handlers
    handleDownloadResource,
    handlePreviewResource,
    
    // Setters
    setFormData,
    setRequestResponse
  };
};