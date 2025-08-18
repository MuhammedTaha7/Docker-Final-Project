import React from 'react';
import '../../../CSS/Components/BigCalendar/TimeColumn.css';

const TimeColumn = ({ timeSlots }) => {
  return (
    <div className="time-column">
      {timeSlots.map((slot, index) => (
        <div 
          key={index} 
          className={`time-slot ${slot.isFullHour ? 'full-hour' : ''}`}
        >
          {slot.display}
        </div>
      ))}
    </div>
  );
};

export default TimeColumn;