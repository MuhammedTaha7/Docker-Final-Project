// src/View/Pages/Global/shouldMoveToDynamicForm.js
import React, { useState, useEffect } from "react";
import Select from 'react-select'; // Assuming you have a react-select library installed

// =======================================================
// Request Form Component (No changes)
// =======================================================
export const RequestForm = ({
  onSubmit,
  onCancel,
  admins,
  lecturers,
  userRole,
}) => {
  const [formData, setFormData] = useState({
    recipientType: "",
    recipientId: "",
    subject: "",
    content: "",
    priority: "low",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.recipientType)
      newErrors.recipientType = "Recipient type is required";
    if (!formData.recipientId) newErrors.recipientId = "Recipient is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getRecipientOptions = () => {
    if (formData.recipientType === "admin") {
      return admins.map((user) => ({
        value: user.id,
        label: `${user.name} (${user.email})`,
      }));
    }
    if (formData.recipientType === "lecturer") {
      return lecturers.map((user) => ({
        value: user.id,
        label: `${user.name} (${user.email})`,
      }));
    }
    return [];
  };

  const isStudentOrLecturer = userRole === "1300" || userRole === "1200";

  return (
    <div style={{ padding: "20px" }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* Recipient Type */}
        <div className="form-field">
          <label className="form-label">Recipient Type</label>
          <select
            name="recipientType"
            value={formData.recipientType}
            onChange={handleInputChange}
            style={{ padding: "10px", borderRadius: "5px" }}
          >
            <option value="" disabled>
              Select a recipient type
            </option>
            {isStudentOrLecturer && <option value="admin">Admin</option>}
            {isStudentOrLecturer && <option value="lecturer">Lecturer</option>}
          </select>
          {errors.recipientType && (
            <span className="error-message">{errors.recipientType}</span>
          )}
        </div>

        {/* Recipient */}
        <div className="form-field">
          <label className="form-label">Recipient</label>
          <select
            name="recipientId"
            value={formData.recipientId}
            onChange={handleInputChange}
            disabled={!formData.recipientType}
            style={{ padding: "10px", borderRadius: "5px" }}
          >
            <option value="" disabled>
              Select a recipient
            </option>
            {getRecipientOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.recipientId && (
            <span className="error-message">{errors.recipientId}</span>
          )}
        </div>

        {/* Subject */}
        <div className="form-field">
          <label className="form-label">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Enter subject"
            style={{ padding: "10px", borderRadius: "5px" }}
          />
          {errors.subject && (
            <span className="error-message">{errors.subject}</span>
          )}
        </div>

        {/* Content */}
        <div className="form-field">
          <label className="form-label">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Write your message content..."
            rows="5"
            style={{ padding: "10px", borderRadius: "5px" }}
          />
          {errors.content && (
            <span className="error-message">{errors.content}</span>
          )}
        </div>

        {/* Priority */}
        <div className="form-field">
          <label className="form-label">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            style={{ padding: "10px", borderRadius: "5px" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && (
            <span className="error-message">{errors.priority}</span>
          )}
        </div>

        {/* Footer buttons */}
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <button type="button" onClick={onCancel} className="reply-cancel-btn">
            Cancel
          </button>
          <button type="submit" className="reply-send-btn">
            Send Request
          </button>
        </div>
      </form>
    </div>
  );
};

// =======================================================
// Announcement Form Component (No changes)
// =======================================================
export const AnnouncementForm = ({
  onSave,
  onDuplicate,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.content?.trim()) newErrors.content = "Content is required";
    if (!formData.targetAudienceType)
      newErrors.targetAudienceType = "Target audience is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleDuplicateSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onDuplicate(formData);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <h3
          className="form-title"
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}
        >
          {initialData?.id ? "Edit Announcement" : "Create New Announcement"}
        </h3>

        {/* Title */}
        <div className="form-field">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            placeholder="Enter announcement title"
            style={{ padding: "10px", borderRadius: "5px" }}
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>

        {/* Content */}
        <div className="form-field">
          <label className="form-label">Content</label>
          <textarea
            name="content"
            value={formData.content || ""}
            onChange={handleInputChange}
            placeholder="Write your announcement content..."
            rows="5"
            style={{ padding: "10px", borderRadius: "5px" }}
          />
          {errors.content && (
            <span className="error-message">{errors.content}</span>
          )}
        </div>

        {/* Target Audience Type */}
        <div className="form-field">
          <label className="form-label">Target Audience</label>
          <select
            name="targetAudienceType"
            value={formData.targetAudienceType || ""}
            onChange={handleInputChange}
            style={{ padding: "10px", borderRadius: "5px" }}
          >
            <option value="" disabled>
              Select target audience
            </option>
            <option value="all">All</option>
            <option value="lecturer">Lecturers</option>
            <option value="student">Students</option>
            {/* Conditional options for department/course would go here */}
          </select>
          {errors.targetAudienceType && (
            <span className="error-message">{errors.targetAudienceType}</span>
          )}
        </div>

        {/* Priority */}
        <div className="form-field">
          <label className="form-label">Priority</label>
          <select
            name="priority"
            value={formData.priority || ""}
            onChange={handleInputChange}
            style={{ padding: "10px", borderRadius: "5px" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && (
            <span className="error-message">{errors.priority}</span>
          )}
        </div>

        {/* Expiry Date */}
        <div className="form-field">
          <label className="form-label">Expiry Date</label>
          <input
            type="datetime-local"
            name="expiryDate"
            value={formData.expiryDate || ""}
            onChange={handleInputChange}
            style={{ padding: "10px", borderRadius: "5px" }}
          />
          {errors.expiryDate && (
            <span className="error-message">{errors.expiryDate}</span>
          )}
        </div>

        {/* Scheduled Date */}
        <div className="form-field">
          <label className="form-label">Scheduled Date</label>
          <input
            type="datetime-local"
            name="scheduledDate"
            value={formData.scheduledDate || ""}
            onChange={handleInputChange}
            style={{ padding: "10px", borderRadius: "5px" }}
          />
          {errors.scheduledDate && (
            <span className="error-message">{errors.scheduledDate}</span>
          )}
        </div>

        {/* Conditional buttons for create vs edit */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button type="button" onClick={onCancel} className="reply-cancel-btn">
            Cancel
          </button>

          {initialData?.id ? (
            <>
              <button
                type="button"
                onClick={handleSaveSubmit}
                className="reply-cancel-btn"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleDuplicateSubmit}
                className="reply-send-btn"
              >
                Re-send as New
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleSaveSubmit}
              className="reply-send-btn"
            >
              Create Announcement
            </button>
          )}
        </div>
      </form>
    </div>
  );
};


// =======================================================
// 🆕 UPDATED: Template Form Component (No changes)
// This version is self-contained and implements dynamic recipient lists.
// =======================================================
export const TemplateForm = ({ formType, onSave, onUse, onCancel, initialData, students, lecturers }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    // Hardcoded options for the form fields
    const templateOptions = {
        category: [
            { value: "welcome", label: "Welcome" },
            { value: "notice", label: "Notice" },
            { value: "reminder", label: "Reminder" },
            { value: "other", label: "Other" },
        ],
        targetAudience: [
            { value: "1300", label: "Students" },
            { value: "1200", label: "Lecturers" },
        ],
        status: [
            { value: "active", label: "Active" },
            { value: "draft", label: "Draft" },
        ],
    };

    // Use a useEffect hook to set the initial form data
    useEffect(() => {
        if (formType === "use") {
            setFormData({
                // Initialize recipient type and recipient IDs for 'use' mode
                recipientType: "",
                recipientIds: [],
            });
        } else {
            // Pre-fill form for edit mode
            setFormData(initialData);
        }
    }, [initialData, formType]);
    
    // Handle changes for all form fields, including multi-select
    const handleInputChange = (e) => {
        const { name, value, options } = e.target;
        let finalValue = value;
        
        if (e.target.multiple) {
            finalValue = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: finalValue,
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };
    
    // Validation logic for all form modes
    const validateForm = () => {
        const newErrors = {};
        if (formType !== "use") {
            if (!formData.name?.trim()) newErrors.name = "Name is required";
            if (!formData.category) newErrors.category = "Category is required";
            if (!formData.targetAudience) newErrors.targetAudience = "Target audience is required";
            if (!formData.variables?.trim()) newErrors.variables = "Variables are required";
        } else {
            if (!formData.recipientType) newErrors.recipientType = "Recipient type is required";
            if (!formData.recipientIds?.length) newErrors.recipientIds = "At least one recipient must be selected";
        }
        if (!formData.subject?.trim()) newErrors.subject = "Subject is required";
        if (!formData.content?.trim()) newErrors.content = "Content is required";
        
        // Dynamic variable validation
        if (formType === "use" && initialData.variables) {
            initialData.variables.forEach(variable => {
                if (!formData[variable]?.trim()) {
                    newErrors[variable] = `${variable} is required`;
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Main submit handler that calls the correct parent function
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (formType === "use") {
                onUse(formData);
            } else {
                const parsedData = {
                    ...formData,
                    variables: formData.variables ? formData.variables.split(',').map(s => s.trim()) : [],
                };
                onSave(parsedData);
            }
        }
    };
    
    // Options for the recipient multi-select field
    const recipientOptions = formData.recipientType === "1300" ? students : lecturers;

    return (
        <div style={{ padding: "20px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 className="form-title" style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>
                    {formType === "create" && "Create New Template"}
                    {formType === "edit" && "Edit Template"}
                    {formType === "use" && `Use Template: ${initialData?.name}`}
                </h3>
                
                {/* Conditional Fields for Create/Edit modes */}
                {formType !== "use" && (
                    <>
                        <div className="form-field">
                            <label className="form-label">Name</label>
                            <input type="text" name="name" value={formData.name || ""} onChange={handleInputChange} placeholder="Enter template name" style={{ padding: "10px", borderRadius: "5px" }} />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>
                        <div className="form-field">
                            <label className="form-label">Category</label>
                            <select name="category" value={formData.category || ""} onChange={handleInputChange} style={{ padding: "10px", borderRadius: "5px" }}>
                                <option value="" disabled>Select Category</option>
                                {templateOptions.category.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            {errors.category && <span className="error-message">{errors.category}</span>}
                        </div>
                        <div className="form-field">
                            <label className="form-label">Target Audience</label>
                            <select name="targetAudience" value={formData.targetAudience || ""} onChange={handleInputChange} style={{ padding: "10px", borderRadius: "5px" }}>
                                <option value="" disabled>Select Target Audience</option>
                                {templateOptions.targetAudience.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            {errors.targetAudience && <span className="error-message">{errors.targetAudience}</span>}
                        </div>
                        <div className="form-field">
                            <label className="form-label">Status</label>
                            <select name="status" value={formData.status || ""} onChange={handleInputChange} style={{ padding: "10px", borderRadius: "5px" }}>
                                <option value="" disabled>Select Status</option>
                                {templateOptions.status.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            {errors.status && <span className="error-message">{errors.status}</span>}
                        </div>
                        <div className="form-field">
                            <label className="form-label">Variables (e.g., name, gpa)</label>
                            <input type="text" name="variables" value={formData.variables || ""} onChange={handleInputChange} placeholder="name, gpa" style={{ padding: "10px", borderRadius: "5px" }} />
                            {errors.variables && <span className="error-message">{errors.variables}</span>}
                        </div>
                    </>
                )}

                {/* Conditional Fields for 'use' mode */}
                {formType === "use" && (
                    <>
                        <div className="form-field">
                            <label className="form-label">Recipient Type</label>
                            <select name="recipientType" value={formData.recipientType || ""} onChange={handleInputChange} style={{ padding: "10px", borderRadius: "5px" }}>
                                <option value="" disabled>Select Recipient Type</option>
                                {templateOptions.targetAudience.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            {errors.recipientType && <span className="error-message">{errors.recipientType}</span>}
                        </div>
                        {formData.recipientType && (
                            <div className="form-field">
                                <label className="form-label">Recipients</label>
                                <select multiple name="recipientIds" value={formData.recipientIds || []} onChange={handleInputChange} style={{width: "100%",  borderRadius: "5px"}}>
                                    {recipientOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                                </select>
                                {errors.recipientIds && <span className="error-message">{errors.recipientIds}</span>}
                            </div>
                        )}
                        {initialData?.variables?.map(variable => (
                            <div className="form-field" key={variable}>
                                <label className="form-label">{variable.charAt(0).toUpperCase() + variable.slice(1)}</label>
                                <input type="text" name={variable} value={formData[variable] || ""} onChange={handleInputChange} placeholder={`Enter value for ${variable}`} style={{ padding: "10px", borderRadius: "5px" }} />
                                {errors[variable] && <span className="error-message">{errors[variable]}</span>}
                            </div>
                        ))}
                    </>
                )}
                
                {/* Common fields for all modes */}
                <div className="form-field">
                    <label className="form-label">Subject</label>
                    <input type="text" name="subject" value={formData.subject || ""} onChange={handleInputChange} placeholder="Enter message subject" style={{ padding: "10px", borderRadius: "5px" }} />
                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                </div>
                <div className="form-field">
                    <label className="form-label">Content</label>
                    <textarea name="content" value={formData.content || ""} onChange={handleInputChange} placeholder="Write your message content..." rows="5" style={{ padding: "10px", borderRadius: "5px" }} />
                    {errors.content && <span className="error-message">{errors.content}</span>}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                    <button type="button" onClick={onCancel} className="reply-cancel-btn">Cancel</button>
                    <button type="submit" className="reply-send-btn">
                        {formType === "create" && "Create Template"}
                        {formType === "edit" && "Save Changes"}
                        {formType === "use" && "Create Announcements"}
                    </button>
                </div>
            </form>
        </div>
    );
};


// =======================================================
// 🆕 NEW: File Upload Form Component
// =======================================================
export const FileUploadForm = ({ onSave, onCancel, students, lecturers }) => {
    const [formData, setFormData] = useState({
        file: null,
        name: "",
        description: "",
        category: "",
        accessType: "personal",
        recipientIds: [],
    });
    const [errors, setErrors] = useState({});

    // This useEffect is not strictly necessary for this simple form,
    // but it's good practice for more complex forms.
    // useEffect(() => {
    //     // Any initial data setting logic could go here
    // }, []);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (name === "file") {
            setFormData((prev) => ({ ...prev, file: files[0] }));
        } else if (name === "recipientIds") {
            const selectedOptions = Array.from(e.target.options)
                .filter(option => option.selected)
                .map(option => option.value);
            setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.file) newErrors.file = "File is required";
        if (!formData.name?.trim()) newErrors.name = "File name is required";
        if (!formData.description?.trim()) newErrors.description = "Description is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (formData.accessType === "personal" && formData.recipientIds.length === 0) {
            newErrors.recipientIds = "At least one recipient must be selected";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };
    
    // Options for the recipient multi-select field
    const recipientOptions = formData.accessType === "personal" ? [...students, ...lecturers] : [];

    return (
        <div style={{ padding: "20px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 className="form-title" style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>
                    Upload New File
                </h3>

                {/* File input */}
                <div className="form-field">
                    <label className="form-label">File</label>
                    <input type="file" name="file" onChange={handleInputChange} style={{ padding: "10px", borderRadius: "5px" }} />
                    {errors.file && <span className="error-message">{errors.file}</span>}
                </div>
                
                {/* File Name */}
                <div className="form-field">
                    <label className="form-label">File Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter file name" style={{ padding: "10px", borderRadius: "5px" }} />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                {/* Description */}
                <div className="form-field">
                    <label className="form-label">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter file description" rows="3" style={{ padding: "10px", borderRadius: "5px" }} />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                </div>

                {/* Category */}
                <div className="form-field">
                    <label className="form-label">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} style={{ padding: "10px", borderRadius: "5px" }}>
                        <option value="" disabled>Select Category</option>
                        <option value="Academic">Academic</option>
                        <option value="Administrative">Administrative</option>
                        <option value="Resources">Resources</option>
                        <option value="Assignments">Assignments</option>
                        <option value="Exams">Exams</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.category && <span className="error-message">{errors.category}</span>}
                </div>

                {/* Access Type (new logic) */}
                <div className="form-field">
                    <label className="form-label">Access Control</label>
                    <select name="accessType" value={formData.accessType} onChange={handleInputChange} style={{ padding: "10px", borderRadius: "5px" }}>
                        <option value="personal">Specific Users</option>
                        {/* Other options can be added here later */}
                    </select>
                    {errors.accessType && <span className="error-message">{errors.accessType}</span>}
                </div>
                
                {/* Recipient Selection (only for personal access) */}
                {formData.accessType === "personal" && (
                    <div className="form-field">
                        <label className="form-label">Recipients</label>
                        <select multiple name="recipientIds" value={formData.recipientIds} onChange={handleInputChange} style={{ width: "100%", borderRadius: "5px" }}>
                            <optgroup label="Students">
                                {students.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                            </optgroup>
                            <optgroup label="Lecturers">
                                {lecturers.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                            </optgroup>
                        </select>
                        {errors.recipientIds && <span className="error-message">{errors.recipientIds}</span>}
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                    <button type="button" onClick={onCancel} className="reply-cancel-btn">Cancel</button>
                    <button type="submit" className="reply-send-btn">Upload File</button>
                </div>
            </form>
        </div>
    );
};