import { create } from 'zustand';
import type { Course } from '@/types/course';
import axios from 'axios';
import { BASE_URL } from '@/app/services/api';
import { getProfile } from '@/app/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProgress {
  course_id: string;
  lesson_id: string;
  completed: boolean;
  progress: number;
  last_accessed: string;
}

interface CourseStore {
  courses: Course[];
  userProgress: UserProgress[];
  setCourses: (courses: Course[]) => void;
  fetchCourses: () => Promise<void>;
  fetchCourseById: (id: string) => Promise<Course | undefined>;
  fetchUserProgress: () => Promise<void>;
  updateUserProgress: (courseId: string, lessonId: string, completed: boolean, progress: number) => Promise<void>;
  updateCourseProgress: (courseId: string, progress: number) => void;
  updateLessonStatus: (courseId: string, lessonId: string, completed: boolean) => void;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  userProgress: [],
  setCourses: (courses: Course[]) => set({ courses }),
  fetchCourses: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/courses`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
      const token = await AsyncStorage.getItem('token');
      const url = `${BASE_URL}/api/courses/${id}`;
      console.log('Fetching course:', url);
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
  fetchUserProgress: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/user/progress`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ userProgress: res.data });
    } catch (err) {
      console.error('Failed to fetch user progress', err);
    }
  },
  updateUserProgress: async (courseId, lessonId, completed, progress) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Updating progress:', { courseId, lessonId, completed, progress });
      await axios.post(`${BASE_URL}/api/user/progress`, {
        course_id: courseId,
        lesson_id: lessonId,
        completed,
        progress,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Optionally, re-fetch progress
      get().fetchUserProgress();
      // Also re-fetch courses to update progress bars
      get().fetchCourses();
    } catch (err) {
      console.error('Failed to update user progress:', err);
    }
  },
  updateCourseProgress: (courseId: string, progress: number) =>
    set((state) => ({
      courses: state.courses.map((course) =>
        course.id === courseId ? { ...course, progress } : course
      ),
    })),
  updateLessonStatus: (courseId: string, lessonId: string, completed: boolean) =>
    set((state) => {
      const { courses, updateUserProgress } = get();
      const updatedCourses = courses.map((course) => {
        if (course.id !== courseId) return course;
        const lessons = Array.isArray(course.lessons) ? course.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, completed } : lesson
        ) : [];
        const totalLessons = lessons.length;
        const completedLessons = lessons.filter((l) => l.completed).length;
        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        // Update user progress in backend
        updateUserProgress(courseId, lessonId, completed, progress);
        return {
          ...course,
          lessons,
        };
      });
      return { courses: updatedCourses };
    }),
})); 