import { useEffect, useState } from "react";
import Post from "../../Components/Community/Post";
import { useSavedPosts } from "../../../Context/SavedPostsContext";
import "../../../CSS/Pages/Community/savedPosts.scss";

const SavedPosts = () => {
  const { savedPosts, loading, error, refreshSavedPosts } = useSavedPosts();

  // Refresh saved posts when component mounts
  useEffect(() => {
    refreshSavedPosts();
  }, []);

  if (loading) {
    return (
      <div className="saved-posts-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading saved posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-posts-page">
        <div className="error">
          <div className="error-icon">⚠️</div>
          <h3>Error loading saved posts</h3>
          <p>{error}</p>
          <button onClick={refreshSavedPosts} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-posts-page">
      <div className="saved-posts-header">
        <h1>💾 Saved Posts</h1>
        <p className="posts-count">
          {savedPosts.length} {savedPosts.length === 1 ? 'post' : 'posts'} saved
        </p>
      </div>
      
      {savedPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>No saved posts yet</h3>
          <p>Posts you save will appear here for easy access later.</p>
          <div className="empty-tip">
            <span className="tip-icon">💡</span>
            <span>Tip: Look for the bookmark icon on posts to save them!</span>
          </div>
        </div>
      ) : (
        <div className="saved-posts-list">
          {savedPosts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;