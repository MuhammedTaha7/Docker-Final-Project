// hooks/useGenericDashboard.js (UPDATED with departments support)
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as genericDashboardAPI from "../Api/GenericDashboardApi";
import { getGenericDashboardConfig, getPrimaryOptions, getFilterOptions } from "../Utils/genericDashboardUtils";

const useGenericDashboard = (entityType) => {
  const navigate = useNavigate();
  
  // Get config once and memoize it
  const config = useMemo(() => getGenericDashboardConfig(entityType), [entityType]);
  
  // State management
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]); // 🆕 Add departments state
  const [primaryFilter, setPrimaryFilter] = useState("All");
  const [filterValues, setFilterValues] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use ref to prevent infinite loops in navigation function
  const dataRef = useRef([]);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Memoized fetch function to prevent infinite re-renders
  const fetchData = useCallback(async () => {
    if (!config) {
      navigate("/students");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch both main data and departments
      const [result, departmentsResult] = await Promise.all([
        genericDashboardAPI.getData(entityType),
        genericDashboardAPI.getAllDepartments().catch(err => {
          console.warn("Failed to fetch departments:", err);
          return [];
        })
      ]);
      
      // Ensure we always have an array
      const validData = Array.isArray(result) ? result : [];
      const validDepartments = Array.isArray(departmentsResult) ? departmentsResult : [];
      
      setData(validData);
      setDepartments(validDepartments); // 🆕 Set departments
      
      if (validData.length === 0) {
        console.warn(`⚠️ No data available for ${entityType}`);
      }
    } catch (err) {
      console.error(`Failed to load ${entityType}:`, err);
      setError(err.message || `Failed to load ${entityType} data`);
      setData([]);
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  }, [entityType, config, navigate]);

  // Load data on mount or entity type change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Initialize filter values when config changes (not data)
  useEffect(() => {
    if (!config) return;

    const initialValues = {};
    config.secondaryFilters?.forEach((filter) => {
      initialValues[filter.name] = "all";
    });
    setFilterValues(initialValues);
    setPrimaryFilter("All");
  }, [config, entityType]); // Remove data dependency

  // Apply filters with better error handling
  useEffect(() => {
    if (!data.length || !config) {
      setFilteredData([]);
      return;
    }

    try {
      let temp = [...data];

      // Apply primary filter with safety checks
      if (primaryFilter !== "All" && config.primaryFilter) {
        temp = temp.filter((item) => {
          const itemValue = item?.[config.primaryFilter];
          return itemValue === primaryFilter;
        });
      }

      // Apply secondary filters with safety checks
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value !== "all" && value !== undefined && value !== null) {
          temp = temp.filter((item) => {
            const itemValue = item?.[key];
            return itemValue === value;
          });
        }
      });

      setFilteredData(temp);
    } catch (error) {
      console.error("Filter error:", error);
      setFilteredData(data); // Fallback to unfiltered data
    }
  }, [primaryFilter, filterValues, data, config]);

  // Handle filter changes
  const handleFilterChange = useCallback((name, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleButtonFilterChange = useCallback((filterName, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterName]: prev[filterName] === value ? "all" : value,
    }));
  }, []);

  // Calculate stats with better error handling and departments support
  const stats = useMemo(() => {
    if (!config?.stats || !filteredData.length) return {};

    try {
      return Object.entries(config.stats).reduce((acc, [key, calculator]) => {
        try {
          if (typeof calculator === 'function') {
            // 🆕 Pass departments as second parameter for lecturer stats
            acc[key] = calculator(filteredData, departments);
          } else {
            acc[key] = 0;
          }
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
  }, [filteredData, departments, config?.stats]); // 🆕 Add departments dependency

  // Generate dashboard cards
  const dashboardCards = useMemo(() => {
    if (!config?.cards) return [];

    return config.cards.map((card) => ({
      ...card,
      value: (stats[card.statKey] ?? 0).toString(),
    }));
  }, [config?.cards, stats]);

  // Navigation function with better error handling - use ref to prevent infinite loops
  const goToProfile = useCallback((item) => {
    try {
      if (!item?.id || !config?.entityName) {
        console.warn('Invalid navigation parameters:', { item, entityName: config?.entityName });
        return;
      }

      const sanitizedId = parseInt(item.id);
      if (isNaN(sanitizedId) || sanitizedId <= 0) {
        console.warn('Invalid ID for navigation:', item.id);
        return;
      }

      // Check if entity exists using ref to avoid dependency issues
      const entityExists = dataRef.current.some((entity) => entity?.id === sanitizedId);
      if (!entityExists) {
        console.warn('Entity not found in data:', sanitizedId);
        return;
      }

      const targetUrl = `/profile/${config.entityName}/${sanitizedId}`;
      console.log("🚀 Secure navigation:", {
        entityType: config.entityName,
        id: sanitizedId,
        targetUrl,
        entityData: { id: item.id, name: item.name },
      });

      navigate(targetUrl);
    } catch (error) {
      console.error('Navigation error:', error);
      alert("Unable to navigate to profile. Please try again.");
    }
  }, [config?.entityName, navigate]); // Remove data dependency

  // Handle card clicks
  const handleCardClick = useCallback((card) => {
    if (!card?.id) return;

    try {
      switch (card.id) {
        case "total-students":
        case "total-lecturers":
          setPrimaryFilter("All");
          setFilterValues({});
          break;
        case "active-students":
          setFilterValues((prev) => ({ ...prev, status: "Active" }));
          break;
        case "graduated-students":
          setFilterValues((prev) => ({ ...prev, status: "Graduated" }));
          break;
        case "top-performers":
          console.log("🏆 Show top performers filter");
          // Add specific filter logic here if needed
          break;
        default:
          console.log(`📊 Card action not defined for: ${card.id}`);
      }
    } catch (error) {
      console.error("Card click error:", error);
    }
  }, []);

  // Utility functions
  const getFilterTitle = useCallback(() => {
    return entityType === "students" ? "Student Filters" : "Lecturer Filters";
  }, [entityType]);

  const dynamicFilters = useMemo(() => {
    if (!config?.secondaryFilters || !data.length) return [];
    
    return config.secondaryFilters
      .filter((filter) => filter.type === "select")
      .map((filter) => ({
        label: filter.label,
        name: filter.name,
        title: filter.name,
        options: getFilterOptions(filter.name, data),
      }));
  }, [config?.secondaryFilters, data]);

  const buttonFilters = useMemo(() => {
    return config?.secondaryFilters?.filter((filter) => filter.type === "buttons") || [];
  }, [config?.secondaryFilters]);

  // Refresh data function
  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Memoize the config object with functions to prevent recreation
  const configWithFunctions = useMemo(() => {
    if (!config) return null;
    
    return {
      ...config,
      getPrimaryOptions: () => getPrimaryOptions(data, config.primaryFilter),
      getFilterOptions: (fieldName) => getFilterOptions(fieldName, data),
    };
  }, [config, data]);

  return {
    // Data
    data,
    filteredData,
    departments, // 🆕 Return departments
    isLoading,
    error,
    
    // Config
    config: configWithFunctions,
    
    // State
    primaryFilter,
    setPrimaryFilter,
    filterValues,
    
    // Computed
    stats,
    dashboardCards,
    dynamicFilters,
    buttonFilters,
    
    // Functions
    handleFilterChange,
    handleButtonFilterChange,
    goToProfile,
    handleCardClick,
    getFilterTitle,
    refreshData
  };
};

export default useGenericDashboard;