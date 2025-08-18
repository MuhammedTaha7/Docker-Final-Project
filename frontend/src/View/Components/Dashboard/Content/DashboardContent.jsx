import React, { useState, useEffect } from "react";
import Box from "./Box";
import BarChart from "../../Charts/barChart";
import PieChart from "../../Charts/pieCharts";
import LineChart from "../../Charts/lineChart";
import ScrollList from "../../ScrollList/ScrollList";
import ScrollListItem from "../../ScrollList/ScrollListItem";
import dashboardContentData from "../../../../Utils/dashboardUtils";
import assignmentFields from "../../../../Static/AssigmentsFields";
import Popup from "../../Cards/PopUp";
import DynamicForm from "../../Forms/dynamicForm";

import {
  getDashboardData,
  getAssignmentFormOptions,
  addAssignment,
  updateAssignment,
  deleteAssignment,
} from "../../../../Api/dashboardPageApi";

const DashboardContent = ({ userRole }) => {
  const [dashboardApiData, setDashboardApiData] = useState({
    stats: {},
    charts: { departmentEnrollment: [], systemUsage: [], annualEnrollment: [] },
    assignments: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState("add");
  const [editingItem, setEditingItem] = useState(null);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [dynamicFields, setDynamicFields] = useState(assignmentFields);

  const content = dashboardContentData[userRole];

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [formOptions, dashboardData] = await Promise.all([
          getAssignmentFormOptions(),
          getDashboardData(userRole)
        ]);
        
        setCourses(formOptions.courses || []);
        setLecturers(formOptions.instructors || []);

        if (dashboardData && dashboardData.stats && dashboardData.charts && dashboardData.assignments) {
          setDashboardApiData(dashboardData);
        }
      } catch (error) {
        console.error("Failed to fetch initial dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [userRole]);

  useEffect(() => {
    const updatedFields = assignmentFields.map(field => {
      if (field.name === 'course') {
        return { ...field, options: courses.map(c => ({ value: c.id, label: c.name })) };
      }
      if (field.name === 'instructor') {
        return { ...field, options: lecturers.map(l => ({ value: l.id, label: l.name })) };
      }
      return field;
    });
    setDynamicFields(updatedFields);
  }, [courses, lecturers]);

  const openAddPopup = () => { setPopupMode("add"); setEditingItem(null); setPopupOpen(true); };
  const openEditPopup = (item) => { setPopupMode("edit"); setEditingItem(item); setPopupOpen(true); };
  const closePopup = () => setPopupOpen(false);

  const handleFormSubmit = async (data) => {
    try {
      if (popupMode === "add") await addAssignment(data);
      else await updateAssignment(editingItem.id, data);
      const freshData = await getDashboardData(userRole);
      setDashboardApiData(freshData);
      closePopup();
    } catch (error) {
      console.error("Failed to submit assignment:", error);
    }
  };

  const handleDelete = async (assignmentId) => {
    try {
      await deleteAssignment(assignmentId);
      const freshData = await getDashboardData(userRole);
      setDashboardApiData(freshData);
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Dashboard...</div>;
  }
  
  if (!content) {
    return <p>No dashboard layout available for this role.</p>;
  }

  return (
    <>
      <div className="content">
        <div className="row">
          {content.map(({ type, props }, index) => {
            // This block handles the top 3 summary cards
            if (type === "box") {
              let subtitle = props.subtitle; // Start with the static subtitle
              if (props.title === "User Management") {
                subtitle = `${dashboardApiData.stats.activeUsers || 0} Active Users`;
              } else if (props.title === "Institution Overview") {
                subtitle = `${dashboardApiData.stats.activeDepartments || 0} Departments Active`;
              } else if (props.title === "System Analytics") {
                subtitle = dashboardApiData.stats.systemHealth || 'Status Unknown';
              }
              // Pass all original props, but explicitly overwrite the subtitle
              return <Box key={index} {...props} subtitle={subtitle} />;
            }

            if (type === "chart") {
              const chartDataMap = {
                bar: dashboardApiData.charts.departmentEnrollment,
                pie: dashboardApiData.charts.systemUsage,
                line: dashboardApiData.charts.annualEnrollment,
              };
              const chartData = chartDataMap[props.chartType] || [];

              let chartComponent;
              if (chartData.length > 0) {
                  const ChartComponents = { bar: <BarChart data={chartData} />, pie: <PieChart data={chartData} />, line: <LineChart data={chartData} /> };
                  chartComponent = ChartComponents[props.chartType];
              } else {
                  chartComponent = <div style={{ textAlign: 'center', padding: '20px' }}>No data available.</div>;
              }
              return <Box key={index} {...props} chart={chartComponent} />;
            }

            if (type === "assignments") {
              return (
                <Box
                  key={index}
                  assignments={
                    <ScrollList
                    showSearch = {false}
                      showFilters = {false}
                        showStats = {false}
                      layout="list"
                      title="Assignments"
                      items={dashboardApiData.assignments}
                      onAddNew={openAddPopup}
                      renderItem={(assignment) => (
                        <ScrollListItem
                          item={assignment}
                          variant={assignment.type}
                          showActions
                          onEdit={() => openEditPopup(assignment)}
                          onDelete={() => handleDelete(assignment.id)}
                        />
                      )}
                    />
                  }
                />
              );
            }
            return null;
          })}
        </div>
      </div>

      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <DynamicForm
          title={popupMode === "add" ? "Add Assignment" : "Edit Assignment"}
          fields={dynamicFields}
          initialData={editingItem || {}}
          submitText={popupMode === "add" ? "Add" : "Save"}
          cancelText="Cancel"
          onSubmit={handleFormSubmit}
          onCancel={closePopup}
        />
      </Popup>
    </>
  );
};

export default DashboardContent;