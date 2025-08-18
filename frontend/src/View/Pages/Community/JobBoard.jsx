import { useState, useEffect, useContext } from "react";
import "../../../CSS/Pages/Community/jobBoard.scss";
import { AuthContext } from "../../../Context/AuthContext";
import Modal from "../../Components/Modal/Modal.jsx";

// Import clean API functions instead of direct endpoints and axios
import {
  getAllJobs,
  getMyPostedJobs,
  getAppliedJobs,
  getSavedJobs,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  saveJob,
  unsaveJob,
  getJobApplications,
  acceptApplication,
  rejectApplication,
  downloadJobApplicantCV
} from "../../../Api/CommunityAPIs/jobsApi";

import {
  getCV
} from "../../../Api/CommunityAPIs/cvApi";

import {
  sendNotification
} from "../../../Api/CommunityAPIs/notificationsApi";

const JobBoard = () => {
  const { authData } = useContext(AuthContext);
  
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Navigation and UI state
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  
  // Job data state
  const [allJobs, setAllJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  
  // Job management state
  const [editingJob, setEditingJob] = useState(null);
  const [jobApplications, setJobApplications] = useState({});
  
  // CV and Application Modal states
  const [userCV, setUserCV] = useState(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [currentJobApplications, setCurrentJobApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);

  // New job form state with all required fields
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    type: "Full-time",
    tags: [],
    salary: "",
    remote: "No",
    experience: "Entry Level",
    deadline: "",
    benefits: [],
    requirements: "",
    status: "Active"
  });

  // ============================================================================
  // CONSTANTS AND CONFIGURATION
  // ============================================================================
  
  const predefinedSkills = [
    "JavaScript", "React", "Node.js", "Python", "Java", "SQL",
    "UI/UX Design", "Project Management", "Data Analysis", "AWS",
    "TypeScript", "MongoDB", "Docker", "Git", "GraphQL", "Vue.js",
    "Angular", "PHP", "C++", "Machine Learning", "Kubernetes", "Redis",
    "PostgreSQL", "Firebase", "Figma", "Adobe Creative Suite"
  ];

  const benefitOptions = [
    "Health Insurance", "401(k)", "Flexible Hours", "Remote Work",
    "Paid Time Off", "Professional Development", "Stock Options",
    "Gym Membership", "Free Meals", "Childcare", "Dental Insurance",
    "Vision Insurance", "Life Insurance", "Commuter Benefits",
    "Mental Health Support", "Conference Budget", "Work From Home Stipend",
    "Unlimited PTO"
  ];

  // ============================================================================
  // API INTEGRATION - LOAD DATA
  // ============================================================================
  
  useEffect(() => {
    if (!authData?.id) return;

    const fetchJobsData = async () => {
      try {
        setLoading(true);
        
        // Load jobs data and user CV in parallel
        const [allJobsRes, savedRes, appliedRes, postedRes, cvRes] = await Promise.all([
          getAllJobs(),
          getSavedJobs(),
          getAppliedJobs(),
          getMyPostedJobs(),
          getCV().catch(() => null) // CV might not exist
        ]);
        
        setAllJobs(allJobsRes || []);
        setSavedJobs(savedRes || []);
        setAppliedJobs(appliedRes || []);
        setPostedJobs(postedRes || []);
        setUserCV(cvRes || null);

        // Load application counts for posted jobs
        const applicationCounts = {};
        for (const job of postedRes || []) {
          try {
            const appsRes = await getJobApplications(job.id);
            applicationCounts[job.id] = appsRes?.length || 0;
          } catch (error) {
            applicationCounts[job.id] = 0;
          }
        }
        setJobApplications(applicationCounts);
        
      } catch (error) {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };

    fetchJobsData();
  }, [authData]);

  // ============================================================================
  // CV CHECK AND APPLICATION LOGIC
  // ============================================================================
  
  /**
   * Check if user has CV before allowing application
   */
  const checkCVBeforeApply = () => {
    if (!userCV || (!userCV.name && !userCV.fileName)) {
      alert(`🚨 Oops! You don't have a CV yet! 📄

Your chances of getting this job: 0.000001% 😅

But don't worry! Create your amazing CV first and come back to apply! 
Head over to the "My CV" section and show the world what you've got! 💪✨`);
      return false;
    }
    return true;
  };

  /**
   * Apply to job with CV validation
   */
  const handleApplyJob = async (job) => {
    try {
      const isApplied = appliedJobs.some((j) => j.id === job.id);
      
      if (isApplied) {
        // Unapply (you might want to add an endpoint for this)
        setAppliedJobs(prev => prev.filter(j => j.id !== job.id));
        setJobApplications(prev => ({
          ...prev,
          [job.id]: Math.max((prev[job.id] || 1) - 1, 0)
        }));
        return;
      }

      // Check CV before applying
      if (!checkCVBeforeApply()) {
        return;
      }

      // Apply with CV data
      await applyToJob(job.id, {
        applicationLink: "", 
        message: "Application submitted with CV attached",
        cvData: userCV // Send CV data with application
      });
      
      setAppliedJobs(prev => [...prev, job]);
      setJobApplications(prev => ({
        ...prev,
        [job.id]: (prev[job.id] || 0) + 1
      }));

      alert("🎉 Application submitted successfully with your CV!");
      
    } catch (error) {
      if (error.message?.includes("CV not found")) {
        alert("🚨 You need to create a CV before applying to jobs!\n\nYour chances without a CV: 0.000001% 😅\n\nGo to 'My CV' section and create your amazing CV first! 💪");
      } else {
        alert("Failed to apply to job. Please try again.");
      }
    }
  };

  // ============================================================================
  // APPLICATIONS MANAGEMENT
  // ============================================================================
  
  /**
   * View applications with enhanced CV data
   */
  const handleViewApplications = async (job) => {
    try {
      setLoading(true);
      const applications = await getJobApplications(job.id);
      
      // Applications now come with enhanced CV data from backend
      setSelectedJob(job);
      setCurrentJobApplications(applications || []);
      setShowApplicationsModal(true);
      
    } catch (error) {
      alert("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Accept job application
   */
  const handleAcceptApplication = async (application) => {
    try {
      await acceptApplication(application.id);
      
      // Update local state
      setCurrentJobApplications(prev => 
        prev.map(app => 
          app.id === application.id 
            ? { ...app, status: 'ACCEPTED' }
            : app
        )
      );

      alert(`✅ Application accepted! ${application.applicant.name} has been notified.`);
      
    } catch (error) {
      alert("Failed to accept application. Please try again.");
    }
  };

  /**
   * Reject job application
   */
  const handleRejectApplication = async (application) => {
    if (!confirm(`Are you sure you want to reject ${application.applicant.name}'s application?`)) {
      return;
    }

    try {
      await rejectApplication(application.id);
      // Update local state
      setCurrentJobApplications(prev => 
        prev.map(app => 
          app.id === application.id 
            ? { ...app, status: 'REJECTED' }
            : app
        )
      );

      alert(`❌ Application rejected. ${application.applicant.name} has been notified.`);
      
    } catch (error) {
      alert("Failed to reject application. Please try again.");
    }
  };

  /**
   * View CV in modal
   */
  const handleViewCV = (application) => {
    setSelectedCV(application);
    setShowCVModal(true);
  };

  /**
   * Download CV with proper error handling
   */
  const handleDownloadCV = async (application) => {
    try {
      setLoading(true);
      
      const response = await downloadJobApplicantCV(application.applicant.id);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${application.applicant.name.replace(/\s+/g, '_')}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      if (error.response?.status === 404) {
        alert("CV file not found. The applicant may not have uploaded a CV file.");
      } else if (error.response?.status === 403) {
        alert("You don't have permission to download this CV.");
      } else {
        alert("Failed to download CV. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // EXISTING HANDLERS (Save, Delete, Edit, etc.)
  // ============================================================================
  
  const handleSaveJob = async (job) => {
    try {
      const isSaved = savedJobs.some((j) => j.id === job.id);
      
      if (isSaved) {
        await unsaveJob(job.id);
        setSavedJobs(prev => prev.filter(j => j.id !== job.id));
      } else {
        await saveJob(job.id);
        setSavedJobs(prev => [...prev, job]);
      }
    } catch (error) {
      alert("Failed to save/unsave job. Please try again.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    
    try {
      await deleteJob(jobId);
      
      setPostedJobs(prev => prev.filter(job => job.id !== jobId));
      setAllJobs(prev => prev.filter(job => job.id !== jobId));
      
      setJobApplications(prev => {
        const newApps = { ...prev };
        delete newApps[jobId];
        return newApps;
      });
      
      alert("Job deleted successfully!");
    } catch (error) {
      alert("Failed to delete job. Please try again.");
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setNewJob(job);
    setActiveTab("post");
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    
    if (!newJob.title || !newJob.company || !newJob.description) {
      alert("Please fill in required fields.");
      return;
    }

    try {
      if (editingJob) {
        const response = await updateJob(editingJob.id, newJob);
        
        setPostedJobs(prev => 
          prev.map(job => job.id === editingJob.id ? response : job)
        );
        setAllJobs(prev => 
          prev.map(job => job.id === editingJob.id ? response : job)
        );
        setEditingJob(null);
        alert("Job updated successfully!");
      } else {
        const response = await createJob(newJob);
        
        setPostedJobs(prev => [...prev, response]);
        setAllJobs(prev => [...prev, response]);
        alert("Job posted successfully!");
      }

      resetJobForm();
      setActiveTab("all");
    } catch (error) {
      alert("Failed to save job. Please try again.");
    }
  };

  const resetJobForm = () => {
    setNewJob({
      title: "",
      company: "",
      location: "",
      description: "",
      type: "Full-time",
      tags: [],
      salary: "",
      remote: "No",
      experience: "Entry Level",
      deadline: "",
      benefits: [],
      requirements: "",
      status: "Active"
    });
  };

  const handleSkillToggle = (skill) => {
    setNewJob(prev => ({
      ...prev,
      tags: prev.tags.includes(skill)
        ? prev.tags.filter(t => t !== skill)
        : [...prev.tags, skill]
    }));
  };

  const handleBenefitToggle = (benefit) => {
    setNewJob(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  const isMyJob = (job) => {
    return postedJobs.some(pJob => pJob.id === job.id);
  };

  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = jobTypeFilter === "All" || job.type === jobTypeFilter;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return '#ffa500';
      case 'REVIEWED': return '#2196f3';
      case 'ACCEPTED': return '#4caf50';
      case 'REJECTED': return '#f44336';
      default: return '#666';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================
  
  const renderJobCard = (job) => {
    const myJob = isMyJob(job);
    const applicationCount = jobApplications[job.id] || 0;
    const isSaved = savedJobs.some(j => j.id === job.id);
    const isApplied = appliedJobs.some(j => j.id === job.id);

    return (
      <div className="jobCard" key={job.id}>
        <div className="jobHeader">
          <h4>{job.title}</h4>
          {job.status && (
            <span className={`jobStatus ${job.status.toLowerCase()}`}>
              {job.status}
            </span>
          )}
        </div>
        
        <p className="company">
          🏢 {job.company} • 📍 {job.location}
        </p>
        <p className="description">{job.description}</p>
        
        <div className="meta">
          <span className="type">💼 {job.type}</span>
          <span className="date">📅 Posted: {job.postedDate}</span>
          {job.salary && <span className="salary">💰 {job.salary}</span>}
        </div>
        
        <div className="tags">
          {job.tags && job.tags.map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
        
        <div className="actions">
          {myJob ? (
            <>
              <button
                className="viewApplicationsBtn"
                onClick={() => handleViewApplications(job)}
              >
                👥 View Applications ({applicationCount})
              </button>
              <button
                className="editBtn"
                onClick={() => handleEditJob(job)}
              >
                ✏️ Edit
              </button>
              <button
                className="deleteBtn"
                onClick={() => handleDeleteJob(job.id)}
              >
                🗑️ Delete
              </button>
            </>
          ) : (
            <>
              <button
                className={`applyBtn ${isApplied ? "applied" : ""}`}
                onClick={() => handleApplyJob(job)}
              >
                {isApplied ? "✅ Applied" : "📤 Apply"}
              </button>

              <button
                className={`saveBtn ${isSaved ? "saved" : ""}`}
                onClick={() => handleSaveJob(job)}
              >
                {isSaved ? "💾 Saved" : "💾 Save"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="jobBoardPage">
        <div className="loading">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="jobBoardPage">
      <h2>💼 Job Board</h2>

      {/* CV Status Indicator */}
      {!userCV && (
        <div className="cvWarning">
          ⚠️ You don't have a CV yet! Create one in the <strong>My CV</strong> section to apply for jobs.
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          📋 All Jobs
        </button>
        <button
          className={activeTab === "saved" ? "active" : ""}
          onClick={() => setActiveTab("saved")}
        >
          💾 Saved Jobs ({savedJobs.length})
        </button>
        <button
          className={activeTab === "applied" ? "active" : ""}
          onClick={() => setActiveTab("applied")}
        >
          📝 My Applications ({appliedJobs.length})
        </button>
        <button
          className={activeTab === "post" ? "active" : ""}
          onClick={() => setActiveTab("post")}
        >
          {editingJob ? "✏️ Edit Job" : "➕ Post Job"}
        </button>
        {postedJobs.length > 0 && (
          <button
            className={activeTab === "myJobs" ? "active" : ""}
            onClick={() => setActiveTab("myJobs")}
          >
            🏢 My Jobs ({postedJobs.length})
          </button>
        )}
      </div>

      {/* Search and Filter Controls */}
      {(activeTab === "all" || activeTab === "myJobs") && (
        <div className="filters">
          <div className="searchGroup">
            <span className="searchIcon">🔍</span>
            <input
              type="text"
              placeholder="Search job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      )}

      {/* Main Content Area */}
      <div className={activeTab === "post" ? "postJobContainer" : "jobGrid"}>
        
        {/* ALL JOBS TAB */}
        {activeTab === "all" && filteredJobs.map((job) => renderJobCard(job))}
        
        {/* MY JOBS TAB */}
        {activeTab === "myJobs" && 
          postedJobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = jobTypeFilter === "All" || job.type === jobTypeFilter;
            return matchesSearch && matchesType;
          }).map((job) => renderJobCard(job))
        }
        
        {/* SAVED JOBS TAB */}
        {activeTab === "saved" && (
          savedJobs.length > 0 ? 
            savedJobs.map((job) => renderJobCard(job)) :
            <div className="emptyState">
              <p>💾 No saved jobs yet.</p>
              <p>Save jobs you're interested in to view them here!</p>
            </div>
        )}
        
        {/* APPLIED JOBS TAB */}
        {activeTab === "applied" && (
          appliedJobs.length > 0 ? 
            appliedJobs.map((job) => renderJobCard(job)) :
            <div className="emptyState">
              <p>📝 No applications yet.</p>
              <p>Apply to jobs to track your applications here!</p>
            </div>
        )}

        {/* POST/EDIT JOB TAB - Complete Job posting form */}
        {activeTab === "post" && (
          <div className="postJobWrapper">
            <div className="postJobHeader">
              <h3>{editingJob ? "✏️ Edit Job Posting" : "🚀 Post a New Job"}</h3>
              <p>{editingJob ? "Update your job posting details" : "Find the perfect candidate for your team"}</p>
            </div>
            
            <div className="postJobContent">
              <div className="postJobForm">
                <form onSubmit={handlePostJob}>
                  
                  {/* BASIC INFORMATION SECTION */}
                  <div className="formSection">
                    <h4>📋 Basic Information</h4>
                    <div className="formGrid">
                      <div className="formGroup">
                        <label>Job Title *</label>
                        <input
                          type="text"
                          value={newJob.title}
                          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                          placeholder="e.g. Senior Frontend Developer"
                          required
                        />
                      </div>

                      <div className="formGroup">
                        <label>Company Name *</label>
                        <input
                          type="text"
                          value={newJob.company}
                          onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                          placeholder="e.g. Tech Corp Inc."
                          required
                        />
                      </div>

                      <div className="formGroup">
                        <label>Location</label>
                        <input
                          type="text"
                          value={newJob.location}
                          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                          placeholder="e.g. New York, NY"
                        />
                      </div>

                      <div className="formGroup">
                        <label>Job Type</label>
                        <select
                          value={newJob.type}
                          onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>

                      <div className="formGroup">
                        <label>Experience Level</label>
                        <select
                          value={newJob.experience}
                          onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                        >
                          <option value="Entry Level">Entry Level</option>
                          <option value="Mid Level">Mid Level</option>
                          <option value="Senior Level">Senior Level</option>
                          <option value="Executive">Executive</option>
                        </select>
                      </div>

                      <div className="formGroup">
                        <label>Remote Work</label>
                        <select
                          value={newJob.remote}
                          onChange={(e) => setNewJob({ ...newJob, remote: e.target.value })}
                        >
                          <option value="No">On-site</option>
                          <option value="Yes">Fully Remote</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* JOB DETAILS SECTION */}
                  <div className="formSection fullWidth">
                    <h4>💼 Job Details</h4>
                    <div className="formGroup fullWidth">
                      <label>Job Description *</label>
                      <textarea
                        rows="4"
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        placeholder="Describe the role, responsibilities, and what you're looking for..."
                        required
                      />
                    </div>

                    <div className="formGroup fullWidth">
                      <label>Requirements</label>
                      <textarea
                        rows="3"
                        value={newJob.requirements}
                        onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                        placeholder="List the required qualifications, experience, and skills..."
                      />
                    </div>

                    <div className="formGrid twoColumns">
                      <div className="formGroup">
                        <label>Salary Range</label>
                        <input
                          type="text"
                          value={newJob.salary}
                          onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                          placeholder="e.g. $70k - $90k"
                        />
                      </div>

                      <div className="formGroup">
                        <label>Application Deadline</label>
                        <input
                          type="date"
                          value={newJob.deadline}
                          onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SKILLS SELECTION SECTION */}
                  <div className="formSection fullWidth">
                    <h4>🛠️ Required Skills</h4>
                    <div className="skillsGrid threeColumns">
                      {predefinedSkills.map((skill) => (
                        <label key={skill} className="skillCheckbox">
                          <input
                            type="checkbox"
                            checked={newJob.tags.includes(skill)}
                            onChange={() => handleSkillToggle(skill)}
                          />
                          <span>{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* BENEFITS SELECTION SECTION */}
                  <div className="formSection fullWidth">
                    <h4>🎁 Benefits & Perks</h4>
                    <div className="benefitsGrid threeColumns">
                      {benefitOptions.map((benefit) => (
                        <label key={benefit} className="benefitCheckbox">
                          <input
                            type="checkbox"
                            checked={newJob.benefits.includes(benefit)}
                            onChange={() => handleBenefitToggle(benefit)}
                          />
                          <span>{benefit}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* FORM ACTION BUTTONS */}
                  <div className="formActions">
                    <button type="submit" className="postJobBtn">
                      {editingJob ? "💾 Update Job" : "🚀 Post Job"}
                    </button>
                    
                    {editingJob && (
                      <button 
                        type="button" 
                        className="cancelBtn"
                        onClick={() => {
                          setEditingJob(null);
                          resetJobForm();
                          setActiveTab("all");
                        }}
                      >
                        ❌ Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* SIDEBAR WITH TIPS AND PREVIEW */}
              <div className="postJobSidebar">
                <div className="tipsCard">
                  <h4>💡 Tips for Better Job Posts</h4>
                  <ul>
                    <li>Write a clear, specific job title</li>
                    <li>Include salary range to attract more candidates</li>
                    <li>Be specific about required skills</li>
                    <li>Mention company culture and values</li>
                    <li>Set realistic deadlines</li>
                  </ul>
                </div>

                <div className="previewCard">
                  <h4>👀 Live Preview</h4>
                  <div className="jobCardPreview">
                    <h5>{newJob.title || "Job Title"}</h5>
                    <p className="companyPreview">
                      🏢 {newJob.company || "Company Name"} • 📍 {newJob.location || "Location"}
                    </p>
                    <p className="descriptionPreview">
                      {newJob.description || "Job description will appear here..."}
                    </p>
                    <div className="metaPreview">
                      <span className="typePreview">💼 {newJob.type}</span>
                      <span className="experiencePreview">🎯 {newJob.experience}</span>
                    </div>
                    {newJob.tags.length > 0 && (
                      <div className="tagsPreview">
                        {newJob.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="tagPreview">{tag}</span>
                        ))}
                        {newJob.tags.length > 3 && <span className="tagPreview">+{newJob.tags.length - 3} more</span>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="statsCard">
                  <h4>📊 Job Posting Stats</h4>
                  <div className="statItem">
                    <span className="statLabel">📝 Skills Selected:</span>
                    <span className="statValue">{newJob.tags.length}</span>
                  </div>
                  <div className="statItem">
                    <span className="statLabel">🎁 Benefits Offered:</span>
                    <span className="statValue">{newJob.benefits.length}</span>
                  </div>
                  <div className="statItem">
                    <span className="statLabel">📄 Description Length:</span>
                    <span className="statValue">{newJob.description.length} chars</span>
                  </div>
                </div>

                <div className="guidelinesCard">
                  <h4>📋 Posting Guidelines</h4>
                  <div className="guideline">
                    <span className={newJob.title ? "guideline-check" : "guideline-cross"}>
                      {newJob.title ? "✅" : "❌"}
                    </span>
                    <span>Add a clear job title</span>
                  </div>
                  <div className="guideline">
                    <span className={newJob.description.length > 50 ? "guideline-check" : "guideline-cross"}>
                      {newJob.description.length > 50 ? "✅" : "❌"}
                    </span>
                    <span>Write detailed description (50+ chars)</span>
                  </div>
                  <div className="guideline">
                    <span className={newJob.tags.length >= 3 ? "guideline-check" : "guideline-cross"}>
                      {newJob.tags.length >= 3 ? "✅" : "❌"}
                    </span>
                    <span>Select at least 3 skills</span>
                  </div>
                  <div className="guideline">
                    <span className={newJob.salary ? "guideline-check" : "guideline-cross"}>
                      {newJob.salary ? "✅" : "❌"}
                    </span>
                    <span>Include salary information</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* APPLICATIONS MANAGEMENT MODAL */}
      <Modal
        isOpen={showApplicationsModal}
        onClose={() => setShowApplicationsModal(false)}
        title={`Applications for: ${selectedJob?.title || 'Job'}`}
        size="large"
      >
        <div className="applicationsModal">
          {currentJobApplications.length === 0 ? (
            <div className="emptyApplications">
              <p>📭 No applications yet for this job.</p>
              <p>Share the job posting to get more applicants!</p>
            </div>
          ) : (
            <div className="applicationsList">
              <div className="applicationsHeader">
                <h4>👥 {currentJobApplications.length} Application(s)</h4>
                <div className="applicationStats">
                  <span className="stat pending">
                    🟡 Pending: {currentJobApplications.filter(app => app.status === 'PENDING').length}
                  </span>
                  <span className="stat accepted">
                    🟢 Accepted: {currentJobApplications.filter(app => app.status === 'ACCEPTED').length}
                  </span>
                  <span className="stat rejected">
                    🔴 Rejected: {currentJobApplications.filter(app => app.status === 'REJECTED').length}
                  </span>
                </div>
              </div>

              {currentJobApplications.map((application) => (
                <div key={application.id} className="applicationCard">
                  <div className="applicantInfo">
                    <div className="applicantHeader">
                      <img 
                        src={application.applicant.profilePic || "https://via.placeholder.com/50"} 
                        alt={application.applicant.name}
                        className="applicantAvatar"
                      />
                      <div className="applicantDetails">
                        <h5>{application.applicant.name}</h5>
                        <p className="applicantEmail">{application.applicant.email}</p>
                        <p className="appliedDate">
                          📅 Applied: {formatDate(application.appliedAt)}
                        </p>
                        
                        {/* CV Preview */}
                        {application.cvData && (
                          <div className="cvPreview">
                            <p className="cvTitle">
                              <strong>{application.cvData.title || 'Professional'}</strong>
                            </p>
                            {application.cvData.previewText && (
                              <p className="cvPreviewText">
                                {application.cvData.previewText.substring(0, 100)}
                                {application.cvData.previewText.length > 100 ? '...' : ''}
                              </p>
                            )}
                            <div className="cvMeta">
                              <span className="cvCompleteness">
                                📊 CV: {application.cvData.completeness || 0}% complete
                              </span>
                              {application.cvData.hasFile && (
                                <span className="hasFile">📎 PDF attached</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="applicationStatus">
                        <span 
                          className={`statusBadge ${application.status.toLowerCase()}`}
                          style={{ backgroundColor: getStatusColor(application.status) }}
                        >
                          {application.status}
                        </span>
                      </div>
                    </div>

                    {application.message && (
                      <div className="applicationMessage">
                        <h6>💬 Cover Letter:</h6>
                        <p>{application.message}</p>
                      </div>
                    )}

                    {application.applicationLink && (
                      <div className="applicationLink">
                        <h6>🔗 Portfolio/Links:</h6>
                        <a href={application.applicationLink} target="_blank" rel="noopener noreferrer">
                          {application.applicationLink}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="applicationActions">
                    <div className="cvActions">
                      <button 
                        className="viewCVBtn"
                        onClick={() => handleViewCV(application)}
                        disabled={!application.cvData}
                      >
                        👁️ View CV
                      </button>
                      
                      {application.cvData?.hasFile && (
                        <button 
                          className="downloadCVBtn"
                          onClick={() => handleDownloadCV(application)}
                          disabled={loading}
                        >
                          {loading ? '⏳ Downloading...' : '📥 Download CV'}
                        </button>
                      )}
                    </div>

                    {application.status === 'PENDING' && (
                      <div className="reviewActions">
                        <button 
                          className="acceptBtn"
                          onClick={() => handleAcceptApplication(application)}
                        >
                          ✅ Accept
                        </button>
                        <button 
                          className="rejectBtn"
                          onClick={() => handleRejectApplication(application)}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}

                    {application.status === 'ACCEPTED' && (
                      <div className="statusActions">
                        <span className="acceptedStatus">✅ Accepted</span>
                        <small>Applicant has been notified</small>
                      </div>
                    )}

                    {application.status === 'REJECTED' && (
                      <div className="statusActions">
                        <span className="rejectedStatus">❌ Rejected</span>
                        <small>Applicant has been notified</small>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* ENHANCED CV VIEWING MODAL */}
      <Modal
        isOpen={showCVModal}
        onClose={() => setShowCVModal(false)}
        title={`CV: ${selectedCV?.applicant?.name || 'Applicant'}`}
        size="large"
      >
        <div className="cvViewModal">
          {selectedCV && selectedCV.cvData && (
            <div className="cvContent">
              {/* CV Header with applicant info */}
              <div className="cvModalHeader">
                <div className="applicantInfo">
                  <img 
                    src={selectedCV.applicant.profilePic || "https://via.placeholder.com/80"} 
                    alt={selectedCV.applicant.name}
                    className="applicantAvatarLarge"
                  />
                  <div className="applicantDetails">
                    <h3>{selectedCV.applicant.name}</h3>
                    <p className="applicantEmail">{selectedCV.applicant.email}</p>
                    {selectedCV.cvData.title && (
                      <p className="professionalTitle">{selectedCV.cvData.title}</p>
                    )}
                  </div>
                </div>
                
                <div className="cvActions">
                  <div className="cvCompleteness">
                    <span className="completenessLabel">CV Completeness:</span>
                    <div className="completenessBar">
                      <div 
                        className="completenessProgress" 
                        style={{ width: `${selectedCV.cvData.completeness || 0}%` }}
                      ></div>
                    </div>
                    <span className="completenessPercent">{selectedCV.cvData.completeness || 0}%</span>
                  </div>
                  
                  {selectedCV.cvData.hasFile && (
                    <button 
                      className="downloadCVBtn primary"
                      onClick={() => handleDownloadCV(selectedCV)}
                      disabled={loading}
                    >
                      {loading ? '⏳ Downloading...' : '📥 Download PDF'}
                    </button>
                  )}
                </div>
              </div>

              {/* CV Content Sections */}
              <div className="cvSections">
                {selectedCV.cvData.summary && (
                  <div className="cvSection">
                    <h4>📋 Professional Summary</h4>
                    <div className="cvSectionContent">
                      <p>{selectedCV.cvData.summary}</p>
                    </div>
                  </div>
                )}

                {selectedCV.cvData.experience && (
                  <div className="cvSection">
                    <h4>💼 Work Experience</h4>
                    <div className="cvSectionContent">
                      <p>{selectedCV.cvData.experience}</p>
                    </div>
                  </div>
                )}

                {selectedCV.cvData.education && (
                  <div className="cvSection">
                    <h4>🎓 Education</h4>
                    <div className="cvSectionContent">
                      <p>{selectedCV.cvData.education}</p>
                    </div>
                  </div>
                )}

                {selectedCV.cvData.skills && (
                  <div className="cvSection">
                    <h4>🛠️ Skills</h4>
                    <div className="cvSectionContent">
                      <div className="skillsTags">
                        {selectedCV.cvData.skills.split(',').map((skill, index) => (
                          <span key={index} className="skillTag">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedCV.cvData.links && (
                  <div className="cvSection">
                    <h4>🔗 Links & Contact</h4>
                    <div className="cvSectionContent">
                      <p>{selectedCV.cvData.links}</p>
                    </div>
                  </div>
                )}

                {/* File Information */}
                {selectedCV.cvData.hasFile && selectedCV.cvData.fileName && (
                  <div className="cvSection">
                    <h4>📄 Uploaded CV File</h4>
                    <div className="cvSectionContent">
                      <div className="fileInfo">
                        <span className="fileName">📎 {selectedCV.cvData.fileName}</span>
                        <button 
                          className="downloadFileBtn"
                          onClick={() => handleDownloadCV(selectedCV)}
                        >
                          📥 Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!selectedCV.cvData.summary && !selectedCV.cvData.experience && 
                !selectedCV.cvData.education && !selectedCV.cvData.hasFile && (
                  <div className="cvEmptyState">
                    <p>📭 This applicant hasn't provided detailed CV information.</p>
                    <p>You may want to contact them directly for more details.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default JobBoard;