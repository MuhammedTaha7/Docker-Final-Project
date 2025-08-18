import React from 'react';
import { Calendar, Clock, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './AssignmentCard.module.css';

const AssignmentCard = ({ assignment, onToggleComplete }) => {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCourseColor = (course) => {
    const courseColors = {
      'Mathematics': { bg: '#dbeafe', border: '#3b82f6', dot: '#1d4ed8' },
      'Science': { bg: '#fef3c7', border: '#f59e0b', dot: '#d97706' },
      'History': { bg: '#dcfce7', border: '#10b981', dot: '#059669' },
      'English': { bg: '#fce7f3', border: '#ec4899', dot: '#be185d' },
      'Physics': { bg: '#e0e7ff', border: '#6366f1', dot: '#4338ca' }
    };
    return courseColors[course] || courseColors['Mathematics'];
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10b981';
    if (progress >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const courseColors = getCourseColor(assignment.course);
  const daysUntil = getDaysUntilDue(assignment.dueDate);
  const isOverdue = daysUntil < 0;
  const isDueSoon = daysUntil <= 2 && daysUntil >= 0;
  
  const cardClasses = [
    styles.assignmentCard,
    assignment.status === 'completed' && styles.completed,
    isOverdue && styles.overdue,
    isDueSoon && styles.dueSoon
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      style={{ 
        backgroundColor: courseColors.bg,
        borderColor: courseColors.border,
        borderLeftColor: getPriorityColor(assignment.priority)
      }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.courseInfo}>
          <div 
            className={styles.courseDot}
            style={{ backgroundColor: courseColors.dot }}
          />
          <span className={styles.courseName}>{assignment.course}</span>
        </div>
        <div className={styles.cardActions}>
          <Calendar className={styles.actionIcon} />
          <button
            className={styles.checkbox}
            onClick={() => onToggleComplete(assignment.id)}
            aria-label={assignment.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {assignment.status === 'completed' ? (
              <CheckCircle2 className={styles.checkIcon} />
            ) : (
              <div className={styles.emptyCheck} />
            )}
          </button>
        </div>
      </div>

      <div className={styles.cardBody}>
        <h4 className={styles.assignmentTitle}>
          {assignment.title}
        </h4>

        <div className={styles.dueInfo}>
          <div className={styles.dueDateRow}>
            <Clock className={styles.clockIcon} />
            <span className={styles.dueDate}>
              {new Date(assignment.dueDate).toLocaleDateString()}
            </span>
          </div>
          
          <div className={styles.urgencyBadge}>
            {isOverdue && (
              <span className={styles.overdueBadge}>
                <AlertCircle className={styles.urgencyIcon} />
                {Math.abs(daysUntil)} days overdue
              </span>
            )}
            {isDueSoon && !isOverdue && (
              <span className={styles.dueSoonBadge}>
                <AlertCircle className={styles.urgencyIcon} />
                Due {daysUntil === 0 ? 'today' : `in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`}
              </span>
            )}
            {!isOverdue && !isDueSoon && (
              <span className={styles.normalBadge}>
                {daysUntil} days remaining
              </span>
            )}
          </div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Progress</span>
            <span 
              className={styles.progressValue}
              style={{ color: getProgressColor(assignment.progress) }}
            >
              {assignment.progress}%
            </span>
          </div>
          
          <div className={styles.progressBarContainer}>
            <div 
              className={styles.progressBar}
              style={{ 
                width: `${assignment.progress}%`,
                backgroundColor: getProgressColor(assignment.progress)
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <BookOpen className={styles.subjectIcon} />
        <span className={styles.instructor}>
          {assignment.instructor || 'No instructor assigned'}
        </span>
      </div>
    </div>
  );
};

export default AssignmentCard;
