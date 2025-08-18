// utils/coursePageUtils.js
import { courseSpecificData } from "../staticFixedData.js";

export const getContentConfig = (courseId) => {
  try {
    const numericId = parseInt(courseId);
    return courseSpecificData[numericId] || courseSpecificData.default;
  } catch (error) {
    console.error(`Error getting content config for course ID: ${courseId}`, error);
    return courseSpecificData.default;
  }
};

export const getCourseChartData = (courseId) => {
  try {
    const numericId = parseInt(courseId);
    return courseSpecificData[numericId]?.chartData || courseSpecificData.default.chartData;
  } catch (error) {
    console.error(`Error getting chart data for course ID: ${courseId}`, error);
    return courseSpecificData.default.chartData;
  }
};

export const getCourseMaterials = (courseId) => {
  try {
    const numericId = parseInt(courseId);
    return courseSpecificData[numericId]?.materials || [];
  } catch (error) {
    console.error(`Error getting materials for course ID: ${courseId}`, error);
    return [];
  }
};

export const getCourseAnnouncements = (courseId) => {
  try {
    const numericId = parseInt(courseId);
    return courseSpecificData[numericId]?.announcements || [];
  } catch (error) {
    console.error(`Error getting announcements for course ID: ${courseId}`, error);
    return [];
  }
};