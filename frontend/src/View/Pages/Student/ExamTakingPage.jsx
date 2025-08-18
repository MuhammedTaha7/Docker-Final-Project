// pages/ExamTakingPage.js - Fixed and Enhanced Implementation
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ExamTakingInterface from '../Components/student/ExamTakingInterface';
import LoadingSpinner from '../Components/Pages/Global/Loading';

export default function ExamTakingPage() {
  const [examId, setExamId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // React Router hooks for parameter extraction
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ====================================
  // EXAM ID EXTRACTION - ENHANCED
  // ====================================

  const getExamIdFromUrl = () => {
    // Method 1: URL parameters from React Router (e.g., /exam-taking/:examId)
    if (params.examId && params.examId !== 'undefined' && params.examId !== 'null') {
      console.log('📍 Exam ID from URL params:', params.examId);
      return params.examId;
    }

    // Method 2: Search parameters (e.g., ?examId=123)
    const examIdFromSearch = searchParams.get('examId');
    if (examIdFromSearch && examIdFromSearch !== 'undefined' && examIdFromSearch !== 'null') {
      console.log('📍 Exam ID from search params:', examIdFromSearch);
      return examIdFromSearch;
    }

    // Method 3: Legacy path extraction (e.g., /exam-taking/123)
    const pathParts = window.location.pathname.split('/');
    const examIdFromPath = pathParts[pathParts.length - 1];
    if (examIdFromPath && 
        examIdFromPath !== 'exam-taking' && 
        examIdFromPath !== 'undefined' && 
        examIdFromPath !== 'null' &&
        !isNaN(examIdFromPath)) {
      console.log('📍 Exam ID from path:', examIdFromPath);
      return examIdFromPath;
    }

    // Method 4: Hash parameters (e.g., #examId=123)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const examIdFromHash = hashParams.get('examId');
    if (examIdFromHash && examIdFromHash !== 'undefined' && examIdFromHash !== 'null') {
      console.log('📍 Exam ID from hash:', examIdFromHash);
      return examIdFromHash;
    }

    console.log('❌ No valid exam ID found in URL');
    return null;
  };

  // ====================================
  // INITIALIZATION EFFECT
  // ====================================

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Extract exam ID from URL
        const extractedExamId = getExamIdFromUrl();
        
        if (!extractedExamId) {
          setError('No exam ID found in URL');
          setLoading(false);
          return;
        }

        // Validate exam ID format
        if (isNaN(extractedExamId) && !/^[a-zA-Z0-9-_]+$/.test(extractedExamId)) {
          setError('Invalid exam ID format');
          setLoading(false);
          return;
        }

        setExamId(extractedExamId);
        setLoading(false);

        console.log('✅ Exam page initialized with ID:', extractedExamId);
        
      } catch (err) {
        console.error('❌ Failed to initialize exam page:', err);
        setError('Failed to initialize exam page');
        setLoading(false);
      }
    };

    initializePage();
  }, [params.examId, searchParams]);

  // ====================================
  // PAGE SETUP AND SECURITY
  // ====================================

  useEffect(() => {
    if (!examId) return;

    // Set page title for exam taking
    const originalTitle = document.title;
    document.title = `Taking Exam ${examId} - EduSphere`;
    
    // Prevent navigation away without confirmation during exam
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your exam progress will be saved.';
      return e.returnValue;
    };

    // Prevent back button during exam
    const handlePopState = (e) => {
      e.preventDefault();
      const confirmed = window.confirm('Are you sure you want to leave the exam? Your progress will be saved.');
      if (confirmed) {
        // Allow navigation
        navigate('/dashboard');
      } else {
        // Prevent navigation - push current state back
        window.history.pushState(null, null, window.location.href);
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    // Push initial state to handle back button
    window.history.pushState(null, null, window.location.href);

    // Optional security measures for exam taking
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {
      // Prevent certain keyboard shortcuts during exam
      const preventedKeys = [
        'F12', // Developer tools
        'F5',  // Refresh
      ];
      
      const preventedCombos = [
        { ctrl: true, shift: true, key: 'I' }, // Dev tools
        { ctrl: true, shift: true, key: 'C' }, // Dev tools
        { ctrl: true, shift: true, key: 'J' }, // Console
        { ctrl: true, key: 'u' },              // View source
        { ctrl: true, key: 'r' },              // Refresh
        { alt: true, key: 'F4' },              // Close window
      ];

      // Check single keys
      if (preventedKeys.includes(e.key)) {
        e.preventDefault();
        return false;
      }

      // Check key combinations
      for (const combo of preventedCombos) {
        if (
          (combo.ctrl && e.ctrlKey) &&
          (combo.shift ? e.shiftKey : !e.shiftKey) &&
          (combo.alt ? e.altKey : !e.altKey) &&
          e.key.toLowerCase() === combo.key.toLowerCase()
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    // Add security event listeners (can be disabled for testing)
    const securityEnabled = process.env.REACT_APP_EXAM_SECURITY !== 'false';
    if (securityEnabled) {
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.title = originalTitle; // Reset title
    };
  }, [examId, navigate]);

  // ====================================
  // ERROR HANDLING COMPONENT
  // ====================================

  const ExamPageError = ({ error, onRetry, onGoBack }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        maxWidth: '500px',
        padding: '2rem',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          margin: '0 auto 1rem',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#dc2626',
          fontSize: '24px'
        }}>
          ⚠️
        </div>
        
        <h2 style={{
          margin: '0 0 1rem',
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          Exam Loading Error
        </h2>
        
        <p style={{
          margin: '0 0 1.5rem',
          color: '#6b7280',
          lineHeight: '1.6'
        }}>
          {error || 'Unable to load the exam. Please check the URL and try again.'}
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {onRetry && (
            <button 
              onClick={onRetry}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              Try Again
            </button>
          )}
          
          <button 
            onClick={onGoBack || (() => navigate('/dashboard'))}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f9fafb',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f9fafb'}
          >
            Return to Dashboard
          </button>
        </div>
        
        <div style={{
          marginTop: '1.5rem',
          padding: '0.75rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          color: '#0c4a6e'
        }}>
          <strong>Expected URL formats:</strong><br/>
          • /exam-taking/123<br/>
          • /exam-taking?examId=123<br/>
          • /exam-taking#examId=123
        </div>
      </div>
    </div>
  );

  // ====================================
  // RENDER LOGIC
  // ====================================

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <LoadingSpinner message="Initializing exam..." />
      </div>
    );
  }

  // Show error state
  if (error || !examId) {
    return (
      <ExamPageError 
        error={error}
        onRetry={() => window.location.reload()}
        onGoBack={() => navigate('/dashboard')}
      />
    );
  }

  // Main exam taking interface
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    }}>
      <ExamTakingInterface examId={examId} />
    </div>
  );
}