import React from 'react';
import DayColumn from './DayColumn';
import TimeColumn from './TimeColumn';
import WeekDaysHeader from './WeekDaysHeader';
import { TIME_SLOTS } from '../../../Static/timeUtils';
import '../../../CSS/Components/BigCalendar/CalendarGrid.css';

const CalendarGrid = ({ 
  weekDates, 
  events, 
  currentDate, 
  onEventHover, 
  onEventLeave 
}) => {
  return (
    <div className="calendar-grid">
      {/* Week Days Header Row */}
      <WeekDaysHeader 
        weekDates={weekDates} 
        currentDate={currentDate} 
      />
      
      {/* Calendar Body with Time Column and Day Columns */}
      <div className="calendar-body">
        {/* Time Slots Column */}
        <TimeColumn timeSlots={TIME_SLOTS} />
        
        {/* Days Container */}
        <div className="days-container">
          {weekDates.map((date, index) => (
            <DayColumn
              key={index}
              date={date}
              dayIndex={index}
              events={events}
              currentDate={currentDate}
              timeSlots={TIME_SLOTS}
              onEventHover={onEventHover}
              onEventLeave={onEventLeave}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;