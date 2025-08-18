/**
 * Enhanced ExamResponsesTab Component with Complete Manual Grading Modal Integration
 * FIXED: getExamById function call issue
 * File: src/View/Pages/Lecturer/ExamResponsesTab.jsx
 */

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Brain,
  ArrowLeft,
  Users,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Edit3,
  BarChart3,
  Download,
  FileText,
  Flag,
  User,
  Calendar,
  Timer,
  Award,
  Search,
  Filter
} from "lucide-react";
import { formatDateTime } from "../../../Utils/AssignmentsDashboardUtils";
import ExamResponseGradingModal from "./ExamResponseGradingModal"; // Import the grading modal
import styles from "./AssignmentsDashboard.module.css";

export default function ExamResponsesTab({
  // Existing props
  selectedExamForResponses,
  setSelectedExamForResponses,
  selectedExamResponses,
  setSelectedExamResponses,
  bulkResponseAction,
  setBulkResponseAction,
  bulkGradeValue,
  setBulkGradeValue,
  loading,
  exams,
  autoGradeResponse,
  autoGradeAllResponses,
  filteredExams,
  getStudentName,
  getExamResponses,
  getResponsesForExam,
  
  // Manual grading props from hook
  showGradingModal,
  openGradingModal,
  closeGradingModal,
  handleManualGrading,
  gradingModalMode,
  setGradingModalMode,
  selectedResponseForGrading,
  selectedExamForGrading,
  gradingLoading,
  flagResponseForReview,
  unflagResponse,
  getResponseGradingStatus,
  canResponseBeGraded,
  needsManualGrading,
  refetchExamResponses,
  getExamById // ← This should be passed as a prop
}) {
  // Local state for enhanced functionality
  const [bulkFeedback, setBulkFeedback] = useState('');
  const [responseDetails, setResponseDetails] = useState({});
  const [gradingFilter, setGradingFilter] = useState('all'); // 'all', 'needs-grading', 'graded', 'flagged'
  const [sortBy, setSortBy] = useState('submitted'); // 'submitted', 'score', 'student', 'status'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [searchTerm, setSearchTerm] = useState('');

  // FIXED: Fallback function to find exam from filteredExams if getExamById is not available
  const findExamById = (examId) => {
    // First try the provided getExamById function
    if (getExamById && typeof getExamById === 'function') {
      try {
        return getExamById(examId);
      } catch (error) {
        console.warn('⚠️ getExamById failed, using fallback method:', error);
      }
    }
    
    // Fallback: search in filteredExams array
    const exam = filteredExams?.find(e => e.id === examId);
    if (exam) {
      console.log('✅ Found exam using fallback method:', exam.title);
      return exam;
    }
    
    // Last resort: search in exams array
    const examInAll = exams?.find(e => e.id === examId);
    if (examInAll) {
      console.log('✅ Found exam in all exams array:', examInAll.title);
      return examInAll;
    }
    
    console.error('❌ Exam not found with ID:', examId);
    return null;
  };

  // Enhanced Exam Status Component
  const ExamStatusBadge = ({ exam }) => {
    const getStatusInfo = () => {
      if (!exam.visibleToStudents) {
        return { text: "Draft", color: "gray", icon: Edit3 };
      }

      const now = new Date();
      const startTime = new Date(exam.startTime);
      const endTime = new Date(exam.endTime);

      if (now < startTime) {
        return { text: "Scheduled", color: "blue", icon: Clock };
      } else if (now >= startTime && now <= endTime) {
        return { text: "Active", color: "green", icon: CheckCircle };
      } else {
        return { text: "Completed", color: "purple", icon: CheckCircle };
      }
    };

    const { text, color, icon: Icon } = getStatusInfo();

    return (
      <span
        className={`${styles.examStatus} ${
          styles[`examStatus${color.charAt(0).toUpperCase() + color.slice(1)}`]
        }`}
      >
        <Icon className="h-4 w-4" />
        {text}
      </span>
    );
  };

  // Enhanced Response handlers
  const toggleResponseSelection = (responseId) => {
    setSelectedExamResponses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(responseId)) {
        newSet.delete(responseId);
      } else {
        newSet.add(responseId);
      }
      return newSet;
    });
  };

  const selectAllResponses = () => {
    const filteredResponseIds = getFilteredAndSortedResponses().map(r => r.id);
    setSelectedExamResponses(new Set(filteredResponseIds));
  };

  const clearAllSelections = () => {
    setSelectedExamResponses(new Set());
  };

  // FIXED: Enhanced response actions with better error handling
  const handleViewResponse = async (response) => {
    try {
      console.log('👁️ Opening response for viewing:', response.id);
      
      // Use the fixed findExamById function
      const exam = findExamById(response.examId);
      if (!exam) {
        console.error('❌ Exam not found for response:', response.examId);
        alert('Error: Could not find the exam associated with this response. Please refresh the page and try again.');
        return;
      }
      
      console.log('✅ Found exam for viewing:', exam.title);
      await openGradingModal(response, exam, 'view');
    } catch (error) {
      console.error('❌ Error opening response view:', error);
      alert('Error opening response view: ' + error.message);
    }
  };

  const handleGradeResponse = async (response) => {
    try {
      console.log('📝 Opening response for grading:', response.id);
      
      // Use the fixed findExamById function
      const exam = findExamById(response.examId);
      if (!exam) {
        console.error('❌ Exam not found for response:', response.examId);
        alert('Error: Could not find the exam associated with this response. Please refresh the page and try again.');
        return;
      }
      
      console.log('✅ Found exam for grading:', exam.title);
      await openGradingModal(response, exam, 'grade');
    } catch (error) {
      console.error('❌ Error opening grading modal:', error);
      alert('Error opening grading modal: ' + error.message);
    }
  };

  const handleFlagResponse = async (response) => {
    try {
      const reason = prompt('Reason for flagging (optional):');
      if (reason !== null) { // User didn't cancel
        await flagResponseForReview(response.id, reason);
        // Refresh the responses to show updated status
        await refetchExamResponses();
      }
    } catch (error) {
      console.error('❌ Error flagging response:', error);
      alert('Error flagging response: ' + error.message);
    }
  };

  const handleUnflagResponse = async (response) => {
    try {
      await unflagResponse(response.id);
      // Refresh the responses to show updated status
      await refetchExamResponses();
    } catch (error) {
      console.error('❌ Error unflagging response:', error);
      alert('Error unflagging response: ' + error.message);
    }
  };

  const handleAutoGradeResponse = async (responseId) => {
    try {
      await autoGradeResponse(responseId);
      // Refresh the responses to show updated grades
      await refetchExamResponses();
    } catch (error) {
      console.error('❌ Error auto-grading response:', error);
      alert('Error auto-grading response: ' + error.message);
    }
  };

  const handleAutoGradeAllForExam = async (examId) => {
    try {
      await autoGradeAllResponses(examId);
      // Refresh the responses to show updated grades
      await refetchExamResponses();
    } catch (error) {
      console.error('❌ Error auto-grading all responses:', error);
      alert('Error auto-grading all responses: ' + error.message);
    }
  };

  // Filtering and sorting
  const getFilteredAndSortedResponses = () => {
    let responses = getResponsesForExam(selectedExamForResponses);
    
    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      responses = responses.filter(r => 
        getStudentName(r.studentId).toLowerCase().includes(search) ||
        r.studentId.toLowerCase().includes(search) ||
        r.status?.toLowerCase().includes(search)
      );
    }
    
    // Apply status filters
    switch (gradingFilter) {
      case 'needs-grading':
        responses = responses.filter(r => !r.graded && r.status === 'SUBMITTED');
        break;
      case 'graded':
        responses = responses.filter(r => r.graded);
        break;
      case 'flagged':
        responses = responses.filter(r => r.flaggedForReview);
        break;
      case 'in-progress':
        responses = responses.filter(r => r.status === 'IN_PROGRESS');
        break;
      case 'all':
      default:
        // No filtering
        break;
    }
    
    // Apply sorting
    responses.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'student':
          comparison = getStudentName(a.studentId).localeCompare(getStudentName(b.studentId));
          break;
        case 'score':
          comparison = (a.percentage || 0) - (b.percentage || 0);
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        case 'submitted':
        default:
          const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
          const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
          comparison = aTime - bTime;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return responses;
  };

  const handleBulkResponseAction = async () => {
    if (selectedExamResponses.size === 0 || !bulkResponseAction) return;

    const responseIds = Array.from(selectedExamResponses);

    try {
      switch (bulkResponseAction) {
        case "auto-grade":
          console.log('🤖 Auto-grading selected responses:', responseIds);
          for (const responseId of responseIds) {
            await autoGradeResponse(responseId);
          }
          await refetchExamResponses();
          break;
        case "bulk-grade":
          if (bulkGradeValue) {
            console.log('📊 Bulk grading responses:', responseIds, 'with grade:', bulkGradeValue);
            // For bulk grading, we'd need to implement a batch endpoint
            // For now, auto-grade each one
            for (const responseId of responseIds) {
              await autoGradeResponse(responseId);
            }
            await refetchExamResponses();
          }
          break;
        case "export":
          console.log('📤 Exporting selected responses:', responseIds);
          await exportSelectedResponses(responseIds);
          break;
        case "flag":
          console.log('🚩 Flagging selected responses:', responseIds);
          const flagReason = prompt('Reason for flagging these responses:') || 'Bulk flagged for review';
          for (const responseId of responseIds) {
            await flagResponseForReview(responseId, flagReason);
          }
          await refetchExamResponses();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('❌ Error in bulk action:', error);
      alert('Error in bulk action: ' + error.message);
    } finally {
      setSelectedExamResponses(new Set());
      setBulkResponseAction("");
      setBulkGradeValue("");
      setBulkFeedback("");
    }
  };

  // Export selected responses
  const exportSelectedResponses = async (responseIds) => {
    try {
      const responses = getResponsesForExam(selectedExamForResponses)
        .filter(r => responseIds.includes(r.id));
      
      const exam = filteredExams.find(e => e.id === selectedExamForResponses);
      
      // Create CSV content
      let csvContent = 'Student Name,Email,Attempt,Submitted At,Time Spent,Score,Percentage,Status,Passed,Grading Status,Flagged\n';
      
      responses.forEach(response => {
        const student = getStudentName(response.studentId);
        const gradingStatus = getResponseGradingStatus ? getResponseGradingStatus(response) : 'unknown';
        csvContent += `"${student}","","${response.attemptNumber || 1}","${response.submittedAt || 'N/A'}","${formatTimeSpent(response.timeSpent)}","${response.totalScore || 0}/${response.maxScore || 0}","${response.percentage?.toFixed(1) || 0}%","${response.status || 'Unknown'}","${response.passed ? 'Yes' : 'No'}","${gradingStatus}","${response.flaggedForReview ? 'Yes' : 'No'}"\n`;
      });
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `exam_responses_${exam?.title || 'export'}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ Responses exported successfully');
    } catch (error) {
      console.error('❌ Error exporting responses:', error);
      alert('Error exporting responses: ' + error.message);
    }
  };

  // Helper function to format time spent
  const formatTimeSpent = (timeSpent) => {
    if (!timeSpent) return "N/A";
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    return `${minutes}m ${seconds}s`;
  };

  // Helper function to get response status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'submitted':
      case 'graded':
        return 'green';
      case 'in_progress':
      case 'started':
        return 'blue';
      case 'not_started':
        return 'gray';
      case 'abandoned':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Get grading status badge
  const getGradingStatusBadge = (response) => {
    const status = getResponseGradingStatus ? getResponseGradingStatus(response) : 'unknown';
    
    const statusConfig = {
      'needs-grading': { text: 'Needs Grading', color: 'orange', icon: AlertTriangle },
      'auto-graded': { text: 'Auto Graded', color: 'blue', icon: Brain },
      'manually-graded': { text: 'Manual Grade', color: 'green', icon: User },
      'graded': { text: 'Graded', color: 'green', icon: CheckCircle },
      'reviewed': { text: 'Reviewed', color: 'purple', icon: CheckCircle },
      'flagged': { text: 'Flagged', color: 'red', icon: Flag },
      'in-progress': { text: 'In Progress', color: 'gray', icon: Clock },
      'auto_graded': { text: 'Auto Graded', color: 'blue', icon: Brain }
    };
    
    const config = statusConfig[status] || { text: 'Unknown', color: 'gray', icon: AlertTriangle };
    const Icon = config.icon;
    
    return (
      <span className={`${styles.gradingStatus} ${styles[`gradingStatus${config.color.charAt(0).toUpperCase() + config.color.slice(1)}`]}`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    );
  };

  // Calculate statistics for current exam responses
  const calculateResponseStats = () => {
    const responses = getResponsesForExam(selectedExamForResponses);
    
    if (responses.length === 0) {
      return {
        total: 0,
        graded: 0,
        passed: 0,
        average: 0,
        completionRate: 0,
        needsGrading: 0,
        inProgress: 0,
        flagged: 0
      };
    }

    const graded = responses.filter(r => r.graded || r.totalScore !== null).length;
    const passed = responses.filter(r => r.passed).length;
    const completed = responses.filter(r => r.status === 'SUBMITTED' || r.status === 'GRADED' || r.submittedAt).length;
    const needsGrading = responses.filter(r => !r.graded && r.status === 'SUBMITTED').length;
    const inProgress = responses.filter(r => r.status === 'IN_PROGRESS').length;
    const flagged = responses.filter(r => r.flaggedForReview).length;
    
    const gradedResponses = responses.filter(r => r.percentage !== null && r.percentage !== undefined);
    const average = gradedResponses.length > 0 
      ? gradedResponses.reduce((sum, r) => sum + (r.percentage || 0), 0) / gradedResponses.length
      : 0;

    return {
      total: responses.length,
      graded,
      passed,
      average: Math.round(average),
      completionRate: Math.round((completed / responses.length) * 100),
      needsGrading,
      inProgress,
      flagged
    };
  };

  const stats = selectedExamForResponses ? calculateResponseStats() : null;

  return (
    <div className={styles.tabContent}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>Exam Responses & Grading</h3>
            <p className={styles.cardSubtitle}>
              View and grade student exam responses
            </p>
          </div>
          <div className={styles.cardActions}>
            {selectedExamForResponses && (
              <>
                <button
                  onClick={() => refetchExamResponses()}
                  className={styles.secondaryBtn}
                  title="Refresh responses"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => exportSelectedResponses(
                    getResponsesForExam(selectedExamForResponses).map(r => r.id)
                  )}
                  className={styles.secondaryBtn}
                  title="Export all responses"
                >
                  <Download className="h-4 w-4" />
                  <span>Export All</span>
                </button>
                <button
                  onClick={() => handleAutoGradeAllForExam(selectedExamForResponses)}
                  disabled={loading}
                  className={styles.primaryBtn}
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4" />
                  )}
                  <span>Auto-Grade All</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.cardContent}>
          {!selectedExamForResponses ? (
            <div className={styles.examSelector}>
              <h4>Select an Exam to View Responses</h4>
              <div className={styles.examGrid}>
                {filteredExams.map((exam) => {
                  const responseCount = getExamResponses(exam.id).length;
                  const completedCount = getExamResponses(exam.id).filter(r => r.submittedAt).length;
                  const needsGradingCount = getExamResponses(exam.id).filter(r => 
                    !r.graded && r.status === 'SUBMITTED'
                  ).length;
                  const flaggedCount = getExamResponses(exam.id).filter(r => 
                    r.flaggedForReview
                  ).length;
                  
                  return (
                    <div
                      key={exam.id}
                      className={styles.examSelectorCard}
                      onClick={() => setSelectedExamForResponses(exam.id)}
                    >
                      <div className={styles.examSelectorHeader}>
                        <h5>{exam.title}</h5>
                        <ExamStatusBadge exam={exam} />
                      </div>
                      <div className={styles.examSelectorStats}>
                        <div className={styles.examSelectorStat}>
                          <Users className="h-4 w-4" />
                          <span>{responseCount} responses</span>
                        </div>
                        <div className={styles.examSelectorStat}>
                          <CheckCircle className="h-4 w-4" />
                          <span>{completedCount} completed</span>
                        </div>
                        <div className={styles.examSelectorStat}>
                          <AlertTriangle className="h-4 w-4" />
                          <span>{needsGradingCount} need grading</span>
                        </div>
                        <div className={styles.examSelectorStat}>
                          <FileCheck className="h-4 w-4" />
                          <span>{exam.questions?.length || 0} questions</span>
                        </div>
                        {flaggedCount > 0 && (
                          <div className={styles.examSelectorStat}>
                            <Flag className="h-4 w-4 text-red-500" />
                            <span>{flaggedCount} flagged</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Back Button and Exam Info */}
              <div className={styles.responseNavigation}>
                <button
                  onClick={() => setSelectedExamForResponses(null)}
                  className={styles.backBtn}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Exam List
                </button>
                <div className={styles.examInfo}>
                  <h4>
                    Responses for:{" "}
                    {
                      filteredExams.find((e) => e.id === selectedExamForResponses)
                        ?.title
                    }
                  </h4>
                  {stats && (
                    <div className={styles.quickStats}>
                      <span>{stats.total} responses</span>
                      <span>•</span>
                      <span>{stats.graded} graded</span>
                      <span>•</span>
                      <span>{stats.needsGrading} need grading</span>
                      <span>•</span>
                      <span>{stats.average}% average</span>
                      {stats.flagged > 0 && (
                        <>
                          <span>•</span>
                          <span>{stats.flagged} flagged</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Filters and Sorting */}
              <div className={styles.responseFilters}>
                <div className={styles.filterGroup}>
                  <label>Search:</label>
                  <div className={styles.searchInput}>
                    <Search className="h-4 w-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by student name..."
                      className={styles.searchField}
                    />
                  </div>
                </div>
                
                <div className={styles.filterGroup}>
                  <label>Filter:</label>
                  <select
                    value={gradingFilter}
                    onChange={(e) => setGradingFilter(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Responses</option>
                    <option value="needs-grading">Needs Grading</option>
                    <option value="graded">Graded</option>
                    <option value="in-progress">In Progress</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
                
                <div className={styles.filterGroup}>
                  <label>Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="submitted">Submission Time</option>
                    <option value="student">Student Name</option>
                    <option value="score">Score</option>
                    <option value="status">Status</option>
                  </select>
                </div>
                
                <div className={styles.filterGroup}>
                  <label>Order:</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedExamResponses.size > 0 && (
                <div className={styles.bulkResponseActions}>
                  <div className={styles.bulkActionControls}>
                    <span className={styles.selectionCount}>
                      {selectedExamResponses.size} responses selected
                    </span>
                    <select
                      value={bulkResponseAction}
                      onChange={(e) => setBulkResponseAction(e.target.value)}
                      className={styles.bulkSelect}
                    >
                      <option value="">Choose Action</option>
                      <option value="auto-grade">Auto-Grade Selected</option>
                      <option value="flag">Flag for Review</option>
                      <option value="export">Export Selected</option>
                    </select>
                    
                    <button
                      onClick={handleBulkResponseAction}
                      className={styles.bulkActionBtn}
                      disabled={!bulkResponseAction || loading}
                    >
                      {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Apply'}
                    </button>
                    <button
                      onClick={clearAllSelections}
                      className={styles.clearSelectionBtn}
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}

              {/* Responses List */}
              <div className={styles.responsesList}>
                {getFilteredAndSortedResponses().length > 0 ? (
                  <div className={styles.responsesTable}>
                    <div className={styles.responsesTableHeader}>
                      <div className={styles.responsesTableHeaderCell}>
                        <input
                          type="checkbox"
                          checked={
                            selectedExamResponses.size ===
                            getFilteredAndSortedResponses().length &&
                            getFilteredAndSortedResponses().length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              selectAllResponses();
                            } else {
                              clearAllSelections();
                            }
                          }}
                        />
                      </div>
                      <div className={styles.responsesTableHeaderCell}>
                        Student
                      </div>
                      <div className={styles.responsesTableHeaderCell}>
                        Submitted
                      </div>
                      <div className={styles.responsesTableHeaderCell}>
                        Time Spent
                      </div>
                      <div className={styles.responsesTableHeaderCell}>Score</div>
                      <div className={styles.responsesTableHeaderCell}>
                        Status
                      </div>
                      <div className={styles.responsesTableHeaderCell}>
                        Grading
                      </div>
                      <div className={styles.responsesTableHeaderCell}>
                        Actions
                      </div>
                    </div>

                    {getFilteredAndSortedResponses().map((response) => (
                      <div key={response.id} className={styles.responseRow}>
                        <div className={styles.responseCell}>
                          <input
                            type="checkbox"
                            checked={selectedExamResponses.has(response.id)}
                            onChange={() =>
                              toggleResponseSelection(response.id)
                            }
                          />
                        </div>
                        <div className={styles.responseCell}>
                          <div className={styles.studentInfo}>
                            <div className={styles.studentAvatar}>
                              {getStudentName(response.studentId)
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <div className={styles.studentName}>
                                {getStudentName(response.studentId)}
                              </div>
                              <div className={styles.attemptInfo}>
                                Attempt {response.attemptNumber || 1}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.responseCell}>
                          <div className={styles.submissionTime}>
                            {response.submittedAt
                              ? formatDateTime(response.submittedAt)
                              : "In Progress"}
                          </div>
                        </div>
                        <div className={styles.responseCell}>
                          <div className={styles.timeSpent}>
                            {formatTimeSpent(response.timeSpent)}
                          </div>
                        </div>
                        <div className={styles.responseCell}>
                          <div className={styles.scoreDisplay}>
                            {response.totalScore !== null && response.totalScore !== undefined ? (
                              <span
                                className={`${styles.scoreBadge} ${
                                  response.percentage >= 90
                                    ? styles.scoreA
                                    : response.percentage >= 80
                                    ? styles.scoreB
                                    : response.percentage >= 70
                                    ? styles.scoreC
                                    : styles.scoreF
                                }`}
                              >
                                {response.totalScore}/{response.maxScore} (
                                {response.percentage?.toFixed(1) || 0}%)
                              </span>
                            ) : (
                              <span className={styles.ungraded}>
                                Not Graded
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={styles.responseCell}>
                          <div className={styles.statusDisplay}>
                            <span
                              className={`${styles.statusBadge} ${
                                styles[
                                  `status${
                                    getStatusColor(response.status)
                                      ?.charAt(0)
                                      ?.toUpperCase() +
                                    getStatusColor(response.status)?.slice(1)
                                  }`
                                ]
                              }`}
                            >
                              {response.status || "unknown"}
                            </span>
                            {response.passed && (
                              <CheckCircle
                                className="h-4 w-4 text-green-500"
                                title="Passed"
                              />
                            )}
                            {response.lateSubmission && (
                              <Clock
                                className="h-4 w-4 text-orange-500"
                                title="Late Submission"
                              />
                            )}
                          </div>
                        </div>
                        <div className={styles.responseCell}>
                          {getGradingStatusBadge(response)}
                          {response.flaggedForReview && (
                            <Flag
                              className="h-4 w-4 text-red-500 ml-1"
                              title="Flagged for Review"
                            />
                          )}
                        </div>
                        <div className={styles.responseCell}>
                          <div className={styles.responseActions}>
                            <button
                              onClick={() => handleViewResponse(response)}
                              className={`${styles.responseActionBtn} ${styles.responseActionBtnView}`}
                              title="View detailed response"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleGradeResponse(response)}
                              className={`${styles.responseActionBtn} ${styles.responseActionBtnEdit}`}
                              title="Manual grade"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleAutoGradeResponse(response.id)}
                              disabled={loading}
                              className={`${styles.responseActionBtn} ${styles.responseActionBtnGrade}`}
                              title="Auto-grade response"
                            >
                              <Brain className="h-4 w-4" />
                            </button>
                            
                            {response.flaggedForReview ? (
                              <button
                                onClick={() => handleUnflagResponse(response)}
                                className={`${styles.responseActionBtn} ${styles.responseActionBtnFlag}`}
                                title="Remove flag"
                              >
                                <Flag className="h-4 w-4 text-red-500" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleFlagResponse(response)}
                                className={`${styles.responseActionBtn} ${styles.responseActionBtnFlag}`}
                                title="Flag for review"
                              >
                                <Flag className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <BarChart3 className={styles.emptyStateIcon} />
                    <h4 className={styles.emptyStateTitle}>
                      {gradingFilter === 'all' ? 'No Responses Yet' : `No ${gradingFilter.replace('-', ' ')} responses`}
                    </h4>
                    <p className={styles.emptyStateText}>
                      {gradingFilter === 'all' 
                        ? 'Student responses will appear here once they start taking the exam.'
                        : 'Try changing the filter to see other responses.'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Enhanced Response Statistics */}
              {getResponsesForExam(selectedExamForResponses).length > 0 && stats && (
                <div className={styles.responseStats}>
                  <h5>Response Statistics</h5>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>
                        {stats.total}
                      </div>
                      <div className={styles.statLabel}>Total Responses</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>
                        {stats.graded}
                      </div>
                      <div className={styles.statLabel}>Graded</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>
                        {stats.needsGrading}
                      </div>
                      <div className={styles.statLabel}>Need Grading</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>
                        {stats.inProgress}
                      </div>
                      <div className={styles.statLabel}>In Progress</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>
                        {stats.passed}
                      </div>
                      <div className={styles.statLabel}>Passed</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>
                        {stats.average}%
                      </div>
                      <div className={styles.statLabel}>Average Score</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>
                        {stats.completionRate}%
                      </div>
                      <div className={styles.statLabel}>Completion Rate</div>
                    </div>
                    {stats.flagged > 0 && (
                      <div className={styles.statCard}>
                        <div className={styles.statValue}>
                          {stats.flagged}
                        </div>
                        <div className={styles.statLabel}>Flagged</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Manual Grading Modal */}
      <ExamResponseGradingModal
        isOpen={showGradingModal}
        onClose={closeGradingModal}
        response={selectedResponseForGrading}
        exam={selectedExamForGrading}
        onSaveGrade={handleManualGrading}
        loading={gradingLoading}
        getStudentName={getStudentName}
        mode={gradingModalMode}
        onModeChange={setGradingModalMode}
      />
    </div>
  );
}