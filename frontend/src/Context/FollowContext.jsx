import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { 
  getFriends,
  sendFriendRequest,
  removeFriend
} from '../Api/CommunityAPIs/friendsApi';

const FollowContext = createContext();

export const useFollow = () => {
  const context = useContext(FollowContext);
  if (!context) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
};

export const FollowProvider = ({ children }) => {
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authData } = useContext(AuthContext);

  // Load following list
  const loadFollowing = async () => {
    if (!authData?.id) return;

    try {
      setLoading(true);
      const friends = await getFriends();
      setFollowingList(friends);
    } catch (error) {
      console.error('Failed to load following list:', error);
      setFollowingList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowing();
  }, [authData?.id]);

  // Follow user
  const follow = async (user) => {
    try {
      await sendFriendRequest(user.id);
      setFollowingList(prev => [...prev, user]);
    } catch (error) {
      console.error('Failed to follow user:', error);
      throw error;
    }
  };

  // Unfollow user
  const unfollow = async (userId) => {
    try {
      await removeFriend(userId);
      setFollowingList(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      throw error;
    }
  };

  // Check if following
  const isFollowing = (userId) => {
    return followingList.some(user => user.id === userId);
  };

  const value = {
    followingList,
    loading,
    follow,
    unfollow,
    isFollowing
  };

  return (
    <FollowContext.Provider value={value}>
      {children}
    </FollowContext.Provider>
  );
};