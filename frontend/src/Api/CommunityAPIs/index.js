// src/Api/CommunityAPIs/index.js
// Central export file for all Community API modules

// Import all API modules
import * as authApi from './authApi';
import * as userApi from './communityUserApi';
import * as friendsApi from './friendsApi';
import * as postsApi from './postsApi';
import * as storiesApi from './storiesApi';
import * as groupsApi from './groupsApi';
import * as jobsApi from './jobsApi';
import * as cvApi from './cvApi';
import * as notificationsApi from './notificationsApi';
import * as chatApi from './communityChatApi';

// Export all modules for easy importing
export {
  authApi,
  userApi,
  friendsApi,
  postsApi,
  storiesApi,
  groupsApi,
  jobsApi,
  cvApi,
  notificationsApi,
  chatApi
};

// Export individual functions for direct importing
export * from './authApi';
export * from './communityUserApi';
export * from './friendsApi';
export * from './postsApi';
export * from './storiesApi';
export * from './groupsApi';
export * from './jobsApi';
export * from './cvApi';
export * from './notificationsApi';
export * from './communityChatApi';

// Default export with all APIs organized
export default {
  auth: authApi,
  user: userApi,
  friends: friendsApi,
  posts: postsApi,
  stories: storiesApi,
  groups: groupsApi,
  jobs: jobsApi,
  cv: cvApi,
  notifications: notificationsApi,
  chat: chatApi
};