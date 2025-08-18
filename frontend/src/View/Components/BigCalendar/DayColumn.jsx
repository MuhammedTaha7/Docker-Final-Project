import React from 'react';
import EventCard from './EventCard';
import { formatDateToString, isToday, isActiveDate } from '../../../Static/dateUtils';
import '../../../CSS/Components/BigCalendar/DayColumn.css';

const DayColumn = ({ 
  date, 
  dayIndex, 
  events, 
  currentDate, 
  timeSlots, 
  onEventHover, 
  onEventLeave 
}) => {
  // Filter events for this specific day
  const dateStr = formatDateToString(date);
  const dayEvents = events.filter(event => event.date === dateStr);
  
  // Calculate day styling classes
  const todayClass = isToday(date) ? 'today' : '';
  const activeClass = isActiveDate(date, currentDate) ? 'active' : '';

  return (
    <div className={`day-column ${todayClass} ${activeClass}`}>
      {/* Time Slot Grid */}
      {timeSlots.map((slot, slotIndex) => (
        <div 
          key={slotIndex} 
          className={`time-slot ${slot.isFullHour ? 'full-hour' : ''}`}
        />
      ))}

      {/* Event Cards */}
      {dayEvents.map(event => (
        <EventCard
          key={event.id}
          event={event}
          dayIndex={dayIndex}
          onHover={onEventHover}
          onLeave={onEventLeave}
        />
      ))}
    </div>
  );
};

export default DayColumn;