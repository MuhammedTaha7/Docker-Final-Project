/**
 * ExamsTab Component
 * File: src/View/Pages/Lecturer/ExamsTab.jsx
 */

import React from "react";
import {
  Plus,
  FileText,
  RefreshCw,
  Save,
  Edit3,
  Trash2,
  Eye,
  Timer,
  Calendar,
  Target,
  Play,
  Pause,
  CheckCircle,
  Percent,
  X,
  Shuffle,
  Navigation,
  Shield,
  Zap,
  Globe,
  BarChart3,
} from "lucide-react";
import { formatDateTime } from "../../../Utils/AssignmentsDashboardUtils";
import ExamQuestionManager from "./ExamQuestionManager";
import styles from "./AssignmentsDashboard.module.css";

export default function ExamsTab({
  // State
  showExamForm,
  setShowExamForm,
  editingExam,
  setEditingExam,
  editingExamData,
  setEditingExamData,
  viewingExam,
  setViewingExam,
  showQuestionManager,
  setShowQuestionManager,
  questionManagerExamId,
  setQuestionManagerExamId,
  loading,

  // Data
  selectedCourseData,
  exams,

  // Forms
  newExam,
  setNewExam,

  // Actions
  createExam,
  updateExam,
  deleteExam,
  publishExam,
  unpublishExam,
  addQuestionToExam,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,

  // Computed values
  filteredExams,
  getExamResponses,
  getExamById,
}) {
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
  };

  // Question Manager handlers
  const handleManageQuestions = (examId) => {
    setQuestionManagerExamId(examId);
    setShowQuestionManager(true);
  };

  const handleCloseQuestionManager = () => {
    setShowQuestionManager(false);
    setQuestionManagerExamId(null);
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

  return (
    <>
      {/* Question Manager Modal */}
      {showQuestionManager && questionManagerExamId && (
        <div className={styles.assignmentModal}>
          <div className={styles.assignmentModalContent}>
            <div className={styles.assignmentModalHeader}>
              <h2 className={styles.assignmentModalTitle}>
                Manage Questions - {getExamById(questionManagerExamId)?.title}
              </h2>
              <button
                onClick={handleCloseQuestionManager}
                className={styles.assignmentModalCloseBtn}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className={styles.assignmentModalBody}>
              <ExamQuestionManager
                exam={getExamById(questionManagerExamId)}
                questions={getExamById(questionManagerExamId)?.questions || []}
                onAddQuestion={addQuestionToExam}
                onUpdateQuestion={updateQuestion}
                onDeleteQuestion={deleteQuestion}
                onReorderQuestions={reorderQuestions}
                loading={loading}
                className={styles.questionManagerInModal}
              />
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
                  <span>Show Timer: {viewingExam.showTimer ? "Yes" : "No"}</span>
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

          {/* Exam Creation Form */}
          {showExamForm && (
            <div className={styles.formSection}>
              <h4 className={styles.formTitle}>Create New Exam</h4>
              <div className={styles.formCard}>
                <div className={styles.examFormGrid}>
                  {/* Row 1: Title (spans 3 columns), Duration, Max Attempts, Start Time */}
                  <div className={styles.colSpan3}>
                    <label className={styles.formLabel}>Exam Title</label>
                    <input
                      type="text"
                      placeholder="Enter exam title"
                      value={newExam.title}
                      onChange={(e) =>
                        setNewExam({ ...newExam, title: e.target.value })
                      }
                      className={styles.examFormInput}
                      disabled={loading}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      placeholder="60"
                      value={newExam.duration}
                      onChange={(e) =>
                        setNewExam({
                          ...newExam,
                          duration: parseInt(e.target.value) || 60,
                        })
                      }
                      className={styles.examFormInput}
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
                      onChange={(e) =>
                        setNewExam({
                          ...newExam,
                          maxAttempts: parseInt(e.target.value) || 1,
                        })
                      }
                      className={styles.examFormInput}
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
                      onChange={(e) =>
                        setNewExam({ ...newExam, startTime: e.target.value })
                      }
                      className={styles.examFormInput}
                      disabled={loading}
                    />
                  </div>

                  {/* Row 2: End Time, Pass Percentage (narrow), Publish Time, Description */}
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>End Time</label>
                    <input
                      type="datetime-local"
                      value={newExam.endTime}
                      onChange={(e) =>
                        setNewExam({ ...newExam, endTime: e.target.value })
                      }
                      className={styles.examFormInput}
                      disabled={loading}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Pass Percentage</label>
                    <div className={styles.examPercentInputWrapper}>
                      <input
                        type="number"
                        placeholder="60"
                        value={newExam.passPercentage}
                        onChange={(e) =>
                          setNewExam({
                            ...newExam,
                            passPercentage: parseFloat(e.target.value) || 60,
                          })
                        }
                        className={styles.examPercentInput}
                        min="0"
                        max="100"
                        step="0.1"
                        disabled={loading}
                      />
                      <Percent className={styles.examPercentInputIcon} />
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>
                      Publish Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={newExam.publishTime}
                      onChange={(e) =>
                        setNewExam({ ...newExam, publishTime: e.target.value })
                      }
                      className={styles.examFormInput}
                      disabled={loading}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Description</label>
                    <textarea
                      placeholder="Enter exam description"
                      value={newExam.description}
                      onChange={(e) =>
                        setNewExam({ ...newExam, description: e.target.value })
                      }
                      className={styles.examFormTextarea}
                      rows={3}
                      disabled={loading}
                    />
                  </div>

                  {/* Row 3: Instructions */}
                  <div className={styles.colSpan6}>
                    <label className={styles.formLabel}>
                      Instructions for Students
                    </label>
                    <textarea
                      placeholder="Detailed instructions for taking the exam"
                      value={newExam.instructions}
                      onChange={(e) =>
                        setNewExam({ ...newExam, instructions: e.target.value })
                      }
                      className={styles.examFormTextarea}
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
                          onChange={(e) =>
                            setNewExam({
                              ...newExam,
                              shuffleQuestions: e.target.checked,
                            })
                          }
                          disabled={loading}
                        />
                        <Shuffle className={styles.checkboxIcon} />
                        <div className={styles.checkboxText}>
                          Shuffle Questions
                        </div>
                      </label>

                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={newExam.shuffleOptions}
                          onChange={(e) =>
                            setNewExam({
                              ...newExam,
                              shuffleOptions: e.target.checked,
                            })
                          }
                          disabled={loading}
                        />
                        <Shuffle className={styles.checkboxIcon} />
                        <div className={styles.checkboxText}>
                          Shuffle Answer Options
                        </div>
                      </label>

                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={newExam.allowNavigation}
                          onChange={(e) =>
                            setNewExam({
                              ...newExam,
                              allowNavigation: e.target.checked,
                            })
                          }
                          disabled={loading}
                        />
                        <Navigation className={styles.checkboxIcon} />
                        <div className={styles.checkboxText}>
                          Allow Question Navigation
                        </div>
                      </label>

                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={newExam.showTimer}
                          onChange={(e) =>
                            setNewExam({
                              ...newExam,
                              showTimer: e.target.checked,
                            })
                          }
                          disabled={loading}
                        />
                        <Timer className={styles.checkboxIcon} />
                        <div className={styles.checkboxText}>Show Timer</div>
                      </label>

                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={newExam.autoSubmit}
                          onChange={(e) =>
                            setNewExam({
                              ...newExam,
                              autoSubmit: e.target.checked,
                            })
                          }
                          disabled={loading}
                        />
                        <Zap className={styles.checkboxIcon} />
                        <div className={styles.checkboxText}>
                          Auto Submit on Time Up
                        </div>
                      </label>

                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={newExam.showResults}
                          onChange={(e) =>
                            setNewExam({
                              ...newExam,
                              showResults: e.target.checked,
                            })
                          }
                          disabled={loading}
                        />
                        <Eye className={styles.checkboxIcon} />
                        <div className={styles.checkboxText}>
                          Show Results After Submission
                        </div>
                      </label>

                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={newExam.requireSafeBrowser}
                          onChange={(e) =>
                            setNewExam({
                              ...newExam,
                              requireSafeBrowser: e.target.checked,
                            })
                          }
                          disabled={loading}
                        />
                        <Shield className={styles.checkboxIcon} />
                        <div className={styles.checkboxText}>
                          Require Safe Browser
                        </div>
                      </label>

                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={newExam.visibleToStudents}
                          onChange={(e) =>
                            setNewExam({
                              ...newExam,
                              visibleToStudents: e.target.checked,
                            })
                          }
                          disabled={loading}
                        />
                        <Globe className={styles.checkboxIcon} />
                        <div className={styles.checkboxText}>
                          Visible to Students
                        </div>
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
                                  duration: parseInt(e.target.value) || 60,
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
                                  maxAttempts: parseInt(e.target.value) || 1,
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
                              value={editingExamData?.passPercentage || ""}
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
                              value={editingExamData?.instructions || ""}
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
                              onClick={() => handleManageQuestions(exam.id)}
                              disabled={loading}
                              className={`${styles.examActionBtn} ${styles.examActionBtnResponses}`}
                              title="Manage questions"
                            >
                              <FileText className="h-4 w-4" />
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
                            {exam.description || "No description provided"}
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
                              <BarChart3 className="h-4 w-4" />
                              <span>Total Points: {exam.totalPoints || 0}</span>
                            </div>
                          </div>

                          <div className={styles.examStats}>
                            <div className={styles.statItem}>
                              <span className={styles.statValue}>
                                {exam.questions?.length || 0}
                              </span>
                              <span className={styles.statLabel}>Questions</span>
                            </div>
                            <div className={styles.statItem}>
                              <span className={styles.statValue}>
                                {getExamResponses(exam.id).length}
                              </span>
                              <span className={styles.statLabel}>Responses</span>
                            </div>
                            <div className={styles.statItem}>
                              <span className={styles.statValue}>
                                {exam.maxAttempts === 1 ? "1" : exam.maxAttempts}
                              </span>
                              <span className={styles.statLabel}>
                                Max Attempts
                              </span>
                            </div>
                          </div>
                        </div>
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
                  Create your first online exam to get started with digital
                  assessments.
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
    </>
  );
}