import React, { useState, useEffect } from 'react';

import styles from '../../../CSS/Components/student/ExamsTab.module.css';

import { 
  GraduationCap, 
  Calendar, 
  Timer,
  Target,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Save,
  Flag,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Grid3X3,
  Award,
  TrendingUp,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  Users,
  Star,
  Zap,
  Shield,
  Coffee,
  Brain,
  Send,
  RotateCcw,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

import { 
  useExams, 
  useExamAttempt, 
  useExamHistory, 
  useExamValidation 
} from '../../../Hooks/useStudentAssignmentDashboard';
import LoadingSpinner from '../../Pages/Global/Loading';
import ErrorMessage from '../../Pages/Errors/404';

export default function ExamsTab({ selectedCourse, setSelectedCourse, studentId, courses, exams: propsExams }) {
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [showExamInterface, setShowExamInterface] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedResultsId, setSelectedResultsId] = useState(null);
  const [showQuestionOverview, setShowQuestionOverview] = useState(false);

  console.log('🎯 ExamsTab Debug:', {
    selectedCourse,
    studentId,
    coursesCount: courses?.length,
    propsExams: propsExams?.length
  });

  // FIXED: Use hooks for data fetching with proper courseId
  const { exams: hookExams, loading, error, refetch } = useExams(selectedCourse);
  
  // FIXED: Use props exams if available, otherwise use hook exams
  const exams = propsExams && propsExams.length > 0 ? propsExams : hookExams;

  console.log('📋 Final exams data:', {
    usingProps: !!(propsExams && propsExams.length > 0),
    examsCount: exams?.length,
    exams: exams
  });
  
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
    shuffledOptions, // This is now the proper shuffledOptionsMap
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

  // Exam history hook
  const { history } = useExamHistory(selectedExamId, studentId);

  const selectedExam = exams?.find(exam => exam.id === selectedExamId);

  // ====================================
  // EXAM LIFECYCLE HANDLERS
  // ====================================

  const handleStartExam = async (examId) => {
    try {
      setSelectedExamId(examId);
      setExamError(null);
      await startExam(examId);
      setShowExamInterface(true);
    } catch (err) {
      console.error('Failed to start exam:', err);
      alert('Failed to start exam: ' + err.message);
      setSelectedExamId(null);
    }
  };

  const handleSubmitExam = async () => {
    if (!validation.requiredQuestionsAnswered) {
      if (!window.confirm('Some required questions are not answered. Are you sure you want to submit?')) {
        return;
      }
    }

    if (!window.confirm('Are you sure you want to submit your exam? You cannot change your answers after submission.')) {
      return;
    }

    try {
      const result = await submitExam();
      setShowExamInterface(false);
      setSelectedExamId(null);
      refetch(); // Refresh exams list
      
      // Show results immediately if exam allows it
      if (exam.showResults && result?.graded) {
        setSelectedResultsId(result.responseId);
        setShowResultsModal(true);
      } else {
        alert('Exam submitted successfully! Results will be available once graded.');
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

  const handleExitExam = () => {
    if (examInProgress) {
      if (window.confirm('Are you sure you want to exit? Your progress will be saved but you\'ll need to resume later.')) {
        saveProgress(true);
        setShowExamInterface(false);
        setSelectedExamId(null);
      }
    } else {
      setShowExamInterface(false);
      setSelectedExamId(null);
    }
  };

  const handleViewResults = async (responseId) => {
    try {
      setSelectedResultsId(responseId);
      setShowResultsModal(true);
    } catch (err) {
      console.error('Failed to view results:', err);
      alert('Failed to load results: ' + err.message);
    }
  };

  // ====================================
  // EXAM STATUS FUNCTIONS
  // ====================================

  const getExamStatus = (exam) => {
    // Use the status provided by the backend since it already handles all the logic
    if (exam.status) {
      // Backend provides: 'upcoming', 'available', 'expired'
      return exam.status;
    }

    // Fallback logic if status is not provided by backend
    const now = new Date();
    const startTime = new Date(exam.startTime);
    const endTime = new Date(exam.endTime);
    
    // Check if exam has been taken/completed
    if (exam.latestAttempt && exam.latestAttempt.status === 'SUBMITTED') {
      return 'completed';
    }
    
    // Check time window
    if (now < startTime) {
      return 'upcoming';
    } else if (now > endTime) {
      return 'expired';
    } else {
      return 'available';
    }
  };

  const isExamAvailable = (exam) => {
    const status = getExamStatus(exam);
    return status === 'available';
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return '✓ Completed';
      case 'available': return '● Available Now';
      case 'upcoming': return '○ Upcoming';
      case 'expired': return '✗ Expired';
      default: return '○ Unavailable';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return styles.statusBarCompleted;
      case 'available': return styles.statusBarActive;
      case 'upcoming': return styles.statusBarUpcoming;
      case 'expired': return styles.statusBarExpired;
      default: return styles.statusBarDefault;
    }
  };

  // ====================================
  // FIXED ANSWER RENDERING FUNCTIONS - PROPER SHUFFLED OPTIONS HANDLING
  // ====================================

  const renderQuestionAnswer = (question, questionIndex) => {
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
    
    // FIXED: Use proper shuffled options mapping
    const mapping = shuffledOptions[questionId];
    const options = mapping ? mapping.shuffledOptions : (question.options || []);
    
    console.log(`🔀 Rendering question ${questionId}:`, {
      hasMapping: !!mapping,
      originalOptions: question.options,
      shuffledOptions: mapping?.shuffledOptions,
      currentAnswer
    });
    
    // Always show all options with proper scrolling
    const optionCount = options.length;
    const hasLongContent = options.some(option => option.length > 100);
    const shouldUseGrid = optionCount <= 4 && !hasLongContent;
    const needsScroll = optionCount > 6 || hasLongContent;
    
    // Determine container classes for better display
    let containerClasses = [styles.optionsContainer];
    
    if (shouldUseGrid) {
      containerClasses.push(styles.gridLayout);
    } else if (needsScroll) {
      containerClasses.push(styles.scrollableLayout);
    } else {
      containerClasses.push(styles.standardLayout);
    }
    
    return (
      <div className={containerClasses.join(' ')}>
        <div className={styles.optionsWrapper}>
          {options.map((option, shuffledIndex) => {
            // FIXED: Always store shuffled index for consistency
            const isSelected = currentAnswer === shuffledIndex;
            
            return (
              <label 
                key={shuffledIndex} 
                className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    updateAnswer(questionId, shuffledIndex);
                  }
                }}
              >
                <input
                  type="radio"
                  name={`question-${questionId}`}
                  value={shuffledIndex}
                  checked={isSelected}
                  onChange={(e) => {
                    const selectedIndex = parseInt(e.target.value);
                    console.log(`✏️ Selected option ${selectedIndex} for question ${questionId}`);
                    updateAnswer(questionId, selectedIndex);
                  }}
                  className={styles.optionRadio}
                  aria-label={`Option ${String.fromCharCode(65 + shuffledIndex)}: ${option}`}
                />
                <div className={styles.optionContent}>
                  <div className={styles.optionLetter}>
                    {String.fromCharCode(65 + shuffledIndex)}
                  </div>
                  <span className={styles.optionText}>{option}</span>
                </div>
              </label>
            );
          })}
        </div>
        {needsScroll && (
          <div className={styles.scrollIndicator}>
            {optionCount} options available - scroll to see all
          </div>
        )}
      </div>
    );
  };

  const renderTrueFalse = (question, currentAnswer) => {
    const questionId = question.id;
    
    return (
      <div className={`${styles.optionsContainer} ${styles.trueFalseLayout}`}>
        <div className={styles.optionsWrapper}>
          {['True', 'False'].map((option, optionIndex) => {
            const optionValue = option.toLowerCase();
            const isSelected = currentAnswer === optionValue || currentAnswer === option;
            
            return (
              <label 
                key={optionIndex} 
                className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    updateAnswer(questionId, optionValue);
                  }
                }}
              >
                <input
                  type="radio"
                  name={`question-${questionId}`}
                  value={optionValue}
                  checked={isSelected}
                  onChange={(e) => updateAnswer(questionId, e.target.value)}
                  className={styles.optionRadio}
                  aria-label={`${option} option`}
                />
                <div className={styles.optionContent}>
                  <div className={styles.optionLetter}>
                    {option === 'True' ? 'T' : 'F'}
                  </div>
                  <span className={styles.optionText}>{option}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTextAnswer = (question, currentAnswer) => {
    const questionId = question.id;
    
    return (
      <div className={styles.textAnswerContainer}>
        <textarea
          className={styles.textAreaInput}
          rows={4}
          placeholder="Type your answer here..."
          value={currentAnswer || ''}
          onChange={(e) => updateAnswer(questionId, e.target.value)}
          maxLength={question.maxLength || undefined}
          aria-label="Text answer input"
        />
        <div className={styles.textAreaFooter}>
          <span className={styles.answerType}>Short Answer</span>
          <span className={styles.characterCount}>
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
      <div className={styles.textAnswerContainer}>
        <textarea
          className={`${styles.textAreaInput} ${styles.essayInput}`}
          rows={10}
          placeholder="Write your essay answer here..."
          value={currentAnswer || ''}
          onChange={(e) => updateAnswer(questionId, e.target.value)}
          maxLength={question.maxLength || undefined}
          aria-label="Essay answer input"
        />
        <div className={styles.textAreaFooter}>
          <span className={styles.answerType}>Essay Answer</span>
          <span className={styles.characterCount}>
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
      <div className={styles.questionNavPanel}>
        <div className={styles.navPanelHeader}>
          <h4 className={styles.navPanelTitle}>
            <Grid3X3 className={styles.navTitleIcon} />
            Question Navigator
          </h4>
          <button 
            onClick={() => setShowQuestionOverview(!showQuestionOverview)}
            className={styles.toggleOverviewBtn}
            title={showQuestionOverview ? "Hide overview" : "Show overview"}
          >
            {showQuestionOverview ? <EyeOff /> : <Eye />}
          </button>
        </div>
        
        {showQuestionOverview && (
          <div className={styles.questionGridContainer}>
            <div className={styles.questionGrid}>
              {shuffledQuestions.map((question, index) => {
                const status = getQuestionStatus(index);
                // FIXED: Properly check if question is answered including index 0
                const answer = answers[question.id];
                const isAnswered = answer !== undefined && answer !== null && answer !== '';
                const isFlagged = flaggedQuestions.has(index);
                const isCurrent = index === currentQuestionIndex;
                
                return (
                  <button
                    key={question.id}
                    onClick={() => goToQuestion(index)}
                    disabled={!exam?.allowNavigation && index !== currentQuestionIndex}
                    className={`${styles.questionNavBtn} ${
                      isCurrent ? styles.currentQuestion : ''
                    } ${isAnswered ? styles.answeredQuestion : ''} ${
                      isFlagged ? styles.flaggedQuestion : ''
                    }`}
                    title={`Question ${index + 1}${isAnswered ? ' (Answered)' : ''}${isFlagged ? ' (Flagged)' : ''}`}
                  >
                    <span className={styles.questionNumber}>{index + 1}</span>
                    {isFlagged && <Flag className={styles.questionFlag} />}
                    {isAnswered && <CheckCircle className={styles.questionCheck} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        <div className={styles.progressStats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{progress.answeredQuestions}</div>
            <div className={styles.statLabel}>Answered</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{flaggedQuestions.size}</div>
            <div className={styles.statLabel}>Flagged</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{progress.totalQuestions}</div>
            <div className={styles.statLabel}>Total</div>
          </div>
        </div>
      </div>
    );
  };

  // ====================================
  // FIXED RESULTS MODAL - PROPER SHUFFLED OPTIONS HANDLING
  // ====================================

  const ResultsModal = () => {
    const detailedResults = getDetailedResults();
    
    if (!detailedResults || !showResultsModal) return null;

    // FIXED: Helper function to get display answer for shuffled options
    const getDisplayAnswer = (question, studentAnswer, questionResults) => {
      console.log('🔍 Getting display answer for question:', question.id, 'Answer:', studentAnswer);
      
      if (question.type === 'multiple-choice') {
        // Check if options were shuffled for this question during the exam
        const shuffleData = shuffledOptions[question.id];
        
        if (shuffleData && shuffleData.shuffledOptions) {
          console.log('🔀 Options were shuffled, using shuffled data');
          // Options were shuffled - get the display text from shuffled options
          if (typeof studentAnswer === 'number') {
            // Student answer is an index into shuffled options
            const displayText = shuffleData.shuffledOptions[studentAnswer];
            console.log('📝 Shuffled answer display:', displayText);
            return displayText || 'No answer';
          } else if (typeof studentAnswer === 'string') {
            // Student answer is already the text
            return studentAnswer;
          }
        } else {
          console.log('📋 Options were not shuffled, using original');
          // Options were not shuffled - use original options
          if (typeof studentAnswer === 'number') {
            const displayText = question.options?.[studentAnswer];
            console.log('📝 Original answer display:', displayText);
            return displayText || 'No answer';
          } else if (typeof studentAnswer === 'string') {
            return studentAnswer;
          }
        }
      }
      
      // For non-multiple choice questions, return as is
      return studentAnswer || 'No answer';
    };

    // FIXED: Helper function to get correct answer display for shuffled options
    const getCorrectAnswerDisplay = (question, questionResult) => {
      console.log('✅ Getting correct answer for question:', question.id, 'Type:', question.type, 'Result:', questionResult);
      
      // First try to get correct answer from the question result (backend response)
      if (questionResult && questionResult.correctAnswer) {
        console.log('✅ Using correct answer from result:', questionResult.correctAnswer);
        return questionResult.correctAnswer;
      }
      
      // Then try to get from the original question data
      if (question.type === 'multiple-choice') {
        // Always show the original correct answer text, regardless of shuffling
        if (question.correctAnswerIndex !== undefined && question.options) {
          const correctAnswer = question.options[question.correctAnswerIndex];
          console.log('✅ Correct answer from question options:', correctAnswer);
          return correctAnswer;
        } else if (question.correctAnswer) {
          console.log('✅ Correct answer from question.correctAnswer:', question.correctAnswer);
          return question.correctAnswer;
        }
      } else if (question.type === 'true-false') {
        if (question.correctAnswer) {
          console.log('✅ True/False correct answer:', question.correctAnswer);
          return question.correctAnswer;
        }
      } else if (question.type === 'short-answer' || question.type === 'text' || question.type === 'essay') {
        // For text questions, check multiple possible sources
        if (question.acceptableAnswers && question.acceptableAnswers.length > 0) {
          console.log('✅ Using first acceptable answer:', question.acceptableAnswers[0]);
          return question.acceptableAnswers[0];
        } else if (question.correctAnswer) {
          console.log('✅ Using question correct answer:', question.correctAnswer);
          return question.correctAnswer;
        } else {
          console.log('✅ Multiple answers accepted for text question');
          return 'Multiple answers accepted';
        }
      }
      
      // If no correct answer found, check if this question type should show answers
      console.log('⚠️ No correct answer available for question type:', question.type);
      return 'Answer not disclosed';
    };

    // FIXED: Helper function to determine if answer is correct with shuffling
    const isAnswerCorrect = (question, studentAnswer, questionResult) => {
      console.log('🎯 Checking if answer is correct:', {
        questionId: question.id,
        studentAnswer,
        hasResult: !!questionResult
      });
      
      // If backend provides correctness, use that first
      if (questionResult && questionResult.isCorrect !== undefined) {
        console.log('✅ Using backend correctness:', questionResult.isCorrect);
        return questionResult.isCorrect;
      }

      if (question.type === 'multiple-choice') {
        const shuffleData = shuffledOptions[question.id];
        
        if (shuffleData && shuffleData.indexMapping) {
          console.log('🔀 Checking shuffled answer correctness');
          // Options were shuffled - convert back to original index
          if (typeof studentAnswer === 'number') {
            const originalIndex = shuffleData.indexMapping[studentAnswer];
            const isCorrect = originalIndex === question.correctAnswerIndex;
            console.log('🔀 Shuffled correctness check:', {
              shuffledIndex: studentAnswer,
              originalIndex,
              correctIndex: question.correctAnswerIndex,
              isCorrect
            });
            return isCorrect;
          }
        } else {
          console.log('📋 Checking original answer correctness');
          // Options were not shuffled
          if (typeof studentAnswer === 'number') {
            const isCorrect = studentAnswer === question.correctAnswerIndex;
            console.log('📋 Original correctness check:', isCorrect);
            return isCorrect;
          }
        }
      } else if (question.type === 'true-false') {
        const isCorrect = studentAnswer?.toLowerCase() === question.correctAnswer?.toLowerCase();
        console.log('✅ True/False correctness:', isCorrect);
        return isCorrect;
      }
      
      // For other types, assume correct if there's a score > 0
      const hasPoints = (questionResult?.earnedPoints || questionResult?.points || 0) > 0;
      console.log('📊 Points-based correctness:', hasPoints);
      return hasPoints;
    };
    
    return (
      <div className={styles.resultsOverlay}>
        <div className={styles.resultsModal}>
          <div className={styles.resultsHeader}>
            <h3>Exam Results</h3>
            <button 
              onClick={() => setShowResultsModal(false)}
              className={styles.closeButton}
            >
              <XCircle />
            </button>
          </div>
          
          <div className={styles.resultsContent}>
            <div className={styles.overallScore}>
              <div className={styles.scoreDisplay}>
                <span className={styles.scoreNumber}>{detailedResults.totalScore || 0}</span>
                <span className={styles.scoreTotal}>/ {detailedResults.maxScore || 0}</span>
              </div>
              <div className={styles.scorePercentage}>
                {Math.round(detailedResults.percentage || 0)}%
              </div>
              <div className={`${styles.passStatus} ${detailedResults.passed ? styles.passed : styles.failed}`}>
                {detailedResults.passed ? '✓ Passed' : '✗ Failed'}
              </div>
              
              {/* ENHANCED: Show letter grade if available */}
              {detailedResults.letterGrade && (
                <div className={styles.letterGrade}>
                  Grade: {detailedResults.letterGrade}
                </div>
              )}
              
              {/* ENHANCED: Show completion time */}
              {detailedResults.timeSpent && (
                <div className={styles.timeSpentDisplay}>
                  <Clock className={styles.timeIcon} />
                  Time Spent: {Math.floor(detailedResults.timeSpent / 60)}m {detailedResults.timeSpent % 60}s
                </div>
              )}
            </div>
            
            <div className={styles.questionResults}>
              <h4>Question Breakdown</h4>
              {detailedResults.questionResults && detailedResults.questionResults.map((result, index) => {
                const question = result.question || shuffledQuestions[index];
                const studentAnswer = result.studentAnswer;
                const isCorrect = isAnswerCorrect(question, studentAnswer, result);
                
                return (
                  <div key={index} className={styles.questionResult}>
                    <div className={styles.questionResultHeader}>
                      <span className={styles.questionNumber}>Q{index + 1}</span>
                      <span className={styles.questionPoints}>
                        {result.earnedPoints || result.points || 0}/{result.maxPoints || result.points || 0} pts
                      </span>
                      <span className={`${styles.questionStatus} ${isCorrect ? styles.correct : styles.incorrect}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className={styles.questionText}>
                      {question?.question || 'Question text not available'}
                    </div>
                    <div className={styles.answerComparison}>
                      <div className={styles.studentAnswer}>
                        <strong>Your Answer:</strong> {getDisplayAnswer(question, studentAnswer, result)}
                      </div>
                      {exam.showResults && (
                        <div className={styles.correctAnswer}>
                          <strong>Correct Answer:</strong> {getCorrectAnswerDisplay(question, result)}
                        </div>
                      )}
                      {result.feedback && (
                        <div className={styles.questionFeedback}>
                          <strong>Feedback:</strong> {result.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* ENHANCED: Show overall feedback */}
            {detailedResults.overallFeedback && (
              <div className={styles.overallFeedback}>
                <h4>Overall Feedback</h4>
                <p>{detailedResults.overallFeedback}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ====================================
  // LOADING AND ERROR STATES
  // ====================================

  // FIXED: Show loading only if we're actually loading and don't have data
  if (loading && (!exams || exams.length === 0)) {
    return (
      <div className={styles.container}>
        <LoadingSpinner message="Loading exams..." />
      </div>
    );
  }

  if (error && (!exams || exams.length === 0)) {
    return (
      <div className={styles.container}>
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  // ====================================
  // ENHANCED EXAM TAKING INTERFACE
  // ====================================

  if (showExamInterface && exam && (examInProgress || examSubmitted)) {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const progress = getProgress();
    const questionStatus = getQuestionStatus(currentQuestionIndex);

    return (
      <div className={styles.examInterface}>
        {/* Fixed Header */}
        <div className={styles.examHeader}>
          <div className={styles.examHeaderLeft}>
            <button 
              onClick={handleExitExam}
              className={styles.exitBtn}
              disabled={examLoading}
            >
              <ArrowLeft className={styles.exitIcon} />
              Exit Exam
            </button>
            <div className={styles.examTitle}>
              <h2>{exam.title}</h2>
              <div className={styles.examMeta}>
                <span className={styles.questionCounter}>
                  Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
                </span>
                <span className={styles.examPoints}>
                  {exam.totalPoints || 0} total points
                </span>
              </div>
            </div>
          </div>
          
          <div className={styles.examHeaderRight}>
            {exam.showTimer && timeRemaining > 0 && (
              <div className={`${styles.timerCard} ${timeRemaining < 300 ? styles.timerWarning : ''}`}>
                <Timer className={styles.timerIcon} />
                <div className={styles.timerContent}>
                  <div className={styles.timerTime}>{formatTime(timeRemaining)}</div>
                  <div className={styles.timerLabel}>Remaining</div>
                </div>
              </div>
            )}
            
            <button
              onClick={() => saveProgress(true)}
              className={styles.saveBtn}
              disabled={examLoading}
              title="Save progress"
            >
              <Save className={styles.saveIcon} />
              Save
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress.percentage}%` }}
            />
            <div 
              className={styles.progressIndicator}
              style={{ left: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%` }}
            />
          </div>
          <div className={styles.progressText}>
            {progress.answeredQuestions} of {progress.totalQuestions} answered ({progress.percentage}%)
          </div>
        </div>

        {/* Validation Messages */}
        {validation.warnings.length > 0 && (
          <div className={styles.warningBanner}>
            <AlertTriangle className={styles.warningIcon} />
            <div className={styles.warningContent}>
              {validation.warnings.map((warning, index) => (
                <div key={index}>{warning}</div>
              ))}
            </div>
          </div>
        )}

        {examError && (
          <div className={styles.errorBanner}>
            <AlertCircle className={styles.errorIcon} />
            <span>{examError}</span>
          </div>
        )}

        {/* Main Content */}
        <div className={styles.examContent}>
          {/* Sidebar */}
          <div className={styles.examSidebar}>
            <QuestionNavigation />
            
            <div className={styles.sidebarActions}>
              <label className={styles.autoSaveToggle}>
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                />
                <span className={styles.toggleSlider}></span>
                <span className={styles.toggleLabel}>Auto-save</span>
              </label>
            </div>
          </div>

          {/* Question Content */}
          <div className={styles.questionContent}>
            {currentQuestion && (
              <>
                <div className={styles.questionCard}>
                  <div className={styles.questionHeader}>
                    <div className={styles.questionInfo}>
                      <div className={styles.questionBadge}>
                        <Brain className={styles.questionIcon} />
                        <span>Question {currentQuestionIndex + 1}</span>
                      </div>
                      <div className={styles.questionType}>
                        {currentQuestion.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div className={styles.questionPoints}>
                        <Star className={styles.pointsIcon} />
                        {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
                      </div>
                    </div>
                    <div className={styles.questionActions}>
                      <button
                        onClick={() => flagQuestion(currentQuestionIndex)}
                        className={`${styles.flagBtn} ${
                          flaggedQuestions.has(currentQuestionIndex) ? styles.flagged : ''
                        }`}
                        title={flaggedQuestions.has(currentQuestionIndex) ? 'Remove flag' : 'Flag for review'}
                      >
                        <Flag className={styles.flagIcon} />
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.questionBody}>
                    <div className={styles.questionText}>
                      <p>{currentQuestion.question}</p>
                      {currentQuestion.required && (
                        <span className={styles.requiredMark}>* Required</span>
                      )}
                    </div>

                    <div className={styles.answerSection}>
                      {renderQuestionAnswer(currentQuestion, currentQuestionIndex)}
                    </div>

                    {(answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== null && answers[currentQuestion.id] !== '') && (
                      <div className={styles.answerActions}>
                        <button
                          onClick={() => clearAnswer(currentQuestion.id)}
                          className={styles.clearBtn}
                          title="Clear this answer"
                        >
                          <RotateCcw className={styles.clearIcon} />
                          Clear Answer
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className={styles.navigationControls}>
                  <button
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0 || (!exam?.allowNavigation && true)}
                    className={styles.navBtn}
                  >
                    <ChevronLeft className={styles.navIcon} />
                    Previous
                  </button>
                  
                  <div className={styles.questionIndicator}>
                    <span>{currentQuestionIndex + 1} / {shuffledQuestions.length}</span>
                  </div>
                  
                  <button
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex >= shuffledQuestions.length - 1 || (!exam?.allowNavigation && false)}
                    className={styles.navBtn}
                  >
                    Next
                    <ChevronRight className={styles.navIcon} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Fixed Footer with Submit Button */}
        <div className={styles.examFooter}>
          <div className={styles.footerContent}>
            <div className={styles.footerInfo}>
              <div className={styles.submitWarnings}>
                {!validation.requiredQuestionsAnswered && (
                  <div className={styles.warningText}>
                    <AlertTriangle className={styles.warningIcon} />
                    Some required questions are not answered
                  </div>
                )}
                {flaggedQuestions.size > 0 && (
                  <div className={styles.infoText}>
                    <Flag className={styles.infoIcon} />
                    {flaggedQuestions.size} question{flaggedQuestions.size !== 1 ? 's' : ''} flagged for review
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={handleSubmitExam}
              className={`${styles.submitExamBtn} ${
                validation.canSubmit ? styles.canSubmit : styles.cannotSubmit
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
                  <Send className={styles.submitIcon} />
                  Submit Exam
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====================================
  // ROBUST GRADE DISPLAY FUNCTIONS - HANDLES ANY BACKEND FORMAT
  // ====================================

  const renderGradeDisplay = (exam, latestAttempt) => {
    // ROBUST: Check if graded using multiple possible field names and conditions
    const isGraded = latestAttempt.graded === true || 
                     latestAttempt.status === 'GRADED' ||
                     latestAttempt.grade !== null ||
                     latestAttempt.score !== null ||
                     latestAttempt.totalScore !== null ||
                     latestAttempt.percentage !== null;
    
    // ROBUST: Get score using all possible field names from your backend
    const score = latestAttempt.totalScore || 
                 latestAttempt.score || 
                 latestAttempt.points ||
                 latestAttempt.grade;
    
    const maxScore = latestAttempt.maxScore || 
                    latestAttempt.totalPoints ||
                    exam.totalPoints || 
                    100;
    
    // ROBUST: Calculate or get percentage
    const percentage = latestAttempt.percentage || 
                      latestAttempt.percentageScore ||
                      (score !== null && score !== undefined && maxScore ? Math.round((score / maxScore) * 100) : null);
    
    // ROBUST: Check if passed using multiple fields
    const passed = latestAttempt.passed || 
                  latestAttempt.isPassed ||
                  (percentage !== null ? percentage >= (exam.passPercentage || exam.passingScore || 60) : null);

    // ROBUST: Get letter grade from multiple possible fields
    const letterGrade = latestAttempt.letterGrade || 
                       latestAttempt.grade_letter ||
                       latestAttempt.finalGrade;

    // CASE 1: Graded with numerical score
    if (isGraded && score !== null && score !== undefined) {
      return (
        <>
          <div className={styles.gradeNumber}>
            {score}
          </div>
          <div className={styles.gradeTotal}>/ {maxScore} points</div>
          {percentage !== null && percentage !== undefined && (
            <div className={styles.gradePercentage}>
              {Math.round(percentage)}%
            </div>
          )}
          {letterGrade && (
            <div className={styles.letterGradeDisplay}>
              Grade: {letterGrade}
            </div>
          )}
          {passed !== null && passed !== undefined && (
            <div className={`${styles.passFailStatus} ${passed ? styles.passed : styles.failed}`}>
              {passed ? '✓ Passed' : '✗ Failed'}
            </div>
          )}
        </>
      );
    } 
    // CASE 2: Graded but no numerical score (letter grade only or percentage only)
    else if (isGraded && (letterGrade || percentage !== null)) {
      return (
        <>
          <div className={styles.gradeNumber}>
            {letterGrade || `${Math.round(percentage)}%`}
          </div>
          {percentage !== null && percentage !== undefined && !letterGrade && (
            <div className={styles.gradePercentage}>
              Score
            </div>
          )}
          {letterGrade && percentage !== null && percentage !== undefined && (
            <div className={styles.gradePercentage}>
              {Math.round(percentage)}%
            </div>
          )}
          {passed !== null && passed !== undefined && (
            <div className={`${styles.passFailStatus} ${passed ? styles.passed : styles.failed}`}>
              {passed ? '✓ Passed' : '✗ Failed'}
            </div>
          )}
        </>
      );
    }
    // CASE 3: Submitted but not graded yet
    else {
      return (
        <>
          <div className={styles.gradeNumber}>
            Submitted
          </div>
          <div className={styles.gradeStatus}>
            <Clock className={styles.waitingIcon} />
            Waiting for Grading
          </div>
          <div className={styles.submissionDate}>
            {new Date(latestAttempt.submittedAt || latestAttempt.dateSubmitted).toLocaleDateString()}
          </div>
        </>
      );
    }
  };

  // ====================================
  // MAIN EXAMS LIST VIEW - ENHANCED WITH BETTER GRADE DISPLAY
  // ====================================

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Online Exams</h2>
          <p className={styles.subtitle}>Take your exams and view results</p>
        </div>
        <div className={styles.controls}>
          <select 
            className={styles.courseSelect}
            value={selectedCourse || ''}
            onChange={(e) => setSelectedCourse(e.target.value ? e.target.value : null)}
          >
            <option value="">All Courses</option>
            {courses?.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
          
        </div>
      </div>

      

      <div className={styles.examsList}>
        {!exams || exams.length === 0 ? (
          <div className={styles.emptyState}>
            <GraduationCap className={styles.emptyIcon} />
            <h3>No exams found</h3>
            <p>
              {selectedCourse 
                ? 'There are no exams available for the selected course.' 
                : 'There are no exams available. Try selecting a specific course or check if you\'re enrolled in any courses.'
              }
            </p>
            {!studentId && (
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
          exams.map(exam => {
            const status = getExamStatus(exam);
            const course = courses?.find(c => c.id === exam.courseId);
            const examDate = new Date(exam.startTime);
            const endDate = new Date(exam.endTime);
            
            // Check if exam can be taken - use backend information
            const canTakeExam = exam.canTakeExam !== undefined ? exam.canTakeExam : (status === 'available');
            const hasActiveAttempt = exam.hasActiveAttempt || false;
            const attemptCount = exam.attemptCount || 0;
            const maxAttempts = exam.maxAttempts || 1;
            
            return (
              <div key={exam.id} className={styles.examCard}>
                <div className={getStatusColor(status)} />
                
                <div className={styles.cardContent}>
                  <div className={styles.cardMain}>
                    <div className={styles.cardHeader}>
                      <div className={`${styles.iconContainer} ${styles[`icon${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}>
                        <GraduationCap className={styles.examIcon} />
                      </div>
                      <div className={styles.examDetails}>
                        <h3 className={styles.examCardTitle}>
                          {exam.title}
                        </h3>
                        <div className={styles.badges}>
                          <span className={styles.courseBadge}>
                            <Users className={styles.badgeIcon} />
                            {course?.name || 'Unknown Course'}
                          </span>
                          <span className={`${styles.statusBadge} ${styles[`statusBadge${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}>
                            {getStatusText(status)}
                          </span>
                          {exam.requireSafeBrowser && (
                            <span className={styles.secureBadge}>
                              <Shield className={styles.shieldIcon} />
                              Secure Browser Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailCard}>
                        <div className={styles.detailHeader}>
                          <Calendar className={styles.detailIcon} />
                          <div>
                            <p className={styles.detailLabel}>Start Date</p>
                            <p className={styles.detailValue}>{examDate.toLocaleDateString()}</p>
                            <p className={styles.detailSubValue}>{examDate.toLocaleTimeString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className={styles.detailCard}>
                        <div className={styles.detailHeader}>
                          <Timer className={styles.detailIcon} />
                          <div>
                            <p className={styles.detailLabel}>Duration</p>
                            <p className={styles.detailValue}>{exam.duration} min</p>
                          </div>
                        </div>
                      </div>
                      <div className={styles.detailCard}>
                        <div className={styles.detailHeader}>
                          <Target className={styles.detailIcon} />
                          <div>
                            <p className={styles.detailLabel}>Points</p>
                            <p className={styles.detailValue}>{exam.totalPoints || 0} pts</p>
                          </div>
                        </div>
                      </div>
                      <div className={styles.detailCard}>
                        <div className={styles.detailHeader}>
                          <FileText className={styles.detailIcon} />
                          <div>
                            <p className={styles.detailLabel}>Questions</p>
                            <p className={styles.detailValue}>{exam.questionCount || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Exam Configuration Info */}
                    <div className={styles.examConfig}>
                      <div className={styles.configItems}>
                        {exam.shuffleQuestions && (
                          <span className={styles.configItem}>🔀 Questions Shuffled</span>
                        )}
                        {exam.shuffleOptions && (
                          <span className={styles.configItem}>🎲 Options Shuffled</span>
                        )}
                        {!exam.allowNavigation && (
                          <span className={styles.configItem}>➡️ Linear Navigation</span>
                        )}
                        {exam.autoSubmit && (
                          <span className={styles.configItem}>⏰ Auto-Submit</span>
                        )}
                        {exam.showResults && (
                          <span className={styles.configItem}>📊 Instant Results</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.availabilityInfo}>
                      {status === 'available' ? (
                        <div className={styles.availableNow}>
                          <div className={styles.pulse}></div>
                          Available until {endDate.toLocaleDateString()} at {endDate.toLocaleTimeString()}
                        </div>
                      ) : status === 'completed' ? (
                        <div className={styles.completed}>
                          <CheckCircle className={styles.completedIcon} />
                          Completed on {examDate.toLocaleDateString()}
                        </div>
                      ) : status === 'upcoming' ? (
                        <div className={styles.scheduled}>
                          <Clock className={styles.scheduledIcon} />
                          Available from {examDate.toLocaleDateString()} at {examDate.toLocaleTimeString()}
                        </div>
                      ) : (
                        <div className={styles.expired}>
                          <AlertCircle className={styles.expiredIcon} />
                          Exam period has ended
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.actionPanel}>
                    {/* FIXED: Check for both SUBMITTED and GRADED status */}
                    {exam.latestAttempt && (exam.latestAttempt.status === 'SUBMITTED' || exam.latestAttempt.status === 'GRADED') ? (
                      <div className={styles.completedPanel}>
                        <div className={styles.completedIcon}>
                          <CheckCircle className={styles.completedCheckIcon} />
                        </div>
                        <div className={styles.gradeDisplay}>
                          {renderGradeDisplay(exam, exam.latestAttempt)}
                        </div>
                        
                        {/* ROBUST: Show View Results button with flexible ID detection */}
                        {(() => {
                          const latestAttempt = exam.latestAttempt;
                          
                          // ROBUST: Check if results are available using multiple conditions
                          const hasResults = exam.showResults && 
                                           latestAttempt && 
                                           (latestAttempt.graded === true || 
                                            latestAttempt.status === 'GRADED' ||
                                            latestAttempt.score !== null ||
                                            latestAttempt.totalScore !== null ||
                                            latestAttempt.percentage !== null);
                          
                          // ROBUST: Try multiple field names for response ID
                          const responseId = latestAttempt?.id || 
                                           latestAttempt?.responseId || 
                                           latestAttempt?.examResponseId;
                          
                          if (hasResults && responseId) {
                            return (
                              <button
                                onClick={() => handleViewResults(responseId)}
                                className={styles.viewResultsButton}
                              >
                                <Award className={styles.resultsIcon} />
                                View Results
                              </button>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    ) : (status === 'available' && canTakeExam) ? (
                      <div className={styles.availablePanel}>
                        <div className={styles.examIconContainer}>
                          <Play className={styles.examActionIcon} />
                        </div>
                        <button
                          onClick={() => handleStartExam(exam.id)}
                          className={styles.startExamButton}
                          disabled={examLoading || hasActiveAttempt}
                        >
                          {examLoading ? (
                            <>
                              <Coffee className={styles.loadingIcon} />
                              Starting...
                            </>
                          ) : hasActiveAttempt ? (
                            <>
                              <Clock className={styles.resumeIcon} />
                              Resume Exam
                            </>
                          ) : (
                            <>
                              <Zap className={styles.startIcon} />
                              Start Exam
                            </>
                          )}
                        </button>
                        <p className={styles.examHint}>
                          <Timer className={styles.hintIcon} />
                          {exam.duration} minutes • {exam.questionCount || 0} questions
                        </p>
                        {maxAttempts > 1 && (
                          <p className={styles.attemptsInfo}>
                            <TrendingUp className={styles.attemptsIcon} />
                            Attempt {attemptCount + 1} of {maxAttempts}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className={styles.scheduledPanel}>
                        <div className={styles.scheduledIconContainer}>
                          <Clock className={styles.scheduledActionIcon} />
                        </div>
                        <div className={styles.scheduledInfo}>
                          <p className={styles.scheduledTitle}>
                            {status === 'upcoming' ? 'Scheduled' : 
                             status === 'expired' ? 'Expired' : 'Unavailable'}
                          </p>
                          <p className={styles.scheduledDate}>{examDate.toLocaleDateString()}</p>
                          <p className={styles.scheduledTime}>{examDate.toLocaleTimeString()}</p>
                          {attemptCount >= maxAttempts && (
                            <p className={styles.maxAttemptsReached}>
                              Maximum attempts reached ({attemptCount}/{maxAttempts})
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Results Modal */}
      <ResultsModal />
    </div>
  );
}