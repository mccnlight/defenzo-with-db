import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { 
  ArrowLeft,
  Clock,
  LayoutGrid,
  MessageSquare,
  Layers,
  Target,
  Eye,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { Lesson } from '@/types/course';
import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import CardsLesson from '@/components/lessons/CardsLesson';
import DialogLesson from '@/components/lessons/DialogLesson';
import VisualLesson from '@/components/lessons/VisualLesson';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface LessonContentProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: () => void;
}

export default function LessonContent({ 
  lesson, 
  onBack,
  onComplete,
}: LessonContentProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderLessonIcon = () => {
    const iconProps = { size: 20, color: Colors.dark.text };
    switch (lesson.type) {
      case 'cards':
        return <Layers {...iconProps} />;
      case 'dialog':
        return <MessageSquare {...iconProps} />;
      case 'scenario':
        return <Target {...iconProps} />;
      case 'visual':
        return <Eye {...iconProps} />;
      default:
        return <LayoutGrid {...iconProps} />;
    }
  };

  const renderLessonContent = () => {
    if (!lesson.content) return null;

    switch (lesson.type) {
      case 'cards':
        if (!lesson.content.questions) return null;
        return (
          <CardsLesson
            questions={lesson.content.questions}
            onComplete={onComplete}
          />
        );
      case 'dialog':
        if (!lesson.content.introduction || !lesson.content.questions) return null;
        return (
          <DialogLesson
            introduction={lesson.content.introduction}
            questions={lesson.content.questions}
            onComplete={onComplete}
          />
        );
      case 'visual':
        if (!lesson.content.visualTasks) return null;
        const firstTask = lesson.content.visualTasks[0];
        if (!firstTask) return null;
        return (
          <VisualLesson
            title={firstTask.title}
            description={firstTask.description}
            visualTasks={lesson.content.visualTasks}
            onComplete={onComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        entering={FadeIn.duration(300)}
        style={styles.header}
      >
        <AnimatedTouchableOpacity
          style={[styles.backButton, buttonStyle]}
          onPress={onBack}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <ArrowLeft size={24} color={Colors.dark.text} />
        </AnimatedTouchableOpacity>

        <View style={styles.lessonInfo}>
          <View style={styles.lessonType}>
            {renderLessonIcon()}
            <Text style={styles.lessonTypeText}>
              {getLessonTypeLabel(lesson.type)}
            </Text>
          </View>
          <View style={styles.lessonDuration}>
            <Clock size={16} color={Colors.dark.text} style={styles.lessonIcon} />
            <Text style={styles.lessonDurationText}>{lesson.duration}</Text>
          </View>
        </View>

        <Animated.View
          entering={SlideInRight.duration(300)}
          style={styles.titleContainer}
        >
          <Text style={styles.title}>{lesson.title}</Text>
        </Animated.View>
      </Animated.View>

      <View style={styles.content}>
        {renderLessonContent()}
      </View>
    </View>
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
    gap: Layout.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  lessonType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
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
  titleContainer: {
    marginTop: Layout.spacing.sm,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    lineHeight: fontSizes.xl * 1.4,
  },
  content: {
    flex: 1,
  },
}); 