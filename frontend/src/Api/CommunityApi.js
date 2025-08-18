// CommunityApi.js  Endpoints
export const baseUrl = 'http://localhost:8080/api';

// Auth APIs (existing)
export const LOGIN = `${baseUrl}/login`;

// User APIs
export const GET_USER_PROFILE = (userId) => `${baseUrl}/users/profile/${userId}`;
export const UPDATE_USER_PROFILE = `${baseUrl}/users/profile`;
export const SEARCH_USERS = `${baseUrl}/users/search`;
export const UPLOAD_AVATAR = `${baseUrl}/users/upload-avatar`;
export const REPORT_USER = (userId) => `${baseUrl}/users/report/${userId}`;

// Friends APIs
export const GET_FRIENDS = `${baseUrl}/friends`;
export const GET_FRIEND_SUGGESTIONS = `${baseUrl}/friends/suggestions`;
export const GET_FRIEND_REQUESTS = `${baseUrl}/friends/requests`;
export const SEND_FRIEND_REQUEST = (userId) => `${baseUrl}/friends/request/${userId}`;
export const ACCEPT_FRIEND_REQUEST = (userId) => `${baseUrl}/friends/accept/${userId}`;
export const REJECT_FRIEND_REQUEST = (userId) => `${baseUrl}/friends/reject/${userId}`;
export const REMOVE_FRIEND = (userId) => `${baseUrl}/friends/remove/${userId}`;
export const GET_FRIENDSHIP_STATUS = (userId) => `${baseUrl}/friends/status/${userId}`;
export const GET_FRIENDS_ACTIVITIES = `${baseUrl}/friends/activities`;
export const DISMISS_SUGGESTION = (userId) => `${baseUrl}/friends/dismiss-suggestion/${userId}`;

// Posts APIs
export const GET_FEED = `${baseUrl}/community/posts/feed`;
export const GET_USER_POSTS = (userId) => `${baseUrl}/community/posts/user/${userId}`;
export const CREATE_POST = `${baseUrl}/community/posts`;
export const TOGGLE_POST_LIKE = (postId) => `${baseUrl}/community/posts/${postId}/like`;
export const SAVE_POST = (postId) => `${baseUrl}/community/posts/${postId}/save`;
export const UNSAVE_POST = (postId) => `${baseUrl}/community/posts/${postId}/save`;
export const GET_SAVED_POSTS = `${baseUrl}/community/posts/saved`;
export const GET_POST_COMMENTS = (postId) => `${baseUrl}/community/posts/${postId}/comments`;
export const CREATE_COMMENT = (postId) => `${baseUrl}/community/posts/${postId}/comments`;

// Groups APIs - EXISTING
export const GET_ALL_GROUPS = `${baseUrl}/groups`;
export const GET_MY_GROUPS = `${baseUrl}/groups/my-groups`;
export const GET_GROUP_DETAILS = (groupId) => `${baseUrl}/groups/${groupId}`;
export const CREATE_GROUP = `${baseUrl}/groups`;
export const UPDATE_GROUP = (groupId) => `${baseUrl}/groups/${groupId}`;
export const DELETE_GROUP = (groupId) => `${baseUrl}/groups/${groupId}`;
export const JOIN_GROUP = (groupId) => `${baseUrl}/groups/${groupId}/join`;
export const LEAVE_GROUP = (groupId) => `${baseUrl}/groups/${groupId}/leave`;
export const GET_GROUP_MEMBERS = (groupId) => `${baseUrl}/groups/${groupId}/members`;
export const PROMOTE_MEMBER = (groupId) => `${baseUrl}/groups/${groupId}/promote`;
export const REMOVE_MEMBER = (groupId) => `${baseUrl}/groups/${groupId}/remove`;
export const GET_GROUP_POSTS = (groupId) => `${baseUrl}/groups/${groupId}/posts`;
export const GET_GROUP_FEED = `${baseUrl}/groups/feed`;
export const SEARCH_GROUPS = `${baseUrl}/groups/search`;
export const GET_RECOMMENDED_GROUPS = `${baseUrl}/groups/recommendations`;
export const INVITE_FRIENDS_TO_GROUP = (groupId) => `${baseUrl}/groups/${groupId}/invite-friends`;
export const GET_GROUP_INVITATIONS = `${baseUrl}/groups/invitations`;
export const RESPOND_TO_GROUP_INVITATION = (invitationId) => `${baseUrl}/groups/invitations/${invitationId}/respond`;
export const GET_GROUP_STATS = `${baseUrl}/groups/stats`;
export const GET_GROUP_CATEGORIES = `${baseUrl}/groups/categories`;
export const GET_GROUP_ACTIVITY = (groupId) => `${baseUrl}/groups/${groupId}/activity`;
export const GET_TRENDING_GROUPS = `${baseUrl}/groups/trending`;
export const PIN_POST = (groupId, postId) => `${baseUrl}/groups/${groupId}/pin-post/${postId}`;
export const UNPIN_POST = (groupId, postId) => `${baseUrl}/groups/${groupId}/pin-post/${postId}`;
export const GET_PINNED_POSTS = (groupId) => `${baseUrl}/groups/${groupId}/pinned-posts`;
export const UPDATE_GROUP_SETTINGS = (groupId) => `${baseUrl}/groups/${groupId}/settings`;
export const REPORT_GROUP = (groupId) => `${baseUrl}/groups/${groupId}/report`;

// Jobs APIs
export const GET_ALL_JOBS = `${baseUrl}/jobs`;
export const GET_MY_POSTED_JOBS = `${baseUrl}/jobs/my-posts`;
export const GET_APPLIED_JOBS = `${baseUrl}/jobs/applied`;
export const GET_SAVED_JOBS = `${baseUrl}/jobs/saved`;
export const CREATE_JOB = `${baseUrl}/jobs`;
export const UPDATE_JOB = (jobId) => `${baseUrl}/jobs/${jobId}`;
export const DELETE_JOB = (jobId) => `${baseUrl}/jobs/${jobId}`;
export const APPLY_TO_JOB = (jobId) => `${baseUrl}/jobs/${jobId}/apply`;
export const SAVE_JOB = (jobId) => `${baseUrl}/jobs/${jobId}/save`;
export const UNSAVE_JOB = (jobId) => `${baseUrl}/jobs/${jobId}/save`;
export const GET_JOB_APPLICATIONS = (jobId) => `${baseUrl}/jobs/${jobId}/applications`;

// CV APIs
export const GET_CV = `${baseUrl}/cv`;
export const SAVE_CV = `${baseUrl}/cv`;
export const DELETE_CV = `${baseUrl}/cv`;
export const UPLOAD_CV = `${baseUrl}/cv/upload`;
export const DOWNLOAD_CV = `${baseUrl}/cv/download`;
export const AI_EXTRACT_CV = `${baseUrl}/cv/ai-extract`;

// Stories APIs
export const GET_STORIES_FEED = `${baseUrl}/community/stories/feed`;
export const CREATE_STORY = `${baseUrl}/community/stories`;
export const GET_USER_STORIES = (userId) => `${baseUrl}/community/stories/user/${userId}`;
export const DELETE_STORY = (storyId) => `${baseUrl}/community/stories/${storyId}`;

// Job Application Management
export const ACCEPT_APPLICATION = (applicationId) => `${baseUrl}/jobs/applications/${applicationId}/accept`;
export const REJECT_APPLICATION = (applicationId) => `${baseUrl}/jobs/applications/${applicationId}/reject`;
export const DOWNLOAD_APPLICANT_CV = (applicantId) => `${baseUrl}/jobs/cv/download/${applicantId}`;

// Notification APIs (for future implementation)
export const GET_NOTIFICATIONS = `${baseUrl}/notifications`;
export const SEND_NOTIFICATION = `${baseUrl}/notifications/send`;
export const MARK_NOTIFICATION_READ = (notificationId) => `${baseUrl}/notifications/${notificationId}/read`;
export const MARK_ALL_NOTIFICATIONS_READ = `${baseUrl}/notifications/mark-all-read`;
export const GET_NOTIFICATION_COUNT = `${baseUrl}/notifications/count`;

// Real-time WebSocket endpoints (for future implementation)
export const WEBSOCKET_ENDPOINT = `ws://localhost:8080/ws`;
export const WEBSOCKET_GROUPS = '/topic/groups';
export const WEBSOCKET_NOTIFICATIONS = '/topic/notifications';
export const WEBSOCKET_FRIEND_REQUESTS = '/topic/friend-requests';

// Chat APIs (Community Context)
export const COMMUNITY_CHAT_BASE = `${baseUrl}/chat`;

// Community Chat Messages
export const GET_COMMUNITY_CHAT_MESSAGES = (user1, user2) => `${COMMUNITY_CHAT_BASE}/community/${user1}/${user2}`;
export const GET_COMMUNITY_CONVERSATIONS = (userId) => `${COMMUNITY_CHAT_BASE}/conversations/${userId}?context=community`;
export const GET_COMMUNITY_UNREAD_COUNT = (userId) => `${COMMUNITY_CHAT_BASE}/unread/${userId}?context=community`;
export const MARK_COMMUNITY_MESSAGES_READ = `${COMMUNITY_CHAT_BASE}/mark-read`;
export const GET_USER_CHAT_CONTEXTS = (userId) => `${COMMUNITY_CHAT_BASE}/contexts/${userId}`;

// WebSocket endpoints for community chat
export const COMMUNITY_WEBSOCKET_ENDPOINT = `ws://localhost:8080/ws`;
export const COMMUNITY_CHAT_TOPIC = (userId) => `/topic/messages/community/${userId}`;
export const COMMUNITY_CHAT_SEND = '/app/community.sendMessage';

// Helper function for community chat API calls
export const communityApiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Community API request failed:', error);
    throw error;
  }
};

// Helper function for building query parameters
export const buildQueryParams = (params) => {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      urlParams.append(key, value);
    }
  });
  return urlParams.toString();
};

// API request helpers with error handling
export const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Specialized group search function
export const searchGroupsWithFilters = (searchTerm, filters = {}) => {
  const params = buildQueryParams({
    q: searchTerm,
    type: filters.type || 'all',
    sortBy: filters.sortBy || 'activity',
    category: filters.category,
    page: filters.page || 0,
    size: filters.size || 20
  });
  
  return `${SEARCH_GROUPS}?${params}`;
};

// Group invitation helpers
export const getGroupInvitationsWithStatus = (status = 'PENDING') => {
  return `${GET_GROUP_INVITATIONS}?status=${status}`;
};

export const getGroupActivityWithPagination = (groupId, page = 0, size = 20) => {
  return `${GET_GROUP_ACTIVITY(groupId)}?page=${page}&size=${size}`;
};