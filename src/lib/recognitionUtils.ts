// Define level thresholds and names with color coding
export const RECOGNITION_LEVELS = [
  { threshold: 0, name: "Beginner", color: "#D3E4FD" }, // Pastel Blue
  { threshold: 5, name: "Bronze", color: "#F2FCE2" },  // Soft Green
  { threshold: 10, name: "Silver", color: "#33C3F0" }, // Vibrant Blue
  { threshold: 15, name: "Gold", color: "#6E59A5" },   // Deep Purple
  { threshold: 20, name: "Platinum", color: "#FEF7CD" }, // Soft Yellow
  { threshold: 25, name: "Diamond", color: "#FEC6A1" }, // Soft Orange
  { threshold: 30, name: "Master", color: "#E5DEFF" },  // Soft Purple
  { threshold: 35, name: "Grandmaster", color: "#FFDEE2" }, // Soft Pink
  { threshold: 40, name: "Champion", color: "#FDE1D3" }, // Soft Peach
  { threshold: 45, name: "Legend", color: "#F6F6F7" }   // Light Gray
];

// Define subcategories for each main recognition type
export const RECOGNITION_SUBCATEGORIES = {
  helpfulness: [
    { id: 'peer-support', name: 'Peer Support' },
    { id: 'tutoring', name: 'Tutoring Effectiveness' },
    { id: 'collaborative-assistance', name: 'Collaborative Assistance' }
  ],
  respect: [
    { id: 'conflict-resolution', name: 'Conflict Resolution' },
    { id: 'inclusive-behavior', name: 'Inclusive Behavior' },
    { id: 'positive-interaction', name: 'Positive Interaction' }
  ],
  teamwork: [
    { id: 'group-projects', name: 'Group Project Performance' },
    { id: 'leadership', name: 'Leadership Capabilities' },
    { id: 'problem-solving', name: 'Collaborative Problem-Solving' }
  ],
  excellence: [
    { id: 'academic-achievement', name: 'Academic Achievement' },
    { id: 'subject-mastery', name: 'Subject Mastery' },
    { id: 'innovative-thinking', name: 'Innovative Thinking' },
    { id: 'improvement', name: 'Consistent Improvement' }
  ]
};

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
  const levelColor = RECOGNITION_LEVELS[currentLevelIndex].color;
  
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
    levelColor,
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

/**
 * Get the category icon and color information
 * @param type Recognition type
 * @returns Object with icon name and color class
 */
export const getCategoryVisuals = (type: 'helpfulness' | 'respect' | 'teamwork' | 'excellence') => {
  switch (type) {
    case 'helpfulness':
      return { icon: 'HandHeart', colorClass: 'text-rose-600 bg-rose-50 border-rose-200' };
    case 'respect':
      return { icon: 'Shield', colorClass: 'text-blue-600 bg-blue-50 border-blue-200' };
    case 'teamwork':
      return { icon: 'Users', colorClass: 'text-green-600 bg-green-50 border-green-200' };
    case 'excellence':
      return { icon: 'Gem', colorClass: 'text-amber-600 bg-amber-50 border-amber-200' };
    default:
      return { icon: 'Star', colorClass: 'text-gray-600 bg-gray-50 border-gray-200' };
  }
};

/**
 * Get all students in a specific grade
 * @param students Array of all students
 * @param grade Grade to filter by
 * @returns Array of students in the specified grade
 */
export const getStudentsByGrade = (
  students: Array<{
    grade: string;
    helpfulness?: number;
    respect?: number;
    teamwork?: number;
    excellence?: number;
  }>,
  grade: string
) => {
  return students.filter(student => student.grade === grade);
};

/**
 * Calculate grade-level recognition metrics
 * @param students Array of students in a grade
 * @returns Object with aggregated metrics
 */
export const getGradeRecognitionMetrics = (
  students: Array<{
    helpfulness?: number;
    respect?: number;
    teamwork?: number;
    excellence?: number;
  }>
) => {
  // Skip calculation if no students
  if (!students.length) return {
    helpfulness: { total: 0, average: 0, averageLevel: 0 },
    respect: { total: 0, average: 0, averageLevel: 0 },
    teamwork: { total: 0, average: 0, averageLevel: 0 },
    excellence: { total: 0, average: 0, averageLevel: 0 }
  };

  // Calculate totals
  const totals = students.reduce((acc, student) => {
    return {
      helpfulness: acc.helpfulness + (student.helpfulness || 0),
      respect: acc.respect + (student.respect || 0),
      teamwork: acc.teamwork + (student.teamwork || 0),
      excellence: acc.excellence + (student.excellence || 0)
    };
  }, { helpfulness: 0, respect: 0, teamwork: 0, excellence: 0 });

  // Calculate averages
  const count = students.length;
  const averages = {
    helpfulness: totals.helpfulness / count,
    respect: totals.respect / count,
    teamwork: totals.teamwork / count,
    excellence: totals.excellence / count
  };

  // Calculate average levels
  const averageLevels = {
    helpfulness: getLevelInfo(averages.helpfulness).level,
    respect: getLevelInfo(averages.respect).level,
    teamwork: getLevelInfo(averages.teamwork).level,
    excellence: getLevelInfo(averages.excellence).level
  };

  return {
    helpfulness: { 
      total: totals.helpfulness, 
      average: averages.helpfulness, 
      averageLevel: averageLevels.helpfulness 
    },
    respect: { 
      total: totals.respect, 
      average: averages.respect, 
      averageLevel: averageLevels.respect 
    },
    teamwork: { 
      total: totals.teamwork, 
      average: averages.teamwork, 
      averageLevel: averageLevels.teamwork 
    },
    excellence: { 
      total: totals.excellence, 
      average: averages.excellence, 
      averageLevel: averageLevels.excellence 
    }
  };
};

/**
 * Get top performers in a category from a student array
 * @param students Array of students
 * @param category Recognition category to rank by
 * @param limit Maximum number of students to return
 * @returns Array of top students with their level info
 */
export const getTopPerformers = (
  students: Array<{
    id: string;
    name: string;
    helpfulness?: number;
    respect?: number;
    teamwork?: number;
    excellence?: number;
  }>,
  category: 'helpfulness' | 'respect' | 'teamwork' | 'excellence',
  limit: number = 3
) => {
  return [...students]
    .sort((a, b) => (b[category] || 0) - (a[category] || 0))
    .slice(0, limit)
    .map(student => ({
      id: student.id,
      name: student.name,
      score: student[category] || 0,
      levelInfo: getLevelInfo(student[category] || 0)
    }));
};
