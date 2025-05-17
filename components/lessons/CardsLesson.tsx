import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Check, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { Question } from '@/types/course';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 20;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface CardsLessonProps {
  questions: Question[];
  onComplete: () => void;
}

export default function CardsLesson({ questions, onComplete }: CardsLessonProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleSwipeComplete = (isCorrect: boolean) => {
    const currentQuestion = questions[currentIndex];
    if (isCorrect === currentQuestion.correctAnswer) {
      // Correct answer animation
      scale.value = withSpring(1.1, {}, () => {
        scale.value = withSpring(1);
      });
    }
    
    if (currentIndex === questions.length - 1) {
      runOnJS(onComplete)();
    } else {
      runOnJS(setCurrentIndex)(currentIndex + 1);
      translateX.value = 0;
      translateY.value = 0;
      rotate.value = 0;
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      scale.value = withSpring(1.05);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotate.value = (event.translationX / SCREEN_WIDTH) * 30;
    },
    onEnd: (event) => {
      scale.value = withSpring(1);
      
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        // Swipe animation
        translateX.value = withSpring(
          event.translationX > 0 ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5,
          {},
          () => {
            runOnJS(handleSwipeComplete)(event.translationX > 0);
          }
        );
      } else {
        // Reset position
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value }
      ],
    };
  });

  if (currentIndex >= questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.completedText}>All cards completed!</Text>
        <TouchableOpacity style={styles.restartButton} onPress={() => setCurrentIndex(0)}>
          <Text style={styles.restartText}>Start Over</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.card, cardStyle]}>
            <Text style={styles.questionText}>
              {questions[currentIndex].text}
            </Text>
            <View style={styles.swipeHints}>
              <View style={[styles.swipeHint, styles.swipeLeft]}>
                <X size={24} color={Colors.dark.error} />
                <Text style={[styles.hintText, styles.falseText]}>False</Text>
              </View>
              <View style={[styles.swipeHint, styles.swipeRight]}>
                <Check size={24} color={Colors.dark.success} />
                <Text style={[styles.hintText, styles.trueText]}>True</Text>
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: SCREEN_WIDTH - CARD_MARGIN * 2,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  questionText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  swipeHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.lg,
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.medium,
  },
  swipeLeft: {
    backgroundColor: Colors.dark.error + '20',
  },
  swipeRight: {
    backgroundColor: Colors.dark.success + '20',
  },
  hintText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    marginLeft: Layout.spacing.xs,
  },
  falseText: {
    color: Colors.dark.error,
  },
  trueText: {
    color: Colors.dark.success,
  },
  completedText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.lg,
  },
  restartButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.medium,
  },
  restartText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
  },
}); 