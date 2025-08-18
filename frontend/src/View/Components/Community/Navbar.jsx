import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../CSS/Components/Community/navbar.scss";
import { AuthContext } from "../../../Context/AuthContext";
import { useChat } from "../../../Context/ChatContext";
import { useFriends } from "../../../Context/FriendContext";
import ChatInterface from "../../Components/Common/ChatInterface.jsx";

// Import clean API functions with correct paths
import { getGroupInvitations } from "../../../Api/CommunityAPIs/groupsApi";
import { getFriendRequests } from "../../../Api/CommunityAPIs/friendsApi";
import { searchUsers } from "../../../Api/CommunityAPIs/communityUserApi";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../../Api/CommunityAPIs/notificationsApi";

// Import Icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const Navbar = () => {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const notificationRef = useRef(null);

  // Chat states
  const [showChat, setShowChat] = useState(false);
  const [showChatList, setShowChatList] = useState(false);
  const [selectedChatContact, setSelectedChatContact] = useState(null);
  const chatRef = useRef(null);

  const { getUnreadCount, getUnreadCountForContact, markMessagesAsRead } =
    useChat();
  const { friendsList } = useFriends();

  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const communityUnreadCount = getUnreadCount("community");

  // Load notifications when component mounts
  useEffect(() => {
    if (authData?.id) {
      loadNotifications();
      // Set up polling for real-time notifications (every 30 seconds)
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [authData]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setShowChatList(false);
      }
    };

    if (showChatList) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChatList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const toggleChatList = () => {
    setShowChatList(!showChatList);
    setShowNotifications(false); // Close notifications if open
  };

  const handleStartChat = (friend) => {
    setSelectedChatContact({
      id: friend.id,
      title: friend.name,
      icon: (
        <img
          src={
            friend.profilePic ||
            friend.profilePicture ||
            "https://via.placeholder.com/32"
          }
          alt={friend.name}
          style={{ width: "24px", height: "24px", borderRadius: "50%" }}
        />
      ),
    });
    setShowChat(true);
    setShowChatList(false);

    // Mark messages as read when opening chat
    markMessagesAsRead(friend.id, "community");
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedChatContact(null);
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const [groupInvitationsData, friendRequestsData, jobNotificationsData] =
        await Promise.all([
          getGroupInvitations(),
          getFriendRequests(),
          getNotifications().catch(() => []),
        ]);

      // Group invitations (don't count towards unread)
      const groupInvitations = (groupInvitationsData || []).map(
        (invitation) => ({
          id: `group_${invitation.id}`,
          type: "group_invitation",
          title: "Group Invitation",
          message: `${invitation.inviter.name} invited you to join "${invitation.group.name}"`,
          avatar: invitation.group.img || invitation.inviter.profilePic,
          timestamp: invitation.createdAt,
          data: invitation,
          isRead: false,
        })
      );

      // Friend requests (don't count towards unread)
      const friendRequests = (friendRequestsData || []).map((request) => ({
        id: `friend_${request.id}`,
        type: "friend_request",
        title: "Friend Request",
        message: `${request.sender.name} sent you a friend request`,
        avatar: request.sender.profilePic,
        timestamp: request.createdAt,
        data: request,
        isRead: false,
      }));

      // Job notifications (use actual read status)
      const jobNotifications = (jobNotificationsData || []).map(
        (notification) => ({
          id: `job_${notification.id}`,
          type: notification.type.toLowerCase(),
          title: notification.title,
          message: notification.message,
          avatar:
            notification.senderProfilePic || "https://via.placeholder.com/40",
          timestamp: notification.createdAt,
          data: notification,
          isRead: notification.isRead,
        })
      );

      const allNotifications = [
        ...groupInvitations,
        ...friendRequests,
        ...jobNotifications,
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setNotifications(allNotifications);

      // ONLY count job notifications for the unread badge
      const unreadJobNotifications = jobNotifications.filter(
        (n) => !n.isRead
      ).length;
      setUnreadCount(unreadJobNotifications);
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark individual notification as read if it's a job notification
    if (notification.type.includes("job_application") && !notification.isRead) {
      try {
        await markNotificationRead(notification.data.id);
      } catch (error) {
        // Handle error silently
      }
    }

    if (notification.type === "group_invitation") {
      setShowNotifications(false);
      navigate("/community/groups", {
        state: {
          openInvitationsModal: true,
          specificInvitation: notification.data,
        },
      });
    } else if (notification.type === "friend_request") {
      setShowNotifications(false);
      navigate("/community/friends");
    } else if (
      notification.type === "job_application_accepted" ||
      notification.type === "job_application_rejected"
    ) {
      setShowNotifications(false);
      navigate("/community/jobs", {
        state: {
          activeTab: "applied",
        },
      });
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchUsers(value);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchKeyPress = async (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      setIsSearching(true);
      try {
        const results = await searchUsers(searchTerm);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const toggleNotifications = async () => {
    if (!showNotifications) {
      // When opening notifications, mark all as read in the database
      try {
        await markAllNotificationsRead();

        // Clear the badge immediately
        setUnreadCount(0);

        // Update the notifications to mark them as read locally
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );
      } catch (error) {
        // Handle error silently
      }
    }
    setShowNotifications(!showNotifications);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleUserSelect = (user) => {
    setShowSearchResults(false);
    setSearchTerm("");
    navigate(`/community/profile/${user.id}`);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "1200":
        return <SchoolIcon className="roleIcon lecturer" />;
      case "1100":
        return <AdminPanelSettingsIcon className="roleIcon admin" />;
      default:
        return <PersonIcon className="roleIcon student" />;
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "1200":
        return "Lecturer";
      case "1100":
        return "Admin";
      default:
        return "Student";
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link
          to="/community/home"
          style={{ textDecoration: "none", color: "#5271ff" }}
        >
          <span>EduSphereSocial</span>
        </Link>
        <HomeOutlinedIcon
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        />
        <div className="searchContainer" ref={searchRef}>
          <div className="search">
            <SearchOutlinedIcon className="searchIcon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyPress={handleSearchKeyPress}
              className={isSearching ? "searching" : ""}
            />
            {isSearching && <div className="searchLoader"></div>}
            {searchTerm && (
              <CloseIcon
                className="clearSearchIcon"
                onClick={handleClearSearch}
              />
            )}
          </div>

          {showSearchResults && (
            <div className="searchResultsDropdown">
              <div className="searchResultsHeader">
                <span>Search Results</span>
                {searchResults.length > 0 && (
                  <span className="resultCount">{searchResults.length} found</span>
                )}
              </div>
              
              <div className="searchResultsList">
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="searchResultItem"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="userAvatar">
                        <img
                          src={user.profilePic || "https://via.placeholder.com/40"}
                          alt={user.name}
                        />
                        <div className="roleIconContainer">
                          {getRoleIcon(user.role)}
                        </div>
                      </div>
                      <div className="userInfo">
                        <div className="userName">{user.name}</div>
                        <div className="userDetails">
                          <span className="userRole">{getRoleText(user.role)}</span>
                          {user.department && (
                            <span className="userDepartment">• {user.department}</span>
                          )}
                        </div>
                        {user.email && (
                          <div className="userEmail">{user.email}</div>
                        )}
                      </div>
                      <div className="userActions">
                        <PersonOutlinedIcon className="viewProfileIcon" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="noResults">
                    <SearchOutlinedIcon className="noResultsIcon" />
                    <span>No users found for "{searchTerm}"</span>
                    <small>Try searching with different keywords</small>
                  </div>
                )}
              </div>
              
              {searchResults.length > 5 && (
                <div className="searchResultsFooter">
                  <button className="viewAllResultsBtn">
                    View All Results ({searchResults.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="right">
        <PersonOutlinedIcon
          onClick={() => navigate(`/community/profile/${authData?.id}`)}
          style={{ cursor: "pointer" }}
        />

        {/* Simple Chat Container */}
        <div className="chatContainer" ref={chatRef}>
          <div className="chatIcon" onClick={toggleChatList}>
            <EmailOutlinedIcon style={{ cursor: "pointer" }} />

            {/* Unread count badge */}
            {communityUnreadCount > 0 && (
              <span className="chatBadge">
                {communityUnreadCount > 99 ? "99+" : communityUnreadCount}
              </span>
            )}
          </div>

          {showChatList && (
            <div className="chatDropdown">
              <div className="chatHeader">
                <h3>Friends Chat ({communityUnreadCount} unread)</h3>
                <CloseIcon
                  className="closeIcon"
                  onClick={() => setShowChatList(false)}
                />
              </div>

              <div className="chatList">
                {friendsList.length === 0 ? (
                  <div className="chatItem empty">
                    <span>No friends available for chat</span>
                  </div>
                ) : (
                  friendsList.map((friend) => {
                    const unreadCount = getUnreadCountForContact(
                      friend.id,
                      "community"
                    );
                    return (
                      <div
                        key={friend.id}
                        className={`chatItem ${
                          unreadCount > 0 ? "hasUnread" : ""
                        }`}
                        onClick={() => handleStartChat(friend)}
                      >
                        <div className="chatAvatar">
                          <img
                            src={
                              friend.profilePic ||
                              friend.profilePicture ||
                              "https://via.placeholder.com/40"
                            }
                            alt={friend.name}
                          />
                          {unreadCount > 0 && (
                            <span className="avatarBadge">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          )}
                        </div>

                        <div className="chatContent">
                          <div className="chatName">{friend.name}</div>
                          <div className="chatStatus">
                            {friend.role === "1300"
                              ? "Student"
                              : friend.role === "1200"
                              ? "Lecturer"
                              : "Admin"}
                            {unreadCount > 0 && (
                              <span className="unreadIndicator">
                                {" "}
                                • {unreadCount} new
                              </span>
                            )}
                          </div>
                        </div>

                        {unreadCount > 0 && <div className="unreadDot"></div>}
                      </div>
                    );
                  })
                )}
              </div>

              {friendsList.length > 0 && (
                <div className="chatFooter">
                  <button
                    className="viewAllChatsBtn"
                    onClick={() => {
                      setShowChatList(false);
                      navigate("/community/friends");
                    }}
                  >
                    View All Friends
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="notificationContainer" ref={notificationRef}>
          <div className="notificationIcon" onClick={toggleNotifications}>
            <NotificationsOutlinedIcon style={{ cursor: "pointer" }} />
            {unreadCount > 0 && (
              <span className="notificationBadge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>

          {showNotifications && (
            <div className="notificationDropdown">
              <div className="notificationHeader">
                <h3>Notifications</h3>
                <CloseIcon
                  className="closeIcon"
                  onClick={() => setShowNotifications(false)}
                />
              </div>

              <div className="notificationList">
                {loading ? (
                  <div className="notificationItem loading">
                    <div className="loadingSpinner"></div>
                    <span>Loading notifications...</span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="notificationItem empty">
                    <NotificationsOutlinedIcon className="emptyIcon" />
                    <span>No new notifications</span>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`notificationItem ${
                        !notification.isRead ? "unread" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notificationAvatar">
                        <img
                          src={
                            notification.avatar ||
                            "https://via.placeholder.com/40"
                          }
                          alt="Notification"
                        />
                        {notification.type === "group_invitation" && (
                          <GroupsIcon className="notificationTypeIcon" />
                        )}
                        {notification.type === "friend_request" && (
                          <PersonAddIcon className="notificationTypeIcon" />
                        )}
                      </div>

                      <div className="notificationContent">
                        <div className="notificationTitle">
                          {notification.title}
                        </div>
                        <div className="notificationMessage">
                          {notification.message}
                        </div>
                        <div className="notificationTime">
                          {formatTimeAgo(notification.timestamp)}
                        </div>
                      </div>

                      {!notification.isRead && (
                        <div className="unreadDot"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="notificationFooter">
                  <button
                    className="markAllReadBtn"
                    onClick={async () => {
                      try {
                        await markAllNotificationsRead();
                        setNotifications((prev) =>
                          prev.map((n) => ({ ...n, isRead: true }))
                        );
                        setUnreadCount(0);
                      } catch (error) {
                        // Handle error silently
                      }
                    }}
                  >
                    Mark All as Read
                  </button>
                  <button
                    className="viewAllBtn"
                    onClick={() => {
                      setShowNotifications(false);
                      navigate("/community/notifications");
                    }}
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="user"
          onClick={() => navigate(`/community/profile/${authData?.id}`)}
          style={{ cursor: "pointer" }}
        >
          <img
            src={authData?.profilePic || "https://via.placeholder.com/32"}
            alt={authData?.name || "User"}
          />
          <span>{authData?.name || "User"}</span>
        </div>
      </div>

      {/* Chat Interface */}
      {showChat && selectedChatContact && (
        <ChatInterface
          contact={selectedChatContact}
          onClose={handleCloseChat}
          currentUserId={authData?.id}
          context="community"
        />
      )}
    </div>
  );
};

export default Navbar;