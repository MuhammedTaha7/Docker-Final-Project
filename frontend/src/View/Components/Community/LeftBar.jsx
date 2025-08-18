import "../../../CSS/Components/Community/leftBar.scss";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";

import Friends from "../../../Assets/1.png";
import Groups from "../../../Assets/2.png";
import JobBoard from "../../../Assets/Icons/Job.png";
import Resume from "../../../Assets/Icons/CV.png";
import Saved from "../../../Assets/Icons/Bookmark.png";

const leftBarMenuItems = [
  { id: 1, icon: Friends, label: "Friends" },
  { id: 2, icon: Groups, label: "Groups" },
  { id: 3, icon: JobBoard, label: "Job Board" },
  { id: 4, icon: Resume, label: "My CV" },
  { id: 5, icon: Saved, label: "Saved Posts" },
];
const LeftBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  const handleNameClick = () => {
    if (authData?.id) {
      navigate(`/community/profile/${authData.id}`);
    }
  };

  return (
    <div className="leftBar">
      <div className="leftBarMenus">
        <div className="menu">
          <div
            onClick={handleNameClick}
            style={{ cursor: "pointer" }}
            className="user"
          >
            <img src={authData?.profilePic || "https://via.placeholder.com/40"} alt={authData?.name || "User"} />
            <span>{authData?.name || "User"}</span>
          </div>

          {leftBarMenuItems.map((item) => {
            const path = item.label.toLowerCase().replace(/\s+/g, "-");
            const fullPath = `/community/${path}`;
            const isActive = location.pathname === fullPath;

            return (
              <Link
                to={fullPath}
                key={item.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className={`item ${isActive ? "active" : ""}`}>
                  <img src={item.icon} alt={item.label} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
        <hr />
        <hr />
      </div>
    </div>
  );
};

export default LeftBar;