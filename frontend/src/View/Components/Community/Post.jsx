import "../../../CSS/Components/Community/post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Link, useNavigate } from "react-router-dom";
import Comments from "./Comments";
import RealTimeTimestamp from "../../Components/Common/RealTimeTimestamp";
import { useState, useEffect, useContext } from "react";
import { useSavedPosts } from "../../../Context/SavedPostsContext";
import { AuthContext } from "../../../Context/AuthContext";

// Import the clean API functions
import { getPostComments, togglePostLike } from "../../../Api/CommunityAPIs/postsApi";

const Post = ({ post }) => {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const { savePost, unsavePost, isPostSaved } = useSavedPosts();
  const saved = isPostSaved(post.id);

  // Fetch actual comment count from server
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const commentsData = await getPostComments(post.id);
        setCommentsCount(commentsData.length || 0);
      } catch (err) {
        // Handle error silently - fallback to post.comments length
        setCommentsCount(post.comments?.length || 0);
      }
    };

    fetchCommentCount();
  }, [post.id, post.comments]);

  // Init liked status on mount or post changes
  useEffect(() => {
    if (authData && post.likes?.includes(authData.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    setLikeCount(post.likes?.length || 0);
  }, [authData, post.likes]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${post.name}'s post`,
        text: post.desc,
        url: window.location.href
      }).catch(() => {
        // Handle error silently
      });
    } else {
      // Fallback for browsers without native share
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Post link copied to clipboard!');
      }).catch(() => {
        alert('Share feature not available');
      });
    }
    
    setMenuOpen(false);
  };

  const toggleSave = async () => {
    if (savingPost) return; // Prevent double-clicks
    
    try {
      setSavingPost(true);
      
      if (saved) {
        await unsavePost(post.id);
      } else {
        await savePost(post);
      }
      
      setMenuOpen(false);
    } catch (error) {
      // Handle error silently or show user-friendly message
    } finally {
      setSavingPost(false);
    }
  };

  const handleGroupClick = () => {
    if (post.groupId) {
      navigate(`/groups/${post.groupId}`);
    }
  };

  const handleLike = async () => {
    if (!authData) return;

    try {
      const response = await togglePostLike(post.id, authData.id);
      
      const updatedLikes = response.likes || [];
      setLiked(updatedLikes.includes(authData.id));
      setLikeCount(updatedLikes.length);
    } catch (err) {
      // Handle error silently
    }
  };

  const onCommentsUpdate = (newComments) => {
    setCommentsCount(newComments.length);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="post">
      <div className="postContainer">
        <div className="user">
          <div className="userInfo">
            <img 
              src={post.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (post.name || "user")}
              alt={post.name}
              onError={(e) => {
                e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (post.name || "user");
              }}
            />
            <div className="details">
              <Link
                to={`/community/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">
                  {post.name}
                  {post.role && <span className="role"> - {post.role}</span>}
                </span>
              </Link>
              {post.groupName && (
                <div className="groupInfo">
                  <span
                    className="groupName clickable"
                    onClick={handleGroupClick}
                  >
                    📍 {post.groupName}
                  </span>
                </div>
              )}
              <RealTimeTimestamp 
                createdAt={post.createdAt} 
                className="date"
                showTooltip={true}
              />
            </div>
          </div>

          <div className="more">
            <MoreHorizIcon
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              style={{ cursor: "pointer" }}
            />

            {menuOpen && (
              <div className="dropdownMenu" onClick={(e) => e.stopPropagation()}>
                <div 
                  className={`menuItem ${savingPost ? 'disabled' : ''}`} 
                  onClick={toggleSave}
                >
                  {savingPost ? (
                    <>
                      <BookmarkBorderIcon
                        style={{ fontSize: "18px", marginRight: "5px" }}
                      />
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <BookmarkIcon
                        style={{ fontSize: "18px", marginRight: "5px", color: "#1877f2" }}
                      />
                      Unsave
                    </>
                  ) : (
                    <>
                      <BookmarkBorderIcon
                        style={{ fontSize: "18px", marginRight: "5px" }}
                      />
                      Save
                    </>
                  )}
                </div>
                
                <div className="menuItem" onClick={handleShare}>
                  <ShareOutlinedIcon
                    style={{ fontSize: "18px", marginRight: "5px" }}
                  />
                  Share
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="content">
          <p>{post.desc}</p>
          {post.img && <img src={post.img} alt="" />}
          {post.file && (
            <div className="sharedFile">
              <a
                href={post.file.url}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                📎 {post.file.name}
              </a>
            </div>
          )}
        </div>

        <div className="info">
          <div className="item" onClick={handleLike}>
            {liked ? (
              <FavoriteOutlinedIcon style={{ color: "red" }} />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </div>

          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentsCount} {commentsCount === 1 ? "Comment" : "Comments"}
          </div>
        </div>

        {commentOpen && <Comments postId={post.id} onCommentsUpdate={onCommentsUpdate} />}
      </div>
    </div>
  );
};

export default Post;