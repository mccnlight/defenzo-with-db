export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  progress: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  image: string;
  rating: number;
  learners: number;
  recommended: boolean;
  achievements: Achievement[];
  lessons: Lesson[];
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
  type: 'dialog' | 'cards' | 'scenario' | 'chat_simulation';
  duration: string;
  content: LessonContent;
  completed: boolean;
}

export interface LessonContent {
  introduction?: string;
  questions?: Question[];
  scenarios?: Scenario[];
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