import React, { useState, useEffect } from 'react';
import styles from '../../../CSS/Components/student/ExamTaking.module.css';

import { 
  Timer,
  Target,
  FileText,
  Save,
  Flag,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Grid3X3,
  Award,
  Zap,
  Shield,
  Coffee,
  Brain,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  Star,
  XCircle,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  RefreshCw
} from 'lucide-react';

import { 
  useExamAttempt, 
  useExamValidation 
} from '../../../Hooks/useStudentAssignmentDashboard';
import LoadingSpinner from '../../Pages/Global/Loading';
import ExamResultsModal from './ExamResultsModal';

export default function ExamTakingInterface({ examId }) {
  const [showQuestionOverview, setShowQuestionOverview] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Enhanced exam attempt hook with full functionality
  const { 
    exam,
    examResponse,
    examInProgress,
    examSubmitted,
    examResults,
    showResults,
    currentQuestionIndex,
    shuffledQuestions,
    shuffledOptions,
    visitedQuestions,
    flaggedQuestions,
    answers,
    updateAnswer,
    clearAnswer,
    getProgress,
    getQuestionStatus,
    timeRemaining,
    formatTime,
    goToQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    flagQuestion,
    startExam,
    submitExam,
    saveProgress,
    getExamResults,
    getDetailedResults,
    loading: examLoading,
    error: examError,
    autoSaveEnabled,
    setAutoSaveEnabled,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    setError: setExamError
  } = useExamAttempt();

  // Exam validation hook
  const validation = useExamValidation(exam, answers);

  // ====================================
  // INITIALIZATION EFFECT - FIXED
  // ====================================

  useEffect(() => {
    const initializeExam = async () => {
      if (examId && !isInitialized && !examInProgress && !examSubmitted && !examLoading) {
        console.log('🎯 Initializing exam:', examId);
        try {
          setIsInitialized(true);
          await startExam(examId);
        } catch (error) {
          console.error('❌ Failed to initialize exam:', error);
          setExamError(error.message || 'Failed to start exam');
          setIsInitialized(false);
        }
      }
    };

    initializeExam();
  }, [examId, examInProgress, examSubmitted, examLoading, startExam, setExamError, isInitialized]);

  // Handle exam completion and results
  useEffect(() => {
    if (showResults && examResults) {
      setShowResultsModal(true);
    }
  }, [showResults, examResults]);

  // ====================================
  // EXAM LIFECYCLE HANDLERS - ENHANCED
  // ====================================

  const handleSubmitExam = async () => {
    if (!validation.requiredQuestionsAnswered) {
      const confirmSubmit = window.confirm(
        `${validation.warnings.join('\n')}\n\nAre you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    if (!window.confirm('Are you sure you want to submit your exam? You cannot change your answers after submission.')) {
      return;
    }

    try {
      console.log('📤 Submitting exam...');
      const result = await submitExam();
      
      // Show results immediately if exam allows it
      if (exam.showResults && result?.graded) {
        setShowResultsModal(true);
      } else {
        alert('Exam submitted successfully! Results will be available once graded.');
        // Close window after successful submission
        handleExitExam(false);
      }
    } catch (err) {
      console.error('Failed to submit exam:', err);
      alert('Failed to submit exam: ' + err.message);
    }
  };

  const handleSaveProgress = async () => {
    try {
      await saveProgress(true); // Force save
      alert('Progress saved successfully!');
    } catch (err) {
      console.error('Failed to save progress:', err);
      alert('Failed to save progress: ' + err.message);
    }
  };

  const handleExitExam = (showConfirmation = true) => {
    if (examInProgress && showConfirmation) {
      if (window.confirm('Are you sure you want to exit? Your progress will be saved but you\'ll need to resume later.')) {
        saveProgress(true);
        closeExamWindow();
      }
    } else {
      closeExamWindow();
    }
  };

  const closeExamWindow = () => {
    // Try multiple methods to close/navigate
    if (window.opener) {
      // Opened from another window
      window.close();
    } else if (window.history.length > 1) {
      // Has navigation history
      window.history.back();
    } else {
      // Direct navigation or no history
      window.location.href = '/dashboard';
    }
  };

  const handleResultsClose = () => {
    setShowResultsModal(false);
    // Close window after viewing results
    setTimeout(() => {
      handleExitExam(false);
    }, 1000);
  };

  // ====================================
  // CUSTOM ERROR COMPONENT
  // ====================================

  const ExamErrorComponent = ({ error, onRetry }) => (
    <div className={styles.errorContainer}>
      <div className={styles.examErrorMessage}>
        <AlertTriangle className={styles.errorIcon} />
        <h3>Exam Loading Error</h3>
        <p>{error}</p>
        <div className={styles.errorActions}>
          <button 
            onClick={onRetry || (() => window.location.reload())} 
            className={styles.retryButton}
          >
            <RefreshCw className={styles.retryIcon} />
            Try Again
          </button>
          <button 
            onClick={() => handleExitExam(false)} 
            className={styles.homeButton}
          >
            <Home className={styles.homeIcon} />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  // ====================================
  // ANSWER RENDERING FUNCTIONS - ENHANCED
  // ====================================

  const renderQuestionAnswer = (question, questionIndex) => {
    if (!question) return null;
    
    const questionId = question.id;
    const currentAnswer = answers[questionId];

    switch (question.type) {
      case 'multiple-choice':
        return renderMultipleChoice(question, currentAnswer);
      case 'true-false':
        return renderTrueFalse(question, currentAnswer);
      case 'short-answer':
      case 'text':
        return renderTextAnswer(question, currentAnswer);
      case 'essay':
        return renderEssayAnswer(question, currentAnswer);
      default:
        return <div className={styles.unsupportedQuestion}>Unsupported question type: {question.type}</div>;
    }
  };

  const renderMultipleChoice = (question, currentAnswer) => {
    const questionId = question.id;
    const options = shuffledOptions[questionId]?.shuffledOptions || question.options || [];
    
    return (
      <div className={styles.optionsList}>
        {options.map((option, optionIndex) => {
          const isSelected = currentAnswer === optionIndex || currentAnswer === option;
          
          return (
            <label 
              key={optionIndex} 
              className={`${styles.optionLabel} ${isSelected ? styles.optionSelected : ''}`}
            >
              <input
                type="radio"
                name={`question-${questionId}`}
                value={optionIndex}
                checked={isSelected}
                onChange={(e) => updateAnswer(questionId, parseInt(e.target.value))}
                className={styles.optionInput}
              />
              <div className={styles.optionMarker}>
                {String.fromCharCode(65 + optionIndex)}
              </div>
              <span className={styles.optionText}>{option}</span>
            </label>
          );
        })}
      </div>
    );
  };

  const renderTrueFalse = (question, currentAnswer) => {
    const questionId = question.id;
    
    return (
      <div className={styles.optionsList}>
        {['True', 'False'].map((option, optionIndex) => {
          const optionValue = option.toLowerCase();
          const isSelected = currentAnswer === optionValue || currentAnswer === option;
          
          return (
            <label 
              key={optionIndex} 
              className={`${styles.optionLabel} ${isSelected ? styles.optionSelected : ''}`}
            >
              <input
                type="radio"
                name={`question-${questionId}`}
                value={optionValue}
                checked={isSelected}
                onChange={(e) => updateAnswer(questionId, e.target.value)}
                className={styles.optionInput}
              />
              <div className={styles.optionMarker}>
                {option === 'True' ? 'T' : 'F'}
              </div>
              <span className={styles.optionText}>{option}</span>
            </label>
          );
        })}
      </div>
    );
  };

  const renderTextAnswer = (question, currentAnswer) => {
    const questionId = question.id;
    
    return (
      <div className={styles.textAnswerSection}>
        <textarea
          className={styles.answerTextarea}
          rows={4}
          placeholder="Enter your answer here..."
          value={currentAnswer || ''}
          onChange={(e) => updateAnswer(questionId, e.target.value)}
          maxLength={question.maxLength || undefined}
        />
        <div className={styles.answerInfo}>
          <span>Text Answer</span>
          <span>
            {(currentAnswer || '').length}
            {question.maxLength ? ` / ${question.maxLength}` : ''} characters
          </span>
        </div>
      </div>
    );
  };

  const renderEssayAnswer = (question, currentAnswer) => {
    const questionId = question.id;
    
    return (
      <div className={styles.textAnswerSection}>
        <textarea
          className={styles.answerTextarea}
          rows={8}
          placeholder="Enter your essay answer here..."
          value={currentAnswer || ''}
          onChange={(e) => updateAnswer(questionId, e.target.value)}
          maxLength={question.maxLength || undefined}
        />
        <div className={styles.answerInfo}>
          <span>Essay Answer</span>
          <span>
            {(currentAnswer || '').length}
            {question.maxLength ? ` / ${question.maxLength}` : ''} characters
          </span>
        </div>
      </div>
    );
  };

  // ====================================
  // QUESTION NAVIGATION COMPONENT
  // ====================================

  const QuestionNavigation = () => {
    const progress = getProgress();
    
    return (
      <div className={styles.questionNavigation}>
        <div className={styles.navigationHeader}>
          <h4>Question Navigator</h4>
          <button 
            onClick={() => setShowQuestionOverview(!showQuestionOverview)}
            className={styles.toggleOverviewButton}
          >
            {showQuestionOverview ? <Eye /> : <EyeOff />}
          </button>
        </div>
        
        {showQuestionOverview && (
          <div className={styles.questionGrid}>
            {shuffledQuestions.map((question, index) => {
              const status = getQuestionStatus(index);
              const isAnswered = answers.hasOwnProperty(question.id);
              const isFlagged = flaggedQuestions.has(index);
              
              return (
                <button
                  key={question.id}
                  onClick={() => goToQuestion(index)}
                  disabled={!exam?.allowNavigation && index !== currentQuestionIndex + 1 && index !== currentQuestionIndex - 1}
                  className={`${styles.questionNavButton} ${styles[status]} ${
                    isAnswered ? styles.answered : ''
                  } ${isFlagged ? styles.flagged : ''}`}
                >
                  {index + 1}
                  {isFlagged && <Flag className={styles.flagIcon} />}
                </button>
              );
            })}
          </div>
        )}
        
        <div className={styles.navigationStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{progress.answeredQuestions}</span>
            <span className={styles.statLabel}>Answered</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{flaggedQuestions.size}</span>
            <span className={styles.statLabel}>Flagged</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{progress.totalQuestions}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>
      </div>
    );
  };

  // ====================================
  // LOADING AND ERROR STATES
  // ====================================

  if (examLoading || !isInitialized) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner message="Loading exam..." />
      </div>
    );
  }

  if (examError) {
    return <ExamErrorComponent error={examError} onRetry={() => window.location.reload()} />;
  }

  if (!exam || !examInProgress) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.noExamMessage}>
          <AlertTriangle className={styles.warningIcon} />
          <h3>No Active Exam</h3>
          <p>No exam session found. Please return to the dashboard and start the exam again.</p>
          <button onClick={() => handleExitExam(false)} className={styles.returnButton}>
            <Home />
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ====================================
  // EXAM TAKING INTERFACE
  // ====================================

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress = getProgress();
  const questionStatus = getQuestionStatus(currentQuestionIndex);

  return (
    <div className={styles.examContainer}>
      <div className={styles.examInterface}>
        {/* Exam Header */}
        <div className={styles.examHeader}>
          <div className={styles.examHeaderLeft}>
            <button 
              onClick={() => handleExitExam()}
              className={styles.exitButton}
              disabled={examLoading}
            >
              <Home className={styles.exitIcon} />
              {examInProgress ? 'Save & Exit' : 'Exit'}
            </button>
            <div className={styles.examTitleSection}>
              <h3 className={styles.examTitle}>{exam.title}</h3>
              <div className={styles.examInfo}>
                <BookOpen className={styles.examIcon} />
                <span>{shuffledQuestions.length} Questions</span>
                <span>•</span>
                <Target className={styles.examIcon} />
                <span>{exam.totalPoints || 0} Points Total</span>
                {exam.duration && (
                  <>
                    <span>•</span>
                    <Timer className={styles.examIcon} />
                    <span>{exam.duration} Minutes</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className={styles.examHeaderRight}>
            {exam.showTimer && timeRemaining > 0 && (
              <div className={styles.timerDisplay}>
                <Timer className={styles.timerIcon} />
                <div className={styles.timerContent}>
                  <div className={`${styles.timerTime} ${timeRemaining < 300 ? styles.timerWarning : ''}`}>
                    {formatTime(timeRemaining)}
                  </div>
                  <div className={styles.timerLabel}>Time Remaining</div>
                </div>
              </div>
            )}
            
            {isFullscreen && exam.requireSafeBrowser && (
              <div className={styles.secureMode}>
                <Shield className={styles.secureIcon} />
                <span>Secure Mode</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressInfo}>
            <span>Progress: Question {currentQuestionIndex + 1} of {shuffledQuestions.length}</span>
            <span>{progress.answeredQuestions} / {progress.totalQuestions} answered ({progress.percentage}%)</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress.percentage}%` }}
            ></div>
            <div 
              className={styles.progressPosition}
              style={{ left: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Validation Warnings */}
        {validation.warnings.length > 0 && (
          <div className={styles.validationWarnings}>
            {validation.warnings.map((warning, index) => (
              <div key={index} className={styles.warningItem}>
                <AlertTriangle className={styles.warningIcon} />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}

        {examError && (
          <div className={styles.errorAlert}>
            <AlertTriangle className={styles.errorIcon} />
            <span>{examError}</span>
          </div>
        )}

        <div className={styles.examContent}>
          {/* Question Navigation Sidebar */}
          <div className={styles.examSidebar}>
            <QuestionNavigation />
            
            <div className={styles.examActions}>
              <button
                onClick={() => saveProgress(true)}
                className={styles.saveButton}
                disabled={examLoading}
              >
                <Save className={styles.saveIcon} />
                Save Progress
              </button>
              
              {exam.allowNavigation && (
                <button
                  onClick={() => setShowQuestionOverview(!showQuestionOverview)}
                  className={styles.overviewButton}
                >
                  <Grid3X3 className={styles.overviewIcon} />
                  {showQuestionOverview ? 'Hide' : 'Show'} Overview
                </button>
              )}
            </div>
            
            <div className={styles.autoSaveSection}>
              <label className={styles.autoSaveLabel}>
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                />
                Auto-save every 30 seconds
              </label>
            </div>
          </div>

          {/* Main Question Area */}
          <div className={styles.questionArea}>
            {currentQuestion && (
              <div className={styles.questionCard}>
                <div className={styles.questionHeader}>
                  <div className={styles.questionNumber}>
                    <div className={`${styles.questionNumberBadge} ${styles[questionStatus]}`}>
                      <span>{currentQuestionIndex + 1}</span>
                      {flaggedQuestions.has(currentQuestionIndex) && (
                        <Flag className={styles.flagIcon} />
                      )}
                    </div>
                    <div className={styles.questionTitle}>
                      <h4>Question {currentQuestionIndex + 1}</h4>
                      <span className={styles.questionType}>
                        <Brain className={styles.typeIcon} />
                        {currentQuestion.type}
                      </span>
                    </div>
                  </div>
                  <div className={styles.questionMeta}>
                    <span className={styles.questionPoints}>
                      <Star className={styles.pointsIcon} />
                      {currentQuestion.points} points
                    </span>
                    <button
                      onClick={() => flagQuestion(currentQuestionIndex)}
                      className={`${styles.flagButton} ${
                        flaggedQuestions.has(currentQuestionIndex) ? styles.flagged : ''
                      }`}
                    >
                      <Flag className={styles.flagIcon} />
                      {flaggedQuestions.has(currentQuestionIndex) ? 'Unflag' : 'Flag'}
                    </button>
                  </div>
                </div>
                
                <div className={styles.questionContent}>
                  <div className={styles.questionText}>
                    <p>{currentQuestion.question}</p>
                    {currentQuestion.required && (
                      <span className={styles.requiredIndicator}>* Required</span>
                    )}
                  </div>

                  <div className={styles.answerSection}>
                    {renderQuestionAnswer(currentQuestion, currentQuestionIndex)}
                  </div>

                  {answers[currentQuestion.id] && (
                    <div className={styles.answerActions}>
                      <button
                        onClick={() => clearAnswer(currentQuestion.id)}
                        className={styles.clearButton}
                      >
                        <XCircle className={styles.clearIcon} />
                        Clear Answer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className={styles.questionNavigationControls}>
              <div className={styles.navigationButtons}>
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0 || (!exam?.allowNavigation && true)}
                  className={styles.navButton}
                >
                  <ChevronLeft className={styles.navIcon} />
                  Previous
                </button>
                
                <div className={styles.questionIndicator}>
                  <span>{currentQuestionIndex + 1} of {shuffledQuestions.length}</span>
                </div>
                
                {currentQuestionIndex < shuffledQuestions.length - 1 ? (
                  <button
                    onClick={goToNextQuestion}
                    disabled={!exam?.allowNavigation && false}
                    className={styles.navButton}
                  >
                    Next
                    <ChevronRight className={styles.navIcon} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    disabled={examLoading}
                    className={`${styles.navButton} ${styles.submitButton} ${
                      validation.canSubmit ? styles.canSubmit : styles.cannotSubmit
                    }`}
                  >
                    <Zap className={styles.navIcon} />
                    Submit Exam
                  </button>
                )}
              </div>
            </div>

            {/* Submit Section */}
            <div className={styles.submitSection}>
              <div className={styles.submitContent}>
                <div className={styles.submitInfo}>
                  <h4>Ready to submit?</h4>
                  <p>
                    Make sure you've answered all questions. You cannot change your answers after submission.
                  </p>
                  {!validation.requiredQuestionsAnswered && (
                    <div className={styles.submitWarning}>
                      <AlertTriangle className={styles.warningIcon} />
                      Some required questions are not answered
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSubmitExam}
                  className={`${styles.finalSubmitButton} ${
                    validation.canSubmit ? styles.enabled : styles.disabled
                  }`}
                  disabled={examLoading}
                >
                  {examLoading ? (
                    <>
                      <Coffee className={styles.loadingIcon} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Award className={styles.submitIcon} />
                      Submit Final Answers
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResultsModal && examResults && (
        <ExamResultsModal 
          examResults={examResults}
          exam={exam}
          detailedResults={getDetailedResults()}
          onClose={handleResultsClose}
        />
      )}
    </div>
  );
}