import { useState, useEffect } from 'react';
import { SecurityDetails, SecurityMetrics } from '../types/security';
import type { Course } from '@/types/course';

// Временные моковые данные для тестирования
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

  // Расчет по курсам
  const courseScore = (metrics.coursesCompleted / metrics.totalCourses) * 100;
  
  // Расчет по тестам
  const averageQuizScore = metrics.quizScores.length > 0
    ? metrics.quizScores.reduce((a, b) => a + b, 0) / metrics.quizScores.length
    : 0;
  
  // Расчет по практическим заданиям
  const practicalScore = (metrics.practicalTasksCompleted / metrics.totalPracticalTasks) * 100;

  // Итоговый расчет
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

// Добавляем интерфейс для расширенных метрик пользователя
export interface UserLearningMetrics extends SecurityMetrics {
  lastAccessedCourses: { [courseId: string]: Date };
  completedCategories: string[];
  preferredCategories: string[];
}

// Функция для определения рекомендованных курсов
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

// Функция для определения курсов для продолжения обучения
export function getContinueLearningCourses(
  courses: Course[],
  metrics: UserLearningMetrics
): Course[] {
  return courses
    .filter(course => course.progress > 0 && course.progress < 100)
    .sort((a, b) => {
      // Base score based on progress
      const aProgress = a.progress / 100;
      const bProgress = b.progress / 100;
      
      // Consider last access time
      const aLastAccess = metrics.lastAccessedCourses[a.id] 
        ? new Date(metrics.lastAccessedCourses[a.id]).getTime()
        : 0;
      const bLastAccess = metrics.lastAccessedCourses[b.id]
        ? new Date(metrics.lastAccessedCourses[b.id]).getTime()
        : 0;
      
      // Combined score
      const aScore = aProgress * 0.7 + (aLastAccess / Date.now()) * 0.3;
      const bScore = bProgress * 0.7 + (bLastAccess / Date.now()) * 0.3;
      
      return bScore - aScore;
    });
}

export function useSecurityScore() {
  const [details, setDetails] = useState<SecurityDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитируем загрузку данных
    const timer = setTimeout(() => {
      const securityDetails = calculateSecurityScore(mockMetrics);
      setDetails(securityDetails);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { details, loading };
} 