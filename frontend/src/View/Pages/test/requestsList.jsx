/**
 * Lecturer Dashboard Component - Enhanced with Full Online Exam Support
 * File: src/View/Pages/Lecturer/AssignmentsDashboard.jsx
 */

import React, { useState, useCallback, useRef } from "react";
import {
  Users,
  Upload,
  GraduationCap,
  Save,
  Download,
  Plus,
  Trash2,
  Edit3,
  Award,
  ClipboardList,
  FileText,
  Settings,
  Percent,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  Eye,
  Clock,
  Calendar,
  BookOpen,
  Target,
  Play,
  Pause,
  Edit,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  PaperclipIcon,
  X,
  Timer,
  Users as StudentsIcon,
  Award as TrophyIcon,
  BarChart3,
  FileCheck,
  Send,
  Copy,
  ChevronDown,
  ChevronUp,
  Star,
  AlertTriangle,
  CheckSquare,
  Square,
  Shuffle,
  Navigation,
  Shield,
  Monitor,
  Zap,
  Brain,
  Globe,
} from "lucide-react";
import { useLecturerDashboard } from "../../../Hooks/useAssignmentsDashboard";
import { formatDateTime } from "../../../Utils/AssignmentsDashboardUtils";
import {
  formatFileSize,
  getFileTypeIcon,
} from "../../../Api/AssignmentsDashboardAPI";
import styles from "./AssignmentsDashboard.module.css";

export default function LecturerDashboard() {
  const {
    // State
    activeTab,
    setActiveTab,
    selectedCourse,
    setSelectedCourse,
    selectedAssignmentForSubmissions,
    setSelectedAssignmentForSubmissions,
    selectedExamForPreview,
    setSelectedExamForPreview,
    selectedExamForResponses,
    setSelectedExamForResponses,
    editingExam,
    setEditingExam,
    editingAssignment,
    setEditingAssignment,
    editingQuestion,
    setEditingQuestion,
    showColumnForm,
    setShowColumnForm,
    showExamForm,
    setShowExamForm,
    showAssignmentForm,
    setShowAssignmentForm,
    loading,
    error,
    success,

    // Data
    courses,
    students,
    assignments,
    submissions,
    exams,
    examResponses,
    gradeColumns,

    // Forms
    newAssignment,
    setNewAssignment,
    newColumn,
    setNewColumn,
    newExam,
    setNewExam,
    newQuestion,
    setNewQuestion,

    // Actions - Enhanced with Fixed File Handling
    handleFileUpload,
    handleViewFile,
    handleRemoveFile,
    addAssignment,
    addGradeColumn,
    updateColumn,
    deleteColumn,
    updateGrade,
    deleteAssignment,
    updateAssignment,
    updateSubmissionGrade,

    // Exam Actions - FULL IMPLEMENTATION
    createExam,
    updateExam,
    deleteExam,
    publishExam,
    unpublishExam,
    updateExamStatus,
    addQuestionToExam,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    updateExamResponseScore,
    autoGradeResponse,
    autoGradeAllResponses,

    exportGrades,

    // Computed values
    filteredStudents,
    filteredAssignments,
    filteredColumns,
    filteredExams,
    selectedCourseData,
    calculateFinalGrade,
    getTotalPercentage,
    getStudentName,
    getSubmissionsForAssignment,
    getExamResponses,
    getResponsesForExam,
  } = useLecturerDashboard();

  // Local state for assignment viewing and editing
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [editingAssignmentData, setEditingAssignmentData] = useState(null);
  const fileInputRef = useRef(null);

  // Exam-specific local state
  const [viewingExam, setViewingExam] = useState(null);
  const [editingExamData, setEditingExamData] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const [bulkQuestionAction, setBulkQuestionAction] = useState("");
  const [examPreviewMode, setExamPreviewMode] = useState(false);
  const [selectedExamResponses, setSelectedExamResponses] = useState(new Set());
  const [bulkResponseAction, setBulkResponseAction] = useState("");
  const [bulkGradeValue, setBulkGradeValue] = useState("");

  // Enhanced file handling functions
  const handleFileUploadWithValidation = useCallback(
    async (event, assignmentId = null) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        await handleFileUpload(event, assignmentId);
      } catch (err) {
        console.error("File validation error:", err);
        event.target.value = "";
      }
    },
    [handleFileUpload]
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
    if (newAssignment.fileUrl) {
      handleRemoveFile(newAssignment.fileUrl);
    }
  }, [setNewAssignment, newAssignment.fileUrl, handleRemoveFile]);

  // Assignment handlers
  const handleEditAssignment = (assignment) => {
    setEditingAssignmentData({ ...assignment });
    setEditingAssignment(assignment.id);
  };

  const handleCancelEdit = () => {
    setEditingAssignmentData(null);
    setEditingAssignment(null);
  };

  const handleSaveEdit = async () => {
    if (editingAssignmentData) {
      await updateAssignment(editingAssignmentData.id, editingAssignmentData);
      setEditingAssignmentData(null);
      setEditingAssignment(null);
    }
  };

  const handleViewAssignment = (assignment) => {
    setViewingAssignment(assignment);
  };

  // Exam handlers
  const handleEditExam = (exam) => {
    setEditingExamData({ ...exam });
    setEditingExam(exam.id);
  };

  const handleCancelExamEdit = () => {
    setEditingExamData(null);
    setEditingExam(null);
  };

  const handleSaveExamEdit = async () => {
    if (editingExamData) {
      await updateExam(editingExamData.id, editingExamData);
      setEditingExamData(null);
      setEditingExam(null);
    }
  };

  const handleViewExam = (exam) => {
    setViewingExam(exam);
    setSelectedExamForPreview(exam.id);
  };

  const handleViewExamResponses = (exam) => {
    setSelectedExamForResponses(exam.id);
  };

  // Question handlers
  const toggleQuestionExpansion = (questionId) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleBulkQuestionAction = async () => {
    if (selectedQuestions.size === 0 || !bulkQuestionAction) return;

    const questionIds = Array.from(selectedQuestions);

    switch (bulkQuestionAction) {
      case "delete":
        if (window.confirm(`Delete ${questionIds.length} questions?`)) {
          for (const questionId of questionIds) {
            await deleteQuestion(editingExam, questionId);
          }
          setSelectedQuestions(new Set());
        }
        break;
      case "reorder":
        await reorderQuestions(editingExam, questionIds);
        break;
      default:
        break;
    }
    setBulkQuestionAction("");
  };

  // Response handlers
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

  const handleBulkResponseAction = async () => {
    if (selectedExamResponses.size === 0 || !bulkResponseAction) return;

    const responseIds = Array.from(selectedExamResponses);

    switch (bulkResponseAction) {
      case "auto-grade":
        for (const responseId of responseIds) {
          await autoGradeResponse(responseId);
        }
        break;
      case "bulk-grade":
        if (bulkGradeValue) {
          // Implementation would depend on your API structure
          console.log(
            "Bulk grading responses:",
            responseIds,
            "with grade:",
            bulkGradeValue
          );
        }
        break;
      default:
        break;
    }

    setSelectedExamResponses(new Set());
    setBulkResponseAction("");
    setBulkGradeValue("");
  };

  // Enhanced File Upload Component
  const FileUploadInput = ({ onFileUpload, currentFile, disabled }) => {
    return (
      <div className="col-span-2">
        <label className={styles.formLabel}>File Attachment (Optional)</label>
        <div className="space-y-2">
          <input
            ref={fileInputRef}
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
                  onClick={handleRemoveFileFromForm}
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

  // Enhanced Exam Status Component
  const ExamStatusBadge = ({ exam }) => {
    const getStatusInfo = () => {
      if (!exam.visibleToStudents) {
        return { text: "Draft", color: "gray", icon: Edit };
      }

      const now = new Date();
      const startTime = new Date(exam.startTime);
      const endTime = new Date(exam.endTime);

      if (now < startTime) {
        return { text: "Scheduled", color: "blue", icon: Calendar };
      } else if (now >= startTime && now <= endTime) {
        return { text: "Active", color: "green", icon: Play };
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

  // Question Type Component
  const QuestionTypeIcon = ({ type }) => {
    const iconMap = {
      "multiple-choice": CheckSquare,
      "true-false": Square,
      "short-answer": FileText,
      essay: BookOpen,
      "fill-in-blank": Edit,
    };

    const Icon = iconMap[type] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  // Loading state
  if (loading && courses.length === 0) {
    return (
      <div className={styles.dashboard}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <GraduationCap className={styles.logo} />
              <h1 className={styles.title}>Lecturer Dashboard</h1>
            </div>
            <div className={styles.headerRight}>
              <button
                onClick={exportGrades}
                disabled={loading || !selectedCourse}
                className={styles.exportBtn}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className={styles.btnIcon} />
                )}
                <span>Export Grades</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.navItems}>
            {[
              { id: "grades", label: "Grades", icon: Award },
              { id: "assignments", label: "Assignments", icon: ClipboardList },
              { id: "exams", label: "Online Exams", icon: FileText },
              { id: "submissions", label: "Submissions", icon: Upload },
              {
                id: "exam-responses",
                label: "Exam Responses",
                icon: BarChart3,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.navItem} ${
                  activeTab === tab.id ? styles.navItemActive : ""
                }`}
              >
                <tab.icon className={styles.navIcon} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Error Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Success Messages */}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Course Selector */}
        <div className={styles.courseSelector}>
          <label className={styles.courseSelectorLabel}>Select Course</label>
          <select
            value={selectedCourse || ""}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={styles.courseSelectorSelect}
            disabled={loading}
          >
            <option value="">Choose a course...</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {!selectedCourse ? (
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Select a Course
            </h3>
            <p className="text-gray-500">
              Choose a course from the dropdown above to get started.
            </p>
          </div>
        ) : (
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
                          <Award className="h-5 w-5" />
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
                              {viewingAssignment.averageGrade?.toFixed(1) ||
                                "0.0"}
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

                    {viewingAssignment.hasAttachment &&
                      viewingAssignment.fileUrl && (
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
                                {viewingAssignment.fileName ||
                                  "Assignment File"}
                              </div>
                              {viewingAssignment.fileSize && (
                                <div className={styles.assignmentModalFileSize}>
                                  Size:{" "}
                                  {formatFileSize(viewingAssignment.fileSize)}
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

            {/* Exam Viewing Modal */}
            {viewingExam && (
              <div className={styles.assignmentModal}>
                <div className={styles.assignmentModalContent}>
                  <div className={styles.assignmentModalHeader}>
                    <h2 className={styles.assignmentModalTitle}>
                      {viewingExam.title}
                    </h2>
                    <button
                      onClick={() => setViewingExam(null)}
                      className={styles.assignmentModalCloseBtn}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className={styles.assignmentModalBody}>
                    <div className={styles.assignmentModalGrid}>
                      <div className={styles.assignmentModalSection}>
                        <h3 className={styles.assignmentModalSectionTitle}>
                          <FileText className="h-5 w-5" />
                          Exam Details
                        </h3>
                        <div className={styles.assignmentModalSectionContent}>
                          <div className={styles.assignmentModalDetail}>
                            <span className={styles.assignmentModalDetailLabel}>
                              Duration
                            </span>
                            <span className={styles.assignmentModalDetailValue}>
                              {viewingExam.duration} minutes
                            </span>
                          </div>
                          <div className={styles.assignmentModalDetail}>
                            <span className={styles.assignmentModalDetailLabel}>
                              Start Time
                            </span>
                            <span className={styles.assignmentModalDetailValue}>
                              {formatDateTime(viewingExam.startTime)}
                            </span>
                          </div>
                          <div className={styles.assignmentModalDetail}>
                            <span className={styles.assignmentModalDetailLabel}>
                              End Time
                            </span>
                            <span className={styles.assignmentModalDetailValue}>
                              {formatDateTime(viewingExam.endTime)}
                            </span>
                          </div>
                          <div className={styles.assignmentModalDetail}>
                            <span className={styles.assignmentModalDetailLabel}>
                              Max Attempts
                            </span>
                            <span className={styles.assignmentModalDetailValue}>
                              {viewingExam.maxAttempts}
                            </span>
                          </div>
                          <div className={styles.assignmentModalDetail}>
                            <span className={styles.assignmentModalDetailLabel}>
                              Pass Percentage
                            </span>
                            <span className={styles.assignmentModalDetailValue}>
                              {viewingExam.passPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.assignmentModalSection}>
                        <h3 className={styles.assignmentModalSectionTitle}>
                          <BarChart3 className="h-5 w-5" />
                          Statistics
                        </h3>
                        <div className={styles.assignmentModalSectionContent}>
                          <div className={styles.assignmentModalDetail}>
                            <span className={styles.assignmentModalDetailLabel}>
                              Questions
                            </span>
                            <span className={styles.assignmentModalDetailValue}>
                              {viewingExam.questions?.length || 0}
                            </span>
                          </div>
                          <div className={styles.assignmentModalDetail}>
                            <span className={styles.assignmentModalDetailLabel}>
                              Total Points
                            </span>
                            <span className={styles.assignmentModalDetailValue}>
                              {viewingExam.totalPoints || 0}
                            </span>
                          </div>
                          <div className={styles.assignmentModalDetail}>
                            <span className={styles.assignmentModalDetailLabel}>
                              Status
                            </span>
                            <span className={styles.assignmentModalDetailValue}>
                              <ExamStatusBadge exam={viewingExam} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {viewingExam.description && (
                      <div className={styles.assignmentModalDescription}>
                        <h3 className={styles.assignmentModalDescriptionTitle}>
                          Description
                        </h3>
                        <p className={styles.assignmentModalDescriptionText}>
                          {viewingExam.description}
                        </p>
                      </div>
                    )}

                    {viewingExam.instructions && (
                      <div className={styles.assignmentModalDescription}>
                        <h3 className={styles.assignmentModalDescriptionTitle}>
                          Instructions
                        </h3>
                        <p className={styles.assignmentModalDescriptionText}>
                          {viewingExam.instructions}
                        </p>
                      </div>
                    )}

                    {/* Exam Settings Display */}
                    <div className={styles.examSettingsGrid}>
                      <div className={styles.examSetting}>
                        <Shuffle className="h-4 w-4" />
                        <span>
                          Shuffle Questions:{" "}
                          {viewingExam.shuffleQuestions ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className={styles.examSetting}>
                        <Shuffle className="h-4 w-4" />
                        <span>
                          Shuffle Options:{" "}
                          {viewingExam.shuffleOptions ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className={styles.examSetting}>
                        <Navigation className="h-4 w-4" />
                        <span>
                          Allow Navigation:{" "}
                          {viewingExam.allowNavigation ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className={styles.examSetting}>
                        <Timer className="h-4 w-4" />
                        <span>
                          Show Timer: {viewingExam.showTimer ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className={styles.examSetting}>
                        <Zap className="h-4 w-4" />
                        <span>
                          Auto Submit: {viewingExam.autoSubmit ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className={styles.examSetting}>
                        <Shield className="h-4 w-4" />
                        <span>
                          Safe Browser:{" "}
                          {viewingExam.requireSafeBrowser
                            ? "Required"
                            : "Not Required"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grades Tab - Preserved Functionality */}
            {activeTab === "grades" && (
              <div className={styles.tabContent}>
                {/* Grade Configuration */}
                <div className={styles.card}>
                  <div className={styles.gradeConfigHeader}>
                    <div>
                      <h3 className={styles.cardTitle}>Grade Configuration</h3>
                      <p className={styles.cardSubtitle}>
                        Configure your grading components and their weights
                      </p>
                    </div>
                    <div className={styles.gradeConfigActions}>
                      <div
                        className={`${styles.totalPercentage} ${
                          getTotalPercentage() === 100
                            ? styles.totalPercentageValid
                            : styles.totalPercentageInvalid
                        }`}
                      >
                        <Percent className={styles.percentIcon} />
                        <span className={styles.percentText}>
                          Total: {getTotalPercentage()}%
                        </span>
                        {getTotalPercentage() === 100 && (
                          <div className={styles.validIndicator}></div>
                        )}
                      </div>
                      <button
                        onClick={() => setShowColumnForm(!showColumnForm)}
                        disabled={loading}
                        className={styles.addGradeBtn}
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className={styles.btnIcon} />
                        )}
                        <span>Add Grade</span>
                      </button>
                    </div>
                  </div>

                  {showColumnForm && (
                    <div className={styles.formSection}>
                      <h4 className={styles.formTitle}>
                        Add New Grade Component
                      </h4>
                      <div className={styles.formCard}>
                        <div className={styles.formGrid}>
                          <div>
                            <label className={styles.formLabel}>
                              Grade Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Midterm Exam"
                              value={newColumn.name}
                              onChange={(e) =>
                                setNewColumn({
                                  ...newColumn,
                                  name: e.target.value,
                                })
                              }
                              className={styles.formInput}
                              disabled={loading}
                            />
                          </div>
                          <div>
                            <label className={styles.formLabel}>Type</label>
                            <select
                              value={newColumn.type}
                              onChange={(e) =>
                                setNewColumn({
                                  ...newColumn,
                                  type: e.target.value,
                                })
                              }
                              className={styles.formSelect}
                              disabled={loading}
                            >
                              <option value="assignment">Assignment</option>
                              <option value="exam">Exam</option>
                              <option value="quiz">Quiz</option>
                              <option value="project">Project</option>
                            </select>
                          </div>
                          <div>
                            <label className={styles.formLabel}>
                              Weight (%)
                            </label>
                            <div className={styles.percentInputWrapper}>
                              <input
                                type="number"
                                placeholder="20"
                                value={newColumn.percentage}
                                onChange={(e) =>
                                  setNewColumn({
                                    ...newColumn,
                                    percentage: e.target.value,
                                  })
                                }
                                className={styles.percentInput}
                                min="0"
                                max="100"
                                disabled={loading}
                              />
                              <Percent className={styles.percentInputIcon} />
                            </div>
                          </div>
                          <div className={styles.formButtonContainer}>
                            <button
                              onClick={addGradeColumn}
                              disabled={loading}
                              className={styles.primaryBtn}
                            >
                              {loading ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Plus className={styles.btnIcon} />
                              )}
                              <span>Add Grade</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.cardContent}>
                    {filteredColumns.length > 0 ? (
                      <div>
                        <h4 className={styles.sectionTitle}>
                          Current Grade Components
                        </h4>
                        <div className={styles.tableWrapper}>
                          <table className={styles.table}>
                            <thead>
                              <tr className={styles.tableHeaderRow}>
                                <th className={styles.tableHeader}>
                                  Component
                                </th>
                                <th className={styles.tableHeader}>Type</th>
                                <th className={styles.tableHeader}>Weight</th>
                                <th className={styles.tableHeaderCenter}>
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                              {filteredColumns.map((column) => (
                                <tr key={column.id} className={styles.tableRow}>
                                  <td className={styles.tableCell}>
                                    <input
                                      type="text"
                                      value={column.name}
                                      onChange={(e) =>
                                        updateColumn(
                                          column.id,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      className={styles.tableInput}
                                      disabled={loading}
                                    />
                                  </td>
                                  <td className={styles.tableCell}>
                                    <div
                                      className={`${styles.typeBadge} ${
                                        styles[
                                          `typeBadge${
                                            column.type
                                              .charAt(0)
                                              .toUpperCase() +
                                            column.type.slice(1)
                                          }`
                                        ]
                                      }`}
                                    >
                                      <div
                                        className={`${styles.typeBadgeDot} ${
                                          styles[
                                            `typeBadgeDot${
                                              column.type
                                                .charAt(0)
                                                .toUpperCase() +
                                              column.type.slice(1)
                                            }`
                                          ]
                                        }`}
                                      ></div>
                                      <span className={styles.typeBadgeText}>
                                        {column.type}
                                      </span>
                                    </div>
                                  </td>
                                  <td className={styles.tableCell}>
                                    <div
                                      className={styles.percentageInputGroup}
                                    >
                                      <input
                                        type="number"
                                        value={column.percentage}
                                        onChange={(e) =>
                                          updateColumn(
                                            column.id,
                                            "percentage",
                                            parseInt(e.target.value) || 0
                                          )
                                        }
                                        className={styles.percentageInput}
                                        min="0"
                                        max="100"
                                        disabled={loading}
                                      />
                                      <span className={styles.percentageSymbol}>
                                        %
                                      </span>
                                    </div>
                                  </td>
                                  <td className={styles.tableCellCenter}>
                                    <button
                                      onClick={() => deleteColumn(column.id)}
                                      disabled={loading}
                                      className={styles.deleteBtn}
                                      title="Delete component"
                                    >
                                      <Trash2 className={styles.btnIcon} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Summary Row */}
                        <div className={styles.summarySection}>
                          <div className={styles.summaryContent}>
                            <span className={styles.summaryLabel}>
                              Total Weight:
                            </span>
                            <div
                              className={`${styles.summaryValue} ${
                                getTotalPercentage() === 100
                                  ? styles.summaryValueValid
                                  : getTotalPercentage() < 100
                                  ? styles.summaryValueWarning
                                  : styles.summaryValueError
                              }`}
                            >
                              <span>{getTotalPercentage()}%</span>
                              {getTotalPercentage() === 100 ? (
                                <span className={styles.summaryCheck}>✓</span>
                              ) : (
                                <span className={styles.summaryWarning}>⚠</span>
                              )}
                            </div>
                          </div>
                          {getTotalPercentage() !== 100 && (
                            <p className={styles.summaryHelp}>
                              {getTotalPercentage() < 100
                                ? `Add ${
                                    100 - getTotalPercentage()
                                  }% more to reach 100%`
                                : `Reduce by ${
                                    getTotalPercentage() - 100
                                  }% to reach 100%`}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className={styles.emptyState}>
                        <ClipboardList className={styles.emptyStateIcon} />
                        <h4 className={styles.emptyStateTitle}>
                          No Grade Components
                        </h4>
                        <p className={styles.emptyStateText}>
                          Start building your grading structure by adding
                          components like assignments, exams, and projects.
                        </p>
                        <button
                          onClick={() => setShowColumnForm(true)}
                          disabled={loading}
                          className={styles.primaryBtn}
                        >
                          <Plus className={styles.btnIcon} />
                          <span>Add Your First Grade Component</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grades Table */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardTitle}>
                        Student Grades - {selectedCourseData?.name}
                      </h3>
                      <p className={styles.cardSubtitle}>
                        {filteredStudents.length} students enrolled
                      </p>
                    </div>
                  </div>
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr className={styles.tableHeaderRowGray}>
                          <th className={styles.tableHeader}>
                            <div className={styles.tableHeaderWithIcon}>
                              <Users className={styles.tableHeaderIcon} />
                              <span>Student Name</span>
                            </div>
                          </th>
                          {filteredColumns.map((column) => (
                            <th key={column.id} className={styles.tableHeader}>
                              <div className={styles.tableHeaderContent}>
                                <div className={styles.tableHeaderName}>
                                  {column.name}
                                </div>
                                <div className={styles.tableHeaderPercentage}>
                                  ({column.percentage}%)
                                </div>
                              </div>
                            </th>
                          ))}
                          <th className={styles.tableHeader}>
                            <div className={styles.tableHeaderWithIcon}>
                              <Award className={styles.tableHeaderIcon} />
                              <span>Final Grade</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className={styles.tableBody}>
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>
                              <div className={styles.studentInfo}>
                                <div className={styles.studentAvatar}>
                                  {student.name
                                    ? student.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                    : "?"}
                                </div>
                                <div>
                                  <div className={styles.studentName}>
                                    {student.name || "Unknown Student"}
                                  </div>
                                  <div className={styles.studentEmail}>
                                    {student.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            {filteredColumns.map((column) => {
                              const grade = student.grades?.[column.id] || "";
                              return (
                                <td
                                  key={column.id}
                                  className={styles.tableCell}
                                >
                                  <input
                                    type="number"
                                    value={grade}
                                    onChange={(e) =>
                                      updateGrade(
                                        student.id,
                                        column.id,
                                        e.target.value
                                      )
                                    }
                                    className={styles.gradeInput}
                                    min="0"
                                    max="100"
                                    placeholder="--"
                                    disabled={loading}
                                  />
                                </td>
                              );
                            })}
                            <td className={styles.tableCell}>
                              <span
                                className={`${styles.finalGradeBadge} ${
                                  calculateFinalGrade(student) >= 90
                                    ? styles.gradeA
                                    : calculateFinalGrade(student) >= 80
                                    ? styles.gradeB
                                    : calculateFinalGrade(student) >= 70
                                    ? styles.gradeC
                                    : styles.gradeF
                                }`}
                              >
                                {calculateFinalGrade(student)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                          <tr>
                            <td
                              colSpan={filteredColumns.length + 2}
                              className="text-center py-8 text-gray-500"
                            >
                              No students enrolled in this course.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Assignments Tab - ENHANCED WITH FIXED FILE HANDLING */}
            {activeTab === "assignments" && (
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
                        onClick={() =>
                          setShowAssignmentForm(!showAssignmentForm)
                        }
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
                      <h4 className={styles.formTitle}>
                        Create New Assignment
                      </h4>
                      <div className={styles.formCard}>
                        <div className={styles.formGrid}>
                          <div className="col-span-2">
                            <label className={styles.formLabel}>
                              Assignment Title
                            </label>
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
                            <label className={styles.formLabel}>
                              Max Points
                            </label>
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
                          <div className="col-span-2">
                            <label className={styles.formLabel}>
                              Description
                            </label>
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
                          <div className="col-span-2">
                            <label className={styles.formLabel}>
                              Instructions
                            </label>
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
                            <label className={styles.formLabel}>
                              Difficulty
                            </label>
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

                          <div className="col-span-2">
                            <div className="flex gap-3">
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
                              // Edit Mode
                              <div className={styles.assignmentEditForm}>
                                <h4 className={styles.assignmentEditFormTitle}>
                                  <Edit3 className="h-5 w-5" />
                                  Edit Assignment
                                </h4>
                                <div className={styles.assignmentEditGrid}>
                                  <div className={styles.assignmentEditField}>
                                    <label
                                      className={styles.assignmentEditLabel}
                                    >
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
                                    <label
                                      className={styles.assignmentEditLabel}
                                    >
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
                                      <option value="presentation">
                                        Presentation
                                      </option>
                                    </select>
                                  </div>
                                  <div className={styles.assignmentEditField}>
                                    <label
                                      className={styles.assignmentEditLabel}
                                    >
                                      Due Date
                                    </label>
                                    <input
                                      type="date"
                                      value={
                                        editingAssignmentData?.dueDate || ""
                                      }
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
                                    <label
                                      className={styles.assignmentEditLabel}
                                    >
                                      Due Time
                                    </label>
                                    <input
                                      type="time"
                                      value={
                                        editingAssignmentData?.dueTime || ""
                                      }
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
                                    <label
                                      className={styles.assignmentEditLabel}
                                    >
                                      Max Points
                                    </label>
                                    <input
                                      type="number"
                                      value={
                                        editingAssignmentData?.maxPoints || ""
                                      }
                                      onChange={(e) =>
                                        setEditingAssignmentData({
                                          ...editingAssignmentData,
                                          maxPoints:
                                            parseInt(e.target.value) || 100,
                                        })
                                      }
                                      className={styles.assignmentEditInput}
                                      min="1"
                                      max="1000"
                                      placeholder="100"
                                    />
                                  </div>
                                  <div className={styles.assignmentEditField}>
                                    <label
                                      className={styles.assignmentEditLabel}
                                    >
                                      Priority
                                    </label>
                                    <select
                                      value={
                                        editingAssignmentData?.priority || ""
                                      }
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
                                    <label
                                      className={styles.assignmentEditLabel}
                                    >
                                      Difficulty
                                    </label>
                                    <select
                                      value={
                                        editingAssignmentData?.difficulty || ""
                                      }
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
                                    <label
                                      className={styles.assignmentEditLabel}
                                    >
                                      Description
                                    </label>
                                    <textarea
                                      value={
                                        editingAssignmentData?.description || ""
                                      }
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
                                    <label
                                      className={styles.assignmentEditLabel}
                                    >
                                      Instructions
                                    </label>
                                    <textarea
                                      value={
                                        editingAssignmentData?.instructions ||
                                        ""
                                      }
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
                                <div
                                  className={styles.assignmentHeaderEnhanced}
                                >
                                  <div
                                    className={styles.assignmentTitleEnhanced}
                                  >
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
                                        className={`${
                                          styles.assignmentPriority
                                        } ${
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
                                        className={`${
                                          styles.assignmentDifficulty
                                        } ${
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
                                  <div
                                    className={styles.assignmentActionsEnhanced}
                                  >
                                    <button
                                      onClick={() =>
                                        handleViewAssignment(assignment)
                                      }
                                      disabled={loading}
                                      className={`${styles.assignmentActionBtn} ${styles.assignmentActionBtnView}`}
                                      title="View assignment details"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleEditAssignment(assignment)
                                      }
                                      disabled={loading}
                                      className={`${styles.assignmentActionBtn} ${styles.assignmentActionBtnEdit}`}
                                      title="Edit assignment"
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        deleteAssignment(assignment.id)
                                      }
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
                                      <span>
                                        Max Points: {assignment.maxPoints}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Enhanced File Attachment Display */}
                                  <FileAttachmentDisplay
                                    assignment={assignment}
                                  />

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
                                      <span className={styles.statLabel}>
                                        Graded
                                      </span>
                                    </div>
                                    <div className={styles.statItem}>
                                      <span className={styles.statValue}>
                                        {assignment.averageGrade?.toFixed(1) ||
                                          "0.0"}
                                      </span>
                                      <span className={styles.statLabel}>
                                        Avg Grade
                                      </span>
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
                        <h4 className={styles.emptyStateTitle}>
                          No Assignments
                        </h4>
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
            )}

            {/* ENHANCED EXAMS TAB - FULL IMPLEMENTATION */}
            {activeTab === "exams" && (
              <div className={styles.tabContent}>
                {/* Exams Header */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardTitle}>
                        Online Exams - {selectedCourseData?.name}
                      </h3>
                      <p className={styles.cardSubtitle}>
                        Create and manage online examinations
                      </p>
                    </div>
                    <div className={styles.cardActions}>
                      <button
                        onClick={() => setShowExamForm(!showExamForm)}
                        disabled={loading}
                        className={styles.primaryBtn}
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className={styles.btnIcon} />
                        )}
                        <span>Create Exam</span>
                      </button>
                    </div>
                  </div>

                  {/* Exam Creation Form - Updated with compact layout */}
{showExamForm && (
  <div className={styles.formSection}>
    <h4 className={styles.formTitle}>Create New Exam</h4>
    <div className={styles.formCard}>
      <div className={styles.formGrid}>
        {/* Row 1: Title (spans 3 columns), Duration, Max Attempts, Start Time */}
        <div className={styles.colSpan3}>
          <label className={styles.formLabel}>Exam Title</label>
          <input
            type="text"
            placeholder="Enter exam title"
            value={newExam.title}
            onChange={(e) => setNewExam({...newExam, title: e.target.value})}
            className={styles.formInput}
            disabled={loading}
          />
        </div>
        
        <div className={styles.formField}>
          <label className={styles.formLabel}>Duration (minutes)</label>
          <input
            type="number"
            placeholder="60"
            value={newExam.duration}
            onChange={(e) => setNewExam({...newExam, duration: parseInt(e.target.value) || 60})}
            className={styles.formInput}
            min="5"
            max="480"
            disabled={loading}
          />
        </div>
        
        <div className={styles.formField}>
          <label className={styles.formLabel}>Max Attempts</label>
          <input
            type="number"
            placeholder="1"
            value={newExam.maxAttempts}
            onChange={(e) => setNewExam({...newExam, maxAttempts: parseInt(e.target.value) || 1})}
            className={styles.formInput}
            min="1"
            max="10"
            disabled={loading}
          />
        </div>
        
        <div className={styles.formField}>
          <label className={styles.formLabel}>Start Time</label>
          <input
            type="datetime-local"
            value={newExam.startTime}
            onChange={(e) => setNewExam({...newExam, startTime: e.target.value})}
            className={styles.formInput}
            disabled={loading}
          />
        </div>
        
        {/* Row 2: End Time, Pass Percentage (narrow), Publish Time, Description */}
        <div className={styles.formField}>
          <label className={styles.formLabel}>End Time</label>
          <input
            type="datetime-local"
            value={newExam.endTime}
            onChange={(e) => setNewExam({...newExam, endTime: e.target.value})}
            className={styles.formInput}
            disabled={loading}
          />
        </div>
        
        <div className={styles.formField}>
          <label className={styles.formLabel}>Pass Percentage</label>
          <div className={styles.percentInputWrapper}>
            <input
              type="number"
              placeholder="60"
              value={newExam.passPercentage}
              onChange={(e) => setNewExam({...newExam, passPercentage: parseFloat(e.target.value) || 60})}
              className={styles.percentInput}
              min="0"
              max="100"
              step="0.1"
              disabled={loading}
            />
            <Percent className={styles.percentInputIcon} />
          </div>
        </div>
        
        <div className={styles.formField}>
          <label className={styles.formLabel}>Publish Time (Optional)</label>
          <input
            type="datetime-local"
            value={newExam.publishTime}
            onChange={(e) => setNewExam({...newExam, publishTime: e.target.value})}
            className={styles.formInput}
            disabled={loading}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel}>Description</label>
          <textarea
            placeholder="Enter exam description"
            value={newExam.description}
            onChange={(e) => setNewExam({...newExam, description: e.target.value})}
            className={styles.formTextarea}
            rows={3}
            disabled={loading}
          />
        </div>

        {/* Row 3: Instructions */}
        <div className={styles.colSpan6}>
          <label className={styles.formLabel}>Instructions for Students</label>
          <textarea
            placeholder="Detailed instructions for taking the exam"
            value={newExam.instructions}
            onChange={(e) => setNewExam({...newExam, instructions: e.target.value})}
            className={styles.formTextarea}
            rows={4}
            disabled={loading}
          />
        </div>

        {/* Row 4: Exam Settings */}
        <div className={styles.colSpan6}>
          <h5 className={styles.formSectionTitle}>Exam Settings</h5>
          <div className={styles.examSettingsGrid}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={newExam.shuffleQuestions}
                onChange={(e) => setNewExam({...newExam, shuffleQuestions: e.target.checked})}
                disabled={loading}
              />
              <Shuffle className={styles.checkboxIcon} />
              <div className={styles.checkboxText}>Shuffle Questions</div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={newExam.shuffleOptions}
                onChange={(e) => setNewExam({...newExam, shuffleOptions: e.target.checked})}
                disabled={loading}
              />
              <Shuffle className={styles.checkboxIcon} />
              <div className={styles.checkboxText}>Shuffle Answer Options</div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={newExam.allowNavigation}
                onChange={(e) => setNewExam({...newExam, allowNavigation: e.target.checked})}
                disabled={loading}
              />
              <Navigation className={styles.checkboxIcon} />
              <div className={styles.checkboxText}>Allow Question Navigation</div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={newExam.showTimer}
                onChange={(e) => setNewExam({...newExam, showTimer: e.target.checked})}
                disabled={loading}
              />
              <Timer className={styles.checkboxIcon} />
              <div className={styles.checkboxText}>Show Timer</div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={newExam.autoSubmit}
                onChange={(e) => setNewExam({...newExam, autoSubmit: e.target.checked})}
                disabled={loading}
              />
              <Zap className={styles.checkboxIcon} />
              <div className={styles.checkboxText}>Auto Submit on Time Up</div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={newExam.showResults}
                onChange={(e) => setNewExam({...newExam, showResults: e.target.checked})}
                disabled={loading}
              />
              <Eye className={styles.checkboxIcon} />
              <div className={styles.checkboxText}>Show Results After Submission</div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={newExam.requireSafeBrowser}
                onChange={(e) => setNewExam({...newExam, requireSafeBrowser: e.target.checked})}
                disabled={loading}
              />
              <Shield className={styles.checkboxIcon} />
              <div className={styles.checkboxText}>Require Safe Browser</div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={newExam.visibleToStudents}
                onChange={(e) => setNewExam({...newExam, visibleToStudents: e.target.checked})}
                disabled={loading}
              />
              <Globe className={styles.checkboxIcon} />
              <div className={styles.checkboxText}>Visible to Students</div>
            </label>
          </div>
        </div>

        {/* Row 5: Action Buttons */}
        <div className={styles.colSpan6}>
          <div className={styles.formActions}>
            <button
              onClick={createExam}
              disabled={loading}
              className={styles.primaryBtn}
            >
              {loading ? (
                <RefreshCw className={styles.btnIcon} />
              ) : (
                <Save className={styles.btnIcon} />
              )}
              <div className={styles.btnText}>Create Exam</div>
            </button>
            <button
              onClick={() => setShowExamForm(false)}
              disabled={loading}
              className={styles.secondaryBtn}
            >
              <div className={styles.btnText}>Cancel</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

                  {/* Exams List */}
                  <div className={styles.cardContent}>
                    {filteredExams && filteredExams.length > 0 ? (
                      <div className={styles.examsList}>
                        {filteredExams.map((exam) => (
                          <div key={exam.id} className={styles.examCard}>
                            {editingExam === exam.id ? (
                              // Edit Mode
                              <div className={styles.examEditForm}>
                                <h4 className={styles.examEditFormTitle}>
                                  <Edit3 className="h-5 w-5" />
                                  Edit Exam
                                </h4>
                                <div className={styles.examEditGrid}>
                                  <div className={styles.examEditField}>
                                    <label className={styles.examEditLabel}>
                                      Title
                                    </label>
                                    <input
                                      type="text"
                                      value={editingExamData?.title || ""}
                                      onChange={(e) =>
                                        setEditingExamData({
                                          ...editingExamData,
                                          title: e.target.value,
                                        })
                                      }
                                      className={styles.examEditInput}
                                      placeholder="Enter exam title"
                                    />
                                  </div>
                                  <div className={styles.examEditField}>
                                    <label className={styles.examEditLabel}>
                                      Duration (minutes)
                                    </label>
                                    <input
                                      type="number"
                                      value={editingExamData?.duration || ""}
                                      onChange={(e) =>
                                        setEditingExamData({
                                          ...editingExamData,
                                          duration:
                                            parseInt(e.target.value) || 60,
                                        })
                                      }
                                      className={styles.examEditInput}
                                      min="5"
                                      max="480"
                                      placeholder="60"
                                    />
                                  </div>
                                  <div className={styles.examEditField}>
                                    <label className={styles.examEditLabel}>
                                      Start Time
                                    </label>
                                    <input
                                      type="datetime-local"
                                      value={editingExamData?.startTime || ""}
                                      onChange={(e) =>
                                        setEditingExamData({
                                          ...editingExamData,
                                          startTime: e.target.value,
                                        })
                                      }
                                      className={styles.examEditInput}
                                    />
                                  </div>
                                  <div className={styles.examEditField}>
                                    <label className={styles.examEditLabel}>
                                      End Time
                                    </label>
                                    <input
                                      type="datetime-local"
                                      value={editingExamData?.endTime || ""}
                                      onChange={(e) =>
                                        setEditingExamData({
                                          ...editingExamData,
                                          endTime: e.target.value,
                                        })
                                      }
                                      className={styles.examEditInput}
                                    />
                                  </div>
                                  <div className={styles.examEditField}>
                                    <label className={styles.examEditLabel}>
                                      Max Attempts
                                    </label>
                                    <input
                                      type="number"
                                      value={editingExamData?.maxAttempts || ""}
                                      onChange={(e) =>
                                        setEditingExamData({
                                          ...editingExamData,
                                          maxAttempts:
                                            parseInt(e.target.value) || 1,
                                        })
                                      }
                                      className={styles.examEditInput}
                                      min="1"
                                      max="10"
                                      placeholder="1"
                                    />
                                  </div>
                                  <div className={styles.examEditField}>
                                    <label className={styles.examEditLabel}>
                                      Pass Percentage
                                    </label>
                                    <input
                                      type="number"
                                      value={
                                        editingExamData?.passPercentage || ""
                                      }
                                      onChange={(e) =>
                                        setEditingExamData({
                                          ...editingExamData,
                                          passPercentage:
                                            parseFloat(e.target.value) || 60,
                                        })
                                      }
                                      className={styles.examEditInput}
                                      min="0"
                                      max="100"
                                      step="0.1"
                                      placeholder="60"
                                    />
                                  </div>
                                  <div
                                    className={`${styles.examEditField} ${styles.examEditFieldFull}`}
                                  >
                                    <label className={styles.examEditLabel}>
                                      Description
                                    </label>
                                    <textarea
                                      value={editingExamData?.description || ""}
                                      onChange={(e) =>
                                        setEditingExamData({
                                          ...editingExamData,
                                          description: e.target.value,
                                        })
                                      }
                                      className={styles.examEditTextarea}
                                      placeholder="Enter exam description"
                                      rows={3}
                                    />
                                  </div>
                                  <div
                                    className={`${styles.examEditField} ${styles.examEditFieldFull}`}
                                  >
                                    <label className={styles.examEditLabel}>
                                      Instructions
                                    </label>
                                    <textarea
                                      value={
                                        editingExamData?.instructions || ""
                                      }
                                      onChange={(e) =>
                                        setEditingExamData({
                                          ...editingExamData,
                                          instructions: e.target.value,
                                        })
                                      }
                                      className={styles.examEditTextarea}
                                      placeholder="Instructions for students"
                                      rows={4}
                                    />
                                  </div>
                                </div>

                                <div className={styles.examEditActions}>
                                  <button
                                    onClick={handleSaveExamEdit}
                                    disabled={loading}
                                    className={styles.examEditSaveBtn}
                                  >
                                    {loading ? (
                                      <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Save className="h-4 w-4" />
                                    )}
                                    Save Changes
                                  </button>
                                  <button
                                    onClick={handleCancelExamEdit}
                                    className={styles.examEditCancelBtn}
                                  >
                                    <X className="h-4 w-4" />
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // View Mode
                              <>
                                <div className={styles.examHeader}>
                                  <div className={styles.examTitle}>
                                    <h4>{exam.title}</h4>
                                    <div className={styles.examMeta}>
                                      <ExamStatusBadge exam={exam} />
                                      <span className={styles.examDuration}>
                                        <Timer className="h-4 w-4" />
                                        {exam.duration} min
                                      </span>
                                      <span className={styles.examQuestions}>
                                        <FileText className="h-4 w-4" />
                                        {exam.questions?.length || 0} questions
                                      </span>
                                    </div>
                                  </div>
                                  <div className={styles.examActions}>
                                    <button
                                      onClick={() => handleViewExam(exam)}
                                      disabled={loading}
                                      className={`${styles.examActionBtn} ${styles.examActionBtnView}`}
                                      title="View exam details"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleEditExam(exam)}
                                      disabled={loading}
                                      className={`${styles.examActionBtn} ${styles.examActionBtnEdit}`}
                                      title="Edit exam"
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleViewExamResponses(exam)
                                      }
                                      disabled={loading}
                                      className={`${styles.examActionBtn} ${styles.examActionBtnResponses}`}
                                      title="View responses"
                                    >
                                      <BarChart3 className="h-4 w-4" />
                                    </button>
                                    {exam.visibleToStudents ? (
                                      <button
                                        onClick={() => unpublishExam(exam.id)}
                                        disabled={loading}
                                        className={`${styles.examActionBtn} ${styles.examActionBtnUnpublish}`}
                                        title="Unpublish exam"
                                      >
                                        <Pause className="h-4 w-4" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => publishExam(exam.id)}
                                        disabled={loading}
                                        className={`${styles.examActionBtn} ${styles.examActionBtnPublish}`}
                                        title="Publish exam"
                                      >
                                        <Play className="h-4 w-4" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => deleteExam(exam.id)}
                                      disabled={loading}
                                      className={`${styles.examActionBtn} ${styles.examActionBtnDelete}`}
                                      title="Delete exam"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>

                                <div className={styles.examContent}>
                                  <p className={styles.examDescription}>
                                    {exam.description ||
                                      "No description provided"}
                                  </p>

                                  <div className={styles.examDetails}>
                                    <div className={styles.examDetail}>
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        {formatDateTime(exam.startTime)} -{" "}
                                        {formatDateTime(exam.endTime)}
                                      </span>
                                    </div>
                                    <div className={styles.examDetail}>
                                      <Target className="h-4 w-4" />
                                      <span>Pass: {exam.passPercentage}%</span>
                                    </div>
                                    <div className={styles.examDetail}>
                                      <TrophyIcon className="h-4 w-4" />
                                      <span>
                                        Total Points: {exam.totalPoints || 0}
                                      </span>
                                    </div>
                                  </div>

                                  <div className={styles.examStats}>
                                    <div className={styles.statItem}>
                                      <span className={styles.statValue}>
                                        {exam.questions?.length || 0}
                                      </span>
                                      <span className={styles.statLabel}>
                                        Questions
                                      </span>
                                    </div>
                                    <div className={styles.statItem}>
                                      <span className={styles.statValue}>
                                        {getExamResponses(exam.id).length}
                                      </span>
                                      <span className={styles.statLabel}>
                                        Responses
                                      </span>
                                    </div>
                                    <div className={styles.statItem}>
                                      <span className={styles.statValue}>
                                        {exam.maxAttempts === 1
                                          ? "1"
                                          : exam.maxAttempts}
                                      </span>
                                      <span className={styles.statLabel}>
                                        Max Attempts
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Question Management for Editing Exam */}
                                {editingExam === exam.id && (
                                  <div className={styles.questionManagement}>
                                    <div className={styles.questionHeader}>
                                      <h5>Manage Questions</h5>
                                      <div className={styles.questionActions}>
                                        {selectedQuestions.size > 0 && (
                                          <div className={styles.bulkActions}>
                                            <select
                                              value={bulkQuestionAction}
                                              onChange={(e) =>
                                                setBulkQuestionAction(
                                                  e.target.value
                                                )
                                              }
                                              className={styles.bulkSelect}
                                            >
                                              <option value="">
                                                Bulk Actions
                                              </option>
                                              <option value="delete">
                                                Delete Selected
                                              </option>
                                              <option value="reorder">
                                                Reorder
                                              </option>
                                            </select>
                                            <button
                                              onClick={handleBulkQuestionAction}
                                              className={styles.bulkActionBtn}
                                            >
                                              Apply
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Add Question Form */}
                                    <div className={styles.addQuestionForm}>
                                      <h6>Add New Question</h6>
                                      <div className={styles.questionFormGrid}>
                                        <div>
                                          <label className={styles.formLabel}>
                                            Question Type
                                          </label>
                                          <select
                                            value={newQuestion.type}
                                            onChange={(e) =>
                                              setNewQuestion({
                                                ...newQuestion,
                                                type: e.target.value,
                                              })
                                            }
                                            className={styles.formSelect}
                                          >
                                            <option value="multiple-choice">
                                              Multiple Choice
                                            </option>
                                            <option value="true-false">
                                              True/False
                                            </option>
                                            <option value="short-answer">
                                              Short Answer
                                            </option>
                                            <option value="essay">Essay</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className={styles.formLabel}>
                                            Points
                                          </label>
                                          <input
                                            type="number"
                                            value={newQuestion.points}
                                            onChange={(e) =>
                                              setNewQuestion({
                                                ...newQuestion,
                                                points:
                                                  parseInt(e.target.value) || 5,
                                              })
                                            }
                                            className={styles.formInput}
                                            min="1"
                                            max="100"
                                          />
                                        </div>
                                        <div className="col-span-2">
                                          <label className={styles.formLabel}>
                                            Question Text
                                          </label>
                                          <textarea
                                            value={newQuestion.question}
                                            onChange={(e) =>
                                              setNewQuestion({
                                                ...newQuestion,
                                                question: e.target.value,
                                              })
                                            }
                                            className={styles.formTextarea}
                                            placeholder="Enter your question here..."
                                            rows={3}
                                          />
                                        </div>

                                        {newQuestion.type ===
                                          "multiple-choice" && (
                                          <>
                                            {newQuestion.options.map(
                                              (option, index) => (
                                                <div
                                                  key={index}
                                                  className={styles.optionField}
                                                >
                                                  <label
                                                    className={styles.formLabel}
                                                  >
                                                    Option {index + 1}
                                                  </label>
                                                  <div
                                                    className={
                                                      styles.optionInput
                                                    }
                                                  >
                                                    <input
                                                      type="text"
                                                      value={option}
                                                      onChange={(e) => {
                                                        const newOptions = [
                                                          ...newQuestion.options,
                                                        ];
                                                        newOptions[index] =
                                                          e.target.value;
                                                        setNewQuestion({
                                                          ...newQuestion,
                                                          options: newOptions,
                                                        });
                                                      }}
                                                      className={
                                                        styles.formInput
                                                      }
                                                      placeholder={`Enter option ${
                                                        index + 1
                                                      }`}
                                                    />
                                                    <label
                                                      className={
                                                        styles.correctOption
                                                      }
                                                    >
                                                      <input
                                                        type="radio"
                                                        name="correctAnswer"
                                                        checked={
                                                          newQuestion.correctAnswerIndex ===
                                                          index
                                                        }
                                                        onChange={() =>
                                                          setNewQuestion({
                                                            ...newQuestion,
                                                            correctAnswerIndex:
                                                              index,
                                                            correctAnswer:
                                                              newQuestion
                                                                .options[index],
                                                          })
                                                        }
                                                      />
                                                      <span>Correct</span>
                                                    </label>
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </>
                                        )}

                                        {newQuestion.type === "true-false" && (
                                          <div>
                                            <label className={styles.formLabel}>
                                              Correct Answer
                                            </label>
                                            <select
                                              value={newQuestion.correctAnswer}
                                              onChange={(e) =>
                                                setNewQuestion({
                                                  ...newQuestion,
                                                  correctAnswer: e.target.value,
                                                })
                                              }
                                              className={styles.formSelect}
                                            >
                                              <option value="">
                                                Select correct answer
                                              </option>
                                              <option value="true">True</option>
                                              <option value="false">
                                                False
                                              </option>
                                            </select>
                                          </div>
                                        )}

                                        <div className="col-span-2">
                                          <label className={styles.formLabel}>
                                            Explanation (Optional)
                                          </label>
                                          <textarea
                                            value={newQuestion.explanation}
                                            onChange={(e) =>
                                              setNewQuestion({
                                                ...newQuestion,
                                                explanation: e.target.value,
                                              })
                                            }
                                            className={styles.formTextarea}
                                            placeholder="Explain the correct answer..."
                                            rows={2}
                                          />
                                        </div>

                                        <div className="col-span-2">
                                          <button
                                            onClick={() =>
                                              addQuestionToExam(exam.id)
                                            }
                                            disabled={loading}
                                            className={styles.primaryBtn}
                                          >
                                            {loading ? (
                                              <RefreshCw className="h-4 w-4 animate-spin" />
                                            ) : (
                                              <Plus className="h-4 w-4" />
                                            )}
                                            Add Question
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Questions List */}
                                    {exam.questions &&
                                      exam.questions.length > 0 && (
                                        <div className={styles.questionsList}>
                                          <h6>
                                            Current Questions (
                                            {exam.questions.length})
                                          </h6>
                                          {exam.questions.map(
                                            (question, index) => (
                                              <div
                                                key={question.id}
                                                className={styles.questionCard}
                                              >
                                                <div
                                                  className={
                                                    styles.questionCardHeader
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.questionInfo
                                                    }
                                                  >
                                                    <label
                                                      className={
                                                        styles.questionCheckbox
                                                      }
                                                    >
                                                      <input
                                                        type="checkbox"
                                                        checked={selectedQuestions.has(
                                                          question.id
                                                        )}
                                                        onChange={() =>
                                                          toggleQuestionSelection(
                                                            question.id
                                                          )
                                                        }
                                                      />
                                                    </label>
                                                    <QuestionTypeIcon
                                                      type={question.type}
                                                    />
                                                    <span
                                                      className={
                                                        styles.questionNumber
                                                      }
                                                    >
                                                      Q{index + 1}
                                                    </span>
                                                    <span
                                                      className={
                                                        styles.questionPoints
                                                      }
                                                    >
                                                      {question.points} pts
                                                    </span>
                                                  </div>
                                                  <div
                                                    className={
                                                      styles.questionActions
                                                    }
                                                  >
                                                    <button
                                                      onClick={() =>
                                                        toggleQuestionExpansion(
                                                          question.id
                                                        )
                                                      }
                                                      className={
                                                        styles.expandBtn
                                                      }
                                                    >
                                                      {expandedQuestions.has(
                                                        question.id
                                                      ) ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                      ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                      )}
                                                    </button>
                                                    <button
                                                      onClick={() =>
                                                        setEditingQuestion(
                                                          question.id
                                                        )
                                                      }
                                                      className={
                                                        styles.editQuestionBtn
                                                      }
                                                    >
                                                      <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                      onClick={() =>
                                                        deleteQuestion(
                                                          exam.id,
                                                          question.id
                                                        )
                                                      }
                                                      className={
                                                        styles.deleteQuestionBtn
                                                      }
                                                    >
                                                      <Trash2 className="h-4 w-4" />
                                                    </button>
                                                  </div>
                                                </div>

                                                <div
                                                  className={
                                                    styles.questionPreview
                                                  }
                                                >
                                                  <p
                                                    className={
                                                      styles.questionText
                                                    }
                                                  >
                                                    {question.question}
                                                  </p>
                                                </div>

                                                {expandedQuestions.has(
                                                  question.id
                                                ) && (
                                                  <div
                                                    className={
                                                      styles.questionDetails
                                                    }
                                                  >
                                                    {question.type ===
                                                      "multiple-choice" &&
                                                      question.options && (
                                                        <div
                                                          className={
                                                            styles.questionOptions
                                                          }
                                                        >
                                                          {question.options.map(
                                                            (
                                                              option,
                                                              optIndex
                                                            ) => (
                                                              <div
                                                                key={optIndex}
                                                                className={`${
                                                                  styles.questionOption
                                                                } ${
                                                                  optIndex ===
                                                                  question.correctAnswerIndex
                                                                    ? styles.correctOption
                                                                    : ""
                                                                }`}
                                                              >
                                                                <span
                                                                  className={
                                                                    styles.optionLetter
                                                                  }
                                                                >
                                                                  {String.fromCharCode(
                                                                    65 +
                                                                      optIndex
                                                                  )}
                                                                  .
                                                                </span>
                                                                <span>
                                                                  {option}
                                                                </span>
                                                                {optIndex ===
                                                                  question.correctAnswerIndex && (
                                                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                                                )}
                                                              </div>
                                                            )
                                                          )}
                                                        </div>
                                                      )}

                                                    {question.type ===
                                                      "true-false" && (
                                                      <div
                                                        className={
                                                          styles.trueFalseAnswer
                                                        }
                                                      >
                                                        <span>
                                                          Correct Answer:{" "}
                                                        </span>
                                                        <span
                                                          className={
                                                            styles.correctAnswer
                                                          }
                                                        >
                                                          {question.correctAnswer ===
                                                          "true"
                                                            ? "True"
                                                            : "False"}
                                                        </span>
                                                      </div>
                                                    )}

                                                    {question.explanation && (
                                                      <div
                                                        className={
                                                          styles.questionExplanation
                                                        }
                                                      >
                                                        <strong>
                                                          Explanation:
                                                        </strong>
                                                        <p>
                                                          {question.explanation}
                                                        </p>
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyState}>
                        <FileText className={styles.emptyStateIcon} />
                        <h4 className={styles.emptyStateTitle}>No Exams</h4>
                        <p className={styles.emptyStateText}>
                          Create your first online exam to get started with
                          digital assessments.
                        </p>
                        <button
                          onClick={() => setShowExamForm(true)}
                          disabled={loading}
                          className={styles.primaryBtn}
                        >
                          <Plus className={styles.btnIcon} />
                          <span>Create Your First Exam</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === "submissions" && (
              <div className={styles.tabContent}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardTitle}>Submissions</h3>
                      <p className={styles.cardSubtitle}>
                        Student assignment submissions
                      </p>
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.emptyState}>
                      <Upload className={styles.emptyStateIcon} />
                      <h4 className={styles.emptyStateTitle}>
                        No Submissions Yet
                      </h4>
                      <p className={styles.emptyStateText}>
                        Student submissions will appear here once assignments
                        are created and students start submitting their work.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ENHANCED EXAM RESPONSES TAB - FULL IMPLEMENTATION */}
            {activeTab === "exam-responses" && (
              <div className={styles.tabContent}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.cardTitle}>Exam Responses</h3>
                      <p className={styles.cardSubtitle}>
                        Student online exam responses and grading
                      </p>
                    </div>
                    <div className={styles.cardActions}>
                      {selectedExamForResponses && (
                        <button
                          onClick={() =>
                            autoGradeAllResponses(selectedExamForResponses)
                          }
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
                      )}
                    </div>
                  </div>

                  <div className={styles.cardContent}>
                    {!selectedExamForResponses ? (
                      <div className={styles.examSelector}>
                        <h4>Select an Exam to View Responses</h4>
                        <div className={styles.examGrid}>
                          {filteredExams.map((exam) => (
                            <div
                              key={exam.id}
                              className={styles.examSelectorCard}
                              onClick={() =>
                                setSelectedExamForResponses(exam.id)
                              }
                            >
                              <div className={styles.examSelectorHeader}>
                                <h5>{exam.title}</h5>
                                <ExamStatusBadge exam={exam} />
                              </div>
                              <div className={styles.examSelectorStats}>
                                <div className={styles.examSelectorStat}>
                                  <StudentsIcon className="h-4 w-4" />
                                  <span>
                                    {getExamResponses(exam.id).length} responses
                                  </span>
                                </div>
                                <div className={styles.examSelectorStat}>
                                  <FileCheck className="h-4 w-4" />
                                  <span>
                                    {exam.questions?.length || 0} questions
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Back Button */}
                        <div className={styles.responseNavigation}>
                          <button
                            onClick={() => setSelectedExamForResponses(null)}
                            className={styles.backBtn}
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Exam List
                          </button>
                          <h4>
                            Responses for:{" "}
                            {
                              filteredExams.find(
                                (e) => e.id === selectedExamForResponses
                              )?.title
                            }
                          </h4>
                        </div>

                        {/* Bulk Actions */}
                        {selectedExamResponses.size > 0 && (
                          <div className={styles.bulkResponseActions}>
                            <div className={styles.bulkActionControls}>
                              <span>
                                {selectedExamResponses.size} responses selected
                              </span>
                              <select
                                value={bulkResponseAction}
                                onChange={(e) =>
                                  setBulkResponseAction(e.target.value)
                                }
                                className={styles.bulkSelect}
                              >
                                <option value="">Choose Action</option>
                                <option value="auto-grade">
                                  Auto-Grade Selected
                                </option>
                                <option value="bulk-grade">Set Grade</option>
                              </select>
                              {bulkResponseAction === "bulk-grade" && (
                                <input
                                  type="number"
                                  value={bulkGradeValue}
                                  onChange={(e) =>
                                    setBulkGradeValue(e.target.value)
                                  }
                                  placeholder="Grade"
                                  className={styles.bulkGradeInput}
                                  min="0"
                                  max="100"
                                />
                              )}
                              <button
                                onClick={handleBulkResponseAction}
                                className={styles.bulkActionBtn}
                                disabled={!bulkResponseAction}
                              >
                                Apply
                              </button>
                              <button
                                onClick={() =>
                                  setSelectedExamResponses(new Set())
                                }
                                className={styles.clearSelectionBtn}
                              >
                                Clear Selection
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Responses List */}
                        <div className={styles.responsesList}>
                          {getResponsesForExam(selectedExamForResponses)
                            .length > 0 ? (
                            <div className={styles.responsesTable}>
                              <div className={styles.responsesTableHeader}>
                                <div
                                  className={styles.responsesTableHeaderCell}
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedExamResponses.size ===
                                      getResponsesForExam(
                                        selectedExamForResponses
                                      ).length
                                    }
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedExamResponses(
                                          new Set(
                                            getResponsesForExam(
                                              selectedExamForResponses
                                            ).map((r) => r.id)
                                          )
                                        );
                                      } else {
                                        setSelectedExamResponses(new Set());
                                      }
                                    }}
                                  />
                                </div>
                                <div
                                  className={styles.responsesTableHeaderCell}
                                >
                                  Student
                                </div>
                                <div
                                  className={styles.responsesTableHeaderCell}
                                >
                                  Submitted
                                </div>
                                <div
                                  className={styles.responsesTableHeaderCell}
                                >
                                  Time Spent
                                </div>
                                <div
                                  className={styles.responsesTableHeaderCell}
                                >
                                  Score
                                </div>
                                <div
                                  className={styles.responsesTableHeaderCell}
                                >
                                  Status
                                </div>
                                <div
                                  className={styles.responsesTableHeaderCell}
                                >
                                  Actions
                                </div>
                              </div>

                              {getResponsesForExam(
                                selectedExamForResponses
                              ).map((response) => (
                                <div
                                  key={response.id}
                                  className={styles.responseRow}
                                >
                                  <div className={styles.responseCell}>
                                    <input
                                      type="checkbox"
                                      checked={selectedExamResponses.has(
                                        response.id
                                      )}
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
                                      {response.timeSpent
                                        ? `${Math.floor(
                                            response.timeSpent / 60
                                          )}m ${response.timeSpent % 60}s`
                                        : "N/A"}
                                    </div>
                                  </div>
                                  <div className={styles.responseCell}>
                                    <div className={styles.scoreDisplay}>
                                      {response.totalScore !== null ? (
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
                                          {response.totalScore}/
                                          {response.maxScore} (
                                          {response.percentage?.toFixed(1) || 0}
                                          %)
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
                                              response.status
                                                ?.charAt(0)
                                                ?.toUpperCase() +
                                              response.status?.slice(1)
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
                                      {response.flaggedForReview && (
                                        <AlertTriangle
                                          className="h-4 w-4 text-yellow-500"
                                          title="Flagged for Review"
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
                                    <div className={styles.responseActions}>
                                      <button
                                        onClick={() =>
                                          autoGradeResponse(response.id)
                                        }
                                        disabled={loading}
                                        className={`${styles.responseActionBtn} ${styles.responseActionBtnGrade}`}
                                        title="Auto-grade response"
                                      >
                                        <Brain className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          /* TODO: Implement detailed view */
                                        }}
                                        className={`${styles.responseActionBtn} ${styles.responseActionBtnView}`}
                                        title="View detailed response"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          /* TODO: Implement manual grading */
                                        }}
                                        className={`${styles.responseActionBtn} ${styles.responseActionBtnEdit}`}
                                        title="Manual grade"
                                      >
                                        <Edit3 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className={styles.emptyState}>
                              <BarChart3 className={styles.emptyStateIcon} />
                              <h4 className={styles.emptyStateTitle}>
                                No Responses Yet
                              </h4>
                              <p className={styles.emptyStateText}>
                                Student responses will appear here once they
                                start taking the exam.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Response Statistics */}
                        {getResponsesForExam(selectedExamForResponses).length >
                          0 && (
                          <div className={styles.responseStats}>
                            <h5>Response Statistics</h5>
                            <div className={styles.statsGrid}>
                              <div className={styles.statCard}>
                                <div className={styles.statValue}>
                                  {
                                    getResponsesForExam(
                                      selectedExamForResponses
                                    ).length
                                  }
                                </div>
                                <div className={styles.statLabel}>
                                  Total Responses
                                </div>
                              </div>
                              <div className={styles.statCard}>
                                <div className={styles.statValue}>
                                  {
                                    getResponsesForExam(
                                      selectedExamForResponses
                                    ).filter((r) => r.graded).length
                                  }
                                </div>
                                <div className={styles.statLabel}>Graded</div>
                              </div>
                              <div className={styles.statCard}>
                                <div className={styles.statValue}>
                                  {
                                    getResponsesForExam(
                                      selectedExamForResponses
                                    ).filter((r) => r.passed).length
                                  }
                                </div>
                                <div className={styles.statLabel}>Passed</div>
                              </div>
                              <div className={styles.statCard}>
                                <div className={styles.statValue}>
                                  {Math.round(
                                    getResponsesForExam(
                                      selectedExamForResponses
                                    )
                                      .filter((r) => r.percentage !== null)
                                      .reduce(
                                        (acc, r) => acc + r.percentage,
                                        0
                                      ) /
                                      Math.max(
                                        getResponsesForExam(
                                          selectedExamForResponses
                                        ).filter((r) => r.percentage !== null)
                                          .length,
                                        1
                                      )
                                  ) || 0}
                                  %
                                </div>
                                <div className={styles.statLabel}>
                                  Average Score
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
