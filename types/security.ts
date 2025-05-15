export interface SecurityMetrics {
  coursesCompleted: number;
  totalCourses: number;
  quizScores: number[];
  practicalTasksCompleted: number;
  totalPracticalTasks: number;
}

export interface SecurityDetails {
  overall: number;
  metrics: {
    coursesProgress: number;
    quizResults: number;
    practicalTasks: number;
  };
}

export interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: {
    type: 'course' | 'setting' | 'check';
    target: string;
  };
  impact: number;
} 