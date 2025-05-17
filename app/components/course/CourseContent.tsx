import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { 
  ChevronRight, 
  Clock, 
  CheckCircle2,
  LockKeyhole,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { Course, Lesson } from '@/types/course';
import Animated, {
  FadeIn,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface CourseContentProps {
  course: Course;
  onSelectLesson: (lesson: Lesson) => void;
}

export default function CourseContent({ course, onSelectLesson }: CourseContentProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        entering={FadeIn.duration(300)}
        style={styles.header}
      >
        <Text style={styles.title}>Course Content</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Clock size={16} color={Colors.dark.text} />
            <Text style={styles.statText}>{course.duration}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statText}>{course.lessons.length} lessons</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.lessonList}>
        {course.lessons.map((lesson, index) => (
          <Animated.View
            key={lesson.id}
            entering={FadeInRight.duration(300).delay(index * 100)}
          >
            <AnimatedTouchableOpacity
              style={[styles.lessonCard, buttonStyle]}
              onPress={() => onSelectLesson(lesson)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <View style={styles.lessonInfo}>
                <View style={styles.lessonHeader}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  {lesson.completed ? (
                    <CheckCircle2 size={20} color={Colors.dark.success} />
                  ) : (
                    <ChevronRight size={20} color={Colors.dark.text} />
                  )}
                </View>
                <View style={styles.lessonMeta}>
                  <View style={styles.lessonType}>
                    <Text style={styles.lessonTypeText}>
                      {getLessonTypeLabel(lesson.type)}
                    </Text>
                  </View>
                  <View style={styles.lessonDuration}>
                    <Clock size={14} color={Colors.dark.text} style={styles.lessonIcon} />
                    <Text style={styles.lessonDurationText}>{lesson.duration}</Text>
                  </View>
                </View>
              </View>
            </AnimatedTouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

function getLessonTypeLabel(type: string): string {
  switch (type) {
    case 'dialog':
      return 'Interactive Dialog';
    case 'cards':
      return 'Flashcards';
    case 'scenario':
      return 'Real-world Scenario';
    case 'visual':
      return 'Visual Exercise';
    default:
      return 'Lesson';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    padding: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  statText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
  lessonList: {
    padding: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
  lessonCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
  },
  lessonInfo: {
    gap: Layout.spacing.md,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonTitle: {
    flex: 1,
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginRight: Layout.spacing.sm,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  lessonType: {
    backgroundColor: Colors.dark.primary + '20',
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.round,
  },
  lessonTypeText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    color: Colors.dark.primary,
  },
  lessonDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  lessonIcon: {
    opacity: 0.7,
  },
  lessonDurationText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
  },
}); 