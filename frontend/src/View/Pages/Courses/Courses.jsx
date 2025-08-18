// pages/Courses.jsx
import React, { useRef, useEffect } from "react";
import CoursesContent from "../../Components/Courses/Content/CoursesContent";
import DynamicForm from "../../Components/Forms/dynamicForm.jsx";
import DynamicFilter from "../../Components/DynamicFilter.jsx";
import Popup from "../../Components/Cards/PopUp.jsx";
import useCourses from "../../../Hooks/useCourses.js";
import { useAuth } from "../../../Context/AuthContext.jsx";
import styles from "../../../CSS/Pages/Courses/courses.module.css";

export default function Courses() {  
  // Get authentication data
  const { authData } = useAuth();
  

  const {
    displayedCourses,
    loading,
    hasMore,
    loadMoreCourses,
    isCoursePopupOpen,
    setCoursePopupOpen,
    searchInput,
    setSearchInput,
    filters,
    handleFilterChange,
    handleSearch,
    filterFields,
    handleAddCourse,
    handleEditCourse,
    handleDeleteCourse,
    handleSubmit,
    handleFieldChange,
    handleGroupChange,
    handlePopupClose,
    updatedCourseFields,
    editingCourse,
    formData,
    errors,
    getAcademicYearOptions,
  } = useCourses();

  const loadMoreRef = useRef();



  // Role-based access control
  const isLecturer = authData?.role === 'lecturer' || authData?.userType === 'lecturer' || authData?.role == 1200;
  const isAdmin = authData?.role === 'admin' || authData?.userType === 'admin' || authData?.role == 1100;
  const isStudent = authData?.role === 'student' || authData?.userType === 'student' || authData?.role == 1300;
  
  // Permissions
  const canAddCourse = isAdmin; // Only admins can add courses
  const canEditCourse = isAdmin; // Only admins can edit courses
  const canDeleteCourse = isAdmin; // Only admins can delete courses
  const canViewCourses = isAdmin || isLecturer || isStudent; // All authenticated users can view courses

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreCourses();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [loadMoreCourses, hasMore, loading]);

  // Safe render of form fields
  const renderDynamicForm = () => {    
    if (!Array.isArray(updatedCourseFields) || updatedCourseFields.length === 0) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Loading form fields...
        </div>
      );
    }

    return (
      <DynamicForm
        fields={updatedCourseFields}
        onSubmit={handleSubmit}
        onCancel={handlePopupClose}
        submitText={editingCourse ? "Update Course" : "Add Course"}
        initialData={formData}
        onFieldChange={handleFieldChange}
        getAcademicYearOptions={getAcademicYearOptions}
        errors={errors}
        key={editingCourse ? `edit-${formData.id}` : 'add'}
      />
    );
  };

  // Protected handler for adding course
  const handleProtectedAddCourse = () => {
    if (canAddCourse) {
      handleAddCourse();
    } else {
      console.warn("🚫 Access denied: User doesn't have permission to add courses");
      alert("You don't have permission to add courses. Contact an administrator.");
    }
  };

  // Protected handler for editing course
  const handleProtectedEditCourse = (course) => {
    if (canEditCourse) {
      handleEditCourse(course);
    } else {
      console.warn("🚫 Access denied: User doesn't have permission to edit courses");
      alert("You don't have permission to edit courses. Contact an administrator.");
    }
  };

  // Protected handler for deleting course
  const handleProtectedDeleteCourse = (courseId) => {
    if (canDeleteCourse) {
      handleDeleteCourse(courseId);
    } else {
      console.warn("🚫 Access denied: User doesn't have permission to delete courses");
      alert("You don't have permission to delete courses. Contact an administrator.");
    }
  };

  // If user doesn't have permission to view courses, show access denied
  if (!canViewCourses) {
    return (
      <div className={styles.coursesWrapper}>
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#666'
        }}>
          <h2>Access Denied</h2>
          <p>You don't have permission to view courses. Please contact an administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.coursesWrapper}>
      <div className={styles.coursesHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerSection}>
            <h2>Course Management</h2>
            {/* Conditionally render Add Course button based on permissions */}
            {canAddCourse && (
              <button 
                className={styles.addCourseBtn} 
                onClick={handleProtectedAddCourse}
                title="Add a new course"
              >
                Add Course
              </button>
            )}
          </div>
          <div className={styles.filterContainer}>
            {Array.isArray(filterFields) && filterFields.length > 0 && (
              <DynamicFilter
                filters={filterFields}
                values={filters}
                onChange={handleFilterChange}
              />
            )}
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search by course name or code..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={styles.filterSelect}
              />
              <button className={styles.searchBtn} onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.cardsSection}>
        <div className={styles.cardsContainer}>
          <CoursesContent
            courses={displayedCourses}
            onDeleteCourse={handleProtectedDeleteCourse}
            onEditCourse={handleProtectedEditCourse}
            // Pass permissions to the component
            canEdit={canEditCourse}
            canDelete={canDeleteCourse}
            userRole={authData?.role || authData?.userType}
          />
          
          {loading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              padding: '20px', 
              width: '100%' 
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '4px solid #f3f3f3', 
                borderTop: '4px solid #3498db', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
              }} />
            </div>
          )}
          
          <div ref={loadMoreRef} className={styles.loadMoreTrigger} />
          
          {!hasMore && displayedCourses.length > 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '20px', 
              color: '#666', 
              width: '100%' 
            }}>
              All courses loaded ({displayedCourses.length} total)
            </div>
          )}
          
          {!loading && displayedCourses.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#666', 
              width: '100%' 
            }}>
              No courses found matching your criteria.
            </div>
          )}
        </div>
      </div>
      
      {/* Only show popup if user has permission to add/edit courses */}
      {isCoursePopupOpen && (canAddCourse || canEditCourse) && (
        <Popup isOpen={isCoursePopupOpen} onClose={handlePopupClose}>
          {renderDynamicForm()}
        </Popup>
      )}
      
      <style>{`
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
        .${styles.loadMoreTrigger} { 
          height: 20px; 
          width: 100%; 
        }
        
        /* Style for disabled buttons if needed */
        .${styles.addCourseBtn}:disabled {
          background-color: #ccc;
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        /* Role-based styling */
        .role-lecturer .course-actions {
          display: none;
        }
        
        .role-admin .course-actions {
          display: flex;
        }
      `}</style>
    </div>
  );
}