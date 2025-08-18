import Sidebar from "../Components/Dashboard/Sidebar/Sidebar.jsx";
import Topbar from "../Components/Dashboard/Topbar/Topbar.jsx";
import { leftMenuItems, rightMenuItems } from "../../Static/SidebarList.js";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import "../../CSS/Components/Global/MainLayout.css";
import Loader from "../Pages/Global/Loading.jsx";
import ChatUI from "../Components/Forms/ChatBot.jsx";


export default function MainLayout() {
  const { authData, loading } = useContext(AuthContext);
  if (loading) return <Loader />


  return (
    <div className="body" > 
      <div className="main-layout">
        <div className="left-sidebar">
          <Sidebar menuItems={leftMenuItems[authData.role]} position="left" />
        </div>

        <div className="main" >
          <Topbar />
          <Outlet />
          <ChatUI/>
        </div>
      </div>
    </div>
  );
}