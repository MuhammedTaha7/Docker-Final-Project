import React, { useState, useEffect, useContext } from "react";
import "../../../CSS/Components/Community/comments.scss";
import { AuthContext } from "../../../Context/AuthContext";
import RealTimeTimestamp from "../../Components/Common/RealTimeTimestamp";

import { getPostComments, createComment } from "../../../Api/CommunityAPIs/postsApi";

const Comments = ({ postId, onCommentsUpdate }) => {
  const { authData } = useContext(AuthContext);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const fetchComments = async () => {
      try {
        setLoading(true);
        const commentsData = await getPostComments(postId);
        setComments(commentsData);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Notify parent when comments change
  useEffect(() => {
    if (onCommentsUpdate) {
      onCommentsUpdate(comments);
    }
  }, [comments, onCommentsUpdate]);

  const handleSend = async () => {
    if (newComment.trim() === "") return;
    if (!authData) {
      alert("Please login to comment");
      return;
    }

    const commentPayload = {
      userId: authData.id,
      username: authData.username || authData.name || "User",
      text: newComment.trim(),
    };

    try {
      setLoading(true);
      const response = await createComment(postId, commentPayload);
      
      // Add the new comment to local state immediately for better UX
      const newCommentWithTimestamp = {
        id: response.id || `temp_${Date.now()}`,
        text: newComment.trim(),
        username: authData.username || authData.name || "User",
        profilePicture: authData.profilePic,
        createdAt: new Date().toISOString(), // Add current timestamp
        userId: authData.id
      };

      setComments(prevComments => [...prevComments, newCommentWithTimestamp]);
      setNewComment("");

      // Optionally refresh comments from server to get proper data
      setTimeout(async () => {
        try {
          const updatedComments = await getPostComments(postId);
          setComments(updatedComments);
        } catch (error) {
          console.error('Failed to refresh comments:', error);
        }
      }, 1000);

    } catch (err) {
      console.error("Failed to create comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="comments">
      <div className="write">
        <img
          src={authData?.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (authData?.name || "user")}
          alt="User"
          onError={(e) => {
            e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (authData?.name || "user");
          }}
        />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button 
          onClick={handleSend}
          disabled={loading || !newComment.trim()}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
      
      {loading && comments.length === 0 && (
        <p className="loading">Loading comments...</p>
      )}
      
      {!loading && comments.length === 0 && (
        <p className="no-comments">No comments yet. Be the first to comment!</p>
      )}
      
      {comments.map((comment, idx) => (
        <div className="comment" key={comment.id || `comment_${idx}`}>
          <img
            src={comment.profilePicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (comment.username || "user")}
            alt={comment.username || "User"}
            onError={(e) => {
              e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (comment.username || "user");
            }}
          />
          <div className="info">
            <span className="username">{comment.username || "User"}</span>
            <p className="comment-text">{comment.text}</p>
          </div>
          <div className="comment-meta">
            <RealTimeTimestamp 
              createdAt={comment.createdAt} 
              className="comment-date"
              showTooltip={true}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;