import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { AlertTriangle, MessageCircle, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { Scenario } from '@/app/data/mockCourses';

interface ScenarioLessonProps {
  scenarios: Scenario[];
  onComplete: () => void;
}

export default function ScenarioLesson({ scenarios, onComplete }: ScenarioLessonProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentScenario = scenarios[currentScenarioIndex];
  const isLastScenario = currentScenarioIndex === scenarios.length - 1;

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastScenario) {
      onComplete();
      return;
    }

    setCurrentScenarioIndex(prev => prev + 1);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const isCorrectOption = selectedOption === currentScenario.correctOption;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.scenarioContainer}>
        <View style={styles.header}>
          <AlertTriangle color={Colors.dark.warning} size={24} />
          <Text style={styles.headerText}>Сценарий {currentScenarioIndex + 1}</Text>
        </View>

        <View style={styles.situationContainer}>
          <MessageCircle color={Colors.dark.primary} size={24} />
          <Text style={styles.situationText}>{currentScenario.situation}</Text>
        </View>

        <Text style={styles.questionText}>Что вы будете делать?</Text>

        <View style={styles.optionsContainer}>
          {currentScenario.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === index && (
                  isCorrectOption 
                    ? styles.correctOption 
                    : styles.incorrectOption
                )
              ]}
              onPress={() => handleOptionSelect(index)}
              disabled={showExplanation}
            >
              <Text 
                style={[
                  styles.optionText,
                  selectedOption === index && styles.selectedOptionText
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
              styles.explanationTitle,
              isCorrectOption ? styles.correctText : styles.incorrectText
            ]}>
              {isCorrectOption ? 'Правильное решение!' : 'Неправильное решение'}
            </Text>
            <Text style={styles.explanationText}>
              {currentScenario.explanation}
            </Text>
          </View>
        )}

        {showExplanation && (
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {isLastScenario ? 'Завершить' : 'Следующий сценарий'}
            </Text>
            <ChevronRight color={Colors.dark.text} size={20} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${((currentScenarioIndex + 1) / scenarios.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentScenarioIndex + 1} из {scenarios.length}
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
  scenarioContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  headerText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: Colors.dark.text,
    marginLeft: Layout.spacing.sm,
  },
  situationContainer: {
    backgroundColor: Colors.dark.background,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  situationText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginLeft: Layout.spacing.md,
    lineHeight: 24,
  },
  questionText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.md,
  },
  optionsContainer: {
    gap: Layout.spacing.md,
  },
  optionButton: {
    backgroundColor: Colors.dark.background,
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
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
  },
  selectedOptionText: {
    fontFamily: fonts.bodyBold,
  },
  explanationContainer: {
    backgroundColor: Colors.dark.background,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.large,
    marginTop: Layout.spacing.lg,
  },
  explanationTitle: {
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
  explanationText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
    lineHeight: 24,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.large,
    marginTop: Layout.spacing.lg,
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