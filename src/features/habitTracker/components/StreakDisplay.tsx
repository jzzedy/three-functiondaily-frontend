
import React from 'react';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ currentStreak, longestStreak }) => {
  return (
    <div className="text-xs text-gray-500 dark:text-gray-400">
      <p>Current Streak: {currentStreak} days</p>
      <p>Longest Streak: {longestStreak} days</p>
      <p>(Streak display placeholder)</p>
    </div>
  );
};
export default StreakDisplay;
