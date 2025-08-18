
export default function CourseDetailRow({ title, icon }) {
  return (
    <div className="course-detail-row" style={{ display: "flex", alignItems: "center",flexDirection: "row" ,gap: "10px"}}>
      <div className="course-detail-icon">
        {icon}
      </div>
      <div className="course-detail-text">
        <span className="course-detail-title">{title}</span>
        
      </div>
    </div>
  );
}