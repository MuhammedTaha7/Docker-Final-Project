// src/Components/CoursePage/CourseDetails.jsx
import React from "react";
import "../../../CSS/Pages/CoursePage/CourseDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faClock, faStar, faChalkboardUser, faBuilding, faLanguage, faTasks, faFlask, faPencilAlt, faLink } from "@fortawesome/free-solid-svg-icons";
import CourseDetailRow from "./Content/courseDetailRow";
import ProgressBar from "../Charts/Bar";

const CourseDetails = ({ courseData, totalStudents }) => {
  if (!courseData) {
    return <div>Course details are not available.</div>;
  }

  // --- FIX: Use dynamic data from props with fallbacks for safety ---
  const courseTitle = courseData.name || "Untitled Course";
  const courseCode = courseData.code || "N/A";
  const department = courseData.department || "Unknown Department";
  const credits = courseData.credits || 0;
  // Use the lecturer name we prepared in the hook, not the ID
  const instructorName = courseData.lecturerName || "Not Assigned"; 
  const rating = courseData.rating || "N/A";
  const courseProgress = courseData.progress || 0; // Assuming progress is a number 0-100
  const language = courseData.language || "English";
  // Assuming 'assignments' is an array in your data. We display its length.
  const assignmentCount = courseData.assignments?.length || 0;
  const examInfo = courseData.finalExam || "TBD";
  const prerequisites = courseData.prerequisites || "None";

  return (
    <div className="course-details-container">
      <div className="course-description">
        <div className="course-header-section">
          <div className="course-main-info">
            <h3 className="course-title">{courseTitle}</h3>
            <div className="course-meta">
              <span className="course-code">{courseCode}</span>
              <div className="course-rating">
                <FontAwesomeIcon icon={faStar} className="star-icon" />
                {/* FIX: Using dynamic rating */}
                <span>{rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="course-description-text">
          <p>{courseData.description || `This course covers concepts in ${courseTitle.toLowerCase()}.`}</p>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">Course Progress</span>
          </div>
          <div className="progress-bar">
             {/* FIX: Using dynamic progress */}
            <ProgressBar progress={courseProgress} />
          </div>
        </div>
      </div>

      <div className="course-data">
        <div className="course-details-grid">
          <div className="details-column">
            <CourseDetailRow icon={<FontAwesomeIcon icon={faUserGroup} />} title={`${totalStudents} Total Students`} />
            <CourseDetailRow icon={<FontAwesomeIcon icon={faClock} />} title={"TBD"} />
            <CourseDetailRow icon={<FontAwesomeIcon icon={faStar} />} title={`${credits} Credits`} />
            <CourseDetailRow icon={<FontAwesomeIcon icon={faChalkboardUser} />} title={`Instructor: ${instructorName}`} />
            <CourseDetailRow icon={<FontAwesomeIcon icon={faBuilding} />} title={department} />
          </div>
          <div className="details-column">
            <CourseDetailRow icon={<FontAwesomeIcon icon={faLanguage} />} title={`Language: ${language}`} />
            <CourseDetailRow icon={<FontAwesomeIcon icon={faTasks} />} title={`Assignments: ${assignmentCount} total`} />
            <CourseDetailRow icon={<FontAwesomeIcon icon={faFlask} />} title={`Type: ${courseData.selectable ? 'Elective' : 'Mandatory'}`} />
            <CourseDetailRow icon={<FontAwesomeIcon icon={faPencilAlt} />} title={`Final Exam: ${examInfo}`} />
            <CourseDetailRow icon={<FontAwesomeIcon icon={faLink} />} title={`Prerequisite: ${prerequisites}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;