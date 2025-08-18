// src/Hooks/useMessages.js

import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import {
  fetchReceivedMessages,
  fetchSentMessages,
  createMessage,
  sendMessageReply,
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  duplicateAnnouncement,
  fetchTemplates,
  createTemplate,
  updateTemplate,
  useTemplate,
  deleteTemplate,
  fetchFiles,
  uploadFile,
  deleteFile,
  fetchUsersByRole,
} from "../Api/messagesPageApi.js";

const useMessages = () => {
  const { authData } = useAuth();
  const userRole = authData?.role;
  const isStudent = userRole === "1300";

  const [activeSection, setActiveSection] = useState("requests");
  const [selectedYear, setSelectedYear] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [createRequestModalOpen, setCreateRequestModalOpen] = useState(false);
  const [requestFormData, setRequestFormData] = useState({});

  const [createAnnouncementModalOpen, setCreateAnnouncementModalOpen] = useState(false);
  const [editAnnouncementModalOpen, setEditAnnouncementModalOpen] = useState(false);
  const [viewAnnouncementModalOpen, setViewAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcementFormData, setAnnouncementFormData] = useState({});
  const [currentAnnouncements, setCurrentAnnouncements] = useState([]);

  const [createTemplateModalOpen, setCreateTemplateModalOpen] = useState(false);
  const [editTemplateModalOpen, setEditTemplateModalOpen] = useState(false);
  const [viewTemplateModalOpen, setViewTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateFormData, setTemplateFormData] = useState({});
  const [currentTemplates, setCurrentTemplates] = useState([]);

  const [useTemplateModalOpen, setUseTemplateModalOpen] = useState(false);
  const [useTemplateFormFields, setUseTemplateFormFields] = useState([]);

  const [uploadFileModalOpen, setUploadFileModalOpen] = useState(false);
  const [editFileModalOpen, setEditFileModalOpen] = useState(false);
  const [viewFileModalOpen, setViewFileModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileFormData, setFileFormData] = useState({});
  const [currentFiles, setCurrentFiles] = useState([]);

  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [lecturers, setLecturers] = useState([]);

  useEffect(() => {
    if (!userRole) return;
    loadData();
    if (userRole === "1100" || userRole === "1200" || isStudent) {
      fetchUserLists();
    }
  }, [activeSection, userRole]);

  const fetchUserLists = async () => {
    try {
      const adminsList = await fetchUsersByRole("1100");
      setAdmins(adminsList);
      const lecturersList = await fetchUsersByRole("1200");
      setLecturers(lecturersList);
      const studentsList = await fetchUsersByRole("1300");
      setStudents(studentsList);
    } catch (err) {
      console.error("Failed to fetch user lists:", err);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeSection === "requests") {
        let messages = [];
        if (userRole === "1300" || userRole === "1200") {
          // Student or Lecturer: show both sent and received
          const [sent, received] = await Promise.all([
            fetchSentMessages(),
            fetchReceivedMessages(),
          ]);
          messages = [...sent, ...received]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else {
          // Admin: only received
          messages = await fetchReceivedMessages();
        }
        setCurrentMessages(messages);
      } else if (activeSection === "announcement") {
        const announcements = await fetchAnnouncements();
        setCurrentAnnouncements(announcements);
      } else if (activeSection === "templates") {
        if (userRole === "1100") {
          const templates = await fetchTemplates();
          setCurrentTemplates(templates);
        } else {
          setCurrentTemplates([]);
        }
      } else if (activeSection === "files") {
        const files = await fetchFiles();
        setCurrentFiles(files);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Message Handlers ---
  const handleCreateRequest = () => {
    setRequestFormData({});
    setCreateRequestModalOpen(true);
  };

  const handleRequestSubmit = async (formData) => {
    try {
      await createMessage(formData);
      alert("Message sent successfully!");
      setCreateRequestModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Error submitting request:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleViewMessage = (row) => {
    setSelectedMessage(row);
    setViewModalOpen(true);
  };

  const handleReply = (row) => {
    setSelectedMessage(row);
    setReplyModalOpen(true);
  };

  // --- Announcement Handlers ---
  const handleCreateAnnouncement = () => {
    setSelectedAnnouncement(null);
    setAnnouncementFormData({
      priority: "medium",
      targetAudienceType: "all",
      expiryDate: "",
      scheduledDate: "",
    });
    setCreateAnnouncementModalOpen(true);
  };

  const handleViewAnnouncement = (row) => {
    setSelectedAnnouncement(row);
    setViewAnnouncementModalOpen(true);
  };

  const handleEditAnnouncement = (row) => {
    setSelectedAnnouncement(row);
    const formattedData = {
      ...row,
      expiryDate: row.expiryDate ? row.expiryDate.substring(0, 16) : "",
      scheduledDate: row.scheduledDate ? row.scheduledDate.substring(0, 16) : "",
    };
    setAnnouncementFormData(formattedData);
    setEditAnnouncementModalOpen(true);
  };

  const handleAnnouncementSubmit = async (formData) => {
    try {
      if (selectedAnnouncement) {
        await updateAnnouncement(selectedAnnouncement.id, formData);
        alert("Announcement updated successfully!");
      } else {
        await createAnnouncement(formData);
        alert("Announcement created successfully!");
      }
      setCreateAnnouncementModalOpen(false);
      setEditAnnouncementModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Error submitting announcement:", err);
      alert("Failed to save announcement. Please try again.");
    }
  };

  const handleDuplicateAnnouncementSubmit = async (formData) => {
    try {
      if (selectedAnnouncement) {
        await duplicateAnnouncement(selectedAnnouncement.id, formData);
        alert("Announcement re-sent as new successfully!");
      }
      setEditAnnouncementModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Error duplicating announcement:", err);
      alert("Failed to re-send announcement. Please try again.");
    }
  };

  // --- Template Handlers ---
  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setTemplateFormData({ status: "draft", targetAudience: "1300" });
    setCreateTemplateModalOpen(true);
  };

  const handleViewTemplate = (row) => {
    setSelectedTemplate(row);
    setViewTemplateModalOpen(true);
  };

  const handleEditTemplate = (row) => {
    setSelectedTemplate(row);
    setTemplateFormData({ ...row, variables: row.variables?.join(", ") || "" });
    setEditTemplateModalOpen(true);
  };

  const handleTemplateSubmit = async (formData) => {
    try {
      const parsedFormData = {
        ...formData,
        variables: typeof formData.variables === 'string'
          ? formData.variables.split(',').map(s => s.trim())
          : formData.variables || []
      };

      if (selectedTemplate) {
        await updateTemplate(selectedTemplate.id, parsedFormData);
        alert("Template updated successfully!");
      } else {
        await createTemplate(parsedFormData);
        alert("Template created successfully!");
      }
      setCreateTemplateModalOpen(false);
      setEditTemplateModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Error submitting template:", err);
      alert("Failed to save template. Please try again.");
    }
  };

  const handleUseTemplate = (row) => {
    setSelectedTemplate(row);
    const dynamicFields = row.variables?.map(variable => ({
      name: variable,
      label: variable.charAt(0).toUpperCase() + variable.slice(1),
      placeholder: `Enter value for ${variable}`,
      type: "text",
      required: true,
    }));
    setUseTemplateFormFields(dynamicFields || []);
    setUseTemplateModalOpen(true);
  };

  const handleUseTemplateSubmit = async (data) => {
    try {
      const { recipientIds, ...variableData } = data;
      const templateData = {
        recipientIds,
        variableValues: Object.entries(variableData).map(([name, value]) => ({ name, value }))
      };
      await useTemplate(selectedTemplate.id, templateData);
      alert("Template processed successfully! New announcements created.");
      setUseTemplateModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Error using template:", err);
      alert("Failed to process template. Please try again.");
    }
  };

  const handleDeleteTemplate = async (row) => {
    try {
      await deleteTemplate(row.id);
      return Promise.resolve();
    } catch (err) {
      console.error("Error deleting template:", err);
      throw err;
    }
  };

  // --- File Handlers ---
  const handleUploadFile = () => {
    setSelectedFile(null);
    setFileFormData({});
    setUploadFileModalOpen(true);
  };

  const handleFileSubmit = async (formData) => {
    try {
      const { file, ...fileMetadata } = formData;
      if (!file) {
        alert("Please select a file to upload.");
        return;
      }
      await uploadFile(file, fileMetadata);
      alert("File uploaded successfully!");
      setUploadFileModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleDownloadFile = (row) => {
    window.open(row.fileUrl, '_blank');
  };

  const handleDeleteFile = async (row) => {
    try {
      await deleteFile(row.id);
      return Promise.resolve();
    } catch (err) {
      console.error("Error deleting file:", err);
      throw err;
    }
  };

  return {
    activeSection,
    setActiveSection,
    selectedYear,
    setSelectedYear,
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
    uploadFileModalOpen,
    setUploadFileModalOpen,
    editFileModalOpen,
    setEditFileModalOpen,
    viewFileModalOpen,
    setViewFileModalOpen,
    selectedFile,
    fileFormData,
    createRequestModalOpen,
    setCreateRequestModalOpen,
    requestFormData,
    admins,
    lecturers,
    students,
    handleCreateRequest,
    handleRequestSubmit,
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
    handleTemplateSubmit,
    handleUseTemplate,
    handleUseTemplateSubmit,
    handleDeleteTemplate,
    handleUploadFile,
    handleFileSubmit,
    handleDownloadFile,
    handleDeleteFile,
    loadData,
  };
};

export default useMessages;