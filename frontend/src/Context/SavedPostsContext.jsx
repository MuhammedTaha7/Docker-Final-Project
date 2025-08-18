import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { 
  getSavedPosts,
  savePost as savePostApi,
  unsavePost as unsavePostApi 
} from '../Api/CommunityAPIs/savedPostsApi';

const SavedPostsContext = createContext();

export const useSavedPosts = () => {
  const context = useContext(SavedPostsContext);
  if (!context) {
    throw new Error('useSavedPosts must be used within a SavedPostsProvider');
  }
  return context;
};

export const SavedPostsProvider = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authData } = useContext(AuthContext);

  // Refresh saved posts from backend
  const refreshSavedPosts = async () => {
    if (!authData?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const posts = await getSavedPosts();
      setSavedPosts(posts);
    } catch (err) {
      console.error('Failed to fetch saved posts:', err);
      setError('Failed to load saved posts');
      setSavedPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Save a post
  const savePost = async (post) => {
    if (!authData?.id) return;

    try {
      await savePostApi(post.id);

      // Add to local state immediately for better UX
      setSavedPosts(prev => {
        // Check if already saved to avoid duplicates
        if (prev.some(p => p.id === post.id)) {
          return prev;
        }
        return [post, ...prev];
      });

    } catch (err) {
      console.error('Failed to save post:', err);
      alert('Failed to save post. Please try again.');
    }
  };

  // Unsave a post
  const unsavePost = async (postId) => {
    if (!authData?.id) return;

    try {
      await unsavePostApi(postId);

      // Remove from local state immediately for better UX
      setSavedPosts(prev => prev.filter(post => post.id !== postId));

    } catch (err) {
      console.error('Failed to unsave post:', err);
      alert('Failed to unsave post. Please try again.');
    }
  };

  // Check if a post is saved
  const isPostSaved = (postId) => {
    return savedPosts.some(post => post.id === postId);
  };

  // Load saved posts when user changes
  useEffect(() => {
    if (authData?.id) {
      refreshSavedPosts();
    } else {
      setSavedPosts([]);
    }
  }, [authData]);

  const value = {
    savedPosts,
    loading,
    error,
    savePost,
    unsavePost,
    isPostSaved,
    refreshSavedPosts,
  };

  return (
    <SavedPostsContext.Provider value={value}>
      {children}
    </SavedPostsContext.Provider>
  );
};