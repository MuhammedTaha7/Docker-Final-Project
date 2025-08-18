// src/Components/Dashboard/Topbar/QuickActions.jsx

import React, { useContext } from "react";
import { LogOut, User, Edit } from "react-feather";
import { AuthContext } from "../../../../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
// import "../../../../CSS/Components/Global/QuickAction.css";
import "./QuickAction.css";

const QuickAction = ({ onClose }) => {
  const { authData, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    onClose();
  };

  const handleEditProfile = () => {
    // Navigate to a user profile editing page
    navigate("/settings/profile"); 
    onClose();
  };

  return (
    <div className="quick-actions-dropdown">
      <div className="dropdown-header">
        <User size={24} />
        <span className="dropdown-username">{authData ? authData.username : "Guest"}</span>
      </div>
      <div className="dropdown-item" onClick={handleEditProfile}>
        <Edit size={16} />
        <span>Change Details</span>
      </div>
      <div className="dropdown-item" onClick={handleLogout}>
        <LogOut size={16} />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default QuickAction;