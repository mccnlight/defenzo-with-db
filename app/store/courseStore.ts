import { create } from 'zustand';
import { Course } from '@/app/data/mockCourses';

interface CourseStore {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  updateLessonStatus: (courseId: string, lessonId: string, completed: boolean) => void;
}

type State = {
  courses: Course[];
};

type Actions = {
  setCourses: (courses: Course[]) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  updateLessonStatus: (courseId: string, lessonId: string, completed: boolean) => void;
};

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  setCourses: (courses: Course[]) => set({ courses }),
  updateCourseProgress: (courseId: string, progress: number) => 
    set((state: State) => ({
      courses: state.courses.map((course: Course) =>
        course.id === courseId ? { ...course, progress } : course
      ),
    })),
  updateLessonStatus: (courseId: string, lessonId: string, completed: boolean) =>
    set((state: State) => ({
      courses: state.courses.map((course: Course) => {
        if (course.id !== courseId) return course;
        
        const lessons = course.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, completed } : lesson
        );
        
        const totalLessons = lessons.length;
        const completedLessons = lessons.filter((l) => l.completed).length;
        const progress = Math.round((completedLessons / totalLessons) * 100);
        
        return {
          ...course,
          lessons,
          progress,
        };
      }),
    })),
})); 