import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../../CSS/Pages/Community/friends.scss";
import { AuthContext } from "../../../Context/AuthContext";
import { useFriends } from "../../../Context/FriendContext";

// Import the new clean API functions
import { 
  getFriendSuggestions, 
  sendFriendRequest,
  dismissSuggestion 
} from "../../../Api/CommunityAPIs/friendsApi";

const Friends = () => {
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [showAllFollowed, setShowAllFollowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authData } = useContext(AuthContext);
  const { friendsList, getFriendCount } = useFriends();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authData?.id) return;

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        
        const suggestionsData = await getFriendSuggestions();
        setSuggestedFriends(suggestionsData);
        setError(null);

      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setError("Failed to load friend suggestions. Please try again.");
        setSuggestedFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [authData?.id]);

  const handleFollow = async (user) => {
    try {
      await sendFriendRequest(user.id);
      setSuggestedFriends(prev => prev.filter(u => u.id !== user.id));
    } catch (error) {
      console.error("Failed to send friend request:", error);
      alert("Failed to send friend request. Please try again.");
    }
  };

  const removeSuggestion = async (userId) => {
    try {
      await dismissSuggestion(userId);
      setSuggestedFriends(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Failed to dismiss suggestion:", error);
    }
  };

  if (loading) {
    return (
      <div className="friendsPage">
        <div className="loading">Loading friends...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friendsPage">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const followedToDisplay = showAllFollowed ? friendsList : friendsList.slice(0, 3);

  return (
    <div className="friendsPage">
      <div className="sectionHeader">
        <h3>My Friends ({getFriendCount()})</h3>
        {getFriendCount() > 3 && (
          <span className="viewAll" onClick={() => setShowAllFollowed(!showAllFollowed)}>
            {showAllFollowed ? "View Less" : "View All"}
          </span>
        )}
      </div>

      {getFriendCount() === 0 ? (
        <div className="emptyState">
          <p>You haven't added any friends yet. Check out the suggestions below!</p>
        </div>
      ) : (
        <div className="friendsGrid">
          {followedToDisplay.map((friend) => (
            <div className="friendCard" key={friend.id}>
              <div className="imageWrapper">
                <img src={friend.profilePic || friend.profilePicture || "https://via.placeholder.com/150"} alt={friend.name} className="profileImg" />
              </div>
              <h3>{friend.name}</h3>
              <p className="role">{friend.role === "1300" ? "Student" : friend.role === "1200" ? "Lecturer" : "Admin"}</p>
              <p className="title">{friend.title}</p>
              <p className="university">{friend.university}</p>
              <button
                className="viewProfileBtn"
                onClick={() => navigate(`/community/profile/${friend.id}`)}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="sectionHeader" style={{ marginTop: "30px" }}>
        <h3>Suggested People ({suggestedFriends.length})</h3>
      </div>

      {suggestedFriends.length === 0 ? (
        <div className="emptyState">
          <p>No more suggestions available at the moment.</p>
        </div>
      ) : (
        <div className="friendsGrid">
          {suggestedFriends.map((user) => (
            <div className="friendCard" key={user.id}>
              <button className="closeBtn" onClick={() => removeSuggestion(user.id)}>×</button>
              <div className="imageWrapper">
                <img src={user.profilePic || user.profilePicture || "https://via.placeholder.com/150"} alt={user.name} className="profileImg" />
              </div>
              <h3>{user.name}</h3>
              <p className="role">{user.role === "1300" ? "Student" : user.role === "1200" ? "Lecturer" : "Admin"}</p>
              <p className="title">{user.title}</p>
              <p className="university">{user.university}</p>
              <button className="RequestFollowBtn" onClick={() => handleFollow(user)}>
                Request Follow +
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;