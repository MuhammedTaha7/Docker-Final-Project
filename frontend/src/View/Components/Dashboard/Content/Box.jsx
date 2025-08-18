import "../../../../CSS/Components/Global/Box.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const Box = ({
  title,
  subtitle,
  contentBox,
  image,
  chart,
  boxLink,
  assignments,
  card,
  bgImage,
  bgColor = "#fff",
  gridColumn = "span 4",
  gridRow,
}) => {
  const navigate = useNavigate();

  // Handle box link navigation
  const handleBoxLinkClick = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    
    // Map boxLink text to routes
    switch (boxLink) {
      // Admin box links
      case "Manage all users":
        navigate("/admin/users");
        break;
      case "View detailed analytics":
        navigate("/admin/analytics");
        break;
      case "Manage departments":
        navigate("/admin/departments");
        break;
      
      // Lecturer box links
      case "View all classes":
        navigate("/lecturer/classes");
        break;
      case "Grade assignments":
        navigate("/lecturer/grading");
        break;
      case "View messages":
        navigate("/lecturer/messages");
        break;
      
      // Student box links
      case "View all courses":
        navigate("/student/courses");
        break;
      case "View all grades":
        navigate("/student/grades");
        break;
      case "View all notifications":
        navigate("/student/notifications");
        break;
      
      default:
        console.log("No route defined for:", boxLink);
        // Optional: Navigate to a default route or show an error
        // navigate("/dashboard");
        break;
    }
  };

  return (
    <div
      className="box-component"
      style={{
        gridColumn: gridColumn,
        gridRow: gridRow,
        backgroundColor: bgColor,
      }}
    >
      <div className="box-info">
        <div className="box-title">{title}</div>
        {subtitle && <div className="box-subtitle">{subtitle}</div>}
        <div className="box-content">
          {contentBox}
          {assignments && <div className="box-assignments">{assignments}</div>}
          {card && <div className="box-card">{card}</div>}
          {chart && <div className="box-chart">{chart}</div>}
          {bgImage && <div className="box-bg-image">{bgImage}</div>}
        </div>

        {boxLink && (
          <a 
            href="#" 
            className="box-link"
            onClick={handleBoxLinkClick}
            style={{ cursor: "pointer" }}
          >
            {boxLink}
          </a>
        )}

        {image && <img src={image} alt="Illustration" className="box-image" />}
      </div>
    </div>
  );
};

export default Box;