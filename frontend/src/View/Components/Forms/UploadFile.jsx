import React, { useState } from 'react';
import '../../../CSS/Forms/uploadFile.css';

const MediaUpload = () => {
  const [files, setFiles] = useState([]);

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/zip'];
    const filtered = selectedFiles.filter(
      (file) => validTypes.includes(file.type) && files.length < 5
    );
    setFiles([...files, ...filtered].slice(0, 5));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles({ target: { files: e.dataTransfer.files } });
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="media-upload-container">
      <h2>Media Upload</h2>
      <p className="subtitle">Add your documents here, and you can upload up to 5 files max</p>

      <div
        className="upload-dropzone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="drop-icon">📁</div>
        <p>Drag your file(s) to start uploading</p>
        <span className="or-label">OR</span>
        <label htmlFor="file-upload" className="browse-btn">
          Browse files
          <input
            type="file"
            id="file-upload"
            multiple
            onChange={handleFiles}
            accept=".jpg,.png,.svg,.zip"
          />
        </label>
      </div>

      <p className="note">Only support .jpg, .png, .svg and zip files</p>

      {/* File List */}
      <ul className="file-list">
        {files.map((file, index) => (
          <li key={index} className="file-item">
            <span className="file-icon">🗂️</span>
            <span className="file-name">{file.name}</span>
            <button className="remove-btn" onClick={() => removeFile(index)}>✕</button>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="action-buttons">
        <button className="cancel-btn">Cancel</button>
        <button className="next-btn">Next</button>
      </div>
    </div>
  );
};

export default MediaUpload;
