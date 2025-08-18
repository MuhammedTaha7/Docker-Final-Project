import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Plus, 
  Users, 
  CalendarPlus, 
  Settings,
  ExternalLink,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  Copy
} from 'lucide-react';
import styles from './MeetingDashboard.module.css';

// Import custom hooks and utilities
import { useVideoMeeting, useMeetingForm } from '../../../Hooks/useVideoMeeting';
import { useAuth } from '../../../Context/AuthContext';
import { 
  formatMeetingTime, 
  formatDuration, 
  getMeetingTypeConfig,
  MEETING_CONSTANTS,
  generateRoomId
} from '../../../Utils/videoMeetingUtils';

// Import reusable components
import DynamicForm from '../Forms/dynamicForm';
import PopUp from '../Cards/PopUp';
import LoadingSpinner from '../../Pages/Global/Loading';
import ErrorMessage from '../../Pages/Errors/404';

const VideoMeetingDashboard = () => {
  const { authData } = useAuth();
  const {
    meetings,
    courses,
    loading,
    error,
    createMeeting,
    createInstantMeeting,
    joinMeetingFromLink,
    clearError
  } = useVideoMeeting();

  // Modal states
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // User role - MEMOIZED to prevent recalculation
  const userRole = useMemo(() => {
    return authData?.role || authData?.userType || '1300'; // Default to student
  }, [authData?.role, authData?.userType]);

  const userName = useMemo(() => {
    return authData?.name || authData?.username || 'User';
  }, [authData?.name, authData?.username]);

  // Form configurations
  const joinFormFields = useMemo(() => [
    {
      name: 'invitationLink',
      label: 'Meeting Invitation Link',
      type: 'textarea',
      required: true,
      placeholder: 'Paste your meeting invitation link here...',
      rows: 3,
      helperText: 'Paste the full invitation link you received via email or message'
    },
    {
      name: 'userName',
      label: 'Your Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your name',
      value: userName,
      disabled: !!userName,
      helperText: userName ? 'Name auto-filled from your profile' : undefined
    }
  ], [userName]);

  const scheduleFormFields = useMemo(() => {
    const fields = [];
    
    // Course selection for lecturers
    if (userRole === '1200') {
      if (courses && courses.length > 0) {
        fields.push({
          name: 'courseId',
          label: 'Select Course *',
          type: 'select',
          required: true,
          placeholder: 'Choose a course for this meeting',
          options: courses.map(course => ({
            value: course.id,
            label: `${course.code || course.id} - ${course.name}`
          })),
          helperText: 'Select the course for which this meeting is scheduled. All enrolled students will be able to join.'
        });
      } else {
        fields.push({
          name: 'courseInfo',
          label: 'Course Assignment Required',
          type: 'text',
          disabled: true,
          value: 'No courses assigned. Contact administrator.',
          helperText: 'You need to be assigned to courses before scheduling meetings'
        });
      }
    }

    // Common fields for all users
    fields.push(
      {
        name: 'title',
        label: 'Meeting Title',
        type: 'text',
        required: true,
        placeholder: 'e.g., Introduction to Data Structures'
      },
      {
        name: 'datetime',
        label: 'Date & Time',
        type: 'datetime-local',
        required: true,
        min: new Date().toISOString().slice(0, 16),
        helperText: 'Select the date and time for your meeting'
      },
      {
        name: 'duration',
        label: 'Duration',
        type: 'select',
        required: true,
        options: MEETING_CONSTANTS.DURATION_OPTIONS,
        placeholder: 'Select duration'
      },
      {
        name: 'description',
        label: 'Description (Optional)',
        type: 'textarea',
        rows: 3,
        placeholder: 'Meeting agenda, topics to cover, or additional notes...'
      }
    );

    return fields;
  }, [userRole, courses]);

  // Form hooks
  const joinForm = useMeetingForm(
    useMemo(() => ({ userName, invitationLink: '' }), [userName]),
    useMemo(() => ({ 
      invitationLink: { required: true }, 
      userName: { required: true } 
    }), [])
  );

  const scheduleForm = useMeetingForm(
    useMemo(() => ({ 
      duration: '60',
      courseId: '', // Start empty so lecturer must choose
      title: '',
      datetime: '',
      description: ''
    }), []),
    useMemo(() => ({ 
      title: { required: true }, 
      datetime: { required: true },
      duration: { required: true },
      // Course required only for lecturers with available courses
      ...(userRole === '1200' && courses && courses.length > 0 ? { courseId: { required: true } } : {})
    }), [userRole, courses])
  );

  // Event handlers
  const handleNewMeeting = useCallback(() => {
    try {
      createInstantMeeting();
    } catch (error) {
      alert('Failed to create instant meeting. Please try again.');
    }
  }, [createInstantMeeting]);

  const handleJoinMeeting = useCallback(async (formData) => {
    try {
      await joinMeetingFromLink(formData.invitationLink, formData.userName);
      setShowJoinModal(false);
      joinForm.resetForm();
    } catch (error) {
      joinForm.setErrors({ invitationLink: error.message });
    }
  }, [joinMeetingFromLink, joinForm]);

  const handleScheduleMeeting = useCallback(async (formData) => {
    try {
      // Enhanced validation for lecturers
      if (userRole === '1200' && !formData.courseId) {
        scheduleForm.setErrors({ courseId: 'Please select a course for this meeting' });
        return;
      }

      // Generate room ID
      const roomId = generateRoomId({ 
        type: 'scheduled',
        courseId: formData.courseId 
      });

      const meetingData = {
        ...formData,
        roomId: roomId,
        type: 'lecture',
        status: 'scheduled',
        maxUsers: formData.courseId ? 100 : 50,
        courseId: formData.courseId || null,
        createdBy: authData.id
      };

      const createdMeeting = await createMeeting(meetingData);
      setShowScheduleModal(false);
      scheduleForm.resetForm();
      
      // Enhanced success message
      const selectedCourse = courses.find(c => c.id === formData.courseId);
      const successMessage = selectedCourse 
        ? `Meeting "${formData.title}" scheduled successfully for course "${selectedCourse.name}"! Students enrolled in this course will see it in their dashboard.`
        : `Meeting "${formData.title}" scheduled successfully!`;
      
      
    } catch (error) {
      scheduleForm.setErrors({ submit: error.message });
    }
  }, [createMeeting, scheduleForm, userRole, authData.id, courses]);

  const handleJoinScheduledMeeting = useCallback((meeting) => {
    try {
      const meetingTitle = `${meeting.courseCode || meeting.courseId} - ${meeting.title}`;
      
      window.open(
        `/meeting?room=${meeting.roomId}&userId=${authData.id}&name=${encodeURIComponent(userName)}&title=${encodeURIComponent(meetingTitle)}&courseId=${meeting.courseId}&meetingId=${meeting.id}`,
        '_blank',
        'width=1200,height=800,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=yes'
      );
    } catch (error) {
      alert('Failed to join meeting. Please try again.');
    }
  }, [authData?.id, userName]);

  // Show invitation modal
  const handleShowInvitation = useCallback((meeting) => {
    setSelectedMeeting(meeting);
    setShowInvitationModal(true);
  }, []);

  // Copy invitation link
  const handleCopyInvitation = useCallback(async (invitationLink) => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      alert('Invitation link copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = invitationLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Invitation link copied to clipboard!');
    }
  }, []);

  // Modal handlers
  const handleJoinModalClose = useCallback(() => {
    setShowJoinModal(false);
    joinForm.resetForm();
  }, [joinForm]);

  const handleScheduleModalClose = useCallback(() => {
    setShowScheduleModal(false);
    scheduleForm.resetForm();
  }, [scheduleForm]);

  const handleInvitationModalClose = useCallback(() => {
    setShowInvitationModal(false);
    setSelectedMeeting(null);
  }, []);

  // Quick actions configuration
  const quickActions = useMemo(() => [
    {
      icon: Plus,
      title: 'New Meeting',
      subtitle: 'Start an instant meeting',
      gradientClass: styles.gradientOrange,
      action: handleNewMeeting,
      description: 'Opens in new tab'
    },
    {
      icon: Users,
      title: 'Join Meeting',
      subtitle: 'via invitation link',
      gradientClass: styles.gradientBlue,
      action: () => setShowJoinModal(true),
      description: 'Join existing meeting'
    },
    {
      icon: CalendarPlus,
      title: 'Schedule Meeting',
      subtitle: userRole === '1200' ? 'Schedule for course' : 'Plan your meeting',
      gradientClass: styles.gradientPurple,
      action: () => setShowScheduleModal(true),
      description: 'Plan ahead',
      disabled: (userRole === '1200' && (!courses || courses.length === 0)) || loading
    }
  ], [handleNewMeeting, userRole, courses, loading]);

  // Meeting filtering
  const upcomingMeetings = useMemo(() => {
    if (!meetings || meetings.length === 0) {
      return [];
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    
    const filtered = meetings
      .filter(meeting => {
        const meetingTime = new Date(meeting.datetime || meeting.scheduledAt);
        
        // Show meetings that are:
        // 1. Active right now, OR
        // 2. Scheduled for future, OR  
        // 3. Recent past (within 24 hours)
        return meeting.status === 'active' || 
               meetingTime > now || 
               meetingTime > twentyFourHoursAgo;
      })
      .sort((a, b) => {
        const timeA = new Date(a.datetime || a.scheduledAt);
        const timeB = new Date(b.datetime || b.scheduledAt);
        return timeA - timeB;
      });

    return filtered.slice(0, 10);
  }, [meetings]);

  // Loading state
  if (loading && meetings.length === 0) {
    return (
      <div className={styles.container}>
        <LoadingSpinner message="Loading your meetings..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoContainer}>
            <Video style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <h1 className={styles.headerTitle}>Video Meeting Hub</h1>
          <span className={styles.userRole}>
            {userRole === '1200' ? '👨‍🏫' : '👨‍🎓'} {userRole === '1200' ? 'Lecturer' : 'Student'}
          </span>
        </div>
        
        {upcomingMeetings.length > 0 && (
          <div className={styles.nextMeetingBadge}>
            <span className={styles.nextMeetingText}>
              Next: {upcomingMeetings[0].title} at {formatMeetingTime(upcomingMeetings[0].datetime || upcomingMeetings[0].scheduledAt).time}
            </span>
          </div>
        )}
        
        <Settings className={styles.settingsIcon} />
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onDismiss={clearError}
          className={styles.errorMessage}
        />
      )}

      {/* Time Display */}
      <div className={styles.timeDisplay}>
        <div className={styles.currentTime}>
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </div>
        <div className={styles.currentDate}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className={styles.quickActionsGrid}>
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`${styles.actionButton} ${action.gradientClass}`}
            disabled={loading || action.disabled}
            title={action.disabled ? 'No courses available' : ''}
          >
            <div className={styles.actionIconContainer}>
              <action.icon style={{ width: '32px', height: '32px' }} />
            </div>
            
            <h3 className={styles.actionTitle}>
              {action.title}
            </h3>
            
            <p className={styles.actionSubtitle}>
              {action.subtitle}
              {action.description && (
                <span style={{ display: 'block', fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                  <ExternalLink size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {action.description}
                </span>
              )}
            </p>
          </button>
        ))}
      </div>

      {/* Course Information Cards */}
      {userRole === '1200' && (!courses || courses.length === 0) && !loading && (
        <div className={styles.infoCard}>
          <AlertTriangle size={20} />
          <p>You are not assigned to any courses yet. Contact your administrator to get course assignments before scheduling meetings.</p>
        </div>
      )}

      {userRole === '1300' && (!courses || courses.length === 0) && !loading && (
        <div className={styles.infoCard}>
          <AlertTriangle size={20} />
          <p>You are not enrolled in any courses yet. Contact your administrator to get enrolled.</p>
        </div>
      )}

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <div className={styles.upcomingMeetingsContainer}>
          <div className={styles.upcomingMeetingsHeader}>
            <div className={styles.upcomingMeetingsIcon}>
              <Calendar style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <h2 className={styles.upcomingMeetingsTitle}>
              {userRole === '1200' ? 'Your Scheduled Classes' : 'Available Classes'}
            </h2>
          </div>
          
          <div className={styles.meetingsList}>
            {upcomingMeetings.map((meeting, index) => {
              const timeFormatted = formatMeetingTime(meeting.datetime || meeting.scheduledAt);
              const typeConfig = getMeetingTypeConfig(meeting.type, index);
              
              return (
                <div key={meeting.id} className={styles.meetingItem}>
                  <div className={styles.meetingItemLeft}>
                    <div 
                      className={styles.meetingItemIcon}
                      style={{
                        backgroundColor: typeConfig.color,
                        color: 'white'
                      }}
                    >
                      {meeting.type === 'lecture' ? (
                        <GraduationCap style={{ width: '20px', height: '20px' }} />
                      ) : meeting.type === 'office_hours' ? (
                        <Users style={{ width: '20px', height: '20px' }} />
                      ) : (
                        <Video style={{ width: '20px', height: '20px' }} />
                      )}
                    </div>
                    <div>
                      <h4 className={styles.meetingItemTitle}>{meeting.title}</h4>
                      <p className={styles.meetingItemTime}>
                        {timeFormatted.dayRelative} at {timeFormatted.time} • {formatDuration(meeting.duration)}
                      </p>
                      <p className={styles.meetingCourseInfo}>
                        <BookOpen size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        {meeting.courseName || meeting.courseCode || 'No course'} • {meeting.studentsCount || 0} students
                      </p>
                    </div>
                  </div>
                  
                  <div className={styles.meetingActions}>
                    <button 
                      onClick={() => handleJoinScheduledMeeting(meeting)}
                      className={styles.joinMeetingButton}
                      title="Join meeting in new tab"
                      disabled={loading}
                    >
                      <Video style={{ width: '16px', height: '16px' }} />
                      {userRole === '1200' ? 'Start' : 'Join'}
                      <ExternalLink style={{ width: '12px', height: '12px', opacity: 0.8 }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Meetings State */}
      {upcomingMeetings.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <Calendar size={48} className={styles.emptyStateIcon} />
          <h3>No meetings available</h3>
          <p>
            {userRole === '1200' 
              ? 'Schedule a meeting for your courses to get started.'
              : 'Meetings will appear here when your lecturers schedule them.'
            }
          </p>
        </div>
      )}

      {/* Join Meeting Modal */}
      {showJoinModal && (
        <PopUp
          isOpen={showJoinModal}
          onClose={handleJoinModalClose}
          size="medium"
          closeOnOverlay={true}
        >
          <DynamicForm
            title="Join Meeting"
            subtitle="Enter your meeting details to join"
            icon={Users}
            fields={joinFormFields}
            initialData={joinForm.formData}
            onSubmit={joinForm.submitForm(handleJoinMeeting)}
            onCancel={handleJoinModalClose}
            onFieldChange={joinForm.updateField}
            submitText="Join Meeting"
            cancelText="Cancel"
            loading={joinForm.loading}
            errors={joinForm.errors}
            showHeader={true}
            showFooter={true}
          />
        </PopUp>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <PopUp
          isOpen={showScheduleModal}
          onClose={handleScheduleModalClose}
          size="medium"
          closeOnOverlay={true}
        >
          <DynamicForm
            title={userRole === '1200' ? 'Schedule Class Meeting' : 'Schedule Meeting'}
            subtitle={`Set up a new meeting${userRole === '1200' ? ' for your course' : ''}`}
            icon={CalendarPlus}
            fields={scheduleFormFields}
            initialData={scheduleForm.formData}
            onSubmit={scheduleForm.submitForm(handleScheduleMeeting)}
            onCancel={handleScheduleModalClose}
            onFieldChange={scheduleForm.updateField}
            submitText="Schedule Meeting"
            cancelText="Cancel"
            loading={scheduleForm.loading}
            errors={scheduleForm.errors}
            showHeader={true}
            showFooter={true}
          />
        </PopUp>
      )}

      {/* Invitation Modal */}
      {showInvitationModal && selectedMeeting && (
        <PopUp
          isOpen={showInvitationModal}
          onClose={handleInvitationModalClose}
          size="medium"
          closeOnOverlay={true}
        >
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Meeting Invitation</h2>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <h3>{selectedMeeting.title}</h3>
              <p style={{ color: '#666', margin: '5px 0' }}>
                {selectedMeeting.courseName && `Course: ${selectedMeeting.courseName}`}
              </p>
              <p style={{ color: '#666', margin: '5px 0' }}>
                {formatMeetingTime(selectedMeeting.datetime || selectedMeeting.scheduledAt).full}
              </p>
            </div>
            
            <div style={{ 
              background: '#f5f5f5', 
              padding: '15px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Invitation Link:
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value={selectedMeeting.invitationLink || `${window.location.origin}/meeting?room=${selectedMeeting.roomId}&meetingId=${selectedMeeting.id}`}
                  readOnly
                  style={{ 
                    flex: 1, 
                    padding: '8px', 
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <button 
                  onClick={() => handleCopyInvitation(selectedMeeting.invitationLink || `${window.location.origin}/meeting?room=${selectedMeeting.roomId}&meetingId=${selectedMeeting.id}`)}
                  style={{
                    padding: '8px 16px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Copy size={16} />
                  Copy
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={handleInvitationModalClose}
                style={{
                  padding: '10px 20px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </PopUp>
      )}
    </div>
  );
};

export default VideoMeetingDashboard;