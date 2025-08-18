/**
 * Exam Question Manager Component - Complete Question Management for Exams
 * File: src/Components/ExamQuestionManager.jsx
 * FIXED: Backend integration for adding/updating/deleting questions
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  FileText,
  BookOpen,
  Edit,
  Copy,
  Move,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Hash,
  Type,
  MoreVertical,
  GripVertical,
  ArrowUp,
  ArrowDown,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import styles from './ExamQuestionManager.module.css';

const ExamQuestionManager = ({ 
  exam, 
  questions = [], 
  onAddQuestion, 
  onUpdateQuestion, 
  onDeleteQuestion, 
  onReorderQuestions,
  loading = false,
  className = '' 
}) => {
  // Local state
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [draggedQuestion, setDraggedQuestion] = useState(null);
  const [bulkAction, setBulkAction] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // New question form state - ENHANCED FOR BACKEND INTEGRATION
  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    correctAnswerIndex: 0,
    points: 5,
    explanation: '',
    required: true,
    timeLimit: null,
    caseSensitive: false,
    maxLength: null,
    acceptableAnswers: []
  });

  // Edit question form state
  const [editFormData, setEditFormData] = useState({});

  // Reset form when exam changes
  useEffect(() => {
    resetNewQuestionForm();
    setExpandedQuestions(new Set());
    setSelectedQuestions(new Set());
    setEditingQuestion(null);
    setShowAddForm(false);
    setEditFormData({});
  }, [exam?.id]);

  const resetNewQuestionForm = useCallback(() => {
    setNewQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      correctAnswerIndex: 0,
      points: 5,
      explanation: '',
      required: true,
      timeLimit: null,
      caseSensitive: false,
      maxLength: null,
      acceptableAnswers: []
    });
  }, []);

  // Question type handlers
  const handleQuestionTypeChange = useCallback((type) => {
    const baseQuestion = {
      ...newQuestion,
      type,
      correctAnswer: '',
      correctAnswerIndex: 0
    };

    if (type === 'multiple-choice') {
      baseQuestion.options = ['', '', '', ''];
    } else if (type === 'true-false') {
      baseQuestion.options = ['True', 'False'];
      baseQuestion.correctAnswer = 'true';
    } else {
      baseQuestion.options = [];
    }

    setNewQuestion(baseQuestion);
  }, [newQuestion]);

  // Edit form type change handler
  const handleEditQuestionTypeChange = useCallback((type) => {
    const baseQuestion = {
      ...editFormData,
      type,
      correctAnswer: '',
      correctAnswerIndex: 0
    };

    if (type === 'multiple-choice') {
      baseQuestion.options = ['', '', '', ''];
    } else if (type === 'true-false') {
      baseQuestion.options = ['True', 'False'];
      baseQuestion.correctAnswer = 'true';
    } else {
      baseQuestion.options = [];
    }

    setEditFormData(baseQuestion);
  }, [editFormData]);

  // Option management for multiple choice questions
  const handleOptionChange = useCallback((index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  }, [newQuestion.options]);

  const handleEditOptionChange = useCallback((index, value) => {
    const newOptions = [...(editFormData.options || [])];
    newOptions[index] = value;
    setEditFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  }, [editFormData.options]);

  const addOption = useCallback(() => {
    if (newQuestion.options.length < 6) {
      setNewQuestion(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  }, [newQuestion.options.length]);

  const addEditOption = useCallback(() => {
    if ((editFormData.options || []).length < 6) {
      setEditFormData(prev => ({
        ...prev,
        options: [...(prev.options || []), '']
      }));
    }
  }, [editFormData.options]);

  const removeOption = useCallback((index) => {
    if (newQuestion.options.length > 2) {
      const newOptions = newQuestion.options.filter((_, i) => i !== index);
      setNewQuestion(prev => ({
        ...prev,
        options: newOptions,
        correctAnswerIndex: prev.correctAnswerIndex >= index && prev.correctAnswerIndex > 0 
          ? prev.correctAnswerIndex - 1 
          : prev.correctAnswerIndex
      }));
    }
  }, [newQuestion.options.length, newQuestion.correctAnswerIndex]);

  const removeEditOption = useCallback((index) => {
    if ((editFormData.options || []).length > 2) {
      const newOptions = editFormData.options.filter((_, i) => i !== index);
      setEditFormData(prev => ({
        ...prev,
        options: newOptions,
        correctAnswerIndex: prev.correctAnswerIndex >= index && prev.correctAnswerIndex > 0 
          ? prev.correctAnswerIndex - 1 
          : prev.correctAnswerIndex
      }));
    }
  }, [editFormData.options, editFormData.correctAnswerIndex]);

  // Acceptable answers management for text questions
  const handleAcceptableAnswerChange = useCallback((index, value) => {
    const newAnswers = [...newQuestion.acceptableAnswers];
    newAnswers[index] = value;
    setNewQuestion(prev => ({
      ...prev,
      acceptableAnswers: newAnswers
    }));
  }, [newQuestion.acceptableAnswers]);

  const handleEditAcceptableAnswerChange = useCallback((index, value) => {
    const newAnswers = [...(editFormData.acceptableAnswers || [])];
    newAnswers[index] = value;
    setEditFormData(prev => ({
      ...prev,
      acceptableAnswers: newAnswers
    }));
  }, [editFormData.acceptableAnswers]);

  const addAcceptableAnswer = useCallback(() => {
    setNewQuestion(prev => ({
      ...prev,
      acceptableAnswers: [...prev.acceptableAnswers, '']
    }));
  }, []);

  const addEditAcceptableAnswer = useCallback(() => {
    setEditFormData(prev => ({
      ...prev,
      acceptableAnswers: [...(prev.acceptableAnswers || []), '']
    }));
  }, []);

  const removeAcceptableAnswer = useCallback((index) => {
    setNewQuestion(prev => ({
      ...prev,
      acceptableAnswers: prev.acceptableAnswers.filter((_, i) => i !== index)
    }));
  }, []);

  const removeEditAcceptableAnswer = useCallback((index) => {
    setEditFormData(prev => ({
      ...prev,
      acceptableAnswers: (prev.acceptableAnswers || []).filter((_, i) => i !== index)
    }));
  }, []);

  // ENHANCED QUESTION MANAGEMENT WITH PROPER BACKEND INTEGRATION
  const handleAddQuestion = useCallback(async () => {
    if (!newQuestion.question.trim()) {
      alert('Question text is required');
      return;
    }

    if (newQuestion.type === 'multiple-choice') {
      const validOptions = newQuestion.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        alert('Multiple choice questions need at least 2 valid options');
        return;
      }
      if (newQuestion.correctAnswerIndex >= validOptions.length) {
        alert('Please select a valid correct answer');
        return;
      }
    }

    if (newQuestion.type === 'true-false' && !newQuestion.correctAnswer) {
      alert('Please select the correct answer for true/false question');
      return;
    }

    try {
      setSubmitLoading(true);
      
      // Prepare question data for backend
      const questionData = {
        type: newQuestion.type,
        question: newQuestion.question.trim(),
        points: parseInt(newQuestion.points) || 5,
        explanation: newQuestion.explanation || '',
        required: newQuestion.required,
        timeLimit: newQuestion.timeLimit ? parseInt(newQuestion.timeLimit) : null,
        caseSensitive: newQuestion.caseSensitive || false,
        maxLength: newQuestion.maxLength ? parseInt(newQuestion.maxLength) : null
      };

      // Add type-specific data
      if (newQuestion.type === 'multiple-choice') {
        const validOptions = newQuestion.options.filter(opt => opt.trim());
        questionData.options = validOptions;
        questionData.correctAnswerIndex = newQuestion.correctAnswerIndex;
        questionData.correctAnswer = validOptions[newQuestion.correctAnswerIndex] || '';
      } else if (newQuestion.type === 'true-false') {
        questionData.options = ['True', 'False'];
        questionData.correctAnswer = newQuestion.correctAnswer;
        questionData.correctAnswerIndex = newQuestion.correctAnswer === 'true' ? 0 : 1;
      } else if (newQuestion.type === 'short-answer' || newQuestion.type === 'text' || newQuestion.type === 'essay') {
        questionData.acceptableAnswers = newQuestion.acceptableAnswers.filter(answer => answer.trim());
        questionData.options = [];
        questionData.correctAnswer = questionData.acceptableAnswers.length > 0 ? questionData.acceptableAnswers[0] : '';
      }

      console.log('📝 Adding question with data:', questionData);

      // Call the backend API through the parent component
      const result = await onAddQuestion(exam.id, questionData);
      
      console.log('✅ Question added successfully:', result);
      
      // Reset form and close
      resetNewQuestionForm();
      setShowAddForm(false);
      
    } catch (error) {
      console.error('❌ Error adding question:', error);
      alert(`Failed to add question: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitLoading(false);
    }
  }, [newQuestion, exam?.id, onAddQuestion, resetNewQuestionForm]);

  // ENHANCED UPDATE QUESTION HANDLER
  const handleUpdateQuestion = useCallback(async (questionId) => {
    if (!editFormData.question?.trim()) {
      alert('Question text is required');
      return;
    }

    if (editFormData.type === 'multiple-choice') {
      const validOptions = editFormData.options?.filter(opt => opt?.trim()) || [];
      if (validOptions.length < 2) {
        alert('Multiple choice questions need at least 2 valid options');
        return;
      }
      if (editFormData.correctAnswerIndex >= validOptions.length) {
        alert('Please select a valid correct answer');
        return;
      }
    }

    if (editFormData.type === 'true-false' && !editFormData.correctAnswer) {
      alert('Please select the correct answer for true/false question');
      return;
    }

    try {
      setSubmitLoading(true);
      
      // Prepare update data for backend
      const updateData = {
        type: editFormData.type,
        question: editFormData.question.trim(),
        points: parseInt(editFormData.points) || 5,
        explanation: editFormData.explanation || '',
        required: editFormData.required,
        timeLimit: editFormData.timeLimit ? parseInt(editFormData.timeLimit) : null,
        caseSensitive: editFormData.caseSensitive || false,
        maxLength: editFormData.maxLength ? parseInt(editFormData.maxLength) : null
      };

      // Add type-specific data
      if (editFormData.type === 'multiple-choice') {
        const validOptions = editFormData.options?.filter(opt => opt?.trim()) || [];
        updateData.options = validOptions;
        updateData.correctAnswerIndex = editFormData.correctAnswerIndex;
        updateData.correctAnswer = validOptions[editFormData.correctAnswerIndex] || '';
      } else if (editFormData.type === 'true-false') {
        updateData.options = ['True', 'False'];
        updateData.correctAnswer = editFormData.correctAnswer;
        updateData.correctAnswerIndex = editFormData.correctAnswer === 'true' ? 0 : 1;
      } else if (editFormData.type === 'short-answer' || editFormData.type === 'text' || editFormData.type === 'essay') {
        updateData.acceptableAnswers = editFormData.acceptableAnswers?.filter(answer => answer?.trim()) || [];
        updateData.options = [];
        updateData.correctAnswer = updateData.acceptableAnswers.length > 0 ? updateData.acceptableAnswers[0] : '';
      }

      console.log('🔄 Updating question with data:', updateData);

      // Call the backend API through the parent component
      await onUpdateQuestion(exam.id, questionId, updateData);
      
      console.log('✅ Question updated successfully');
      
      // Close edit form
      setEditingQuestion(null);
      setEditFormData({});
      
    } catch (error) {
      console.error('❌ Error updating question:', error);
      alert(`Failed to update question: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitLoading(false);
    }
  }, [editFormData, exam?.id, onUpdateQuestion]);

  // ENHANCED DELETE QUESTION HANDLER
  const handleDeleteQuestion = useCallback(async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        setSubmitLoading(true);
        
        console.log('🗑️ Deleting question:', questionId);
        
        // Call the backend API through the parent component
        await onDeleteQuestion(exam.id, questionId);
        
        console.log('✅ Question deleted successfully');
        
        // Clear selection if this question was selected
        setSelectedQuestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(questionId);
          return newSet;
        });

        // Close edit form if this question was being edited
        if (editingQuestion === questionId) {
          setEditingQuestion(null);
          setEditFormData({});
        }
        
      } catch (error) {
        console.error('❌ Error deleting question:', error);
        alert(`Failed to delete question: ${error.message || 'Unknown error'}`);
      } finally {
        setSubmitLoading(false);
      }
    }
  }, [exam?.id, onDeleteQuestion, editingQuestion]);

  // Start editing a question
  const startEditingQuestion = useCallback((question) => {
    setEditingQuestion(question.id);
    setEditFormData({
      type: question.type,
      question: question.question,
      options: [...(question.options || [])],
      correctAnswer: question.correctAnswer,
      correctAnswerIndex: question.correctAnswerIndex || 0,
      points: question.points,
      explanation: question.explanation || '',
      required: question.required,
      timeLimit: question.timeLimit,
      caseSensitive: question.caseSensitive || false,
      maxLength: question.maxLength,
      acceptableAnswers: [...(question.acceptableAnswers || [])]
    });
  }, []);

  // Cancel editing
  const cancelEditing = useCallback(() => {
    setEditingQuestion(null);
    setEditFormData({});
  }, []);

  // Selection handlers
  const toggleQuestionSelection = useCallback((questionId) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedQuestions.size === questions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(questions.map(q => q.id)));
    }
  }, [selectedQuestions.size, questions]);

  // Expansion handlers
  const toggleQuestionExpansion = useCallback((questionId) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedQuestions(new Set(questions.map(q => q.id)));
  }, [questions]);

  const collapseAll = useCallback(() => {
    setExpandedQuestions(new Set());
  }, []);

  // Bulk actions
  const handleBulkAction = useCallback(async () => {
    if (selectedQuestions.size === 0 || !bulkAction) return;

    const questionIds = Array.from(selectedQuestions);

    try {
      setSubmitLoading(true);
      
      switch (bulkAction) {
        case 'delete':
          if (window.confirm(`Delete ${questionIds.length} questions?`)) {
            for (const questionId of questionIds) {
              await onDeleteQuestion(exam.id, questionId);
            }
            setSelectedQuestions(new Set());
          }
          break;
        case 'reorder':
          await onReorderQuestions(exam.id, questionIds);
          break;
        case 'points':
          const newPoints = prompt('Enter points for selected questions:');
          if (newPoints && !isNaN(parseInt(newPoints))) {
            for (const questionId of questionIds) {
              const question = questions.find(q => q.id === questionId);
              if (question) {
                await onUpdateQuestion(exam.id, questionId, { 
                  ...question, 
                  points: parseInt(newPoints) 
                });
              }
            }
            setSelectedQuestions(new Set());
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert(`Failed to perform bulk action: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitLoading(false);
    }
    
    setBulkAction('');
  }, [selectedQuestions, bulkAction, exam?.id, questions, onDeleteQuestion, onReorderQuestions, onUpdateQuestion]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e, questionId) => {
    setDraggedQuestion(questionId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(async (e, targetQuestionId) => {
    e.preventDefault();
    
    if (!draggedQuestion || draggedQuestion === targetQuestionId) {
      setDraggedQuestion(null);
      return;
    }

    try {
      const currentOrder = questions.map(q => q.id);
      const draggedIndex = currentOrder.indexOf(draggedQuestion);
      const targetIndex = currentOrder.indexOf(targetQuestionId);
      
      const newOrder = [...currentOrder];
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedQuestion);
      
      await onReorderQuestions(exam.id, newOrder);
    } catch (error) {
      console.error('Error reordering questions:', error);
      alert(`Failed to reorder questions: ${error.message || 'Unknown error'}`);
    }
    
    setDraggedQuestion(null);
  }, [draggedQuestion, questions, exam?.id, onReorderQuestions]);

  // Question type icon component
  const QuestionTypeIcon = ({ type }) => {
    const iconMap = {
      'multiple-choice': CheckSquare,
      'true-false': Square,
      'short-answer': Type,
      'text': FileText,
      'essay': BookOpen,
      'fill-in-blank': Edit
    };
    const Icon = iconMap[type] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  // Validation helper
  const validateQuestion = useCallback((question) => {
    if (!question.question?.trim()) return false;
    if (question.points < 1 || question.points > 100) return false;
    
    if (question.type === 'multiple-choice') {
      const validOptions = question.options?.filter(opt => opt?.trim()) || [];
      if (validOptions.length < 2) return false;
      if (question.correctAnswerIndex >= validOptions.length) return false;
    }
    
    if (question.type === 'true-false' && !question.correctAnswer) return false;
    
    return true;
  }, []);

  const isFormValid = validateQuestion(newQuestion);

  if (!exam) {
    return (
      <div className={styles.emptyState}>
        <FileText className={styles.emptyIcon} />
        <h3>Select an exam to manage questions</h3>
      </div>
    );
  }

  return (
    <div className={`${styles.examQuestionManager} ${className}`}>
      {/* Header */}
      <div className={styles.questionManagerHeader}>
        <div className={styles.headerLeft}>
          <h3 className={styles.headerTitle}>
            <FileText className="h-5 w-5" />
            Questions for: {exam.title}
          </h3>
          <div className={styles.headerStats}>
            <span className={styles.statItem}>
              <Hash className="h-4 w-4" />
              {questions.length} questions
            </span>
            <span className={styles.statItem}>
              <Target className="h-4 w-4" />
              {questions.reduce((sum, q) => sum + (q.points || 0), 0)} total points
            </span>
          </div>
        </div>
        <div className={styles.headerActions}>
          {questions.length > 0 && (
            <>
              <button
                onClick={expandAll}
                className={`${styles.actionBtn} ${styles.secondary}`}
                title="Expand all questions"
                disabled={submitLoading}
              >
                <ChevronDown className="h-4 w-4" />
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className={`${styles.actionBtn} ${styles.secondary}`}
                title="Collapse all questions"
                disabled={submitLoading}
              >
                <ChevronUp className="h-4 w-4" />
                Collapse All
              </button>
            </>
          )}
          <button
            onClick={() => setShowAddForm(true)}
            disabled={loading || submitLoading}
            className={`${styles.actionBtn} ${styles.primary}`}
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedQuestions.size > 0 && (
        <div className={styles.bulkActions}>
          <div className={styles.bulkControls}>
            <span className={styles.bulkCount}>
              {selectedQuestions.size} question{selectedQuestions.size !== 1 ? 's' : ''} selected
            </span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className={styles.bulkSelect}
              disabled={submitLoading}
            >
              <option value="">Bulk Actions</option>
              <option value="delete">Delete Selected</option>
              <option value="points">Set Points</option>
              <option value="reorder">Move to Top</option>
            </select>
            <button
              onClick={handleBulkAction}
              disabled={!bulkAction || submitLoading}
              className={styles.bulkApplyBtn}
            >
              {submitLoading ? 'Processing...' : 'Apply'}
            </button>
            <button
              onClick={() => setSelectedQuestions(new Set())}
              className={styles.bulkClearBtn}
              disabled={submitLoading}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Add Question Form */}
      {showAddForm && (
        <div className={styles.addQuestionForm}>
          <div className={styles.formHeader}>
            <h4 className={styles.formTitle}>
              <Plus className="h-5 w-5" />
              Add New Question
            </h4>
            <button
              onClick={() => {
                setShowAddForm(false);
                resetNewQuestionForm();
              }}
              className={styles.formCloseBtn}
              disabled={submitLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className={styles.formContent}>
            <div className={styles.formGrid}>
              {/* Question Type */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>Question Type</label>
                <select
                  value={newQuestion.type}
                  onChange={(e) => handleQuestionTypeChange(e.target.value)}
                  className={styles.formSelect}
                  disabled={submitLoading}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="short-answer">Short Answer</option>
                  <option value="essay">Essay</option>
                </select>
              </div>

              {/* Points */}
              <div className={styles.formField}>
                <label className={styles.formLabel}>Points</label>
                <input
                  type="number"
                  value={newQuestion.points}
                  onChange={(e) => setNewQuestion(prev => ({
                    ...prev,
                    points: parseInt(e.target.value) || 1
                  }))}
                  className={styles.formInput}
                  min="1"
                  max="100"
                  disabled={submitLoading}
                />
              </div>

              {/* Question Text */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label className={styles.formLabel}>Question Text *</label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion(prev => ({
                    ...prev,
                    question: e.target.value
                  }))}
                  className={styles.formTextarea}
                  placeholder="Enter your question here..."
                  rows={3}
                  required
                  disabled={submitLoading}
                />
              </div>

              {/* Multiple Choice Options */}
              {newQuestion.type === 'multiple-choice' && (
                <div className={`${styles.formField} ${styles.fullWidth}`}>
                  <label className={styles.formLabel}>Answer Options</label>
                  <div className={styles.optionsContainer}>
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className={styles.optionRow}>
                        <div className={styles.optionInputGroup}>
                          <span className={styles.optionLetter}>
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className={styles.optionInput}
                            placeholder={`Option ${index + 1}`}
                            disabled={submitLoading}
                          />
                          <label className={styles.correctOptionLabel}>
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={newQuestion.correctAnswerIndex === index}
                              onChange={() => setNewQuestion(prev => ({
                                ...prev,
                                correctAnswerIndex: index,
                                correctAnswer: option
                              }))}
                              disabled={submitLoading}
                            />
                            <span>Correct</span>
                          </label>
                          {newQuestion.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className={styles.removeOptionBtn}
                              title="Remove option"
                              disabled={submitLoading}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {newQuestion.options.length < 6 && (
                      <button
                        type="button"
                        onClick={addOption}
                        className={styles.addOptionBtn}
                        disabled={submitLoading}
                      >
                        <Plus className="h-4 w-4" />
                        Add Option
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* True/False Options */}
              {newQuestion.type === 'true-false' && (
                <div className={`${styles.formField} ${styles.fullWidth}`}>
                  <label className={styles.formLabel}>Correct Answer</label>
                  <div className={styles.trueFalseOptions}>
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name="trueFalseAnswer"
                        value="true"
                        checked={newQuestion.correctAnswer === 'true'}
                        onChange={(e) => setNewQuestion(prev => ({
                          ...prev,
                          correctAnswer: e.target.value
                        }))}
                        disabled={submitLoading}
                      />
                      <span>True</span>
                    </label>
                    <label className={styles.radioOption}>
                      <input
                        type="radio"
                        name="trueFalseAnswer"
                        value="false"
                        checked={newQuestion.correctAnswer === 'false'}
                        onChange={(e) => setNewQuestion(prev => ({
                          ...prev,
                          correctAnswer: e.target.value
                        }))}
                        disabled={submitLoading}
                      />
                      <span>False</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Short Answer / Text Questions */}
              {(newQuestion.type === 'short-answer' || newQuestion.type === 'text') && (
                <div className={`${styles.formField} ${styles.fullWidth}`}>
                  <label className={styles.formLabel}>Acceptable Answers (for auto-grading)</label>
                  <div className={styles.acceptableAnswers}>
                    {newQuestion.acceptableAnswers.map((answer, index) => (
                      <div key={index} className={styles.answerRow}>
                        <input
                          type="text"
                          value={answer}
                          onChange={(e) => handleAcceptableAnswerChange(index, e.target.value)}
                          className={styles.answerInput}
                          placeholder={`Acceptable answer ${index + 1}`}
                          disabled={submitLoading}
                        />
                        <button
                          type="button"
                          onClick={() => removeAcceptableAnswer(index)}
                          className={styles.removeAnswerBtn}
                          title="Remove answer"
                          disabled={submitLoading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addAcceptableAnswer}
                      className={styles.addAnswerBtn}
                      disabled={submitLoading}
                    >
                      <Plus className="h-4 w-4" />
                      Add Acceptable Answer
                    </button>
                  </div>
                  
                  <div className={styles.textQuestionOptions}>
                    <label className={styles.checkboxOption}>
                      <input
                        type="checkbox"
                        checked={newQuestion.caseSensitive}
                        onChange={(e) => setNewQuestion(prev => ({
                          ...prev,
                          caseSensitive: e.target.checked
                        }))}
                        disabled={submitLoading}
                      />
                      <span>Case Sensitive</span>
                    </label>
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Max Length (optional)</label>
                      <input
                        type="number"
                        value={newQuestion.maxLength || ''}
                        onChange={(e) => setNewQuestion(prev => ({
                          ...prev,
                          maxLength: e.target.value ? parseInt(e.target.value) : null
                        }))}
                        className={styles.formInput}
                        placeholder="No limit"
                        disabled={submitLoading}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Explanation */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <label className={styles.formLabel}>Explanation (optional)</label>
                <textarea
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion(prev => ({
                    ...prev,
                    explanation: e.target.value
                  }))}
                  className={styles.formTextarea}
                  placeholder="Explain the correct answer..."
                  rows={2}
                  disabled={submitLoading}
                />
              </div>

              {/* Advanced Options */}
              <div className={`${styles.formField} ${styles.fullWidth}`}>
                <div className={styles.advancedOptions}>
                  <label className={styles.checkboxOption}>
                    <input
                      type="checkbox"
                      checked={newQuestion.required}
                      onChange={(e) => setNewQuestion(prev => ({
                        ...prev,
                        required: e.target.checked
                      }))}
                      disabled={submitLoading}
                    />
                    <span>Required Question</span>
                  </label>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Time Limit (seconds, optional)</label>
                    <input
                      type="number"
                      value={newQuestion.timeLimit || ''}
                      onChange={(e) => setNewQuestion(prev => ({
                        ...prev,
                        timeLimit: e.target.value ? parseInt(e.target.value) : null
                      }))}
                      className={styles.formInput}
                      placeholder="No limit"
                      disabled={submitLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                onClick={handleAddQuestion}
                disabled={!isFormValid || loading || submitLoading}
                className={`${styles.actionBtn} ${styles.primary}`}
              >
                {submitLoading ? 'Adding...' : 'Add Question'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetNewQuestionForm();
                }}
                className={`${styles.actionBtn} ${styles.secondary}`}
                disabled={submitLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      {questions.length > 0 && (
        <div className={styles.questionsList}>
          <div className={styles.listHeader}>
            <label className={styles.selectAllCheckbox}>
              <input
                type="checkbox"
                checked={selectedQuestions.size === questions.length && questions.length > 0}
                onChange={toggleSelectAll}
                disabled={submitLoading}
              />
              <span>Select All</span>
            </label>
            <span className={styles.questionsCount}>
              {questions.length} question{questions.length !== 1 ? 's' : ''}
            </span>
          </div>

          {questions.map((question, index) => (
            <div
              key={question.id}
              className={`${styles.questionCard} ${selectedQuestions.has(question.id) ? styles.selected : ''} ${
                draggedQuestion === question.id ? styles.dragging : ''
              }`}
              draggable={!submitLoading}
              onDragStart={(e) => handleDragStart(e, question.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, question.id)}
            >
              <div className={styles.questionHeader}>
                <div className={styles.questionInfo}>
                  <label className={styles.questionCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedQuestions.has(question.id)}
                      onChange={() => toggleQuestionSelection(question.id)}
                      disabled={submitLoading}
                    />
                  </label>
                  <GripVertical className={styles.dragHandle} />
                  <QuestionTypeIcon type={question.type} />
                  <span className={styles.questionNumber}>Q{index + 1}</span>
                  <span className={styles.questionPoints}>{question.points} pts</span>
                  <span className={styles.questionTypeBadge}>{question.type}</span>
                </div>
                <div className={styles.questionActions}>
                  <button
                    onClick={() => toggleQuestionExpansion(question.id)}
                    className={`${styles.actionBtn} ${styles.icon}`}
                    title={expandedQuestions.has(question.id) ? 'Collapse' : 'Expand'}
                    disabled={submitLoading}
                  >
                    {expandedQuestions.has(question.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => startEditingQuestion(question)}
                    className={`${styles.actionBtn} ${styles.icon} ${styles.edit}`}
                    title="Edit question"
                    disabled={submitLoading}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className={`${styles.actionBtn} ${styles.icon} ${styles.delete}`}
                    title="Delete question"
                    disabled={submitLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className={styles.questionPreview}>
                <p className={styles.questionText}>{question.question}</p>
              </div>

              {/* Edit Form - Inline */}
              {editingQuestion === question.id && (
                <div className={styles.questionDetails}>
                  <div className={styles.formGrid}>
                    {/* Edit form fields similar to add form but using editFormData */}
                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Question Type</label>
                      <select
                        value={editFormData.type}
                        onChange={(e) => handleEditQuestionTypeChange(e.target.value)}
                        className={styles.formSelect}
                        disabled={submitLoading}
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                        <option value="essay">Essay</option>
                      </select>
                    </div>

                    <div className={styles.formField}>
                      <label className={styles.formLabel}>Points</label>
                      <input
                        type="number"
                        value={editFormData.points}
                        onChange={(e) => setEditFormData(prev => ({
                          ...prev,
                          points: parseInt(e.target.value) || 1
                        }))}
                        className={styles.formInput}
                        min="1"
                        max="100"
                        disabled={submitLoading}
                      />
                    </div>

                    <div className={`${styles.formField} ${styles.fullWidth}`}>
                      <label className={styles.formLabel}>Question Text *</label>
                      <textarea
                        value={editFormData.question}
                        onChange={(e) => setEditFormData(prev => ({
                          ...prev,
                          question: e.target.value
                        }))}
                        className={styles.formTextarea}
                        rows={3}
                        required
                        disabled={submitLoading}
                      />
                    </div>

                    {/* Multiple Choice Options for Edit */}
                    {editFormData.type === 'multiple-choice' && (
                      <div className={`${styles.formField} ${styles.fullWidth}`}>
                        <label className={styles.formLabel}>Answer Options</label>
                        <div className={styles.optionsContainer}>
                          {(editFormData.options || []).map((option, index) => (
                            <div key={index} className={styles.optionRow}>
                              <div className={styles.optionInputGroup}>
                                <span className={styles.optionLetter}>
                                  {String.fromCharCode(65 + index)}.
                                </span>
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => handleEditOptionChange(index, e.target.value)}
                                  className={styles.optionInput}
                                  disabled={submitLoading}
                                />
                                <label className={styles.correctOptionLabel}>
                                  <input
                                    type="radio"
                                    name={`editCorrectAnswer_${question.id}`}
                                    checked={editFormData.correctAnswerIndex === index}
                                    onChange={() => setEditFormData(prev => ({
                                      ...prev,
                                      correctAnswerIndex: index,
                                      correctAnswer: option
                                    }))}
                                    disabled={submitLoading}
                                  />
                                  <span>Correct</span>
                                </label>
                                {(editFormData.options || []).length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeEditOption(index)}
                                    className={styles.removeOptionBtn}
                                    disabled={submitLoading}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          {(editFormData.options || []).length < 6 && (
                            <button
                              type="button"
                              onClick={addEditOption}
                              className={styles.addOptionBtn}
                              disabled={submitLoading}
                            >
                              <Plus className="h-4 w-4" />
                              Add Option
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* True/False for Edit */}
                    {editFormData.type === 'true-false' && (
                      <div className={`${styles.formField} ${styles.fullWidth}`}>
                        <label className={styles.formLabel}>Correct Answer</label>
                        <div className={styles.trueFalseOptions}>
                          <label className={styles.radioOption}>
                            <input
                              type="radio"
                              name={`editTrueFalse_${question.id}`}
                              value="true"
                              checked={editFormData.correctAnswer === 'true'}
                              onChange={(e) => setEditFormData(prev => ({
                                ...prev,
                                correctAnswer: e.target.value
                              }))}
                              disabled={submitLoading}
                            />
                            <span>True</span>
                          </label>
                          <label className={styles.radioOption}>
                            <input
                              type="radio"
                              name={`editTrueFalse_${question.id}`}
                              value="false"
                              checked={editFormData.correctAnswer === 'false'}
                              onChange={(e) => setEditFormData(prev => ({
                                ...prev,
                                correctAnswer: e.target.value
                              }))}
                              disabled={submitLoading}
                            />
                            <span>False</span>
                          </label>
                        </div>
                      </div>
                    )}

                    <div className={`${styles.formField} ${styles.fullWidth}`}>
                      <label className={styles.formLabel}>Explanation</label>
                      <textarea
                        value={editFormData.explanation || ''}
                        onChange={(e) => setEditFormData(prev => ({
                          ...prev,
                          explanation: e.target.value
                        }))}
                        className={styles.formTextarea}
                        rows={2}
                        disabled={submitLoading}
                      />
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button
                      onClick={() => handleUpdateQuestion(question.id)}
                      disabled={submitLoading}
                      className={`${styles.actionBtn} ${styles.primary}`}
                    >
                      {submitLoading ? 'Updating...' : 'Update Question'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className={`${styles.actionBtn} ${styles.secondary}`}
                      disabled={submitLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Question Details - Read-only view */}
              {expandedQuestions.has(question.id) && editingQuestion !== question.id && (
                <div className={styles.questionDetails}>
                  {/* Multiple Choice Options */}
                  {question.type === 'multiple-choice' && question.options && (
                    <div className={styles.questionOptions}>
                      <h4>Options:</h4>
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`${styles.questionOption} ${
                            optIndex === question.correctAnswerIndex ? styles.correctOption : ''
                          }`}
                        >
                          <span className={styles.optionLetter}>
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span className={styles.optionText}>{option}</span>
                          {optIndex === question.correctAnswerIndex && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* True/False Answer */}
                  {question.type === 'true-false' && (
                    <div className={styles.trueFalseAnswer}>
                      <h4>Correct Answer:</h4>
                      <span className={styles.correctAnswer}>
                        {question.correctAnswer === 'true' ? 'True' : 'False'}
                      </span>
                    </div>
                  )}

                  {/* Text Question Details */}
                  {(question.type === 'short-answer' || question.type === 'text') && (
                    <div className={styles.textQuestionDetails}>
                      {question.acceptableAnswers && question.acceptableAnswers.length > 0 && (
                        <div className={styles.acceptableAnswers}>
                          <h4>Acceptable Answers:</h4>
                          <ul>
                            {question.acceptableAnswers.map((answer, ansIndex) => (
                              <li key={ansIndex}>{answer}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className={styles.textOptions}>
                        <span className={`${styles.optionTag} ${question.caseSensitive ? styles.enabled : styles.disabled}`}>
                          Case Sensitive: {question.caseSensitive ? 'Yes' : 'No'}
                        </span>
                        {question.maxLength && (
                          <span className={styles.optionTag}>Max Length: {question.maxLength}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  {question.explanation && (
                    <div className={styles.questionExplanation}>
                      <h4>Explanation:</h4>
                      <p>{question.explanation}</p>
                    </div>
                  )}

                  {/* Question Settings */}
                  <div className={styles.questionSettings}>
                    <span className={`${styles.settingTag} ${question.required ? styles.required : styles.optional}`}>
                      {question.required ? 'Required' : 'Optional'}
                    </span>
                    {question.timeLimit && (
                      <span className={`${styles.settingTag} ${styles.timeLimit}`}>
                        <Clock className="h-3 w-3" />
                        {question.timeLimit}s
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {questions.length === 0 && !showAddForm && (
        <div className={styles.emptyState}>
          <FileText className={styles.emptyIcon} />
          <h3>No Questions Yet</h3>
          <p>Start building your exam by adding questions. You can create multiple choice, true/false, short answer, and essay questions.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className={`${styles.actionBtn} ${styles.primary} ${styles.large}`}
            disabled={loading || submitLoading}
          >
            <Plus className="h-5 w-5" />
            Add Your First Question
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {(loading || submitLoading) && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px'
            }}></div>
            <p>{submitLoading ? 'Processing...' : 'Loading...'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamQuestionManager;