/**
 * GradesTab Component
 * File: src/View/Pages/Lecturer/GradesTab.jsx
 */

import React from "react";
import {
  Users,
  Plus,
  Trash2,
  Award,
  ClipboardList,
  Percent,
  RefreshCw,
} from "lucide-react";
import styles from "./AssignmentsDashboard.module.css";

export default function GradesTab({
  // State
  showColumnForm,
  setShowColumnForm,
  loading,

  // Data
  students,
  gradeColumns,
  selectedCourseData,

  // Forms
  newColumn,
  setNewColumn,

  // Actions
  addGradeColumn,
  updateColumn,
  deleteColumn,
  updateGrade,

  // Computed values
  filteredStudents,
  filteredColumns,
  calculateFinalGrade,
  getTotalPercentage,
}) {
  return (
    <div className={styles.tabContent}>
      {/* Grade Configuration */}
      <div className={styles.card}>
        <div className={styles.gradeConfigHeader}>
          <div>
            <h3 className={styles.cardTitle}>Grade Configuration</h3>
            <p className={styles.cardSubtitle}>
              Configure your grading components and their weights
            </p>
          </div>
          <div className={styles.gradeConfigActions}>
            <div
              className={`${styles.totalPercentage} ${
                getTotalPercentage() === 100
                  ? styles.totalPercentageValid
                  : styles.totalPercentageInvalid
              }`}
            >
              <Percent className={styles.percentIcon} />
              <span className={styles.percentText}>
                Total: {getTotalPercentage()}%
              </span>
              {getTotalPercentage() === 100 && (
                <div className={styles.validIndicator}></div>
              )}
            </div>
            <button
              onClick={() => setShowColumnForm(!showColumnForm)}
              disabled={loading}
              className={styles.addGradeBtn}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className={styles.btnIcon} />
              )}
              <span>Add Grade</span>
            </button>
          </div>
        </div>

        {showColumnForm && (
          <div className={styles.formSection}>
            <h4 className={styles.formTitle}>Add New Grade Component</h4>
            <div className={styles.formCard}>
              <div className={styles.formGrid}>
                <div>
                  <label className={styles.formLabel}>Grade Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Midterm Exam"
                    value={newColumn.name}
                    onChange={(e) =>
                      setNewColumn({
                        ...newColumn,
                        name: e.target.value,
                      })
                    }
                    className={styles.formInput}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Type</label>
                  <select
                    value={newColumn.type}
                    onChange={(e) =>
                      setNewColumn({
                        ...newColumn,
                        type: e.target.value,
                      })
                    }
                    className={styles.formSelect}
                    disabled={loading}
                  >
                    <option value="assignment">Assignment</option>
                    <option value="exam">Exam</option>
                    <option value="quiz">Quiz</option>
                    <option value="project">Project</option>
                  </select>
                </div>
                <div>
                  <label className={styles.formLabel}>Weight (%)</label>
                  <div className={styles.percentInputWrapper}>
                    <input
                      type="number"
                      placeholder="20"
                      value={newColumn.percentage}
                      onChange={(e) =>
                        setNewColumn({
                          ...newColumn,
                          percentage: e.target.value,
                        })
                      }
                      className={styles.percentInput}
                      min="0"
                      max="100"
                      disabled={loading}
                    />
                    <Percent className={styles.percentInputIcon} />
                  </div>
                </div>
                <div className={styles.formButtonContainer}>
                  <button
                    onClick={addGradeColumn}
                    disabled={loading}
                    className={styles.primaryBtn}
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className={styles.btnIcon} />
                    )}
                    <span>Add Grade</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.cardContent}>
          {filteredColumns.length > 0 ? (
            <div>
              <h4 className={styles.sectionTitle}>Current Grade Components</h4>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHeaderRow}>
                      <th className={styles.tableHeader}>Component</th>
                      <th className={styles.tableHeader}>Type</th>
                      <th className={styles.tableHeader}>Weight</th>
                      <th className={styles.tableHeaderCenter}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {filteredColumns.map((column) => (
                      <tr key={column.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                          <input
                            type="text"
                            value={column.name}
                            onChange={(e) =>
                              updateColumn(column.id, "name", e.target.value)
                            }
                            className={styles.tableInput}
                            disabled={loading}
                          />
                        </td>
                        <td className={styles.tableCell}>
                          <div
                            className={`${styles.typeBadge} ${
                              styles[
                                `typeBadge${
                                  column.type.charAt(0).toUpperCase() +
                                  column.type.slice(1)
                                }`
                              ]
                            }`}
                          >
                            <div
                              className={`${styles.typeBadgeDot} ${
                                styles[
                                  `typeBadgeDot${
                                    column.type.charAt(0).toUpperCase() +
                                    column.type.slice(1)
                                  }`
                                ]
                              }`}
                            ></div>
                            <span className={styles.typeBadgeText}>
                              {column.type}
                            </span>
                          </div>
                        </td>
                        <td className={styles.tableCell}>
                          <div className={styles.percentageInputGroup}>
                            <input
                              type="number"
                              value={column.percentage}
                              onChange={(e) =>
                                updateColumn(
                                  column.id,
                                  "percentage",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className={styles.percentageInput}
                              min="0"
                              max="100"
                              disabled={loading}
                            />
                            <span className={styles.percentageSymbol}>%</span>
                          </div>
                        </td>
                        <td className={styles.tableCellCenter}>
                          <button
                            onClick={() => deleteColumn(column.id)}
                            disabled={loading}
                            className={styles.deleteBtn}
                            title="Delete component"
                          >
                            <Trash2 className={styles.btnIcon} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Row */}
              <div className={styles.summarySection}>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>Total Weight:</span>
                  <div
                    className={`${styles.summaryValue} ${
                      getTotalPercentage() === 100
                        ? styles.summaryValueValid
                        : getTotalPercentage() < 100
                        ? styles.summaryValueWarning
                        : styles.summaryValueError
                    }`}
                  >
                    <span>{getTotalPercentage()}%</span>
                    {getTotalPercentage() === 100 ? (
                      <span className={styles.summaryCheck}>✓</span>
                    ) : (
                      <span className={styles.summaryWarning}>⚠</span>
                    )}
                  </div>
                </div>
                {getTotalPercentage() !== 100 && (
                  <p className={styles.summaryHelp}>
                    {getTotalPercentage() < 100
                      ? `Add ${
                          100 - getTotalPercentage()
                        }% more to reach 100%`
                      : `Reduce by ${
                          getTotalPercentage() - 100
                        }% to reach 100%`}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <ClipboardList className={styles.emptyStateIcon} />
              <h4 className={styles.emptyStateTitle}>No Grade Components</h4>
              <p className={styles.emptyStateText}>
                Start building your grading structure by adding components like
                assignments, exams, and projects.
              </p>
              <button
                onClick={() => setShowColumnForm(true)}
                disabled={loading}
                className={styles.primaryBtn}
              >
                <Plus className={styles.btnIcon} />
                <span>Add Your First Grade Component</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grades Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3 className={styles.cardTitle}>
              Student Grades - {selectedCourseData?.name}
            </h3>
            <p className={styles.cardSubtitle}>
              {filteredStudents.length} students enrolled
            </p>
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeaderRowGray}>
                <th className={styles.tableHeader}>
                  <div className={styles.tableHeaderWithIcon}>
                    <Users className={styles.tableHeaderIcon} />
                    <span>Student Name</span>
                  </div>
                </th>
                {filteredColumns.map((column) => (
                  <th key={column.id} className={styles.tableHeader}>
                    <div className={styles.tableHeaderContent}>
                      <div className={styles.tableHeaderName}>
                        {column.name}
                      </div>
                      <div className={styles.tableHeaderPercentage}>
                        ({column.percentage}%)
                      </div>
                    </div>
                  </th>
                ))}
                <th className={styles.tableHeader}>
                  <div className={styles.tableHeaderWithIcon}>
                    <Award className={styles.tableHeaderIcon} />
                    <span>Final Grade</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {filteredStudents.map((student) => (
                <tr key={student.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.studentInfo}>
                      <div className={styles.studentAvatar}>
                        {student.name
                          ? student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "?"}
                      </div>
                      <div>
                        <div className={styles.studentName}>
                          {student.name || "Unknown Student"}
                        </div>
                        <div className={styles.studentEmail}>
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  {filteredColumns.map((column) => {
                    const grade = student.grades?.[column.id] || "";
                    return (
                      <td key={column.id} className={styles.tableCell}>
                        <input
                          type="number"
                          value={grade}
                          onChange={(e) =>
                            updateGrade(student.id, column.id, e.target.value)
                          }
                          className={styles.gradeInput}
                          min="0"
                          max="100"
                          placeholder="--"
                          disabled={loading}
                        />
                      </td>
                    );
                  })}
                  <td className={styles.tableCell}>
                    <span
                      className={`${styles.finalGradeBadge} ${
                        calculateFinalGrade(student) >= 90
                          ? styles.gradeA
                          : calculateFinalGrade(student) >= 80
                          ? styles.gradeB
                          : calculateFinalGrade(student) >= 70
                          ? styles.gradeC
                          : styles.gradeF
                      }`}
                    >
                      {calculateFinalGrade(student)}%
                    </span>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={filteredColumns.length + 2}
                    className={styles.emptyTableCell}
                  >
                    No students enrolled in this course.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}