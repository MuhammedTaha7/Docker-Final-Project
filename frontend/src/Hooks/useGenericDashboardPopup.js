// src/Hooks/useGenericDashboardPopup.js
import { useState, useCallback, useEffect, useMemo } from "react";
import * as genericDashboardAPI from "../Api/GenericDashboardApi";
import { getGenericDashboardFormConfig } from "../Utils/genericDashboardUtils";

export const useGenericDashboardPopup = (entityType, refreshData) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [academicYears, setAcademicYears] = useState([]); // 🆕 New state to track the record being edited
  const [editingRecord, setEditingRecord] = useState(null);

  const formConfig = useMemo(() => {
    return getGenericDashboardFormConfig(entityType, {
      departments,
      academicYears,
    });
  }, [entityType, departments, academicYears]);

  useEffect(() => {
    if (isPopupOpen) {
      const fetchDepartments = async () => {
        try {
          const fetchedDepartments =
            await genericDashboardAPI.getAllDepartments();
          setDepartments(fetchedDepartments);
        } catch (error) {
          console.error("Failed to fetch departments:", error);
          setDepartments([]);
        }
      };
      fetchDepartments();
    }
  }, [isPopupOpen]); // 🆕 New handler to set a record for editing

  const handleEditRecord = useCallback(async (record) => {
    setEditingRecord(record);
    setIsPopupOpen(true);
  }, []);

  const handleAddRecord = useCallback(() => {
    setEditingRecord(null); // Clear editing state for new record
    setIsPopupOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (formData) => {
      setIsFormLoading(true);
      setFormError(null);
      try {
        const role = entityType === "students" ? "1300" : "1200";
        const dataToSend = { ...formData, role };
        let result; // 🆕 Conditional logic for create vs. update

        if (editingRecord) {
          result = await genericDashboardAPI.updateRecord(
            entityType,
            editingRecord.id,
            dataToSend
          );
        } else {
          result = await genericDashboardAPI.createRecord(
            entityType,
            dataToSend
          );
        }

        setIsPopupOpen(false);
        refreshData(result);
        alert(`${entityType.slice(0, -1)} saved successfully!`);
      } catch (error) {
        setFormError(
          error.message || `Failed to save ${entityType.slice(0, -1)}`
        );
      } finally {
        setIsFormLoading(false);
        setEditingRecord(null);
      }
    },
    [entityType, editingRecord, refreshData]
  );

  const handleFormCancel = useCallback(() => {
    setIsPopupOpen(false);
    setEditingRecord(null);
    setFormError(null);
  }, []);

  return {
    isPopupOpen,
    isFormLoading,
    formError,
    handleAddRecord,
    handleEditRecord, // 🆕 Expose the new handler
    handleFormSubmit,
    handleFormCancel,
    formConfig,
    editingRecord, // 🆕 Expose the editing record
    departments, // Expose departments for the form to use
    academicYears, // Expose academic years for the form to use
  };
};
