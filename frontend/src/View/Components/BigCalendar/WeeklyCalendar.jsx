import React, { useMemo } from 'react';
import BaseCard from './BaseCard';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventTooltip from './EventTooltip';
import { getWeekDates, formatDateToString } from '../../../Static/dateUtils';
import '../../../CSS/Components/BigCalendar/WeeklyCalendar.css';

// ✅ 1. Accept 'onWeekChange' prop and use 'currentDate' directly from props
const WeeklyCalendar = ({ currentDate, events = [], onWeekChange }) => {
  // ✅ 2. REMOVED the internal, private date state
  const [hoveredEvent, setHoveredEvent] = React.useState(null);
  const [hoverPosition, setHoverPosition] = React.useState({ x: 0, y: 0 });

  const formattedEvents = useMemo(() => {
    return events.map(event => ({
      ...event,
      date: event.date.toString(),
      start: event.startTime || event.dueTime,
      end: event.endTime,
    }));
  }, [events]);

  // ✅ 3. UPDATE navigateWeek to call the parent's function
  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    onWeekChange(newDate); // This now tells the parent component to update the date
  };

  const handleEventHover = (event, position) => {
    setHoveredEvent(event);
    setHoverPosition(position);
  };

  const handleEventLeave = () => {
    setHoveredEvent(null);
  };

  const weekDates = getWeekDates(currentDate);
  
  const weekEvents = formattedEvents.filter(event => {
    const isOnThisWeek = weekDates.some(date => formatDateToString(date) === event.date);
    // This check prevents items without a start time from crashing the calendar
    return isOnThisWeek && event.start;
  });

  return (
    <div className="weekly-calendar">
      <div className="calendar-container">
        <CalendarHeader 
          weekDates={weekDates}
          onNavigate={navigateWeek}
        />
        <BaseCard className="calendar-card">
          <CalendarGrid
            weekDates={weekDates}
            events={weekEvents}
            currentDate={currentDate}
            onEventHover={handleEventHover}
            onEventLeave={handleEventLeave}
          />
        </BaseCard>
        {hoveredEvent && (
          <EventTooltip
            event={hoveredEvent}
            position={hoverPosition}
          />
        )}
      </div>
    </div>
  );
};

export default WeeklyCalendar;