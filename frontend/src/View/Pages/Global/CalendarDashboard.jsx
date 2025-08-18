import React, { useMemo } from "react";
import WeeklyCalendar from "../../Components/BigCalendar/WeeklyCalendar";
import MiniCalendar from "../../Components/BigCalendar/MiniCalendar";
import ScrollList from "../../Components/ScrollList/ScrollList";
import ScrollListItem from "../../Components/ScrollList/ScrollListItem";
import Popup from "../../Components/Cards/PopUp";
import DynamicForm from "../../Components/Forms/dynamicForm";
import useCalendarDashboard from "../../../Hooks/useCalendarDashboard.js";
import { assignmentFields, eventFields } from "../../../Utils/calendarUtils.js";
import styles from "./CalendarDashboard.module.css";

const CalendarDashboard = () => {
  // --- Step 1: Call ALL hooks at the top level ---
  const {
    currentDate,
    setCurrentDate,
    assignments,
    isLoading,
    error,
    isPopupOpen,
    popupMode,
    popupType,
    editingItem,
    openAddPopup,
    openEditPopup,
    closePopup,
    handleFormSubmit,
    handleDelete,
    lecturers,
    courses,
    filters,
    setFilters,
    userRole,
  } = useCalendarDashboard();

  const lecturerOptions = useMemo(() => 
    lecturers.map(lecturer => ({
      value: lecturer.id,
      label: lecturer.name,
    })),
  [lecturers]);

  const courseOptions = useMemo(() =>
    courses.map(course => ({
      value: course.id,
      label: course.name,
    })),
  [courses]);

  const eventFieldsWithLecturers = useMemo(() =>
    eventFields.map(field => {
      if (field.name === 'instructorId') {
        return { ...field, options: lecturerOptions };
      }
      return field;
    }),
  [lecturerOptions]);

  // --- Step 2: Perform any conditional returns AFTER all hooks have been called ---
  if (isLoading) {
    return <div className={styles.loading}>Loading Calendar...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  // --- Step 3: Prepare remaining variables for rendering ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const formFields = popupType === 'assignment' ? assignmentFields : eventFieldsWithLecturers;
  const formTitle = popupType === 'assignment' 
    ? (popupMode === 'add' ? 'Add Assignment' : 'Edit Assignment')
    : 'Add Recurring Event';

  return (
    <div className={styles.calendarPageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Academic Calendar</h1>
        <p className={styles.subtitle}>
          Manage your schedule, assignments, and upcoming events
        </p>
      </div>
      {userRole === '1100' && (
        <div className={styles.filterBar}>
          <select name="instructorId" value={filters.instructorId || ''} onChange={handleFilterChange} className={styles.filterSelect}>
            <option value="">Filter by Lecturer</option>
            {lecturerOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select name="courseId" value={filters.courseId || ''} onChange={handleFilterChange} className={styles.filterSelect}>
            <option value="">Filter by Course</option>
            {courseOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      )}
      <div className={styles.gridLayout}>
        <div className={styles.leftColumn}>
          <WeeklyCalendar
            currentDate={currentDate}
            events={assignments}
            onWeekChange={setCurrentDate}
          />
        </div>

        <div className={styles.rightColumn}>
          <MiniCalendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onMonthChange={setCurrentDate}
          />
          <div className={styles.assignmentsContainer}>
            <ScrollList
              title="Schedule"
              items={assignments}
              headerActions={[
                { label: 'Add Event', onClick: () => openAddPopup('event') },
                { label: 'Add Assignment', onClick: () => openAddPopup('assignment') }
              ]}
              renderItem={(item) => (
                <ScrollListItem
                  key={item.id}
                  showActions={true}
                  item={item}
                  variant={item.type.toLowerCase()}
                  showProgress={item.progress !== undefined}
                  showBadges={true}
                  showDescription={true}
                  showFooter={true}
                  onEdit={() => openEditPopup(item)}
                  onDelete={() => handleDelete(item)}
                />
              )}
              showSearch={true}
              showFilters={false}
              showStats={true}
              layout="list"
            />
          </div>
        </div>
      </div>

      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <DynamicForm
          title={formTitle}
          fields={formFields}
          initialData={editingItem || {}}
          submitText={popupMode === "add" ? "Add" : "Save"}
          cancelText="Cancel"
          onSubmit={handleFormSubmit}
          onCancel={closePopup}
        />
      </Popup>
    </div>
  );
};

export default CalendarDashboard;