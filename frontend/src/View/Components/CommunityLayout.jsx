import { Outlet } from "react-router-dom"
import LeftBar from "../Components/Community/LeftBar.jsx";
import RightBar from "../Components/Community/RightBar.jsx";
import Navbar from "../Components/Community/Navbar.jsx";

export default function CommunityLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar on the left */}
        <div>
          <LeftBar />
        </div>

        {/* Main Content in the center */}
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
          <Outlet />
        </div>

        {/* Sidebar on the right */}
        <div>
          <RightBar />
        </div>
      </div>
    </div>
  );
}
