import { useState, useEffect } from 'react';
import { formatTimeAgo, formatDetailedTime } from '../../../Utils/TimeUtils';

const RealTimeTimestamp = ({ 
  createdAt, 
  className = '', 
  showTooltip = true,
  updateInterval = 60000, // Update every minute
  style = {} 
}) => {
  const [timeAgo, setTimeAgo] = useState('');
  const [detailedTime, setDetailedTime] = useState('');

  // Update the timestamp display
  const updateTimestamp = () => {
    if (createdAt) {
      setTimeAgo(formatTimeAgo(createdAt));
      setDetailedTime(formatDetailedTime(createdAt));
    }
  };

  // Initial update and setup interval
  useEffect(() => {
    updateTimestamp(); // Update immediately

    // Set up interval for auto-updates
    const interval = setInterval(() => {
      updateTimestamp();
    }, updateInterval);

    // Cleanup
    return () => clearInterval(interval);
  }, [createdAt, updateInterval]);

  // Handle missing or invalid date
  if (!createdAt) {
    return (
      <span className={`timestamp ${className}`} style={style}>
        Unknown time
      </span>
    );
  }

  return (
    <span 
      className={`timestamp ${className}`} 
      style={style}
      title={showTooltip ? detailedTime : undefined}
    >
      {timeAgo}
    </span>
  );
};

export default RealTimeTimestamp;