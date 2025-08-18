import { useState, useEffect, useCallback, useRef, useMemo, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import {
    filterCourses,
    getFilterOptions,
    calculateCourseStats,
    validateCourseData,
    isCourseCodeExists,
    COURSES_PER_PAGE,
    DEFAULT_FILTERS,
    getAcademicYearOptionsForDepartment,
    generateAcademicYearOptions,
    transformCourseForForm,
    transformFormToCourse,
    getUpdatedCourseFields
} from '../Utils/courseUtils.js';
import {
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getAllDepartments,
} from '../Api/coursePageApi.js';
import { getAllLecturers } from '../Api/dashboardPageApi.js';

const DEFAULT_COURSE_FORM_DATA = {
    courseTitle: '',
    courseCode: '',
    description: '',
    department: '',
    academicYear: '',
    semester: '1',
    year: new Date().getFullYear(),
    credits: 3,
    selectable: false,
    img: '',
    lecturer: '',
    language: 'English',
    progress: 0,
    prerequisites: 'None',
    finalExam: 'TBD'
};


const useCourses = () => {

    
    const { authData } = useContext(AuthContext);
    const userRole = authData?.role;

    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [displayedCourses, setDisplayedCourses] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [isCoursePopupOpen, setCoursePopupOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [filterFields, setFilterFields] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState(DEFAULT_COURSE_FORM_DATA);
    const [updatedCourseFields, setUpdatedCourseFields] = useState([]);

    const initialDataFetchedRef = useRef(false);

    const fetchInitialData = useCallback(async () => {
        if (initialDataFetchedRef.current) return;
        
        setLoading(true);
        try {
            // The getAllCourses() API call is now smart and returns the correct list based on the user's role
            const [backendCourses, backendDepartments, backendUsers] = await Promise.all([
                getAllCourses(),
                getAllDepartments(),
                getAllLecturers()
            ]);

            const filteredLecturers = backendUsers?.filter(user => user.role === "1200") || [];
            
            // Note: The backend now sends a CourseSummaryResponse DTO. The `lecturerName` is already included.
            // This mapping is now simpler.
            const enhancedCourses = backendCourses?.map(course => ({
                ...course,
                lecturer: filteredLecturers.find(l => l.name === course.lecturerName)
            })) || [];

            console.log("📚 Fetched courses:", enhancedCourses.length);
            console.log("🏢 Sample course data:", enhancedCourses[0]);

            setCourses(enhancedCourses);
            setDepartments(backendDepartments || []);
            setLecturers(filteredLecturers);

            initialDataFetchedRef.current = true;
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        const updateCourseFields = async () => {
            if (departments.length > 0) {
                try {
                    const fields = await getUpdatedCourseFields(departments);
                    setUpdatedCourseFields(fields);
                } catch (error) {
                    console.error("Error updating course fields:", error);
                }
            }
        };
        updateCourseFields();
    }, [departments]);

    useEffect(() => {
        console.log("🔄 Filtering courses triggered by:", { 
            coursesLength: courses.length, 
            filters, 
            searchInput 
        });
        
        const filtered = filterCourses(courses, filters, searchInput);
        setFilteredCourses(filtered);
        setPage(1);
        const firstPage = filtered.slice(0, COURSES_PER_PAGE);
        setDisplayedCourses(firstPage);
        setHasMore(filtered.length > COURSES_PER_PAGE);
        
        console.log(`📊 Filter results: ${filtered.length} courses found`);
    }, [courses, filters, searchInput]);

    useEffect(() => {
        if (page > 1) {
            const endIndex = page * COURSES_PER_PAGE;
            const newDisplayedCourses = filteredCourses.slice(0, endIndex);
            setDisplayedCourses(newDisplayedCourses);
            setHasMore(filteredCourses.length > endIndex);
        }
    }, [page, filteredCourses]);

    useEffect(() => {
        if (courses.length > 0 && departments.length > 0) {
            console.log("🔧 Updating filter fields for department:", filters.department);
            
            const options = getFilterOptions(courses, departments);

            let academicYearOptions = [];
            if (filters.department && filters.department !== "all") {
                academicYearOptions = getAcademicYearOptionsForDepartment(filters.department, departments);
                console.log(`📚 Academic year options for ${filters.department}:`, academicYearOptions);
            } else {
                academicYearOptions = options.academicYears || [];
            }

            let newFilterFields = [];

            if (userRole === '1300') { // If user is a Student
                newFilterFields = [
                    { name: "academicYear", label: "Academic Year", type: "select", options: academicYearOptions },
                    { name: "semester", label: "Semester", type: "select", options: options.semesters || [] },
                ];
            } else { // If user is an Admin or Lecturer
                newFilterFields = [
                    { name: "department", label: "Department", type: "select", options: options.departments },
                    { name: "academicYear", label: "Academic Year", type: "select", options: academicYearOptions },
                    { name: "semester", label: "Semester", type: "select", options: options.semesters || [] },
                    { name: "year", label: "Year", type: "select", options: options.years || [] },
                    { name: "selectable", label: "Elective", type: "select", options: ["yes", "no"] },
                ];
            }
            
            console.log("🔧 Generated filter fields:", newFilterFields);
            setFilterFields(newFilterFields);
        }
    }, [courses, departments, filters.department, userRole]);

    const loadMoreCourses = useCallback(() => {
        if (loading || !hasMore) return;
        setLoading(true);
        setTimeout(() => {
            setPage(prev => prev + 1);
            setLoading(false);
        }, 500);
    }, [loading, hasMore]);

    // FIXED: Enhanced filter change handler with proper state management
    const handleFilterChange = useCallback((name, value) => {
        console.log(`🔄 Filter changing: ${name} = "${value}"`);
        
        setFilters(prev => {
            const newFilters = { 
                ...prev, 
                [name]: value
            };
            
            // FIXED: Reset academic year when department changes
            if (name === 'department') {
                newFilters.academicYear = 'all';
                console.log("🔄 Department changed, resetting academic year to 'all'");
            }
            
            console.log("🔄 New filters state:", newFilters);
            return newFilters;
        });
    }, []);

    const handleSearch = useCallback(() => {
        console.log("🔍 Manual search triggered with input:", searchInput);
        // The search is already applied via useEffect, this can be an explicit trigger if needed
        // Or can be removed if search is real-time via the useEffect watching searchInput
    }, [searchInput]);

    const handlePopupClose = useCallback(() => {
        setCoursePopupOpen(false);
        setEditingCourse(null);
        setEditingCourseId(null);
        setFormData(DEFAULT_COURSE_FORM_DATA);
        setErrors({});
    }, []);
    
    const handleAddCourse = useCallback(() => {
        setEditingCourse(null);
        setEditingCourseId(null);
        setFormData(DEFAULT_COURSE_FORM_DATA);
        setErrors({});
        setCoursePopupOpen(true);
    }, []);

    const handleEditCourse = useCallback((course) => {
        setEditingCourse(course);
        setEditingCourseId(course.id);
        setFormData(transformCourseForForm(course, lecturers));
        setErrors({});
        setCoursePopupOpen(true);
    }, [lecturers]);
    
    const handleDeleteCourse = useCallback(async (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await deleteCourse(id);
                initialDataFetchedRef.current = false; // Force refetch
                await fetchInitialData();
            } catch (error) {
                console.error("Failed to delete course:", error);
                alert("Failed to delete course. Please try again.");
            }
        }
    }, [fetchInitialData]);

    const handleSubmit = useCallback(async (submittedFormData) => {
        const newErrors = validateCourseData(submittedFormData);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        if (isCourseCodeExists(submittedFormData.courseCode, courses, editingCourseId)) {
            setErrors({ courseCode: "Course code already exists." });
            return;
        }

        try {
            if (editingCourseId) {
                const courseToUpdate = transformFormToCourse(submittedFormData, editingCourse);
                await updateCourse(editingCourseId, courseToUpdate);
            } else {
                const courseToCreate = transformFormToCourse(submittedFormData, null);
                await createCourse(courseToCreate);
            }
            initialDataFetchedRef.current = false; // Force refetch
            await fetchInitialData();
            handlePopupClose();
        } catch (error) {
            console.error("Failed to save course:", error);
            alert("Failed to save course. Please try again.");
        }
    }, [courses, editingCourseId, editingCourse, fetchInitialData, handlePopupClose]);
    
    const handleFieldChange = useCallback((fieldName, value) => {
        setFormData(prev => ({ 
            ...prev, 
            [fieldName]: value, 
        }));

        // Clear error for the changed field
        if (errors[fieldName]) {
            setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
            });
        }
    }, [errors]);

    const getAcademicYearOptions = useCallback((department) => {
        if (!department || !departments || departments.length === 0) return [];
    
        const dept = departments.find(d => d.name === department);
        if (!dept || !dept.totalAcademicYears) return [];
    
        return generateAcademicYearOptions(dept.totalAcademicYears);
    }, [departments]);
    
    return {
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
        handlePopupClose,
        updatedCourseFields,
        editingCourse: !!editingCourseId,
        formData,
        errors,
        getAcademicYearOptions,
    };
};

export default useCourses;