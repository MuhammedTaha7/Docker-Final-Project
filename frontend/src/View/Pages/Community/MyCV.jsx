
import React, { useContext, useState, useEffect } from 'react';


import "../../../CSS/Pages/Community/mycv.scss";
import { AuthContext } from "../../../Context/AuthContext";

// Import the clean API functions
import { getCV, saveCV, deleteCV, generateCVWithAI } from "../../../Api/CommunityAPIs/cvApi";

const MyCV = () => {
  const { authData } = useContext(AuthContext);
  
  // Main states
  const [currentStep, setCurrentStep] = useState(1); // 1: Input, 2: AI Processing, 3: Preview/Edit, 4: Generated
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // AI Input states
  const [aiInput, setAiInput] = useState("");
  const [inputType, setInputType] = useState("general"); // general, job-description, resume-text
  
  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Load existing CV on mount
  useEffect(() => {
    loadExistingCV();
  }, []);

  const loadExistingCV = async () => {
    try {
      const existingCV = await getCV();
      if (existingCV) {
        setCvData(existingCV);
        setCurrentStep(4); // Go to generated state
      }
    } catch (error) {
      // No existing CV, start fresh
      setCurrentStep(1);
    }
  };

  // AI CV Generation
  const generateCV = async () => {
    if (!aiInput.trim()) {
      setError("Please provide some information about yourself");
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentStep(2);

    try {
      // Use the API function from cvApi.js
      const result = await generateCVWithAI(
        inputType === 'general' ? 'full' : inputType,
        aiInput
      );
      
      let parsedData;
      try {
        // Try to parse the AI response as JSON
        parsedData = JSON.parse(result.suggestion);
      } catch (e) {
        // If not JSON, create structured data from text
        parsedData = parseAITextResponse(result.suggestion);
      }

      // Enhance with user data
      const enhancedData = {
        name: parsedData.name || authData?.name || '',
        title: parsedData.title || '',
        summary: parsedData.summary || '',
        education: parsedData.education || '',
        experience: parsedData.experience || '',
        skills: parsedData.skills || '',
        links: parsedData.links || ''
      };

      setCvData(enhancedData);
      setEditData(enhancedData);
      setCurrentStep(3); // Preview/Edit step

    } catch (error) {
      setError('Failed to generate CV. Please try again.');
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  // Parse non-JSON AI response
  const parseAITextResponse = (text) => {
    return {
      name: authData?.name || '',
      title: 'Professional Title',
      summary: text.substring(0, 200) + '...',
      education: 'Educational background extracted from your input',
      experience: 'Work experience based on provided information',
      skills: 'JavaScript, React, Node.js, Python',
      links: ''
    };
  };

  // Save CV to backend
  const saveCVToBackend = async (data = cvData) => {
    try {
      setLoading(true);
      const savedCV = await saveCV(data);
      setCvData(savedCV);
      setCurrentStep(4);
      setIsEditing(false);
    } catch (error) {
      setError('Failed to save CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete CV
  const handleDeleteCV = async () => {
    if (!confirm('Are you sure you want to delete your CV? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await deleteCV();
      setCvData(null);
      setCurrentStep(1);
      setAiInput("");
    } catch (error) {
      setError('Failed to delete CV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Edit handlers
  const startEditing = () => {
    setEditData({ ...cvData });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditData({});
  };

  const saveEdits = () => {
    setCvData(editData);
    saveCVToBackend(editData);
  };

  const updateEditField = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  // Input type options
  const inputTypes = [
    { id: 'general', label: '💬 Tell me about yourself', placeholder: 'Describe your background, experience, skills, and goals...' },
    { id: 'job-description', label: '📋 Paste a job description', placeholder: 'Paste the job description and I\'ll create a tailored CV...' },
    { id: 'resume-text', label: '📄 Paste your existing resume', placeholder: 'Paste your current resume text and I\'ll improve it...' }
  ];

  const getCurrentPlaceholder = () => {
    return inputTypes.find(type => type.id === inputType)?.placeholder || '';
  };

  return (
    <div className="cv-page">
      {/* Header */}
      <div className="cv-header">
        <h1>🤖 AI CV Builder</h1>
        <p>Create a professional CV in minutes with AI assistance</p>
      </div>

      {/* Progress Indicator */}
      <div className="progress-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Input</span>
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">AI Generation</span>
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Review & Edit</span>
        </div>
        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
          <span className="step-number">4</span>
          <span className="step-label">Your CV</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Step 1: AI Input */}
      {currentStep === 1 && (
        <div className="step-content input-step">
          <div className="input-container">
            <h2>Let's create your professional CV</h2>
            <p>Choose how you'd like to provide your information:</p>
            
            {/* Input Type Selector */}
            <div className="input-type-selector">
              {inputTypes.map(type => (
                <button
                  key={type.id}
                  className={`type-option ${inputType === type.id ? 'active' : ''}`}
                  onClick={() => setInputType(type.id)}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Text Input */}
            <div className="ai-input-section">
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder={getCurrentPlaceholder()}
                rows={8}
                className="ai-input"
              />
              <div className="input-footer">
                <span className="char-count">{aiInput.length} characters</span>
                <button 
                  className="generate-btn"
                  onClick={generateCV}
                  disabled={!aiInput.trim() || loading}
                >
                  ✨ Generate My CV
                </button>
              </div>
            </div>

            {/* Examples */}
            <div className="examples-section">
              <h3>💡 Examples to get you started:</h3>
              <div className="examples-grid">
                <div className="example-card" onClick={() => setAiInput("I'm a frontend developer with 3 years of experience in React and JavaScript. I love creating user-friendly interfaces and have worked on several e-commerce projects. I graduated with a Computer Science degree and I'm passionate about learning new technologies.")}>
                  <h4>👨‍💻 Developer</h4>
                  <p>Frontend developer with React experience...</p>
                </div>
                <div className="example-card" onClick={() => setAiInput("I'm a marketing professional with 5 years in digital marketing. I specialize in social media campaigns, content creation, and data analytics. I have a Marketing degree and have increased brand engagement by 200% in my previous role.")}>
                  <h4>📱 Marketer</h4>
                  <p>Digital marketing specialist with social media...</p>
                </div>
                <div className="example-card" onClick={() => setAiInput("Recent graduate with a degree in Business Administration. I completed internships in finance and project management. I'm seeking an entry-level position where I can apply my analytical skills and grow professionally.")}>
                  <h4>🎓 Graduate</h4>
                  <p>Recent business graduate seeking opportunities...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: AI Processing */}
      {currentStep === 2 && (
        <div className="step-content processing-step">
          <div className="processing-container">
            <div className="ai-animation">
              <div className="ai-brain">🧠</div>
              <div className="processing-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
            <h2>AI is creating your professional CV</h2>
            <p>Please wait while our AI analyzes your information and generates a tailored CV...</p>
            <div className="processing-steps">
              <div className="processing-step active">📝 Analyzing your input</div>
              <div className="processing-step active">🎯 Structuring information</div>
              <div className="processing-step active">✨ Generating professional content</div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review & Edit */}
      {currentStep === 3 && cvData && (
        <div className="step-content preview-step">
          <div className="preview-container">
            <h2>Review your AI-generated CV</h2>
            <p>Make any changes you'd like, then save your CV</p>
            
            <div className="cv-preview-edit">
              <div className="edit-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => updateEditField('name', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Professional Title</label>
                  <input
                    type="text"
                    value={editData.title || ''}
                    onChange={(e) => updateEditField('title', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Professional Summary</label>
                  <textarea
                    rows={3}
                    value={editData.summary || ''}
                    onChange={(e) => updateEditField('summary', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Education</label>
                  <textarea
                    rows={3}
                    value={editData.education || ''}
                    onChange={(e) => updateEditField('education', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Experience</label>
                  <textarea
                    rows={4}
                    value={editData.experience || ''}
                    onChange={(e) => updateEditField('experience', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Skills</label>
                  <textarea
                    rows={2}
                    value={editData.skills || ''}
                    onChange={(e) => updateEditField('skills', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Links & Contact</label>
                  <textarea
                    rows={2}
                    value={editData.links || ''}
                    onChange={(e) => updateEditField('links', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="preview-actions">
              <button className="back-btn" onClick={() => setCurrentStep(1)}>
                ← Back to Input
              </button>
              <button className="save-btn" onClick={saveEdits} disabled={loading}>
                {loading ? 'Saving...' : '💾 Save My CV'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Generated CV */}
      {currentStep === 4 && cvData && (
        <div className="step-content final-step">
          <div className="final-container">
            <div className="success-header">
              <h2>🎉 Your CV is ready!</h2>
              <p>Your professional CV has been created and saved</p>
            </div>
            
            <div className="cv-display">
              <div className="cv-paper">
                <div className="cv-header-section">
                  <h1 className="cv-name">{cvData.name}</h1>
                  {cvData.title && <h2 className="cv-title">{cvData.title}</h2>}
                </div>
                
                {cvData.summary && (
                  <div className="cv-section">
                    <h3>Professional Summary</h3>
                    <p>{cvData.summary}</p>
                  </div>
                )}
                
                {cvData.experience && (
                  <div className="cv-section">
                    <h3>Experience</h3>
                    <p>{cvData.experience}</p>
                  </div>
                )}
                
                {cvData.education && (
                  <div className="cv-section">
                    <h3>Education</h3>
                    <p>{cvData.education}</p>
                  </div>
                )}
                
                {cvData.skills && (
                  <div className="cv-section">
                    <h3>Skills</h3>
                    <p>{cvData.skills}</p>
                  </div>
                )}
                
                {cvData.links && (
                  <div className="cv-section">
                    <h3>Contact & Links</h3>
                    <p>{cvData.links}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="final-actions">
              <button className="edit-btn" onClick={startEditing}>
                ✏️ Edit CV
              </button>
              <button className="regenerate-btn" onClick={() => setCurrentStep(1)}>
                🔄 Create New CV
              </button>
              <button className="delete-btn" onClick={handleDeleteCV}>
                🗑️ Delete CV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="edit-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>✏️ Edit Your CV</h3>
              <button className="close-btn" onClick={cancelEditing}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="edit-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => updateEditField('name', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Professional Title</label>
                  <input
                    type="text"
                    value={editData.title || ''}
                    onChange={(e) => updateEditField('title', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Professional Summary</label>
                  <textarea
                    rows={3}
                    value={editData.summary || ''}
                    onChange={(e) => updateEditField('summary', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Education</label>
                  <textarea
                    rows={3}
                    value={editData.education || ''}
                    onChange={(e) => updateEditField('education', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Experience</label>
                  <textarea
                    rows={4}
                    value={editData.experience || ''}
                    onChange={(e) => updateEditField('experience', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Skills</label>
                  <textarea
                    rows={2}
                    value={editData.skills || ''}
                    onChange={(e) => updateEditField('skills', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Links & Contact</label>
                  <textarea
                    rows={2}
                    value={editData.links || ''}
                    onChange={(e) => updateEditField('links', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={cancelEditing}>
                Cancel
              </button>
              <button className="save-btn" onClick={saveEdits} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCV;