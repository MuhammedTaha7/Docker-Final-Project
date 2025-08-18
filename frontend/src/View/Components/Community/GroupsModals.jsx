// GroupsModals.jsx - All group modals using your dynamic components
import { useState } from "react";
import Modal from "../../Components/Modal/Modal";
import DynamicForm from "../../Components/Forms/dynamicForm";
import RealTimeTimestamp from "../../Components/Common/RealTimeTimestamp";

// Import form fields from your Static folder
import {
  createGroupFields,
  createGroupValidation,
  inviteFriendsFields,
  inviteFriendsValidation,
  updateGroupFields,
  updateGroupValidation,
  reportGroupFields,
  reportGroupValidation,
  promoteMemberFields,
  transferOwnershipFields,
  transferOwnershipValidation
} from "../../../Static/FIxed/formsInputs";

// Import clean API functions instead of direct endpoints
import { 
  createGroup,
  inviteFriendsToGroup,
  respondToGroupInvitation,
  updateGroup,
  reportGroup,
  promoteMember
} from "../../../Api/CommunityAPIs/groupsApi";

// Import Lucide icons to match your form component
import { 
  Users, 
  UserPlus, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Search,
  Settings,
  Flag,
  Crown,
  Clock
} from 'lucide-react';

// 1. CREATE GROUP MODAL
export const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      const newGroup = await createGroup(formData);
      onGroupCreated(newGroup);
      onClose();
      
    } catch (error) {
      alert("Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Group"
      size="medium"
    >
      <DynamicForm
        fields={createGroupFields}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitText="Create Group"
        loading={loading}
        validationRules={createGroupValidation}
        icon={Users}
        showHeader={false}
        initialData={{ type: 'Public' }}
      />
    </Modal>
  );
};

// 2. INVITE FRIENDS MODAL
export const InviteFriendsModal = ({ isOpen, onClose, group, friends, onInvitesSent }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFriendToggle = (friendId) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSubmit = async (formData) => {
    if (selectedFriends.length === 0) {
      alert("Please select at least one friend to invite.");
      return;
    }

    try {
      setLoading(true);
      
      const result = await inviteFriendsToGroup(group.id, {
        friendIds: selectedFriends,
        message: formData.message?.trim() || ""
      });

      let alertMessage = `Invitations sent!\n`;
      if (result.totalSuccessful > 0) {
        alertMessage += `✅ ${result.totalSuccessful} sent successfully\n`;
      }
      if (result.totalFailed > 0) {
        alertMessage += `❌ ${result.totalFailed} failed\n`;
      }

      alert(alertMessage);
      onInvitesSent();
      onClose();
      
    } catch (error) {
      alert("Failed to send invitations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invite Friends to ${group?.name}`}
      size="large"
    >
      <div style={{ padding: '20px' }}>
        {/* Search Friends */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search 
              size={20} 
              style={{
                position: 'absolute',
                top: '50%',
                left: '16px',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}
            />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '15px',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <span>{selectedFriends.length} of {filteredFriends.length} selected</span>
            <button 
              type="button"
              onClick={() => setSelectedFriends(
                selectedFriends.length === filteredFriends.length 
                  ? [] 
                  : filteredFriends.map(f => f.id)
              )}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {selectedFriends.length === filteredFriends.length ? "Deselect All" : "Select All"}
            </button>
          </div>
        </div>

        {/* Friends List */}
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto',
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
          borderRadius: '12px'
        }}>
          {filteredFriends.length === 0 ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#6b7280' 
            }}>
              {searchTerm ? "No friends found" : "No friends to invite"}
            </div>
          ) : (
            filteredFriends.map(friend => (
              <div 
                key={friend.id}
                onClick={() => handleFriendToggle(friend.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  backgroundColor: selectedFriends.includes(friend.id) ? '#eff6ff' : 'white',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: `2px solid ${selectedFriends.includes(friend.id) ? '#3b82f6' : '#d1d5db'}`,
                  backgroundColor: selectedFriends.includes(friend.id) ? '#3b82f6' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedFriends.includes(friend.id) && (
                    <CheckCircle size={12} style={{ color: 'white' }} />
                  )}
                </div>
                <img 
                  src={friend.profilePic || "https://via.placeholder.com/40"} 
                  alt={friend.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <div style={{ fontWeight: '500', color: '#1f2937' }}>
                    {friend.name}
                  </div>
                  {friend.university && (
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>
                      {friend.university}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form for optional message */}
        <DynamicForm
          fields={inviteFriendsFields}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitText={`Invite ${selectedFriends.length} Friend${selectedFriends.length !== 1 ? 's' : ''}`}
          loading={loading}
          validationRules={inviteFriendsValidation}
          icon={UserPlus}
          showHeader={false}
        />
      </div>
    </Modal>
  );
};

// 3. GROUP INVITATIONS MODAL
export const GroupInvitationsModal = ({ isOpen, onClose, invitations, onInvitationResponded }) => {
  const [processingInvitation, setProcessingInvitation] = useState(null);

  const handleInvitationResponse = async (invitationId, response) => {
    try {
      setProcessingInvitation(invitationId);
      
      await respondToGroupInvitation(invitationId, {
        response: response
      });

      onInvitationResponded();
      
    } catch (error) {
      alert("Failed to respond to invitation. Please try again.");
    } finally {
      setProcessingInvitation(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Group Invitations (${invitations.length})`}
      size="large"
    >
      <div style={{ padding: '20px' }}>
        {invitations.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280'
          }}>
            <Mail size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>No pending group invitations</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {invitations.map(invitation => {
              const isProcessing = processingInvitation === invitation.id;
              const daysLeft = invitation.daysUntilExpiry || 0;
              
              return (
                <div key={invitation.id} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: 'white'
                }}>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <img 
                      src={invitation.group.img || "https://via.placeholder.com/60"} 
                      alt={invitation.group.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
                        {invitation.group.name}
                      </h4>
                      <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>
                        Invited by {invitation.inviter.name}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6b7280' }}>
                        <span>
                          <RealTimeTimestamp createdAt={invitation.createdAt} />
                        </span>
                        <span style={{ 
                          color: daysLeft <= 3 ? '#ef4444' : '#6b7280'
                        }}>
                          <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {daysLeft <= 0 ? 'Expired' : `${daysLeft} days left`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p style={{ 
                    margin: '0 0 16px 0', 
                    color: '#4b5563',
                    fontSize: '14px'
                  }}>
                    {invitation.group.description}
                  </p>

                  {invitation.message && (
                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      fontSize: '14px',
                      fontStyle: 'italic'
                    }}>
                      "{invitation.message}"
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleInvitationResponse(invitation.id, 'ACCEPTED')}
                      disabled={isProcessing || daysLeft <= 0}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle size={16} />
                      {isProcessing ? "Accepting..." : "Accept"}
                    </button>
                    <button
                      onClick={() => handleInvitationResponse(invitation.id, 'REJECTED')}
                      disabled={isProcessing || daysLeft <= 0}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <XCircle size={16} />
                      {isProcessing ? "Declining..." : "Decline"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

// 4. UPDATE GROUP MODAL
export const UpdateGroupModal = ({ isOpen, onClose, group, onGroupUpdated }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      const updatedGroup = await updateGroup(group.id, formData);
      onGroupUpdated(updatedGroup);
      onClose();
      
    } catch (error) {
      alert("Failed to update group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Group"
      size="medium"
    >
      <DynamicForm
        fields={updateGroupFields}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitText="Save Changes"
        loading={loading}
        validationRules={updateGroupValidation}
        icon={Settings}
        showHeader={false}
        initialData={group}
      />
    </Modal>
  );
};

// 5. REPORT GROUP MODAL
export const ReportGroupModal = ({ isOpen, onClose, group, onReported }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      await reportGroup(group.id, formData);
      alert("Group reported successfully. Thank you for helping keep our community safe.");
      onReported();
      onClose();
      
    } catch (error) {
      alert("Failed to report group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Group"
      size="medium"
    >
      <DynamicForm
        fields={reportGroupFields}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitText="Submit Report"
        loading={loading}
        validationRules={reportGroupValidation}
        icon={Flag}
        showHeader={false}
      />
    </Modal>
  );
};

export default {
  CreateGroupModal,
  InviteFriendsModal,
  GroupInvitationsModal,
  UpdateGroupModal,
  ReportGroupModal
};