import "../../../CSS/Pages/Community/profile.scss";
import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

import { useChat } from "../../../Context/ChatContext";
import ChatInterface from "../../Components/Common/ChatInterface";

import Posts from "../../Components/Community/Posts";
import { AuthContext } from "../../../Context/AuthContext";
import { useFriends } from "../../../Context/FriendContext";

// Import the clean API functions
import { getUserProfile, reportUser } from "../../../Api/CommunityAPIs/communityUserApi";
import { getUserPosts } from "../../../Api/CommunityAPIs/postsApi";
import { getFriendshipStatus } from "../../../Api/CommunityAPIs/friendsApi";

const Profile = () => {
  const { userId } = useParams();
  const { authData } = useContext(AuthContext);
  const { friendsList, sendFriendRequest, removeFriendFromList, isFriend } =
    useFriends();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState("none");
  const [processingRequest, setProcessingRequest] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { loadMessages, markMessagesAsRead } = useChat();

  // Memoized function to determine friendship status
  const determineFriendshipStatus = useCallback(async () => {
    if (!authData?.id || userId === authData.id) {
      return "none";
    }

    // Primary check: Use friends context (most reliable for real-time state)
    const isFriendInContext = isFriend(userId);

    if (isFriendInContext) {
      return "friends";
    }

    // Secondary check: API call for pending status or if context is not loaded yet
    try {
      const friendshipResponse = await getFriendshipStatus(userId);
      const status = friendshipResponse.status || "none";
      return status;
    } catch (error) {
      return "none";
    }
  }, [authData?.id, userId, isFriend]);

  // Initial data fetch
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user profile using new API
        const userData = await getUserProfile(userId);
        setUser(userData);

        // Fetch user posts using new API
        const postsData = await getUserPosts(userId);
        setUserPosts(postsData);

        // Determine friendship status
        const status = await determineFriendshipStatus();
        setFriendshipStatus(status);
      } catch (error) {
        if (error.message?.includes('not found')) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, authData?.id, determineFriendshipStatus]);

  // Update friendship status when friends list changes (but don't cause infinite loop)
  useEffect(() => {
    if (userId && authData?.id && userId !== authData.id) {
      const updateStatus = async () => {
        const status = await determineFriendshipStatus();
        setFriendshipStatus(status);
      };
      updateStatus();
    }
  }, [friendsList.length, userId, authData?.id, determineFriendshipStatus]); // Only depend on length to avoid infinite loops

  const handleFriendAction = async () => {
    if (processingRequest) return;

    try {
      setProcessingRequest(true);

      if (friendshipStatus === "none") {
        // Send friend request
        await sendFriendRequest(userId);
        setFriendshipStatus("pending");
      } else if (friendshipStatus === "friends") {
        // Remove friend
        await removeFriendFromList(userId);
        setFriendshipStatus("none");
      }

      setMenuOpen(false);
    } catch (error) {
      alert("Failed to update friendship. Please try again.");

      // Refresh status on error to ensure correct state
      setTimeout(async () => {
        const correctedStatus = await determineFriendshipStatus();
        setFriendshipStatus(correctedStatus);
      }, 500);
    } finally {
      setProcessingRequest(false);
    }
  };

  const handleReport = async () => {
    try {
      // Use new API function for reporting
      await reportUser(userId, {
        reason: "inappropriate_content",
      });
      alert(`User ${user.name} has been reported.`);
      setMenuOpen(false);
    } catch (error) {
      alert("Failed to report user. Please try again.");
    }
  };

  const handleEditProfile = () => {
    navigate(`/community/profile/${userId}/edit`);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  if (loading) {
    return (
      <div className="profile">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile">
        <div className="error">
          <h3>User not found</h3>
          <p>
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <button onClick={() => navigate("/community/home")}>
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = user.id === authData?.id;

  const getFriendButtonConfig = () => {
    if (friendshipStatus === "friends") {
      return {
        text: "Friends",
        icon: <CheckIcon fontSize="small" />,
        className: "following",
        onClick: handleFriendAction,
      };
    } else if (friendshipStatus === "pending") {
      return {
        text: "Request Sent",
        icon: <HourglassEmptyIcon fontSize="small" />,
        className: "pending",
        onClick: null, // Can't cancel request from profile
      };
    } else {
      return {
        text: "Add Friend",
        icon: <PersonAddIcon fontSize="small" />,
        className: "",
        onClick: handleFriendAction,
      };
    }
  };

  const friendButtonConfig = getFriendButtonConfig();

  const handleStartChat = () => {
    if (friendshipStatus === "friends") {
      setShowChat(true);
      loadMessages(userId, "community");
      markMessagesAsRead(userId, "community");
    } else {
      alert("You can only chat with friends!");
    }
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  return (
    <div className="profile">
      <div className="images">
        <img
          src={
            user.coverPic ||
            "https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg"
          }
          alt="Cover"
          className="cover"
        />
        <img
          src={user.profilePic || "https://via.placeholder.com/150"}
          alt="Profile"
          className="profilePic"
        />
      </div>

      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            {user.socialLinks?.facebook && (
              <a
                href={user.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookTwoToneIcon fontSize="large" />
              </a>
            )}
            {user.socialLinks?.instagram && (
              <a
                href={user.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon fontSize="large" />
              </a>
            )}
            {user.socialLinks?.twitter && (
              <a
                href={user.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon fontSize="large" />
              </a>
            )}
            {user.socialLinks?.linkedin && (
              <a
                href={user.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon fontSize="large" />
              </a>
            )}
            {user.socialLinks?.pinterest && (
              <a
                href={user.socialLinks.pinterest}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PinterestIcon fontSize="large" />
              </a>
            )}
          </div>

          <div className="center">
            <span className="userName">{user.name}</span>
            {user.title && <p className="userTitle">{user.title}</p>}
            {user.university && (
              <p className="userUniversity">{user.university}</p>
            )}
            {user.bio && <p className="userBio">{user.bio}</p>}

            <div className="info">
              {user.location && (
                <div className="item">
                  <PlaceIcon />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="item">
                  <LanguageIcon />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.website}
                  </a>
                </div>
              )}
            </div>

            <div className="profileActions">
              {isOwnProfile ? (
                <button className="editBtn" onClick={handleEditProfile}>
                  <EditIcon fontSize="small" />
                  Edit Profile
                </button>
              ) : (
                <button
                  className={`friendBtn ${friendButtonConfig.className}`}
                  onClick={friendButtonConfig.onClick}
                  disabled={processingRequest || !friendButtonConfig.onClick}
                >
                  {processingRequest ? (
                    <>
                      <HourglassEmptyIcon fontSize="small" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {friendButtonConfig.icon}
                      {friendButtonConfig.text}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="right">
            {!isOwnProfile && (
              <>
                <div
                  className="messageIcon"
                  onClick={() => handleStartChat()}
                  style={{ cursor: "pointer" }}
                >
                  <EmailOutlinedIcon />
                </div>
                <div className="moreMenuWrapper">
                  <div
                    className="menuToggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(!menuOpen);
                    }}
                  >
                    <MoreVertIcon />
                  </div>
                  {menuOpen && (
                    <div
                      className="optionsMenu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {friendshipStatus === "friends" && (
                        <div
                          className="optionItem"
                          onClick={handleFriendAction}
                        >
                          <PersonRemoveIcon fontSize="small" />
                          Remove Friend
                        </div>
                      )}
                      <div className="optionItem" onClick={handleReport}>
                        🚩 Report User
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="postsSection">
          <div className="postsHeader">
            <h3>Posts ({userPosts.length})</h3>
          </div>

          {userPosts.length > 0 ? (
            <Posts posts={userPosts} />
          ) : (
            <div className="noPosts">
              <p>
                {isOwnProfile
                  ? "You haven't posted anything yet."
                  : `${user.name} hasn't posted anything yet.`}
              </p>
              {isOwnProfile && (
                <button onClick={() => navigate("/community/home")}>
                  Create Your First Post
                </button>
              )}
            </div>
          )}
        </div>
        {showChat && friendshipStatus === "friends" && (
          <ChatInterface
            contact={{
              id: userId,
              title: user.name,
              icon: (
                <img
                  src={user.profilePic || "https://via.placeholder.com/32"}
                  alt={user.name}
                  style={{ width: "24px", height: "24px", borderRadius: "50%" }}
                />
              ),
            }}
            onClose={handleCloseChat}
            currentUserId={authData?.id}
            context="community"
          />
        )}
      </div>
    </div>
  );
};

export default Profile;