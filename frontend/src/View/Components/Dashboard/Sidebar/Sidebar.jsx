import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../Context/AuthContext.jsx";
import SidebarItem from "./SidebarItem";
import ChatInterface from "../../Common/ChatInterface.jsx";
import "../../../../CSS/Components/Global/Sidebar.css";
import Logo from "../../../../Assets/Images/Logo/PNG/LogoSquare@0.5x.png";
import { AlignJustify } from "react-feather";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ menuItems, position = "left" }) => {
  const [selected, setSelected] = useState("Home");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  // const [selectedItem, setselectedItem] = useState(null);

  const { authData } = useContext(AuthContext);
  const currentUserId = authData?.id;
  const handleItemClick = (title) => {
    const contact = menuItems.find((item) => item.title === title);
    if (position === "right") {
      setSelected(selected?.title === title ? null : contact);
    }

    if (position === "left") {
      setSelected(title);
      switch (title) {
        case "Home":
          navigate("/dashboard");
          break;
        case "Lecturers":
          navigate("/Lecturers");
          break;
        case "Students":
          navigate("/Students");
          break;

        case "Courses":
          navigate("/courses");
          break;

        case "Calendar":
          navigate("/calendar");
          break;

        case "Video Meeting":
          navigate("/VideoMeetingDashboard");
          break;

        case "Messages":
          navigate("/messages");
          break;
        case "Text Editor":
          navigate("/TextEditor");
          break;
        case "Assignments And Tests":
          navigate("/AssignmentDashboard");
          break;
          
          case "Assignments And Tests Grades":
          navigate("/StudentAssignmentDashboard");
          break;

        case "Community":
          navigate("/community/home");
          break;
        case "Generate Semester":
          navigate("/generateSemester");
          break;
        case "Statistics":
          navigate("/statistics");
          break;

        case "Settings":
          navigate("/settings");
          break;
        case "Logout":
          navigate("/");
          break;
        default:
          break;
      }
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`sidebar sidebar-${position} ${
        isCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <div className="sidebar-content">
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          <AlignJustify />
        </div>
        <div className="sidebar-header">
          <img className="sidebar-profile-image" src={Logo} alt="Profile" />
        </div>
        <nav className="sidebar-menu">
          {menuItems.map((item, index) => (
            <SidebarItem
              key={index}
              {...item}
              selected={selected}
              onClick={() => handleItemClick(item.title)}
              isCollapsed={isCollapsed}
              isActive={selected?.title === item.title}
            />
          ))}
        </nav>
      </div>
      {selected && position === "right" && selected !== "Home" && (
        <ChatInterface
          contact={selected}
          currentUserId={currentUserId}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};
export default Sidebar;
