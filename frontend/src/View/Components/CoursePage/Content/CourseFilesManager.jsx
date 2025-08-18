import React, { useState, useEffect } from "react";
import {
  Plus,
  Upload,
  Download,
  Trash2,
  Edit,
  Folder,
  File,
  Search,
} from "lucide-react";
import "../../../../CSS/Pages/CoursePage/CourseFilesManager.css";
import DynamicForm from "../../Forms/dynamicForm.jsx";
import PopUp from "../../Cards/PopUp.jsx";
import {
  categoryFields,
  uploadFileFields,
} from "../../../../Static/FIxed/formsInputs.js";
import * as contentApi from "../../../../Api/coursePageApi.js";

// --- CHANGE 1: The component now accepts 'academicYear' as a prop ---
const CourseFilesManager = ({ courseId, academicYear, userRole }) => {
  const canManageFiles = userRole === "1100" || userRole === "1200";
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddFile, setShowAddFile] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // --- CHANGE 2: The main data-loading useEffect now depends on 'academicYear' ---
  useEffect(() => {
    const loadInitialData = async () => {
      // It won't run if courseId or academicYear are missing
      if (!courseId || !academicYear) return;
      setLoading(true);
      try {
        // It now passes the academicYear to the API call
        const fetchedCategories = await contentApi.getCategoriesByCourse(courseId, academicYear);
        const categoriesWithFiles = fetchedCategories.map(cat => ({
          ...cat,
          files: Array.isArray(cat.files) ? cat.files : [], // Ensure files is always an array
          filesLoaded: false // Add a flag to prevent re-fetching
        }));
        setCategories(categoriesWithFiles);
        if (categoriesWithFiles.length > 0) {
          setActiveCategory(categoriesWithFiles[0].id);
        } else {
          setActiveCategory(null); // No categories found for this year
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [courseId, academicYear]); // <-- Dependency array updated

  useEffect(() => {
    const loadCategoryFiles = async () => {
      if (!activeCategory) return;
      
      const currentCategory = categories.find(cat => cat.id === activeCategory);
      if (currentCategory && currentCategory.filesLoaded) return;

      try {
        const files = await contentApi.getFilesByCategory(activeCategory);
        
        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.id === activeCategory
              ? { ...cat, files: Array.isArray(files) ? files : [], filesLoaded: true }
              : cat
          )
        );
      } catch (error) {
        console.error("Error loading files for category:", error);
        // Set empty array on error to prevent crashes
        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.id === activeCategory
              ? { ...cat, files: [], filesLoaded: true }
              : cat
          )
        );
      }
    };

    loadCategoryFiles();
  }, [activeCategory, categories]);

  // ... (getFileIcon function is unchanged)
  const getFileIcon = (type) => {
    const iconProps = { size: 24 };
    switch (type) {
      case "presentation":
        return <File {...iconProps} className="file-icon presentation" />;
      case "document":
        return <File {...iconProps} className="file-icon document" />;
      case "video":
        return <File {...iconProps} className="file-icon video" />;
      case "audio":
        return <File {...iconProps} className="file-icon audio" />;
      default:
        return <File {...iconProps} className="file-icon default" />;
    }
  };

  const handleDownloadFile = (file) => {
    if (file.id) {
      window.open(`http://localhost:8080/api/files/${file.id}/download`, '_blank');
    } else {
      console.error("No download method available for file:", file.name);
      alert("Unable to download file.");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowAddCategory(true);
  };
  
  // --- CHANGE 3: The create category handler now passes the year to the API call ---
  const handleAddCategory = async (data) => {
    if (!data.name?.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        // Only send the necessary fields for update
        const updateData = {
          name: data.name,
          description: data.description || "",
          color: data.color || "#3b82f6"
        };
        const updatedCategory = await contentApi.updateCategory(editingCategory.id, updateData);
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id
              ? { ...cat, ...updatedCategory, files: Array.isArray(cat.files) ? cat.files : [] }
              : cat
          )
        );
      } else {
        // The API call now correctly includes courseId, academicYear, and the form data
        const newCategory = await contentApi.createCategory(courseId, academicYear, data);
        setCategories([...categories, { ...newCategory, files: [], filesLoaded: false }]);
      }
      handleCloseAddCategory();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category. Please try again.");
    }
  };

  const handleCloseAddCategory = () => {
    setShowAddCategory(false);
    setEditingCategory(null);
  };

  // ... (handleDeleteCategory, handleDeleteFile, handleFileUpload are mostly unchanged in logic)
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category and all its files?")) {
      return;
    }

    try {
      await contentApi.deleteCategory(categoryId);
      const remainingCategories = categories.filter((cat) => cat.id !== categoryId);
      setCategories(remainingCategories);
      if (activeCategory === categoryId) {
        setActiveCategory(remainingCategories[0]?.id || null);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category. Please try again.");
    }
  };

  const handleDeleteFile = async (categoryId, fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      // This will now use the updated API endpoint /course/{fileId}
      await contentApi.deleteFile(fileId);
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, files: Array.isArray(cat.files) ? cat.files.filter((file) => file.id !== fileId) : [] }
            : cat
        )
      );
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file. Please try again.");
    }
  };

  const handleFileUpload = async (data) => {
    if (!data.categoryId || !data.file) {
      alert("Please select a category and file");
      return;
    }
    try {
      const newFile = await contentApi.uploadFile(data.categoryId, data.file);
      setCategories(
        categories.map((cat) =>
          cat.id === data.categoryId 
            ? { ...cat, files: Array.isArray(cat.files) ? [...cat.files, newFile] : [newFile] } 
            : cat
        )
      );
      setShowAddFile(false);
      alert(`File "${newFile.fileName}" uploaded successfully!`);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };

  // FIX: Ensure activeFiles is always an array before filtering
  const activeCategory_data = categories.find((cat) => cat.id === activeCategory);
  const activeFiles = activeCategory_data?.files || [];
  
  // Double-check that activeFiles is an array before calling filter
  const filteredFiles = Array.isArray(activeFiles) 
    ? activeFiles.filter((file) =>
        file?.fileName?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false
      )
    : [];

  if (loading) {
    return <div className="files-manager"><div className="loading-state">Loading materials for {academicYear}...</div></div>;
  }

  return (
    // The JSX part is mostly the same, it will now render the state that is correctly fetched from the API
    <div className="files-manager">
      <div className="files-container">
          <div className="categories-sidebar">
            <div className="categories-sidebar-content">
              <h3 className="categories-sidebar-title">Categories for {academicYear}</h3>
              <div className="categories-list">
                {categories.map((category) => (
                  <div key={category.id} onClick={() => setActiveCategory(category.id)} className={`category-item ${activeCategory === category.id ? "active" : ""}`} style={{borderLeftColor: activeCategory === category.id ? category.color : "transparent"}}>
                    <div className="category-main">
                      <div className="category-info">
                        <div className="category-color" style={{ backgroundColor: category.color }} />
                        <div className="category-details">
                          <h4 className="category-name">{category.name}</h4>
                          <p className="category-count">{Array.isArray(category.files) ? category.files.length : 0} files</p>
                        </div>
                      </div>
                      {canManageFiles && (
                        <div className="category-actions">
                          <button onClick={(e) => {e.stopPropagation(); handleEditCategory(category);}} className="action-btn"><Edit size={16} /></button>
                          <button onClick={(e) => {e.stopPropagation(); handleDeleteCategory(category.id);}} className="action-btn delete"><Trash2 size={16} /></button>
                        </div>
                      )}
                    </div>
                    <p className="category-description">{category.description}</p>
                  </div>
                ))}
                {canManageFiles  && (
                  <div onClick={() => setShowAddCategory(true)} className="add-category-item">
                    <div className="category-main"><div className="category-info"><div className="add-category-icon"><Plus size={16} /></div><div className="category-details"><h4 className="category-name">Add New Category</h4><p className="category-count">Create a new section</p></div></div></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="main-content">
            <div className="search-section"><div className="search-container"><div className="search-input-wrapper"><Search className="search-icon" size={20} /><input type="text" placeholder="Search files..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input"/></div></div></div>
            {activeCategory ? (
              <div className="files-grid">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="file-card">
                    <div className="file-icon-container"><div className="file-icon-wrapper">{getFileIcon(file.fileType)}</div></div>
                    <div className="file-info">
                      <h4 className="file-name" title={file.fileName}>{file.fileName}</h4>
                      <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p className="file-date">Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</p>
                    </div>
                    <div className="file-actions">
                      <button className="file-action-btn download" onClick={() => handleDownloadFile(file)}><Download size={16} /> Download</button>
                      {canManageFiles && (<button onClick={() => handleDeleteFile(activeCategory, file.id)} className="file-action-btn delete"><Trash2 size={16} /> Delete</button>)}
                    </div>
                  </div>
                ))}
                {canManageFiles && (<div className="upload-zone" onClick={() => setShowAddFile(true)}><Upload className="upload-icon" size={32} /><p className="upload-title">Upload New File</p><p className="upload-subtitle">Click to browse files</p></div>)}
              </div>
            ) : (<div className="empty-state"><Folder className="empty-icon" size={48} /><p className="empty-text">No categories for this year. Please add one.</p></div>)}
          </div>
      </div>
      <PopUp isOpen={showAddCategory} onClose={handleCloseAddCategory}>
        <DynamicForm title={editingCategory ? "Edit Category" : "Add New Category"} fields={categoryFields} initialData={editingCategory || { name: "", description: "", color: "#3b82f6" }} onSubmit={handleAddCategory} onCancel={handleCloseAddCategory} />
      </PopUp>
      <PopUp isOpen={showAddFile} onClose={() => setShowAddFile(false)}>
        <DynamicForm title="Upload File" fields={uploadFileFields(categories)} initialData={{ categoryId: activeCategory }} onSubmit={handleFileUpload} onCancel={() => setShowAddFile(false)} />
      </PopUp>
    </div>
  );
};

export default CourseFilesManager;