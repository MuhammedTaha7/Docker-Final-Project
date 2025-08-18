
import studentsData from "../../Static/students";
import lecturersData from "../../Static/lecturers";
import { 
  studentGrades, 
  studentRequests, 
  studentEnrollments,
  lecturerCourses,
  lecturerSchedule,
  lecturerEvaluations 
} from "../../Static/ProfileData";

import { 
  BookOpen, Award, GraduationCap, Clock, Calendar, TrendingUp,
  Users, Star, Building
} from "lucide-react";

export const profileConfigs = {
  student: {
    dataSource: studentsData || [],
    sections: ["overview", "grades", "requests", "enrollments"],
    sectionLabels: {
      overview: "Overview",
      grades: "Academic Records", 
      requests: "Requests",
      enrollments: "Current Enrollments"
    },
    getProfileData: (id) => {
      // Backend placeholder
      /*
      const response = await fetch(`/api/students/${id}`);
      if (!response.ok) throw new Error('Failed to fetch student data');
      const studentData = await response.json();
      return {
        student: studentData.student,
        grades: studentData.grades,
        requests: studentData.requests,
        enrollments: studentData.enrollments
      };
      */
      const student = studentsData?.find(s => s.id === parseInt(id));
      if (!student) return { student: null, grades: [], requests: [], enrollments: [] };
      
      return {
        student,
        grades: studentGrades?.filter(g => g.studentId === parseInt(id)) || [],
        requests: studentRequests?.filter(r => r.studentId === parseInt(id)) || [],
        enrollments: studentEnrollments?.filter(e => e.studentId === parseInt(id)) || []
      };
    },
    getStats: (data) => {// Backend placeholder
      /*      const response = await fetch(`/api/students/${id}/stats`);
      if (!response.ok) throw new Error('Failed to fetch student stats');    
      const stats = await response.json();
      return stats;
      */
      const { grades, requests, enrollments, student } = data;
      if (!student) return {};
      
      return {
        totalCredits: grades?.reduce((sum, g) => sum + (g.credits || 0), 0) || 0,
        completedCourses: grades?.length || 0,
        pendingRequests: requests?.filter(r => r.status === "pending").length || 0,
        currentEnrollments: enrollments?.length || 0,
        gpa: student.gpa || 0,
        academicYear: student.academicYear || "N/A"
      };
    },
    getStatCards: (stats) => [
      {
        id: "total-credits", title: "Total Credits", value: stats.totalCredits?.toString() || "0",
        icon: <BookOpen />, gradient: "linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%)",
      },
      {
        id: "completed-courses", title: "Completed Courses", value: stats.completedCourses?.toString() || "0",
        icon: <Award />, gradient: "linear-gradient(135deg,#10b981 0%,#047857 100%)",
      },
      {
        id: "current-gpa", title: "Current GPA", value: stats.gpa?.toFixed(2) || "0.00",
        icon: <GraduationCap />, gradient: "linear-gradient(135deg,#f59e0b 0%,#d97706 100%)",
      },
      {
        id: "pending-requests", title: "Pending Requests", value: stats.pendingRequests?.toString() || "0",
        icon: <Clock />, gradient: "linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)",
      },
      {
        id: "current-enrollments", title: "Current Enrollments", value: stats.currentEnrollments?.toString() || "0",
        icon: <Calendar />, gradient: "linear-gradient(135deg,#06b6d4 0%,#0891b2 100%)",
      },
      {
        id: "academic-year", title: "Academic Year", value: stats.academicYear || "N/A",
        icon: <TrendingUp />, gradient: "linear-gradient(135deg,#84cc16 0%,#65a30d 100%)",
      },
    ]
  },
  lecturer: {
    dataSource: lecturersData || [],
    sections: ["overview", "courses", "schedule", "resources"],
    sectionLabels: {
      overview: "Overview",
      courses: "Teaching Courses",
      schedule: "Teaching Schedule",
      resources: "Resources & Materials"
    },
    getProfileData: (id) => {
      // Backend placeholder
      /*
      const response = await fetch(`/api/lecturers/${id}`);
      if (!response.ok) throw new Error('Failed to fetch lecturer data');
      const lecturerData = await response.json();
      return {
        lecturer: lecturerData.lecturer,
        courses: lecturerData.courses,
        schedule: lecturerData.schedule,
        evaluations: lecturerData.evaluations
      };
      */
      const lecturer = lecturersData?.find(l => l.id === parseInt(id));
      if (!lecturer) return { lecturer: null, courses: [], schedule: [], evaluations: [] };
      
      return {
        lecturer,
        courses: lecturerCourses?.filter(c => c.lecturerId === parseInt(id)) || [],
        schedule: lecturerSchedule?.filter(s => s.lecturerId === parseInt(id)) || [],
        evaluations: lecturerEvaluations?.filter(e => e.lecturerId === parseInt(id)) || []
      };
    },
    getStats: (data) => {
      const { courses, evaluations, lecturer, schedule } = data;
      if (!lecturer) return {};
      
      const avgRating = evaluations?.length > 0 
        ? evaluations.reduce((sum, e) => sum + (e.rating || 0), 0) / evaluations.length 
        : 0;
      
      return {
        activeCourses: courses?.filter(c => c.status === "active").length || 0,
        totalStudents: courses?.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0) || 0,
        avgRating,
        weeklyHours: schedule?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0,
        experience: lecturer.experience ? new Date().getFullYear() - parseInt(lecturer.experience) : 0,
        department: lecturer.department?.replace("-", " ").toUpperCase() || "N/A"
      };
    },
    getStatCards: (stats) => [
      {
        id: "active-courses", title: "Active Courses", value: stats.activeCourses?.toString() || "0",
        icon: <BookOpen />, gradient: "linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%)",
      },
      {
        id: "total-students", title: "Total Students", value: stats.totalStudents?.toString() || "0",
        icon: <Users />, gradient: "linear-gradient(135deg,#10b981 0%,#047857 100%)",
      },
      {
        id: "avg-rating", title: "Average Rating", value: stats.avgRating?.toFixed(1) || "0.0",
        icon: <Star />, gradient: "linear-gradient(135deg,#f59e0b 0%,#d97706 100%)",
      },
      {
        id: "weekly-hours", title: "Weekly Hours", value: stats.weeklyHours?.toString() || "0",
        icon: <Clock />, gradient: "linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)",
      },
      {
        id: "experience-years", title: "Experience (Years)", value: stats.experience?.toString() || "0",
        icon: <Award />, gradient: "linear-gradient(135deg,#06b6d4 0%,#0891b2 100%)",
      },
      {
        id: "department", title: "Department", value: stats.department || "N/A",
        icon: <Building />, gradient: "linear-gradient(135deg,#84cc16 0%,#65a30d 100%)",
      },
    ]
  }
};
