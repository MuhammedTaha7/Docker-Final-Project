import React from 'react';
import { isToday, isActiveDate } from '../../../Static/dateUtils';
import '../../../CSS/Components/BigCalendar/WeekDaysHeader.css';

const WeekDaysHeader = ({ weekDates, currentDate }) => {
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="week-header">
      {/* Empty space for time column */}
      <div className="time-header"></div>
      
      {/* Day Headers */}
      {weekDates.map((date, index) => (
        <div key={index} className="day-header">
          <div className="day-name">{daysOfWeek[index]}</div>
          <div className={`day-number ${
            isToday(date) ? 'today' : ''
          }`}>
            {date.getDate()}
          </div>
          
          {/* Day Labels */}
          {isToday(date)  && (
            <div className="day-label today-label">Today</div>
          )}
          {/* {isActiveDate(date, currentDate) && (
            <div className="day-label selected-label">Selected</div>
          )} */}
        </div>
      ))}
    </div>
  );
};

export default WeekDaysHeader;