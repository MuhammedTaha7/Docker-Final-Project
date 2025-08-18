import coursesImg from "../Assets/Images/Logo/PNG/courses.png";
import gradeImg from "../Assets/Images/Logo/PNG/grade.png";
import notificationImg from "../Assets/Images/Logo/PNG/notification.png";
import logoImg from "../Assets/Images/Logo/PNG/LogoMonogram.png";
import statImg from "../Assets/Images/Logo/PNG/statistic.png";
import { sampleData , lineChartData , educationdata} from "../Static/FIxed/dashboardContentData";
import { upcomingAssignments } from "../Static/FIxed/calendarPageData";


const dashboardContentData = {
  // Admin Dashboard - System oversight and management
  1100: [
    {
      type: "box",
      props: {
        title: "User Management",
        // subtitle is now dynamic
        boxLink: "Manage all users",
        image: logoImg,
        bgColor: "#e6f3ff",
        gridRow: "span 8",
      },
    },
    {
      type: "box",
      props: {
        title: "System Analytics",
        // subtitle is now dynamic
        boxLink: "View detailed analytics",
        image: statImg,
        bgColor: "#fff2e6",
        gridRow: "span 8",
      },
    },
    {
      type: "box",
      props: {
        title: "Institution Overview",
        // subtitle is now dynamic
        boxLink: "Manage departments",
        image: coursesImg,
        bgColor: "#f0f8f0",
        gridRow: "span 8",
      },
    },
    {
      type: "chart",
      props: {
        title: "Department Enrollment Statistics",
        chartType: "bar",
        // chartData is now dynamic
        gridColumn: "span 8",
        gridRow: "span 1",
      },
    },
    {
      type: "assignments",
      props: {
        // assignments data is now dynamic
        gridRow: "span 1",
      },
    },
    {
      type: "chart",
      props: {
        title: "System Usage Distribution",
        chartType: "pie",
        // chartData is now dynamic
        gridRow: "span 1",
      },
    },
    {
      type: "chart",
      props: {
        title: "Annual Enrollment Trends",
        chartType: "line",
        // chartData is now dynamic
        gridColumn: "span 8",
        gridRow: "span 1",
      },
    },
  ],
  
  // Lecturer Dashboard - Teaching focused
  1200: [
    {
      type: "box",
      props: {
        title: "My Classes",
        subtitle: "4 Active Classes",
        boxLink: "View all classes",
        image: coursesImg,
        bgColor: "#f0f8f0",
        gridRow: "span 8",
      },
    },
    {
      type: "box",
      props: {
        title: "Pending Grades",
        subtitle: "23 Assignments to Grade",
        boxLink: "Grade assignments",
        image: gradeImg,
        bgColor: "#fffccc",
        gridRow: "span 8",
      },
    },
    {
      type: "box",
      props: {
        title: "Student Communications",
        subtitle: "5 New Messages",
        boxLink: "View messages",
        image: notificationImg,
        bgColor: "#ffcccc",
        gridRow: "span 8",
      },
    },
    {
      type: "chart",
      props: {
        title: "Class Performance Overview",
        chartType: "bar",
        chartData: sampleData,
        gridColumn: "span 8",
        gridRow: "span 1",
      },
    },
    {
      type: "assignments",
      props: {
        data: upcomingAssignments,
        gridRow: "span 1",
      },
    },
    {
      type: "chart",
      props: {
        title: "Student Grade Distribution",
        chartType: "pie",
        chartData: educationdata,
        gridRow: "span 1",
      },
    },
    {
      type: "chart",
      props: {
        title: "Class Progress Trends",
        chartType: "line",
        chartData: lineChartData,
        gridColumn: "span 8",
        gridRow: "span 1",
      },
    },
  ],
  
  // Student Dashboard - Learning focused
  1300: [
    {
      type: "box",
      props: {
        title: "My Enrolled Courses",
        subtitle: "5 Active Courses",
        boxLink: "View all courses",
        image: coursesImg,
        bgColor: "#cffccc",
        gridRow: "span 8",
      },
    },
    {
      type: "box",
      props: {
        title: "My Grades",
        subtitle: "Latest: A- in Math",
        boxLink: "View all grades",
        image: gradeImg,
        bgColor: "#fffccc",
        gridRow: "span 8",
      },
    },
    {
      type: "box",
      props: {
        title: "Notifications",
        subtitle: "3 New Announcements",
        boxLink: "View all notifications",
        image: notificationImg,
        bgColor: "#ffcccc",
        gridRow: "span 8",
      },
    },
    {
      type: "chart",
      props: {
        title: "My Academic Progress",
        chartType: "line",
        chartData: lineChartData,
        gridColumn: "span 8",
        gridRow: "span 1",
      },
    },
    {
      type: "assignments",
      props: {
        data: upcomingAssignments,
        gridRow: "span 1",
      },
    },
    {
      type: "chart",
      props: {
        title: "Course Distribution",
        chartType: "pie",
        chartData: educationdata,
        gridRow: "span 1",
      },
    },
    {
      type: "chart",
      props: {
        title: "Study Performance Analysis",
        chartType: "bar",
        chartData: sampleData,
        gridColumn: "span 8",
        gridRow: "span 1",
      },
    },
  ],
};
export default dashboardContentData;