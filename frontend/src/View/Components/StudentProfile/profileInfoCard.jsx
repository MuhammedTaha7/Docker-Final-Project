// Components/Profile/ProfileInfoCard.jsx
import React from 'react';
import { Mail, Phone, MapPin, Calendar, Users, Building, BookOpen, Star, Award } from 'lucide-react';
import './profileInfoCard.css';

const ProfileInfoCard = ({ entity, entityType }) => {
  if (!entity) return <div>Loading...</div>;

  // Configuration for different entity types
  const configs = {
    student: {
      title: 'Student Profile',
      statusLabel: entity.status,
      contactSection: {
        title: "Contact Information",
        items: [
          { icon: <Mail />, value: entity.email },
          { icon: <Phone />, value: entity.phone || "Not provided" },
          { icon: <MapPin />, value: entity.address || "Not provided", className: "address" },
          { icon: <Calendar />, value: entity.dateOfBirth ? `Born: ${new Date(entity.dateOfBirth).toLocaleDateString()}` : `Enrollment: ${entity.academicYear}` },
        ]
      },
      statsSection: {
        title: "Academic Stats",
        items: [
          { value: entity.gpa || "N/A", label: "GPA", className: "stat-gpa" },
          { value: entity.graduationYear || entity.academicYear, label: "Year", className: "stat-year" },
          { value: entity.division?.replace("-", " ").toUpperCase() || entity.major || "Not specified", label: "Division/Major", className: "stat-major" }
        ]
      }
    },
    lecturer: {
      title: 'Lecturer Profile',
      statusLabel: entity.status,
      contactSection: {
        title: "Professional Information",
        items: [
          { icon: <Mail />, value: entity.email },
          { icon: <Phone />, value: entity.phone || "Not provided" },
          { icon: <Building />, value: `Department: ${entity.department?.replace("-", " ").toUpperCase()}` },
          { icon: <BookOpen />, value: `Specialization: ${entity.specialization?.replace("-", " ").toUpperCase()}` },
          { icon: <Award />, value: `Experience: Since ${entity.experience}` }
        ]
      },
      statsSection: {
        title: "Professional Stats",
        items: [
          { value: entity.rating || "N/A", label: "Rating", className: "stat-gpa" },
          { value: entity.employmentType || "N/A", label: "Employment", className: "stat-year" },
          { value: entity.activeCourses || "0", label: "Active Courses", className: "stat-major" }
        ]
      }
    }
  };

  const config = configs[entityType] || configs.student;

  return (
    <div className="student-info-card">
      {/* Header with avatar, name, ID, and status */}
      <div className="student-card-header">
        <div className="student-infoheader-content">
          <img
            src={entity.photo || entity.avatar}
            alt={entity.name}
            className="student-avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entity.name)}&background=667eea&color=fff`;
            }}
          />
          <div className="student-basic-info">
            <h2 className="student-name">{entity.name}</h2>
            <p className="student-id">ID: {entity.id}</p>
            <span className={`status-badge ${entity.status?.toLowerCase()}`}>
              {config.statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Body with contact details on left and quick stats on right */}
      <div className="student-card-body">
        {/* Left side - Contact/Professional Details */}
        <div className="student-details-section">
          <h3>{config.contactSection.title}</h3>
          {config.contactSection.items.map((item, index) => (
            <div key={index} className="detail-item">
              {item.icon}
              <span className={item.className || ""}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Right side - Quick Stats */}
        <div className="quick-stats-section">
          <h3>{config.statsSection.title}</h3>
          <div className="stats-grid">
            {config.statsSection.items.map((stat, index) => (
              <div key={index} className={`stat-item ${stat.className}`}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoCard;