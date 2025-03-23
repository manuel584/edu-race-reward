
// Define level thresholds and names
export const RECOGNITION_LEVELS = [
  { threshold: 0, name: "Beginner" },
  { threshold: 5, name: "Bronze" },
  { threshold: 10, name: "Silver" },
  { threshold: 15, name: "Gold" },
  { threshold: 20, name: "Platinum" },
  { threshold: 25, name: "Diamond" },
  { threshold: 30, name: "Master" },
  { threshold: 35, name: "Grandmaster" },
  { threshold: 40, name: "Champion" },
  { threshold: 45, name: "Legend" }
];

/**
 * Calculate level information based on recognition count
 * @param count Number of recognitions in a category
 * @returns Level information including numeric level, name, progress percentage, and points needed for next level
 */
export const getLevelInfo = (count: number) => {
  // Ensure count is a valid number
  const recognitionCount = typeof count === 'number' && !isNaN(count) ? count : 0;
  
  // Find current level based on thresholds
  let currentLevelIndex = 0;
  
  for (let i = RECOGNITION_LEVELS.length - 1; i >= 0; i--) {
    if (recognitionCount >= RECOGNITION_LEVELS[i].threshold) {
      currentLevelIndex = i;
      break;
    }
  }
  
  // Calculate numeric level (1-based)
  const level = currentLevelIndex + 1;
  const levelName = RECOGNITION_LEVELS[currentLevelIndex].name;
  
  // Calculate progress to next level
  const currentThreshold = RECOGNITION_LEVELS[currentLevelIndex].threshold;
  const isMaxLevel = currentLevelIndex === RECOGNITION_LEVELS.length - 1;
  const nextThreshold = isMaxLevel 
    ? currentThreshold + 5 // Assume 5 more for visualization if at max level
    : RECOGNITION_LEVELS[currentLevelIndex + 1].threshold;
  
  const pointsInCurrentLevel = recognitionCount - currentThreshold;
  const pointsRequiredForNextLevel = nextThreshold - currentThreshold;
  const progress = Math.min(100, (pointsInCurrentLevel / pointsRequiredForNextLevel) * 100);
  
  // Calculate points needed for next level
  const nextLevelPoints = isMaxLevel ? 0 : nextThreshold - recognitionCount;
  
  return {
    level,
    levelName,
    progress,
    nextLevelPoints,
    currentThreshold,
    nextThreshold,
    isMaxLevel
  };
};

/**
 * Get appropriate award name for a recognition milestone
 * @param type Recognition type
 * @param level Achievement level
 * @returns Award name string
 */
export const getAwardName = (
  type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence', 
  level: number
): string => {
  const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
  const levelInfo = RECOGNITION_LEVELS[level - 1] || RECOGNITION_LEVELS[0];
  return `${typeCapitalized} ${levelInfo.name}`;
};

/**
 * Check if student has achieved a balanced recognition profile
 * @param student Student object with recognition counts
 * @returns True if student has balanced recognition
 */
export const hasBalancedRecognition = (student: { 
  helpfulness?: number; 
  respect?: number; 
  teamwork?: number; 
  excellence?: number;
}): boolean => {
  const minCount = 5; // Minimum recognitions in each category
  return (
    (student.helpfulness || 0) >= minCount &&
    (student.respect || 0) >= minCount &&
    (student.teamwork || 0) >= minCount &&
    (student.excellence || 0) >= minCount
  );
};
