import "../../../CSS/Components/Community/rightBar.scss";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import { useFriends } from "../../../Context/FriendContext";

// Import the clean API functions
import { 
  getFriendRequests, 
  getFriendsActivities, 
  getFriends
} from "../../../Api/CommunityAPIs/friendsApi";

const RightBar = () => {
  const [requests, setRequests] = useState([]);
  const [activities, setActivities] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState(null);
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const { acceptFriendRequest, rejectFriendRequest, friendsList } = useFriends();

  const fetchRightBarData = async () => {
    if (!authData?.id) return;

    try {
      setLoading(true);
      
      const [requestsData, activitiesData, friendsData] = await Promise.all([
        getFriendRequests(),
        getFriendsActivities(),
        getFriends('online')
      ]);
      
      setRequests(requestsData);
      setActivities(activitiesData);
      setOnlineFriends(friendsData.slice(0, 5));
    } catch (error) {
      setRequests([]);
      setActivities([]);
      setOnlineFriends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRightBarData();
  }, [authData]);

  useEffect(() => {
    if (authData?.id && friendsList.length > 0) {
      setOnlineFriends(friendsList.slice(0, 5));
    }
  }, [friendsList, authData]);

  const handleAccept = async (user) => {
    if (processingRequest === user.id) return;
    
    try {
      setProcessingRequest(user.id);
      await acceptFriendRequest(user.id);
      setRequests((prev) => prev.filter((req) => req.id !== user.id));
      
      setTimeout(() => {
        fetchRightBarData();
      }, 1000);
      
    } catch (error) {
      alert("Failed to accept friend request. Please try again.");
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleReject = async (user) => {
    if (processingRequest === user.id) return;
    
    try {
      setProcessingRequest(user.id);
      await rejectFriendRequest(user.id);
      setRequests((prev) => prev.filter((req) => req.id !== user.id));
    } catch (error) {
      alert("Failed to reject friend request. Please try again.");
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleNameClick = (userId) => {
    navigate(`/community/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="rightBar">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="rightBar">
      <div className="rightBarMenus">
        <div className="item">
          <span>Friend Requests</span>
          {requests.map((user) => (
            <div className="user" key={user.id}>
              <div className="userInfo">
                <img 
                  src={user.profilePic || user.img || "https://via.placeholder.com/40"} 
                  alt={user.name} 
                />
                <span
                  onClick={() => handleNameClick(user.id)}
                  style={{ cursor: "pointer", color: "#5271ff" }}
                >
                  {user.name}
                </span>
              </div>
              <div className="buttons">
                <button 
                  onClick={() => handleAccept(user)}
                  disabled={processingRequest === user.id}
                  style={{ 
                    opacity: processingRequest === user.id ? 0.6 : 1,
                    cursor: processingRequest === user.id ? 'not-allowed' : 'pointer'
                  }}
                >
                  {processingRequest === user.id ? "..." : "Accept"}
                </button>
                <button 
                  onClick={() => handleReject(user)}
                  disabled={processingRequest === user.id}
                  style={{ 
                    opacity: processingRequest === user.id ? 0.6 : 1,
                    cursor: processingRequest === user.id ? 'not-allowed' : 'pointer'
                  }}
                >
                  {processingRequest === user.id ? "..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
          {requests.length === 0 && (
            <p style={{ color: "#999", fontSize: "14px", fontStyle: "italic" }}>
              No pending friend requests
            </p>
          )}
        </div>

        <div className="item">
          <span>Latest Activities</span>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div className="user" key={`${activity.id}-${activity.createdAt}`}>
                <div className="userInfo">
                  <img 
                    src={activity.profilePic || activity.img || "https://via.placeholder.com/40"} 
                    alt={activity.name} 
                  />
                  <p>
                    <span 
                      onClick={() => handleNameClick(activity.userId || activity.id)}
                      style={{ cursor: "pointer", color: "#5271ff" }}
                    >
                      {activity.name}
                    </span> {activity.action}
                  </p>
                </div>
                <span>{activity.time || activity.createdAt}</span>
              </div>
            ))
          ) : (
            <p style={{ color: "#999", fontSize: "14px", fontStyle: "italic" }}>
              No recent activities from friends
            </p>
          )}
        </div>

        <div className="item">
          <span>Online Friends</span>
          {onlineFriends.length > 0 ? (
            onlineFriends.map((user) => (
              <div className="user" key={user.id}>
                <div className="userInfo">
                  <img 
                    src={user.profilePic || "https://via.placeholder.com/40"} 
                    alt={user.name} 
                  />
                  <div className="online" />
                  <span 
                    onClick={() => handleNameClick(user.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {user.name}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#999", fontSize: "14px", fontStyle: "italic" }}>
              No friends online
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;