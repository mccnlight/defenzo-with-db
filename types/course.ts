export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  progress: number;
  lessons: Lesson[];
  image?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  achievements?: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'dialog' | 'cards' | 'scenario' | 'visual' | 'quiz';
  duration: string;
  content: LessonContent;
  completed?: boolean;
}

export interface LessonContent {
  introduction?: string;
  questions?: Question[];
  scenarios?: Scenario[];
  visualTasks?: VisualTask[];
  quiz?: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false';
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
}

export interface Scenario {
  id: string;
  situation: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export interface VisualTask {
  id: string;
  image: string;
  hotspots: Hotspot[];
}

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  size: number;
  title: string;
  description: string;
} 