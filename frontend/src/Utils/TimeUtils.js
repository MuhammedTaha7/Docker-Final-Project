//src/Utils/TimeUtils.js
/**
 * Utility functions for formatting timestamps in a user-friendly way
 * Converts dates like "2025-01-04T15:30:00" to "2 hours ago"
 */

export const formatTimeAgo = (dateString) => {
  try {
    // Handle different date formats
    const postDate = new Date(dateString);
    const now = new Date();
    
    // Check if date is valid
    if (isNaN(postDate.getTime())) {
      return 'just now';
    }
    
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    // Handle future dates (shouldn't happen but just in case)
    if (diffInMs < 0) {
      return 'just now';
    }

    // Less than 1 minute
    if (diffInSeconds < 60) {
      return 'just now';
    }

    // Less than 1 hour (1-59 minutes)
    if (diffInMinutes < 60) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    }

    // Less than 24 hours (1-23 hours)
    if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    }

    // Less than 2 days (show "yesterday")
    if (diffInDays === 1) {
      return 'yesterday';
    }

    // Less than 7 days (2-6 days)
    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }

    // Less than 4 weeks (1-3 weeks)
    if (diffInWeeks < 4) {
      return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
    }

    // Less than 12 months (1-11 months)
    if (diffInMonths < 12) {
      return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
    }

    // 1 year or more
    return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;

  } catch (error) {
    console.error('Error formatting time:', error);
    return 'some time ago';
  }
};

/**
 * Hook for real-time timestamp updates
 * Updates the timestamp every minute to keep it current
 */
export const useRealTimeUpdate = (callback, interval = 60000) => {
  const { useEffect, useRef } = require('react');
  const intervalRef = useRef(null);

  useEffect(() => {
    // Set up interval to update timestamps
    intervalRef.current = setInterval(() => {
      if (callback) {
        callback();
      }
    }, interval);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callback, interval]);

  // Also update immediately when component mounts
  useEffect(() => {
    if (callback) {
      callback();
    }
  }, []);
};

/**
 * Get relative time that updates automatically
 */
export const getRelativeTime = (dateString) => {
  return formatTimeAgo(dateString);
};

/**
 * Format for detailed view (like hover tooltip)
 */
export const formatDetailedTime = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Format as: "January 4, 2025 at 3:30 PM"
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting detailed time:', error);
    return 'Unknown date';
  }
};