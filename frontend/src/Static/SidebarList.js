// src/Static/SidebarList.js
import {
  Home,
  BookOpen,
  GraduationCap,
  UserCog,
  Calendar,
  Mail,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Layers,
  Zap,
  Sparkles,
  Video,
  Edit3,
  ClipboardCheck,
} from "lucide-react";
import maleFace1 from "../Assets/Images/Logo/PNG/maleFace1.png";
import maleFace2 from "../Assets/Images/Logo/PNG/maleFace2.png";
import femaleFace1 from "../Assets/Images/Logo/PNG/femaleFace1.png";
import femaleFace2 from "../Assets/Images/Logo/PNG/femaleFace2.png";

// menu item of the 3 users in dashboard
export const leftMenuItems = {
  // Admin left sidebar menu
  1100: [
    { title: "Home", icon: <Home /> },
    { title: "Courses", icon: <BookOpen /> },
    { title: "Lecturers", icon: <UserCog /> }, // 👨‍🏫 Updated to UserCog for lecturers
    { title: "Students", icon: <GraduationCap /> }, // 🎓 Updated to GraduationCap for students
    { title: "Calendar", icon: <Calendar /> },
    { title: "Messages", icon: <Mail /> },
    { title: "Community", icon: <Users /> },
    { title: "Generate Semester", icon: <Sparkles /> },
    { title: "Statistics", icon: <BarChart2 /> },
    { title: "Settings", icon: <Settings /> },
    { title: "Logout", icon: <LogOut /> },
  ],

  // Lecturer Student left sidebar menu
  1200: [
    { title: "Home", icon: <Home /> },
    { title: "Courses", icon: <BookOpen /> },
    { title: "Calendar", icon: <Calendar /> },
    { title: "Messages", icon: <Mail /> },
    { title: "Community", icon: <Users /> },
    { title: "Video Meeting", icon: <Video /> },
    { title: "Text Editor", icon: <Edit3 /> },
    { title: "Assignments And Tests", icon: <ClipboardCheck /> },
    { title: "Settings", icon: <Settings /> },
    { title: "Logout", icon: <LogOut /> },
  ],

  // Student left sidebar menu
  1300: [
    { title: "Home", icon: <Home /> },
    { title: "Courses", icon: <BookOpen /> },
    { title: "Calendar", icon: <Calendar /> },
    { title: "Messages", icon: <Mail /> },
    { title: "Community", icon: <Users /> },
    { title: "Video Meeting", icon: <Video /> },
    { title: "Assignments And Tests Grades", icon: <ClipboardCheck /> },
    { title: "Settings", icon: <Settings /> },
    { title: "Logout", icon: <LogOut /> },
  ],
};

const imgStyle = { width: 30, height: 30, borderRadius: 10 };
const createMenuItem = (title, imgSrc) => ({
  title,
  icon: <img src={imgSrc} alt={title} style={imgStyle} />,
});
export const rightMenuItems = [
  createMenuItem("Muhammed1", maleFace1),
  createMenuItem("Muhammed2", maleFace2),
  createMenuItem("Muhammed3", femaleFace1),
  createMenuItem("Muhammed4", femaleFace2),
  createMenuItem("Muhammed1", maleFace1),
  createMenuItem("Muhammed2", maleFace2),
  createMenuItem("Muhammed3", femaleFace1),
  createMenuItem("Muhammed4", femaleFace2),
];
