import React, { useState, useEffect } from 'react';
import styles from '../../../CSS/Components/student/ExamResults.module.css';

import {
  XCircle,
  CheckCircle,
  AlertCircle,
  Award,
  Star,
  Clock,
  Target,
  Brain,
  TrendingUp,
  BarChart3,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';

import studentApi from '../../../Api/studentAssignmentDashboardApi';
import LoadingSpinner from '../../Pages/Global/Loading';

export default function ExamResultsModal({ responseId, examResults: propResults, exam: propExam, detailedResults: propDetailedResults, onClose }) {
  const [examResults, setExamResults] = useState(propResults);
  const [exam, setExam] = useState(propExam);
  const [detailedResults, setDetailedResults] = useState(propDetailedResults);
  const [loading, setLoading] = useState(!propResults);
  const [error, setError] = useState(null);
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);

  // Fetch results if not provided via props
  useEffect(() => {
    const fetchResults = async () => {
      if (propResults && propExam) {
        return; // Already have results
      }

      if (!responseId) {
        setError('No response ID provided');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const detailedResponse = await studentApi.getDetailedExamResponse(responseId);
        
        if (detailedResponse) {
          setExamResults(detailedResponse);
          
          // Create exam object from response data
          const examData = {
            id: detailedResponse.examId,
            title: detailedResponse.examTitle,
            totalPoints: detailedResponse.maxScore,
            passPercentage: detailedResponse.examPassPercentage,
            showResults: true
          };
          setExam(examData);

          // Process detailed results
          if (detailedResponse.questionScores && detailedResponse.answers) {
            const processed = processDetailedResults(detailedResponse);
            setDetailedResults(processed);
          }
        }
      } catch (err) {
        console.error('Failed to fetch exam results:', err);
        setError(err.message || 'Failed to load exam results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [responseId, propResults, propExam]);

  const processDetailedResults = (response) => {
    // This would process the response data into a format suitable for display
    // For now, we'll create a basic structure
    return {
      totalScore: response.totalScore || 0,
      maxScore: response.maxScore || 0,
      percentage: response.percentage || 0,
      passed: response.passed || false,
      timeSpent: response.timeSpent || 0,
      submittedAt: response.submittedAt,
      questionResults: [] // Would process individual questions if available
    };
  };

  const formatTime = (seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return styles.gradeA;
    if (percentage >= 80) return styles.gradeB;
    if (percentage >= 70) return styles.gradeC;
    if (percentage >= 60) return styles.gradeD;
    return styles.gradeF;
  };

  const getPassFailStatus = () => {
    if (!examResults || !exam) return null;
    
    const passed = examResults.percentage >= (exam.passPercentage || 60);
    return {
      passed,
      icon: passed ? CheckCircle : XCircle,
      text: passed ? 'Passed' : 'Failed',
      className: passed ? styles.passed : styles.failed
    };
  };

  if (loading) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <LoadingSpinner message="Loading exam results..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.errorState}>
            <AlertCircle className={styles.errorIcon} />
            <h3>Failed to Load Results</h3>
            <p>{error}</p>
            <button onClick={onClose} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!examResults || !exam) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.noResults}>
            <FileText className={styles.noResultsIcon} />
            <h3>No Results Available</h3>
            <p>Exam results are not available yet or could not be loaded.</p>
            <button onClick={onClose} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const passFailStatus = getPassFailStatus();

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <Award className={styles.headerIcon} />
            <div>
              <h2>Exam Results</h2>
              <p className={styles.examTitle}>{exam.title}</p>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <XCircle />
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* Overall Score Section */}
          <div className={styles.scoreSection}>
            <div className={styles.mainScore}>
              <div className={`${styles.scoreCircle} ${getGradeColor(examResults.percentage)}`}>
                <div className={styles.scorePercentage}>
                  {Math.round(examResults.percentage)}%
                </div>
                <div className={styles.scorePoints}>
                  {examResults.totalScore} / {examResults.maxScore}
                </div>
              </div>
              
              {passFailStatus && (
                <div className={`${styles.passFailBadge} ${passFailStatus.className}`}>
                  <passFailStatus.icon className={styles.passFailIcon} />
                  <span>{passFailStatus.text}</span>
                </div>
              )}
            </div>

            <div className={styles.scoreDetails}>
              <div className={styles.scoreItem}>
                <Target className={styles.scoreIcon} />
                <div>
                  <div className={styles.scoreLabel}>Total Points</div>
                  <div className={styles.scoreValue}>{examResults.totalScore} / {examResults.maxScore}</div>
                </div>
              </div>
              
              <div className={styles.scoreItem}>
                <BarChart3 className={styles.scoreIcon} />
                <div>
                  <div className={styles.scoreLabel}>Percentage</div>
                  <div className={styles.scoreValue}>{Math.round(examResults.percentage * 100) / 100}%</div>
                </div>
              </div>
              
              <div className={styles.scoreItem}>
                <Clock className={styles.scoreIcon} />
                <div>
                  <div className={styles.scoreLabel}>Time Spent</div>
                  <div className={styles.scoreValue}>{formatTime(examResults.timeSpent)}</div>
                </div>
              </div>
              
              <div className={styles.scoreItem}>
                <TrendingUp className={styles.scoreIcon} />
                <div>
                  <div className={styles.scoreLabel}>Required to Pass</div>
                  <div className={styles.scoreValue}>{exam.passPercentage || 60}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className={styles.performanceSection}>
            <h3>Performance Summary</h3>
            <div className={styles.performanceGrid}>
              <div className={styles.performanceCard}>
                <div className={styles.performanceIcon}>
                  <CheckCircle className={styles.successIcon} />
                </div>
                <div className={styles.performanceInfo}>
                  <div className={styles.performanceValue}>
                    {examResults.totalScore}
                  </div>
                  <div className={styles.performanceLabel}>Points Earned</div>
                </div>
              </div>
              
              <div className={styles.performanceCard}>
                <div className={styles.performanceIcon}>
                  <Star className={styles.starIcon} />
                </div>
                <div className={styles.performanceInfo}>
                  <div className={styles.performanceValue}>
                    {examResults.maxScore}
                  </div>
                  <div className={styles.performanceLabel}>Total Points</div>
                </div>
              </div>
              
              <div className={styles.performanceCard}>
                <div className={styles.performanceIcon}>
                  <Brain className={styles.brainIcon} />
                </div>
                <div className={styles.performanceInfo}>
                  <div className={styles.performanceValue}>
                    {Math.round(examResults.percentage)}%
                  </div>
                  <div className={styles.performanceLabel}>Final Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Details Section */}
          {detailedResults && detailedResults.questionResults && detailedResults.questionResults.length > 0 && (
            <div className={styles.questionsSection}>
              <div className={styles.questionsSectionHeader}>
                <h3>Question Breakdown</h3>
                <button 
                  onClick={() => setShowQuestionDetails(!showQuestionDetails)}
                  className={styles.toggleDetailsButton}
                >
                  {showQuestionDetails ? (
                    <>
                      <EyeOff className={styles.toggleIcon} />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <Eye className={styles.toggleIcon} />
                      Show Details
                    </>
                  )}
                </button>
              </div>
              
              {showQuestionDetails && (
                <div className={styles.questionsList}>
                  {detailedResults.questionResults.map((result, index) => (
                    <div key={index} className={styles.questionResult}>
                      <div className={styles.questionResultHeader}>
                        <div className={styles.questionInfo}>
                          <span className={styles.questionNumber}>Q{index + 1}</span>
                          <span className={styles.questionType}>{result.question?.type}</span>
                        </div>
                        <div className={styles.questionScore}>
                          <span className={styles.pointsEarned}>{result.points}</span>
                          <span className={styles.pointsTotal}>/ {result.maxPoints}</span>
                          <span className={`${styles.questionStatus} ${result.isCorrect ? styles.correct : styles.incorrect}`}>
                            {result.isCorrect ? <CheckCircle /> : <XCircle />}
                          </span>
                        </div>
                      </div>
                      
                      <div className={styles.questionContent}>
                        <div className={styles.questionText}>
                          {result.question?.question}
                        </div>
                        
                        <div className={styles.answersComparison}>
                          <div className={styles.studentAnswer}>
                            <strong>Your Answer:</strong>
                            <span className={styles.answerText}>
                              {result.studentAnswer || 'No answer provided'}
                            </span>
                          </div>
                          
                          {result.correctAnswer && (
                            <div className={styles.correctAnswer}>
                              <strong>Correct Answer:</strong>
                              <span className={styles.answerText}>
                                {result.correctAnswer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Additional Information */}
          <div className={styles.additionalInfo}>
            <div className={styles.infoGrid}>
              {examResults.submittedAt && (
                <div className={styles.infoItem}>
                  <Clock className={styles.infoIcon} />
                  <div>
                    <div className={styles.infoLabel}>Submitted</div>
                    <div className={styles.infoValue}>
                      {new Date(examResults.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
              
              {examResults.attemptNumber && (
                <div className={styles.infoItem}>
                  <TrendingUp className={styles.infoIcon} />
                  <div>
                    <div className={styles.infoLabel}>Attempt</div>
                    <div className={styles.infoValue}>#{examResults.attemptNumber}</div>
                  </div>
                </div>
              )}
              
              {examResults.autoGraded !== undefined && (
                <div className={styles.infoItem}>
                  <Brain className={styles.infoIcon} />
                  <div>
                    <div className={styles.infoLabel}>Grading Method</div>
                    <div className={styles.infoValue}>
                      {examResults.autoGraded ? 'Auto-graded' : 'Manual'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.doneButton}>
            <CheckCircle className={styles.doneIcon} />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}