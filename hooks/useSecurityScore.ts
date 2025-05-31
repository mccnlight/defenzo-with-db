import { useState, useEffect } from 'react';
import { SecurityDetails, SecurityMetrics } from '../types/security';
import type { Course } from '@/types/course';
import type { UserProgress } from '@/types/userProgress';

// Temporary mock data for testing
const mockMetrics: SecurityMetrics = {
  coursesCompleted: 3,
  totalCourses: 5,
  quizScores: [85, 90, 75],
  practicalTasksCompleted: 2,
  totalPracticalTasks: 5
};

function calculateSecurityScore(metrics: SecurityMetrics): SecurityDetails {
  const weights = {
    courses: 0.4,
    quizzes: 0.4,
    practicalTasks: 0.2
  };

  // Course calculation
  const courseScore = (metrics.coursesCompleted / metrics.totalCourses) * 100;
  
  // Test calculation
  const averageQuizScore = metrics.quizScores.length > 0
    ? metrics.quizScores.reduce((a, b) => a + b, 0) / metrics.quizScores.length
    : 0;
  
  // Practical assignments calculation
  const practicalScore = (metrics.practicalTasksCompleted / metrics.totalPracticalTasks) * 100;

  // Final calculation
  const overallScore = Math.round(
    courseScore * weights.courses +
    averageQuizScore * weights.quizzes +
    practicalScore * weights.practicalTasks
  );

  return {
    overall: overallScore,
    metrics: {
      coursesProgress: Math.round(courseScore),
      quizResults: Math.round(averageQuizScore),
      practicalTasks: Math.round(practicalScore)
    }
  };
}

// Add interface for extended user metrics
export interface UserLearningMetrics extends SecurityMetrics {
  lastAccessedCourses: { [courseId: string]: Date };
  completedCategories: string[];
  preferredCategories: string[];
}

// Function to determine recommended courses
export function getRecommendedCourses(
  courses: Course[],
  metrics: UserLearningMetrics
): Course[] {
  return courses
    .filter(course => course.progress === 0) // Not started courses
    .sort((a, b) => {
      // Base score based on course level and category match
      const aScore = (a.level === 'Beginner' ? 3 : a.level === 'Intermediate' ? 2 : 1);
      const bScore = (b.level === 'Beginner' ? 3 : b.level === 'Intermediate' ? 2 : 1);
      
      // Bonus points if category matches user preferences
      const aBonus = metrics.preferredCategories.includes(a.category) ? 2 : 0;
      const bBonus = metrics.preferredCategories.includes(b.category) ? 2 : 0;
      
      return (bScore + bBonus) - (aScore + aBonus);
    })
    .slice(0, 3);
}

// Function to determine courses for continued learning
export function getContinueLearningCourses(
  courses: Course[],
  userProgress: UserProgress[]
): Course[] {
  if (!userProgress || userProgress.length === 0) {
    return [];
  }

  // Filter courses that have any progress
  return courses
    .filter(course => {
      const courseProgress = userProgress.find(p => p.course_id === course.id);
      return courseProgress && courseProgress.progress > 0 && courseProgress.progress < 100;
    })
    .sort((a, b) => {
      // Get progress for each course
      const aProgress = userProgress.find(p => p.course_id === a.id)?.progress || 0;
      const bProgress = userProgress.find(p => p.course_id === b.id)?.progress || 0;
      
      // Get last access time for each course
      const aLastAccess = userProgress.find(p => p.course_id === a.id)?.last_accessed 
        ? new Date(userProgress.find(p => p.course_id === a.id)!.last_accessed).getTime()
        : 0;
      const bLastAccess = userProgress.find(p => p.course_id === b.id)?.last_accessed
        ? new Date(userProgress.find(p => p.course_id === b.id)!.last_accessed).getTime()
        : 0;
      
      // Combined score (70% progress, 30% recency)
      const aScore = (aProgress / 100) * 0.7 + (aLastAccess / Date.now()) * 0.3;
      const bScore = (bProgress / 100) * 0.7 + (bLastAccess / Date.now()) * 0.3;
      
      return bScore - aScore;
    });
}

export function useSecurityScore() {
  const [details, setDetails] = useState<SecurityDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      const securityDetails = calculateSecurityScore(mockMetrics);
      setDetails(securityDetails);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { details, loading };
} 