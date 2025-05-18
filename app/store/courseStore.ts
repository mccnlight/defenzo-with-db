import { create } from 'zustand';
import type { Course } from '@/types/course';
import axios from 'axios';
import { BASE_URL } from '@/app/services/api';

interface CourseStore {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  fetchCourses: () => Promise<void>;
  fetchCourseById: (id: string) => Promise<Course | undefined>;
  updateCourseProgress: (courseId: string, progress: number) => void;
  updateLessonStatus: (courseId: string, lessonId: string, completed: boolean) => void;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  setCourses: (courses: Course[]) => set({ courses }),
  fetchCourses: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/courses`);
      const courses = res.data.map((c: any) => ({
        ...c,
        tags: typeof c.tags === 'string' ? JSON.parse(c.tags) : c.tags,
      }));
      set({ courses });
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  },
  fetchCourseById: async (id: string) => {
    try {
      const url = `${BASE_URL}/api/courses/${id}`;
      console.log('Fetching course:', url);
      const res = await axios.get(url);
      const course = res.data;
      console.log('Course response:', course);
      if (!course || !Array.isArray(course.lessons)) {
        console.error('Course data is invalid or lessons missing:', course);
        return undefined;
      }
      console.log('Lessons:', course.lessons);
      course.tags = typeof course.tags === 'string' ? JSON.parse(course.tags) : course.tags;
      course.lessons = course.lessons.map((l: any) => ({
        ...l,
        content: typeof l.content === 'string' ? JSON.parse(l.content) : l.content,
      }));
      return course as Course;
    } catch (err) {
      console.error('Failed to fetch course', err);
      return undefined;
    }
  },
  updateCourseProgress: (courseId: string, progress: number) => 
    set((state) => ({
      courses: state.courses.map((course) =>
        course.id === courseId ? { ...course, progress } : course
      ),
    })),
  updateLessonStatus: (courseId: string, lessonId: string, completed: boolean) =>
    set((state) => ({
      courses: state.courses.map((course) => {
        if (course.id !== courseId) return course;
        // Defensive: ensure lessons is an array
        const lessons = Array.isArray(course.lessons) ? course.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, completed } : lesson
        ) : [];
        const totalLessons = lessons.length;
        const completedLessons = lessons.filter((l) => l.completed).length;
        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        return {
          ...course,
          lessons,
          progress,
        };
      }),
    })),
})); 