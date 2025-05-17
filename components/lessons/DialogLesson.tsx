import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { MessageCircle, ChevronRight, Check, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { Question } from '@/types/course';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';

interface DialogLessonProps {
  introduction: string;
  questions: Question[];
  onComplete: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function DialogLesson({ 
  introduction, 
  questions, 
  onComplete 
}: DialogLessonProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    // Animate progress bar
    progress.value = withSpring(
      ((currentQuestionIndex + 1) / questions.length) * 100,
      { damping: 15 }
    );
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete();
      return;
    }

    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const isCorrectAnswer = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {currentQuestionIndex === 0 && (
        <Animated.View 
          entering={FadeIn.duration(500)}
          style={styles.introductionContainer}
        >
          <MessageCircle size={24} color={Colors.dark.primary} />
          <Text style={styles.introductionText}>{introduction}</Text>
        </Animated.View>
      )}

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>

      <Animated.View
        entering={SlideInRight.duration(300)}
        exiting={SlideOutLeft.duration(300)}
        style={styles.questionContainer}
      >
        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.type === 'multiple_choice' && 
            currentQuestion.options?.map((option, index) => (
              <AnimatedTouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && styles.selectedOption,
                  showExplanation && option === currentQuestion.correctAnswer && styles.correctOption,
                  showExplanation && selectedAnswer === option && option !== currentQuestion.correctAnswer && styles.incorrectOption
                ]}
                onPress={() => !showExplanation && handleAnswer(option)}
                disabled={showExplanation}
                entering={FadeIn.duration(300).delay(index * 100)}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswer === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
                {showExplanation && option === currentQuestion.correctAnswer && (
                  <Check size={20} color={Colors.dark.success} />
                )}
                {showExplanation && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                  <X size={20} color={Colors.dark.error} />
                )}
              </AnimatedTouchableOpacity>
            ))
          }
        </View>

        {showExplanation && (
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={[
              styles.explanationContainer,
              isCorrectAnswer ? styles.correctExplanation : styles.incorrectExplanation
            ]}
          >
            <Text style={[
              styles.explanationTitle,
              isCorrectAnswer ? styles.correctText : styles.incorrectText
            ]}>
              {isCorrectAnswer ? 'Correct!' : 'Incorrect'}
            </Text>
            <Text style={styles.explanationText}>
              {currentQuestion.explanation}
            </Text>
          </Animated.View>
        )}

        {showExplanation && (
          <AnimatedTouchableOpacity
            style={[styles.nextButton, buttonStyle]}
            onPress={handleNext}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            entering={FadeIn.duration(300)}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Complete' : 'Next Question'}
            </Text>
            <ChevronRight size={20} color={Colors.dark.text} />
          </AnimatedTouchableOpacity>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  contentContainer: {
    padding: Layout.spacing.lg,
  },
  introductionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.primary + '20',
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.large,
    marginBottom: Layout.spacing.xl,
  },
  introductionText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginLeft: Layout.spacing.md,
    lineHeight: fontSizes.md * 1.5,
  },
  progressContainer: {
    marginBottom: Layout.spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.dark.border,
    borderRadius: Layout.borderRadius.round,
    overflow: 'hidden',
    marginBottom: Layout.spacing.xs,
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
    opacity: 0.7,
  },
  questionContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
  },
  questionText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xl,
  },
  optionsContainer: {
    gap: Layout.spacing.md,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.large,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.primary + '20',
  },
  correctOption: {
    borderColor: Colors.dark.success,
    backgroundColor: Colors.dark.success + '20',
  },
  incorrectOption: {
    borderColor: Colors.dark.error,
    backgroundColor: Colors.dark.error + '20',
  },
  optionText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
  },
  selectedOptionText: {
    fontFamily: fonts.bodyBold,
  },
  explanationContainer: {
    marginTop: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.large,
  },
  correctExplanation: {
    backgroundColor: Colors.dark.success + '20',
  },
  incorrectExplanation: {
    backgroundColor: Colors.dark.error + '20',
  },
  explanationTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.lg,
    marginBottom: Layout.spacing.sm,
  },
  correctText: {
    color: Colors.dark.success,
  },
  incorrectText: {
    color: Colors.dark.error,
  },
  explanationText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    lineHeight: fontSizes.md * 1.5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.large,
    marginTop: Layout.spacing.xl,
  },
  nextButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginRight: Layout.spacing.xs,
  },
}); 