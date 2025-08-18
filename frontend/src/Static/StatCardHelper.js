/* פונקציות עזר לקביעת גריד וגאפ לפי size */

export const getColumnsForSize = (size) => {
  switch (size) {
    case "compact":  return 3;
    case "large":    return 2;
    case "xl":       return 1;
    default:         return 3;  // 'default'
  }
};

export const getGapForSize = (size) => {
  switch (size) {
    case "compact":  return "0.75rem";
    case "large":    return "1.5rem";
    case "xl":       return "2rem";
    default:         return "1rem"; // 'default'
  }
};
