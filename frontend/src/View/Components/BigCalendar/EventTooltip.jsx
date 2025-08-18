import React from 'react';
import BaseCard from './BaseCard';
// Import the necessary utility functions
import { getEventStyle, getCourseIcon, formatTime, timeToMinutes } from '../../../Static/eventUtils';
import '../../../CSS/Components/BigCalendar/EventTooltip.css';

const EventTooltip = ({ event, position }) => {
  // Get style based on the event's TYPE
  const eventStyle = getEventStyle(event.type);
  
  // Format start and end times directly from the event data
  const startTime = formatTime(event.start);
  const endTime = formatTime(event.end);

  // Calculate duration in minutes for display
  const duration = event.end && event.start 
    ? timeToMinutes(event.end) - timeToMinutes(event.start) 
    : 0;

  const tooltipStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`
  };

  return (
    <div className="event-tooltip" style={tooltipStyle}>
      <BaseCard className="tooltip-card">
        <div className="tooltip-content">
          <div 
            className="tooltip-accent"
            style={{ backgroundColor: eventStyle.bg }}
          />
          
          <div className="tooltip-header">
            <div className="professor-avatar">
              <img 
                src={event.instructorImage} 
                alt={event.instructorName}
                className="avatar-image"
                // Fallback logic in case image fails to load
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="avatar-fallback">
                <span>👨‍🏫</span>
              </div>
            </div>
            
            <div className="event-info">
              <div className="badges">
                <span 
                  className="type-badge"
                  style={{ backgroundColor: eventStyle.bg }}
                >
                  {event.type}
                </span>
              </div>
              <h3 className="event-title">{event.title}</h3>
              <div className="event-date">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
          
          <div className="tooltip-details">
            {/* Use the correct property: event.instructorName */}
            {event.instructorName && (
              <div className="detail-item">
                <div className="detail-icon professor-icon"><span>👨‍🏫</span></div>
                <div className="detail-content">
                  <div className="detail-label">Professor</div>
                  <div className="detail-value">{event.instructorName}</div>
                </div>
              </div>
            )}
            
            {/* Use the correct property: event.location */}
            {event.location && (
              <div className="detail-item">
                <div className="detail-icon location-icon"><span>📍</span></div>
                <div className="detail-content">
                  <div className="detail-label">Location</div>
                  <div className="detail-value">{event.location}</div>
                </div>
              </div>
            )}
            
            {/* Correctly display the time range and duration */}
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-icon time-icon"><span>⏰</span></div>
                <div className="detail-content">
                  <div className="detail-label">Time</div>
                  <div className="detail-value">{startTime} - {endTime}</div>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-icon duration-icon"><span>⏱️</span></div>
                <div className="detail-content">
                  <div className="detail-label">Duration</div>
                  <div className="detail-value">{duration}</div>
                  <div className="detail-sub">minutes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  );
};

export default EventTooltip;