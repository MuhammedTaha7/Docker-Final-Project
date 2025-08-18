/**
 * Enhanced AssignmentsTab Component with File Editing - FIXED FILE ATTACHMENT
 * File: src/View/Pages/Lecturer/AssignmentsTab.jsx
 */

import React, { useRef, useCallback } from "react";
import {
  Plus,
  ClipboardList,
  RefreshCw,
  Save,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  Target,
  AlertCircle,
  ExternalLink,
  X,
  Upload,
  Download,
  FileText,
} from "lucide-react";
import { formatDateTime } from "../../../Utils/AssignmentsDashboardUtils";
import {
  formatFileSize,
  getFileTypeIcon,
} from "../../../Api/AssignmentsDashboardAPI";
import styles from "./AssignmentsDashboard.module.css";

export default function AssignmentsTab({
  // State
  showAssignmentForm,
  setShowAssignmentForm,
  editingAssignment,
  setEditingAssignment,
  editingAssignmentData,
  setEditingAssignmentData,
  viewingAssignment,
  setViewingAssignment,
  loading,

  // Data
  selectedCourseData,
  assignments,

  // Forms
  newAssignment,
  setNewAssignment,

  // Actions
  handleFileUpload,
  handleViewFile,
  handleRemoveFile,
  addAssignment,
  deleteAssignment,
  updateAssignment,

  // Computed values
  filteredAssignments,
}) {
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // Enhanced file handling functions for new assignment
  const handleFileUploadWithValidation = useCallback(
    async (event, assignmentId = null) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        console.log('📁 Starting file upload for assignment:', assignmentId || 'new');
        
        // Call the parent's file upload handler
        await handleFileUpload(event, assignmentId);
        
        // If this is for a new assignment, update the form state
        if (!assignmentId) {
          setNewAssignment((prev) => ({
            ...prev,
            file: file,
            fileName: file.name,
            fileSize: file.size,
            hasAttachment: true,
          }));
        }
        
        console.log('✅ File upload completed successfully');
      } catch (err) {
        console.error("File validation error:", err);
        event.target.value = "";
      }
    },
    [handleFileUpload, setNewAssignment]
  );

  const handleRemoveFileFromForm = useCallback(() => {
    setNewAssignment((prev) => ({
      ...prev,
      file: null,
      fileUrl: "",
      fileName: "",
      fileSize: 0,
      hasAttachment: false,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Call parent's remove file handler if there's a fileUrl
    if (newAssignment.fileUrl) {
      handleRemoveFile(newAssignment.fileUrl);
    }
  }, [setNewAssignment, newAssignment.fileUrl, handleRemoveFile]);

  // Enhanced file handling for edit form
  const handleEditFileUpload = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        console.log('📁 Starting file upload for editing assignment:', editingAssignmentData?.id);
        
        // Upload the new file
        await handleFileUpload(event, editingAssignmentData?.id);
        
        // Update the editing assignment data with new file info
        setEditingAssignmentData((prev) => ({
          ...prev,
          file: file,
          fileName: file.name,
          fileSize: file.size,
          hasAttachment: true,
        }));
        
        console.log('✅ Edit file upload completed successfully');
      } catch (err) {
        console.error("Edit file validation error:", err);
        event.target.value = "";
      }
    },
    [handleFileUpload, editingAssignmentData?.id, setEditingAssignmentData]
  );

  const handleRemoveEditFile = useCallback(() => {
    // Call parent's remove file handler if there's a fileUrl
    if (editingAssignmentData?.fileUrl) {
      handleRemoveFile(editingAssignmentData.fileUrl);
    }

    setEditingAssignmentData((prev) => ({
      ...prev,
      file: null,
      fileUrl: "",
      fileName: "",
      fileSize: 0,
      hasAttachment: false,
    }));

    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  }, [editingAssignmentData?.fileUrl, handleRemoveFile, setEditingAssignmentData]);

  // Assignment handlers
  const handleEditAssignment = (assignment) => {
    setEditingAssignmentData({ ...assignment });
    setEditingAssignment(assignment.id);
  };

  const handleCancelEdit = () => {
    setEditingAssignmentData(null);
    setEditingAssignment(null);
    // Clear file input
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  const handleSaveEdit = async () => {
    if (editingAssignmentData) {
      await updateAssignment(editingAssignmentData.id, editingAssignmentData);
      setEditingAssignmentData(null);
      setEditingAssignment(null);
      // Clear file input
      if (editFileInputRef.current) {
        editFileInputRef.current.value = "";
      }
    }
  };

  const handleViewAssignment = (assignment) => {
    setViewingAssignment(assignment);
  };

  // Enhanced File Upload Component
  const FileUploadInput = ({ onFileUpload, currentFile, disabled, fileInputRef: customFileInputRef }) => {
    return (
      <div className={styles.colSpan2}>
        <label className={styles.formLabel}>File Attachment (Optional)</label>
        <div className={styles.fileUploadSection}>
          <input
            ref={customFileInputRef || fileInputRef}
            type="file"
            onChange={onFileUpload}
            className={styles.formInput}
            disabled={disabled}
            accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.jpeg,.png,.gif"
          />
          <div className={styles.fileSupportInfo}>
            <div className={styles.fileSupportText}>
              <strong>Supported formats:</strong> PDF, DOC, DOCX, TXT, ZIP, JPG,
              PNG, GIF (max 10MB)
            </div>
          </div>
          {currentFile && (
            <div className={styles.filePreviewCard}>
              <div className={styles.filePreviewIcon}>
                {getFileTypeIcon(currentFile.name || currentFile.fileName)}
              </div>
              <div className={styles.filePreviewInfo}>
                <div className={styles.filePreviewName}>
                  {currentFile.name || currentFile.fileName}
                </div>
                {(currentFile.size || currentFile.fileSize) && (
                  <div className={styles.filePreviewSize}>
                    Size:{" "}
                    {formatFileSize(currentFile.size || currentFile.fileSize)}
                  </div>
                )}
              </div>
              <div className={styles.filePreviewActions}>
                <button
                  type="button"
                  onClick={customFileInputRef ? handleRemoveEditFile : handleRemoveFileFromForm}
                  className={styles.fileActionBtnDelete}
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Enhanced File Upload Component for Edit Form
  const EditFileUploadInput = ({ onFileUpload, currentFile, disabled, onRemoveFile }) => {
    return (
      <div className={styles.assignmentEditFieldFull}>
        <label className={styles.assignmentEditLabel}>File Attachment (Optional)</label>
        <div className={styles.editFileUploadSection}>
          <div className={styles.editFileUploadControls}>
            <input
              ref={editFileInputRef}
              type="file"
              onChange={onFileUpload}
              className={styles.editFileInput}
              disabled={disabled}
              accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.jpeg,.png,.gif"
            />
            <div className={styles.editFileUploadButtons}>
              <button
                type="button"
                onClick={() => editFileInputRef.current?.click()}
                disabled={disabled}
                className={styles.editFileUploadBtn}
                title="Upload new file"
              >
                <Upload className="h-4 w-4" />
                Upload File
              </button>
              {currentFile && currentFile.fileUrl && (
                <button
                  type="button"
                  onClick={() => handleViewFile(currentFile.fileUrl, currentFile.fileName)}
                  className={styles.editFileViewBtn}
                  title="View current file"
                >
                  <Eye className="h-4 w-4" />
                  View Current
                </button>
              )}
            </div>
          </div>
          
          <div className={styles.editFileSupportInfo}>
            <FileText className="h-4 w-4" />
            <span>Supported: PDF, DOC, DOCX, TXT, ZIP, JPG, PNG, GIF (max 10MB)</span>
          </div>

          {/* Current File Display */}
          {currentFile && (currentFile.fileName || currentFile.hasAttachment) && (
            <div className={styles.editFilePreviewCard}>
              <div className={styles.editFilePreviewContent}>
                <div className={styles.editFilePreviewIcon}>
                  {getFileTypeIcon(currentFile.fileName)}
                </div>
                <div className={styles.editFilePreviewInfo}>
                  <div className={styles.editFilePreviewName}>
                    {currentFile.fileName || "Assignment File"}
                  </div>
                  {currentFile.fileSize && (
                    <div className={styles.editFilePreviewSize}>
                      Size: {formatFileSize(currentFile.fileSize)}
                    </div>
                  )}
                  <div className={styles.editFilePreviewStatus}>
                    {currentFile.file ? "New file uploaded" : "Current file"}
                  </div>
                </div>
              </div>
              <div className={styles.editFilePreviewActions}>
                {currentFile.fileUrl && (
                  <button
                    type="button"
                    onClick={() => handleViewFile(currentFile.fileUrl, currentFile.fileName)}
                    className={styles.editFileActionBtnView}
                    title="View file"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onRemoveFile}
                  className={styles.editFileActionBtnDelete}
                  title="Remove file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Enhanced File Display Component for Assignment Cards
  const FileAttachmentDisplay = ({ assignment }) => {
    if (!assignment.hasAttachment || !assignment.fileUrl) return null;

    return (
      <div className={styles.assignmentFileSection}>
        <div className={styles.assignmentFileHeader}>
          <span className={styles.assignmentFileIcon}>
            {getFileTypeIcon(assignment.fileName)}
          </span>
          <span>File Attachment</span>
        </div>
        <div className={styles.assignmentFileContent}>
          <div className={styles.assignmentFileDetails}>
            <div className={styles.assignmentFileName}>
              {assignment.fileName || "Assignment File"}
            </div>
            {assignment.fileSize && (
              <div className={styles.assignmentFileSize}>
                Size: {formatFileSize(assignment.fileSize)}
              </div>
            )}
          </div>
          <button
            onClick={() =>
              handleViewFile(assignment.fileUrl, assignment.fileName)
            }
            className={styles.assignmentFileButton}
            title="View attachment"
          >
            <ExternalLink className="h-4 w-4" />
            View File
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Assignment Viewing Modal */}
      {viewingAssignment && (
        <div className={styles.assignmentModal}>
          <div className={styles.assignmentModalContent}>
            <div className={styles.assignmentModalHeader}>
              <h2 className={styles.assignmentModalTitle}>
                {viewingAssignment.title}
              </h2>
              <button
                onClick={() => setViewingAssignment(null)}
                className={styles.assignmentModalCloseBtn}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className={styles.assignmentModalBody}>
              <div className={styles.assignmentModalGrid}>
                <div className={styles.assignmentModalSection}>
                  <h3 className={styles.assignmentModalSectionTitle}>
                    <ClipboardList className="h-5 w-5" />
                    Assignment Details
                  </h3>
                  <div className={styles.assignmentModalSectionContent}>
                    <div className={styles.assignmentModalDetail}>
                      <span className={styles.assignmentModalDetailLabel}>
                        Type
                      </span>
                      <span className={styles.assignmentModalDetailValue}>
                        {viewingAssignment.type}
                      </span>
                    </div>
                    <div className={styles.assignmentModalDetail}>
                      <span className={styles.assignmentModalDetailLabel}>
                        Due Date
                      </span>
                      <span className={styles.assignmentModalDetailValue}>
                        {formatDateTime(
                          viewingAssignment.dueDate,
                          viewingAssignment.dueTime
                        )}
                      </span>
                    </div>
                    <div className={styles.assignmentModalDetail}>
                      <span className={styles.assignmentModalDetailLabel}>
                        Max Points
                      </span>
                      <span className={styles.assignmentModalDetailValue}>
                        {viewingAssignment.maxPoints}
                      </span>
                    </div>
                    <div className={styles.assignmentModalDetail}>
                      <span className={styles.assignmentModalDetailLabel}>
                        Priority
                      </span>
                      <span className={styles.assignmentModalDetailValue}>
                        {viewingAssignment.priority}
                      </span>
                    </div>
                    <div className={styles.assignmentModalDetail}>
                      <span className={styles.assignmentModalDetailLabel}>
                        Difficulty
                      </span>
                      <span className={styles.assignmentModalDetailValue}>
                        {viewingAssignment.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.assignmentModalSection}>
                  <h3 className={styles.assignmentModalSectionTitle}>
                    <Target className="h-5 w-5" />
                    Statistics
                  </h3>
                  <div className={styles.assignmentModalSectionContent}>
                    <div className={styles.assignmentModalDetail}>
                      <span className={styles.assignmentModalDetailLabel}>
                        Submissions
                      </span>
                      <span className={styles.assignmentModalDetailValue}>
                        {viewingAssignment.submissionCount || 0}
                      </span>
                    </div>
                    <div className={styles.assignmentModalDetail}>
                      <span className={styles.assignmentModalDetailLabel}>
                        Graded
                      </span>
                      <span className={styles.assignmentModalDetailValue}>
                        {viewingAssignment.gradedCount || 0}
                      </span>
                    </div>
                    <div className={styles.assignmentModalDetail}>
                      <span className={styles.assignmentModalDetailLabel}>
                        Average Grade
                      </span>
                      <span className={styles.assignmentModalDetailValue}>
                        {viewingAssignment.averageGrade?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {viewingAssignment.description && (
                <div className={styles.assignmentModalDescription}>
                  <h3 className={styles.assignmentModalDescriptionTitle}>
                    Description
                  </h3>
                  <p className={styles.assignmentModalDescriptionText}>
                    {viewingAssignment.description}
                  </p>
                </div>
              )}

              {viewingAssignment.instructions && (
                <div className={styles.assignmentModalDescription}>
                  <h3 className={styles.assignmentModalDescriptionTitle}>
                    Instructions
                  </h3>
                  <p className={styles.assignmentModalDescriptionText}>
                    {viewingAssignment.instructions}
                  </p>
                </div>
              )}

              {viewingAssignment.hasAttachment && viewingAssignment.fileUrl && (
                <div className={styles.assignmentModalFileSection}>
                  <div className={styles.assignmentModalFileHeader}>
                    <span className={styles.assignmentModalFileIcon}>
                      {getFileTypeIcon(viewingAssignment.fileName)}
                    </span>
                    <span>File Attachment</span>
                  </div>
                  <div className={styles.assignmentModalFileContent}>
                    <div className={styles.assignmentModalFileDetails}>
                      <div className={styles.assignmentModalFileName}>
                        {viewingAssignment.fileName || "Assignment File"}
                      </div>
                      {viewingAssignment.fileSize && (
                        <div className={styles.assignmentModalFileSize}>
                          Size: {formatFileSize(viewingAssignment.fileSize)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        handleViewFile(
                          viewingAssignment.fileUrl,
                          viewingAssignment.fileName
                        )
                      }
                      className={styles.assignmentModalFileButton}
                    >
                      <ExternalLink className="h-4 w-4" />
                      View File
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.tabContent}>
        {/* Assignments Header */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>
                Assignments - {selectedCourseData?.name}
              </h3>
              <p className={styles.cardSubtitle}>
                Manage course assignments and tasks
              </p>
            </div>
            <div className={styles.cardActions}>
              <button
                onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                disabled={loading}
                className={styles.primaryBtn}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className={styles.btnIcon} />
                )}
                <span>Create Assignment</span>
              </button>
            </div>
          </div>

          {/* Assignment Creation Form */}
          {showAssignmentForm && (
            <div className={styles.formSection}>
              <h4 className={styles.formTitle}>Create New Assignment</h4>
              <div className={styles.formCard}>
                <div className={styles.formGrid}>
                  <div className={styles.colSpan2}>
                    <label className={styles.formLabel}>Assignment Title</label>
                    <input
                      type="text"
                      placeholder="Enter assignment title"
                      value={newAssignment.title}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          title: e.target.value,
                        })
                      }
                      className={styles.formInput}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className={styles.formLabel}>Type</label>
                    <select
                      value={newAssignment.type}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          type: e.target.value,
                        })
                      }
                      className={styles.formSelect}
                      disabled={loading}
                    >
                      <option value="homework">Homework</option>
                      <option value="project">Project</option>
                      <option value="essay">Essay</option>
                      <option value="lab">Lab Work</option>
                      <option value="presentation">Presentation</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.formLabel}>Max Points</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={newAssignment.maxPoints}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          maxPoints: parseInt(e.target.value) || 100,
                        })
                      }
                      className={styles.formInput}
                      min="1"
                      max="1000"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Due Date</label>
                    <input
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          dueDate: e.target.value,
                        })
                      }
                      className={styles.formInput}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Due Time</label>
                    <input
                      type="time"
                      value={newAssignment.dueTime}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          dueTime: e.target.value,
                        })
                      }
                      className={styles.formInput}
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.colSpan2}>
                    <label className={styles.formLabel}>Description</label>
                    <textarea
                      placeholder="Enter assignment description and requirements"
                      value={newAssignment.description}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          description: e.target.value,
                        })
                      }
                      className={styles.formTextarea}
                      rows={3}
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.colSpan2}>
                    <label className={styles.formLabel}>Instructions</label>
                    <textarea
                      placeholder="Detailed instructions for students"
                      value={newAssignment.instructions}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          instructions: e.target.value,
                        })
                      }
                      className={styles.formTextarea}
                      rows={3}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Priority</label>
                    <select
                      value={newAssignment.priority}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          priority: e.target.value,
                        })
                      }
                      className={styles.formSelect}
                      disabled={loading}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.formLabel}>Difficulty</label>
                    <select
                      value={newAssignment.difficulty}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          difficulty: e.target.value,
                        })
                      }
                      className={styles.formSelect}
                      disabled={loading}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  {/* Enhanced File Upload Component */}
                  <FileUploadInput
                    onFileUpload={handleFileUploadWithValidation}
                    currentFile={
                      newAssignment.file ||
                      (newAssignment.fileName
                        ? {
                            name: newAssignment.fileName,
                            size: newAssignment.fileSize,
                          }
                        : null)
                    }
                    disabled={loading}
                  />

                  <div className={styles.colSpan2}>
                    <div className={styles.formActions}>
                      <button
                        onClick={addAssignment}
                        disabled={loading}
                        className={styles.primaryBtn}
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className={styles.btnIcon} />
                        )}
                        <span>Create Assignment</span>
                      </button>
                      <button
                        onClick={() => setShowAssignmentForm(false)}
                        disabled={loading}
                        className={styles.secondaryBtn}
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assignments List */}
          <div className={styles.cardContent}>
            {filteredAssignments && filteredAssignments.length > 0 ? (
              <div className={styles.assignmentsList}>
                {filteredAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className={styles.assignmentCardEnhanced}
                  >
                    {editingAssignment === assignment.id ? (
                      // Enhanced Edit Mode with File Editing
                      <div className={styles.assignmentEditForm}>
                        <h4 className={styles.assignmentEditFormTitle}>
                          <Edit3 className="h-5 w-5" />
                          Edit Assignment
                        </h4>
                        <div className={styles.assignmentEditGrid}>
                          <div className={styles.assignmentEditField}>
                            <label className={styles.assignmentEditLabel}>
                              Title
                            </label>
                            <input
                              type="text"
                              value={editingAssignmentData?.title || ""}
                              onChange={(e) =>
                                setEditingAssignmentData({
                                  ...editingAssignmentData,
                                  title: e.target.value,
                                })
                              }
                              className={styles.assignmentEditInput}
                              placeholder="Enter assignment title"
                            />
                          </div>
                          <div className={styles.assignmentEditField}>
                            <label className={styles.assignmentEditLabel}>
                              Type
                            </label>
                            <select
                              value={editingAssignmentData?.type || ""}
                              onChange={(e) =>
                                setEditingAssignmentData({
                                  ...editingAssignmentData,
                                  type: e.target.value,
                                })
                              }
                              className={styles.assignmentEditSelect}
                            >
                              <option value="homework">Homework</option>
                              <option value="project">Project</option>
                              <option value="essay">Essay</option>
                              <option value="lab">Lab Work</option>
                              <option value="presentation">Presentation</option>
                            </select>
                          </div>
                          <div className={styles.assignmentEditField}>
                            <label className={styles.assignmentEditLabel}>
                              Due Date
                            </label>
                            <input
                              type="date"
                              value={editingAssignmentData?.dueDate || ""}
                              onChange={(e) =>
                                setEditingAssignmentData({
                                  ...editingAssignmentData,
                                  dueDate: e.target.value,
                                })
                              }
                              className={styles.assignmentEditInput}
                            />
                          </div>
                          <div className={styles.assignmentEditField}>
                            <label className={styles.assignmentEditLabel}>
                              Due Time
                            </label>
                            <input
                              type="time"
                              value={editingAssignmentData?.dueTime || ""}
                              onChange={(e) =>
                                setEditingAssignmentData({
                                  ...editingAssignmentData,
                                  dueTime: e.target.value,
                                })
                              }
                              className={styles.assignmentEditInput}
                            />
                          </div>
                          <div className={styles.assignmentEditField}>
                            <label className={styles.assignmentEditLabel}>
                              Max Points
                            </label>
                            <input
                              type="number"
                              value={editingAssignmentData?.maxPoints || ""}
                              onChange={(e) =>
                                setEditingAssignmentData({
                                  ...editingAssignmentData,
                                  maxPoints: parseInt(e.target.value) || 100,
                                })
                              }
                              className={styles.assignmentEditInput}
                              min="1"
                              max="1000"
                              placeholder="100"
                            />
                          </div>
                          <div className={styles.assignmentEditField}>
                            <label className={styles.assignmentEditLabel}>
                              Priority
                            </label>
                            <select
                              value={editingAssignmentData?.priority || ""}
                              onChange={(e) =>
                                setEditingAssignmentData({
                                  ...editingAssignmentData,
                                  priority: e.target.value,
                                })
                              }
                              className={styles.assignmentEditSelect}
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                          <div className={styles.assignmentEditField}>
                            <label className={styles.assignmentEditLabel}>
                              Difficulty
                            </label>
                            <select
                              value={editingAssignmentData?.difficulty || ""}
                              onChange={(e) =>
                                setEditingAssignmentData({
                                  ...editingAssignmentData,
                                  difficulty: e.target.value,
                                })
                              }
                              className={styles.assignmentEditSelect}
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                          </div>
                          <div
                            className={`${styles.assignmentEditField} ${styles.assignmentEditFieldFull}`}
                          >
                            <label className={styles.assignmentEditLabel}>
                              Description
                            </label>
                            <textarea
                              value={editingAssignmentData?.description || ""}
                              onChange={(e) =>
                                setEditingAssignmentData({
                                  ...editingAssignmentData,
                                  description: e.target.value,
                                })
                              }
                              className={styles.assignmentEditTextarea}
                              placeholder="Enter assignment description and requirements"
                              rows={3}
                            />
                          </div>
                          <div
                            className={`${styles.assignmentEditField} ${styles.assignmentEditFieldFull}`}
                          >
                            <label className={styles.assignmentEditLabel}>
                              Instructions
                            </label>
                            <textarea
                              value={editingAssignmentData?.instructions || ""}
                              onChange={(e) =>
                                setEditingAssignmentData({
                                  ...editingAssignmentData,
                                  instructions: e.target.value,
                                })
                              }
                              className={styles.assignmentEditTextarea}
                              placeholder="Detailed instructions for students"
                              rows={3}
                            />
                          </div>

                          {/* Enhanced File Upload for Edit Form */}
                          <EditFileUploadInput
                            onFileUpload={handleEditFileUpload}
                            currentFile={editingAssignmentData}
                            disabled={loading}
                            onRemoveFile={handleRemoveEditFile}
                          />
                        </div>

                        <div className={styles.assignmentEditActions}>
                          <button
                            onClick={handleSaveEdit}
                            disabled={loading}
                            className={styles.assignmentEditSaveBtn}
                          >
                            {loading ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className={styles.assignmentEditCancelBtn}
                          >
                            <X className="h-4 w-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className={styles.assignmentHeaderEnhanced}>
                          <div className={styles.assignmentTitleEnhanced}>
                            <h4>{assignment.title}</h4>
                            <div className={styles.assignmentMeta}>
                              <span
                                className={`${styles.assignmentType} ${
                                  styles[
                                    `type${
                                      assignment.type
                                        ?.charAt(0)
                                        ?.toUpperCase() +
                                      assignment.type?.slice(1)
                                    }`
                                  ]
                                }`}
                              >
                                {assignment.type}
                              </span>
                              <span
                                className={`${styles.assignmentPriority} ${
                                  styles[
                                    `priority${
                                      assignment.priority
                                        ?.charAt(0)
                                        ?.toUpperCase() +
                                      assignment.priority?.slice(1)
                                    }`
                                  ]
                                }`}
                              >
                                {assignment.priority}
                              </span>
                              <span
                                className={`${styles.assignmentDifficulty} ${
                                  styles[
                                    `difficulty${
                                      assignment.difficulty
                                        ?.charAt(0)
                                        ?.toUpperCase() +
                                      assignment.difficulty?.slice(1)
                                    }`
                                  ]
                                }`}
                              >
                                {assignment.difficulty}
                              </span>
                            </div>
                          </div>
                          <div className={styles.assignmentActionsEnhanced}>
                            <button
                              onClick={() => handleViewAssignment(assignment)}
                              disabled={loading}
                              className={`${styles.assignmentActionBtn} ${styles.assignmentActionBtnView}`}
                              title="View assignment details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditAssignment(assignment)}
                              disabled={loading}
                              className={`${styles.assignmentActionBtn} ${styles.assignmentActionBtnEdit}`}
                              title="Edit assignment"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteAssignment(assignment.id)}
                              disabled={loading}
                              className={`${styles.assignmentActionBtn} ${styles.assignmentActionBtnDelete}`}
                              title="Delete assignment"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className={styles.assignmentContent}>
                          <p className={styles.assignmentDescription}>
                            {assignment.description ||
                              "No description provided"}
                          </p>

                          <div className={styles.assignmentDetails}>
                            <div className={styles.assignmentDetail}>
                              <Calendar className="h-4 w-4" />
                              <span>
                                Due:{" "}
                                {formatDateTime(
                                  assignment.dueDate,
                                  assignment.dueTime
                                )}
                              </span>
                            </div>
                            <div className={styles.assignmentDetail}>
                              <Target className="h-4 w-4" />
                              <span>Max Points: {assignment.maxPoints}</span>
                            </div>
                          </div>

                          {/* Enhanced File Attachment Display */}
                          <FileAttachmentDisplay assignment={assignment} />

                          <div className={styles.assignmentStats}>
                            <div className={styles.statItem}>
                              <span className={styles.statValue}>
                                {assignment.submissionCount || 0}
                              </span>
                              <span className={styles.statLabel}>
                                Submissions
                              </span>
                            </div>
                            <div className={styles.statItem}>
                              <span className={styles.statValue}>
                                {assignment.gradedCount || 0}
                              </span>
                              <span className={styles.statLabel}>Graded</span>
                            </div>
                            <div className={styles.statItem}>
                              <span className={styles.statValue}>
                                {assignment.averageGrade?.toFixed(1) || "0.0"}
                              </span>
                              <span className={styles.statLabel}>Avg Grade</span>
                            </div>
                          </div>
                        </div>

                        {assignment.isOverdue && (
                          <div className={styles.overdueWarning}>
                            <AlertCircle className="h-4 w-4" />
                            <span>This assignment is overdue</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <ClipboardList className={styles.emptyStateIcon} />
                <h4 className={styles.emptyStateTitle}>No Assignments</h4>
                <p className={styles.emptyStateText}>
                  Create your first assignment to get started with task
                  management.
                </p>
                <button
                  onClick={() => setShowAssignmentForm(true)}
                  disabled={loading}
                  className={styles.primaryBtn}
                >
                  <Plus className={styles.btnIcon} />
                  <span>Create Your First Assignment</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}