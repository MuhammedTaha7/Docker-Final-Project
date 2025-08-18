// StudentsDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../CSS/Pages/Student/StudentDashboard.module.scss";
import studentsData from "../../../Static/students";
import StudentTable from "../../Components/Tables/Table";
import { Users, BookOpen, GraduationCap, CalendarDays, ArrowRight } from "lucide-react";

export default function StudentsDashboard() {
  const [division, setDivision] = useState("All");
  const [academicYear, setAcademicYear] = useState("All");
  const [group, setGroup] = useState("All");
  const [graduationYear, setGraduationYear] = useState("All");
  const [filteredStudents, setFilteredStudents] = useState(studentsData);

  const navigate = useNavigate();
  const goToProfile = (student) => {
    //navigate(`/student/${student.id}`);
    navigate(`/studentProfile`);
  };

  // Filter options
  const divisions = ["All", ...Array.from(new Set(studentsData.map((s) => s.division))).sort()];
  const academicYears = ["All", ...Array.from(new Set(studentsData.map((s) => s.academicYear))).sort()];
  const groups = ["All", ...Array.from(new Set(studentsData.map((s) => s.learningGroup))).sort()];
  const graduationYears = ["All", ...Array.from(new Set(studentsData.map((s) => s.graduationYear))).sort()];

  useEffect(() => {
    let temp = studentsData;
    if (division !== "All") temp = temp.filter((s) => s.division === division);
    if (academicYear !== "All") temp = temp.filter((s) => s.academicYear === academicYear);
    if (group !== "All") temp = temp.filter((s) => s.learningGroup === group);
    if (graduationYear !== "All") temp = temp.filter((s) => s.graduationYear === graduationYear);
    setFilteredStudents(temp);
  }, [division, academicYear, group, graduationYear]);

  const total = filteredStudents.length;
  const active = filteredStudents.filter((s) => s.status === "Active").length;
  const graduated = filteredStudents.filter((s) => s.status === "Graduated").length;
  const upcoming = 10;

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        <aside className={styles.studentSidebar}>
          <h3>Divisions</h3>
          {divisions.map((d) => (
            <button
              key={d}
              className={`${styles.sidebarButton} ${division === d ? styles.activeTab : ""}`}
              onClick={() => setDivision(d)}
            >
              {d}
            </button>
          ))}

          <div className={styles.filters}>
            <label className={styles.filterLabel}>Academic Year</label>
            <select 
              className={styles.filterSelect}
              value={academicYear} 
              onChange={(e) => setAcademicYear(e.target.value)}
            >
              {academicYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <label className={styles.filterLabel}>Learning Group</label>
            <select 
              className={styles.filterSelect}
              value={group} 
              onChange={(e) => setGroup(e.target.value)}
            >
              {groups.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <label className={styles.filterLabel}>Graduation Year</label>
            <div className={styles.gradButtons}>
              {graduationYears.map((y) => (
                <button
                  key={y}
                  className={`${styles.gradBtn} ${graduationYear === y ? styles.selected : ""}`}
                  onClick={() => setGraduationYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <header className={styles.dashboardHeader}>
            <h1>Student Management System</h1>
            <p>Manage students across divisions, academic years, and learning groups</p>
          </header>

          <div className={styles.studentCardsHorizontal}>
            <div className={`${styles.studentCard} ${styles.blue}`}>
              <div className={styles.studentCardInfo}>
                <p>Total Students</p>
                <h2>{total}</h2>
              </div>
              <div className={styles.studentCardIcon}>
                <Users />
              </div>
            </div>
            <div className={`${styles.studentCard} ${styles.green}`}>
              <div className={styles.studentCardInfo}>
                <p>Active Students</p>
                <h2>{active}</h2>
              </div>
              <div className={styles.studentCardIcon}>
                <BookOpen />
              </div>
            </div>
            <div className={`${styles.studentCard} ${styles.yellow}`}>
              <div className={styles.studentCardInfo}>
                <p>Graduated</p>
                <h2>{graduated}</h2>
              </div>
              <div className={styles.studentCardIcon}>
                <GraduationCap />
              </div>
            </div>
            <div className={`${styles.studentCard} ${styles.indigo}`}>
              <div className={styles.studentCardInfo}>
                <p>Upcoming Events</p>
                <h2>{upcoming}</h2>
              </div>
              <div className={styles.studentCardIcon}>
                <CalendarDays />
              </div>
            </div>
          </div>

          <div className={styles.tableSection}>
            <div className={styles.tableContainer}>
              <StudentTable
                data={filteredStudents}
                showAddButton={true}
                actionButtons={[
                  (student) => (
                    <button
                      onClick={() => goToProfile(student)}
                      className={styles.profileButton}
                      title="View Profile"
                    >
                      <ArrowRight size={16} />
                    </button>
                  )
                ]}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}