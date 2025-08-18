import React, { useState } from 'react';
import '../../../CSS/Forms/inputForm.css'; // You can rename the CSS file if needed

const TextUpload = () => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCancel = () => {
    setInputValue('');
  };

  const handleSubmit = () => {
    if (inputValue.trim() === '') return alert("Please enter something!");
    // Here you could send the value to a backend or another function
    setInputValue('');
  };

  return (
    <div className="text-upload-container">
      <h2>Text Upload</h2>
      <p className="subtitle">Enter your text below and click Next to proceed.</p>

      <textarea
        className="text-input"
        placeholder="Type your message, title, or link here..."
        value={inputValue}
        onChange={handleChange}
        rows={5}
      />

      <div className="action-buttons">
        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        <button className="next-btn" onClick={handleSubmit}>Next</button>
      </div>
    </div>
  );
};

export default TextUpload;