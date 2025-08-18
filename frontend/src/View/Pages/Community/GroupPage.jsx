import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import "../../../CSS/Pages/Community/groupPage.scss";

import Posts from "../../Components/Community/Posts";
import Share from "../../Components/Community/Share";
import { AuthContext } from "../../../Context/AuthContext";

// Import clean API functions instead of direct endpoints and axios
import {
  getGroupDetails,
  getGroupPosts,
  getGroupMembers,
  joinGroup,
  leaveGroup,
  updateGroup,
  promoteMember,
  removeMember
} from "../../../Api/CommunityAPIs/groupsApi";

// Import icons
import GroupsIcon from "@mui/icons-material/Groups";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const GroupPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  // State
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  
  // Modal states
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedGroup, setEditedGroup] = useState(null);

  // Load group & posts
  useEffect(() => {
    if (!groupId || !authData?.id) {
      setLoading(false);
      setError(new Error('Missing group ID or authentication'));
      return;
    }

    const fetchGroupData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [groupRes, postsRes, membersRes] = await Promise.all([
          getGroupDetails(groupId),
          getGroupPosts(groupId),
          getGroupMembers(groupId)
        ]);
        
        // Set the data
        setGroup(groupRes);
        setPosts(postsRes || []);
        setMembers(membersRes || []);
        setEditedGroup(groupRes);
        
      } catch (error) {
        setError(error);
        
        // Only navigate away on 404, not other errors
        if (error.response?.status === 404) {
          // Group not found - will show error message
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId, authData]);

  // Calculate user permissions
  const isFounder = group?.founderId === authData?.id;
  const currentUserMember = members.find(m => m.userId === authData?.id);
  const isCoFounder = currentUserMember?.role === "Co-founder";
  const hasManagePermission = isFounder || isCoFounder;
  const isMember = !!currentUserMember;

  // Join/Leave group functionality
  const toggleMembership = async () => {
    if (isFounder) return;

    try {
      if (isMember) {
        const confirmed = window.confirm(`Are you sure you want to leave "${group.name}"?`);
        if (!confirmed) return;

        await leaveGroup(groupId);
        
        setGroup(prev => ({ ...prev, members: prev.members - 1 }));
        setMembers(prev => prev.filter(m => m.userId !== authData.id));
      } else {
        await joinGroup(groupId);
        
        const newMember = {
          userId: authData.id,
          name: authData.name,
          role: "Member",
          profilePic: authData.profilePic,
          joinDate: new Date().toLocaleDateString(),
        };
        
        setGroup(prev => ({ ...prev, members: prev.members + 1 }));
        setMembers(prev => [...prev, newMember]);
      }
    } catch (error) {
      alert("Failed to update membership. Please try again.");
    }
  };

  // Update group info
  const updateGroupInfo = async () => {
    if (!hasManagePermission || !editedGroup) return;
    
    try {
      const updatedGroup = await updateGroup(groupId, editedGroup);
      
      setGroup(updatedGroup);
      setShowEditModal(false);
      alert("Group updated successfully!");
    } catch (error) {
      alert("Failed to update group. Please try again.");
    }
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="groupPage">
        <div className="loading">
          <div className="loadingSpinner"></div>
          <p>Loading group...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !group) {
    return (
      <div className="groupPage">
        <div className="error">
          <h2>Unable to Load Group</h2>
          <p>
            {error.response?.status === 404 
              ? "The group you're looking for doesn't exist or has been removed."
              : "There was an error loading the group. Please try again."
            }
          </p>
          <button onClick={() => navigate('/community/groups')}>
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  // Main render - group data is available
  return (
    <div className="groupPage">
      {/* Back Button */}
      <div className="backButton">
        <button onClick={() => navigate('/community/groups')}>
          <ArrowBackIcon />
          Back to Groups
        </button>
      </div>

      {/* Group Header */}
      <div className="groupHeader">
        <div className="groupBanner">
          <img 
            src={group?.img || "https://via.placeholder.com/1200x300?text=Group+Banner"} 
            alt={group?.name || "Group"} 
          />
          <div className="bannerOverlay"></div>
        </div>
        
        <div className="groupMainInfo">
          <div className="groupBasicInfo">
            <div className="groupTitleSection">
              <h1>{group?.name || "Loading..."}</h1>
              <div className="groupMeta">
                <span className="groupType">
                  {group?.type === 'Private' ? <LockIcon /> : <PublicIcon />}
                  {group?.type || "Public"}
                </span>
                <span className="memberCount">
                  <GroupsIcon />
                  {group?.members || members.length} members
                </span>
                <span className="createdDate">
                  <CalendarTodayIcon />
                  Created {group?.createdAt ? formatJoinDate(group.createdAt) : "Unknown"}
                </span>
              </div>
            </div>
            
            <div className="groupActions">
              {!isFounder && (
                <button
                  className={`membershipBtn ${isMember ? "leave" : "join"}`}
                  onClick={toggleMembership}
                >
                  {isMember ? (
                    <>
                      <ExitToAppIcon />
                      Leave Group
                    </>
                  ) : (
                    <>
                      <PersonAddIcon />
                      Join Group
                    </>
                  )}
                </button>
              )}
              
              {hasManagePermission && (
                <button
                  className="editGroupBtn"
                  onClick={() => setShowEditModal(true)}
                >
                  <SettingsIcon />
                  Settings
                </button>
              )}
            </div>
          </div>
          
          <div className="groupDescription">
            <p>{group?.description || "No description available."}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="groupNavigation">
        <button 
          className={`navTab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts ({posts.length})
        </button>
        <button 
          className={`navTab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members ({members.length})
        </button>
        <button 
          className={`navTab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </div>

      {/* Tab Content */}
      <div className="tabContent">
        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="postsTab">
            {isMember && (
              <div className="createPostSection">
                <Share
                  groupId={group.id}
                  groupName={group.name}
                  onShare={(newPost) => {
                    // Add the new post to the top of the posts list
                    setPosts([newPost, ...posts]);
                    
                    // Optional: Also refresh group posts from server to ensure sync
                    setTimeout(async () => {
                      try {
                        const updatedPosts = await getGroupPosts(groupId);
                        setPosts(updatedPosts);
                      } catch (error) {
                        console.error('Failed to refresh group posts:', error);
                      }
                    }, 1000);
                  }}
                />
              </div>
            )}
            <div className="postsContainer">
              {posts.length === 0 ? (
                <div className="emptyState">
                  <GroupsIcon className="emptyIcon" />
                  <h3>No posts yet</h3>
                  <p>Be the first to share something in this group!</p>
                </div>
              ) : (
                <Posts
                  posts={posts.map((p) => ({
                    ...p,
                    groupName: group.name,
                    groupId: group.id
                  }))}
                />
              )}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="membersTab">
            <div className="membersHeader">
              <h3>Group Members ({members.length})</h3>
            </div>
            
            <div className="membersList">
              {members.map((member) => (
                <div key={member.userId} className="memberCard">
                  <div className="memberAvatar">
                    <img 
                      src={member.profilePic || "https://via.placeholder.com/60"} 
                      alt={member.name} 
                    />
                  </div>
                  
                  <div className="memberInfo">
                    <div className="memberName">{member.name}</div>
                    <span className={`roleBadge ${member.role?.toLowerCase() || 'member'}`}>
                      {member.role === 'Founder' && <StarIcon />}
                      {member.role === 'Co-founder' && <AdminPanelSettingsIcon />}
                      {member.role || 'Member'}
                    </span>
                    <div className="memberJoinDate">
                      Joined {formatJoinDate(member.joinDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="aboutTab">
            <div className="aboutSection">
              <h3>About this group</h3>
              <p>{group?.description || "No description available."}</p>
            </div>
            
            <div className="groupStats">
              <div className="statCard">
                <GroupsIcon />
                <div className="statInfo">
                  <span className="statNumber">{group?.members || members.length}</span>
                  <span className="statLabel">Members</span>
                </div>
              </div>
              
              <div className="statCard">
                <CalendarTodayIcon />
                <div className="statInfo">
                  <span className="statNumber">
                    {group?.createdAt ? formatJoinDate(group.createdAt) : "Unknown"}
                  </span>
                  <span className="statLabel">Created</span>
                </div>
              </div>
              
              <div className="statCard">
                {group?.type === 'Private' ? <LockIcon /> : <PublicIcon />}
                <div className="statInfo">
                  <span className="statNumber">{group?.type || "Public"}</span>
                  <span className="statLabel">Privacy</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Group Modal */}
      {showEditModal && editedGroup && (
        <div className="modal" onClick={() => setShowEditModal(false)}>
          <div className="modalContent large" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>Group Settings</h3>
              <button className="closeBtn" onClick={() => setShowEditModal(false)}>
                <CloseIcon />
              </button>
            </div>
            
            <div className="modalBody">
              <div className="editForm">
                <div className="formGroup">
                  <label>Group Name</label>
                  <input
                    type="text"
                    value={editedGroup.name || ''}
                    onChange={(e) => setEditedGroup({...editedGroup, name: e.target.value})}
                    placeholder="Enter group name"
                  />
                </div>
                
                <div className="formGroup">
                  <label>Description</label>
                  <textarea
                    value={editedGroup.description || ''}
                    onChange={(e) => setEditedGroup({...editedGroup, description: e.target.value})}
                    placeholder="Describe your group"
                    rows="4"
                  />
                </div>
                
                <div className="formGroup">
                  <label>Banner Image URL</label>
                  <input
                    type="url"
                    value={editedGroup.img || ""}
                    onChange={(e) => setEditedGroup({...editedGroup, img: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="formGroup">
                  <label>Privacy Setting</label>
                  <select
                    value={editedGroup.type || 'Public'}
                    onChange={(e) => setEditedGroup({...editedGroup, type: e.target.value})}
                  >
                    <option value="Public">Public - Anyone can join</option>
                    <option value="Private">Private - Invitation only</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="modalFooter">
              <button 
                className="cancelBtn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="saveBtn"
                onClick={updateGroupInfo}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPage;