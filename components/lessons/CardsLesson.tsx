import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';
import { Check, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { fonts, fontSizes } from '@/constants/Fonts';
import { Question } from '@/app/data/mockCourses';

interface CardsLessonProps {
  questions: Question[];
  onComplete: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default function CardsLesson({ questions, onComplete }: CardsLessonProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const [isFlipped, setIsFlipped] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      }
    })
  ).current;

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left') => {
    const item = questions[currentIndex];
    const isCorrect = direction === 'right';

    position.setValue({ x: 0, y: 0 });
    setIsFlipped(false);
    setCurrentIndex(index => index + 1);

    if (currentIndex === questions.length - 1) {
      onComplete();
    }
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    Animated.spring(rotateAnim, {
      toValue: isFlipped ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  if (currentIndex >= questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.completeText}>Все карточки пройдены!</Text>
      </View>
    );
  }

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-30deg', '0deg', '30deg']
  });

  const flipRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: [1, 0.8, 1]
  });

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { rotate },
      { rotateY: flipRotate }
    ]
  };

  const nextCardStyle = {
    transform: [{ scale: nextCardScale }]
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progressText}>
          {currentIndex + 1} из {questions.length}
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {currentIndex < questions.length - 1 && (
          <Animated.View 
            style={[styles.card, styles.nextCard, nextCardStyle]}
          >
            <Text style={styles.cardText}>
              {questions[currentIndex + 1].text}
            </Text>
          </Animated.View>
        )}

        <Animated.View
          style={[styles.card, cardStyle]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity 
            style={styles.cardContent} 
            onPress={handleFlip}
            activeOpacity={0.9}
          >
            <Text style={styles.cardText}>
              {isFlipped 
                ? questions[currentIndex].explanation 
                : questions[currentIndex].text}
            </Text>
            <Text style={styles.flipHint}>
              Нажмите, чтобы {isFlipped ? 'скрыть' : 'показать'} объяснение
            </Text>
          </TouchableOpacity>

          <View style={styles.swipeHints}>
            <View style={[styles.swipeHint, styles.swipeLeft]}>
              <X color={Colors.dark.error} size={24} />
              <Text style={[styles.swipeHintText, styles.swipeLeftText]}>
                Неверно
              </Text>
            </View>
            <View style={[styles.swipeHint, styles.swipeRight]}>
              <Check color={Colors.dark.success} size={24} />
              <Text style={[styles.swipeHintText, styles.swipeRightText]}>
                Верно
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${(currentIndex / questions.length) * 100}%` }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    padding: Layout.spacing.lg,
    alignItems: 'center',
  },
  progressText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.md,
    color: Colors.dark.text,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
    height: 400,
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextCard: {
    backgroundColor: Colors.dark.card + '80',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    textAlign: 'center',
  },
  flipHint: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: Colors.dark.text,
    opacity: 0.7,
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
  },
  swipeHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: Layout.spacing.lg,
    right: Layout.spacing.lg,
    bottom: Layout.spacing.lg,
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.7,
  },
  swipeLeft: {
    marginRight: 'auto',
  },
  swipeRight: {
    marginLeft: 'auto',
  },
  swipeHintText: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.sm,
    marginLeft: Layout.spacing.xs,
  },
  swipeLeftText: {
    color: Colors.dark.error,
  },
  swipeRightText: {
    color: Colors.dark.success,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.dark.card,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: Layout.borderRadius.round,
  },
  completeText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: Colors.dark.text,
    textAlign: 'center',
    marginTop: Layout.spacing.xl,
  },
}); 