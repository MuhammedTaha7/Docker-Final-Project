import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../../CSS/Components/BigCalendar/CalendarHeader.css';

const CalendarHeader = ({ weekDates, onNavigate }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate header title based on week dates
  const getHeaderTitle = () => {
    const startDate = weekDates[0];
    const endDate = weekDates[6];
    
    // Check if week spans multiple months
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${months[startDate.getMonth()]} ${startDate.getDate()} - ${endDate.getDate()}, ${startDate.getFullYear()}`;
    } else {
      return `${months[startDate.getMonth()]} ${startDate.getDate()} - ${months[endDate.getMonth()]} ${endDate.getDate()}, ${startDate.getFullYear()}`;
    }
  };

  return (
    <div className="calendar-header">
      <div className="calendar-header-content">
        {/* Previous Week Button */}
        <button 
          className="calendar-nav-button"
          onClick={() => onNavigate(-1)}
          aria-label="Previous week"
        >
          <ChevronLeft className="nav-icon" />
        </button>
        
        {/* Week Title */}
        <h1 className="calendar-title">
          {getHeaderTitle()}
        </h1>
        
        {/* Next Week Button */}
        <button 
          className="calendar-nav-button"
          onClick={() => onNavigate(1)}
          aria-label="Next week"
        >
          <ChevronRight className="nav-icon" />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
