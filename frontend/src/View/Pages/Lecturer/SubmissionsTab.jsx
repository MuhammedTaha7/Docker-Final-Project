/**
 * Enhanced SubmissionsTab Component - FIXED TO MATCH BACKEND
 * File: src/View/Pages/Lecturer/SubmissionsTab.jsx
 */

import React, { useState, useCallback } from "react";
import {
  Users,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  BookOpen,
  PaperclipIcon,
  Award,
  CheckSquare,
  ExternalLink,
  Download,
  Edit,
  Brain,
  Plus,
  Save,
  X,
  RefreshCw,
  MessageSquare,
  Calendar,
  Hash,
  Star,
  FileText,
  StickyNote
} from "lucide-react";
import {
  formatFileSize,
  getFileTypeIcon,
} from "../../../Api/AssignmentsDashboardAPI";
import styles from "./AssignmentsDashboard.module.css";

export default function SubmissionsTab({
  // State
  selectedAssignmentForSubmissions,
  setSelectedAssignmentForSubmissions,
  loading,
  submissionsLoading,

  // Data
  selectedCourseData,
  students,
  assignments,
  submissions,

  // Actions
  handleViewFile,
  updateSubmissionGrade,
  setActiveTab,
  setShowAssignmentForm,
  refetchSubmissions,

  // Computed values
  filteredSubmissions,
  filteredAssignments,
  getStudentName,
  getSubmissionsForAssignment,
}) {
  // Local state for inline grade editing
  const [editingGrade, setEditingGrade] = useState(null);
  const [tempGrade, setTempGrade] = useState('');
  const [tempFeedback, setTempFeedback] = useState('');
  const [gradingInProgress, setGradingInProgress] = useState(new Set());

  // Bulk grading state
  const [selectedSubmissionIds, setSelectedSubmissionIds] = useState(new Set());
  const [showBulkGrading, setShowBulkGrading] = useState(false);
  const [bulkGrade, setBulkGrade] = useState('');
  const [bulkFeedback, setBulkFeedback] = useState('');

  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // FIXED: Enhanced handleStartEditGrade
  const handleStartEditGrade = useCallback((submission) => {
    console.log('🎯 handleStartEditGrade called with submission:', {
      id: submission.id,
      currentGrade: submission.grade,
      currentFeedback: submission.feedback,
      isGraded: submission.isGraded
    });
    
    setEditingGrade(submission.id);
    setTempGrade(submission.grade || '');
    setTempFeedback(submission.feedback || '');
  }, []);

  // FIXED: Enhanced handleSaveGrade
  const handleSaveGrade = useCallback(async (submissionId) => {
    console.log('💾 handleSaveGrade called for submission:', submissionId);
    console.log('💾 tempGrade:', tempGrade);
    console.log('💾 tempFeedback:', tempFeedback);
    
    const gradeValue = tempGrade === '' ? null : parseInt(tempGrade);
    
    if (gradeValue !== null && (gradeValue < 0 || gradeValue > 100)) {
      alert('Grade must be between 0 and 100');
      return;
    }
    
    try {
      setGradingInProgress(prev => new Set(prev).add(submissionId));
      
      await updateSubmissionGrade(submissionId, gradeValue, tempFeedback);
      
      setEditingGrade(null);
      setTempGrade('');
      setTempFeedback('');
    } catch (error) {
      console.error('💾 Error saving grade:', error);
      alert('Error saving grade: ' + error.message);
    } finally {
      setGradingInProgress(prev => {
        const newSet = new Set(prev);
        newSet.delete(submissionId);
        return newSet;
      });
    }
  }, [tempGrade, tempFeedback, updateSubmissionGrade]);

  // FIXED: Enhanced handleCancelEdit
  const handleCancelEdit = useCallback(() => {
    console.log('❌ handleCancelEdit called');
    setEditingGrade(null);
    setTempGrade('');
    setTempFeedback('');
  }, []);

  const handleSelectSubmission = useCallback((submissionId, isSelected) => {
    setSelectedSubmissionIds(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(submissionId);
      } else {
        newSet.delete(submissionId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((isSelected) => {
    if (isSelected) {
      const currentSubmissions = selectedAssignmentForSubmissions
        ? getSubmissionsForAssignment(selectedAssignmentForSubmissions)
        : filteredSubmissions;
      setSelectedSubmissionIds(new Set(currentSubmissions.map(sub => sub.id)));
    } else {
      setSelectedSubmissionIds(new Set());
    }
  }, [selectedAssignmentForSubmissions, getSubmissionsForAssignment, filteredSubmissions]);

  const handleBulkGrade = useCallback(async () => {
    if (selectedSubmissionIds.size === 0) {
      alert('Please select submissions to grade');
      return;
    }
    
    const grade = parseInt(bulkGrade);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      alert('Please enter a valid grade between 0 and 100');
      return;
    }

    try {
      setGradingInProgress(prev => new Set([...prev, ...selectedSubmissionIds]));
      
      // Grade each submission individually to ensure proper sync
      for (const submissionId of selectedSubmissionIds) {
        await updateSubmissionGrade(submissionId, grade, bulkFeedback);
      }
      
      setSelectedSubmissionIds(new Set());
      setBulkGrade('');
      setBulkFeedback('');
      setShowBulkGrading(false);
    } catch (error) {
      console.error('Error bulk grading:', error);
      alert('Error bulk grading: ' + error.message);
    } finally {
      setGradingInProgress(new Set());
    }
  }, [selectedSubmissionIds, bulkGrade, bulkFeedback, updateSubmissionGrade]);

  // Get current submissions based on filters
  const getCurrentSubmissions = useCallback(() => {
    let currentSubmissions = selectedAssignmentForSubmissions
      ? getSubmissionsForAssignment(selectedAssignmentForSubmissions)
      : filteredSubmissions;

    console.log('📄 getCurrentSubmissions called');
    console.log('📄 selectedAssignmentForSubmissions:', selectedAssignmentForSubmissions);
    console.log('📄 Raw currentSubmissions length:', currentSubmissions.length);

    // Apply status filter
    if (statusFilter !== 'all') {
      currentSubmissions = currentSubmissions.filter(sub => {
        switch (statusFilter) {
          case 'graded':
            return sub.isGraded;
          case 'pending':
            return sub.needsGrading;
          case 'late':
            return sub.isLate;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    currentSubmissions.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'studentName') {
        aValue = getStudentName(a.studentId);
        bValue = getStudentName(b.studentId);
      } else if (sortBy === 'assignmentTitle') {
        const aAssignment = assignments.find(ass => ass.id === a.taskId || ass.id === a.assignmentId);
        const bAssignment = assignments.find(ass => ass.id === b.taskId || ass.id === b.assignmentId);
        aValue = aAssignment?.title || '';
        bValue = bAssignment?.title || '';
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    console.log('📄 Final filtered currentSubmissions length:', currentSubmissions.length);
    return currentSubmissions;
  }, [
    selectedAssignmentForSubmissions,
    getSubmissionsForAssignment,
    filteredSubmissions,
    statusFilter,
    sortBy,
    sortOrder,
    getStudentName,
    assignments
  ]);

  const currentSubmissions = getCurrentSubmissions();

  const submissionStats = {
    total: currentSubmissions.length,
    graded: currentSubmissions.filter(sub => sub.isGraded).length,
    pending: currentSubmissions.filter(sub => sub.needsGrading).length,
    late: currentSubmissions.filter(sub => sub.isLate).length
  };

  console.log('📄 === SUBMISSIONS TAB RENDER ===');
  console.log('📄 selectedAssignmentForSubmissions:', selectedAssignmentForSubmissions);
  console.log('📄 filteredSubmissions length:', filteredSubmissions.length);
  console.log('📄 currentSubmissions length:', currentSubmissions.length);
  console.log('📄 submissionStats:', submissionStats);

  return (
    <div className={styles.tabContent}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>
              Task Submissions - {selectedCourseData?.name}
            </h3>
            <p className={styles.cardSubtitle}>
              Student submissions for course assignments and tasks with automatic grade sync
            </p>
          </div>
          <div className={styles.cardActions}>
            <button
              onClick={refetchSubmissions}
              disabled={submissionsLoading}
              className={styles.refreshBtn}
              title="Refresh submissions"
            >
              <RefreshCw className={submissionsLoading ? 'animate-spin h-4 w-4' : 'h-4 w-4'} />
            </button>
            <div className={styles.submissionFilters}>
              <select
                value={selectedAssignmentForSubmissions || ""}
                onChange={(e) => {
                  const value = e.target.value || null;
                  console.log('📄 Assignment filter changed to:', value);
                  setSelectedAssignmentForSubmissions(value);
                }}
                className={styles.formSelect}
              >
                <option value="">All assignments</option>
                {filteredAssignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.cardContent}>
          

          {currentSubmissions && currentSubmissions.length > 0 ? (
            <div className={styles.submissionsContainer}>
              {/* Enhanced Submissions Summary */}
              <div className={styles.submissionsSummary}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon}>
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className={styles.summaryContent}>
                    <div className={styles.summaryValue}>
                      {submissionStats.total}
                    </div>
                    <div className={styles.summaryLabel}>Total Submissions</div>
                  </div>
                </div>

                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon}>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className={styles.summaryContent}>
                    <div className={styles.summaryValue}>
                      {submissionStats.graded}
                    </div>
                    <div className={styles.summaryLabel}>Graded</div>
                  </div>
                </div>

                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className={styles.summaryContent}>
                    <div className={styles.summaryValue}>
                      {submissionStats.pending}
                    </div>
                    <div className={styles.summaryLabel}>Need Grading</div>
                  </div>
                </div>

                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className={styles.summaryContent}>
                    <div className={styles.summaryValue}>
                      {submissionStats.late}
                    </div>
                    <div className={styles.summaryLabel}>Late Submissions</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Filters and Controls */}
              <div className={styles.submissionsControls}>
                <div className={styles.filterControls}>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="all">All Status</option>
                    <option value="graded">Graded</option>
                    <option value="pending">Need Grading</option>
                    <option value="late">Late</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="submittedAt">Submission Date</option>
                    <option value="studentName">Student Name</option>
                    <option value="assignmentTitle">Assignment</option>
                    <option value="grade">Grade</option>
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>

                <div className={styles.bulkControls}>
                  {selectedSubmissionIds.size > 0 && (
                    <div className={styles.bulkActionsBar}>
                      <span className={styles.selectedCount}>
                        {selectedSubmissionIds.size} selected
                      </span>
                      <button
                        onClick={() => setShowBulkGrading(true)}
                        className={styles.bulkGradeBtn}
                      >
                        Bulk Grade
                      </button>
                      <button
                        onClick={() => setSelectedSubmissionIds(new Set())}
                        className={styles.clearSelectionBtn}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bulk Grading Modal */}
              {showBulkGrading && (
                <div className={styles.modal}>
                  <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                      <h4>Bulk Grade Submissions</h4>
                      <button
                        onClick={() => setShowBulkGrading(false)}
                        className={styles.modalCloseBtn}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className={styles.modalBody}>
                      <p>Grading {selectedSubmissionIds.size} submissions</p>
                      <div className={styles.formGroup}>
                        <label>Grade (0-100)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bulkGrade}
                          onChange={(e) => setBulkGrade(e.target.value)}
                          className={styles.formInput}
                          placeholder="Enter grade"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Feedback (optional)</label>
                        <textarea
                          value={bulkFeedback}
                          onChange={(e) => setBulkFeedback(e.target.value)}
                          className={styles.formTextarea}
                          placeholder="Enter feedback for all selected submissions"
                          rows="3"
                        />
                      </div>
                    </div>
                    <div className={styles.modalActions}>
                      <button
                        onClick={handleBulkGrade}
                        disabled={!bulkGrade || gradingInProgress.size > 0}
                        className={styles.primaryBtn}
                      >
                        {gradingInProgress.size > 0 ? 'Grading...' : 'Grade All'}
                      </button>
                      <button
                        onClick={() => setShowBulkGrading(false)}
                        className={styles.secondaryBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Submissions Table */}
              <div className={styles.submissionsTable}>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr className={styles.tableHeaderRow}>
                        <th className={styles.tableHeader}>
                          <input
                            type="checkbox"
                            checked={selectedSubmissionIds.size === currentSubmissions.length && currentSubmissions.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                        </th>
                        <th className={styles.tableHeader}>
                          <div className={styles.tableHeaderWithIcon}>
                            <Users className={styles.tableHeaderIcon} />
                            <span>Student</span>
                          </div>
                        </th>
                        <th className={styles.tableHeader}>
                          <div className={styles.tableHeaderWithIcon}>
                            <BookOpen className={styles.tableHeaderIcon} />
                            <span>Assignment</span>
                          </div>
                        </th>
                        <th className={styles.tableHeader}>
                          <div className={styles.tableHeaderWithIcon}>
                            <Clock className={styles.tableHeaderIcon} />
                            <span>Submitted</span>
                          </div>
                        </th>
                        <th className={styles.tableHeader}>
                          <div className={styles.tableHeaderWithIcon}>
                            <PaperclipIcon className={styles.tableHeaderIcon} />
                            <span>Files</span>
                          </div>
                        </th>
                        <th className={styles.tableHeader}>
                          <div className={styles.tableHeaderWithIcon}>
                            <FileText className={styles.tableHeaderIcon} />
                            <span>Content</span>
                          </div>
                        </th>
                        <th className={styles.tableHeader}>
                          <div className={styles.tableHeaderWithIcon}>
                            <StickyNote className={styles.tableHeaderIcon} />
                            <span>Notes</span>
                          </div>
                        </th>
                        <th className={styles.tableHeader}>
                          <div className={styles.tableHeaderWithIcon}>
                            <Award className={styles.tableHeaderIcon} />
                            <span>Grade</span>
                          </div>
                        </th>
                        <th className={styles.tableHeader}>
                          <div className={styles.tableHeaderWithIcon}>
                            <CheckSquare className={styles.tableHeaderIcon} />
                            <span>Status</span>
                          </div>
                        </th>
                        <th className={styles.tableHeaderCenter}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                      {currentSubmissions.map((submission) => {
                        // FIXED: Use taskId instead of assignmentId for assignment lookup
                        const assignment = assignments.find(
                          (a) => a.id === submission.taskId
                        );
                        const student = students.find(
                          (s) => s.id === submission.studentId
                        );
                        const isGrading = gradingInProgress.has(submission.id);

                        return (
                          <tr key={submission.id} className={styles.tableRow}>
                            {/* Selection Checkbox */}
                            <td className={styles.tableCell}>
                              <input
                                type="checkbox"
                                checked={selectedSubmissionIds.has(submission.id)}
                                onChange={(e) => handleSelectSubmission(submission.id, e.target.checked)}
                              />
                            </td>

                            {/* Student Info */}
                            <td className={styles.tableCell}>
                              <div className={styles.studentInfo}>
                                <div className={styles.studentAvatar}>
                                  {getStudentName(submission.studentId)
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div>
                                  <div className={styles.studentName}>
                                    {getStudentName(submission.studentId)}
                                  </div>
                                  <div className={styles.submissionId}>
                                    ID: {submission.id.substring(0, 8)}...
                                  </div>
                                  {submission.attemptNumber > 1 && (
                                    <div className={styles.attemptNumber}>
                                      <Hash className="h-3 w-3" />
                                      Attempt {submission.attemptNumber}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Assignment Info */}
                            <td className={styles.tableCell}>
                              <div className={styles.assignmentInfo}>
                                <div className={styles.assignmentTitle}>
                                  {assignment?.title || "Unknown Assignment"}
                                </div>
                                <div className={styles.assignmentType}>
                                  {assignment?.type || "task"}
                                  {assignment?.maxPoints && (
                                    <span className={styles.maxPoints}>
                                      / {assignment.maxPoints} pts
                                    </span>
                                  )}
                                </div>
                                <div className={styles.taskIdDebug} style={{ fontSize: '10px', color: '#666' }}>
                                  TaskID: {submission.taskId}
                                </div>
                              </div>
                            </td>

                            {/* Submission Time */}
                            <td className={styles.tableCell}>
                              <div className={styles.submissionTime}>
                                <div className={styles.submissionDate}>
                                  <Calendar className="h-3 w-3" />
                                  {submission.submittedAt
                                    ? new Date(
                                        submission.submittedAt
                                      ).toLocaleDateString()
                                    : "Not submitted"}
                                </div>
                                <div className={styles.submissionTimeDetails}>
                                  {submission.submittedAt
                                    ? new Date(
                                        submission.submittedAt
                                      ).toLocaleTimeString()
                                    : ""}
                                  {submission.isLate && (
                                    <span className={styles.lateIndicator}>
                                      <AlertTriangle className="h-3 w-3" />
                                      Late
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Files */}
                            <td className={styles.tableCell}>
                              <div className={styles.submissionFiles}>
                                {submission.hasFiles ? (
                                  <div className={styles.filesList}>
                                    {submission.fileNames?.map(
                                      (fileName, index) => (
                                        <div
                                          key={index}
                                          className={styles.fileItem}
                                        >
                                          <span className={styles.fileIcon}>
                                            {getFileTypeIcon(fileName)}
                                          </span>
                                          <span className={styles.fileName}>
                                            {fileName.length > 20
                                              ? fileName.substring(0, 20) + "..."
                                              : fileName}
                                          </span>
                                          {submission.fileUrls &&
                                            submission.fileUrls[index] && (
                                              <button
                                                onClick={() =>
                                                  handleViewFile(
                                                    submission.fileUrls[index],
                                                    fileName
                                                  )
                                                }
                                                className={styles.fileViewBtn}
                                                title="View file"
                                              >
                                                <ExternalLink className="h-3 w-3" />
                                              </button>
                                            )}
                                        </div>
                                      )
                                    ) || (
                                      <div className={styles.fileItem}>
                                        <span className={styles.fileIcon}>
                                          📄
                                        </span>
                                        <span className={styles.fileName}>
                                          File attached
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className={styles.noFiles}>No files</span>
                                )}
                              </div>
                            </td>

                            {/* Content Column */}
                            <td className={styles.tableCell}>
                              <div className={styles.submissionContent}>
                                {submission.content ? (
                                  <div className={styles.contentDisplay}>
                                    <div className={styles.contentText}>
                                      {submission.content.length > 100
                                        ? submission.content.substring(0, 100) + "..."
                                        : submission.content}
                                    </div>
                                    {submission.content.length > 100 && (
                                      <div className={styles.contentExpandTrigger}>
                                        <FileText className="h-3 w-3" />
                                        Show more
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className={styles.noContent}>No text content</span>
                                )}
                              </div>
                            </td>

                            {/* Notes Column */}
                            <td className={styles.tableCell}>
                              <div className={styles.submissionNotes}>
                                {submission.notes ? (
                                  <div className={styles.notesDisplay}>
                                    <div className={styles.notesText}>
                                      {submission.notes.length > 80
                                        ? submission.notes.substring(0, 80) + "..."
                                        : submission.notes}
                                    </div>
                                  </div>
                                ) : (
                                  <span className={styles.noNotes}>No notes</span>
                                )}
                              </div>
                            </td>

                            {/* Grade Section */}
                            <td className={styles.tableCell}>
                              <div className={styles.gradeSection}>
                                {editingGrade === submission.id ? (
                                  // EDITING MODE - Show input form
                                  <div className={styles.gradeEditForm}>
                                    <input
                                      type="number"
                                      placeholder="Grade (0-100)"
                                      className={styles.gradeInput}
                                      min="0"
                                      max="100"
                                      value={tempGrade}
                                      onChange={(e) => setTempGrade(e.target.value)}
                                      autoFocus
                                    />
                                    <textarea
                                      placeholder="Feedback (optional)"
                                      className={styles.feedbackInput}
                                      value={tempFeedback}
                                      onChange={(e) => setTempFeedback(e.target.value)}
                                      rows="2"
                                    />
                                    <div className={styles.gradeEditActions}>
                                      <button
                                        onClick={() => handleSaveGrade(submission.id)}
                                        className={styles.saveGradeBtn}
                                        disabled={isGrading}
                                      >
                                        {isGrading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {isGrading ? 'Saving...' : 'Save'}
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        className={styles.cancelGradeBtn}
                                        disabled={isGrading}
                                      >
                                        <X className="h-4 w-4" />
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : submission.isGraded ? (
                                  // GRADED - Show grade display with edit option
                                  <div className={styles.gradeDisplay}>
                                    <span
                                      className={`${styles.gradeBadge} ${
                                        submission.grade >= 90
                                          ? styles.gradeA
                                          : submission.grade >= 80
                                          ? styles.gradeB
                                          : submission.grade >= 70
                                          ? styles.gradeC
                                          : styles.gradeF
                                      }`}
                                    >
                                      {submission.finalGrade !== null
                                        ? Math.round(submission.finalGrade)
                                        : submission.grade}
                                      /100
                                    </span>
                                    {submission.latePenaltyApplied > 0 && (
                                      <div className={styles.penaltyIndicator}>
                                        -{submission.latePenaltyApplied}%
                                        penalty
                                      </div>
                                    )}
                                    {submission.feedback && (
                                      <div className={styles.feedbackPreview}>
                                        <MessageSquare className="h-3 w-3" />
                                        {submission.feedback.length > 50
                                          ? submission.feedback.substring(0, 50) + "..."
                                          : submission.feedback}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  // NOT GRADED - Show grade button
                                  <div className={styles.gradeActions}>
                                    <button
                                      onClick={() => handleStartEditGrade(submission)}
                                      className={styles.gradeButton}
                                      disabled={isGrading}
                                    >
                                      <Star className="h-4 w-4" />
                                      Grade
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Status */}
                            <td className={styles.tableCell}>
                              <div className={styles.statusDisplay}>
                                <span
                                  className={`${styles.statusBadge} ${
                                    styles[
                                      `status${
                                        submission.status
                                          ?.charAt(0)
                                          ?.toUpperCase() +
                                        submission.status?.slice(1)
                                      }`
                                    ]
                                  }`}
                                >
                                  {submission.status || "submitted"}
                                </span>
                                {submission.autoGraded && (
                                  <span className={styles.autoGradedIndicator}>
                                    <Brain className="h-3 w-3" />
                                    Auto
                                  </span>
                                )}
                                {submission.isLate && (
                                  <span className={styles.lateIndicator}>
                                    <AlertTriangle className="h-3 w-3" />
                                    Late
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className={styles.tableCellCenter}>
                              <div className={styles.submissionActions}>
                                {submission.hasFiles && (
                                  <button
                                    onClick={() => {
                                      // Simulate download - replace with actual download logic
                                      console.log('📥 Download submission:', submission.id);
                                    }}
                                    disabled={loading}
                                    className={`${styles.submissionActionBtn} ${styles.submissionActionBtnDownload}`}
                                    title="Download submission"
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    // Check if currently editing this submission
                                    if (editingGrade === submission.id) {
                                      handleCancelEdit(); // Cancel editing if already editing
                                    } else {
                                      handleStartEditGrade(submission); // Start editing
                                    }
                                  }}
                                  className={`${styles.submissionActionBtn} ${styles.submissionActionBtnEdit} ${
                                    editingGrade === submission.id ? styles.editing : ''
                                  }`}
                                  title={editingGrade === submission.id ? "Cancel editing" : "Edit grade"}
                                  disabled={isGrading}
                                >
                                  {editingGrade === submission.id ? (
                                    <X className="h-4 w-4" />
                                  ) : (
                                    <Edit className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {currentSubmissions.length === 0 && (
                        <tr>
                          <td colSpan={10} className={styles.emptyTableCell}>
                            {selectedAssignmentForSubmissions
                              ? "No submissions found for the selected assignment."
                              : statusFilter !== 'all'
                              ? `No submissions found with status: ${statusFilter}.`
                              : "No submissions found for this course."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Enhanced Feedback Section for Graded Submissions */}
              {currentSubmissions.some((sub) => sub.feedback) && (
                <div className={styles.feedbackSection}>
                  <h4 className={styles.feedbackSectionTitle}>
                    Recent Feedback
                  </h4>
                  <div className={styles.feedbackList}>
                    {currentSubmissions
                      .filter((sub) => sub.feedback)
                      .slice(0, 5)
                      .map((submission) => {
                        const assignment = assignments.find(
                          (a) => a.id === submission.taskId
                        );
                        return (
                          <div
                            key={submission.id}
                            className={styles.feedbackItem}
                          >
                            <div className={styles.feedbackHeader}>
                              <div className={styles.feedbackStudent}>
                                {getStudentName(submission.studentId)}
                              </div>
                              <div className={styles.feedbackAssignment}>
                                {assignment?.title || "Unknown Assignment"}
                              </div>
                              <div className={styles.feedbackGrade}>
                                Grade: {submission.grade}/100
                              </div>
                              <div className={styles.feedbackDate}>
                                {submission.gradedAt ? new Date(submission.gradedAt).toLocaleDateString() : ''}
                              </div>
                            </div>
                            <div className={styles.feedbackContent}>
                              <MessageSquare className="h-4 w-4" />
                              {submission.feedback}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Upload className={styles.emptyStateIcon} />
              <h4 className={styles.emptyStateTitle}>No Submissions Yet</h4>
              <p className={styles.emptyStateText}>
                Student submissions will appear here once assignments are
                created and students start submitting their work. Make sure
                assignments are published and visible to students.
              </p>
              <div style={{ marginTop: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
                <h5>Debug Information:</h5>
                <p><strong>Selected Assignment:</strong> {selectedAssignmentForSubmissions || 'None'}</p>
                <p><strong>Total Submissions:</strong> {filteredSubmissions.length}</p>
                <p><strong>Filtered Assignments:</strong> {filteredAssignments.length}</p>
                <p><strong>Status Filter:</strong> {statusFilter}</p>
                {filteredSubmissions.length > 0 && (
                  <p><strong>Sample Submission TaskID:</strong> {filteredSubmissions[0].taskId}</p>
                )}
              </div>
              {filteredAssignments.length === 0 && (
                <button
                  onClick={() => {
                    setActiveTab("assignments");
                    setShowAssignmentForm(true);
                  }}
                  className={styles.primaryBtn}
                >
                  <Plus className={styles.btnIcon} />
                  <span>Create Your First Assignment</span>
                </button>
              )}
              {submissionsLoading && (
                <div className={styles.loadingIndicator}>
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span>Loading submissions...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}