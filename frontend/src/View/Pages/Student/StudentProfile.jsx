import React, { useState } from 'react';
import StudentHeader from '../../Components/StudentProfile/StudentHeader';
import StudentInfoCard from '../../Components/StudentProfile/StudentInfoCard';
import MidPageNavbar from '../../Components/CoursePage/Content/MidPageNavBar';
import OverviewCards from '../../Components/StudentProfile/OverviewCards';
import RequestsList from '../../Components/StudentProfile/RequestsList';
import Table from '../../Components/Tables/Table';
import QuickActions from '../../Components/StudentProfile/QuickActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import "../../../CSS/Pages/Student/StudentsProfile.css";

const StudentProfile = () => {
  const [activeSection, setActiveSection] = useState('overview');// Default section
  const [selectedYear, setSelectedYear] = useState('');// Default year
  const [showActions, setShowActions] = useState(false);

  // Mock student data
  const student = {
    id: "STU001",
    name: "Emma Johnson",
    email: "emma.johnson@college.edu",
    phone: "+1 (555) 123-4567",
    address: "123 University Ave, College Town, CT 06511",
    dateOfBirth: "1999-03-15",
    enrollmentDate: "2021-09-01",
    major: "Computer Science",
    year: "Junior",
    gpa: 3.78,
    status: "Active",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  };

  const grades = [
    {
      Course: "Data Structures & Algorithms",
      Code: "CS301",
      Grade: "A-",
      Credits: 4,
      Semester: "Fall 2024",
    },
    {
      Course: "Database Systems",
      Code: "CS325",
      Grade: "B+",
      Credits: 3,
      Semester: "Fall 2024",
    },
    {
      Course: "Web Development",
      Code: "CS280",
      Grade: "A",
      Credits: 3,
      Semester: "Spring 2024",
    },
    {
      Course: "Calculus III",
      Code: "MATH251",
      Grade: "B",
      Credits: 4,
      Semester: "Spring 2024",
    },
    {
      Course: "Physics II",
      Code: "PHYS202",
      Grade: "B+",
      Credits: 4,
      Semester: "Fall 2023",
    },
  ];

  const requests = [
    {
      id: 1,
      type: "Course Drop",
      course: "CS301",
      date: "2024-11-15",
      status: "pending",
      priority: "medium",
    },
    {
      id: 2,
      type: "Grade Appeal",
      course: "MATH251",
      date: "2024-10-20",
      status: "approved",
      priority: "high",
    },
    {
      id: 3,
      type: "Transcript Request",
      course: "",
      date: "2024-09-18",
      status: "completed",
      priority: "low",
    },
    {
      id: 4,
      type: "Transcript Request",
      course: "",
      date: "2024-09-18",
      status: "completed",
      priority: "low",
    },
    {
      id: 5,
      type: "Transcript Request",
      course: "",
      date: "2024-09-18",
      status: "completed",
      priority: "low",
    },
    {
      id: 6,
      type: "Transcript Request",
      course: "",
      date: "2024-09-18",
      status: "completed",
      priority: "low",
    },
  ];

  const enrollments = [
    {
      Course: "Advanced Algorithms",
      Code: "CS401",
      Instructor: "Dr. Smith",
      Schedule: "MWF 10:00-11:00",
      Credits: 4,
    },
    {
      Course: "Machine Learning",
      Code: "CS450",
      Instructor: "Prof. Davis",
      Schedule: "TTh 2:00-3:30",
      Credits: 3,
    },
    {
      Course: "Software Engineering",
      Code: "CS350",
      Instructor: "Dr. Wilson",
      Schedule: "MWF 1:00-2:00",
      Credits: 3,
    },
    {
      Course: "Linear Algebra",
      Code: "MATH301",
      Instructor: "Prof. Brown",
      Schedule: "TTh 9:00-10:30",
      Credits: 4,
    },
  ];

  const handleActionsToggle = () => {
    setShowActions(!showActions);
  };

  // Action button handlers
  const handleEdit = (row) => {
    console.log("Edit", row);
  };

  const handleDelete = (row) => {
    if (window.confirm("Delete this record?")) {
      console.log("Delete", row);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewCards  />;
      case 'grades':
        return (
          <Table 
            data={grades} 
            showAddButton={true}
            actionButtons={[
              (row) => (
                <button onClick={() => handleEdit(row)} className="edit-btn">
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
              ),
              (row) => (
                <button onClick={() => handleDelete(row)} className="delete-btn">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              ),
            ]}
          />
        );
      case 'requests':
        return <RequestsList requests={requests} />;
      case 'enrollments':
        return (
          <Table 
            data={enrollments} 
            showAddButton={true}
            actionButtons={[
              (row) => (
  <button
    onClick={() => handleEdit(row)}
    className="action-button edit"
    title="עריכה"
  >
    <FontAwesomeIcon icon={faPenToSquare} />
  </button>
),
(row) => (
  <button
    onClick={() => handleDelete(row)}
    className="action-button delete"
    title="מחיקה"
  >
    <FontAwesomeIcon icon={faTrash} />
  </button>
)

            ]}
          />
        );
      default:
        return <OverviewCards />;
    }
  };

  return (
    <div className="student-profile-container">
      <StudentHeader onActionsToggle={handleActionsToggle} />
      
      <div className="main-container">
        <div className="content-wrapper">
          <StudentInfoCard student={student} />
          
          <div className="main-content">
            <div className="navbar-wrapper">
              <MidPageNavbar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                sections={['overview', 'grades', 'requests', 'enrollments']}
              />
            </div>
            
            <div className="tab-content">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>

      <QuickActions show={showActions} />
    </div>
  );
};

export default StudentProfile;