import React from 'react';
// ✅ Import the corrected utility functions
import { getEventPosition, formatTime, getEventStyle, getCourseIcon } from '../../../Static/eventUtils';
import '../../../CSS/Components/BigCalendar/EventCard.css';

const EventCard = ({ event, dayIndex, onHover, onLeave }) => {
  // ✅ Calculate position using startTime and endTime from the event prop
  const position = getEventPosition(event.start, event.end);

  // ✅ Get styling based on the event's type
  const eventStyle = getEventStyle(event.type); 

  // ✅ Format times directly from the event's properties
  const startTime = formatTime(event.start);
  const endTime = formatTime(event.end);

  // ✅ Get the icon using your function
  const icon = getCourseIcon(event.title);

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isRightSide = dayIndex >= 4;
    const pos = {
      x: isRightSide ? rect.left - 320 : rect.right + 10, // Adjusted tooltip position
      y: rect.top
    };
    onHover(event, pos);
  };

  return (
    <div
      className="event-card"
      style={{
        top: `${position.top}px`,
        // Set a minimum height of 30px
        height: `${Math.max(position.height, 30)}px`, 
        background: `linear-gradient(135deg, ${eventStyle.bg}dd, ${eventStyle.bg}ee)`,
        color: eventStyle.text,
        borderLeftColor: eventStyle.bg,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
    >
      <div className="event-overlay"></div>
      <div className="event-content">
        <div className="event-title">{icon} {event.title}</div>

        {/* ✅ Use the correct property names: 'instructorName' and 'location' */}
        {event.instructorName && <div className="event-details">👨‍🏫 {event.instructorName}</div>}
        {event.location && <div className="event-details">📍 {event.location}</div>}

        <div className="event-time">
            {startTime} - {endTime}
        </div>
      </div>
    </div>
  );
};

export default EventCard;