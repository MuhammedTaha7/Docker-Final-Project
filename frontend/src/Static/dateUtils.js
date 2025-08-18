export const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get array of 7 dates for the current week (Sunday to Saturday)
export const getWeekDates = (currentDate) => {
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay(); // 0 = Sunday, 1 = Monday, etc.
  startOfWeek.setDate(startOfWeek.getDate() - day);
  
  return Array.from({length: 7}, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
};

// Check if a date is today
export const isToday = (date) => {
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
};

// Check if a date matches the currently selected date
export const isActiveDate = (date, currentDate) => {
  return date.getFullYear() === currentDate.getFullYear() &&
         date.getMonth() === currentDate.getMonth() &&
         date.getDate() === currentDate.getDate();
};