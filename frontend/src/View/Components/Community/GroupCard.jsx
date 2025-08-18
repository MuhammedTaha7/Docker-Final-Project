// src/Components/Community/GroupCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../CSS/Components/Community/groupCard.scss";

import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const GroupCard = ({ 
  group, 
  onJoin, 
  onLeave, 
  onInviteFriends, 
  onViewGroup,
  currentUserId,
  showInviteButton = false,
  isJoined = false 
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await action();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewGroup = () => {
    if (onViewGroup) {
      onViewGroup();
    } else {
      navigate(`/community/groups/${group.id}`);
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'Founder': return 'Founder';
      case 'Co-founder': return 'Admin';
      case 'Member': return 'Member';
      default: return '';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Founder': return 'founder';
      case 'Co-founder': return 'admin';
      default: return 'member';
    }
  };

  return (
    <div className="groupCard">
      <div className="groupCardHeader">
        <img 
          src={group.img || "https://via.placeholder.com/300x150?text=Group"} 
          alt={group.name}
          className="groupImage"
          onClick={handleViewGroup}
        />
        
        <div className="groupBadges">
          {group.type === 'Private' ? (
            <span className="typeBadge private">
              <LockIcon />
              Private
            </span>
          ) : (
            <span className="typeBadge public">
              <PublicIcon />
              Public
            </span>
          )}
          
          {group.userRole && (
            <span className={`roleBadge ${getRoleBadgeClass(group.userRole)}`}>
              {group.userRole === 'Founder' && <StarIcon />}
              {getRoleDisplayName(group.userRole)}
            </span>
          )}
        </div>

        {isJoined && (
          <div className="cardMenu">
            <MoreVertIcon 
              className="menuIcon"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            />
            {menuOpen && (
              <div className="cardDropdown">
                {showInviteButton && (
                  <button onClick={() => {
                    setMenuOpen(false);
                    onInviteFriends();
                  }}>
                    <PersonAddIcon />
                    Invite Friends
                  </button>
                )}
                <button onClick={() => {
                  setMenuOpen(false);
                  handleViewGroup();
                }}>
                  <VisibilityIcon />
                  View Group
                </button>
                {group.userRole !== 'Founder' && (
                  <button 
                    className="danger"
                    onClick={() => {
                      setMenuOpen(false);
                      handleAction(onLeave);
                    }}
                  >
                    <ExitToAppIcon />
                    Leave Group
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="groupCardBody">
        <h3 className="groupName" onClick={handleViewGroup}>
          {group.name}
        </h3>
        
        <p className="groupDescription">
          {group.description?.length > 100 
            ? `${group.description.substring(0, 100)}...`
            : group.description
          }
        </p>

        <div className="groupStats">
          <div className="stat">
            <GroupsIcon />
            <span>{group.memberCount || 0} members</span>
          </div>
          
          {group.recentPostsCount !== undefined && (
            <div className="stat">
              <span className="activityDot"></span>
              <span>{group.recentPostsCount} recent posts</span>
            </div>
          )}
        </div>
      </div>

      <div className="groupCardFooter">
        {isJoined ? (
          <div className="joinedActions">
            <button 
              className="viewGroupBtn primary"
              onClick={handleViewGroup}
            >
              <VisibilityIcon />
              View Group
            </button>
            
            {showInviteButton && (
              <button 
                className="inviteBtn secondary"
                onClick={() => onInviteFriends()}
                disabled={loading}
              >
                <PersonAddIcon />
                Invite
              </button>
            )}
          </div>
        ) : (
          <button 
            className="joinBtn primary"
            onClick={() => handleAction(onJoin)}
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Group"}
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupCard;