// importing Main Layout and its pages
import { Routes, Route } from "react-router-dom";
import Login from "../View/Pages/Auth/login.jsx";
import MainLayout from "../View/Components/MainLayout.jsx";
import Dashboard from "../View/Pages/Global/Dashboard.jsx";
import Courses from "../View/Pages/Courses/Courses.jsx";
import CoursePage from "../View/Pages/Courses/CoursePage.jsx";
import CalendarDashboard from "../View/Pages/Global/CalendarDashboard.jsx";
import Messages from "../View/Pages/Global/messages.jsx";
import Statistics from "../View/Pages/Admin/AdminReportPage.jsx";
import Portfolio from "../View/Pages/UserProfile/Portfolio.jsx";
import GenericDashboard from "../View/Pages/GenericDashboard.jsx";
import GenericProfile from "../View/Pages/GenericProfile.jsx";
import { Navigate } from "react-router-dom";
import GenerateSemester from "../View/Pages/Admin/GenerateSemester.jsx";
import AssignmentDashboard from "../View/Pages/Lecturer/AssignmentsDashboard.jsx";

import StudentDashboard from "../View/Pages/Student/StudentDashboard.jsx";

import VideoMeetingDashboard from "../View/Components/VideoMeeting/MeetingDashboard.jsx";
// ADD THIS IMPORT - This is likely missing
import VideoMeeting from "../View/Components/VideoMeeting/VideoMeeting.jsx";

// Importing Community Layout and its pages
import CommunityLayout from "../View/Components/CommunityLayout.jsx";
import Home from "../View/Pages/Community/Home.jsx";
import Profile from "../View/Pages/Community/Profile.jsx";
import Friends from "../View/Pages/Community/Friends.jsx";
import Groups from "../View/Pages/Community/Groups.jsx";
import GroupPage from "../View/Pages/Community/GroupPage.jsx";
import JobBoard from "../View/Pages/Community/JobBoard.jsx";
import MyCV from "../View/Pages/Community/MyCV.jsx";
import SavedPosts from "../View/Pages/Community/SavedPosts.jsx";
import NotFoundPage from "../View/Pages/Errors/404.jsx";
import ProfileA from "../View/Pages/UserProfile/Profile.jsx";

import { SavedPostsProvider } from "../Context/SavedPostsContext.jsx";
import { FollowProvider } from "../Context/FollowContext.jsx";
import { FriendProvider } from "../Context/FriendContext.jsx";

import ProtectedRoute from "./ProtectedRoute";
import DocumentEditorPage from "../View/Pages/Lecturer/DocumentEditorPage.jsx";

function GlobalRoutes() {
  return (
    <Routes>
      {/* Public route (Login) */}
      <Route path="/" element={<Login />} />
      <Route path="/pageNotFound" element={<NotFoundPage />} />

      {/* STANDALONE VIDEO MEETING ROUTE - CRITICAL */}
      {/* This route should NOT be inside MainLayout to avoid layout conflicts */}
      <Route 
        path="/meeting" 
        element={
          // <ProtectedRoute>  // Uncomment if you need authentication
            <VideoMeeting />
          // </ProtectedRoute>
        } 
      />

      {/* Protected routes under MainLayout */}
      <Route
        element={
          // <ProtectedRoute>
          <MainLayout />
          // </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route
          path="/Students"
          element={<GenericDashboard entityType="students" />}
        />
        <Route
          path="/Lecturers"
          element={<GenericDashboard entityType="lecturers" />}
        />
        <Route path="/calendar" element={<CalendarDashboard />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/portfolio" element={<Portfolio />} />
        
        {/* Video Meeting Dashboard - inside main layout */}
        <Route path="/VideoMeetingDashboard" element={<VideoMeetingDashboard />} />
        <Route path="/AssignmentDashboard" element={<AssignmentDashboard />} />
        <Route path="/TextEditor" element={<DocumentEditorPage />} />
        
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/profileA" element={<ProfileA />} />
        <Route path="/Messages" element={<Messages />} />
        <Route path="/generateSemester" element={<GenerateSemester />} />
        
        <Route path="/StudentAssignmentDashboard" element={<StudentDashboard />} />
        
        {/* Secure Profile Routes with Path Parameters */}
        <Route path="/profile/:entityType/:id" element={<GenericProfile />} />
        
        {/* Redirect old query parameter URLs to new format */}
        <Route
          path="/profile/:id"
          element={<Navigate to="/students" replace />}
        />
      </Route>

      {/* Protected routes under CommunityLayout */}
      <Route
        element={
          // <ProtectedRoute>
          <SavedPostsProvider>
            <FollowProvider>
              <FriendProvider>
                <CommunityLayout />
              </FriendProvider>
            </FollowProvider>
          </SavedPostsProvider>
          // </ProtectedRoute>
        }
      >
        <Route path="/community/home" element={<Home />} />
        <Route path="/community/profile/:userId" element={<Profile />} />
        <Route path="/community/friends" element={<Friends />} />
        <Route path="/community/groups" element={<Groups />} />
        <Route path="/community/groups/:groupId" element={<GroupPage />} />
        <Route path="/community/job-board" element={<JobBoard />} />
        <Route path="/community/my-cv" element={<MyCV />} />
        <Route path="/community/saved-posts" element={<SavedPosts />} />
      </Route>

      {/* Catch-all route for 404 */}
      <Route path="*" element={<Navigate to="/pageNotFound" replace />} />
    </Routes>
  );
}

export default GlobalRoutes;