import { useState, useEffect } from "react";
import {
  Eye,
  Reply,
  Edit,
  Download,
  Trash2,
  Plus,
  ExternalLink,
  FileText,
  Image,
  Archive,
  File,
  Music,
  Video,
  Code,
  BookOpen,
} from "lucide-react";

// Components
import MidPageNavbar from "../../Components/CoursePage/Content/MidPageNavBar";
import Table from "../../Components/Tables/Table";
import Modal from "../../Components/Modal/Modal.jsx";
import PopUp from "../../Components/Cards/PopUp.jsx";
// You can remove the DynamicForm import or leave it if other parts of the page use it
import DynamicForm from "../../Components/Forms/dynamicForm.jsx";
import LoadingSpinner from "./Loading.jsx";

// Import getFieldIcon from dynamicForm.jsx (if you still need it for other parts)
import { getFieldIcon } from "../../Components/Forms/dynamicForm.jsx";

// Custom Hooks
import useMessages from "../../../Hooks/useMessages.js";
import { useAuth } from "../../../Context/AuthContext.jsx";

// Static Data (for form fields, we will still use these)
import {
  announcementFormFields,
  templateFormFields,
} from "../../../Static/FIxed/messagesPageData.js";

// API Functions
import {
  sendMessageReply,
  createMessage,
} from "../../../Api/messagesPageApi.js";

import {
  RequestForm,
  AnnouncementForm,
  TemplateForm,
  FileUploadForm,
} from "./shouldMoveToDynamicForm.js";

// Styles
import "../../../CSS/Pages/Messages/messages.css";

// Utility function to get file icon based on type (unchanged)
const getFileIcon = (fileName, fileType) => {
  const extension = fileName?.split(".").pop()?.toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
    return Image;
  } else if (["pdf"].includes(extension)) {
    return FileText;
  } else if (["doc", "docx"].includes(extension)) {
    return BookOpen;
  } else if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
    return Archive;
  } else if (["mp3", "wav", "flac", "aac"].includes(extension)) {
    return Music;
  } else if (["mp4", "avi", "mov", "wmv", "flv"].includes(extension)) {
    return Video;
  } else if (
    ["js", "html", "css", "php", "py", "java", "cpp"].includes(extension)
  ) {
    return Code;
  }

  return File;
};

// Enhanced styling with modern design (unchanged)
const styles = {
  viewModalContainer: { lineHeight: "1.6", color: "#374151" },
  viewModalInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  viewModalLabel: {
    fontWeight: "600",
    color: "#64748b",
    minWidth: "120px",
    fontSize: "14px",
  },
  viewModalValue: { color: "#1e293b", fontWeight: "500" },
  priorityHigh: {
    color: "#dc2626",
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: "12px",
    padding: "4px 8px",
    backgroundColor: "#fee2e2",
    borderRadius: "6px",
  },
  priorityMedium: {
    color: "#d97706",
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: "12px",
    padding: "4px 8px",
    backgroundColor: "#fef3c7",
    borderRadius: "6px",
  },
  priorityLow: {
    color: "#059669",
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: "12px",
    padding: "4px 8px",
    backgroundColor: "#d1fae5",
    borderRadius: "6px",
  },
  viewModalContentBox: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  originalMsgBox: {
    padding: "20px",
    backgroundColor: "#eff6ff",
    borderRadius: "12px",
    border: "1px solid #bfdbfe",
    marginBottom: "24px",
  },
  originalMsgText: {
    fontSize: "14px",
    color: "#374151",
    whiteSpace: "pre-wrap",
    marginTop: "12px",
  },
  replyLabel: {
    display: "block",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "12px",
    fontSize: "15px",
  },
  replyTextarea: {
    width: "100%",
    minHeight: "120px",
    padding: "16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
    transition: "all 0.2s ease",
    backgroundColor: "#ffffff",
  },
  replyFooter: {
    display: "flex",
    gap: "16px",
    justifyContent: "flex-end",
    paddingTop: "20px",
  },
  replyCancelBtn: {
    padding: "12px 24px",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    color: "#64748b",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  replySendBtn: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#3b82f6",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  actionBtn: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  viewBtn: { backgroundColor: "#6366f1", color: "white" },
  viewBtnMessages: { backgroundColor: "#0ea5e9", color: "white" },
  replyBtnMessages: { backgroundColor: "#10b981", color: "white" },
  editBtn: { backgroundColor: "#f59e0b", color: "white" },
  downloadBtn: { backgroundColor: "#10b981", color: "white" },
  deleteBtn: { backgroundColor: "#ef4444", color: "white" },
  replyBtn: { backgroundColor: "#8b5cf6", color: "white" },
  useBtn: { backgroundColor: "#06b6d4", color: "white" },
  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px",
  },
  tag: {
    padding: "6px 12px",
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  fileIcon: { marginRight: "8px", color: "#6366f1" },
};

const Messages = () => {
  const { authData } = useAuth();
  const userRole = authData?.role;
  const isAdmin = userRole === "1100";
  const isLecturer = userRole === "1200";
  const isStudent = userRole === "1300";

  const {
    activeSection,
    setActiveSection,
    isLoading,
    error,
    currentMessages,
    currentAnnouncements,
    currentTemplates,
    currentFiles,
    viewModalOpen,
    setViewModalOpen,
    replyModalOpen,
    setReplyModalOpen,
    selectedMessage,
    createRequestModalOpen,
    setCreateRequestModalOpen,
    createAnnouncementModalOpen,
    setCreateAnnouncementModalOpen,
    editAnnouncementModalOpen,
    setEditAnnouncementModalOpen,
    viewAnnouncementModalOpen,
    setViewAnnouncementModalOpen,
    selectedAnnouncement,
    announcementFormData,
    createTemplateModalOpen,
    setCreateTemplateModalOpen,
    editTemplateModalOpen,
    setEditTemplateModalOpen,
    viewTemplateModalOpen,
    setViewTemplateModalOpen,
    selectedTemplate,
    templateFormData,

    useTemplateModalOpen,
    setUseTemplateModalOpen,
    useTemplateFormFields,

    useTemplateFields,
    useTemplateFormTitle,
    uploadFileModalOpen,
    setUploadFileModalOpen,
    editFileModalOpen,
    setEditFileModalOpen,
    viewFileModalOpen,
    setViewFileModalOpen,
    selectedFile,
    fileFormData,
    admins,
    lecturers,
    students,

    handleCreateRequest,
    handleViewMessage,
    handleReply,
    handleCreateAnnouncement,
    handleViewAnnouncement,
    handleEditAnnouncement,
    handleAnnouncementSubmit,
    handleDuplicateAnnouncementSubmit,

    handleCreateTemplate,
    handleViewTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    handleTemplateSubmit,
    handleUseTemplate,
    handleUseTemplateSubmit,

    handleUploadFile,
    handleFileSubmit,
    handleDownloadFile,
    handleDeleteFile,
    loadData,
  } = useMessages();

  const [replyText, setReplyText] = useState("");
  const [requestFormFields, setRequestFormFields] = useState([]);

  // Use useEffect to set request form fields from useMessages hook
useEffect(() => {
  const currentUserId = authData?.id;
  const { fields, lecturerOptions } = getRequestFormFields(admins, lecturers, userRole, currentUserId);
  setRequestFormFields(fields);
}, [admins, lecturers, userRole, authData]);

const getRequestFormFields = (admins, lecturers, userRole, currentUserId) => {
  const adminOptions = admins.map((user) => ({
    value: user.id,
    label: `${user.name} (${user.email})`,
  }));

  // 🔥 Always filter out current user
  const filteredLecturers = lecturers.filter((user) => user.id !== currentUserId);

  const lecturerOptions = filteredLecturers.map((user) => ({
    value: user.id,
    label: `${user.name} (${user.email})`,
  }));

  const recipientTypeOptions = [];
  if (userRole === "1300" || userRole === "1200") {
    recipientTypeOptions.push(
      { value: "admin", label: "Admin" },
      { value: "lecturer", label: "Lecturer" }
    );
  }

  const fields = [
    {
      name: "recipientType",
      label: "Recipient Type",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select a recipient type" },
        ...recipientTypeOptions,
      ],
    },
    {
      name: "recipientId",
      label: "Recipient",
      type: "select",
      required: true,
      options: [],
      placeholder: "Select a recipient type first",
    },
    {
      name: "subject",
      label: "Subject",
      type: "text",
      required: true,
      placeholder: "Enter message subject",
    },
    {
      name: "content",
      label: "Content",
      type: "textarea",
      required: true,
      placeholder: "Write your message content...",
      rows: 5,
    },
    {
      name: "priority",
      label: "Priority",
      type: "select",
      required: true,
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
    },
  ];

  return { fields, adminOptions, lecturerOptions };
};

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      alert("Please enter a reply message");
      return;
    }

    try {
      const replyData = {
        replyContent: replyText,
      };

      await sendMessageReply(selectedMessage.id, replyData);
      alert("Reply sent successfully!");
      setReplyModalOpen(false);
      setReplyText("");
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply. Please try again.");
    }
  };

  const handleRequestFormSubmit = async (formData) => {
    try {
      await createMessage(formData);
      alert("Message sent successfully!");
      setCreateRequestModalOpen(false);
      await loadData();
      setCreateRequestModalOpen(false);
    } catch (err) {
      console.error("Error submitting request:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  // 🆕 NEW: Handlers for file modals
  const handleViewFile = (file) => {
    setSelectedFile(file);
    setViewFileModalOpen(true);
  };

  const sectionsToShow = [
    "requests",
    "announcement",
    "templates",
    "files",
  ].filter((section) => {
    if (section === "templates" && !isAdmin) {
      return false;
    }
    return true;
  });

  const renderSection = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <div className="error-message">Error: {error}</div>;
    }

    switch (activeSection) {
      case "requests":
        return (
          <Table
            title="Messages"
            entityType="requests"
            showAddButton={isStudent || isLecturer}
            addButtonText="Create New Request"
            onAddClick={handleCreateRequest}
            data={currentMessages}
            isSelectable={false}
            actionButtons={[
              (row) => (
                <button
                  onClick={() => handleViewMessage(row)}
                  className="msg-view-btn"
                >
                  <Eye size={16} />
                  View
                </button>
              ),
              (row) =>
                (isAdmin || isLecturer) &&
                row.status !== "replied" &&
                row.recipientId === authData?.id && (
                  <button
                    onClick={() => handleReply(row)}
                    className="msg-reply-btn"
                  >
                    <Reply size={16} />
                    Reply
                  </button>
                ),
              (row) =>
                (isAdmin || isLecturer || isStudent) &&
                row.status === "replied" && (
                  <button className="msg-replied-btn" disabled>
                    <Reply size={16} />
                    Replied
                  </button>
                ),
            ]}
          />
        );
      case "announcement":
        return (
          <Table
            title="Announcements"
            entityType="announcements"
            data={currentAnnouncements}
            showAddButton={isAdmin || isLecturer}
            addButtonText="Create Announcement"
            onAddClick={handleCreateAnnouncement}
            isSelectable={false}
            actionButtons={[
              (row) => (
                <button
                  onClick={() => handleViewAnnouncement(row)}
                  className="msg-view-btn"
                >
                  <Eye size={16} />
                  View
                </button>
              ),
              (row) =>
                (isAdmin || row.creatorId === authData?.id) && (
                  <button
                    onClick={() => handleEditAnnouncement(row)}
                    className="msg-edit-btn"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                ),
            ]}
          />
        );
      case "templates":
        if (!isAdmin)
          return <div className="permission-denied">Access Denied</div>;
        return (
          <Table
            title="Templates"
            entityType="templates"
            data={currentTemplates}
            showAddButton={true}
            addButtonText="Create Template"
            onAddClick={handleCreateTemplate}
            onDelete={async (selectedRows, selectedKeys) => {
              if (
                window.confirm(
                  `Are you sure you want to delete ${selectedRows.length} template(s)? This action cannot be undone.`
                )
              ) {
                try {
                  await Promise.all(
                    selectedRows.map((template) =>
                      handleDeleteTemplate(template)
                    )
                  );
                  loadData();
                } catch (error) {
                  console.error("Error deleting templates:", error);
                  alert("Failed to delete some templates. Please try again.");
                }
              }
            }}
            actionButtons={[
              (row) => (
                <button
                  onClick={() => handleUseTemplate(row)}
                  className="msg-use-btn"
                >
                  <Plus size={16} />
                  Use
                </button>
              ),
              (row) => (
                <button
                  onClick={() => handleViewTemplate(row)}
                  className="msg-view-btn"
                >
                  <Eye size={16} />
                  View
                </button>
              ),
              (row) => (
                <button
                  onClick={() => handleEditTemplate(row)}
                  className="msg-edit-btn"
                >
                  <Edit size={16} />
                  Edit
                </button>
              ),
            ]}
          />
        );
      case "files":
        return (
          <Table
            title="Files"
            entityType="files"
            data={currentFiles}
            showAddButton={isAdmin}
            addButtonText="Upload File"
            onAddClick={handleUploadFile}
            onDelete={async (selectedRows, selectedKeys) => {
              if (
                window.confirm(
                  `Are you sure you want to delete ${selectedRows.length} file(s)?`
                )
              ) {
                try {
                  await Promise.all(
                    selectedRows.map((file) => handleDeleteFile(file))
                  );
                  loadData();
                } catch (error) {
                  console.error("Error deleting files:", error);
                  alert("Failed to delete some files. Please try again.");
                }
              }
            }}
            actionButtons={[
              (row) => (
                <button
                  onClick={() => handleDownloadFile(row)}
                  className="msg-duplicate-btn"
                >
                  <Download size={16} />
                  Download
                </button>
              ),
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="messages-container">
      <div className="mid-navbar-container">
        <MidPageNavbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sections={sectionsToShow}
          showYear={false}
        />
      </div>

      <div className="dynamic-section">{renderSection()}</div>

      {/* Create New Request Modal - NOW USES A REGULAR FORM */}
      <PopUp
        isOpen={createRequestModalOpen}
        onClose={() => setCreateRequestModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <RequestForm
          onSubmit={handleRequestFormSubmit}
          onCancel={() => setCreateRequestModalOpen(false)}
          admins={admins}
          lecturers={lecturers}
          userRole={userRole}
        />
      </PopUp>

      {/* Message View Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Message Details"
        size="large"
      >
        {selectedMessage && (
          <div
            className="view-modal-container"
            style={styles.viewModalContainer}
          >
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                From:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedMessage.senderName}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Subject:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedMessage.subject}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Priority:
              </span>
              <span
                className={`priority-${selectedMessage.priority?.toLowerCase()}`}
                style={
                  selectedMessage.priority?.toLowerCase() === "high"
                    ? styles.priorityHigh
                    : selectedMessage.priority?.toLowerCase() === "medium"
                    ? styles.priorityMedium
                    : styles.priorityLow
                }
              >
                {selectedMessage.priority}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Status:
              </span>
              <span
                className={`status-${selectedMessage.status?.toLowerCase()}`}
                style={styles.viewModalValue}
              >
                {selectedMessage.status}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Date:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedMessage.createdAt}
              </span>
            </div>
            <div
              className="message-content-box"
              style={styles.viewModalContentBox}
            >
              <strong
                className="message-label"
                style={{ fontSize: "16px", color: "#1e293b" }}
              >
                Original Message:
              </strong>
              <div className="message-text" style={styles.originalMsgText}>
                {selectedMessage.content}
              </div>
            </div>
            {selectedMessage.replyContent && (
              <div
                className="message-content-box"
                style={{ ...styles.viewModalContentBox, marginTop: "12px" }}
              >
                <strong
                  className="message-label"
                  style={{ fontSize: "16px", color: "#1e293b" }}
                >
                  Reply:
                </strong>
                <div className="message-text" style={styles.originalMsgText}>
                  {selectedMessage.replyContent}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        title={`Reply to ${selectedMessage?.senderName}`}
        size="large"
        footer={
          <div className="reply-footer" style={styles.replyFooter}>
            <button
              onClick={() => setReplyModalOpen(false)}
              className="reply-cancel-btn"
              style={styles.replyCancelBtn}
            >
              Cancel
            </button>
            <button
              className="reply-send-btn"
              onClick={handleSendReply}
              style={styles.replySendBtn}
            >
              <Reply size={16} />
              Send Reply
            </button>
          </div>
        }
      >
        {selectedMessage && (
          <div>
            <div className="original-msg-box" style={styles.originalMsgBox}>
              <strong
                className="original-msg-label"
                style={{ fontSize: "15px" }}
              >
                Original Message:
              </strong>
              <div className="original-msg-text" style={styles.originalMsgText}>
                {selectedMessage.content}
              </div>
            </div>
            <div>
              <label className="reply-label" style={styles.replyLabel}>
                Your Reply:
              </label>
              <textarea
                rows="6"
                className="reply-textarea"
                style={styles.replyTextarea}
                placeholder="Type your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Announcement Modals */}
      <PopUp
        isOpen={createAnnouncementModalOpen}
        onClose={() => setCreateAnnouncementModalOpen(false)}
        size="large"
        showCloseButton={false}
      >

        <AnnouncementForm
          onSave={handleAnnouncementSubmit} // onSave is the create action here
          onCancel={() => setCreateAnnouncementModalOpen(false)}
          initialData={announcementFormData}
        />
      </PopUp>

      <PopUp
        isOpen={editAnnouncementModalOpen}
        onClose={() => setEditAnnouncementModalOpen(false)}
        size="large"
        showCloseButton={false}
      >

        <AnnouncementForm
          onSave={handleAnnouncementSubmit} // onSave is the simple update action
          onDuplicate={handleDuplicateAnnouncementSubmit} // onDuplicate is the re-send action
          onCancel={() => setEditAnnouncementModalOpen(false)}
          initialData={announcementFormData}
        />
      </PopUp>

      <Modal
        isOpen={viewAnnouncementModalOpen}
        onClose={() => setViewAnnouncementModalOpen(false)}
        title="Announcement Details"
        size="large"
      >
        {selectedAnnouncement && (
          <div
            className="view-modal-container"
            style={styles.viewModalContainer}
          >
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Title:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedAnnouncement.title}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Creator:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedAnnouncement.creatorName}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Target Audience:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedAnnouncement.targetAudienceType}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Priority:
              </span>
              <span
                className={`priority-${selectedAnnouncement.priority?.toLowerCase()}`}
                style={
                  selectedAnnouncement.priority?.toLowerCase() === "high"
                    ? styles.priorityHigh
                    : selectedAnnouncement.priority?.toLowerCase() === "medium"
                    ? styles.priorityMedium
                    : styles.priorityLow
                }
              >
                {selectedAnnouncement.priority}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Status:
              </span>
              <span
                className={`status-${selectedAnnouncement.status?.toLowerCase()}`}
                style={styles.viewModalValue}
              >
                {selectedAnnouncement.status}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Created:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedAnnouncement.createdAt}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Expires:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedAnnouncement.expiryDate}
              </span>
            </div>
            <div
              className="view-modal-content-box"
              style={styles.viewModalContentBox}
            >
              <strong
                className="message-label"
                style={{ fontSize: "16px", color: "#1e293b" }}
              >
                Content:
              </strong>
              <div className="message-text" style={styles.originalMsgText}>
                {selectedAnnouncement.content}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Template Modals */}
      <PopUp
        isOpen={createTemplateModalOpen}
        onClose={() => setCreateTemplateModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <TemplateForm
          formType="create"
          onSave={handleTemplateSubmit}
          onCancel={() => setCreateTemplateModalOpen(false)}
          initialData={templateFormData}
        />
      </PopUp>

      <PopUp
        isOpen={editTemplateModalOpen}
        onClose={() => setEditTemplateModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <TemplateForm
          formType="edit"
          onSave={handleTemplateSubmit}
          onCancel={() => setEditTemplateModalOpen(false)}
          initialData={templateFormData}
        />
      </PopUp>

      <Modal
        isOpen={viewTemplateModalOpen}
        onClose={() => setViewTemplateModalOpen(false)}
        title="Template Details"
        size="large"
      >
        {selectedTemplate && (
          <div
            className="view-modal-container"
            style={styles.viewModalContainer}
          >
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Name:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedTemplate.name}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Category:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedTemplate.category}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Target Audience:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedTemplate.targetAudience}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Status:
              </span>
              <span
                className={`status-${selectedTemplate.status?.toLowerCase()}`}
                style={styles.viewModalValue}
              >
                {selectedTemplate.status}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Created:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedTemplate.createdAt}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Last Modified:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedTemplate.updatedAt}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Variables:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedTemplate.variables?.join(", ")}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Subject:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedTemplate.subject}
              </span>
            </div>
            <div
              className="view-modal-content-box"
              style={styles.viewModalContentBox}
            >
              <strong
                className="message-label"
                style={{ fontSize: "16px", color: "#1e293b" }}
              >
                Content:
              </strong>
              <div className="message-text" style={styles.originalMsgText}>
                {selectedTemplate.content}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <PopUp
        isOpen={useTemplateModalOpen}
        onClose={() => setUseTemplateModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <TemplateForm
          formType="use"
          onUse={handleUseTemplateSubmit}
          onCancel={() => setUseTemplateModalOpen(false)}
          initialData={selectedTemplate}
          dynamicFields={useTemplateFormFields}
          students={students} // 🆕 PASS students list
          lecturers={lecturers} // 🆕 PASS lecturers list
        />
      </PopUp>

      {/* Files Modals */}
      <PopUp
        isOpen={uploadFileModalOpen}
        onClose={() => setUploadFileModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <FileUploadForm
          onSave={handleFileSubmit}
          onCancel={() => setUploadFileModalOpen(false)}
          students={students}
          lecturers={lecturers}
        />
      </PopUp>
      <Modal
        isOpen={viewFileModalOpen}
        onClose={() => setViewFileModalOpen(false)}
        title="File Details"
        size="large"
      >
        {selectedFile && (
          <div
            className="view-modal-container"
            style={styles.viewModalContainer}
          >
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Name:
              </span>
              <div
                className="view-modal-value file-name-container"
                style={{
                  ...styles.viewModalValue,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {(() => {
                  const IconComponent = getFileIcon(
                    selectedFile.name,
                    selectedFile.type
                  );
                  return <IconComponent size={20} style={styles.fileIcon} />;
                })()}
                {selectedFile.name}
              </div>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Type:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedFile.type}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Size:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedFile.size}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Category:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedFile.category}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Uploaded By:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedFile.uploadedByUserName}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Upload Date:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedFile.uploadDate}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Access Control:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedFile.accessType?.charAt(0).toUpperCase() +
                  selectedFile.accessType?.slice(1)}{" "}
                → {selectedFile.accessBy} → {selectedFile.accessValue}
              </span>
            </div>
            <div className="view-modal-info" style={styles.viewModalInfo}>
              <span className="view-modal-label" style={styles.viewModalLabel}>
                Downloads:
              </span>
              <span className="view-modal-value" style={styles.viewModalValue}>
                {selectedFile.downloadCount}
              </span>
            </div>
            <div
              className="message-content-box"
              style={styles.viewModalContentBox}
            >
              <strong
                className="message-label"
                style={{ fontSize: "16px", color: "#1e293b" }}
              >
                Description:
              </strong>
              <div className="message-text" style={styles.originalMsgText}>
                {selectedFile.description}
              </div>
            </div>
            <div
              className="file-actions-container"
              style={{
                marginTop: "24px",
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => handleViewFile(selectedFile)}
                className="msg-view-btn"
                style={{
                  ...styles.actionBtn,
                  ...styles.viewBtn,
                  fontSize: "14px",
                  padding: "12px 20px",
                }}
              >
                <ExternalLink size={18} />
                Open File
              </button>
              <button
                onClick={() => handleDownloadFile(selectedFile)}
                className="msg-duplicate-btn"
                style={{
                  ...styles.actionBtn,
                  ...styles.downloadBtn,
                  fontSize: "14px",
                  padding: "12px 20px",
                }}
              >
                <Download size={18} />
                Download File
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Messages;