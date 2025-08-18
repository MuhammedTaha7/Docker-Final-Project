import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  FileText, 
  Award, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Info,
  Filter
} from 'lucide-react';
import styles from '../../../CSS/Components/student/GradesTab.module.css';

// Import individual hooks instead of using the combined hook
import { 
  useGrades, 
  useEnrolledCourses,
  useGradeCalculations 
} from '../../../Hooks/useStudentAssignmentDashboard';

export default function GradesTab({ selectedCourse, setSelectedCourse, studentId, grades: propsGrades, gradeColumns: propsGradeColumns }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Use individual hooks directly
  const { 
    courses, 
    loading: coursesLoading,
    error: coursesError 
  } = useEnrolledCourses(studentId);

  const { 
    grades: hookGrades, 
    gradeColumns: hookGradeColumns, 
    loading: gradesLoading, 
    error: gradesError, 
    refetch 
  } = useGrades(selectedCourse);

  // Use props data if available, otherwise use hook data
  const grades = propsGrades && propsGrades.length > 0 ? propsGrades : hookGrades;
  const gradeColumns = propsGradeColumns && propsGradeColumns.length > 0 ? propsGradeColumns : hookGradeColumns;

  // FIXED: Use the proper grade calculations hook that matches backend logic
  const gradeCalculations = useGradeCalculations(studentId, grades, gradeColumns);

  // Combined loading and error states
  useEffect(() => {
    setLoading(coursesLoading || gradesLoading);
  }, [coursesLoading, gradesLoading]);

  useEffect(() => {
    setError(coursesError || gradesError);
  }, [coursesError, gradesError]);

  // FIXED: Transform backend data to match component expectations
  const transformGradesData = () => {
    console.log('🎯 === TRANSFORMING GRADES DATA ===');
    console.log('Grades:', grades);
    console.log('Grade Columns:', gradeColumns);
    console.log('Student ID:', studentId);
    
    if (!grades || !gradeColumns || !studentId) {
      console.log('❌ Missing required data for transformation');
      return [];
    }

    // Find the current student's grade record
    const studentGradeRecord = grades.find(grade => grade.studentId === studentId);
    console.log('👤 Student grade record:', studentGradeRecord);
    
    if (!studentGradeRecord) {
      console.log('❌ No grade record found for student:', studentId);
      return [];
    }

    // FIXED: Transform grade columns with proper score handling
    const transformedGrades = gradeColumns
      .filter(column => column.isActive !== false) // Only show active columns
      .map(column => {
        // Get the actual grade from the student's grades map
        const earnedGrade = studentGradeRecord.grades && studentGradeRecord.grades[column.id] 
          ? studentGradeRecord.grades[column.id] 
          : null;
        
        // FIXED: Grade columns store percentages (0-100), not points
        // The earnedGrade is already a percentage from the backend
        const maxPoints = column.maxPoints || 100;
        const earnedPoints = earnedGrade != null ? (earnedGrade * maxPoints / 100) : 0;
        
        const transformed = {
          id: column.id,
          category: column.name,
          weight: column.percentage || 0,
          earned: earnedPoints, // Points earned (calculated from percentage)
          earnedPercentage: earnedGrade, // Actual percentage grade
          total: maxPoints,
          courseId: column.courseId,
          type: column.type || 'assignment',
          isActive: column.isActive !== false,
          hasGrade: earnedGrade != null && earnedGrade >= 0,
          displayOrder: column.displayOrder || 0
        };
        
        console.log(`📊 Transformed grade for ${column.name}:`, {
          earnedGrade,
          earnedPoints,
          maxPoints,
          weight: column.percentage,
          hasGrade: transformed.hasGrade
        });
        
        return transformed;
      })
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)); // Sort by display order

    console.log('✅ Final transformed grades:', transformedGrades);
    return transformedGrades;
  };

  // FIXED: Use backend-calculated GPAs instead of frontend calculation
  const getCourseGPA = (courseId) => {
    // Use the properly calculated GPA from the hook that matches backend logic
    const gpa = gradeCalculations.courseGPAs[courseId];
    console.log(`🎯 Course ${courseId} GPA:`, gpa);
    return gpa || 0;
  };

  // FIXED: Use backend-calculated overall GPA
  const getOverallGPA = () => {
    const overallGPA = gradeCalculations.overallGPA;
    console.log('🎯 Overall GPA:', overallGPA);
    return overallGPA || 0;
  };

  // FIXED: Calculate course letter grade from percentage
  const getCourseLetterGrade = (courseId) => {
    const letterGrade = gradeCalculations.letterGrades[courseId];
    console.log(`🎯 Course ${courseId} Letter Grade:`, letterGrade);
    return letterGrade || 'F';
  };

  // FIXED: Get course completion rate
  const getCourseCompletionRate = (courseId) => {
    const completionRate = gradeCalculations.completionRates[courseId];
    console.log(`🎯 Course ${courseId} Completion Rate:`, completionRate);
    return completionRate || 0;
  };

  const getTimeUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  // Simplified filter courses logic - course selection only
  const getFilteredCourses = () => {
    if (!courses) return [];

    // If a specific course is selected, show only that course
    if (selectedCourse) {
      return courses.filter(course => course.id === selectedCourse);
    }

    // Otherwise show all courses
    return courses;
  };

  // Mock assignments and exams data for summary
  const assignments = [
    { id: 1, title: 'Math Assignment 1', submitted: true, submittedDate: '2024-01-15', dueDate: '2024-01-20' },
    { id: 2, title: 'Physics Lab Report', submitted: false, dueDate: '2024-01-25' },
    { id: 3, title: 'Chemistry Quiz', submitted: true, submittedDate: '2024-01-10', dueDate: '2024-01-18' }
  ];

  const exams = [
    { id: 1, taken: true, status: 'completed' },
    { id: 2, taken: false, status: 'active' },
    { id: 3, taken: true, status: 'completed' }
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <RefreshCw className={styles.loadingSpinner} />
          <p>Loading grades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper}>
          <AlertCircle className={styles.errorIcon} />
          <p>Error loading grades: {error}</p>
          <button onClick={refetch} className={styles.retryButton}>
            <RefreshCw /> Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredCourses = getFilteredCourses();
  const transformedGrades = transformGradesData();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>My Grades</h2>
          <p className={styles.subtitle}>Track your academic performance</p>
        </div>
        <div className={styles.headerActions}>
          {/* FIXED: Improved filter dropdown */}
          <div className={styles.filterContainer}>
            <Filter className={styles.filterIcon} />
            <select 
              className={styles.filterSelect}
              value={selectedCourse || 'all'}
              onChange={(e) => {
                const value = e.target.value;
                
                if (value === 'all') {
                  setSelectedCourse(null);
                  setStatusFilter('all');
                } else {
                  setSelectedCourse(value);
                  setStatusFilter('all');
                }
              }}
            >
              {/* Course filters only */}
              <option value="all">All Courses</option>
              {courses && courses.length > 0 && (
                courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))
              )}
            </select>
          </div>
          
          <button onClick={refetch} className={styles.refreshButton} title="Refresh grades">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Overall Summary - only show when no specific course is selected */}
      {!selectedCourse && (
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <div className={styles.summaryHeaderContent}>
              <div className={styles.summaryIcon}>
                <BarChart3 className={styles.summaryIconSvg} />
              </div>
              <div>
                <h3 className={styles.summaryTitle}>Academic Performance</h3>
                <p className={styles.summarySubtitle}>Your overall academic standing and progress</p>
              </div>
            </div>
          </div>

          <div className={styles.summaryBody}>
            <div className={styles.statsGrid}>
              {/* Overall GPA */}
              <div className={styles.statCard}>
                <div className={styles.statCardContent}>
                  <div className={styles.statHeader}>
                    <div className={styles.statIconContainer}>
                      <TrendingUp className={styles.statIcon} />
                    </div>
                    <span className={styles.statBadge}>
                      GPA
                    </span>
                  </div>
                  <div className={styles.statData}>
                    <div className={styles.statNumber}>
                      {getOverallGPA().toFixed(1)}%
                    </div>
                    <p className={styles.statLabel}>Overall Average</p>
                    <div className={styles.statProgress}>
                      <div 
                        className={styles.statProgressFill}
                        style={{ width: `${Math.min(getOverallGPA(), 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Courses */}
              <div className={styles.statCard}>
                <div className={styles.statCardContent}>
                  <div className={styles.statHeader}>
                    <div className={styles.statIconContainer}>
                      <BookOpen className={styles.statIcon} />
                    </div>
                    <span className={styles.statBadge}>
                      Active
                    </span>
                  </div>
                  <div className={styles.statData}>
                    <div className={styles.statNumber}>{courses ? courses.length : 0}</div>
                    <p className={styles.statLabel}>Enrolled Courses</p>
                    <p className={styles.statSubLabel}>
                      {courses ? courses.reduce((acc, course) => acc + (course.credits || 3), 0) : 0} total credits
                    </p>
                  </div>
                </div>
              </div>

              {/* Assignments Progress */}
              <div className={styles.statCard}>
                <div className={styles.statCardContent}>
                  <div className={styles.statHeader}>
                    <div className={styles.statIconContainer}>
                      <FileText className={styles.statIcon} />
                    </div>
                    <span className={styles.statBadge}>
                      Progress
                    </span>
                  </div>
                  <div className={styles.statData}>
                    <div className={styles.statNumber}>
                      {assignments.filter(a => a.submitted).length}
                    </div>
                    <p className={styles.statLabel}>Assignments Done</p>
                    <div className={styles.progressContainer}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${assignments.length > 0 ? (assignments.filter(a => a.submitted).length / assignments.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className={styles.progressText}>
                        {assignments.length > 0 ? Math.round((assignments.filter(a => a.submitted).length / assignments.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exams Status */}
              <div className={styles.statCard}>
                <div className={styles.statCardContent}>
                  <div className={styles.statHeader}>
                    <div className={styles.statIconContainer}>
                      <Award className={styles.statIcon} />
                    </div>
                    <span className={styles.statBadge}>
                      Exams
                    </span>
                  </div>
                  <div className={styles.statData}>
                    <div className={styles.statNumber}>
                      {exams.filter(e => e.taken).length}
                    </div>
                    <p className={styles.statLabel}>Exams Completed</p>
                    <p className={styles.statSubLabel}>
                      {exams.filter(e => !e.taken && e.status === 'active').length} available now
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className={styles.insightsGrid}>
              {/* Recent Activity */}
              <div className={styles.insightCard}>
                <h4 className={styles.insightTitle}>
                  <Clock className={styles.insightIcon} />
                  Recent Activity
                </h4>
                <div className={styles.activityList}>
                  {assignments
                    .filter(a => a.submitted)
                    .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
                    .slice(0, 3)
                    .map(assignment => (
                      <div key={assignment.id} className={styles.activityItem}>
                        <div className={styles.activityContent}>
                          <div className={styles.activityDot}></div>
                          <span className={styles.activityText}>{assignment.title}</span>
                        </div>
                        <span className={styles.activityDate}>
                          {new Date(assignment.submittedDate).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className={styles.insightCard}>
                <h4 className={styles.insightTitle}>
                  <AlertCircle className={styles.insightIcon} />
                  Upcoming Deadlines
                </h4>
                <div className={styles.deadlinesList}>
                  {assignments
                    .filter(a => !a.submitted)
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .slice(0, 3)
                    .map(assignment => (
                      <div key={assignment.id} className={styles.deadlineItem}>
                        <div className={styles.deadlineContent}>
                          <div className={styles.deadlineDot}></div>
                          <span className={styles.deadlineText}>{assignment.title}</span>
                        </div>
                        <span className={styles.deadlineDate}>
                          {getTimeUntilDue(assignment.dueDate)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses List with Grades */}
      <div className={styles.coursesList}>
        {filteredCourses.length === 0 ? (
          <div className={styles.noResultsMessage}>
            <Info className={styles.infoIcon} />
            <p>No courses match the current filter criteria.</p>
            <button 
              onClick={() => {
                setSelectedCourse(null);
              }}
              className={styles.clearFiltersButton}
            >
              Show All Courses
            </button>
          </div>
        ) : (
          filteredCourses.map(course => {
            // FIXED: Filter grades for this specific course
            const courseGrades = transformedGrades.filter(g => g.courseId === course.id && g.isActive);
            const overallGrade = getCourseGPA(course.id);
            const letterGrade = getCourseLetterGrade(course.id);
            const completionRate = getCourseCompletionRate(course.id);
            
            console.log(`📊 Course ${course.id} (${course.name}):`, {
              courseGrades: courseGrades.length,
              overallGrade,
              letterGrade,
              completionRate
            });
            
            return (
              <div key={course.id} className={styles.courseCard}>
                {/* Course Header */}
                <div className={styles.courseHeader}>
                  <div>
                    <h3 className={styles.courseTitle}>{course.name}</h3>
                    <p className={styles.courseInfo}>
                      {course.lecturerId || course.instructor || 'Instructor'} • {course.credits || 3} Credits
                    </p>
                  </div>
                  <div className={styles.gradeDisplay}>
                    <div className={`${styles.overallGrade} ${
                      overallGrade >= 90 ? styles.gradeA :
                      overallGrade >= 80 ? styles.gradeB :
                      overallGrade >= 70 ? styles.gradeC :
                      overallGrade >= 60 ? styles.gradeD : styles.gradeF
                    }`}>
                      {overallGrade.toFixed(1)}%
                    </div>
                    <p className={styles.gradeLabel}>Current Grade ({letterGrade})</p>
                  </div>
                </div>

                {/* Grades Table */}
                <div className={styles.gradesTable}>
                  {courseGrades.length > 0 ? (
                    <div className={styles.tableContainer}>
                      <table className={styles.table}>
                        <thead>
                          <tr className={styles.tableHeader}>
                            <th className={styles.tableHeaderCell}>Category</th>
                            <th className={styles.tableHeaderCellCenter}>Weight</th>
                            <th className={styles.tableHeaderCellCenter}>Points</th>
                            <th className={styles.tableHeaderCellCenter}>Percentage</th>
                            <th className={styles.tableHeaderCellRight}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courseGrades.map((grade, index) => {
                            // FIXED: Use the actual percentage grade from backend
                            const percentage = grade.earnedPercentage != null ? Math.round(grade.earnedPercentage * 100) / 100 : null;
                            const isCompleted = grade.hasGrade;
                            
                            console.log(`📋 Displaying grade row for ${grade.category}:`, {
                              earnedPercentage: grade.earnedPercentage,
                              percentage,
                              isCompleted,
                              hasGrade: grade.hasGrade
                            });
                            
                            return (
                              <tr key={index} className={styles.tableRow}>
                                <td className={styles.tableCell}>
                                  <div className={styles.categoryCell}>
                                    <div className={`${styles.categoryDot} ${
                                      isCompleted ? styles.categoryDotCompleted : styles.categoryDotPending
                                    }`}></div>
                                    <span className={styles.categoryName}>{grade.category}</span>
                                  </div>
                                </td>
                                <td className={styles.tableCellCenter}>
                                  <span className={styles.weightBadge}>
                                    {grade.weight}%
                                  </span>
                                </td>
                                <td className={styles.tableCellCenter}>
                                  <span className={styles.scoreText}>
                                    {isCompleted ? `${grade.earned.toFixed(1)}/${grade.total}` : '--'}
                                  </span>
                                </td>
                                <td className={styles.tableCellCenter}>
                                  <div className={styles.percentageCell}>
                                    <div className={styles.percentageBar}>
                                      <div 
                                        className={`${styles.percentageFill} ${
                                          percentage >= 90 ? styles.fillA :
                                          percentage >= 80 ? styles.fillB :
                                          percentage >= 70 ? styles.fillC :
                                          percentage >= 60 ? styles.fillD : styles.fillF
                                        }`}
                                        style={{ width: `${percentage != null ? Math.min(percentage, 100) : 0}%` }}
                                      ></div>
                                    </div>
                                    <span className={`${styles.percentageText} ${
                                      percentage >= 90 ? styles.textA :
                                      percentage >= 80 ? styles.textB :
                                      percentage >= 70 ? styles.textC :
                                      percentage >= 60 ? styles.textD : styles.textF
                                    }`}>
                                      {percentage != null ? `${percentage}%` : '--'}
                                    </span>
                                  </div>
                                </td>
                                <td className={styles.tableCellRight}>
                                  <span className={`${styles.statusBadge} ${
                                    isCompleted ? styles.statusCompleted : styles.statusPending
                                  }`}>
                                    {isCompleted ? 'Completed' : 'Pending'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className={styles.noGradesMessage}>
                      <Info className={styles.infoIcon} />
                      <p>No grades available for this course yet.</p>
                    </div>
                  )}

                  {/* FIXED: Course Summary with proper data */}
                  <div className={styles.courseSummary}>
                    <div className={styles.summaryContent}>
                      <div>
                        <h4 className={styles.summarySubtitle}>Course Performance Summary</h4>
                        <p className={styles.summaryText}>
                          {courseGrades.filter(g => g.hasGrade).length} of {courseGrades.length} categories completed ({completionRate}% completion)
                        </p>
                      </div>
                      <div className={styles.summaryGrade}>
                        <div className={`${styles.finalGrade} ${
                          overallGrade >= 90 ? styles.gradeA :
                          overallGrade >= 80 ? styles.gradeB :
                          overallGrade >= 70 ? styles.gradeC :
                          overallGrade >= 60 ? styles.gradeD : styles.gradeF
                        }`}>
                          {overallGrade.toFixed(1)}% ({letterGrade})
                        </div>
                        <p className={styles.gradeDescription}>
                          {overallGrade >= 90 ? 'Excellent' :
                           overallGrade >= 80 ? 'Good' :
                           overallGrade >= 70 ? 'Satisfactory' :
                           overallGrade >= 60 ? 'Needs Improvement' : 'Poor'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}