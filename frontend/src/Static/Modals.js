// Modal configurations for Messages component
export const modalConfigs = {
  // Message modals
  viewMessage: {
    title: "Message Details",
    size: "large",
    type: "view",
    fields: [
      { key: "sender", label: "From", format: (data) => `${data.sender} (${data.senderType})` },
      { key: "email", label: "Email" },
      { key: "subject", label: "Subject" },
      { key: "date", label: "Date", format: (data) => `${data.date} at ${data.time}` },
      { 
        key: "priority", 
        label: "Priority", 
        format: (data) => ({
          value: data.priority,
          className: `priority-${data.priority}`
        })
      },
      { 
        key: "message", 
        label: "Message", 
        type: "content",
        className: "view-modal-content-box"
      }
    ]
  },

  replyMessage: {
    title: (data) => `Reply to ${data?.sender}`,
    size: "large",
    type: "reply",
    showOriginalMessage: true,
    footer: {
      buttons: [
        {
          text: "Cancel",
          className: "reply-cancel-btn",
          action: "cancel"
        },
        {
          text: "Send Reply",
          className: "reply-send-btn",
          action: "submit"
        }
      ]
    },
    fields: [
      {
        key: "reply",
        label: "Your Reply:",
        type: "textarea",
        className: "reply-textarea",
        placeholder: "Type your reply here...",
        rows: 6,
        required: true
      }
    ]
  },

  // Announcement modals
  viewAnnouncement: {
    title: "Announcement Details",
    size: "large",
    type: "view",
    fields: [
      { key: "title", label: "Title" },
      { key: "targetAudience", label: "Target Audience" },
      { 
        key: "priority", 
        label: "Priority",
        format: (data) => ({
          value: data.priority,
          className: `priority-${data.priority}`
        })
      },
      { key: "status", label: "Status" },
      { key: "createdDate", label: "Created", format: (data) => `${data.createdDate} at ${data.createdTime}` },
      { key: "expiryDate", label: "Expires" },
      { 
        key: "content", 
        label: "Content", 
        type: "content",
        className: "view-modal-content-box"
      }
    ]
  },

  // Template modals
  viewTemplate: {
    title: "Template Details",
    size: "large",
    type: "view",
    fields: [
      { key: "name", label: "Name" },
      { key: "category", label: "Category" },
      { key: "targetAudience", label: "Target Audience" },
      { key: "status", label: "Status" },
      { key: "createdDate", label: "Created" },
      { key: "lastModified", label: "Last Modified" },
      { key: "variables", label: "Variables", format: (data) => data.variables.join(", ") },
      { key: "subject", label: "Subject" },
      { 
        key: "content", 
        label: "Content", 
        type: "content",
        className: "view-modal-content-box"
      }
    ]
  }
};

// Helper function to get modal config
export const getModalConfig = (modalType) => {
  return modalConfigs[modalType] || null;
};

// Helper function to render modal fields
export const renderModalField = (field, data) => {
  if (!data) return null;

  let value = data[field.key];
  
  // Apply formatting if provided
  if (field.format && typeof field.format === 'function') {
    const formattedValue = field.format(data);
    if (typeof formattedValue === 'object' && formattedValue.value !== undefined) {
      return {
        ...formattedValue,
        label: field.label
      };
    }
    value = formattedValue;
  }

  return {
    label: field.label,
    value: value,
    type: field.type || 'text',
    className: field.className || ''
  };
};

// Helper function to get modal title
export const getModalTitle = (modalType, data = null) => {
  const config = getModalConfig(modalType);
  if (!config) return "Modal";

  if (typeof config.title === 'function') {
    return config.title(data);
  }
  
  return config.title;
};

// Helper function to get modal size
export const getModalSize = (modalType) => {
  const config = getModalConfig(modalType);
  return config?.size || "medium";
};

// Helper function to get modal footer config
export const getModalFooter = (modalType) => {
  const config = getModalConfig(modalType);
  return config?.footer || null;
};