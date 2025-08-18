import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../../CSS/Components/BigCalendar/MiniCalendar.module.css';

const MiniCalendar = ({ currentDate, onDateChange, onMonthChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    onMonthChange(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  const isSelected = (date) => {
    return date.getFullYear() === currentDate.getFullYear() &&
           date.getMonth() === currentDate.getMonth() &&
           date.getDate() === currentDate.getDate();
  };

  const getMiniCalendarDates = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const miniCalendarDates = getMiniCalendarDates();

  return (
    <div className={styles.miniCalendar}>
      <div className={styles.header}>
        <h3 className={styles.monthTitle}>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className={styles.navigation}>
          <button 
            onClick={() => navigateMonth(-1)} 
            className={styles.navButton}
            aria-label="Previous month"
          >
            <ChevronLeft className={styles.navIcon} />
          </button>
          <button 
            onClick={() => navigateMonth(1)} 
            className={styles.navButton}
            aria-label="Next month"
          >
            <ChevronRight className={styles.navIcon} />
          </button>
        </div>
      </div>
      
      <div className={styles.weekdays}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>
      
      <div className={styles.datesGrid}>
        {miniCalendarDates.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const dateClasses = [
            styles.date,
            !isCurrentMonth && styles.otherMonth,
            isSelected(date) && styles.selected,
            isToday(date) && !isSelected(date) && styles.today
          ].filter(Boolean).join(' ');
          
          return (
            <button
              key={index}
              className={dateClasses}
              onClick={() => onDateChange(new Date(date))}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;