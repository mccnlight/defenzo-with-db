import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Modal
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft,
  Clock,
  Award,
  CheckCircle,
  ChevronRight,
  X
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { mockCourses } from '@/app/data/mockCourses';
import { Course, Lesson } from '@/types/course';
import DialogLesson from '@/components/lessons/DialogLesson';
import CardsLesson from '@/components/lessons/CardsLesson';
import ScenarioLesson from '@/components/lessons/ScenarioLesson';
import VisualLesson from '@/components/lessons/VisualLesson';
import { useCourseStore } from '@/app/store/courseStore';

export default function CourseScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  const { courses, setCourses, updateLessonStatus } = useCourseStore();
  
  // Initialize courses on first load
  useEffect(() => {
    if (courses.length === 0) {
      setCourses(mockCourses);
    }
  }, [courses.length, setCourses]);

  const course = courses.find((c: Course) => c.id === id);

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Course not found</Text>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    if (selectedLesson) {
      setSelectedLesson(null);
      return;
    }
    router.back();
  };

  const handleLessonPress = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleLessonComplete = () => {
    if (!selectedLesson) return;
    updateLessonStatus(course.id, selectedLesson.id, true);
    setSelectedLesson(null);
  };

  const renderLessonContent = () => {
    if (!selectedLesson) return null;

    switch (selectedLesson.type) {
      case 'dialog':
        return (
          <DialogLesson
            introduction={selectedLesson.content.introduction || ''}
            questions={selectedLesson.content.questions || []}
            onComplete={handleLessonComplete}
          />
        );
      case 'cards':
        return (
          <CardsLesson
            questions={selectedLesson.content.questions || []}
            onComplete={handleLessonComplete}
          />
        );
      case 'scenario':
        return (
          <ScenarioLesson
            scenarios={selectedLesson.content.scenarios || []}
            onComplete={handleLessonComplete}
          />
        );
      case 'visual':
        if (!selectedLesson.content.visualTasks?.[0]) return null;
        return (
          <VisualLesson
            title={selectedLesson.title}
            description={selectedLesson.content.visualTasks[0].description}
            visualTasks={selectedLesson.content.visualTasks}
            onComplete={handleLessonComplete}
          />
        );
      default:
        return null;
    }
  };

  const renderTags = (tags: string[]) => {
    return tags.map((tag: string, index: number) => (
      <View key={index} style={styles.tag}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
    ));
  };

  const renderLessons = (lessons: Lesson[]) => {
    return lessons.map((lesson: Lesson, index: number) => (
      <TouchableOpacity
        key={lesson.id}
        style={styles.lessonItem}
        onPress={() => handleLessonPress(lesson)}
      >
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonNumber}>Lesson {index + 1}</Text>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <View style={styles.lessonMeta}>
            <Clock size={14} color={Colors.dark.text} />
            <Text style={styles.lessonDuration}>{lesson.duration}</Text>
          </View>
        </View>
        {lesson.completed ? (
          <CheckCircle size={20} color={Colors.dark.success} />
        ) : (
          <ChevronRight size={20} color={Colors.dark.text} />
        )}
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color={Colors.dark.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedLesson ? 'Lesson' : 'Course Details'}
        </Text>
      </View>

      {selectedLesson ? (
        <View style={styles.lessonContainer}>
          {renderLessonContent()}
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {course.image ? (
            <Image 
              source={{ uri: course.image }} 
              style={[styles.image, { width: width - 32 }]} 
            />
          ) : (
            <View style={[styles.imagePlaceholder, { width: width - 32 }]} />
          )}

          <View style={styles.courseInfo}>
            <View style={styles.levelBadge}>
              <Award size={16} color={Colors.dark.warning} />
              <Text style={styles.levelText}>{course.level}</Text>
            </View>

            <Text style={styles.title}>{course.title}</Text>
            <Text style={styles.description}>{course.description}</Text>

            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Clock size={16} color={Colors.dark.text} />
                <Text style={styles.metaText}>{course.duration}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${course.progress}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{course.progress}% Complete</Text>
            </View>

            <View style={styles.tags}>
              {renderTags(course.tags)}
            </View>
          </View>

          <View style={styles.lessonsSection}>
            <Text style={styles.sectionTitle}>Course Content</Text>
            {renderLessons(course.lessons)}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
  },
  content: {
    padding: Layout.spacing.md,
  },
  image: {
    height: 200,
    borderRadius: Layout.borderRadius.large,
    backgroundColor: Colors.dark.card,
  },
  imagePlaceholder: {
    height: 200,
    borderRadius: Layout.borderRadius.large,
    backgroundColor: Colors.dark.card,
  },
  courseInfo: {
    marginTop: Layout.spacing.lg,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.warning + '20',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Layout.borderRadius.small,
    alignSelf: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  levelText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    color: Colors.dark.warning,
    marginLeft: 4,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.7,
    marginBottom: Layout.spacing.md,
  },
  metaInfo: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  metaText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: Layout.spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.round,
    marginBottom: Layout.spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: Layout.borderRadius.round,
  },
  progressText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.xs,
    marginBottom: Layout.spacing.lg,
  },
  tag: {
    backgroundColor: Colors.dark.card,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Layout.borderRadius.small,
  },
  tagText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
  },
  lessonsSection: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.md,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonNumber: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.xs,
    color: Colors.dark.primary,
    marginBottom: 2,
  },
  lessonTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonDuration: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: Colors.dark.text,
    marginLeft: 4,
  },
  lessonContainer: {
    flex: 1,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    textAlign: 'center',
    marginTop: Layout.spacing.xl,
  },
}); 