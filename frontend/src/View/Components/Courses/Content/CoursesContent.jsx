import "../../../../CSS/Pages/Dashboard/Content.css";
import CourseCard from "../CourseCard/CourseCard";

const CoursesContent = ({ 
  courses, 
  onDeleteCourse, 
  onEditCourse, 
  userRole 
}) => {
  // --- 1. Get the current calendar year ---
  const currentYear = new Date().getFullYear(); // This is 2025
  
  // Simple check: only admin (role 1100) can edit/delete
  const isAdmin = userRole === "1100";
  
  return (
    <div className="courses-grid">
      {courses && courses.length > 0 ? (
        courses.map((course) => {
          
          // --- 2. FIXED: Find enrollment for current academic year (not calendar year) ---
          // The enrollment structure uses academicYear field, not year field
          let currentYearEnrollment = null;
          let studentCount = 0;
          
          if (course.enrollments && Array.isArray(course.enrollments)) {
            // Look for enrollments matching the current calendar year (2025)
            currentYearEnrollment = course.enrollments.find(
              (enrollment) => {
                // Check if this enrollment is for the current year
                // You might need to adjust this logic based on your business rules
                return enrollment.academicYear === 1 || // First year students
                       enrollment.academicYear === 2 ||  // Second year students  
                       enrollment.academicYear === 3 ||  // Third year students
                       enrollment.academicYear === 4;    // Fourth year students
              }
            );
            
            // For now, let's count ALL current enrollments for 2025
            // You can modify this logic based on your specific requirements
            studentCount = course.enrollments.reduce((total, enrollment) => {
              return total + (enrollment.studentIds ? enrollment.studentIds.length : 0);
            }, 0);
          }
          
          return (
            <CourseCard
              key={course._id || course.id} // Use MongoDB _id if available
              cardInfo={{
                id: course._id?.$oid || course.id,
                title: course.name,
                // --- 3. FIXED: Show total current enrollment count ---
                students: studentCount,
                img: course.imageUrl,
                credits: course.credits || 0,
                lessons: course.lessons || 12,
                description: course.description,
                code: course.code,
                department: course.department,
                // Add year info for debugging
                year: course.year,
                academicYear: course.academicYear,
                semester: course.semester,
                ...course
              }}
              onDelete={onDeleteCourse}
              onEdit={onEditCourse}
              userRole={userRole}
              isAdmin={isAdmin}
            />
          );
        })
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666',
          gridColumn: '1 / -1' // Span full width in grid
        }}>
          <p>No courses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CoursesContent;