import React, { useState, useEffect, useContext } from "react";
import Stories from "../../Components/Community/Stories";
import Posts from "../../Components/Community/Posts";
import Share from "../../Components/Community/Share";
import "../../../CSS/Pages/Community/home.scss";
import { useFriends } from "../../../Context/FriendContext";
import { AuthContext } from "../../../Context/AuthContext";

// Import the new clean API function
import { getFeed } from "../../../Api/CommunityAPIs/postsApi";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { friendsList } = useFriends();
  const { authData } = useContext(AuthContext);

  // Fetch posts from backend
  useEffect(() => {
    if (!authData?.id) return;

    async function fetchPosts() {
      try {
        setLoading(true);
        
        // Use the new clean API function
        const postsData = await getFeed();
        setPosts(postsData);
      } catch (error) {
        console.error("Failed to fetch posts", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [authData, friendsList]);

  const handleShare = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  if (loading) {
    return (
      <div className="home">
        <div>Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="home">
      <Stories />
      <Share onShare={handleShare} />
      <Posts posts={posts} />
      {posts.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No posts found. Create your first post!
        </div>
      )}
    </div>
  );
};

export default Home;