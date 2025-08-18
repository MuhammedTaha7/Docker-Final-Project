import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { 
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend
} from '../Api/CommunityAPIs/friendsApi';

const FriendContext = createContext();

export const useFriends = () => {
  const context = useContext(FriendContext);
  if (!context) {
    throw new Error('useFriends must be used within a FriendProvider');
  }
  return context;
};

export const FriendProvider = ({ children }) => {
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const { authData } = useContext(AuthContext);

  const loadFriends = useCallback(async (force = false) => {
    if (!authData?.id) {
      setFriendsList([]);
      return;
    }

    const now = Date.now();
    if (!force && lastRefresh && (now - lastRefresh < 2000)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const friends = await getFriends();
      setFriendsList(friends);
      setLastRefresh(now);
    } catch (error) {
      console.error('Failed to load friends:', error);
      setError('Failed to load friends');
      setFriendsList([]);
    } finally {
      setLoading(false);
    }
  }, [authData?.id, lastRefresh]);

  useEffect(() => {
    if (authData?.id) {
      loadFriends(true);
    }
  }, [authData?.id]);

  const sendFriendRequestToUser = useCallback(async (userId) => {
    try {
      await sendFriendRequest(userId);
      return true;
    } catch (error) {
      console.error('Failed to send friend request:', error);
      throw error;
    }
  }, []);

  const acceptFriendRequestFromUser = useCallback(async (userId) => {
    try {
      await acceptFriendRequest(userId);
      await loadFriends(true);
      return true;
    } catch (error) {
      console.error('Failed to accept friend request:', error);
      throw error;
    }
  }, [loadFriends]);

  const rejectFriendRequestFromUser = useCallback(async (userId) => {
    try {
      await rejectFriendRequest(userId);
      return true;
    } catch (error) {
      console.error('Failed to reject friend request:', error);
      throw error;
    }
  }, []);

  const removeFriendFromList = useCallback(async (userId) => {
    const originalFriendsList = [...friendsList];
    
    try {
      // Optimistic update
      setFriendsList(prev => prev.filter(friend => friend.id !== userId));
      
      // API call
      await removeFriend(userId);
      
      // Refresh from server
      setTimeout(async () => {
        await loadFriends(true);
      }, 1500);
      
      return true;
    } catch (error) {
      console.error('Failed to remove friend:', error);
      setFriendsList(originalFriendsList);
      
      setTimeout(() => {
        loadFriends(true);
      }, 500);
      
      throw error;
    }
  }, [friendsList, loadFriends]);

  const addFriend = useCallback((friendData) => {
    setFriendsList(prev => {
      const exists = prev.some(friend => friend.id === friendData.id);
      if (exists) {
        return prev;
      }
      return [...prev, friendData];
    });
  }, []);

  const removeFriendLocal = useCallback((friendId) => {
    setFriendsList(prev => prev.filter(friend => friend.id !== friendId));
  }, []);

  const isFriend = useCallback((userId) => {
    if (!userId || !friendsList) {
      return false;
    }
    return friendsList.some(friend => friend.id === userId);
  }, [friendsList]);

  const refreshFriends = useCallback(() => {
    loadFriends(true);
  }, [loadFriends]);

  const getFriendCount = useCallback(() => {
    return friendsList.length;
  }, [friendsList.length]);

  const getFriendById = useCallback((userId) => {
    return friendsList.find(friend => friend.id === userId) || null;
  }, [friendsList]);

  const value = {
    friendsList,
    loading,
    error,
    addFriend,
    removeFriend: removeFriendLocal,
    removeFriendFromList,
    sendFriendRequest: sendFriendRequestToUser,
    acceptFriendRequest: acceptFriendRequestFromUser,
    rejectFriendRequest: rejectFriendRequestFromUser,
    isFriend,
    refreshFriends,
    getFriendCount,
    getFriendById,
    lastRefresh
  };

  return (
    <FriendContext.Provider value={value}>
      {children}
    </FriendContext.Provider>
  );
};