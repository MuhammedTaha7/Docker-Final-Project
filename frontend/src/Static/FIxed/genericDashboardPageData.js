import studentsData from "../Static/students";
import lecturersData from "../Static/lecturers";
import { Users, BookOpen, GraduationCap, CalendarDays, UserCheck, Star, Award, Building } from "lucide-react";

export const genericDashboardConfigs = {
  students: {
    title: "Student Management System",
    subtitle: "Manage students across divisions, academic years, and learning groups",
    data: studentsData || [],
    entityName: "student",
    primaryFilter: "division",
    primaryFilterLabel: "Divisions",
    secondaryFilters: [
      { label: "Academic Years", name: "academicYear", type: "select" },
      { label: "Learning Groups", name: "learningGroup", type: "select" },
      { label: "Graduation Years", name: "graduationYear", type: "buttons" },
    ],
    stats: {
      total: (data) => data.length,
      active: (data) => data.filter((item) => item.status === "Active").length,
      graduated: (data) => data.filter((item) => item.status === "Graduated").length,
      upcoming: () => 10,
    },
    cards: [
      {
        id: "total-students",
        title: "Total Students",
        statKey: "total",
        icon: <Users />,
        gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      },
      {
        id: "active-students",
        title: "Active Students",
        statKey: "active",
        icon: <BookOpen />,
        gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
      },
      {
        id: "graduated",
        title: "Graduated",
        statKey: "graduated",
        icon: <GraduationCap />,
        gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      },
      {
        id: "upcoming-events",
        title: "Upcoming Events",
        statKey: "upcoming",
        icon: <CalendarDays />,
        gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      },
    ],
  },
  lecturers: {
    title: "Lecturer Management System",
    subtitle: "Manage lecturers across departments, specializations, and employment status",
    data: lecturersData || [],
    entityName: "lecturer",
    primaryFilter: "department",
    primaryFilterLabel: "Departments",
    secondaryFilters: [
      { label: "Specializations", name: "specialization", type: "select" },
      { label: "Employment Types", name: "employmentType", type: "select" },
      { label: "Experience Years", name: "experience", type: "buttons" },
    ],
    stats: {
      totalActive: (data) => data.filter((item) => item.status === "Active").length,
      avgRating: (data) => {
        const ratings = data.filter((item) => item.rating && item.status === "Active").map((item) => item.rating);
        return ratings.length > 0 ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1) : "N/A";
      },
      topPerformers: (data) => data.filter((item) => item.rating >= 4.5 && item.status === "Active").length,
      departmentCount: (data) => new Set(data.filter((item) => item.status === "Active").map((item) => item.department)).size,
    },
    cards: [
      {
        id: "active-lecturers",
        title: "Active Lecturers",
        statKey: "totalActive",
        icon: <UserCheck />,
        gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      },
      {
        id: "avg-rating",
        title: "Average Rating",
        statKey: "avgRating",
        icon: <Star />,
        gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
      },
      {
        id: "top-performers",
        title: "Top Performers (4.5+)",
        statKey: "topPerformers",
        icon: <Award />,
        gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      },
      {
        id: "active-departments",
        title: "Active Departments",
        statKey: "departmentCount",
        icon: <Building />,
        gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      },
    ],
  },
};