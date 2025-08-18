/**
 * Lecturer Dashboard Component - FIXED TO PASS getExamById TO ExamResponsesTab
 * File: src/View/Pages/Lecturer/AssignmentsDashboard.jsx
 */

import React, { useState, useCallback, useRef } from "react";
import {
  GraduationCap,
  Download,
  RefreshCw,
  Award,
  ClipboardList,
  FileText,
  Upload,
  BarChart3,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useLecturerDashboard } from "../../../Hooks/useAssignmentsDashboard";

// Import separated tab components
import GradesTab from "./GradesTab";
import AssignmentsTab from "./AssignmentsTab";
import ExamsTab from "./ExamsTab";
import SubmissionsTab from "./SubmissionsTab";
import ExamResponsesTab from "./ExamResponsesTab";

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
    selectedExamForResponses,
    setSelectedExamForResponses,
    editingExam,
    setEditingExam,
    editingAssignment,
    setEditingAssignment,
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
    filteredSubmissions,

    // Forms
    newAssignment,
    setNewAssignment,
    newColumn,
    setNewColumn,
    newExam,
    setNewExam,

    // Actions
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

    // Exam Actions (placeholders)
    createExam,
    updateExam,
    deleteExam,
    publishExam,
    unpublishExam,
    addQuestionToExam,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
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
    getExamById, // ← Make sure this is properly destructured

    // Manual grading props (placeholders)
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
    
    // Additional exam response props (placeholders)
    bulkResponseAction,
    setBulkResponseAction,
    bulkGradeValue,
    setBulkGradeValue,
    batchGradeExamResponses,
    examResponsesLoading,
    refetchExamResponses
  } = useLecturerDashboard();

  // Local state for assignment and exam viewing
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [editingAssignmentData, setEditingAssignmentData] = useState(null);
  const [viewingExam, setViewingExam] = useState(null);
  const [editingExamData, setEditingExamData] = useState(null);

  // Question Manager state
  const [showQuestionManager, setShowQuestionManager] = useState(false);
  const [questionManagerExamId, setQuestionManagerExamId] = useState(null);

  // Exam responses state
  const [selectedExamResponses, setSelectedExamResponses] = useState(new Set());

  // Additional state for submissions loading
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // Ref for scroll to top functionality
  const mainContentRef = useRef(null);

  // Helper function to refresh submissions
  const refetchSubmissions = useCallback(async () => {
    setSubmissionsLoading(true);
    try {
      // This would be handled by the hook's refetchSubmissions
      console.log('📄 Triggering submissions refresh from dashboard component');
      // The actual refetch is handled in the hook
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error("Error refetching submissions:", error);
    } finally {
      setSubmissionsLoading(false);
    }
  }, []);

  // Scroll to top when changing tabs
  const handleTabChange = useCallback(
    (tabId) => {
      setActiveTab(tabId);
      if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
      }
    },
    [setActiveTab]
  );

  // Loading state
  if (loading && courses.length === 0) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingContent}>
            <RefreshCw className={styles.loadingSpinner} />
            <p className={styles.loadingText}>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('🎯 === LECTURER DASHBOARD RENDER ===');
  console.log('🎯 selectedCourse:', selectedCourse);
  console.log('🎯 filteredAssignments:', filteredAssignments.length);
  console.log('🎯 filteredSubmissions:', filteredSubmissions.length);
  console.log('🎯 selectedAssignmentForSubmissions:', selectedAssignmentForSubmissions);
  console.log('🎯 getExamById function available:', typeof getExamById === 'function');

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
              <div className={styles.headerStats}>
                {selectedCourse && (
                  <div className={styles.quickStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>
                        {students.length}
                      </span>
                      <span className={styles.statLabel}>Students</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>
                        {assignments.length}
                      </span>
                      <span className={styles.statLabel}>Assignments</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{exams.length}</span>
                      <span className={styles.statLabel}>Exams</span>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={exportGrades}
                disabled={loading || !selectedCourse}
                className={styles.exportBtn}
                title="Export grades to CSV"
              >
                {loading ? (
                  <RefreshCw className={styles.btnIconSpinner} />
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
                onClick={() => handleTabChange(tab.id)}
                className={`${styles.navItem} ${
                  activeTab === tab.id ? styles.navItemActive : ""
                }`}
              >
                <tab.icon className={styles.navIcon} />
                <span className={styles.navLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main} ref={mainContentRef}>
        {/* Alert Messages */}
        <div className={styles.alertContainer}>
          {error && (
            <div className={styles.errorMessage}>
              <AlertCircle className={styles.alertIcon} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              <CheckCircle className={styles.alertIcon} />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Course Selector */}
        <div className={styles.courseSelector}>
          <div className={styles.courseSelectorContent}>
            <label className={styles.courseSelectorLabel}>Select Course</label>
            <select
              value={selectedCourse || ""}
              onChange={(e) => {
                const value = e.target.value;
                console.log('🎯 Course selector changed to:', value);
                setSelectedCourse(value);
              }}
              className={styles.courseSelectorSelect}
              disabled={loading}
            >
              <option value="">Choose a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} {course.code && `(${course.code})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!selectedCourse ? (
          <div className={styles.emptyStateCard}>
            <div className={styles.emptyStateContent}>
              <GraduationCap className={styles.emptyStateIcon} />
              <h3 className={styles.emptyStateTitle}>
                Welcome to Your Dashboard
              </h3>
              <p className={styles.emptyStateText}>
                Select a course from the dropdown above to manage grades,
                assignments, and track student progress.
              </p>
              <div className={styles.emptyStateFeatures}>
                <div className={styles.featureList}>
                  <div className={styles.featureItem}>
                    <Award className={styles.featureIcon} />
                    <span>Manage student grades</span>
                  </div>
                  <div className={styles.featureItem}>
                    <ClipboardList className={styles.featureIcon} />
                    <span>Create assignments</span>
                  </div>
                  <div className={styles.featureItem}>
                    <FileText className={styles.featureIcon} />
                    <span>Design online exams</span>
                  </div>
                  <div className={styles.featureItem}>
                    <Upload className={styles.featureIcon} />
                    <span>Review submissions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.tabContentWrapper}>
            

            {/* Grades Tab */}
            {activeTab === "grades" && (
              <GradesTab
                // State
                showColumnForm={showColumnForm}
                setShowColumnForm={setShowColumnForm}
                loading={loading}
                // Data
                students={students}
                gradeColumns={gradeColumns}
                selectedCourseData={selectedCourseData}
                // Forms
                newColumn={newColumn}
                setNewColumn={setNewColumn}
                // Actions
                addGradeColumn={addGradeColumn}
                updateColumn={updateColumn}
                deleteColumn={deleteColumn}
                updateGrade={updateGrade}
                // Computed values
                filteredStudents={filteredStudents}
                filteredColumns={filteredColumns}
                calculateFinalGrade={calculateFinalGrade}
                getTotalPercentage={getTotalPercentage}
              />
            )}

            {/* Assignments Tab */}
            {activeTab === "assignments" && (
              <AssignmentsTab
                // State
                showAssignmentForm={showAssignmentForm}
                setShowAssignmentForm={setShowAssignmentForm}
                editingAssignment={editingAssignment}
                setEditingAssignment={setEditingAssignment}
                editingAssignmentData={editingAssignmentData}
                setEditingAssignmentData={setEditingAssignmentData}
                viewingAssignment={viewingAssignment}
                setViewingAssignment={setViewingAssignment}
                loading={loading}
                // Data
                selectedCourseData={selectedCourseData}
                assignments={assignments}
                // Forms
                newAssignment={newAssignment}
                setNewAssignment={setNewAssignment}
                // Actions
                handleFileUpload={handleFileUpload}
                handleViewFile={handleViewFile}
                handleRemoveFile={handleRemoveFile}
                addAssignment={addAssignment}
                deleteAssignment={deleteAssignment}
                updateAssignment={updateAssignment}
                // Computed values
                filteredAssignments={filteredAssignments}
              />
            )}

            {/* Exams Tab */}
            {activeTab === "exams" && (
              <ExamsTab
                // State
                showExamForm={showExamForm}
                setShowExamForm={setShowExamForm}
                editingExam={editingExam}
                setEditingExam={setEditingExam}
                editingExamData={editingExamData}
                setEditingExamData={setEditingExamData}
                viewingExam={viewingExam}
                setViewingExam={setViewingExam}
                showQuestionManager={showQuestionManager}
                setShowQuestionManager={setShowQuestionManager}
                questionManagerExamId={questionManagerExamId}
                setQuestionManagerExamId={setQuestionManagerExamId}
                loading={loading}
                // Data
                selectedCourseData={selectedCourseData}
                exams={exams}
                // Forms
                newExam={newExam}
                setNewExam={setNewExam}
                // Actions
                createExam={createExam}
                updateExam={updateExam}
                deleteExam={deleteExam}
                publishExam={publishExam}
                unpublishExam={unpublishExam}
                addQuestionToExam={addQuestionToExam}
                updateQuestion={updateQuestion}
                deleteQuestion={deleteQuestion}
                reorderQuestions={reorderQuestions}
                // Computed values
                filteredExams={filteredExams}
                getExamResponses={getExamResponses}
                getExamById={getExamById}
              />
            )}

            {/* FIXED: Submissions Tab with enhanced debugging */}
            {activeTab === "submissions" && (
              <SubmissionsTab
                // State
                selectedAssignmentForSubmissions={selectedAssignmentForSubmissions}
                setSelectedAssignmentForSubmissions={setSelectedAssignmentForSubmissions}
                loading={loading}
                submissionsLoading={submissionsLoading}
                // Data
                selectedCourseData={selectedCourseData}
                students={students}
                assignments={assignments}
                submissions={submissions}
                // Actions
                handleViewFile={handleViewFile}
                updateSubmissionGrade={updateSubmissionGrade}
                setActiveTab={setActiveTab}
                setShowAssignmentForm={setShowAssignmentForm}
                refetchSubmissions={refetchSubmissions}
                // Computed values
                filteredSubmissions={filteredSubmissions}
                filteredAssignments={filteredAssignments}
                getStudentName={getStudentName}
                getSubmissionsForAssignment={getSubmissionsForAssignment}
              />
            )}

            {/* FIXED: Exam Responses Tab - Now includes getExamById prop */}
            {activeTab === "exam-responses" && (
              <ExamResponsesTab
                // Existing props
                selectedExamForResponses={selectedExamForResponses}
                setSelectedExamForResponses={setSelectedExamForResponses}
                selectedExamResponses={selectedExamResponses}
                setSelectedExamResponses={setSelectedExamResponses}
                bulkResponseAction={bulkResponseAction}
                setBulkResponseAction={setBulkResponseAction}
                bulkGradeValue={bulkGradeValue}
                setBulkGradeValue={setBulkGradeValue}
                loading={loading}
                exams={exams}
                autoGradeResponse={autoGradeResponse}
                autoGradeAllResponses={autoGradeAllResponses}
                filteredExams={filteredExams}
                getStudentName={getStudentName}
                getExamResponses={getExamResponses}
                getResponsesForExam={getResponsesForExam}
                
                // Manual grading props
                showGradingModal={showGradingModal}
                openGradingModal={openGradingModal}
                closeGradingModal={closeGradingModal}
                handleManualGrading={handleManualGrading}
                gradingModalMode={gradingModalMode}
                setGradingModalMode={setGradingModalMode}
                selectedResponseForGrading={selectedResponseForGrading}
                selectedExamForGrading={selectedExamForGrading}
                gradingLoading={gradingLoading}
                flagResponseForReview={flagResponseForReview}
                unflagResponse={unflagResponse}
                getResponseGradingStatus={getResponseGradingStatus}
                canResponseBeGraded={canResponseBeGraded}
                needsManualGrading={needsManualGrading}
                
                // Additional props
                examResponsesLoading={examResponsesLoading}
                refetchExamResponses={refetchExamResponses}
                batchGradeExamResponses={batchGradeExamResponses}
                
                // FIXED: Now passing getExamById function
                getExamById={getExamById}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}