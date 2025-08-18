// pages/CoursePage.jsx
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import CoursePageContent from "../../Components/CoursePage/Content/CoursePageContent.jsx";
import { AuthContext } from "../../../Context/AuthContext.jsx";
import useCourseData from "../../../Hooks/useCourseData.js";
import styles from "../../../CSS/Pages/CoursePage/CoursePage.module.css";
import Loader from "../Global/Loading.jsx";
import NotFoundPage from "../Errors/404.jsx";

const CoursePage = () => {
  const { id } = useParams();
  const { authData, loading: authLoading } = useContext(AuthContext);
  const { courseData, departments, error, loading: courseLoading, refetch } = useCourseData(id);
  
  // Role-based access control
  const isLecturer = authData?.role === 'lecturer' || authData?.userType === 'lecturer' || authData?.role === 1200;
  const isAdmin = authData?.role === 'admin' || authData?.userType === 'admin' || authData?.role === 1000;
  const isStudent = authData?.role === 'student' || authData?.userType === 'student' || authData?.role === 1300;
  
  // Permissions - Only admins can add students to courses
  const canAddStudent = isAdmin;
  
  console.log("🔐 CoursePage permissions:", {
    userRole: authData?.role || authData?.userType,
    isLecturer,
    isAdmin,
    isStudent,
    canAddStudent,
    courseId: id
  });

  if (authLoading || courseLoading) return <Loader />;
  if (error) return <NotFoundPage />;

  return (
    <div className={styles.coursePageContent}>
      <CoursePageContent 
        userRole={authData?.role || authData?.userType}
        courseData={courseData} 
        departments={departments}
        onStudentEnrolled={refetch}
        // Pass permission flags to child component
        canAddStudent={canAddStudent}
        isLecturer={isLecturer}
        isAdmin={isAdmin}
        isStudent={isStudent}
        userId={authData?.id}
      />
    </div>
  );
};

export default CoursePage;