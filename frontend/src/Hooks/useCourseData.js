// Hooks/useCourseData.js
import { useState, useEffect, useCallback } from 'react';
import { getCourseById, getAllDepartments } from '../Api/coursePageApi.js';
import { getAllLecturers } from '../Api/dashboardPageApi.js';
import { getAcademicYearOptionsForDepartment } from '../Utils/courseUtils.js';

// --- CHANGE 1: Removed `initialCourseData` from the function signature.
const useCourseData = (courseId) => {
  // --- CHANGE 2: Removed initial state from `courseData` and always start in a loading state.
  const [courseData, setCourseData] = useState(null);
  const [lecturers, setLecturers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (id) => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // --- CHANGE 3: Simplified the API calls. We always fetch the course by its ID.
      // Note: It's inefficient to fetch ALL users. Ideally, your backend should have an endpoint like `/api/lecturers`.
      // For now, we will keep this logic, but it's a good point for future improvement.
      const [courseResponse, allUsersResponse, departmentsResponse] = await Promise.all([
        getCourseById(id),
        getAllLecturers(),
        getAllDepartments()
      ]);

      // Filter for lecturers (role "1200")
      const filteredLecturers = allUsersResponse?.filter(user => user.role === "1200") || [];
      setLecturers(filteredLecturers);
      setDepartments(departmentsResponse || []);

      if (courseResponse) {
        // Find the lecturer for the current course
        const lecturer = filteredLecturers.find(l => l.id === courseResponse.lecturerId);

        // Enhance course data with lecturer info
        const enhancedCourseData = {
          ...courseResponse,
          lecturerName: lecturer ? lecturer.name : 'Unknown Lecturer',
          lecturer: lecturer || null,
          title: courseResponse.name || courseResponse.title,
          instructorName: lecturer ? lecturer.name : 'Unknown Lecturer',
          enrollments: courseResponse.enrollments || []
        };
        setCourseData(enhancedCourseData);

        // Generate academic year options
        if (courseResponse.department && departmentsResponse?.length > 0) {
          const yearOptions = getAcademicYearOptionsForDepartment(
            courseResponse.department,
            departmentsResponse
          );
          setAcademicYearOptions(yearOptions);
        }
      } else {
        // If course is not found, set an error
        setError(new Error("Course not found"));
      }

    } catch (err) {
      console.error('Error fetching course data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []); // The function itself doesn't need dependencies anymore

  // --- CHANGE 4: Greatly simplified the `useEffect`. It now runs only when `courseId` changes.
  useEffect(() => {
    fetchData(courseId);
  }, [courseId, fetchData]);

  const refetch = useCallback(() => {
    fetchData(courseId);
  }, [courseId, fetchData]);
  
  return { courseData, lecturers, departments, academicYearOptions, loading, error, refetch };
};

export default useCourseData;