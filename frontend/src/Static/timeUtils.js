export const TIME_SLOTS = (() => {
  const slots = [];
  for (let hour = 8; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 21 && minute > 0) break; // Stop at 9:00 PM
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        hour,
        minute,
        display: timeString,
        totalMinutes: hour * 60 + minute,
        isFullHour: minute === 0
      });
    }
  }
  return slots;
})();

// Convert time string (HH:MM) to total minutes
export const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};