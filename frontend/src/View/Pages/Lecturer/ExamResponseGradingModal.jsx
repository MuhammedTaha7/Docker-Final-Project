/**
 * Exam Response Grading Modal Component
 * File: src/View/Pages/Lecturer/ExamResponseGradingModal.jsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Save,
  Eye,
  Edit3,
  FileText,
  Award,
  MessageSquare,
  Calendar,
  Timer,
  BarChart3,
  RefreshCw,
  Flag,
  CheckSquare,
  XCircle
} from 'lucide-react';
import { formatDateTime } from '../../../Utils/AssignmentsDashboardUtils';
import styles from './ExamResponseGradingModal.module.css';

const ExamResponseGradingModal = ({
  // Props
  isOpen,
  onClose,
  response,
  exam,
  onSaveGrade,
  loading,
  getStudentName,
  mode = 'view', // 'view' or 'grade'
  onModeChange
}) => {
  // State
  const [currentMode, setCurrentMode] = useState(mode);
  const [questionScores, setQuestionScores] = useState({});
  const [instructorFeedback, setInstructorFeedback] = useState('');
  const [flaggedForReview, setFlaggedForReview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [gradingProgress, setGradingProgress] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize state when response changes
  useEffect(() => {
    if (response && isOpen) {
      setQuestionScores(response.questionScores || {});
      setInstructorFeedback(response.instructorFeedback || '');
      setFlaggedForReview(response.flaggedForReview || false);
      setHasUnsavedChanges(false);
      
      // Set active question to first ungraded question
      if (exam && exam.questions) {
        const firstUngraded = exam.questions.find(q => 
          !response.questionScores || response.questionScores[q.id] === undefined
        );
        setActiveQuestionId(firstUngraded ? firstUngraded.id : exam.questions[0]?.id);
      }
      
      calculateGradingProgress();
    }
  }, [response, isOpen, exam]);

  // Calculate grading progress
  const calculateGradingProgress = useCallback(() => {
    if (!exam || !exam.questions || exam.questions.length === 0) {
      setGradingProgress(0);
      return;
    }

    const totalQuestions = exam.questions.length;
    const gradedQuestions = exam.questions.filter(q => 
      questionScores[q.id] !== undefined && questionScores[q.id] !== null
    ).length;

    const progress = (gradedQuestions / totalQuestions) * 100;
    setGradingProgress(Math.round(progress));
  }, [exam, questionScores]);

  // Update progress when scores change
  useEffect(() => {
    calculateGradingProgress();
  }, [questionScores, calculateGradingProgress]);

  // Handle question score change
  const handleScoreChange = (questionId, score) => {
    const question = exam.questions.find(q => q.id === questionId);
    const maxPoints = question ? question.points : 0;
    
    // Validate score
    let validScore = Math.max(0, Math.min(maxPoints, parseInt(score) || 0));
    
    setQuestionScores(prev => ({
      ...prev,
      [questionId]: validScore
    }));
    
    setHasUnsavedChanges(true);
  };

  // Handle feedback change
  const handleFeedbackChange = (value) => {
    setInstructorFeedback(value);
    setHasUnsavedChanges(true);
  };

  // Handle flag toggle
  const handleFlagToggle = () => {
    setFlaggedForReview(!flaggedForReview);
    setHasUnsavedChanges(true);
  };

  // Calculate totals
  const calculateTotals = useCallback(() => {
    if (!exam || !exam.questions) {
      return { totalScore: 0, maxScore: 0, percentage: 0 };
    }

    const totalScore = Object.values(questionScores).reduce((sum, score) => sum + (score || 0), 0);
    const maxScore = exam.questions.reduce((sum, q) => sum + (q.points || 0), 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    return { totalScore, maxScore, percentage };
  }, [exam, questionScores]);

  // Save grades
  const handleSave = async () => {
  if (!response || !exam) return;

  setSaving(true);
  try {
    const { totalScore, maxScore, percentage } = calculateTotals();
    
    // FIXED: Structure the data correctly to match backend expectations
    const gradeData = {
      responseId: response.id,
      questionScores: questionScores,
      instructorFeedback: instructorFeedback,
      flaggedForReview: flaggedForReview,
      // Additional fields that backend might expect
      totalScore: totalScore,
      maxScore: maxScore,
      percentage: Math.round(percentage * 100) / 100
    };

    console.log('📝 Sending grade data to backend:', gradeData);
    
    await onSaveGrade(gradeData);
    setHasUnsavedChanges(false);
  } catch (error) {
    console.error('Error saving grades:', error);
  } finally {
    setSaving(false);
  }
};

  // Handle close with unsaved changes warning
  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Toggle mode
  const handleModeToggle = () => {
    const newMode = currentMode === 'view' ? 'grade' : 'view';
    setCurrentMode(newMode);
    if (onModeChange) onModeChange(newMode);
  };

  // Navigate between questions
  const goToQuestion = (questionId) => {
    setActiveQuestionId(questionId);
  };

  // Get question type icon
  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'multiple-choice': return <CheckSquare className={styles.questionIcon} />;
      case 'true-false': return <XCircle className={styles.questionIcon} />;
      case 'text': return <FileText className={styles.questionIcon} />;
      case 'essay': return <MessageSquare className={styles.questionIcon} />;
      default: return <FileText className={styles.questionIcon} />;
    }
  };

  // Get question status
  const getQuestionStatus = (questionId) => {
    const score = questionScores[questionId];
    if (score === undefined || score === null) return 'ungraded';
    
    const question = exam.questions.find(q => q.id === questionId);
    const maxPoints = question ? question.points : 0;
    
    if (score === maxPoints) return 'full';
    if (score > 0) return 'partial';
    return 'zero';
  };

  // Format student answer based on question type
  const formatStudentAnswer = (question, answer) => {
    if (!answer) return 'No answer provided';

    switch (question.type) {
      case 'multiple-choice':
        // Try to find option by index or text
        let optionIndex = -1;
        try {
          optionIndex = parseInt(answer);
        } catch (e) {
          // If not a number, find by text
          optionIndex = question.options.findIndex(opt => opt === answer);
        }
        
        if (optionIndex >= 0 && optionIndex < question.options.length) {
          return `${String.fromCharCode(65 + optionIndex)}. ${question.options[optionIndex]}`;
        }
        return answer;
        
      case 'true-false':
        return answer.charAt(0).toUpperCase() + answer.slice(1).toLowerCase();
        
      default:
        return answer;
    }
  };

  // Get correct answer display
  const getCorrectAnswerDisplay = (question) => {
    switch (question.type) {
      case 'multiple-choice':
        if (question.correctAnswerIndex !== null && question.options) {
          const index = question.correctAnswerIndex;
          return `${String.fromCharCode(65 + index)}. ${question.options[index]}`;
        }
        return question.correctAnswer || 'Not specified';
        
      case 'true-false':
        return question.correctAnswer || 'Not specified';
        
      case 'short-answer':
        return question.acceptableAnswers?.join(', ') || question.correctAnswer || 'Not specified';
        
      case 'essay':
        return 'Manual grading required';
        
      default:
        return 'Not specified';
    }
  };

  if (!isOpen || !response || !exam) return null;

  const { totalScore, maxScore, percentage } = calculateTotals();
  const studentName = getStudentName ? getStudentName(response.studentId) : 'Unknown Student';
  const currentQuestion = activeQuestionId ? exam.questions.find(q => q.id === activeQuestionId) : null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerTitle}>
              {currentMode === 'view' ? 'View' : 'Grade'} Exam Response
            </div>
            <div className={styles.headerSubtitle}>
              {exam.title} - {studentName}
            </div>
          </div>
          <div className={styles.headerRight}>
            <button
              onClick={handleModeToggle}
              className={`${styles.modeToggle} ${currentMode === 'grade' ? styles.gradeMode : styles.viewMode}`}
              title={currentMode === 'view' ? 'Switch to grading mode' : 'Switch to view mode'}
            >
              {currentMode === 'view' ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {currentMode === 'view' ? 'Grade' : 'View'}
            </button>
            <button
              onClick={handleClose}
              className={styles.closeButton}
              title="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.modalBody}>
          {/* Response Info Panel */}
          <div className={styles.responseInfo}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <User className={styles.infoIcon} />
                <div>
                  <div className={styles.infoLabel}>Student</div>
                  <div className={styles.infoValue}>{studentName}</div>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <Calendar className={styles.infoIcon} />
                <div>
                  <div className={styles.infoLabel}>Submitted</div>
                  <div className={styles.infoValue}>
                    {response.submittedAt ? formatDateTime(response.submittedAt) : 'In Progress'}
                  </div>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <Timer className={styles.infoIcon} />
                <div>
                  <div className={styles.infoLabel}>Time Spent</div>
                  <div className={styles.infoValue}>
                    {response.timeSpent ? `${Math.floor(response.timeSpent / 60)}m ${response.timeSpent % 60}s` : 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <Award className={styles.infoIcon} />
                <div>
                  <div className={styles.infoLabel}>Current Score</div>
                  <div className={styles.infoValue}>
                    {totalScore}/{maxScore} ({percentage.toFixed(1)}%)
                  </div>
                </div>
              </div>
            </div>

            {/* Grading Progress */}
            {currentMode === 'grade' && (
              <div className={styles.gradingProgress}>
                <div className={styles.progressHeader}>
                  <span>Grading Progress</span>
                  <span>{gradingProgress}% Complete</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${gradingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className={styles.contentArea}>
            {/* Question Navigation */}
            <div className={styles.questionNav}>
              <div className={styles.navHeader}>
                <span>Questions ({exam.questions ? exam.questions.length : 0})</span>
                {currentMode === 'grade' && (
                  <span className={styles.navSubtext}>
                    Click to navigate
                  </span>
                )}
              </div>
              <div className={styles.questionList}>
                {exam.questions && exam.questions.map((question, index) => {
                  const status = getQuestionStatus(question.id);
                  const isActive = activeQuestionId === question.id;
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => goToQuestion(question.id)}
                      className={`${styles.questionNavItem} ${styles[status]} ${isActive ? styles.active : ''}`}
                    >
                      <span className={styles.questionNumber}>{index + 1}</span>
                      <div className={styles.questionNavInfo}>
                        <span className={styles.questionPoints}>{question.points}pts</span>
                        {questionScores[question.id] !== undefined && (
                          <span className={styles.questionScore}>
                            {questionScores[question.id]}/{question.points}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Detail */}
            <div className={styles.questionDetailWrapper}>
              {currentQuestion ? (
                <div className={styles.questionDetail}>
                  <div className={styles.questionHeader}>
                    <div className={styles.questionTypeInfo}>
                      {getQuestionTypeIcon(currentQuestion.type)}
                      <span className={styles.questionType}>
                        {currentQuestion.type.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className={styles.questionPointsBadge}>
                        {currentQuestion.points} points
                      </span>
                    </div>
                    
                    {currentMode === 'grade' && (
                      <div className={styles.scoreInput}>
                        <label htmlFor="score">Score:</label>
                        <input
                          id="score"
                          type="number"
                          min="0"
                          max={currentQuestion.points}
                          value={questionScores[currentQuestion.id] || ''}
                          onChange={(e) => handleScoreChange(currentQuestion.id, e.target.value)}
                          className={styles.scoreField}
                          placeholder="0"
                        />
                        <span>/ {currentQuestion.points}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.questionContent}>
                    <div className={styles.questionText}>
                      <h4>Question:</h4>
                      <p>{currentQuestion.question}</p>
                    </div>

                    {/* Multiple Choice Options */}
                    {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                      <div className={styles.questionOptions}>
                        <h4>Options:</h4>
                        <div className={styles.optionsList}>
                          {currentQuestion.options.map((option, index) => (
                            <div 
                              key={index} 
                              className={`${styles.option} ${index === currentQuestion.correctAnswerIndex ? styles.correctOption : ''}`}
                            >
                              <span className={styles.optionLetter}>
                                {String.fromCharCode(65 + index)}.
                              </span>
                              <span className={styles.optionText}>{option}</span>
                              {index === currentQuestion.correctAnswerIndex && (
                                <CheckCircle className={styles.correctIcon} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Student Answer */}
                    <div className={styles.studentAnswer}>
                      <h4>Student Answer:</h4>
                      <div className={styles.answerBox}>
                        {formatStudentAnswer(currentQuestion, response.answers && response.answers[currentQuestion.id])}
                      </div>
                    </div>

                    {/* Correct Answer */}
                    {currentMode === 'grade' && (
                      <div className={styles.correctAnswer}>
                        <h4>Correct Answer:</h4>
                        <div className={styles.answerBox}>
                          {getCorrectAnswerDisplay(currentQuestion)}
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    {currentQuestion.explanation && (
                      <div className={styles.explanation}>
                        <h4>Explanation:</h4>
                        <div className={styles.explanationText}>
                          {currentQuestion.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={styles.noQuestionSelected}>
                  <FileText className={styles.noQuestionIcon} />
                  <p>Select a question to view details</p>
                </div>
              )}
            </div>

            {/* Grading Panel - Show in grade mode */}
            {currentMode === 'grade' && (
              <div className={styles.gradingPanel}>
                <div className={styles.gradingHeader}>
                  <h3>Overall Grading</h3>
                  <div className={styles.totalScore}>
                    Total: {totalScore}/{maxScore} ({percentage.toFixed(1)}%)
                  </div>
                </div>

                <div className={styles.gradingPanelContent}>
                  <div className={styles.feedbackSection}>
                    <label htmlFor="feedback">Instructor Feedback:</label>
                    <textarea
                      id="feedback"
                      value={instructorFeedback}
                      onChange={(e) => handleFeedbackChange(e.target.value)}
                      placeholder="Provide feedback to the student..."
                      className={styles.feedbackTextarea}
                      rows="6"
                    />
                  </div>

                  <div className={styles.gradingOptions}>
                    <label className={styles.flagOption}>
                      <input
                        type="checkbox"
                        checked={flaggedForReview}
                        onChange={handleFlagToggle}
                      />
                      <Flag className="h-4 w-4" />
                      Flag for review
                    </label>
                  </div>
                </div>

                <div className={styles.gradingActions}>
                  <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className={styles.saveButton}
                  >
                    {saving ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {saving ? 'Saving...' : 'Save Grade'}
                  </button>
                  
                  {hasUnsavedChanges && (
                    <div className={styles.unsavedWarning}>
                      <AlertTriangle className="h-4 w-4" />
                      Unsaved changes
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResponseGradingModal;