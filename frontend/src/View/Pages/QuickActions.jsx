import React from "react";

const QuickActions = ({ show, entityType, entity }) => {
  if (!show) return null;

  const studentActions = [
    { label: "Send Message", action: () => console.log("Send message") },
    { label: "View Transcript", action: () => console.log("View transcript") },
    { label: "Update Info", action: () => console.log("Update info") },
    { label: "Generate Report", action: () => console.log("Generate report") }
  ];

  const lecturerActions = [
    { label: "Send Email", action: () => console.log("Send email") },
    { label: "View Schedule", action: () => console.log("View schedule") },
    { label: "Performance Review", action: () => console.log("Performance review") },
    { label: "Update Profile", action: () => console.log("Update profile") }
  ];

  const actions = entityType === "student" ? studentActions : lecturerActions;

  return (
    <div className="quick-actions-overlay">
      <div className="quick-actions-panel">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          {actions.map((action, index) => (
            <button 
              key={index}
              onClick={action.action}
              className="action-btn"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;