import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Animated
} from 'react-native';
import { MessageCircle, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { Question } from '@/app/data/mockCourses';

interface DialogLessonProps {
  introduction: string;
  questions: Question[];
  onComplete: () => void;
}

export default function DialogLesson({ 
  introduction, 
  questions, 
  onComplete 
}: DialogLessonProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete();
      return;
    }

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const isCorrectAnswer = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {currentQuestionIndex === 0 && (
        <View style={styles.introContainer}>
          <MessageCircle color={Colors.dark.primary} size={32} />
          <Text style={styles.introText}>{introduction}</Text>
        </View>
      )}

      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === option && (
                  isCorrectAnswer 
                    ? styles.correctOption 
                    : styles.incorrectOption
                )
              ]}
              onPress={() => handleAnswer(option)}
              disabled={showExplanation}
            >
              <Text 
                style={[
                  styles.optionText,
                  selectedAnswer === option && styles.selectedOptionText
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {showExplanation && (
          <View style={styles.explanationContainer}>
            <Text style={[
              styles.explanationText,
              isCorrectAnswer ? styles.correctText : styles.incorrectText
            ]}>
              {isCorrectAnswer ? 'Правильно!' : 'Попробуйте еще раз'}
            </Text>
            <Text style={styles.explanationDetails}>
              {currentQuestion.explanation}
            </Text>
          </View>
        )}
      </Animated.View>

      {showExplanation && (
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? 'Завершить' : 'Следующий вопрос'}
          </Text>
          <ChevronRight color={Colors.dark.text} size={20} />
        </TouchableOpacity>
      )}

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} из {questions.length}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: Layout.spacing.lg,
  },
  introContainer: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  introText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    textAlign: 'center',
    marginTop: Layout.spacing.md,
  },
  questionContainer: {
    marginBottom: Layout.spacing.xl,
  },
  questionText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.lg,
  },
  optionsContainer: {
    gap: Layout.spacing.md,
  },
  optionButton: {
    backgroundColor: Colors.dark.card,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.large,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  correctOption: {
    backgroundColor: Colors.dark.success + '20',
    borderColor: Colors.dark.success,
  },
  incorrectOption: {
    backgroundColor: Colors.dark.error + '20',
    borderColor: Colors.dark.error,
  },
  optionText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
  },
  selectedOptionText: {
    fontFamily: fonts.bodyBold,
  },
  explanationContainer: {
    backgroundColor: Colors.dark.card,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.large,
    marginTop: Layout.spacing.lg,
  },
  explanationText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    marginBottom: Layout.spacing.sm,
  },
  correctText: {
    color: Colors.dark.success,
  },
  incorrectText: {
    color: Colors.dark.error,
  },
  explanationDetails: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    opacity: 0.8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.large,
    marginBottom: Layout.spacing.xl,
  },
  nextButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginRight: Layout.spacing.xs,
  },
  progressContainer: {
    marginTop: 'auto',
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
    textAlign: 'center',
  },
}); 