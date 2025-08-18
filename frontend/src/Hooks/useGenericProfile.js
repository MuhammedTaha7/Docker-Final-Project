// useGenericProfile.js - Custom Hook for Generic Profile
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as profileAPI from "../Api/genericProfilePageApi";
import { getStatCards } from "../Utils/genericProfileUtils.js";

export const useGenericProfile = (initialSection = "overview") => {
  const { entityType, id } = useParams();
  const navigate = useNavigate();

  // Core state
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({});
  const [statCards, setStatCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [activeSection, setActiveSection] = useState(initialSection);
  const [selectedYear, setSelectedYear] = useState("");
  const [showActions, setShowActions] = useState(false);

  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState(new Map());
  const [fileUploadProgress, setFileUploadProgress] = useState({});

  // Modal states
  const [grades, setGrades] = useState([]);
  const [editGradeModalOpen, setEditGradeModalOpen] = useState(false);
  const [addGradeModalOpen, setAddGradeModalOpen] = useState(false);
  const [editCourseModalOpen, setEditCourseModalOpen] = useState(false);
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [editEnrollmentModalOpen, setEditEnrollmentModalOpen] = useState(false);
  const [addEnrollmentModalOpen, setAddEnrollmentModalOpen] = useState(false);
  const [editScheduleModalOpen, setEditScheduleModalOpen] = useState(false);
  const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false);
  const [editResourceModalOpen, setEditResourceModalOpen] = useState(false);
  const [addResourceModalOpen, setAddResourceModalOpen] = useState(false);
  const [viewRequestModalOpen, setViewRequestModalOpen] = useState(false);
  const [responseRequestModalOpen, setResponseRequestModalOpen] =
    useState(false);

  // Form state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({});
  const [requestResponse, setRequestResponse] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [viewMessageModalOpen, setViewMessageModalOpen] = useState(false);
  const [replyMessageModalOpen, setReplyMessageModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const validEntityTypes = ["student", "lecturer"];
      if (!entityType || !validEntityTypes.includes(entityType)) {
        throw new Error(`Invalid entity type: "${entityType}"`);
      }
      if (!id || id.trim() === "") {
        throw new Error(`Invalid ID: "${id}"`);
      }

      // 1. Get core profile data
      const coreData = await profileAPI.getProfileData(entityType, id);

      // 2. Get messages
      const messages = await profileAPI.getMessages(entityType, id);

      // 3. Get enrollments (for students)
      let enrollments = [];
      if (entityType === "student") {
        const studentEnrollments = await profileAPI.getStudentEnrollments(id);
        enrollments = studentEnrollments.map((course) => ({
          courseCode: course.courseCode,
          courseName: course.courseName,
          credits: course.credits,
          semester: course.semester,
          lecturer: course.lecturer,
          status: course.status,
        }));
      }

      // 4. ✅ Get schedules (for lecturers)
      let schedules = [];
      if (entityType === "lecturer") {
        const scheduleData = await profileAPI.getSchedule(entityType, id);
        schedules = scheduleData.map((item) => ({
          id: item.id,
          day: item.day,
          startTime: item.startTime,
          endTime: item.endTime,
          availability: item.availability,
          notes: item.notes,
        }));
      }

      // 5. ✅ Get resources (for lecturers)
      let resources = [];
      if (entityType === "lecturer") {
        const resourceData = await profileAPI.getResources(entityType, id);
        resources = resourceData.map((item) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          description: item.description,
          date: item.date || "",
          institution: item.institution || "",
          url: item.url || "",
          tags: item.tags || "",
          fileName: item.fileName || "",
          size: item.size || 0,
          uploadDate: item.uploadDate || "",
          downloads: item.downloads || 0,
          rating: item.rating || 0,
        }));
      }

      // 6. ✅ Get courses (for lecturers)
      let courses = [];
      if (entityType === "lecturer") {
        const courseData = await profileAPI.getCourses(entityType, id);
        courses = courseData.map((course) => ({
          courseCode: course.courseCode,
          courseName: course.courseName,
          credits: course.credits,
          semester: course.semester,
          department: course.department,
          classSize: course.classSize,
          status: course.status || "Active",
          description: course.description,
          notes: course.notes,
        }));
      }

      // 6. Build complete profile data
      const completeProfileData = {
        ...coreData,
        enrollments,
        courses,
        schedules,
        resources,
        messages,
      };

      setProfileData(completeProfileData);

      // 7. Compute stats and generate cards
      let computedStats = {};
      const grades = completeProfileData.grades || [];

      // Compute basic stats
      if (entityType === "student") {
        computedStats = {
          gpa: completeProfileData.gpa || 0,
          completedCourses: grades.length,
          totalCredits: grades.reduce((sum, g) => sum + (g.credits || 0), 0),
          currentEnrollments: enrollments.filter((e) => e.status === "enrolled")
            .length,
          status: completeProfileData.status,
        };
      } else {
        // For lecturer, use default stats (if needed)
        computedStats = stats || {};
      }

      setStats(computedStats);

      // Generate cards using our new utility
      const cards = getStatCards(
        entityType,
        computedStats,
        completeProfileData
      );
      setStatCards(cards);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err.message || "Failed to load profile data");
      navigate("/dashboard", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [entityType, id, navigate]);

  const handleViewMessage = useCallback((message) => {
    setSelectedMessage(message);
    setViewMessageModalOpen(true);
  }, []);

  const handleReplyMessage = useCallback((message) => {
    setSelectedMessage(message);
    setReplyText("");
    setReplyMessageModalOpen(true);
  }, []);

  const handleSendReply = useCallback(async () => {
    if (!replyText.trim()) {
      alert("Please enter a reply message");
      return;
    }

    try {
      // Call your API to send reply
      await profileAPI.sendMessageReply(selectedMessage.id, {
        replyContent: replyText,
      });
      alert("Reply sent successfully!");
      setReplyMessageModalOpen(false);
      setReplyText("");
      await loadProfile(); // Refresh the messages
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply. Please try again.");
    }
  }, [replyText, selectedMessage, loadProfile]);

  // Grade handlers
  const handleEditGrade = useCallback((row) => {
    setSelectedRecord(row);
    setFormData({
      courseCode: row.courseCode,
      courseName: row.courseName,
      grade: row.grade,
    });
    setEditGradeModalOpen(true);
  }, []);

  const handleAddGrade = useCallback(() => {
    setSelectedRecord(null);
    setFormData({});
    setAddGradeModalOpen(true);
  }, []);

  const handleGradeSubmit = useCallback(
    async (formData) => {
      try {
        if (formData.grade < 0 || formData.grade > 100) {
          throw new Error("Grade must be between 0 and 100");
        }

        if (selectedRecord) {
          await profileAPI.updateGrade(
            entityType,
            id,
            selectedRecord.id,
            formData
          );
          setEditGradeModalOpen(false);
        } else {
          await profileAPI.addGrade(entityType, id, formData);
          setAddGradeModalOpen(false);
        }

        await loadProfile();
        setSelectedRecord(null);
        setFormData({});
      } catch (error) {
        console.error("Error submitting grade:", error);
        alert(error.message);
      }
    },
    [selectedRecord, entityType, id, loadProfile]
  );

  // Course handlers

  const handleAddCourse = useCallback(() => {
    setSelectedRecord(null);
    setFormData({});
    setAddCourseModalOpen(true);
  }, []);

  const handleCourseSubmit = useCallback(
    async (formData) => {
      try {
        if (selectedRecord) {
          await profileAPI.updateCourse(
            entityType,
            id,
            selectedRecord.id,
            formData
          );
          setEditCourseModalOpen(false);
        } else {
          await profileAPI.addCourse(entityType, id, formData);
          setAddCourseModalOpen(false);
        }

        await loadProfile();
        setSelectedRecord(null);
        setFormData({});
      } catch (error) {
        console.error("Error submitting course:", error);
        alert(error.message);
      }
    },
    [selectedRecord, entityType, id, loadProfile]
  );

  // Enrollment handlers
  const handleEditEnrollment = useCallback((row) => {
    setSelectedRecord(row);
    setFormData({
      courseCode: row.courseCode,
      courseName: row.courseName,
      credits: row.credits,
      semester: row.semester,
      instructor: row.instructor,
      status: row.status || "enrolled",
    });
    setEditEnrollmentModalOpen(true);
  }, []);

  const handleAddEnrollment = useCallback(() => {
    setSelectedRecord(null);
    setFormData({});
    setAddEnrollmentModalOpen(true);
  }, []);

  const handleEnrollmentSubmit = useCallback(
    async (formData) => {
      try {
        if (selectedRecord) {
          await profileAPI.updateEnrollment(
            entityType,
            id,
            selectedRecord.id,
            formData
          );
          setEditEnrollmentModalOpen(false);
        } else {
          await profileAPI.addEnrollment(entityType, id, formData);
          setAddEnrollmentModalOpen(false);
        }

        await loadProfile();
        setSelectedRecord(null);
        setFormData({});
      } catch (error) {
        console.error("Error submitting enrollment:", error);
        alert(error.message);
      }
    },
    [selectedRecord, entityType, id, loadProfile]
  );

  // Schedule handlers
  const handleEditSchedule = useCallback((row) => {
    setSelectedRecord(row);
    setFormData({
      day: row.day,
      startTime: row.startTime,
      endTime: row.endTime,
      availability: row.availability,
      notes: row.notes || "",
    });
    setEditScheduleModalOpen(true);
  }, []);

  const handleAddSchedule = useCallback(() => {
    setSelectedRecord(null);
    setFormData({});
    setAddScheduleModalOpen(true);
  }, []);

  const handleScheduleSubmit = useCallback(
    async (formData) => {
      try {
        if (formData.startTime >= formData.endTime) {
          throw new Error("End time must be after start time");
        }

        if (selectedRecord) {
          await profileAPI.updateSchedule(
            entityType,
            id,
            selectedRecord.id,
            formData
          );
          setEditScheduleModalOpen(false);
        } else {
          await profileAPI.addSchedule(entityType, id, formData);
          setAddScheduleModalOpen(false);
        }

        await loadProfile();
        setSelectedRecord(null);
        setFormData({});
      } catch (error) {
        console.error("Error submitting schedule:", error);
        alert(error.message);
      }
    },
    [selectedRecord, entityType, id, loadProfile]
  );

  const handleAddResource = useCallback(() => {
    setSelectedRecord(null);
    setFormData({});
    setAddResourceModalOpen(true);
  }, []);


  const handleDownloadResource = useCallback(
    async (row) => {
      try {
        if (row.id) {
          // Use the same endpoint structure as your working download
          window.open(
            `http://localhost:8080/api/resources/${row.id}/download`,
            "_blank"
          );

          // Optional: Update download count after successful download
          await loadProfile();
        } else {
          console.error(
            "No download method available for resource:",
            row.title
          );
          alert("Unable to download resource.");
        }
      } catch (error) {
        console.error("Download error:", error);
        alert("Error downloading file. Please try again.");
      }
    },
    [loadProfile]
  );

  // New delete handler
  const handleDeleteResource = useCallback(
    async (row) => {
      // Confirm before deleting
      if (
        !window.confirm(
          `Are you sure you want to delete "${row.title}"? This action cannot be undone.`
        )
      ) {
        return;
      }

      try {
        await profileAPI.deleteResource(entityType, id, row.id);
        await loadProfile(); // Refresh the data
        alert("Resource deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        alert("Error deleting resource. Please try again.");
      }
    },
    [entityType, id, loadProfile]
  );

  // Request handlers
  const handleViewRequest = useCallback((row) => {
    setSelectedRecord(row);
    setViewRequestModalOpen(true);
  }, []);

  const handleResponseRequest = useCallback((row) => {
    setSelectedRecord(row);
    setRequestResponse("");
    setResponseRequestModalOpen(true);
  }, []);

  // Card click handler
  const handleCardClick = useCallback((card) => {
    const sectionMap = {
      "completed-courses": "grades",
      "active-courses": "courses",
      "pending-requests": "requests",
      "current-enrollments": "enrollments",
      "avg-rating": "resources",
      "total-students": "resources",
      "weekly-hours": "schedule",
      "cv-status": "resources",
      "education-records": "resources",
      "research-projects": "resources",
      "career-milestones": "resources",
    };

    if (sectionMap[card.id]) {
      setActiveSection(sectionMap[card.id]);
    }
  }, []);

  // Load profile on mount
  useEffect(() => {
    if (entityType && id) {
      loadProfile();
    } else {
      setError("Missing required parameters");
      setLoading(false);
    }
  }, [entityType, id, loadProfile]);

  return {
    // State
    profileData,
    stats,
    statCards,
    loading,
    error,
    activeSection,
    selectedYear,
    showActions,
    uploadedFiles,
    fileUploadProgress,

    // Modal states
    grades,
    editGradeModalOpen,
    addGradeModalOpen,
    editCourseModalOpen,
    addCourseModalOpen,
    editEnrollmentModalOpen,
    addEnrollmentModalOpen,
    editScheduleModalOpen,
    addScheduleModalOpen,
    editResourceModalOpen,
    addResourceModalOpen,
    viewRequestModalOpen,
    responseRequestModalOpen,

    // Form state
    selectedRecord,
    formData,
    requestResponse,

    // Message related state
    selectedMessage,
    viewMessageModalOpen,
    replyMessageModalOpen,
    replyText,

    // Message handlers
    handleViewMessage,
    handleReplyMessage,
    handleSendReply,
    setReplyText,
    setViewMessageModalOpen,
    setReplyMessageModalOpen,

    // Setters
    setActiveSection,
    setSelectedYear,
    setShowActions,
    setUploadedFiles,
    setEditGradeModalOpen,
    setAddGradeModalOpen,
    setEditCourseModalOpen,
    setAddCourseModalOpen,
    setEditEnrollmentModalOpen,
    setAddEnrollmentModalOpen,
    setEditScheduleModalOpen,
    setAddScheduleModalOpen,
    setEditResourceModalOpen,
    setAddResourceModalOpen,
    setViewRequestModalOpen,
    setResponseRequestModalOpen,
    setRequestResponse,

    // Handlers
    handleEditGrade,
    handleAddGrade,
    handleGradeSubmit,
    handleAddCourse,
    handleCourseSubmit,
    handleEditEnrollment,
    handleAddEnrollment,
    handleEnrollmentSubmit,
    handleEditSchedule,
    handleAddSchedule,
    handleScheduleSubmit,
    handleAddResource,
    handleDownloadResource,
    handleDeleteResource,
    handleViewRequest,
    handleResponseRequest,
    handleCardClick,

    // Derived data
    entityType,
    id,
    mainEntity: profileData
      ? {
          ...profileData,
          id: profileData._id?.$oid || profileData.id,
          phone: profileData.phoneNumber,
          // Add student-specific fields
          ...(entityType === "student" && {
            gpa: stats?.gpa || "N/A",
            major: profileData.department,
            academicYear: profileData.academicYear,
            status: profileData.status,
          }),
          // Add lecturer-specific fields
          ...(entityType === "lecturer" && {
            activeCourses: Array.isArray(profileData?.courses)
              ? profileData.courses.length
              : 0,
          }),
        }
      : null, // Add these for the other tables
    grades: profileData ? profileData.grades : [],
    courses: profileData ? profileData.courses : [],
    enrollments: profileData ? profileData.enrollments : [],
    messages: profileData ? profileData.messages : [],
    schedules: profileData ? profileData.schedules : [],
    resources: profileData ? profileData.resources : [],
  };
};
