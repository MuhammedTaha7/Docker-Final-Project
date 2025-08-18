// Components/Profile/ProfileHeader.jsx
import React from 'react';
import { ArrowLeft, Edit, Download, Users, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './profileHeader.css';

const ProfileHeader = ({ entity, entityType, onActionsToggle }) => {
  const navigate = useNavigate();

  // Configuration for different entity types
  const configs = {
    student: {
      title: "Student Profile",
      subtitle: "Manage student information and academic records",
      icon: <GraduationCap />,
      dashboardRoute: "/students"
    },
    lecturer: {
      title: "Lecturer Profile", 
      subtitle: "Manage lecturer information and teaching records",
      icon: <Users />,
      dashboardRoute: "/lecturers"
    }
  };

  const config = configs[entityType] || configs.student;

  const handleBackClick = () => {
    navigate(config.dashboardRoute);
  };

  const handleExport = () => {
    console.log(`Exporting ${entityType} data for:`, entity?.name);
    // Add export logic here
  };

  return (
    <div className="student-header">
      <div className="student-header-content">
        <div className="student-header-inner">
          <div className="student-header-left">
            <button className="back-button" onClick={handleBackClick}>
              <ArrowLeft />
            </button>
            <div className="header-title">
              <div className="header-title-row">
                {config.icon}
                <h1>{config.title}</h1>
              </div>
              <p>{config.subtitle}</p>

            </div>
          </div>
          <div className="student-header-right">
            <button onClick={onActionsToggle} className="btn-primary">
              <Edit />
              <span>Actions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;