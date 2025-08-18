// GenericProfile.jsx - Main Component
import React from "react";
import {
  Edit,
  Eye,
  Check,
  X,
  Download,
  Clock,
  User,
  Book,
  FileText,
  Users,
  TrendingUp,
  Trash2,
} from "lucide-react";

import ProfileHeader from "../Components/StudentProfile/profileHeader";
import ProfileInfoCard from "../Components/StudentProfile/profileInfoCard";
import QuickActions from "../Components/StudentProfile/QuickActions";
import StatCardsContainer from "../Components/Cards/StatCardsContainer";
import MidPageNavbar from "../Components/CoursePage/Content/MidPageNavBar";
import DynamicTable from "../Components/Tables/Table";
import PopUp from "../Components/Cards/PopUp.jsx";
import DynamicForm from "../Components/Forms/dynamicForm.jsx";

import { useGenericProfile } from "../../Hooks/useGenericProfile";
import {
  profileConfigs,
  generateWorkingHoursCards,
  generateProfileCards,
  getColumnConfigs,
  getHiddenColumns,
  processScheduleData,
  processResourcesData,
  getGradeFormFields,
  getEditGradeFormFields,
  getLecturerCourseFormFields,
  getCourseFormFields,
  getEnrollmentFormFields,
  getScheduleFormFields,
  getResourceFormFields,
} from "../../Utils/genericProfileUtils.js";

import "./GenericProfile.css";

const GenericProfile = ({
  cardSize = "default",
  initialSection = "overview",
}) => {
  const {
    // State
    profileData,
    stats,
    statCards,
    loading,
    error,
    activeSection,
    selectedYear,
    showActions,
    uploadedFiles,
    fileUploadProgress,

    // Modal states
    editGradeModalOpen,
    addGradeModalOpen,
    editCourseModalOpen,
    addCourseModalOpen,
    editEnrollmentModalOpen,
    addEnrollmentModalOpen,
    editScheduleModalOpen,
    addScheduleModalOpen,
    editResourceModalOpen,
    addResourceModalOpen,
    viewRequestModalOpen,
    responseRequestModalOpen,
    viewMessageModalOpen, // ✅ Added
    replyMessageModalOpen, // ✅ Added

    // Form state
    selectedRecord,
    formData,
    requestResponse,
    selectedMessage, // ✅ Added
    replyText, // ✅ Added

    // Setters
    setActiveSection,
    setSelectedYear,
    setShowActions,
    setEditGradeModalOpen,
    setAddGradeModalOpen,
    setEditCourseModalOpen,
    setAddCourseModalOpen,
    setEditEnrollmentModalOpen,
    setAddEnrollmentModalOpen,
    setEditScheduleModalOpen,
    setAddScheduleModalOpen,
    setEditResourceModalOpen,
    setAddResourceModalOpen,
    setViewRequestModalOpen,
    setResponseRequestModalOpen,
    setRequestResponse,
    setViewMessageModalOpen, // ✅ Added
    setReplyMessageModalOpen, // ✅ Added
    setReplyText, // ✅ Added

    // Handlers
    handleEditGrade,
    handleAddGrade,
    handleGradeSubmit,
    handleAddCourse,
    handleCourseSubmit,
    handleEditEnrollment,
    handleAddEnrollment,
    handleEnrollmentSubmit,
    handleEditSchedule,
    handleAddSchedule,
    handleScheduleSubmit,
    handleEditResource,
    handleAddResource,
    handleResourceSubmit,
    handleDownloadResource,
    handleViewRequest,
    handleResponseRequest,
    handleCardClick,
    handleViewMessage, // ✅ Added
    handleReplyMessage, // ✅ Added
    handleSendReply, // ✅ Added

    // Derived data
    entityType,
    id,
    mainEntity,
  } = useGenericProfile(initialSection);

  // Get enrolled courses for grade form
  const getStudentEnrolledCourses = () => {
    if (!profileData || !profileData.enrollments) return [];
    return profileData.enrollments.map((enrollment) => ({
      value: enrollment.courseCode,
      label: `${enrollment.courseCode} - ${enrollment.courseName}`,
    }));
  };

  // File Upload Progress Component
  const FileUploadProgress = ({ progress }) => {
    if (!progress.status) return null;

    return (
      <div className="file-upload-progress">
        <div className="progress-status">
          {progress.status === "uploading" && "Uploading..."}
          {progress.status === "completed" && "Upload Complete!"}
          {progress.status === "error" && "Upload Failed"}
        </div>
        <div className="progress-bar-container">
          <div
            className={`progress-bar ${progress.status}`}
            style={{ width: `${progress.progress}%` }}
          />
        </div>
        <div className="progress-percentage">{progress.progress}%</div>
      </div>
    );
  };

  // Summary Cards Component
  const SummaryCards = ({ data, colorScheme }) => {
    return (
      <div className="summary-cards-container">
        {data.map((item, index) => (
          <div
            key={index}
            className="summary-card"
            style={{ background: colorScheme[index] || "#3b82f6" }}
          >
            <div className="summary-card-value">{item.value}</div>
            <div className="summary-card-label">{item.label}</div>
          </div>
        ))}
      </div>
    );
  };

  // Resources Stats Component
  const ResourcesStats = ({ data }) => {
    const stats = [
      {
        icon: <FileText className="stat-icon" />,
        number: data?.length || 0,
        label: "Total Resources",
      },
      {
        icon: <Download className="stat-icon" />,
        number: "127",
        label: "Downloads",
      },
      {
        icon: <Users className="stat-icon" />,
        number: "89",
        label: "Active Users",
      },
      {
        icon: <TrendingUp className="stat-icon" />,
        number: "4.8",
        label: "Avg Rating",
      },
    ];

    return (
      <div className="resources-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon-container">{stat.icon}</div>
            <div className="stat-content">
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Section Header Component
  const SectionHeader = ({ icon, title, description }) => (
    <div className="section-header">
      <h3>
        <span className="section-icon">{icon}</span>
        {title}
      </h3>
      <p>{description}</p>
    </div>
  );

  // Table Section Wrapper Component
  const TableSection = ({
    title,
    description,
    data,
    showAddButton = true,
    onAddClick,
    actionButtons = [],
    entityType = "weekly-schedule",
    icon = "default",
    columnConfig = {},
    hiddenColumns = [],
    children,
  }) => {
    return (
      <div className="table-section">
        {children}
        <DynamicTable
          data={data}
          title={title}
          entityType={entityType}
          icon={icon}
          searchPlaceholder={`Search ${entityType}...`}
          addButtonText={`Add ${entityType.slice(0, -1)}`}
          showAddButton={showAddButton}
          onAddClick={onAddClick}
          actionButtons={actionButtons}
          columnConfig={columnConfig}
          hiddenColumns={hiddenColumns}
          rowsPerPage={10}
          compact={false}
          isSelectable={false}
        />
      </div>
    );
  };

  const renderSection = () => {
    if (!profileData) return <div>No data available</div>;

    switch (activeSection) {
      case "overview":
        return (
          <div className="overview-section">
            {/* === SECTION HEADER === */}
            <SectionHeader
              icon={<User />}
              title="Profile Overview"
              description={`Welcome to your ${
                entityType === "student" ? "Student" : "Lecturer"
              } profile`}
            />

            <StatCardsContainer cards={statCards} size={cardSize} columns={4} />
          </div>
        );

      case "grades":
        return (
          <TableSection
            title="Academic Records"
            description="Student grades and academic performance"
            data={profileData.grades || []}
            entityType="academic-records"
            icon="award"
            showAddButton={true}
            onAddClick={handleAddGrade}
            columnConfig={getColumnConfigs("academic-records")}
            hiddenColumns={getHiddenColumns("academic-records")}
            actionButtons={[
              (row) => (
                <button
                  onClick={() => handleEditGrade(row)}
                  className="action-btn edit-btn"
                  title="Edit Grade"
                >
                  <Edit size={14} />
                  Edit
                </button>
              ),
            ]}
          />
        );

      case "courses":
        return (
          <TableSection
            title={
              entityType === "lecturer"
                ? "Course Assignments"
                : "Teaching Courses"
            }
            description={
              entityType === "lecturer"
                ? "Assign lecturer to existing courses"
                : "Current and past courses taught"
            }
            data={profileData.courses || []}
            entityType="courses"
            icon="courses"
            showAddButton={true}
            onAddClick={handleAddCourse}
            columnConfig={getColumnConfigs("courses")}
            hiddenColumns={getHiddenColumns("courses")}
          />
        );

      case "requests":
        return (
          <TableSection
            title="Messages"
            description="View your messages"
            data={profileData.messages || []}
            entityType="messages"
            icon="mail"
            showAddButton={false}
            columnConfig={getColumnConfigs("messages")}
            hiddenColumns={getHiddenColumns("messages")}
            actionButtons={[
              (row) => (
                <button
                  onClick={() => handleViewMessage(row)}
                  className="action-btn view-btn"
                  title="View Message"
                >
                  <Eye size={14} />
                  View
                </button>
              ),
            ]}
          />
        );

      case "enrollments":
        return (
          <TableSection
            title="Current Enrollments"
            description="Courses currently enrolled for the academic term"
            data={profileData.enrollments || []}
            entityType="enrollments"
            icon="users"
            showAddButton={false}
            onAddClick={handleAddEnrollment}
            columnConfig={getColumnConfigs("enrollments")}
            hiddenColumns={getHiddenColumns("enrollments")}
          />
        );

      case "schedule":
        if (entityType === "lecturer") {
          const workingHoursCards = generateWorkingHoursCards(
            profileData.schedules || []
          );
          return (
            <div className="working-hours-section">
              <SectionHeader
                icon={<Clock />}
                title="Working Hours & Availability"
                description="Manage your weekly schedule and availability for teaching and office hours"
              />
              <StatCardsContainer
                cards={workingHoursCards}
                size={cardSize}
                onCardClick={handleCardClick}
                columns={4}
              />
              <TableSection
                title="Weekly Schedule"
                description="Set your working hours and availability"
                data={profileData.schedules || []}
                entityType="weekly-schedule"
                icon="calendar"
                showAddButton={true}
                onAddClick={handleAddSchedule}
                columnConfig={getColumnConfigs("weekly-schedule")}
                hiddenColumns={getHiddenColumns("weekly-schedule")}
                actionButtons={[
                  (row) => (
                    <button
                      onClick={() => handleEditSchedule(row)}
                      className="action-btn edit-btn"
                      title="Edit Hours"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                  ),
                ]}
              />
            </div>
          );
        }
        return (
          <StatCardsContainer
            cards={statCards}
            size={cardSize}
            onCardClick={handleCardClick}
          />
        );

      // Updated Resources section in GenericProfile.jsx

      case "resources":
        if (entityType === "lecturer") {
          const profileCards = generateProfileCards(
            profileData.resources || []
          );
          return (
            <div className="lecturer-profile-section">
              <SectionHeader
                icon={<User />}
                title="Professional Profile"
                description="Manage your academic profile, CV, research, and career milestones"
              />
              <StatCardsContainer
                cards={profileCards}
                size={cardSize}
                onCardClick={handleCardClick}
                columns={4}
              />
              <TableSection
                title="Professional Documents"
                description="Manage CV, research papers, and academic documents"
                data={profileData.resources || []}
                entityType="documents"
                icon="documents"
                showAddButton={true}
                onAddClick={handleAddResource}
                columnConfig={getColumnConfigs("documents")}
                hiddenColumns={getHiddenColumns("documents")}
                actionButtons={[
                  (row) => (
                    <button
                      onClick={() => handleDownloadResource(row)}
                      className="action-btn download-btn"
                      title="Download"
                    >
                      <Download size={14} />
                      Download
                    </button>
                  ),
                  // Removed Edit button as requested
                  (row) => (
                    <button
                      onClick={() => handleDeleteResource(row)}
                      className="action-btn delete-btn"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  ),
                ]}
              />
            </div>
          );
        }
        return (
          <StatCardsContainer
            cards={statCards}
            size={cardSize}
            onCardClick={handleCardClick}
          />
        );

      default:
        return <div>Unknown section</div>;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading {entityType} profile...</p>
      </div>
    );
  }

  if (!profileData || error) {
    return (
      <div className="error-container">
        <h2>Profile Not Found</h2>
        <p>{error}</p>
        <p>Redirecting to dashboard in 5 seconds...</p>
      </div>
    );
  }

  const config = profileConfigs[entityType];

  // Filter sections based on entity type - remove schedule and resources for students
  const filteredSections =
    entityType === "student"
      ? config.sections.filter(
          (section) => section !== "schedule" && section !== "resources"
        )
      : config.sections;

  return (
    <div className="student-profile-container">
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <ProfileHeader
        entity={mainEntity}
        entityType={entityType}
        onActionsToggle={() => setShowActions(!showActions)}
      />

      <div className="main-container">
        <div className="content-wrapper">
          <ProfileInfoCard entity={mainEntity} entityType={entityType} />

          <div className="main-content">
            <div className="navbar-wrapper">
              <MidPageNavbar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                sections={filteredSections}
                sectionLabels={config.sectionLabels}
                showYear={false} // Disable year selector for this page
              />
            </div>
            <div className="tab-content"> {renderSection()}</div>
          </div>
        </div>
      </div>

      <QuickActions
        show={showActions}
        entityType={entityType}
        entity={mainEntity}
      />

      {/* File Upload Progress Indicator */}
      <FileUploadProgress progress={fileUploadProgress} />

      {/* Grade Edit Modal */}
      <PopUp
        isOpen={editGradeModalOpen}
        onClose={() => setEditGradeModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Grade"
          fields={getEditGradeFormFields()}
          onSubmit={handleGradeSubmit}
          onCancel={() => setEditGradeModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Grade Modal */}
      <PopUp
        isOpen={addGradeModalOpen}
        onClose={() => setAddGradeModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add New Grade"
          fields={getGradeFormFields(getStudentEnrolledCourses())}
          onSubmit={handleGradeSubmit}
          onCancel={() => setAddGradeModalOpen(false)}
          submitText="Add Grade"
          initialData={formData}
        />
      </PopUp>

      {/* Course Edit Modal */}
      <PopUp
        isOpen={editCourseModalOpen}
        onClose={() => setEditCourseModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title={
            entityType === "lecturer" ? "Edit Course Assignment" : "Edit Course"
          }
          fields={
            entityType === "lecturer"
              ? getLecturerCourseFormFields()
              : getCourseFormFields()
          }
          onSubmit={handleCourseSubmit}
          onCancel={() => setEditCourseModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Course Modal */}
      <PopUp
        isOpen={addCourseModalOpen}
        onClose={() => setAddCourseModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title={entityType === "lecturer" ? "Assign Course" : "Add Course"}
          fields={
            entityType === "lecturer"
              ? getLecturerCourseFormFields()
              : getCourseFormFields()
          }
          onSubmit={handleCourseSubmit}
          onCancel={() => setAddCourseModalOpen(false)}
          submitText={
            entityType === "lecturer" ? "Assign Course" : "Add Course"
          }
          initialData={formData}
        />
      </PopUp>

      {/* Enrollment Edit Modal */}
      <PopUp
        isOpen={editEnrollmentModalOpen}
        onClose={() => setEditEnrollmentModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Enrollment"
          fields={getEnrollmentFormFields()}
          onSubmit={handleEnrollmentSubmit}
          onCancel={() => setEditEnrollmentModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Enrollment Modal */}
      <PopUp
        isOpen={addEnrollmentModalOpen}
        onClose={() => setAddEnrollmentModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add Enrollment"
          fields={getEnrollmentFormFields()}
          onSubmit={handleEnrollmentSubmit}
          onCancel={() => setAddEnrollmentModalOpen(false)}
          submitText="Add Enrollment"
          initialData={formData}
        />
      </PopUp>

      {/* Schedule Edit Modal */}
      <PopUp
        isOpen={editScheduleModalOpen}
        onClose={() => setEditScheduleModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Schedule"
          fields={getScheduleFormFields()}
          onSubmit={handleScheduleSubmit}
          onCancel={() => setEditScheduleModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Schedule Modal */}
      <PopUp
        isOpen={addScheduleModalOpen}
        onClose={() => setAddScheduleModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add Schedule Entry"
          fields={getScheduleFormFields()}
          onSubmit={handleScheduleSubmit}
          onCancel={() => setAddScheduleModalOpen(false)}
          submitText="Add Schedule"
          initialData={formData}
        />
      </PopUp>

      {/* View Message Modal */}
      <PopUp
        isOpen={viewMessageModalOpen}
        onClose={() => setViewMessageModalOpen(false)}
        size="large"
        showCloseButton={true}
      >
        {selectedMessage && (
          <div className="message-details">
            <h3>Message Details</h3>
            <div className="message-info">
              <div className="info-row">
                <strong>From:</strong> {selectedMessage.senderName}
              </div>
              <div className="info-row">
                <strong>To:</strong> {selectedMessage.recipientName}
              </div>
              <div className="info-row">
                <strong>Subject:</strong> {selectedMessage.subject}
              </div>
              <div className="info-row">
                <strong>Date:</strong>{" "}
                {new Date(selectedMessage.createdAt).toLocaleDateString()}
              </div>
              <div className="info-row">
                <strong>Priority:</strong>{" "}
                <span
                  className={`priority-${selectedMessage.priority.toLowerCase()}`}
                >
                  {selectedMessage.priority}
                </span>
              </div>
              <div className="info-row">
                <strong>Status:</strong> {selectedMessage.status}
              </div>
              <div className="info-row message-content">
                <strong>Message:</strong>
                <p>{selectedMessage.content}</p>
              </div>
              {selectedMessage.replyContent && (
                <div className="info-row reply-content">
                  <strong>Reply:</strong>
                  <p>{selectedMessage.replyContent}</p>
                  <small>
                    Replied on:{" "}
                    {new Date(selectedMessage.repliedAt).toLocaleDateString()}
                  </small>
                </div>
              )}
            </div>
          </div>
        )}
      </PopUp>

      {/* Reply Message Modal */}
      <PopUp
        isOpen={replyMessageModalOpen}
        onClose={() => setReplyMessageModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        {selectedMessage && (
          <div className="reply-message">
            <h3>Reply to Message</h3>
            <div className="original-message">
              <h4>Original Message:</h4>
              <p>{selectedMessage.content}</p>
            </div>
            <div className="reply-form">
              <label htmlFor="reply-text">Your Reply:</label>
              <textarea
                id="reply-text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                rows={6}
              />
            </div>
            <div className="reply-actions">
              <button
                onClick={() => setReplyMessageModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                className="btn btn-primary"
                disabled={!replyText.trim()}
              >
                Send Reply
              </button>
            </div>
          </div>
        )}
      </PopUp>

      {/* Resource Edit Modal */}
      <PopUp
        isOpen={editResourceModalOpen}
        onClose={() => setEditResourceModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Resource"
          fields={getResourceFormFields(true)}
          onSubmit={handleResourceSubmit}
          onCancel={() => setEditResourceModalOpen(false)}
          submitText="Save Changes"
          initialData={formData}
        />
      </PopUp>

      {/* Add Resource Modal */}
      <PopUp
        isOpen={addResourceModalOpen}
        onClose={() => setAddResourceModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add Resource"
          fields={getResourceFormFields(false)}
          onSubmit={handleResourceSubmit}
          onCancel={() => setAddResourceModalOpen(false)}
          submitText="Add Resource"
          initialData={formData}
        />
      </PopUp>

      {/* View Request Modal */}
      <PopUp
        isOpen={viewRequestModalOpen}
        onClose={() => setViewRequestModalOpen(false)}
        size="large"
        showCloseButton={true}
      >
        {selectedRecord && (
          <div className="request-details">
            <h3>Message Details</h3>
            <div className="request-info">
              <div className="info-row">
                <strong>From:</strong> {selectedRecord.senderName}
              </div>
              <div className="info-row">
                <strong>Subject:</strong> {selectedRecord.subject}
              </div>
              <div className="info-row">
                <strong>Date:</strong>{" "}
                {new Date(selectedRecord.createdAt).toLocaleDateString()}
              </div>
              <div className="info-row">
                <strong>Message:</strong>
                <p className="message-content">{selectedRecord.content}</p>
              </div>
            </div>
          </div>
        )}
      </PopUp>

      {/* Response Request Modal */}
      <PopUp
        isOpen={responseRequestModalOpen}
        onClose={() => setResponseRequestModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        {selectedRecord && (
          <div className="response-request">
            <h3>Respond to Request</h3>
            <div className="request-summary">
              <div className="summary-row">
                <strong>From:</strong> {selectedRecord.senderName}
              </div>
              <div className="summary-row">
                <strong>Subject:</strong> {selectedRecord.subject}
              </div>
              <div className="summary-row">
                <strong>Original Message:</strong>
                <p className="original-message">{selectedRecord.content}</p>
              </div>
            </div>
            <div className="response-form">
              <label htmlFor="response-textarea">Your Response:</label>
              <textarea
                id="response-textarea"
                value={requestResponse}
                onChange={(e) => setRequestResponse(e.target.value)}
                placeholder="Type your response here..."
                rows={6}
                className="response-textarea"
              />
              <div className="response-actions">
                <button
                  onClick={() => setResponseRequestModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResponseRequest}
                  className="btn btn-primary"
                  disabled={!requestResponse.trim()}
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        )}
      </PopUp>
    </div>
  );
};

export default GenericProfile;
