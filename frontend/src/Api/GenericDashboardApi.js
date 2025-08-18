// src/Api/genericDashboardAPI.js
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api";

axios.defaults.withCredentials = true;

const endpoints = {
  // Correct endpoint for fetching users by role
  students: `${API_BASE_URL}/users/role/1300`,
  lecturers: `${API_BASE_URL}/users/role/1200`,
  users: `${API_BASE_URL}/users`,
  departments: `${API_BASE_URL}/departments`,
};

export const getData = async (entityType) => {
  if (!entityType || !endpoints[entityType]) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }
  try {
    const response = await axios.get(endpoints[entityType]);
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    } else {
      console.warn(
        `Unexpected data format from ${entityType} API:`,
        response.data
      );
      return [];
    }
  } catch (error) {
    console.error(`Error fetching ${entityType}:`, error);
    throw new Error(`Failed to load ${entityType} data: ${error.message}`);
  }
};

export const createRecord = async (entityType, recordData) => {
  if (!entityType || !endpoints.users) {
    throw new Error(`Invalid entity type or endpoint: ${entityType}`);
  }
  if (!recordData || typeof recordData !== "object") {
    throw new Error("Invalid record data provided");
  }

  const role = entityType === "students" ? "1300" : "1200";
  const dataToSend = { ...recordData, role };

  try {
    const response = await axios.post(
      `${endpoints.users}/admin-create`,
      dataToSend
    );
    return response.data;
  } catch (error) {
    console.error(`Error creating ${entityType.slice(0, -1)}:`, error);
    throw new Error(
      `Failed to create ${entityType.slice(0, -1)}: ${error.message}`
    );
  }
};

export const updateRecord = async (entityType, id, recordData) => {
  try {
    const response = await axios.put(`${endpoints.users}/${id}`, recordData);
    return response.data;
  } catch (error) {
    console.error(`Error updating ${entityType.slice(0, -1)}:`, error);
    throw new Error(
      `Failed to update ${entityType.slice(0, -1)}: ${error.message}`
    );
  }
};

export const getAllDepartments = async () => {
  try {
    const response = await axios.get(endpoints.departments);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn(
        "Unexpected data format from departments API:",
        response.data
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw new Error(`Failed to load departments: ${error.message}`);
  }
};
