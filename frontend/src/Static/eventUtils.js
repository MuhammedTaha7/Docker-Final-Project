/**
 * Converts a time string like "09:00" or "09:00:00" to total minutes from midnight.
 * @param {string} timeStr - The time string to convert.
 * @returns {number} The total minutes from midnight.
 */
// ✅ This helper is now exported so the tooltip can use it
export const timeToMinutes = (timeStr = "00:00") => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

/**
 * ✅ REPLACED: This new version uses startTime and endTime to calculate duration internally.
 * Calculates the CSS top and height properties for an event card.
 * @param {string} startTime - The event's start time, e.g., "09:00".
 * @param {string} endTime - The event's end time, e.g., "11:00".
 * @returns {{top: number, height: number}} The position in pixels.
 */
/**
 * ✅ CORRECTED: This version now uses your calendar's specific dimensions.
 * Calculates CSS properties based on 15-minute slots.
 */
export const getEventPosition = (startTime, endTime) => {
    const startHourInMinutes = 8 * 60; // Calendar starts at 8:00 AM
    const slotHeight = 33; // Your grid uses 33px for each 15-minute slot

    const startTotalMinutes = timeToMinutes(startTime);
    const endTotalMinutes = timeToMinutes(endTime);

    const minutesFromGridStart = startTotalMinutes - startHourInMinutes;
    const durationInMinutes = Math.max(0, endTotalMinutes - startTotalMinutes);

    const startSlot = minutesFromGridStart / 15;
    const durationSlots = durationInMinutes / 15;

    return {
        top: startSlot * slotHeight,
        height: durationSlots * slotHeight
    };
};

/**
 * ✅ REPLACED: This now formats the time string to a readable 12-hour AM/PM format.
 * @param {string} timeStr - The time string, e.g., "14:30:00".
 * @returns {string} The formatted time, e.g., "2:30 PM".
 */
export const formatTime = (timeStr = "00:00") => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minutes} ${ampm}`;
};

// ✅ REMOVED getEndTime function, as we now get the end time directly from the data.

/**
 * ✅ KEPT: Your nice icon function.
 * Get appropriate icon for course type.
 */
export const getCourseIcon = (title = "") => {
    const course = title.toLowerCase();
    if (course.includes('math')) return '🔢';
    if (course.includes('physics')) return '⚛️';
    if (course.includes('chemistry')) return '🧪';
    if (course.includes('biology')) return '🧬';
    if (course.includes('computer')) return '💻';
    if (course.includes('english') || course.includes('literature')) return '📚';
    if (course.includes('history')) return '🏛️';
    if (course.includes('art')) return '🎨';
    if (course.includes('pharmacology') || course.includes('nursing') || course.includes('patient')) return '⚕️';
    return '📋';
};

/**
 * ✅ KEPT: Your event styling function.
 * Get color styling for event based on its type.
 */
export const getEventStyle = (type = 'default') => {
    const typeMap = {
        'LECTURE': { bg: '#3B82F6', text: 'white' }, // Blue
        'LAB': { bg: '#10B981', text: 'white' }, // Green
        'ASSIGNMENT': { bg: '#EF4444', text: 'white' }, // Red
        'PRACTICE': { bg: '#8B5CF6', text: 'white' }, // Purple
        'MEETING': { bg: '#6B7280', text: 'white' }, // Gray
        'PRESENTATION': { bg: '#F97316', text: 'white' }, // Orange
        'SEMINAR': { bg: '#EC4899', text: 'white' }, // Pink
        'EXAM': { bg: '#F59E0B', text: 'black' }, // Yellow
        'PROJECT': { bg: '#6366F1', text: 'white' }, // Indigo
        'default': { bg: '#14B8A6', text: 'white' }, // Teal
    };
    return typeMap[type.toUpperCase()] || typeMap.default;
};