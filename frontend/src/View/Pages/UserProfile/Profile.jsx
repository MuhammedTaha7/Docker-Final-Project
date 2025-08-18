import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, BookOpen, GraduationCap, Users, Settings, Edit3, Save, X } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  // Demo user data - in real app, this would come from props or context
  const [userRole, setUserRole] = useState('student'); // admin, lecturer, student
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    admin: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      phone: '+1 (555) 123-4567',
      position: 'System Administrator',
      department: 'Information Technology',
      joinDate: '2018-03-15',
      location: 'Admin Building, Room 201',
      bio: 'Experienced system administrator with over 10 years in educational technology management.',
      stats: {
        totalUsers: 1245,
        activeInstructors: 89,
        activeStudents: 1156,
        totalCourses: 156
      }
    },
    lecturer: {
      name: 'Prof. Michael Chen',
      email: 'michael.chen@university.edu',
      phone: '+1 (555) 987-6543',
      position: 'Associate Professor',
      department: 'Computer Science',
      joinDate: '2019-08-20',
      location: 'Science Building, Room 304',
      bio: 'Passionate educator specializing in web development and software engineering with 8 years of teaching experience.',
      stats: {
        coursesTeaching: 4,
        totalStudents: 120,
        researchPapers: 23,
        yearsExperience: 8
      }
    },
    student: {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@student.university.edu',
      phone: '+1 (555) 456-7890',
      studentId: 'STU2024001',
      major: 'Computer Science',
      year: 'Junior',
      gpa: '3.85',
      enrollmentDate: '2022-09-01',
      location: 'Dormitory Hall A, Room 215',
      bio: 'Dedicated computer science student with interests in artificial intelligence and web development.',
      stats: {
        enrolledCourses: 5,
        completedCredits: 90,
        remainingCredits: 30,
        currentSemesterGPA: '3.9'
      }
    }
  });

  const [editData, setEditData] = useState({});

  const handleEdit = () => {
    setEditData({ ...profileData[userRole] });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(prev => ({
      ...prev,
      [userRole]: { ...editData }
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({});
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const currentData = isEditing ? editData : profileData[userRole];

  const getRoleIcon = () => {
    switch (userRole) {
      case 'admin': return <Settings className="role-icon" />;
      case 'lecturer': return <GraduationCap className="role-icon" />;
      case 'student': return <BookOpen className="role-icon" />;
      default: return <User className="role-icon" />;
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'admin': return 'admin';
      case 'lecturer': return 'lecturer';
      case 'student': return 'student';
      default: return 'student';
    }
  };

  const renderStats = () => {
    const stats = currentData.stats;
    
    if (userRole === 'admin') {
      return (
        <div className="stats-grid">
          <div className="stat-card">
            <Users className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.totalUsers}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
          <div className="stat-card">
            <GraduationCap className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.activeInstructors}</span>
              <span className="stat-label">Active Instructors</span>
            </div>
          </div>
          <div className="stat-card">
            <BookOpen className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.activeStudents}</span>
              <span className="stat-label">Active Students</span>
            </div>
          </div>
          <div className="stat-card">
            <Calendar className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.totalCourses}</span>
              <span className="stat-label">Total Courses</span>
            </div>
          </div>
        </div>
      );
    } else if (userRole === 'lecturer') {
      return (
        <div className="stats-grid">
          <div className="stat-card">
            <BookOpen className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.coursesTeaching}</span>
              <span className="stat-label">Courses Teaching</span>
            </div>
          </div>
          <div className="stat-card">
            <Users className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.totalStudents}</span>
              <span className="stat-label">Total Students</span>
            </div>
          </div>
          <div className="stat-card">
            <GraduationCap className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.researchPapers}</span>
              <span className="stat-label">Research Papers</span>
            </div>
          </div>
          <div className="stat-card">
            <Calendar className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.yearsExperience}</span>
              <span className="stat-label">Years Experience</span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="stats-grid">
          <div className="stat-card">
            <BookOpen className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.enrolledCourses}</span>
              <span className="stat-label">Enrolled Courses</span>
            </div>
          </div>
          <div className="stat-card">
            <GraduationCap className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.completedCredits}</span>
              <span className="stat-label">Completed Credits</span>
            </div>
          </div>
          <div className="stat-card">
            <Calendar className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.remainingCredits}</span>
              <span className="stat-label">Remaining Credits</span>
            </div>
          </div>
          <div className="stat-card">
            <User className="stat-icon" />
            <div className="stat-content">
              <span className="stat-number">{stats.currentSemesterGPA}</span>
              <span className="stat-label">Current GPA</span>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="profile-container">
      {/* Role Selector for Demo */}
      <div className="role-selector">
        <label>Demo Role:</label>
        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="profile-content">
        {/* Header Section */}
        <div className={`profile-header ${getRoleColor()}`}>
          <div className="profile-avatar">
            <User size={80} />
          </div>
          <div className="profile-header-info">
            <div className="profile-name-section">
              {isEditing ? (
                <input
                  type="text"
                  value={currentData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="edit-input name-input"
                />
              ) : (
                <h1 className="profile-name">{currentData.name}</h1>
              )}
              <div className="role-badge">
                {getRoleIcon()}
                <span className="role-text">
                  {userRole === 'admin' ? 'Administrator' : 
                   userRole === 'lecturer' ? 'Lecturer' : 'Student'}
                </span>
              </div>
            </div>
            <div className="profile-actions">
              {!isEditing ? (
                <button onClick={handleEdit} className="edit-btn">
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="editing-actions">
                  <button onClick={handleSave} className="save-btn">
                    <Save size={16} />
                    Save
                  </button>
                  <button onClick={handleCancel} className="cancel-btn">
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Personal Information */}
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <Mail className="info-icon" />
                <div className="info-content">
                  <label>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={currentData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <span>{currentData.email}</span>
                  )}
                </div>
              </div>

              <div className="info-item">
                <Phone className="info-icon" />
                <div className="info-content">
                  <label>Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={currentData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <span>{currentData.phone}</span>
                  )}
                </div>
              </div>

              <div className="info-item">
                <MapPin className="info-icon" />
                <div className="info-content">
                  <label>Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <span>{currentData.location}</span>
                  )}
                </div>
              </div>

              {userRole === 'student' && (
                <div className="info-item">
                  <User className="info-icon" />
                  <div className="info-content">
                    <label>Student ID</label>
                    <span>{currentData.studentId}</span>
                  </div>
                </div>
              )}

              <div className="info-item">
                <Calendar className="info-icon" />
                <div className="info-content">
                  <label>
                    {userRole === 'student' ? 'Enrollment Date' : 'Join Date'}
                  </label>
                  <span>
                    {userRole === 'student' ? currentData.enrollmentDate : currentData.joinDate}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <GraduationCap className="info-icon" />
                <div className="info-content">
                  <label>
                    {userRole === 'admin' ? 'Department' : 
                     userRole === 'lecturer' ? 'Department' : 'Major'}
                  </label>
                  <span>
                    {userRole === 'admin' ? currentData.department :
                     userRole === 'lecturer' ? currentData.department : currentData.major}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="profile-section">
            <h2>Bio</h2>
            <div className="bio-content">
              {isEditing ? (
                <textarea
                  value={currentData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="edit-textarea"
                  rows="4"
                />
              ) : (
                <p>{currentData.bio}</p>
              )}
            </div>
          </div>

          {/* Statistics Section */}
          <div className="profile-section">
            <h2>
              {userRole === 'admin' ? 'System Overview' :
               userRole === 'lecturer' ? 'Teaching Statistics' : 'Academic Progress'}
            </h2>
            {renderStats()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;