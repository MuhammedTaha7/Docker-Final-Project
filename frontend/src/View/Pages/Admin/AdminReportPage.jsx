import React from "react";
import { useReportPage } from "../../../Hooks/useReportPage";
import styles from "../../../CSS/Pages/Admin/AdminReportPage.module.css";
import StudentTable from "../../Components/Tables/Table.jsx";
import { reportActionButtons } from "../../../Utils/reportUtils";

const AdminReportPage = () => {
  const {
    queryText,
    setQueryText,
    resultData,
    loading,
    error,
    recentReports,
    loadingReports,
    handleGenerateReport,
    handleDownload,
    handleRegenerateReport,
    handleDownloadFromRecent,
    handleDeleteReport,
    viewedReportData,
    isViewing,
    viewingError,
    handleViewReport,
    closeView,
  } = useReportPage();

  // Field filtering logic - hide unwanted fields
  const getFilteredColumns = (row) => {
    if (!row) return [];

    const allKeys = Object.keys(row);

    // Fields to always hide
    const hiddenFields = [
      "password",
      "_id",
      "__v",
      "createdAt",
      "updatedAt",
      "profilePic",
      "coverPic",
      "fileUrl",
      "filePath",
    ];

    // Fields to hide if they contain complex objects or are too long
    const filteredKeys = allKeys.filter((key) => {
      // Skip hidden fields
      if (hiddenFields.includes(key)) return false;

      const value = row[key];

      // Skip complex objects (but keep simple objects)
      if (typeof value === "object" && value !== null) {
        // Hide if it's a complex timestamp object
        if (value.timestamp || value.$date) return false;
        // Hide if it's a very nested object
        if (JSON.stringify(value).length > 100) return false;
      }

      // Keep the field
      return true;
    });

    // Prioritize important fields first
    const priorityFields = [
      "id",
      "name",
      "username",
      "email",
      "title",
      "status",
      "role",
      "department",
    ];
    const sortedKeys = [
      ...priorityFields.filter((field) => filteredKeys.includes(field)),
      ...filteredKeys.filter((field) => !priorityFields.includes(field)),
    ];

    return sortedKeys;
  };

  // Column width management
  const getColumnWidth = (key) => {
    const widthMap = {
      id: "80px",
      username: "120px",
      email: "180px",
      name: "150px",
      title: "120px",
      role: "80px",
      status: "90px",
      department: "130px",
      grade: "80px",
      score: "80px",
      priority: "90px",
    };

    return widthMap[key] || "120px";
  };

  // Format column headers
  const formatColumnHeader = (key) => {
    // Special cases
    const headerMap = {
      id: "ID",
      userId: "User ID",
      courseId: "Course ID",
      studentId: "Student ID",
      lecturerId: "Lecturer ID",
    };

    if (headerMap[key]) return headerMap[key];

    // Convert camelCase to Title Case
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Format cell values with proper null handling
  const formatCellValue = (key, value) => {
    // Handle null/undefined/empty - ALWAYS return something to maintain column alignment
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (value === 0 && key !== "grade" && key !== "score")
    ) {
      return <span style={{ color: "#9ca3af", fontStyle: "italic" }}>-</span>;
    }

    // Handle role codes
    if (key === "role") {
      const roleMap = { 1300: "Student", 1200: "Lecturer", 1100: "Admin" };
      const roleText = roleMap[value] || value || "-";
      const roleColors = {
        Student: "#3b82f6",
        Lecturer: "#10b981",
        Admin: "#f59e0b",
      };
      return (
        <span
          style={{
            color: roleColors[roleText] || "#6b7280",
            fontWeight: "500",
            fontSize: "12px",
          }}
        >
          {roleText}
        </span>
      );
    }

    // Handle status fields
    if (key.toLowerCase().includes("status")) {
      if (!value)
        return <span style={{ color: "#9ca3af", fontStyle: "italic" }}>-</span>;
      const statusColors = {
        active: "#10b981",
        inactive: "#6b7280",
        pending: "#f59e0b",
        completed: "#3b82f6",
        cancelled: "#ef4444",
      };
      return (
        <span
          style={{
            color: statusColors[value.toLowerCase()] || "#6b7280",
            fontWeight: "500",
            fontSize: "12px",
          }}
        >
          {value}
        </span>
      );
    }

    // Handle dates
    if (
      key.toLowerCase().includes("date") ||
      key.toLowerCase().includes("time")
    ) {
      if (!value)
        return <span style={{ color: "#9ca3af", fontStyle: "italic" }}>-</span>;
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return (
            <span style={{ color: "#6b7280", fontSize: "12px" }}>
              {date.toLocaleDateString()}{" "}
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          );
        }
      } catch (e) {
        // If date parsing fails, show as regular text or dash if empty
        return value ? (
          <span style={{ fontSize: "12px" }}>{String(value)}</span>
        ) : (
          <span style={{ color: "#9ca3af", fontStyle: "italic" }}>-</span>
        );
      }
    }

    // Handle numbers (including 0)
    if (typeof value === "number") {
      return (
        <span style={{ fontFamily: "monospace", fontSize: "12px" }}>
          {value}
        </span>
      );
    }

    // Handle boolean
    if (typeof value === "boolean") {
      return (
        <span
          style={{
            color: value ? "#10b981" : "#ef4444",
            fontWeight: "500",
            fontSize: "12px",
          }}
        >
          {value ? "Yes" : "No"}
        </span>
      );
    }

    // Handle long text
    const stringValue = String(value || "");
    if (stringValue.length === 0) {
      return <span style={{ color: "#9ca3af", fontStyle: "italic" }}>-</span>;
    }

    if (stringValue.length > 50) {
      return (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={stringValue}
        >
          {stringValue}
        </div>
      );
    }

    // Handle objects (simplified display)
    if (typeof value === "object" && value !== null) {
      try {
        return (
          <code
            style={{
              backgroundColor: "#f3f4f6",
              padding: "2px 4px",
              borderRadius: "3px",
              fontSize: "11px",
              color: "#374151",
              maxWidth: "150px",
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {JSON.stringify(value)}
          </code>
        );
      } catch (e) {
        return <span style={{ color: "#9ca3af", fontStyle: "italic" }}>-</span>;
      }
    }

    // Default string handling - ensure we always return something
    return <span style={{ fontSize: "12px" }}>{stringValue || "-"}</span>;
  };

  // Render table function to avoid code duplication
  const renderDataTable = (data, title, onClose = null, isViewedReport = false) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          No data available
        </div>
      );
    }

    return (
      <div className={styles.tableSection}>
        <div
          className="tableHeader"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
            padding: "10px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <h3 className="tableTitle" style={{ margin: 0, color: "#333" }}>
            {title}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="tableInfo">
              <span
                className="recordCount"
                style={{
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {data.length} records
              </span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#fff",
                  color: "#374151",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f9fafb";
                  e.target.style.borderColor = "#9ca3af";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.borderColor = "#d1d5db";
                }}
              >
                Close View
              </button>
            )}
          </div>
        </div>

        <div
          className="tableContainer"
          style={{
            overflowX: "auto",
            maxHeight: "600px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <table
            className="resultTable"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
              minWidth: "600px",
            }}
          >
            <thead
              style={{
                backgroundColor: "#f8f9fa",
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <tr>
                {getFilteredColumns(data[0]).map((key) => (
                  <th
                    key={key}
                    style={{
                      padding: "12px 10px",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                      fontWeight: "600",
                      color: "#495057",
                      whiteSpace: "nowrap",
                      minWidth: getColumnWidth(key),
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    {formatColumnHeader(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #dee2e6",
                    backgroundColor:
                      index % 2 === 0 ? "white" : "#fafbfc",
                  }}
                >
                  {getFilteredColumns(data[0]).map((key, i) => (
                    <td
                      key={i}
                      style={{
                        padding: "10px",
                        verticalAlign: "top",
                        borderRight: "1px solid #f1f3f4",
                        maxWidth: getColumnWidth(key),
                        overflow: "hidden",
                      }}
                    >
                      {formatCellValue(key, row[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Sample queries to help users
  const sampleQueries = [
    "Show all students",
    "Get all assignments due this week",
    "Find all lecturers in Computer Science department",
    "Show recent announcements",
    "Get all courses for current semester",
    "Find students with grades above 85",
    "Show all pending student requests",
    "Get meeting attendance for last month",
  ];

  const handleSampleQuery = (query) => {
    setQueryText(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleGenerateReport();
    }
  };

  return (
    <div className={styles.adminReportPage}>
      <div className={styles.adminReportContainer}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerIcon}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
          </div>
          <h1 className={styles.reportHeaderTitle}>AI Report Generator</h1>
          <p className={styles.headerSubtitle}>
            Generate custom reports using natural language. Ask for data about
            students, courses, assignments, grades, meetings, and more.
          </p>
        </div>

        {/* Sample Queries Section */}
        <div className={styles.contentCard} style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "15px", color: "#333" }}>
            Sample Queries:
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {sampleQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuery(query)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "20px",
                  backgroundColor: "#f8f9fa",
                  color: "#6c757d",
                  cursor: "pointer",
                  fontSize: "12px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#e9ecef";
                  e.target.style.borderColor = "#adb5bd";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#f8f9fa";
                  e.target.style.borderColor = "#ddd";
                }}
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className={styles.contentCard}>
          {/* Query Section */}
          <div className={styles.querySection}>
            <label className={styles.queryLabel}>
              Report Query
              <span
                style={{
                  fontSize: "12px",
                  color: "#6c757d",
                  fontWeight: "normal",
                  marginLeft: "8px",
                }}
              >
                (Press Ctrl+Enter to generate)
              </span>
            </label>
            <div className={styles.textareaWrapper}>
              <textarea
                className={styles.queryTextarea}
                rows="4"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask for any report... Examples:
                            • Show all students in Computer Science department
                            • Get assignments due this week  
                            • Find lecturers with rating above 4.5
                            • Show recent announcements for students
                            • Get course enrollment statistics
                            • Find all pending grade submissions"
              />
              <div className={styles.textareaIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
            </div>

            <button
              className={`${styles.generateButton} ${
                loading ? styles.loading : ""
              }`}
              onClick={handleGenerateReport}
              disabled={loading || !queryText.trim()}
            >
              {loading ? (
                <>
                  <div className={styles.spinner}></div>
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.errorSection}>
              <div className={styles.errorAlert}>
                <svg
                  className={styles.errorIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className={styles.errorText}>{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {resultData.length > 0 && (
            <>
              {/* Success Message */}
              <div className={styles.successSection}>
                <div className={styles.successAlert}>
                  <div className={styles.successContent}>
                    <svg
                      className={styles.successIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                    <div className={styles.successText}>
                      <p className="successTitle">
                        Report Generated Successfully
                      </p>
                      <p className="successSubtitle">
                        {resultData.length} records found
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    className={styles.downloadButton}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7,10 12,15 17,10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              {renderDataTable(resultData, "Report Results")}
            </>
          )}
        </div>

        {/* Viewed Report Section - Now using the same table structure */}
        {viewedReportData && viewedReportData.length > 0 && (
          <div className={styles.contentCard}>
            {renderDataTable(viewedReportData, "Viewed Report Data", closeView, true)}
          </div>
        )}

        {/* Viewing Error */}
        {viewingError && (
          <div className={styles.contentCard}>
            <div className={styles.errorSection}>
              <div className={styles.errorAlert}>
                <svg
                  className={styles.errorIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className={styles.errorText}>{viewingError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading state for viewed report */}
        {isViewing && (
          <div className={styles.contentCard}>
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
              <span>Loading report data...</span>
            </div>
          </div>
        )}

        {/* Recent Reports Section */}
        <div className={styles.recentReportsCard}>
          <div className={styles.recentReportsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Reports</h2>
              <p className={styles.sectionSubtitle}>
                Your recently generated reports
              </p>
            </div>

            {loadingReports ? (
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                <span>Loading recent reports...</span>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <StudentTable
                  data={recentReports}
                  actionButtons={reportActionButtons(
                    handleRegenerateReport,
                    handleDownloadFromRecent,
                    handleDeleteReport,
                    handleViewReport,
                  )}
                  showAddButton={false}
                  hiddenColumns={"reportData"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportPage;