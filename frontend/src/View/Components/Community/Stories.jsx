import React, { useState, useEffect } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { useFriends } from "../../../Context/FriendContext";
import "../../../CSS/Components/Community/stories.scss";

// Import the new clean API functions
import { getStoriesFeed, createStory } from "../../../Api/CommunityAPIs/storiesApi";

const Stories = () => {
  const [openUserIndex, setOpenUserIndex] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [showAddStory, setShowAddStory] = useState(false);
  const [userStories, setUserStories] = useState([]);
  const { friendsList } = useFriends();
  const { authData } = useAuth();

  const [storyText, setStoryText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const userId = authData?.id;

  // Load user stories when component mounts or user changes
  useEffect(() => {
    if (!userId) return;
    loadStories();
  }, [userId, friendsList]);

  const loadStories = async () => {
    try {
      const friendIds = friendsList.map((friend) => friend.id);
      
      const response = await getStoriesFeed(userId, friendIds);
      const storiesData = response.stories || [];

      // Flatten the grouped stories into individual story objects
      const flattenedStories = [];
      storiesData.forEach((userGroup) => {
        userGroup.stories.forEach((story) => {
          flattenedStories.push({
            ...story,
            userId: userGroup.userId,
            name: userGroup.name,
            profilePic: userGroup.profilePic,
          });
        });
      });

      setUserStories(flattenedStories);
    } catch (err) {
      console.error("Failed to fetch stories:", err);
      setUserStories([]);
    }
  };

  // Filter stories to show only current user + friends' stories
  const allStories = userStories.filter((story) => {
    if (story.userId === userId) return true;
    return friendsList.some((friend) => friend.id === story.userId);
  });

  // Group stories by user
  const groupedStories = allStories.reduce((acc, story) => {
    const existingUser = acc.find((user) => user.userId === story.userId);
    if (existingUser) {
      existingUser.stories.push(story);
    } else {
      acc.push({
        userId: story.userId,
        name: story.name,
        profilePic: story.profilePic,
        stories: [story],
      });
    }
    return acc;
  }, []);

  // Separate current user and friends' stories
  const currentUserGroup = groupedStories.find(
    (user) => user.userId === userId
  );
  const friendsStories = groupedStories.filter(
    (user) => user.userId !== userId
  );

  // Final display array
  const displayStories = [];
  if (currentUserGroup) {
    displayStories.push(currentUserGroup);
  }
  displayStories.push(...friendsStories);

  // Handlers
  const handleOpenStory = (userIndex) => {
    setOpenUserIndex(userIndex);
    setCurrentStoryIndex(0);
    setStoryProgress(0);
  };

  const handleOpenCurrentUserStory = () => {
    if (currentUserGroup?.stories.length > 0) {
      setOpenUserIndex(0);
      setCurrentStoryIndex(0);
      setStoryProgress(0);
    } else {
      alert("You don't have any stories yet. Click the + button to create one!");
    }
  };

  const handleAddStoryClick = () => {
    handleAddStory();
  };

  const handleClose = () => {
    setOpenUserIndex(null);
    setCurrentStoryIndex(0);
    setStoryProgress(0);
  };

  const handleNextUser = () => {
    if (openUserIndex < displayStories.length - 1) {
      setOpenUserIndex(openUserIndex + 1);
      setCurrentStoryIndex(0);
      setStoryProgress(0);
    } else {
      handleClose();
    }
  };

  const handlePrevUser = () => {
    if (openUserIndex > 0) {
      setOpenUserIndex(openUserIndex - 1);
      setCurrentStoryIndex(0);
      setStoryProgress(0);
    }
  };

  const handleNextStory = () => {
    const currentUser = displayStories[openUserIndex];
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setStoryProgress(0);
    } else {
      handleNextUser();
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setStoryProgress(0);
    } else if (openUserIndex > 0) {
      setOpenUserIndex(openUserIndex - 1);
      const prevUser = displayStories[openUserIndex - 1];
      setCurrentStoryIndex(prevUser.stories.length - 1);
      setStoryProgress(0);
    }
  };

  const handleStoryBarClick = (storyIndex) => {
    setCurrentStoryIndex(storyIndex);
    setStoryProgress(0);
  };

  const handleAddStory = () => {
    setShowAddStory(true);
    setSelectedFile(null);
    setStoryText("");
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleStoryUpload = async () => {
    if (!selectedFile && !storyText.trim()) return;

    setIsUploading(true);
    try {
      const storyData = {
        name: authData.name,
        profilePic: authData.profilePic || "",
        text: storyText.trim(),
        img: selectedFile || null
      };

      await createStory(storyData);

      // After successful upload, reload stories from the server
      await loadStories();

      setShowAddStory(false);
      setStoryText("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading story:", error);
      alert("Failed to upload story. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelAddStory = () => {
    setShowAddStory(false);
    setStoryText("");
    setSelectedFile(null);
  };

  const canShare = (selectedFile || storyText.trim()) && !isUploading;

  // Auto-advance story logic
  useEffect(() => {
    if (openUserIndex === null || !displayStories[openUserIndex]) return;

    const currentUser = displayStories[openUserIndex];
    const currentStory = currentUser.stories[currentStoryIndex];

    let duration = 8000; // Default 8s for images

    const isVideo =
      currentStory.type === "video" ||
      (currentStory.img &&
        (currentStory.img.includes(".mp4") ||
          currentStory.img.includes(".webm") ||
          currentStory.img.includes(".ogg")));

    if (isVideo) {
      const videoElement = document.querySelector(".story-full-video");
      if (videoElement && videoElement.duration && videoElement.duration > 0) {
        duration = videoElement.duration * 1000;
      } else {
        duration = 15000;
      }
    }

    const timer = setTimeout(() => {
      handleNextStory();
    }, duration);

    const progressTimer = setInterval(() => {
      setStoryProgress((prev) => {
        const increment = 100 / (duration / 100);
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [openUserIndex, currentStoryIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (openUserIndex === null) return;
      if (e.key === "ArrowLeft") handlePrevStory();
      else if (e.key === "ArrowRight") handleNextStory();
      else if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [openUserIndex, currentStoryIndex]);

  const renderStoryMedia = (story) => {
    const isVideo =
      story.type === "video" ||
      (story.img &&
        (story.img.includes(".mp4") ||
          story.img.includes(".webm") ||
          story.img.includes(".ogg") ||
          story.img.includes(".mov")));

    // If it's just text or no media
    if (story.type === "text" || (!story.img && story.text)) {
      return (
        <div className="story-text-content">
          <p>{story.text}</p>
        </div>
      );
    }

    // If we have media (image or video)
    if (story.img) {
      const mediaElement = isVideo ? (
        <video
          className="story-full-video"
          src={story.img}
          autoPlay
          muted
          loop
          onError={(e) => {
            console.error("Video failed to load:", story.img);
          }}
        />
      ) : (
        <img
          src={story.img}
          alt="Story"
          className="story-full-img"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x600/cccccc/666666?text=Story";
          }}
        />
      );

      return (
        <div className="story-media-container">
          {mediaElement}
          {story.text && (
            <div className="story-text-overlay">
              <p>{story.text}</p>
            </div>
          )}
        </div>
      );
    }

    // Fallback if no media
    return (
      <div className="story-text-content">
        <p>{story.text || "Story content unavailable"}</p>
      </div>
    );
  };

  return (
    <div className="stories">
      <div
        className="story"
        style={{
          border:
            currentUserGroup?.stories.length > 0
              ? "3px solid #4CAF50"
              : "1px solid #ddd",
        }}
      >
        <img
          src={authData?.profilePic || authData?.profile_pic || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (authData?.name || "default")}
          alt={authData?.name || "User"}
          onClick={handleOpenCurrentUserStory}
          style={{ cursor: "pointer" }}
          onError={(e) => {
            e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (authData?.name || "default");
          }}
        />
        <span
          onClick={handleOpenCurrentUserStory}
          style={{ cursor: "pointer" }}
        >
          {authData?.name}{" "}
          {currentUserGroup?.stories.length > 0 &&
            `(${currentUserGroup.stories.length})`}
        </span>
        <button onClick={handleAddStoryClick}>+</button>
      </div>

      {friendsStories.map((user, index) => {
        const displayIndex = currentUserGroup ? index + 1 : index;
        return (
          <div
            className="story"
            key={user.userId}
            onClick={() => handleOpenStory(displayIndex)}
          >
            <img 
              src={user.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user.name || "user")}
              alt={user.name}
              onError={(e) => {
                e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (user.name || "user");
              }}
            />
            <span>{user.name}</span>
            {user.stories.length > 1 && (
              <div className="story-count">{user.stories.length}</div>
            )}
          </div>
        );
      })}

      {friendsStories.length === 0 && (
        <div className="no-stories">
          <p>No stories from friends to show</p>
        </div>
      )}

      {/* Story Overlay */}
      {openUserIndex !== null && displayStories[openUserIndex] && (
        <div className="story-overlay">
          <div className="story-header">
            <div className="progress-bars">
              {displayStories[openUserIndex].stories.map((_, index) => (
                <div
                  key={index}
                  className="progress-bar"
                  onClick={() => handleStoryBarClick(index)}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width:
                        index < currentStoryIndex
                          ? "100%"
                          : index === currentStoryIndex
                          ? `${storyProgress}%`
                          : "0%",
                    }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="story-info">
              <img
                src={displayStories[openUserIndex].profilePic}
                alt="Profile"
                className="story-profile-pic"
                onError={(e) => {
                  e.target.src = displayStories[openUserIndex].stories[0].img;
                }}
              />
              <span className="story-username">
                {displayStories[openUserIndex].name}
              </span>
              <span className="story-time">
                {displayStories[openUserIndex].stories[currentStoryIndex]
                  .time || "2h ago"}
              </span>
            </div>
            <button className="close-btn" onClick={handleClose}>
              ×
            </button>
          </div>
          <div className="overlay-content">
            {(openUserIndex > 0 || currentStoryIndex > 0) && (
              <button className="nav left" onClick={handlePrevStory}>
                ‹
              </button>
            )}
            {renderStoryMedia(
              displayStories[openUserIndex].stories[currentStoryIndex]
            )}
            {(openUserIndex < displayStories.length - 1 ||
              currentStoryIndex <
                displayStories[openUserIndex].stories.length - 1) && (
              <button className="nav right" onClick={handleNextStory}>
                ›
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Story Modal */}
      {showAddStory && (
        <div className="add-story-overlay">
          <div className="add-story-modal">
            <div className="add-story-header">
              <h3>Add to Your Story</h3>
              <button className="close-btn" onClick={handleCancelAddStory}>
                ×
              </button>
            </div>
            <div className="add-story-content">
              <div className="upload-area">
                <input
                  type="file"
                  id="story-upload"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="story-upload"
                  className={`upload-button ${selectedFile ? "has-file" : ""}`}
                >
                  {selectedFile ? (
                    <div className="file-preview">
                      <div className="file-info">
                        <div className="upload-icon">✓</div>
                        <p>{selectedFile.name}</p>
                        <span>File selected</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="upload-icon">📷</div>
                      <p>Choose Photo or Video</p>
                      <span>Select a file from your device</span>
                    </>
                  )}
                </label>

                {/* Text Input */}
                <div className="text-input">
                  <textarea
                    placeholder="Write something to go with your story..."
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    maxLength="280"
                    rows="4"
                    className="story-textarea"
                  ></textarea>
                  <p className="char-count">{storyText.length}/280</p>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={handleCancelAddStory}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  className={`share-button ${!canShare ? "disabled" : ""} ${
                    isUploading ? "loading" : ""
                  }`}
                  onClick={handleStoryUpload}
                  disabled={!canShare}
                >
                  {isUploading ? (
                    <span className="loading-content">
                      <span className="spinner"></span>
                      Sharing...
                    </span>
                  ) : (
                    "Share Story"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;