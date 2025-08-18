import { useState, useEffect, useContext } from "react";
import "../../../CSS/Pages/Community/groups.scss";
import { useNavigate, useLocation } from "react-router-dom";
import Posts from "../../Components/Community/Posts";
import GroupCard from "../../Components/Community/GroupCard";
import { AuthContext } from "../../../Context/AuthContext";
import { useFriends } from "../../../Context/FriendContext";

// Import clean API functions instead of direct endpoints
import {
  getMyGroups,
  getAllGroups,
  getGroupFeed,
  searchGroups,
  getRecommendedGroups,
  getGroupInvitations,
  getGroupStats,
  joinGroup,
  leaveGroup
} from "../../../Api/CommunityAPIs/groupsApi";

import {
  CreateGroupModal,
  InviteFriendsModal,
  GroupInvitationsModal,
  UpdateGroupModal,
  ReportGroupModal
} from "../../Components/Community/GroupsModals";

// Import Material-UI icons for modern UI
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import GroupsIcon from "@mui/icons-material/Groups";
import RecommendIcon from "@mui/icons-material/Recommend";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const Groups = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authData } = useContext(AuthContext);
  const { friendsList } = useFriends();

  // State
  const [activeTab, setActiveTab] = useState('discover');
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [recommendedGroups, setRecommendedGroups] = useState([]);
  const [groupFeed, setGroupFeed] = useState([]);
  const [groupStats, setGroupStats] = useState(null);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    type: "all",
    sortBy: "activity"
  });

  // Modal states
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showInviteFriendsModal, setShowInviteFriendsModal] = useState(false);
  const [showInvitationsModal, setShowInvitationsModal] = useState(false);
  const [selectedGroupForInvite, setSelectedGroupForInvite] = useState(null);

  // Handle navigation state (from notifications)
  useEffect(() => {
    const state = location.state;
    if (state?.openInvitationsModal) {
      // Clear the navigation state to prevent reopening on refresh
      navigate(location.pathname, { replace: true });
      
      // Open the invitations modal after data loads
      setShowInvitationsModal(true);
    }
  }, [location.state, navigate, location.pathname]);

  // Load initial data
  useEffect(() => {
    if (!authData?.id) return;
    loadAllGroupsData();
  }, [authData]);

  // Search groups when search term or filters change
  useEffect(() => {
    if (activeTab === 'discover') {
      searchGroupsData();
    }
  }, [searchTerm, searchFilters, activeTab]);

  const loadAllGroupsData = async () => {
    try {
      setLoading(true);
      
      if (!authData?.id) {
        setLoading(false);
        return;
      }
      
      const [
        joinedRes,
        recommendedRes,
        feedRes,
        statsRes,
        invitationsRes
      ] = await Promise.all([
        getMyGroups(),
        getRecommendedGroups(),
        getGroupFeed(),
        getGroupStats(),
        getGroupInvitations()
      ]);
      
      setJoinedGroups(joinedRes || []);
      setRecommendedGroups(recommendedRes || []);
      setGroupFeed(feedRes || []);
      setGroupStats(statsRes || {});
      setPendingInvitations(invitationsRes || []);

      // Initial search for discover tab
      searchGroupsData();
    } catch (error) {
      setJoinedGroups([]);
      setRecommendedGroups([]);
      setGroupFeed([]);
      setGroupStats({});
      setPendingInvitations([]);
      
      if (error.response?.status === 401) {
        alert("Please log in to access groups.");
      } else {
        alert("Failed to load groups. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const searchGroupsData = async () => {
    try {
      const searchResults = await searchGroups(searchTerm, searchFilters);
      setAvailableGroups(searchResults || []);
    } catch (error) {
      setAvailableGroups([]);
    }
  };

  const handleJoinGroup = async (group) => {
    try {
      await joinGroup(group.id);

      // Update local state
      const updatedGroup = {
        ...group,
        memberCount: group.memberCount + 1,
        isUserMember: true
      };

      setJoinedGroups(prev => [...prev, updatedGroup]);
      setAvailableGroups(prev => prev.filter(g => g.id !== group.id));
      setRecommendedGroups(prev => prev.filter(g => g.id !== group.id));

      // Refresh stats
      loadGroupStatsData();
    } catch (error) {
      alert("Failed to join group. Please try again.");
    }
  };

  const handleLeaveGroup = async (group) => {
    if (group.userRole === 'Founder') {
      alert("Founders cannot leave their own groups. Delete the group instead.");
      return;
    }

    if (!window.confirm(`Are you sure you want to leave "${group.name}"?`)) {
      return;
    }

    try {
      await leaveGroup(group.id);

      // Update local state
      setJoinedGroups(prev => prev.filter(g => g.id !== group.id));
      
      // Add back to available groups if it's public
      if (group.type === 'Public') {
        const updatedGroup = {
          ...group,
          memberCount: group.memberCount - 1,
          isUserMember: false
        };
        setAvailableGroups(prev => [updatedGroup, ...prev]);
      }

      // Refresh stats
      loadGroupStatsData();
    } catch (error) {
      alert("Failed to leave group. Please try again.");
    }
  };

  const handleInviteFriends = (group) => {
    if (!friendsList || friendsList.length === 0) {
      alert("You don't have any friends to invite yet. Add some friends first!");
      return;
    }
    
    setSelectedGroupForInvite(group);
    setShowInviteFriendsModal(true);
  };

  const loadGroupStatsData = async () => {
    try {
      const stats = await getGroupStats();
      setGroupStats(stats || {});
    } catch (error) {
      // Handle silently
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'discover' && availableGroups.length === 0) {
      searchGroupsData();
    }
  };

  if (loading) {
    return (
      <div className="groupsPage">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="groupsPage">
      {/* Header with Stats and Actions */}
      <div className="groupsHeader">
        <div className="headerLeft">
          <h2>
            <GroupsIcon className="headerIcon" />
            Groups
          </h2>
          <div className="statsRow">
            <div className="stat">
              <span className="statNumber">{groupStats.userJoinedGroups || 0}</span>
              <span className="statLabel">Joined</span>
            </div>
            <div className="stat">
              <span className="statNumber">{groupStats.availableGroups || 0}</span>
              <span className="statLabel">Available</span>
            </div>
            {pendingInvitations.length > 0 && (
              <div className="stat highlight">
                <span className="statNumber">{pendingInvitations.length}</span>
                <span className="statLabel">Invitations</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="headerActions">
          {pendingInvitations.length > 0 && (
            <button 
              className="invitationsBtn"
              onClick={() => setShowInvitationsModal(true)}
            >
              <NotificationsIcon />
              Invitations ({pendingInvitations.length})
            </button>
          )}
          <button 
            className="createGroupBtn primary"
            onClick={() => setShowCreateGroupModal(true)}
          >
            <AddIcon />
            Create Group
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="groupsNav">
        <button 
          className={`navTab ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => handleTabChange('discover')}
        >
          <RecommendIcon />
          Discover
        </button>
        <button 
          className={`navTab ${activeTab === 'myGroups' ? 'active' : ''}`}
          onClick={() => handleTabChange('myGroups')}
        >
          <GroupsIcon />
          My Groups ({joinedGroups.length})
        </button>
        <button 
          className={`navTab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => handleTabChange('feed')}
        >
          <TrendingUpIcon />
          Feed
        </button>
      </div>

      {/* Tab Content */}
      <div className="tabContent">
        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div className="discoverTab">
            {/* Search and Filters */}
            <div className="searchSection">
              <div className="searchBar">
                <SearchIcon className="searchIcon" />
                <input
                  type="text"
                  placeholder="Search groups by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="searchInput"
                />
              </div>
              
              <div className="filterSection">
                <FilterListIcon className="filterIcon" />
                <select
                  value={searchFilters.type}
                  onChange={(e) => setSearchFilters(prev => ({...prev, type: e.target.value}))}
                  className="filterSelect"
                >
                  <option value="all">All Types</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
                
                <select
                  value={searchFilters.sortBy}
                  onChange={(e) => setSearchFilters(prev => ({...prev, sortBy: e.target.value}))}
                  className="filterSelect"
                >
                  <option value="activity">Most Active</option>
                  <option value="members">Most Members</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Recommended Groups Section */}
            {recommendedGroups.length > 0 && !searchTerm && (
              <div className="groupsSection">
                <h3>
                  <RecommendIcon />
                  Recommended for You
                </h3>
                <div className="groupsGrid">
                  {recommendedGroups.slice(0, 6).map(group => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onJoin={() => handleJoinGroup(group)}
                      onInviteFriends={() => handleInviteFriends(group)}
                      currentUserId={authData?.id}
                      showInviteButton={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className="groupsSection">
              <h3>
                {searchTerm ? `Search Results (${availableGroups.length})` : 'Discover Groups'}
              </h3>
              
              {availableGroups.length === 0 ? (
                <div className="emptyState">
                  <GroupsIcon className="emptyIcon" />
                  <p>
                    {searchTerm 
                      ? `No groups found for "${searchTerm}"`
                      : "No new groups to discover"
                    }
                  </p>
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")}>
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <div className="groupsGrid">
                  {availableGroups.map(group => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onJoin={() => handleJoinGroup(group)}
                      onInviteFriends={() => handleInviteFriends(group)}
                      currentUserId={authData?.id}
                      showInviteButton={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Groups Tab */}
        {activeTab === 'myGroups' && (
          <div className="myGroupsTab">
            {joinedGroups.length === 0 ? (
              <div className="emptyState">
                <GroupsIcon className="emptyIcon" />
                <p>You haven't joined any groups yet.</p>
                <button onClick={() => handleTabChange('discover')}>
                  Discover Groups
                </button>
              </div>
            ) : (
              <div className="groupsGrid">
                {joinedGroups.map(group => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onLeave={() => handleLeaveGroup(group)}
                    onInviteFriends={() => handleInviteFriends(group)}
                    onViewGroup={() => navigate(`/community/groups/${group.id}`)}
                    currentUserId={authData?.id}
                    showInviteButton={true}
                    isJoined={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="feedTab">
            {groupFeed.length === 0 ? (
              <div className="emptyState">
                <TrendingUpIcon className="emptyIcon" />
                <p>No posts from your groups yet.</p>
                <button onClick={() => handleTabChange('myGroups')}>
                  View My Groups
                </button>
              </div>
            ) : (
              <div className="feedContent">
                <h3>Latest from Your Groups</h3>
                <Posts posts={groupFeed} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateGroupModal && (
        <CreateGroupModal
          isOpen={showCreateGroupModal}
          onClose={() => setShowCreateGroupModal(false)}
          onGroupCreated={(newGroup) => {
            setJoinedGroups(prev => [newGroup, ...prev]);
            setShowCreateGroupModal(false);
            loadGroupStatsData();
          }}
        />
      )}

      {showInviteFriendsModal && selectedGroupForInvite && (
        <InviteFriendsModal
          isOpen={showInviteFriendsModal}
          group={selectedGroupForInvite}
          friends={friendsList}
          onClose={() => {
            setShowInviteFriendsModal(false);
            setSelectedGroupForInvite(null);
          }}
          onInvitesSent={() => {
            setShowInviteFriendsModal(false);
            setSelectedGroupForInvite(null);
          }}
        />
      )}

      {showInvitationsModal && (
        <GroupInvitationsModal
          isOpen={showInvitationsModal}
          invitations={pendingInvitations}
          onClose={() => setShowInvitationsModal(false)}
          onInvitationResponded={() => {
            loadAllGroupsData();
          }}
        />
      )}
    </div>
  );
};

export default Groups;