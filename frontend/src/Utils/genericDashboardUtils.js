// src/Utils/genericDashboardUtils.js - Merged Version
import { 
  Users, BookOpen, GraduationCap, CalendarDays, UserCheck, 
  Star, Award, Building, User 
} from "lucide-react";

// Student Dashboard Statistics (from current version - correct logic)
export const calculateStudentStats = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      totalStudents: 0,
      activeStudents: 0,
      graduatedStudents: 0,
      topPerformers: 0
    };
  }

  const stats = {
    // Total number of students
    totalStudents: data.length,
    
    // Active students (status === 'active' or 'Active')
    activeStudents: data.filter(student => 
      student.status && student.status.toLowerCase() === 'active'
    ).length,
    
    // Graduated students (status === 'graduated' or 'Graduated')
    graduatedStudents: data.filter(student => 
      student.status && student.status.toLowerCase() === 'graduated'
    ).length,
    
    // Top performers (students with GPA >= 3.5, or you can use different criteria)
    topPerformers: data.filter(student => {
      const gpa = parseFloat(student.gpa || student.GPA || 0);
      return gpa >= 3.5;
    }).length
  };

  return stats;
};

// Lecturer Dashboard Statistics (from current version - correct logic)
export const calculateLecturerStats = (data, departments = []) => {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      totalLecturers: 0,
      averageRating: 'N/A',
      topPerformers: 0,
      totalDepartments: Array.isArray(departments) ? departments.length : 0
    };
  }

  const stats = {
    // Total number of lecturers
    totalLecturers: data.length,
    
    // Average rating calculation
    averageRating: (() => {
      const ratingsData = data.filter(lecturer => {
        const rating = parseFloat(lecturer.rating || lecturer.Rating || 0);
        return rating > 0; // Only include valid ratings
      });
      
      if (ratingsData.length === 0) return 'N/A';
      
      const totalRating = ratingsData.reduce((sum, lecturer) => {
        return sum + parseFloat(lecturer.rating || lecturer.Rating || 0);
      }, 0);
      
      const average = totalRating / ratingsData.length;
      return average.toFixed(1); // Return as string with 1 decimal place
    })(),
    
    // Top performers (lecturers with rating >= 4.5)
    topPerformers: data.filter(lecturer => {
      const rating = parseFloat(lecturer.rating || lecturer.Rating || 0);
      return rating >= 4.5;
    }).length,
    
    // Total departments - get unique departments from lecturers or use departments array
    totalDepartments: (() => {
      if (Array.isArray(departments) && departments.length > 0) {
        return departments.length;
      }
      
      // Fallback: count unique departments from lecturer data
      const uniqueDepartments = new Set();
      data.forEach(lecturer => {
        if (lecturer.department && lecturer.department.trim()) {
          uniqueDepartments.add(lecturer.department.trim());
        }
      });
      return uniqueDepartments.size;
    })()
  };

  return stats;
};

// Form field configurations (from old version - with design elements)
export const genericDashboardFormConfigs = {
  students: {
    title: "Add New Student",
    subtitle: "Enter student information",
    icon: User,
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Enter student's full name", required: true },
      { name: "email", label: "Email Address", type: "email", placeholder: "student@example.com", required: true },
      { name: "department", label: "Department", type: "select", placeholder: "Select department", options: [], required: true },
      { name: "phoneNumber", label: "Phone Number", type: "tel", placeholder: "Enter phone number", required: false },
      { name: "academicYear", label: "Academic Year", type: "select", placeholder: "Select academic year", options: [], required: true },
      { name: "status", label: "Status", type: "select", placeholder: "Select status", options: ["Active", "Inactive", "Graduated"], required: true }
    ]
  },
  lecturers: {
    title: "Add New Lecturer",
    subtitle: "Enter lecturer information",
    icon: UserCheck,
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Enter lecturer's full name", required: true },
      { name: "email", label: "Email Address", type: "email", placeholder: "lecturer@university.edu", required: true },
      { name: "department", label: "Department", type: "select", placeholder: "Select department", options: [], required: true },
      { name: "phoneNumber", label: "Phone Number", type: "tel", placeholder: "Enter phone number", required: false },
      { name: "specialization", label: "Specialization", type: "text", placeholder: "e.g., Artificial Intelligence", required: true },
      { name: "employmentType", label: "Employment Type", type: "select", placeholder: "Select employment type", options: ["Full-time", "Part-time", "Contract"], required: true },
      { name: "experience", label: "Years of Experience", type: "number", placeholder: "Enter years of experience", required: true },
      { name: "rating", label: "Rating", type: "number", placeholder: "Enter rating (1-5)", min: 1, max: 5, step: 0.1 },
      { name: "status", label: "Status", type: "select", placeholder: "Select status", options: ["Active", "Inactive"], required: true },
    ]
  }
};

// Dashboard configurations (merged - correct logic + design elements)
export const genericDashboardConfigs = {
  students: {
    title: "Student Management System",
    subtitle: "Manage students across departments, academic years, and learning groups",
    entityName: "student",
    primaryFilter: "department",
    primaryFilterLabel: "Departments",
    
    // Statistics calculation function (correct logic from current version)
    stats: {
      totalStudents: (data) => calculateStudentStats(data).totalStudents,
      activeStudents: (data) => calculateStudentStats(data).activeStudents,
      graduatedStudents: (data) => calculateStudentStats(data).graduatedStudents,
      topPerformers: (data) => calculateStudentStats(data).topPerformers,
      // Legacy support for old function names
      total: (data) => calculateStudentStats(data).totalStudents,
      active: (data) => calculateStudentStats(data).activeStudents,
      graduated: (data) => calculateStudentStats(data).graduatedStudents,
      upcoming: () => 10 // Keep this as placeholder for upcoming events
    },
    
    // Dashboard cards configuration (design from old version)
    cards: [
      {
        id: 'total-students',
        title: 'Total Students',
        statKey: 'totalStudents',
        icon: <Users />,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        description: "All registered students"
      },
      {
        id: 'active-students',
        title: 'Active Students',
        statKey: 'activeStudents',
        icon: <BookOpen />,
        gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        description: "Currently enrolled students"
      },
      {
        id: 'graduated-students',
        title: 'Graduated',
        statKey: 'graduatedStudents',
        icon: <GraduationCap />,
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        description: "Students who have graduated"
      },
      {
        id: 'top-performers',
        title: 'Top Performers',
        statKey: 'topPerformers',
        icon: <Star />,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        description: "Students with GPA ≥ 3.5"
      }
    ],
    
    // Filters configuration
    secondaryFilters: [
      { label: "Academic Years", name: "academicYear", type: "select" },
      { label: "Learning Groups", name: "learningGroup", type: "select" },
      { label: "Status", name: "status", type: "buttons" }
    ]
  },

  lecturers: {
    title: "Lecturer Management System",
    subtitle: "Manage lecturers across departments, specializations, and employment status",
    entityName: "lecturer",
    primaryFilter: "department",
    primaryFilterLabel: "Departments",
    
    // Statistics calculation function (correct logic from current version)
    stats: {
      totalLecturers: (data, departments) => calculateLecturerStats(data, departments).totalLecturers,
      averageRating: (data, departments) => calculateLecturerStats(data, departments).averageRating,
      topPerformers: (data, departments) => calculateLecturerStats(data, departments).topPerformers,
      totalDepartments: (data, departments) => calculateLecturerStats(data, departments).totalDepartments,
      // Legacy support for old function names
      totalActive: (data) => data.filter(item => item.status === "Active").length,
      avgRating: (data, departments) => calculateLecturerStats(data, departments).averageRating,
      departmentCount: (data, departments) => calculateLecturerStats(data, departments).totalDepartments
    },
    
    // Dashboard cards configuration (design from old version + correct stat keys)
    cards: [
      {
        id: 'total-lecturers',
        title: 'Total Lecturers',
        statKey: 'totalLecturers',
        icon: <UserCheck />,
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        description: "All registered lecturers"
      },
      {
        id: 'average-rating',
        title: 'Average Rating',
        statKey: 'averageRating',
        icon: <Star />,
        gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        description: "Overall lecturer rating"
      },
      {
        id: 'top-performers',
        title: 'Top Performers',
        statKey: 'topPerformers',
        icon: <Award />,
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        description: "Lecturers with rating ≥ 4.5"
      },
      {
        id: 'total-departments',
        title: 'Departments',
        statKey: 'totalDepartments',
        icon: <Building />,
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        description: "Total departments"
      }
    ],
    
    // Filters configuration
    secondaryFilters: [
      { label: "Specializations", name: "specialization", type: "select" },
      { label: "Employment Types", name: "employmentType", type: "select" },
      { label: "Experience Years", name: "experience", type: "buttons" }
    ]
  }
};

/**
 * Get dashboard configuration for entity type (from current version)
 */
export const getGenericDashboardConfig = (entityType) => {
  return genericDashboardConfigs[entityType] || genericDashboardConfigs.students;
};

/**
 * Get form configuration for entity type (from old version - with design)
 */
export const getGenericDashboardFormConfig = (entityType, options = {}) => {
  const { departments = [], academicYears = [] } = options;
  const baseConfig = genericDashboardFormConfigs[entityType];

  if (!baseConfig) return null;

  const fields = baseConfig.fields.map(field => ({ ...field }));

  if (departments.length > 0) {
    const departmentField = fields.find(field => field.name === 'department');
    if (departmentField) {
      departmentField.options = Array.isArray(departments[0]) 
        ? departments.map(d => d.name) 
        : departments;
    }
  }

  if (entityType === 'students' && academicYears.length > 0) {
    const academicYearField = fields.find(field => field.name === 'academicYear');
    if (academicYearField) {
      academicYearField.options = academicYears;
    }
  }

  return { ...baseConfig, fields };
};

/**
 * Helper function to get primary options (from current version)
 */
export const getPrimaryOptions = (data, primaryFilterField) => {
  if (!Array.isArray(data) || !primaryFilterField) {
    return ["All"];
  }
  
  try {
    const uniqueValues = new Set(["All"]);
    data.forEach(item => {
      if (item[primaryFilterField] && item[primaryFilterField].trim()) {
        uniqueValues.add(item[primaryFilterField].trim());
      }
    });
    
    return Array.from(uniqueValues);
  } catch (error) {
    console.error('Error generating primary options:', error);
    return ["All"];
  }
};

/**
 * Helper function to get filter options (from current version)
 */
export const getFilterOptions = (fieldName, data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  try {
    const uniqueValues = new Set();
    data.forEach(item => {
      if (item[fieldName] && item[fieldName].toString().trim()) {
        uniqueValues.add(item[fieldName].toString().trim());
      }
    });
    
    return Array.from(uniqueValues).sort();
  } catch (error) {
    console.error(`Error generating options for ${fieldName}:`, error);
    return [];
  }
};

/**
 * Prepare filters for DynamicFilter component (from old version)
 */
export const prepareGenericDashboardDynamicFilters = (data, secondaryFilters) => {
  if (!secondaryFilters || !Array.isArray(secondaryFilters)) return [];
  
  return secondaryFilters
    .filter(filter => filter.type === "select")
    .map(filter => ({
      label: filter.label,
      name: filter.name,
      title: filter.name,
      options: getFilterOptions(filter.name, data)
    }));
};

/**
 * Get button filters from configuration (from old version)
 */
export const getGenericDashboardButtonFilters = (secondaryFilters) => {
  if (!secondaryFilters || !Array.isArray(secondaryFilters)) return [];
  
  return secondaryFilters.filter(filter => filter.type === "buttons");
};

/**
 * Generate dashboard cards with calculated stats (from old version)
 */
export const generateGenericDashboardCards = (cards, stats) => {
  if (!cards || !Array.isArray(cards)) return [];
  
  return cards.map(card => ({
    ...card,
    value: (stats[card.statKey] ?? 0).toString()
  }));
};

/**
 * Secure navigation to profile (from old version)
 */
export const navigateGenericDashboardToProfile = (item, entityName, data, navigate) => {
  try {
    // Comprehensive validation
    if (!item || !item.id || !entityName || !data || !navigate) {
      console.warn('Invalid navigation parameters');
      return false;
    }

    // Sanitize and validate ID
    const sanitizedId = parseInt(item.id);
    if (isNaN(sanitizedId) || sanitizedId <= 0) {
      console.warn('Invalid ID for navigation');
      return false;
    }

    // Verify entity exists in data
    const entityExists = data.some(entity => entity.id === sanitizedId);
    if (!entityExists) {
      console.warn('Entity not found in data');
      return false;
    }

    // Build secure URL
    const targetUrl = `/profile/${entityName}/${sanitizedId}`;
    
    console.log('🚀 Secure navigation:', {
      entityType: entityName,
      id: sanitizedId,
      targetUrl,
      entityData: { id: item.id, name: item.name }
    });

    navigate(targetUrl);
    return true;
    
  } catch (error) {
    console.error('Navigation error:', error);
    return false;
  }
};

/**
 * Handle card click actions (from old version)
 */
export const handleGenericDashboardCardAction = (card, setPrimaryFilter, setFilterValues) => {
  if (!card?.id) return;
  
  try {
    switch (card.id) {
      case 'total-students':
      case 'total-lecturers':
        setPrimaryFilter("All");
        setFilterValues({});
        break;
      case 'active-students':
        setFilterValues(prev => ({ ...prev, status: 'Active' }));
        break;
      case 'graduated-students':
        setFilterValues(prev => ({ ...prev, status: 'Graduated' }));
        break;
      case 'top-performers':
        console.log('🏆 Show top performers filter');
        // Add specific filter logic here
        break;
      default:
        console.log(`📊 Card action not defined for: ${card.id}`);
    }
  } catch (error) {
    console.error('Card action error:', error);
  }
};

/**
 * Get dynamic title for filters based on entity type (from old version)
 */
export const getGenericDashboardFilterTitle = (entityType) => {
  const titles = {
    students: "Student Filters",
    lecturers: "Lecturer Filters"
  };
  
  return titles[entityType] || "Filters";
};

/**
 * Apply filters to data (from old version)
 */
export const applyGenericDashboardFilters = (data, primaryFilter, primaryFilterKey, filterValues) => {
  if (!data || !Array.isArray(data)) return [];
  
  try {
    let filtered = [...data];
    
    // Apply primary filter
    if (primaryFilter && primaryFilter !== "All") {
      filtered = filtered.filter(item => item[primaryFilterKey] === primaryFilter);
    }
    
    // Apply secondary filters
    Object.entries(filterValues || {}).forEach(([key, value]) => {
      if (value && value !== "all" && value !== undefined) {
        filtered = filtered.filter(item => item[key] === value);
      }
    });
    
    return filtered;
  } catch (error) {
    console.error('Filter application error:', error);
    return data;
  }
};

/**
 * Calculate statistics from filtered data (enhanced from old version)
 */
export const calculateGenericDashboardStats = (data, statsConfig, departments = []) => {
  if (!data || !Array.isArray(data) || !statsConfig) return {};
  
  try {
    return Object.entries(statsConfig).reduce((acc, [key, calculator]) => {
      try {
        // Pass departments parameter for lecturer stats
        acc[key] = calculator(data, departments);
      } catch (error) {
        console.error(`Error calculating stat ${key}:`, error);
        acc[key] = 0;
      }
      return acc;
    }, {});
  } catch (error) {
    console.error('Stats calculation error:', error);
    return {};
  }
};

/**
 * Validate entity data structure (from old version)
 */
export const validateGenericDashboardEntityData = (data, requiredFields = ['id']) => {
  if (!data || !Array.isArray(data)) return false;
  
  return data.every(item => {
    return requiredFields.every(field => 
      item.hasOwnProperty(field) && item[field] !== undefined && item[field] !== null
    );
  });
};

/**
 * Format display value for UI (from old version)
 */
export const formatGenericDashboardDisplayValue = (value, type = 'default') => {
  if (value === null || value === undefined) return 'N/A';
  
  switch (type) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : value;
    case 'percentage':
      return typeof value === 'number' ? `${value}%` : value;
    case 'currency':
      return typeof value === 'number' ? `$${value.toLocaleString()}` : value;
    default:
      return value.toString();
  }
};