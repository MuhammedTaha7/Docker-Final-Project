import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Calendar, 
  Download,
  Clock,
  CheckCircle,
  Target,
  Send,
  AlertCircle, 
  X,
  Paperclip,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { 
  useAssignments, 
  useSubmitAssignment, 
  useStudentSubmissions, 
  useFileUpload,
  useDeleteSubmission,
  useCanDeleteSubmission
} from '../../../Hooks/useStudentAssignmentDashboard';
import { useAuth } from '../../../Context/AuthContext';
import studentApi from '../../../Api/studentAssignmentDashboardApi';
import LoadingSpinner from '../../Pages/Global/Loading';
import ErrorMessage from '../../Pages/Errors/404';
import styles from '../../../CSS/Components/student/AssignmentsTab.module.css';

export default function AssignmentsTab({ selectedCourse, setSelectedCourse, studentId, courses, assignments: propsAssignments }) {
  const [showSubmissionModal, setShowSubmissionModal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submissionContent, setSubmissionContent] = useState('');

  // Get current user from auth context
  const { authData } = useAuth();
  const currentStudentId = studentId || authData?.id;

  console.log('🎯 AssignmentsTab Debug:', {
    selectedCourse,
    currentStudentId,
    coursesCount: courses?.length,
    propsAssignments: propsAssignments?.length
  });

  // FIXED: Use hooks for data fetching with proper parameter order
  const { 
    assignments: hookAssignments, 
    loading, 
    error, 
    refetch 
  } = useAssignments(selectedCourse, currentStudentId, {}); // selectedCourse first, then studentId

  const { submissions, refetch: refetchSubmissions } = useStudentSubmissions(currentStudentId, selectedCourse);
  const { submitAssignment, submitting, error: submitError, success, reset } = useSubmitAssignment();
  const { deleteSubmission, deleting, error: deleteError, success: deleteSuccess, reset: resetDelete } = useDeleteSubmission();
  const { uploadFile, uploading } = useFileUpload();

  // FIXED: Use props assignments if available, otherwise use hook assignments
  const assignments = propsAssignments && propsAssignments.length > 0 ? propsAssignments : hookAssignments;

  console.log('📋 Final assignments data:', {
    usingProps: !!(propsAssignments && propsAssignments.length > 0),
    assignmentsCount: assignments?.length,
    assignments: assignments
  });

  // Success handling for submissions
  useEffect(() => {
    if (success) {
      setShowSubmissionModal(null);
      setSubmissionNotes('');
      setSelectedFiles([]);
      setSubmissionContent('');
      refetch();
      refetchSubmissions();
      reset();
    }
  }, [success, refetch, refetchSubmissions, reset]);

  // Success handling for deletions
  useEffect(() => {
    if (deleteSuccess) {
      setShowDeleteConfirm(null);
      refetch();
      refetchSubmissions();
      resetDelete();
    }
  }, [deleteSuccess, refetch, refetchSubmissions, resetDelete]);

  // FIXED: Proper time calculation with timezone handling
  const getDueDateTime = (assignment) => {
    if (!assignment.dueDate && !assignment.dueDateTime) return null;
    
    try {
      // If we have dueDateTime (combined), use it directly
      if (assignment.dueDateTime) {
        return new Date(assignment.dueDateTime);
      }
      
      // Otherwise combine dueDate + dueTime
      const dueDate = assignment.dueDate;
      const dueTime = assignment.dueTime;
      
      if (!dueDate) return null;
      
      // Create a date object from the due date
      const date = new Date(dueDate);
      
      // If no specific time provided, use end of day (23:59)
      if (!dueTime) {
        // Set to end of day in local timezone
        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        return localDate;
      }
      
      // Parse the time string (HH:mm format)
      const [hours, minutes] = dueTime.split(':').map(num => parseInt(num, 10));
      
      // Create date in local timezone with proper time
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0);
      
      return localDate;
    } catch (error) {
      console.error('Error parsing due date/time:', error);
      return null;
    }
  };

  // FIXED: Check if assignment is overdue using proper time calculation
  const isAssignmentOverdue = (assignment) => {
    const submission = getSubmissionForAssignment(assignment.id);
    if (submission) return false; // Not overdue if already submitted
    
    const dueDateTime = getDueDateTime(assignment);
    if (!dueDateTime) return false;
    
    const now = new Date();
    return now > dueDateTime;
  };

  // FIXED: Get time until due with proper calculation
  const getTimeUntilDue = (assignment) => {
    const dueDateTime = getDueDateTime(assignment);
    if (!dueDateTime) return 'No due date';
    
    const now = new Date();
    const diffMs = dueDateTime - now;
    
    if (diffMs < 0) {
      // Overdue
      const overdueDiffMs = Math.abs(diffMs);
      const overdueDays = Math.floor(overdueDiffMs / (1000 * 60 * 60 * 24));
      const overdueHours = Math.floor((overdueDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (overdueDays > 0) {
        return `Overdue by ${overdueDays} day${overdueDays > 1 ? 's' : ''}`;
      } else if (overdueHours > 0) {
        return `Overdue by ${overdueHours} hour${overdueHours > 1 ? 's' : ''}`;
      } else {
        return 'Overdue';
      }
    }
    
    // Due in the future
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 1) {
      return `Due in ${diffDays} days`;
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays === 0) {
      if (diffHours > 0) {
        return `Due in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
      } else {
        return 'Due today';
      }
    }
    
    return `Due in ${diffDays} days`;
  };

  // Get formatted due date time
  const getFormattedDueDateTime = (assignment) => {
    const dueDateTime = getDueDateTime(assignment);
    if (!dueDateTime) return 'No due date';
    
    // Format with local timezone
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    return dueDateTime.toLocaleDateString('en-US', options);
  };

  const getSubmissionForAssignment = (assignmentId) => {
    return submissions?.find(sub => sub.taskId === assignmentId || sub.assignmentId === assignmentId);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAssignment = async (assignmentId) => {
    if (selectedFiles.length === 0 && !submissionContent.trim()) {
      alert('Please provide either file(s) or content for your submission');
      return;
    }

    try {
      const submissionData = {
        content: submissionContent.trim(),
        notes: submissionNotes.trim(),
        files: selectedFiles
      };

      console.log('Submitting assignment data:', submissionData);
      await submitAssignment(assignmentId, submissionData);
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    try {
      await deleteSubmission(submissionId);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // FIXED DOWNLOAD HANDLER
  const handleDownloadFile = async (assignment) => {
    try {
      console.log('Downloading file for assignment:', assignment.id);
      
      const response = await studentApi.downloadAssignmentFile(assignment.id);
      
      // Check if it's a blob (actual file)
      if (response instanceof Blob) {
        // Create download link for blob
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', assignment.fileName || 'assignment-file');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        // Handle mock response from backend
        if (response && response.message) {
          alert(`${response.message}\nFile: ${response.fileName}\nSize: ${response.fileSize} bytes`);
        } else {
          alert('File download initiated. Check your downloads folder.');
        }
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download file. Please try again.');
    }
  };

  const resetSubmissionModal = () => {
    setSubmissionNotes('');
    setSelectedFiles([]);
    setSubmissionContent('');
    reset();
  };

  // Delete Confirmation Component
  const DeleteConfirmModal = ({ submission }) => {
    const { canDelete, deleteReason, loading: checkingPermission } = useCanDeleteSubmission(submission?.id);

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <div>
              <h3 className={styles.modalTitle}>Delete Submission</h3>
              <p className={styles.modalSubtitle}>
                Are you sure you want to delete your submission?
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className={styles.modalCloseButton}
            >
              <X className={styles.modalCloseIcon} />
            </button>
          </div>

          <div className={styles.modalBody}>
            {deleteError && (
              <div className={styles.errorAlert}>
                <AlertCircle className={styles.errorIcon} />
                <span>{deleteError}</span>
              </div>
            )}

            {checkingPermission ? (
              <div className={styles.loadingSection}>
                <RefreshCw className={styles.loadingIcon} />
                <span>Checking permissions...</span>
              </div>
            ) : !canDelete ? (
              <div className={styles.warningAlert}>
                <AlertCircle className={styles.warningIcon} />
                <div>
                  <strong>Cannot delete submission</strong>
                  <p>{deleteReason}</p>
                </div>
              </div>
            ) : (
              <div className={styles.deleteWarning}>
                <Trash2 className={styles.deleteIcon} />
                <div>
                  <p><strong>This action cannot be undone.</strong></p>
                  <p>Deleting your submission will remove all files and content you submitted. You'll be able to submit a new assignment after deletion.</p>
                  
                  {submission && (
                    <div className={styles.submissionDetails}>
                      <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                      {submission.content && (
                        <p><strong>Content:</strong> {submission.content.substring(0, 100)}...</p>
                      )}
                      {submission.fileNames && submission.fileNames.length > 0 && (
                        <p><strong>Files:</strong> {submission.fileNames.join(', ')}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={styles.modalActions}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className={styles.cancelButton}
                disabled={deleting}
              >
                Cancel
              </button>
              
              {canDelete && (
                <button
                  onClick={() => handleDeleteSubmission(submission.id)}
                  disabled={deleting || !canDelete}
                  className={styles.deleteButton}
                >
                  {deleting ? (
                    <>
                      <div className={styles.spinner} />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className={styles.deleteButtonIcon} />
                      <span>Delete Submission</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // FIXED: Show loading only if we're actually loading and don't have data
  if (loading && (!assignments || assignments.length === 0)) {
    return (
      <div className={styles.container}>
        <LoadingSpinner message="Loading assignments..." />
      </div>
    );
  }

  if (error && (!assignments || assignments.length === 0)) {
    return (
      <div className={styles.container}>
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Assignments</h2>
          <p className={styles.subtitle}>Manage your course assignments and submissions</p>
        </div>
        <div className={styles.controls}>
          <select 
            className={styles.courseSelect}
            value={selectedCourse || ''}
            onChange={(e) => setSelectedCourse(e.target.value || null)}
          >
            <option value="">All Courses</option>
            {courses?.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          
        </div>
      </div>

      

      <div className={styles.assignmentsList}>
        {!assignments || assignments.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText className={styles.emptyIcon} />
            <h3>No assignments found</h3>
            <p>
              {selectedCourse 
                ? 'There are no assignments for the selected course.' 
                : 'There are no assignments available. Try selecting a specific course or check if you\'re enrolled in any courses.'
              }
            </p>
            {!currentStudentId && (
              <p style={{ color: 'red', fontWeight: 'bold' }}>
                Warning: No student ID found. Please make sure you're logged in.
              </p>
            )}
            {courses && courses.length === 0 && (
              <p style={{ color: 'orange', fontWeight: 'bold' }}>
                Warning: No courses found. You may not be enrolled in any courses.
              </p>
            )}
          </div>
        ) : (
          assignments.map(assignment => {
            const submission = getSubmissionForAssignment(assignment.id);
            const isOverdue = isAssignmentOverdue(assignment);
            
            return (
              <div key={assignment.id} className={styles.assignmentCard}>
                <div className={`${styles.statusBar} ${
                  submission ? styles.statusBarSubmitted : 
                  isOverdue ? styles.statusBarOverdue : styles.statusBarPending
                }`} />
                
                <div className={styles.cardContent}>
                  <div className={styles.cardMain}>
                    <div className={styles.cardHeader}>
                      <div className={`${styles.iconContainer} ${
                        submission ? styles.iconSubmitted : 
                        isOverdue ? styles.iconOverdue : styles.iconPending
                      }`}>
                        {submission ? (
                          <CheckCircle className={styles.icon} />
                        ) : (
                          <FileText className={styles.icon} />
                        )}
                      </div>
                      <div>
                        <h3 className={styles.assignmentTitle}>
                          {assignment.title}
                        </h3>
                        <span className={styles.courseBadge}>
                          {courses?.find(c => c.id === assignment.courseId)?.name || assignment.courseName || 'Unknown Course'}
                        </span>
                      </div>
                    </div>
                    
                    <p className={styles.description}>{assignment.description}</p>
                    
                    {(assignment.fileUrl || assignment.hasAttachment || assignment.fileName) && (
                      <div className={styles.attachmentSection}>
                        <div className={styles.attachmentInfo}>
                          <div className={styles.attachmentDetails}>
                            <Paperclip className={styles.attachmentIcon} />
                            <div>
                              <p className={styles.attachmentLabel}>Assignment File</p>
                              <p className={styles.attachmentFilename}>
                                {assignment.fileName || 'Assignment File'}
                              </p>
                              {assignment.fileSize && (
                                <p className={styles.attachmentFilesize}>
                                  {(assignment.fileSize / 1024 / 1024).toFixed(2)} MB
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownloadFile(assignment)}
                            className={styles.downloadButton}
                          >
                            <Download className={styles.downloadIcon} />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailItem}>
                        <Calendar className={styles.detailIcon} />
                        <div>
                          <p className={styles.detailLabel}>Due Date</p>
                          <p className={styles.detailValue}>
                            {getFormattedDueDateTime(assignment)}
                          </p>
                        </div>
                      </div>
                      <div className={styles.detailItem}>
                        <Target className={styles.detailIcon} />
                        <div>
                          <p className={styles.detailLabel}>Points</p>
                          <p className={styles.detailValue}>{assignment.maxPoints || 100} pts</p>
                        </div>
                      </div>
                      <div className={styles.detailItem}>
                        <Clock className={styles.detailIcon} />
                        <div>
                          <p className={styles.detailLabel}>Status</p>
                          <span className={`${styles.statusBadge} ${
                            submission ? styles.statusBadgeSubmitted :
                            isOverdue ? styles.statusBadgeOverdue : styles.statusBadgePending
                          }`}>
                            {submission ? 'Submitted' : getTimeUntilDue(assignment)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.actionPanel}>
                    {submission ? (
                      <div className={styles.submittedPanel}>
                        <div className={styles.gradeDisplay}>
                          <div className={styles.gradeNumber}>
                            {submission.grade !== null && submission.grade !== undefined ? `${submission.grade}` : 'Pending'}
                          </div>
                          <div className={styles.gradeTotal}>
                            {submission.grade !== null && submission.grade !== undefined ? `/ ${assignment.maxPoints || 100}` : 'Grading...'}
                          </div>
                          {submission.grade !== null && submission.grade !== undefined && (
                            <div className={styles.gradePercentage}>
                              {Math.round((submission.grade / (assignment.maxPoints || 100)) * 100)}%
                            </div>
                          )}
                        </div>
                        
                        <div className={styles.submissionDetails}>
                          <div className={styles.submissionInfo}>
                            <CheckCircle className={styles.submissionIcon} />
                            Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                          </div>
                          {submission.notes && (
                            <div className={styles.notesSection}>
                              <p className={styles.notesLabel}>Your Notes</p>
                              <p className={styles.notesText}>{submission.notes}</p>
                            </div>
                          )}
                          {submission.feedback && (
                            <div className={styles.feedbackSection}>
                              <p className={styles.feedbackLabel}>Instructor Feedback</p>
                              <p className={styles.feedbackText}>{submission.feedback}</p>
                            </div>
                          )}
                          
                          {/* DELETE BUTTON - Only show if not graded yet */}
                          {submission.grade === null && (
                            <div className={styles.submissionActions}>
                              <button
                                onClick={() => setShowDeleteConfirm(submission)}
                                className={styles.deleteSubmissionButton}
                                title="Delete submission to submit a new one"
                              >
                                <Trash2 className={styles.deleteSubmissionIcon} />
                                <span>Delete & Resubmit</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className={styles.submitPanel}>
                        <div className={styles.submitHeader}>
                          <div className={styles.submitLabel}>Submit Assignment</div>
                          <div className={styles.submitIconContainer}>
                            <Upload className={styles.submitIcon} />
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            resetSubmissionModal();
                            setShowSubmissionModal(assignment.id);
                          }}
                          className={styles.submitButton}
                          disabled={assignment.allowSubmissions === false || !assignment.canSubmit}
                        >
                          <Send className={styles.submitButtonIcon} />
                          <span>Submit Assignment</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>Submit Assignment</h3>
                <p className={styles.modalSubtitle}>
                  {assignments.find(a => a.id === showSubmissionModal)?.title}
                </p>
              </div>
              <button
                onClick={() => setShowSubmissionModal(null)}
                className={styles.modalCloseButton}
              >
                <X className={styles.modalCloseIcon} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {submitError && (
                <div className={styles.errorAlert}>
                  <AlertCircle className={styles.errorIcon} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className={styles.contentSection}>
                <label className={styles.contentLabel}>
                  Assignment Content *
                </label>
                <textarea
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  className={styles.contentTextarea}
                  rows={6}
                  placeholder="Enter your assignment text here..."
                />
                <p className={styles.contentHint}>
                  Provide your written response, solution, or explanation
                </p>
              </div>

              <div className={styles.fileUploadSection}>
                <label className={styles.fileUploadLabel}>
                  Upload Files (Optional)
                </label>
                <div className={`${styles.fileUploadArea} ${selectedFiles.length > 0 ? styles.fileUploadAreaHasFiles : ''}`}>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className={styles.fileInput}
                    id="file-upload"
                    multiple
                    accept=".pdf,.doc,.docx,.zip,.txt,.jpg,.png,.jpeg,.xlsx,.pptx"
                  />
                  <label htmlFor="file-upload" className={styles.fileUploadContent}>
                    <div className={styles.fileUploadIcon}>
                      <Upload className={styles.uploadIcon} />
                    </div>
                    <div>
                      <p className={styles.fileUploadText}>
                        {selectedFiles.length > 0 
                          ? `${selectedFiles.length} file(s) selected`
                          : 'Click to select files or drag and drop'
                        }
                      </p>
                      <p className={styles.fileUploadHint}>
                        PDF, DOC, DOCX, ZIP, TXT, JPG, PNG, XLSX, PPTX files supported (Max 50MB each)
                      </p>
                    </div>
                  </label>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className={styles.selectedFiles}>
                    <h4 className={styles.selectedFilesTitle}>Selected Files:</h4>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className={styles.selectedFile}>
                        <div className={styles.selectedFileInfo}>
                          <Paperclip className={styles.selectedFileIcon} />
                          <div>
                            <span className={styles.selectedFileName}>{file.name}</span>
                            <span className={styles.fileSize}>
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className={styles.removeFileButton}
                        >
                          <X className={styles.removeFileIcon} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.notesSection}>
                <label className={styles.notesLabel}>
                  Notes & Comments (Optional)
                </label>
                <textarea
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className={styles.notesTextarea}
                  rows={4}
                  placeholder="Add any notes, comments, or explanations about your submission..."
                />
                <p className={styles.notesHint}>
                  Explain your approach, any challenges faced, or additional features implemented
                </p>
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={() => setShowSubmissionModal(null)}
                  className={styles.cancelButton}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmitAssignment(showSubmissionModal)}
                  disabled={submitting || (selectedFiles.length === 0 && !submissionContent.trim())}
                  className={styles.submitModalButton}
                >
                  {submitting ? (
                    <>
                      <div className={styles.spinner} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className={styles.submitModalIcon} />
                      <span>Submit Assignment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && <DeleteConfirmModal submission={showDeleteConfirm} />}
    </div>
  );
}