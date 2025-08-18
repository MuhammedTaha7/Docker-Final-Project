import React, { useState, useEffect } from 'react';
import { GraduationCap, FileText, Award, User, Bell } from 'lucide-react';

import AssignmentsTab from '../../Components/student/AssignmentsTab';
import ExamsTab from '../../Components/student/ExamsTab';
import GradesTab from '../../Components/student/GradesTab';
import LoadingSpinner from '../../Pages/Global/Loading';
import ErrorMessage from '../Errors/404';
import { useStudentDashboard } from '../../../Hooks/useStudentAssignmentDashboard'
import { useAuth } from '../../../Context/AuthContext';
import styles from '../../../CSS/Pages/Student/StudentDashboard.module.css';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('assignments');
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Get current user from auth context
  const { authData, loading: authLoading } = useAuth();
  
  // Extract student ID from auth data
  const studentId = authData?.id;
  const userName = authData?.name || authData?.username || 'Student';
  const userRole = authData?.role;

  // Use the comprehensive dashboard hook - FIXED PARAMETER ORDER
  const {
    courses,
    assignments,
    exams,
    grades,
    gradeColumns,
    dashboardData,
    notifications,
    unreadCount
  } = useStudentDashboard(studentId, selectedCourse);

  // Auto-select first course if none selected and courses are available
  useEffect(() => {
    if (courses && courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0].id);
    }
  }, [courses, selectedCourse]);

  const tabs = [
    { key: 'assignments', label: 'Assignments', icon: FileText },
    { key: 'exams', label: 'Online Exams', icon: GraduationCap },
    { key: 'grades', label: 'Grades', icon: Award }
  ];

  const renderActiveTab = () => {
    // Common props for all tabs with proper studentId integration
    const commonProps = {
      studentId,
      selectedCourse,
      setSelectedCourse,
      courses: courses || []
    };

    switch (activeTab) {
      case 'assignments':
        return (
          <AssignmentsTab 
            {...commonProps} 
            assignments={assignments || []}
          />
        );
      case 'exams':
        return (
          <ExamsTab 
            {...commonProps} 
            exams={exams || []}
          />
        );
      case 'grades':
        return (
          <GradesTab 
            {...commonProps} 
            grades={grades || []}
            gradeColumns={gradeColumns || []}
            assignments={assignments || []}
            exams={exams || []}
          />
        );
      default:
        return (
          <AssignmentsTab 
            {...commonProps} 
            assignments={assignments || []}
          />
        );
    }
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  // Check if user is authenticated and is a student
  if (!authData || !studentId) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <ErrorMessage message="Please log in to access the dashboard" />
        </div>
      </div>
    );
  }

  // Check if user has student role (assuming role code '1300' for students)
  if (userRole && userRole !== '1300') {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <ErrorMessage message="Access denied: This dashboard is for students only" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <GraduationCap className={styles.logo} />
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Student Portal</h1>
              <p className={styles.subtitle}>Welcome back, {userName}</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            {/* Notifications Bell */}
            <div className={styles.notificationContainer}>
              <Bell className={styles.notificationIcon} />
              {unreadCount > 0 && (
                <div className={styles.notificationBadge}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRole}>Student</span>
            </div>
            
            {/* User Avatar */}
            <div className={styles.userAvatar}>
              {authData.profilePic ? (
                <img 
                  src={authData.profilePic} 
                  alt="Profile" 
                  className={styles.profileImage}
                />
              ) : (
                <User className={styles.userIcon} />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <div className={styles.navContent}>
          <div className={styles.navTabs}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`${styles.navTab} ${
                  activeTab === tab.key ? styles.navTabActive : ''
                }`}
              >
                <tab.icon className={styles.navTabIcon} />
                <span>{tab.label}</span>
                {/* Add badge for active content counts */}
                {tab.key === 'assignments' && assignments && assignments.length > 0 && (
                  <span className={styles.tabBadge}>{assignments.length}</span>
                )}
                {tab.key === 'exams' && exams && exams.length > 0 && (
                  <span className={styles.tabBadge}>{exams.length}</span>
                )}
                {tab.key === 'grades' && courses && courses.length > 0 && (
                  <span className={styles.tabBadge}>{courses.length}</span>
                )}
              </button>
            ))}
          </div>
          
          {/* Course Selector in Navigation */}
          
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainContent}>
          {renderActiveTab()}
        </div>
      </main>

     
    </div>
  );
}