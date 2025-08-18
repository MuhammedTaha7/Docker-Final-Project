import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './VideoMeeting.module.css';

// Import custom hooks and utilities
import { useZegoMeeting, useMeetingAttendance } from '../../../Hooks/useVideoMeeting';
import { useAuth } from '../../../Context/AuthContext';

const VideoMeeting = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { authData, loading: authLoading } = useAuth();
  
  // Extract URL parameters with useMemo to prevent re-computation
  const urlParams = useMemo(() => {
    return {
      roomID: searchParams.get('room'),
      userID: searchParams.get('userId') || authData?.id,
      userName: searchParams.get('name') || authData?.name || authData?.username || 'Guest User',
      meetingTitle: searchParams.get('title') || 'Video Meeting',
      courseId: searchParams.get('courseId'),
      meetingId: searchParams.get('meetingId')
    };
  }, [searchParams, authData?.id, authData?.name, authData?.username]);

  const { roomID, userID, userName, meetingTitle, courseId, meetingId } = urlParams;

  // Component state
  const [attendanceStarted, setAttendanceStarted] = useState(false);
  const [isLeavingMeeting, setIsLeavingMeeting] = useState(false);
  const [initializationError, setInitializationError] = useState(null);
  
  // Refs to prevent multiple operations
  const sessionStartTime = useRef(null);
  const hasLeftMeeting = useRef(false);
  const reconnectionTimer = useRef(null);
  const isInitializing = useRef(false);
  const mountedRef = useRef(true);

  // Wait for auth to load and ensure we have required data
  const shouldInitialize = useMemo(() => {
    return !authLoading && authData?.id && userID && roomID;
  }, [authLoading, authData?.id, userID, roomID]);

  // Stable parameters for hooks to prevent re-initialization
  const zegoParams = useMemo(() => {
    if (!shouldInitialize) return { roomId: null, userId: null, userName: null };
    return {
      roomId: roomID,
      userId: userID,
      userName: userName,
      meetingTitle,
      courseId,
      meetingId
    };
  }, [shouldInitialize, roomID, userID, userName, meetingTitle, courseId, meetingId]);

  const {
    zegoInstance,
    isConnected,
    participants,
    loading: zegoLoading,
    error: zegoError,
    meetingRef,
    leaveMeeting: leaveZegoMeeting,
    connectionState,
    reinitialize
  } = useZegoMeeting(
    zegoParams.roomId,
    zegoParams.userId,
    zegoParams.userName,
    zegoParams.meetingTitle,
    zegoParams.courseId,
    zegoParams.meetingId
  );

  const {
    currentSession,
    startAttendanceSession,
    endAttendanceSession,
    attendanceData
  } = useMeetingAttendance(shouldInitialize && meetingId ? meetingId : null);

  // Enhanced attendance tracking with proper session management
  useEffect(() => {
    if (!shouldInitialize || !mountedRef.current) {
      return;
    }

    const shouldStartAttendance = 
      isConnected && 
      meetingId && 
      authData?.id && 
      !currentSession && 
      !attendanceStarted &&
      !hasLeftMeeting.current &&
      !isInitializing.current;

    if (shouldStartAttendance) {
      isInitializing.current = true;
      setAttendanceStarted(true);
      sessionStartTime.current = new Date();
      
      startAttendanceSession()
        .then((session) => {
          if (mountedRef.current) {
            isInitializing.current = false;
          }
        })
        .catch(error => {
          if (mountedRef.current) {
            console.error('Failed to start attendance tracking:', error);
            setAttendanceStarted(false);
            sessionStartTime.current = null;
            isInitializing.current = false;
          }
        });
    }
  }, [isConnected, meetingId, authData?.id, currentSession, attendanceStarted, startAttendanceSession, shouldInitialize]);

  // Proper cleanup function with validation
  const cleanupAttendanceSession = useCallback(async (reason = 'unknown') => {
    if (hasLeftMeeting.current || !mountedRef.current) {
      return;
    }

    if (!currentSession?.id || !meetingId) {
      return;
    }

    hasLeftMeeting.current = true;
    setIsLeavingMeeting(true);

    try {
      await endAttendanceSession();
    } catch (error) {
      console.error('Failed to end attendance session:', error);
      
      // Fallback beacon request
      try {
        const leaveData = new Blob([JSON.stringify({
          sessionId: currentSession.id,
          leaveTime: new Date().toISOString(),
          reason: reason
        })], { type: 'application/json' });
        
        navigator.sendBeacon(
          `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/api/meetings/${meetingId}/leave`,
          leaveData
        );
      } catch (beaconError) {
        console.error('Fallback beacon failed:', beaconError);
      }
    } finally {
      if (mountedRef.current) {
        setIsLeavingMeeting(false);
      }
    }
  }, [currentSession, meetingId, endAttendanceSession]);

  // Update document title
  useEffect(() => {
    if (meetingTitle && mountedRef.current) {
      const title = participants.length > 0 
        ? `${meetingTitle} (${participants.length} participants)`
        : meetingTitle;
      document.title = title;
    }
    
    return () => {
      if (mountedRef.current) {
        document.title = 'Video Meeting';
      }
    };
  }, [meetingTitle, participants.length]);

  // Smart connection handling with reconnection grace period
  useEffect(() => {
    if (!shouldInitialize || !mountedRef.current) return;

    // Clear any existing timer
    if (reconnectionTimer.current) {
      clearTimeout(reconnectionTimer.current);
      reconnectionTimer.current = null;
    }

    if (!isConnected && attendanceStarted && !hasLeftMeeting.current) {
      reconnectionTimer.current = setTimeout(() => {
        if (!isConnected && !hasLeftMeeting.current && mountedRef.current) {
          cleanupAttendanceSession('connection_timeout');
        }
      }, 30000);
      
    } else if (isConnected && reconnectionTimer.current) {
      clearTimeout(reconnectionTimer.current);
      reconnectionTimer.current = null;
    }

    return () => {
      if (reconnectionTimer.current) {
        clearTimeout(reconnectionTimer.current);
        reconnectionTimer.current = null;
      }
    };
  }, [isConnected, attendanceStarted, cleanupAttendanceSession, shouldInitialize]);

  // Enhanced window/tab close handling
  useEffect(() => {
    if (!shouldInitialize) return;

    const handleBeforeUnload = (event) => {
      if (!hasLeftMeeting.current && currentSession?.id && meetingId) {
        try {
          const leaveData = new Blob([JSON.stringify({
            sessionId: currentSession.id,
            leaveTime: new Date().toISOString(),
            reason: 'page_unload'
          })], { type: 'application/json' });
          
          navigator.sendBeacon(
            `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/api/meetings/${meetingId}/leave`,
            leaveData
          );
          
          hasLeftMeeting.current = true;
        } catch (error) {
          console.error('Failed to send unload beacon:', error);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !hasLeftMeeting.current && currentSession?.id) {
        setTimeout(() => {
          if (document.visibilityState === 'hidden' && !hasLeftMeeting.current && mountedRef.current) {
            cleanupAttendanceSession('visibility_timeout');
          }
        }, 120000);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentSession, meetingId, cleanupAttendanceSession, shouldInitialize]);

  // Component unmount cleanup
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      
      if (reconnectionTimer.current) {
        clearTimeout(reconnectionTimer.current);
        reconnectionTimer.current = null;
      }
      
      if (!hasLeftMeeting.current && currentSession?.id && meetingId) {
        // Use beacon for cleanup on unmount
        try {
          const leaveData = new Blob([JSON.stringify({
            sessionId: currentSession.id,
            leaveTime: new Date().toISOString(),
            reason: 'component_unmount'
          })], { type: 'application/json' });
          
          navigator.sendBeacon(
            `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'}/api/meetings/${meetingId}/leave`,
            leaveData
          );
          
          hasLeftMeeting.current = true;
        } catch (error) {
          console.warn('Failed to send unmount beacon:', error);
        }
      }
    };
  }, [currentSession?.id, meetingId]);

  // Handle ZegoCloud initialization errors
  useEffect(() => {
    if (zegoError && mountedRef.current) {
      console.error('ZegoCloud Error:', zegoError);
      setInitializationError(zegoError);
      
      // Try to reinitialize after a delay for connection errors
      if (zegoError.includes('connection') || zegoError.includes('network')) {
        const retryTimer = setTimeout(() => {
          if (mountedRef.current) {
            setInitializationError(null);
            if (reinitialize) {
              reinitialize();
            }
          }
        }, 5000);
        
        return () => clearTimeout(retryTimer);
      }
    }
  }, [zegoError, reinitialize]);

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>
          Loading user authentication...
        </div>
      </div>
    );
  }

  // Early return for missing room ID
  if (!roomID) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>❌ Invalid Meeting Link</h2>
          <p>Room ID is missing from the URL.</p>
          <p>Please check your meeting link and try again.</p>
          
          <div className={styles.errorActions}>
            <button 
              onClick={() => navigate('/VideoMeetingDashboard')}
              className={styles.errorButton}
            >
              🏠 Go to Dashboard
            </button>
            <button 
              onClick={() => window.close()}
              className={styles.errorButton}
            >
              ❌ Close Window
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!authData?.id) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>🔐 Authentication Required</h2>
          <p>You need to be logged in to join this meeting.</p>
          <p>Please log in and try again.</p>
          
          <div className={styles.errorActions}>
            <button 
              onClick={() => navigate('/login')}
              className={styles.errorButton}
            >
              🔑 Go to Login
            </button>
            <button 
              onClick={() => window.close()}
              className={styles.errorButton}
            >
              ❌ Close Window
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state with retry options
  if (zegoError || initializationError) {
    const errorMessage = initializationError || zegoError;
    
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>Meeting Connection Error</h2>
          <p>{errorMessage}</p>
          
          <div className={styles.errorActions}>
            <button 
              onClick={() => {
                setInitializationError(null);
                if (reinitialize) {
                  reinitialize();
                } else {
                  window.location.reload();
                }
              }}
              className={styles.errorButton}
            >
              🔄 Retry Connection
            </button>
            <button 
              onClick={() => window.location.reload()}
              className={styles.errorButton}
            >
              🔄 Reload Page
            </button>
            <button 
              onClick={() => window.close()}
              className={styles.errorButton}
            >
              ❌ Close Window
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.meetingContainer}>
      {/* Enhanced loading state with timeout warning */}
      {(zegoLoading || !shouldInitialize) && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>
            {!shouldInitialize ? 'Preparing meeting...' : `Joining ${meetingTitle}...`}
          </div>
          {meetingId && shouldInitialize && (
            <div className={styles.loadingSubtext}>
              Preparing attendance tracking...
            </div>
          )}
          
          {/* Show reload hint after 15 seconds */}
          {zegoLoading && shouldInitialize && (
            <div className={styles.loadingSubtext} style={{ marginTop: '20px' }}>
              Taking longer than expected? 
              <button 
                onClick={() => window.location.reload()}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Reload Page
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* ZegoCloud Meeting Container */}
      <div 
        ref={meetingRef} 
        className={styles.meetingRef}
        style={{ 
          visibility: (zegoLoading || !shouldInitialize) ? 'hidden' : 'visible',
          opacity: (zegoLoading || !shouldInitialize) ? 0 : 1,
          transition: 'opacity 0.3s ease',
          width: '100%',
          height: '100%'
        }}
      />

      {/* Loading overlay for leaving state */}
      {isLeavingMeeting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          zIndex: 10000
        }}>
          <div>
            <div>Ending attendance session...</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
              Please wait while we save your attendance data
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoMeeting;