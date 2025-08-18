import React, { useState, useContext } from "react";
import "../../../CSS/Components/Community/share.scss";
import ImageIcon from "../../../Assets/img.png";
import MapIcon from "../../../Assets/map.png";
import { AuthContext } from "../../../Context/AuthContext";

// Import the new clean API function
import { createPost } from "../../../Api/CommunityAPIs/postsApi";
import { uploadImage, processFileForPost, formatFileSize, validateFileType } from "../../../Api/Common/fileUploadApi";

const Share = ({ onShare, groupId = null, groupName = null }) => {
  const { authData } = useContext(AuthContext);

  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setImageFile(selected);
      setImagePreview(URL.createObjectURL(selected));
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      // Validate file type
      if (!validateFileType(selected, 'file')) {
        alert('File type not supported. Please select PDF, Word, PowerPoint, or text files.');
        return;
      }
      
      // Check file size (limit to 10MB)
      if (selected.size > 10 * 1024 * 1024) {
        alert('File size too large. Please select a file smaller than 10MB.');
        return;
      }
      
      setFile(selected);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Clean up blob URL to prevent memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleShare = async () => {
    if (!desc.trim() && !imageFile && !file) {
      alert("Please add some content to share.");
      return;
    }

    if (!authData) {
      alert("You must be logged in to share a post.");
      return;
    }

    try {
      setIsUploading(true);

      let imageUrl = null;
      let fileInfo = null;

      // Upload image if selected
      if (imageFile) {
        const imageUploadResult = await uploadImage(imageFile, 'community');
        imageUrl = imageUploadResult.url;
      }

      // Handle file upload
      if (file) {
        fileInfo = await processFileForPost(file, 'community');
      }

      // Prepare data to send to backend
      const postPayload = {
        desc: desc.trim(),
        img: imageUrl, // Now this is a proper server URL
        file: fileInfo,
        userId: authData.id,
        name: authData.name,
        role: authData.role,
        profilePic: authData.profilePic,
        groupId: groupId, // Pass group context
        groupName: groupName, // Pass group context
      };

      // Use the API function (which now won't need to process the image since it's already uploaded)
      const newPost = await createPost(postPayload);

      // Use the post returned from backend
      onShare(newPost);

      // Reset form fields
      setDesc("");
      removeImage();
      removeFile();

    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to share post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="share">
      <div className="shareContainer">
        <div className="top">
          <img 
            src={authData?.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (authData?.name || "user")} 
            alt="" 
            onError={(e) => {
              e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (authData?.name || "user");
            }}
          />
          <input
            type="text"
            placeholder={
              groupName 
                ? `Share something with ${groupName}...` 
                : `What's on your mind, ${authData?.name || "User"}?`
            }
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            disabled={isUploading}
          />
        </div>

        {imagePreview && (
          <div className="previewImage">
            <img src={imagePreview} alt="Preview" />
            <button 
              className="removeButton" 
              onClick={removeImage}
              disabled={isUploading}
            >
              ✕
            </button>
          </div>
        )}

        {file && (
          <div className="previewFile">
            <p>📎 {file.name} ({formatFileSize(file.size)})</p>
            <button 
              className="removeButton" 
              onClick={removeFile}
              disabled={isUploading}
            >
              ✕
            </button>
          </div>
        )}

        <hr />

        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
              disabled={isUploading}
            />
            <label htmlFor="imageUpload">
              <div className={`item ${isUploading ? 'disabled' : ''}`}>
                <img src={ImageIcon} alt="" />
                <span>Add Image</span>
              </div>
            </label>

            <input
              type="file"
              id="fileUpload"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <label htmlFor="fileUpload">
              <div className={`item ${isUploading ? 'disabled' : ''}`}>
                <img src={MapIcon} alt="" />
                <span>Add File</span>
              </div>
            </label>
          </div>

          <div className="right">
            <button 
              onClick={handleShare} 
              disabled={isUploading || (!desc.trim() && !imageFile && !file)}
            >
              {isUploading ? "Uploading..." : "Share"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;